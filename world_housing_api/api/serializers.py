from rest_framework.serializers import ModelSerializer
from .models import Country, CountryState, HousingData


class HousingDataStatsSerializer(ModelSerializer):
    class Meta:
        model = HousingData
        fields = ['square_meter_price', 'variation']


class CountryStateSerializer(ModelSerializer):
    class Meta:
        model = CountryState
        fields = ['name', 'abbreviation']


class CountrySerializer(ModelSerializer):
    states = CountryStateSerializer(read_only=True, many=True)
    class Meta:
        model = Country
        fields = ['name', 'base_uri', 'states']
