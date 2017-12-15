export function getStateCodes(): string[] {
  return [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
    ];
}

export function getStates(): string[] {
  return [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
  ];
}

export function stateName(code: string): string {
  const index = getStateCodes().indexOf(code);

  return index !== -1 ? getStates()[index] : code;
}

export function stateCode(name: string): string {
  const index = getStates().indexOf(name);

  return index !== -1 ? getStateCodes()[index] : name;
}

export function getCountries(): string[] {
  return ['United States'];
}

export function getCountryCodes(): string[] {
  return ['US'];
}

export function countryName(code: string): string {
  const index = getCountryCodes().indexOf(code);

  return index !== -1 ? getCountries()[index] : code;
}

export function countryCode(name: string): string {
  const index = getCountries().indexOf(name);

  return index !== -1 ? getCountryCodes()[index] : name;
}
