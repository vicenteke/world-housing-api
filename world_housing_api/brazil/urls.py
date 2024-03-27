from django.urls import path
from .views import RetrieveBrazilHousingData


urlpatterns = [
    path('/<int:year>/<int:month>', RetrieveBrazilHousingData.as_view()),
]
