from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from .models import HousingData

class HousingDataMixin:
    def get_housing_data_from_db(
            self,
            country: str,
            year: int,
            month: int,
            final_year: int = None,
            final_month: int = None,
            states: list = []):
        """Retrieve queryset for all values matching parameters"""
        states_filter = Q(state_id__isnull=True)
        if states:
            states_filter = Q(state__abbreviation__in=states)
        if final_year is None or final_month is None:
            return HousingData.objects.filter(
                    country__base_uri=country, year=year, month=month
                ).filter(states_filter)
        
        date_range_filter = Q(
                year=year, month__gte=month
            ) | Q(
                year__gt=year, year__lt=final_year
            ) | Q(
                year=final_year, month__lte=final_month
            )
        return HousingData.objects.filter(country__base_uri=country)\
            .filter(date_range_filter).filter(states_filter)
    
    def get_housing_data_from_remote(
            self,
            country: str,
            year: int,
            month: int,
            final_year: int = None,
            final_month: int = None,
            states: list = []):
        """This method must be overriden for each country.
        It should retrieve new housing data and return it as in the example:

        [
            {
                "year": month,
                "month": int,
                "square_meter_price": float,
                "variation": float,
                "state": string (abbreviation) | null
            },
            ...
        ]
        """
        raise NotImplementedError("get_housing_data_from_remote() must be implemented")

    def get_housing_data(
            self,
            country: str,
            year: int,
            month: int,
            final_year: int = None,
            final_month: int = None,
            states: list = []):
        """Tries to get data from DB (see get_housing_data_from_db()). For
        each entry not found, tries to get from remote, stores the remote
        values and returns all the data found.

        NOTE: entries not found are simply not returned.
        """
        if month > 12 or month < 1 or (
                final_month is not None and
                final_month > 12 or final_month < 1):
            return Response(
                'Invalid month values',
                status=status.HTTP_400_BAD_REQUEST
            )

        if final_year < year or (year == final_year and final_month < month):
            return Response(
                'End time must be less than or equal to start time',
                status=status.HTTP_400_BAD_REQUEST
            )

        # create a list with all the requested data, so we can determine what
        # has not been found in the DB
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

        # get DB entries
        db_entries = self.get_housing_data_from_db(
            country,
            year,
            month,
            final_year,
            final_month,
            states
        )

        if len(db_entries) == len(requested_entries):
            # all entries found in the DB
            return db_entries

        # check entries to get from remote
        entries_to_get_from_remote = []
        for entry in requested_entries:
            state = entry.get('state')
            for db_entry in db_entries:
                if db_entry.year == entry['year'] and\
                        db_entry.month == entry['month'] and\
                        (state is None or db_entry.state == state):
                    break
            else:
               entries_to_get_from_remote.append(entry)
        
        # TODO: get from remote, save and return response
