from django.urls import path
from .views import CountryView, CountryStateView

urlpatterns = [
    path('countries', CountryView.as_view()),
    path('<str:country>/states', CountryStateView.as_view()),
]
