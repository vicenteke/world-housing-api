# world-housing-api
*world-housing-api* is a Django REST Framework (DRF) intended to serve data concerning housing prices and monthly variations from several countries in the same place.

You can check the auto-generated docs or some documentation under the `docs/` folder.

## Usage
### Get housing data for a specific month for a specific country
```
GET /housing/<country>/<year>/<month>
```

**Response**
```
{
  "square_meter_price": float,   # average square meter price in dolars
  "variation": float             # pricing variation in relation to past month (E.g. 0.01 = 1%)
}
```

E.g. `/housing/brazil/2024/01` would return data for January 2024 in Brazil.

### Get housing data for a specific country in a time range
```
GET /housing/<country>/<initial_year>/<initial_month>/<final_year>/<final_month>
```

**Response**
```
{
  "variation": float  # total pricing variation, which is the product of all variations except from the initial month (E.g. 0.01 = 1%)
  "monthly": [
    "<month>/<year>": {
      "square_meter_price": float,   # average square meter price in dolars
      "variation": float             # pricing variation in relation to past month (E.g. 0.01 = 1%)
    },
    ...
  ]
}
```

E.g. `/housing/brazil/2023/01/2024/12` would return data from January 2023 until December 2024 in Brazil.

### Get housing data for a specific month for certain states
```
GET /housing/<country>/<state_1_abbreviation>-<state_2_abbreviation>-<state_3_abbreviation>/<year>/<month>/
```

**Response**
```
{
  <state_1_abbreviation>: {
    "square_meter_price": float,   # average square meter price in dolars
    "variation": float             # pricing variation in relation to past month (E.g. 0.01 = 1%)
  },
  <state_2_abbreviation>: {
    ...
  },
  ...
}
```

E.g. `/housing/brazil/2024/01/sc-rj` would return data for January 2024 in SC and RJ (Brazillian states).
NOTE: you can use as many states as you wish by including abbreviations, as well as using just a single one to get a single result.

### Get housing data for certain states in a time range
```
GET /housing/<country>/<state_1_abbreviation>-<state_2_abbreviation>-<state_3_abbreviation>/<initial_year>/<initial_month>/<final_year>/<final_month>
```

**Response**
```
{
  <state_1_abbreviation>: {
    "variation": float  # total pricing variation, which is the product of all variations except from the initial month (E.g. 0.01 = 1%)
    "monthly": [
      "<month>/<year>": {
        "square_meter_price": float,   # average square meter price in dolars
        "variation": float             # pricing variation in relation to past month (E.g. 0.01 = 1%)
      },
      ...
    ]
  },
  <state_2_abbreviation>: {
    ...
  },
  ...
}
```

### Get countries available
```
GET /housing/countries
```

**Response**
```
[
  {
    "name": string,
    "base_uri": string,
    "states": [
      {
        "name": string,
        "abbreviation": string
      },
      ...
    ]
  },
  ...
]
```

The `base_uri` parameter is relative to the `<country>` in the URIs, while `abbreviation` is relative to `<state_N_abbreviation>`.

### Get states available for a certain country
```
GET /housing/<country>/states
```

**Response**
```
[
  {
    "name": string,
    "abbreviation": string
  },
  ...
]
```

The `abbreviation` parameter is relative to `<state_N_abbreviation>`.

