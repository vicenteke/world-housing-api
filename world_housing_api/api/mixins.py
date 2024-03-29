from datetime import (
    datetime,
    timedelta
)
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from .models import (
    Country,
    CountryState,
    HousingData
)
from .utils import convert_to_dolar


class HousingDataMixin:
    """Mixin with methods to retrieve housing data from DB,
    remote or any (DB-first).
    """
    COUNTRY = 'undefined'
    def get_housing_data_from_remote(
            self,
            year: int,
            month: int,
            final_year: int = None,
            final_month: int = None,
            states: list = []):
        """This method must be overriden for each country.
        It should retrieve new housing data and return it as in the example:

        [
            {
                "year": int,
                "month": int,
                "square_meter_price": float,
                "variation": float,
                "state_id": CountryState.id | null
            },
            ...
        ]

        In case of error, an error can be raised or a falsey value is returned.
        """
        raise NotImplementedError(
            "get_housing_data_from_remote() must be implemented"
        )


    def retrieve(self, request, *args, is_range: bool = False, **kwargs):
        states = kwargs.get('states')
        if states is not None:
            states = states.lower().split('-')
        instances = self.get_housing_data(
            year=kwargs.get('year'),
            month=kwargs.get('month'),
            final_year=kwargs.get('final_year'),
            final_month=kwargs.get('final_month'),
            states=states,
        )
        if isinstance(instances, Response):
            return instances
        if not instances:
            return Response(
                'Housing data not found',
                status.HTTP_404_NOT_FOUND
            )
        if not is_range:
            instances = instances[0]
        serializer = self.get_serializer(instances)
        return Response(serializer.data)


    def get_housing_data_from_db(
            self,
            year: int,
            month: int,
            final_year: int = None,
            final_month: int = None,
            states: list = []):
        """Retrieve queryset for all values matching parameters."""
        states_filter = Q(state_id__isnull=True)
        if states:
            states_filter = Q(state__abbreviation__in=states)
        if final_year is None or final_month is None:
            return HousingData.objects.filter(
                    country__base_uri=self.COUNTRY, year=year, month=month
                ).filter(states_filter).order_by('state')

        date_range_filter = Q(
                year=year, month__gte=month
            ) | Q(
                year__gt=year, year__lt=final_year
            ) | Q(
                year=final_year, month__lte=final_month
            )
        return HousingData.objects.filter(country__base_uri=self.COUNTRY)\
            .filter(date_range_filter).filter(states_filter)\
            .order_by('state', 'year', 'month')

    @staticmethod
    def get_requested_entries(
            year: int,
            month: int,
            final_year: int = None,
            final_month: int = None,
            states: list = []):
        """Returns a list with all the requested data, so we can determine what
        has not been found in the DB.
        """
        requested_entries = [{"year": year, "month": month}]
        if final_year is not None and final_month is not None:
            year_count = year
            month_count = month + 1
            while year_count < final_year or month_count <= final_month:
                if month_count >= 13:
                    year_count += 1
                    month_count = 1
                requested_entries.append({
                    "year": year_count,
                    "month": month_count
                })
                month_count += 1
        if states:
            new_requested_entries = []
            for state in states:
                for entry in requested_entries:
                    new_requested_entries.append({
                        **entry,
                        "state": state
                    })
            requested_entries = new_requested_entries

        return requested_entries

    @staticmethod
    def convert_to_dolar_on_month(
            currency: str,
            value: float | int,
            year: int, month: int):
        """Takes a year-month pair and passes a date to
        utils.convert_to_dolar().
        """
        today = datetime.today()
        if month == 12:
            month = 0
            year += 1

        # use last day of month
        currency_date = datetime(
            year=year, month=month + 1, day=1) - timedelta(days=1)

        if currency_date > today:
            currency_date = today

        return convert_to_dolar(currency, value, currency_date)

    def get_housing_data(
            self,
            year: int,
            month: int,
            final_year: int = None,
            final_month: int = None,
            states: list = [],
            get_individual_remote: bool = False):
        """Tries to get data from DB (see get_housing_data_from_db()). For
        each entry not found, tries to get from remote, stores the remote
        values and returns all the data found.

        NOTE: entries not found are simply not returned.
        """
        if month > 12 or month < 1 or (
                final_month is not None and
                (final_month > 12 or final_month < 1)):
            return Response(
                'Invalid month values',
                status=status.HTTP_400_BAD_REQUEST
            )

        if final_year is not None and final_month is not None\
                and final_year < year\
                or (year == final_year and final_month < month):
            return Response(
                'End time must be less than or equal to start time',
                status=status.HTTP_400_BAD_REQUEST
            )

        requested_entries = HousingDataMixin.get_requested_entries(
            year=year, month=month, final_year=final_year,
            final_month=final_month, states=states)

        # get DB entries
        db_entries = self.get_housing_data_from_db(
            year,
            month,
            final_year,
            final_month,
            states
        )

        if len(db_entries) == len(requested_entries):
            # assume all entries were found in the DB
            return db_entries

        entries_from_remote = []
        new_db_entries = []
        if get_individual_remote:
            new_db_entries = db_entries
            # check entries to get from remote
            for entry in requested_entries:
                state = entry.get('state')
                for db_entry in db_entries:
                    if db_entry.year == entry['year'] and\
                            db_entry.month == entry['month'] and\
                            (state is None or db_entry.state == state):
                        break
                else:
                    remote_res = self.get_housing_data_from_remote(
                        year=entry['year'],
                        month=entry['month'],
                        states=[state]
                    )
                    if len(remote_res) > 1:
                        raise Exception(
                            f'get_housing_data_from_remote() for {self.COUNTRY} '
                            'returned multiple results when only one expected'
                        )
                    if remote_res:
                        entries_from_remote.append(remote_res[0])
        else:
            entries_from_remote = self.get_housing_data_from_remote(
                year=year,
                month=month,
                final_year=final_year,
                final_month=final_month,
                states=states
            )

        for entry in entries_from_remote:
            new_entry = HousingData(
                country=Country.objects.get(base_uri=self.COUNTRY),
                **entry
            )
            new_db_entries.append(new_entry)
            new_entry.save()

        return new_db_entries


    def get_state_id_from_abbreviation(self, abbreviation: str):
        """Returns CountryState.id from abbreviation"""
        entry = CountryState.objects.only('id').filter(
                country__base_uri=self.COUNTRY,
                abbreviation=abbreviation
            ).get()
        return entry.id
