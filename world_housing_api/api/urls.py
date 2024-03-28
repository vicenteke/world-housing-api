from django.urls import path, include
from .views import (
    CountryStateView,
    CountryView
)


urlpatterns = [
    path('brazil/', include('brazil.urls')),
    path('countries', CountryView.as_view()),
    path('<str:country>/states', CountryStateView.as_view()),
]
