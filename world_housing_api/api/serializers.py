from rest_framework.serializers import (
    ModelSerializer,
    Serializer,
    SerializerMethodField
)
from .models import (
    Country,
    CountryState,
    HousingData
)


class HousingDataStatsSerializer(ModelSerializer):
    class Meta:
        model = HousingData
        fields = ['square_meter_price', 'variation']


class HousingDataStatsDateSerializer(ModelSerializer):
    class Meta:
        model = HousingData
        fields = ['square_meter_price', 'variation', 'year', 'month']


class CountryStateSerializer(ModelSerializer):
    class Meta:
        model = CountryState
        fields = ['name', 'abbreviation']


class CountrySerializer(ModelSerializer):
    states = CountryStateSerializer(read_only=True, many=True)
    class Meta:
        model = Country
        fields = ['name', 'base_uri', 'states']


class HousingDataRangeSerializer(Serializer):
    variation = SerializerMethodField()
    monthly = SerializerMethodField()

    def get_variation(self, obj):
        res = 1.0
        for housing_data in obj:
            res *= 1 + float(housing_data.variation)
        return res - 1

    def get_monthly(self, obj):
        return [
            HousingDataStatsDateSerializer(entry).data for entry in obj
        ]
