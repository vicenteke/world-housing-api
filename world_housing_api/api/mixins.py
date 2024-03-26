from django.db.models import Q
from .models import HousingData

class HousingDataMixin:
    def get_housing_data(
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
