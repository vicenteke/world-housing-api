from api.generics import RetrieveHousingDataAPIView
from .mixins import BrazilHousingDataMixin


class RetrieveBrazilHousingData(BrazilHousingDataMixin,
                                RetrieveHousingDataAPIView):
    pass
