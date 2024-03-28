from api.generics import (
    RetrieveHousingDataAPIView,
    RetrieveHousingDataRangeAPIView
)
from .mixins import BrazilHousingDataMixin


class RetrieveBrazilHousingData(BrazilHousingDataMixin,
                                RetrieveHousingDataAPIView):
    pass


class RetrieveBrazilHousingDataRange(BrazilHousingDataMixin,
                                     RetrieveHousingDataRangeAPIView):
    pass
