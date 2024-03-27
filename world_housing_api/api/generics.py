from rest_framework.response import Response
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView
)
from .models import HousingData
from .serializers import HousingDataStatsSerializer
from .mixins import HousingDataMixin


class RetrieveHousingDataAPIView(HousingDataMixin, RetrieveAPIView):
    queryset = HousingData.objects.all()
    serializer_class = HousingDataStatsSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_housing_data(
            year=kwargs.get('year'),
            month=kwargs.get('month')
        )
        if isinstance(instance, Response):
            return instance
        serializer = self.get_serializer(instance[0])
        return Response(serializer.data)


class ListHousingDataAPIView(HousingDataMixin, ListAPIView):
    queryset = HousingData.objects.all()
    serializer_class = HousingDataStatsSerializer   # TODO: change serializer

    def list(self, request, *args, **kwargs):
        instances = self.get_housing_data(
            year=kwargs.get('year'),
            month=kwargs.get('month'),
            final_year=kwargs.get('final_year'),
            final_month=kwargs.get('final_month'),
            states=kwargs.get('states'),
        )
        if isinstance(instances, Response):
            return instances
        self.queryset = instances
        return super().list(request, *args, **kwargs)
