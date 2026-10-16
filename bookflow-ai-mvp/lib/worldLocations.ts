export interface WorldLocationItem {
  name: string;
  category: string;
  country: string;
  icon: string;
}

export const curatedWorldLocations: WorldLocationItem[] = [
  { name: 'Worldwide (All Locations)', category: 'Global', country: 'Worldwide', icon: '🌍' },
  
  // India Hubs & Localities
  { name: 'All Locations in India', category: 'India', country: 'India', icon: '🇮🇳' },
  { name: 'Pune & Pimpri-Chinchwad, India', category: 'India', country: 'India', icon: '📍' },
  { name: 'Pimple Gurav, Pimpri-Chinchwad', category: 'India', country: 'India', icon: '📍' },
  { name: 'Wakad, Pune', category: 'India', country: 'India', icon: '📍' },
  { name: 'Hinjewadi, Pune', category: 'India', country: 'India', icon: '📍' },
  { name: 'Pimpri, Pimpri-Chinchwad', category: 'India', country: 'India', icon: '📍' },
  { name: 'Cidco, Chhatrapati Sambhaji Nagar', category: 'India', country: 'India', icon: '📍' },
  { name: 'Garkheda, Chhatrapati Sambhaji Nagar', category: 'India', country: 'India', icon: '📍' },
  { name: 'Osmanpura, Chhatrapati Sambhaji Nagar', category: 'India', country: 'India', icon: '📍' },
  { name: 'Waluj, Chhatrapati Sambhaji Nagar', category: 'India', country: 'India', icon: '📍' },
  { name: 'Mumbai, Maharashtra, India', category: 'India', country: 'India', icon: '📍' },
  { name: 'Delhi NCR / New Delhi, India', category: 'India', country: 'India', icon: '📍' },
  { name: 'Bengaluru (Bangalore), Karnataka, India', category: 'India', country: 'India', icon: '📍' },
  { name: 'Hyderabad, Telangana, India', category: 'India', country: 'India', icon: '📍' },
  { name: 'Chennai, Tamil Nadu, India', category: 'India', country: 'India', icon: '📍' },
  { name: 'Kolkata, West Bengal, India', category: 'India', country: 'India', icon: '📍' },
  { name: 'Jaipur / Udaipur, Rajasthan, India', category: 'India', country: 'India', icon: '📍' },
  { name: 'Goa, India', category: 'India', country: 'India', icon: '📍' },
  { name: 'Ahmedabad / Surat, Gujarat, India', category: 'India', country: 'India', icon: '📍' },
  { name: 'Chandigarh, Punjab, India', category: 'India', country: 'India', icon: '📍' },
  { name: 'Lucknow, Uttar Pradesh, India', category: 'India', country: 'India', icon: '📍' },
  { name: 'Kochi, Kerala, India', category: 'India', country: 'India', icon: '📍' },

  // Middle East & Gulf
  { name: 'Dubai, United Arab Emirates', category: 'Middle East', country: 'United Arab Emirates', icon: '🇦🇪' },
  { name: 'Abu Dhabi, United Arab Emirates', category: 'Middle East', country: 'United Arab Emirates', icon: '🇦🇪' },
  { name: 'Sharjah, United Arab Emirates', category: 'Middle East', country: 'United Arab Emirates', icon: '🇦🇪' },
  { name: 'Doha, Qatar', category: 'Middle East', country: 'Qatar', icon: '🇶🇦' },
  { name: 'Riyadh, Saudi Arabia', category: 'Middle East', country: 'Saudi Arabia', icon: '🇸🇦' },
  { name: 'Jeddah, Saudi Arabia', category: 'Middle East', country: 'Saudi Arabia', icon: '🇸🇦' },
  { name: 'Muscat, Oman', category: 'Middle East', country: 'Oman', icon: '🇴🇲' },
  { name: 'Kuwait City, Kuwait', category: 'Middle East', country: 'Kuwait', icon: '🇰🇼' },
  { name: 'Manama, Bahrain', category: 'Middle East', country: 'Bahrain', icon: '🇧🇭' },

  // North America
  { name: 'New York City, NY, USA', category: 'North America', country: 'United States', icon: '🇺🇸' },
  { name: 'Los Angeles, CA, USA', category: 'North America', country: 'United States', icon: '🇺🇸' },
  { name: 'San Francisco / Bay Area, CA, USA', category: 'North America', country: 'United States', icon: '🇺🇸' },
  { name: 'Miami, FL, USA', category: 'North America', country: 'United States', icon: '🇺🇸' },
  { name: 'Chicago, IL, USA', category: 'North America', country: 'United States', icon: '🇺🇸' },
  { name: 'Houston / Dallas, TX, USA', category: 'North America', country: 'United States', icon: '🇺🇸' },
  { name: 'Toronto, Ontario, Canada', category: 'North America', country: 'Canada', icon: '🇨🇦' },
  { name: 'Vancouver, BC, Canada', category: 'North America', country: 'Canada', icon: '🇨🇦' },
  { name: 'Montreal, Quebec, Canada', category: 'North America', country: 'Canada', icon: '🇨🇦' },
  { name: 'Cancun, Mexico', category: 'North America', country: 'Mexico', icon: '🇲🇽' },

  // Europe
  { name: 'London, United Kingdom', category: 'Europe', country: 'United Kingdom', icon: '🇬🇧' },
  { name: 'Manchester / Birmingham, United Kingdom', category: 'Europe', country: 'United Kingdom', icon: '🇬🇧' },
  { name: 'Paris, France', category: 'Europe', country: 'France', icon: '🇫🇷' },
  { name: 'Nice / Cannes, France', category: 'Europe', country: 'France', icon: '🇫🇷' },
  { name: 'Milan, Italy', category: 'Europe', country: 'Italy', icon: '🇮🇹' },
  { name: 'Rome, Italy', category: 'Europe', country: 'Italy', icon: '🇮🇹' },
  { name: 'Florence / Lake Como, Italy', category: 'Europe', country: 'Italy', icon: '🇮🇹' },
  { name: 'Madrid / Barcelona, Spain', category: 'Europe', country: 'Spain', icon: '🇪🇸' },
  { name: 'Berlin / Munich, Germany', category: 'Europe', country: 'Germany', icon: '🇩🇪' },
  { name: 'Amsterdam, Netherlands', category: 'Europe', country: 'Netherlands', icon: '🇳🇱' },
  { name: 'Zurich / Geneva, Switzerland', category: 'Europe', country: 'Switzerland', icon: '🇨🇭' },
  { name: 'Vienna, Austria', category: 'Europe', country: 'Austria', icon: '🇦🇹' },
  { name: 'Santorini / Athens, Greece', category: 'Europe', country: 'Greece', icon: '🇬🇷' },

  // Asia & Pacific
  { name: 'Singapore', category: 'Asia', country: 'Singapore', icon: '🇸🇬' },
  { name: 'Bangkok / Phuket, Thailand', category: 'Asia', country: 'Thailand', icon: '🇹🇭' },
  { name: 'Bali / Jakarta, Indonesia', category: 'Asia', country: 'Indonesia', icon: '🇮🇩' },
  { name: 'Kuala Lumpur, Malaysia', category: 'Asia', country: 'Malaysia', icon: '🇲🇾' },
  { name: 'Tokyo, Japan', category: 'Asia', country: 'Japan', icon: '🇯🇵' },
  { name: 'Seoul, South Korea', category: 'Asia', country: 'South Korea', icon: '🇰🇷' },
  { name: 'Sydney, Australia', category: 'Oceania', country: 'Australia', icon: '🇦🇺' },
  { name: 'Melbourne, Australia', category: 'Oceania', country: 'Australia', icon: '🇦🇺' },
  { name: 'Auckland, New Zealand', category: 'Oceania', country: 'New Zealand', icon: '🇳🇿' },
  { name: 'Malé, Maldives', category: 'Asia', country: 'Maldives', icon: '🇲🇻' }
];

export const allWorldCountries: string[] = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas',
  'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize',
  'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
  'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China',
  'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba',
  'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
  'Guatemala', 'Guinea', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong',
  'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos',
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
  'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
  'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway',
  'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay',
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
  'Samoa', 'San Marino', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan',
  'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
  'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

/**
 * Auto-population search function for world locations.
 * Returns instant matching world cities, regions, and countries.
 */
export function searchWorldLocations(searchTerm: string, limit = 25): WorldLocationItem[] {
  const q = (searchTerm || '').toLowerCase().trim();

  if (!q) {
    return curatedWorldLocations.slice(0, limit);
  }

  // 1. Matches from curated hubs
  const hubMatches: WorldLocationItem[] = curatedWorldLocations.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.country.toLowerCase().includes(q)
  );

  // 2. Matches from all world countries
  const countryMatches: WorldLocationItem[] = allWorldCountries
    .filter(country => country.toLowerCase().includes(q))
    .filter(country => !curatedWorldLocations.some(item => item.name.toLowerCase() === country.toLowerCase()))
    .map(country => ({
      name: country,
      category: 'Country',
      country: country,
      icon: '🌐'
    }));

  const combined = [...hubMatches, ...countryMatches];

  // Prioritize exact or prefix matches
  combined.sort((a, b) => {
    const aStartsWith = a.name.toLowerCase().startsWith(q) ? 0 : 1;
    const bStartsWith = b.name.toLowerCase().startsWith(q) ? 0 : 1;
    return aStartsWith - bStartsWith;
  });

  return combined.slice(0, limit);
}
