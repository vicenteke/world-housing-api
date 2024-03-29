from api.generics import (
    RetrieveHousingDataAPIView,
    RetrieveHousingDataRangeAPIView,
    RetrieveHousingDataStatesAPIView,
)
from .mixins import BrazilHousingDataMixin


class RetrieveBrazilHousingData(BrazilHousingDataMixin,
                                RetrieveHousingDataAPIView):
    pass


class RetrieveBrazilHousingDataRange(BrazilHousingDataMixin,
                                     RetrieveHousingDataRangeAPIView):
    pass


class RetrieveBrazilHousingDataStates(BrazilHousingDataMixin,
                                      RetrieveHousingDataStatesAPIView):
    pass
