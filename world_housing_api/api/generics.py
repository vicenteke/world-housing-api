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

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(
            request, *args, is_single_entry=True, **kwargs)


class RetrieveHousingDataRangeAPIView(HousingDataMixin, RetrieveAPIView):
    queryset = HousingData.objects.all()
    serializer_class = HousingDataRangeSerializer


class RetrieveHousingDataStatesAPIView(HousingDataMixin, RetrieveAPIView):
    queryset = HousingData.objects.all()
    serializer_class = HousingDateStatesSerializer


class RetrieveHousingDataStatesRangeAPIView(HousingDataMixin, RetrieveAPIView):
    queryset = HousingData.objects.all()
    serializer_class = HousingDateStatesRangeSerializer
