from rest_framework.generics import ListAPIView
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import (
    Country,
    CountryState
)
from .serializers import (
    CountrySerializer,
    CountryStateSerializer
)


class CountryView(ListAPIView):
    """List all countries"""
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class CountryStateView(ListAPIView):
    """List all states for a certain country"""
    queryset = CountryState.objects.all()
    serializer_class = CountryStateSerializer

    def list(self, request, *args, **kwargs):
        # get country states and set self.queryset
        country_name = kwargs.get('country')
        if not country_name:
            return Response('Country not provided', HTTP_400_BAD_REQUEST)
        country = get_object_or_404(Country, base_uri=country_name)
        self.queryset = country.states.all()

        # proceed with behaviour from ListAPIView
        return super().list(request, *args, **kwargs)
