import requests
from api.mixins import HousingDataMixin


class BrazilHousingDataMixin(HousingDataMixin):
    """Implements get_housing_data_from_remote() for Brazil"""
    COUNTRY = 'brazil'
    STATES_IBGE_FACTORY = {
        # equivalent codes for each state for IBGE API
        'ac': 12,
        'al': 27,
        'am': 13,
        'ap': 16,
        'ba': 29,
        'ce': 23,
        'df': 53,
        'es': 32,
        'go': 52,
        'ma': 21,
        'mg': 31,
        'ms': 50,
        'mt': 51,
        'pa': 15,
        'pb': 25,
        'pe': 26,
        'pi': 22,
        'pr': 41,
        'rj': 33,
        'rn': 24,
        'ro': 11,
        'rr': 14,
        'rs': 43,
        'sc': 42,
        'se': 28,
        'sp': 35,
        'to': 17,
        'all': 'all'
    }

    LEVELS_IBGE_FACTORY = {
        # equivalent codes for each level in IBGE API
        'national': 'N1',
        'state': 'N3'
    }

    def get_state_from_id(self, id: int):
        """Returns state abbreviation based on IBGE's state ID"""
        for key, value in self.STATES_IBGE_FACTORY.items():
            if value == id:
                return key
        return None

    def get_housing_data_from_remote(
            self,
            year: int,
            month: int,
            final_year: int = None,
            final_month: int = None,
            states: list = []):
        """More info at
        https://servicodados.ibge.gov.br/api/docs/agregados?versao=3#api-acervo
        """
        url = 'https://servicodados.ibge.gov.br/api/v3/agregados/2296/periodos/[PERIODS]/variaveis/48|1196?localidades=[LEVEL][[STATES]]'
        requested_entries = HousingDataMixin.get_requested_entries(
            year=year, month=month, final_year=final_year,
            final_month=final_month, states=states)

        periods = list(set([
            f'{entry["year"]}{"{:02d}".format(entry["month"])}'
            for entry in requested_entries
        ]))
        url = url.replace('[PERIODS]', '|'.join(periods))

        if states:
            url_states = [
                self.STATES_IBGE_FACTORY[state.lower()]
                for state in states
            ]
            url = url.replace('[LEVEL]', self.LEVELS_IBGE_FACTORY['state'])
            url = url.replace('[STATES]', '|'.join(url_states))
        else:
            url = url.replace('[LEVEL]', self.LEVELS_IBGE_FACTORY['national'])
            url = url.replace('[STATES]', self.STATES_IBGE_FACTORY['all'])

        response = requests.get(url)
        if response.status_code != 200:
            raise Exception('Failed to retrieve Brazilian data from IBGE API.')

        response = response.json()

        # restructure data
        data = {}
        for stats in response:
            stat_field = 'variation'
            if stats['id'] == '48':
                stat_field = 'square_meter_price'

            for result in stats['resultados'][0]['series']:
                if result['localidade']['id'] not in data:
                    data[result['localidade']['id']] = {}
                for date, value in result['serie'].items():
                    try:
                        float(value)
                    except Exception as e:
                        raise Exception(
                            'Failed to retrieve Brazilian data from IBGE API: '
                            'invalid data'
                        )
                    if date not in data[result['localidade']['id']]:
                        data[result['localidade']['id']][date] = {}
                    data[result['localidade']['id']][date][stat_field]\
                        = float(value)

        res = []
        for location in data:
            for date, values in data[location].items():
                res.append({
                    "year": int(date[:4]),
                    "month": int(date[-2:]),
                    "square_meter_price": self.convert_to_dolar_on_month(
                        currency='brl',
                        value=values['square_meter_price'],
                        year=int(date[:4]),
                        month=int(date[-2:])
                    ),
                    "variation": values['variation'] / 100,
                    "state": None if not states
                    else self.get_state_from_id(int(location))
                })
        return res

