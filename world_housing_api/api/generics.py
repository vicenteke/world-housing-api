from rest_framework.generics import RetrieveAPIView
from .models import HousingData
from .serializers import (
    HousingDataRangeSerializer,
    HousingDateStatesSerializer,
    HousingDataValuesSerializer,
    HousingDateStatesRangeSerializer,
)
from .mixins import HousingDataMixin


class RetrieveHousingDataAPIView(HousingDataMixin, RetrieveAPIView):
    queryset = HousingData.objects.all()
    serializer_class = HousingDataValuesSerializer


class RetrieveHousingDataRangeAPIView(HousingDataMixin, RetrieveAPIView):
    queryset = HousingData.objects.all()
    serializer_class = HousingDataRangeSerializer

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(
            request, *args, is_range=True, **kwargs)


class RetrieveHousingDataStatesAPIView(HousingDataMixin, RetrieveAPIView):
    queryset = HousingData.objects.all()
    serializer_class = HousingDateStatesSerializer

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(
            request, *args, is_range=True, **kwargs)


class RetrieveHousingDataStatesRangeAPIView(HousingDataMixin, RetrieveAPIView):
    queryset = HousingData.objects.all()
    serializer_class = HousingDateStatesRangeSerializer

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(
            request, *args, is_range=True, **kwargs)
