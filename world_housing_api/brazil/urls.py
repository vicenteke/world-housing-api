from django.urls import path
from .views import (
    RetrieveBrazilHousingData,
    RetrieveBrazilHousingDataRange
)


urlpatterns = [
    path('<int:year>/<int:month>', RetrieveBrazilHousingData.as_view()),
    path('<int:year>/<int:month>/<int:final_year>/<int:final_month>',
         RetrieveBrazilHousingDataRange.as_view()),
]
