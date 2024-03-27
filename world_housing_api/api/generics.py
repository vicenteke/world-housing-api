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


