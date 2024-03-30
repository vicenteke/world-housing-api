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


class HousingDataValuesSerializer(ModelSerializer):
    class Meta:
        model = HousingData
        fields = ['square_meter_price', 'variation']


class HousingDataValuesDateSerializer(ModelSerializer):
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
            HousingDataValuesDateSerializer(entry).data for entry in obj
        ]


class HousingDateMonthlySerializer(Serializer):
    def to_representation(self, obj):
        res = {}
        for entry in obj:
            if entry.state.abbreviation not in res:
                res[entry.state.abbreviation] = {}
            res[entry.state.abbreviation][f'{entry.month}/{entry.year}'] =\
                HousingDataValuesSerializer(entry).data
        return res


class HousingDateStatesSerializer(Serializer):
    def to_representation(self, obj):
        res = {}
        for entry in obj:
            res[entry.state.abbreviation] = HousingDataValuesSerializer(entry).data
        return res
