from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Country(models.Model):
    """Countries supported by the API"""
    name = models.CharField(max_length=100, unique=True)
    base_uri = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return f'{self.name} /{self.base_uri}'

    class Meta:
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(
                'name',
                name="un_name_country"
            ),
            models.UniqueConstraint(
                'base_uri',
                name="un_base_uri_country"
            ),
        ]


class CountryState(models.Model):
    """States supported by the API"""
    name = models.CharField(max_length=100)
    abbreviation = models.CharField(max_length=10)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.name} /{self.country.name}/{self.abbreviation}'
    
    class Meta:
        ordering = ['country', 'abbreviation']
        constraints = [
            models.UniqueConstraint(
                'country_id', 'abbreviation',
                name="un_country_abbreviation_country_state"
            ),
            models.UniqueConstraint(
                'country_id', 'name',
                name="un_country_name_country_state"
            ),
        ]


class HousingData(models.Model):
    """Stored housing data"""
    month = models.SmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])
    year = models.SmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(2200)])
    variation = models.DecimalField(max_digits=20, decimal_places=5)
    square_meter_price = models.DecimalField(max_digits=20, decimal_places=2)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    state = models.ForeignKey(CountryState, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'{self.month}/{self.year} /{self.country.name}{"/" + self.state.abbreviation if self.state else ""} {self.square_meter_price} {self.variation}'
    
    class Meta:
        ordering = ['country', '-year', '-month']
        constraints = [
            models.UniqueConstraint(
                'country_id', 'year', 'month', 'state_id',
                name="un_country_year_month_state_housing_data"
            ),
        ]
