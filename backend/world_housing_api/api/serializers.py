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
        return {
            f'{"{:02d}".format(entry.month)}/{entry.year}':
            HousingDataValuesSerializer(entry).data
            for entry in obj
        }


class HousingDateStatesSerializer(Serializer):
    def to_representation(self, obj):
        res = {}
        for entry in obj:
            res[entry.state.abbreviation] = HousingDataValuesSerializer(entry).data
        return res


class HousingDateStatesRangeSerializer(Serializer):
    def to_representation(self, obj):
        state_data = {}
        for entry in obj:
            if entry.state.abbreviation not in state_data:
                state_data[entry.state.abbreviation] = []
            state_data[entry.state.abbreviation].append(entry)

        res = {}
        for state, state_entries in state_data.items():
            res[state] = HousingDataRangeSerializer(state_entries).data
        return res
