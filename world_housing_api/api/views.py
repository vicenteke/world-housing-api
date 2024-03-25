from rest_framework.generics import GenericAPIView, ListAPIView
from .models import Country
from .serializers import CountrySerializer


class CountryView(ListAPIView, GenericAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
