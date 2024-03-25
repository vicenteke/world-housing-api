from rest_framework.generics import ListAPIView
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Country, CountryState
from .serializers import CountrySerializer, CountryStateSerializer


class CountryView(ListAPIView):
    """List all countries"""
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class CountryStateView(ListAPIView):
    """List all states for a certain country"""
    queryset = CountryState.objects.all()
    serializer_class = CountryStateSerializer

    def list(self, request, *args, **kwargs):
        # get country states
        country_name = kwargs.get('country')
        if not country_name:
            return Response('Country not provided', HTTP_400_BAD_REQUEST)
        country = get_object_or_404(Country, base_uri=country_name)
        country_states = country.states.all()

        # proceed with behaviour from ListAPIView
        queryset = self.filter_queryset(country_states)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
