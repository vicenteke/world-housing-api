import requests
import logging
from datetime import date as Date

logger = logging.getLogger()


def convert_to_dolar(currency: str, value: float | int, date: Date):
    """Uses https://github.com/fawazahmed0/exchange-api to convert a value in a
    currency to dolar.

    :param currency: value's currency;
    :type currency: string;
    :param value: amount to be converted;
    :type value: float or int;
    :param date: day to get the currency;
    :type date: datetime.date
    """
    url = f'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@'\
          f'{date.strftime("%Y-%m-%d")}/v1/currencies/usd.json'

    response = requests.get(url)
    if response.status_code != 200:
        logger.warn(
            f"Failed to fetch {currency.upper()} currency on "
            f"{date.strftime('%Y-%m-%d')}, using latest."
        )
        url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@'\
              'latest/v1/currencies/usd.json'
        response = requests.get(url)

    if response.status_code != 200:
        raise Exception(
            f"Failed to fetch {currency.upper()} currency on "
            f"{date.strftime('%Y-%m-%d')}"
        )

    response = response.json()
    dolar_currency = response['usd'].get(currency.lower())
    if dolar_currency is None:
        raise Exception(f"{currency.upper()} is not a valid currency")
    
    return value / dolar_currency
