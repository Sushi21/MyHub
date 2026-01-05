// Country coordinates [longitude, latitude] for ISO 3166-1 alpha-2 codes
// NOTE: react-simple-maps uses [longitude, latitude] NOT [latitude, longitude]
export const countryCoordinates: Record<string, [number, number]> = {
  US: [-95.7129, 37.0902],      // United States
  GB: [-3.4360, 55.3781],       // United Kingdom
  CA: [-106.3468, 56.1304],     // Canada
  AU: [133.7751, -25.2744],     // Australia
  FR: [2.2137, 46.2276],        // France
  DE: [10.4515, 51.1657],       // Germany
  SE: [18.6435, 60.1282],       // Sweden
  NO: [8.4689, 60.4720],        // Norway
  FI: [25.7482, 61.9241],       // Finland
  NL: [5.2913, 52.1326],        // Netherlands
  IT: [12.5674, 41.8719],       // Italy
  ES: [-3.7492, 40.4637],       // Spain
  BR: [-51.9253, -14.2350],     // Brazil
  JP: [138.2529, 36.2048],      // Japan
  CH: [8.2275, 46.8182],        // Switzerland
  AT: [14.5501, 47.5162],       // Austria
  BE: [4.4699, 50.5039],        // Belgium
  DK: [9.5018, 56.2639],        // Denmark
  IS: [-19.0208, 64.9631],      // Iceland
  PL: [19.1451, 51.9194],       // Poland
  GR: [21.8243, 39.0742],       // Greece
  PT: [-8.2245, 39.3999],       // Portugal
  IE: [-8.2439, 53.4129],       // Ireland
  MX: [-102.5528, 23.6345],     // Mexico
  AR: [-63.6167, -38.4161],     // Argentina
  CL: [-71.5430, -35.6751],     // Chile
  CO: [-74.2973, 4.5709],       // Colombia
  PE: [-75.0152, -9.1900],      // Peru
  VE: [-66.5897, 6.4238],       // Venezuela
  RU: [105.3188, 61.5240],      // Russia
  IN: [78.9629, 20.5937],       // India
  CN: [104.1954, 35.8617],      // China
  KR: [127.7669, 35.9078],      // South Korea
  TH: [100.9925, 15.8700],      // Thailand
  ID: [113.9213, -0.7893],      // Indonesia
  MY: [101.9758, 4.2105],       // Malaysia
  SG: [103.8198, 1.3521],       // Singapore
  PH: [121.7740, 12.8797],      // Philippines
  VN: [108.2772, 14.0583],      // Vietnam
  ZA: [22.9375, -30.5595],      // South Africa
  EG: [30.8025, 26.8206],       // Egypt
  NG: [8.6753, 9.0820],         // Nigeria
  KE: [37.9062, -0.0236],       // Kenya
  NZ: [174.8860, -40.9006],     // New Zealand
  TR: [35.2433, 38.9637],       // Turkey
  SA: [45.0792, 23.8859],       // Saudi Arabia
  AE: [53.8478, 23.4241],       // UAE
  IL: [34.8516, 31.0461],       // Israel
  UA: [31.1656, 48.3794],       // Ukraine
  RO: [24.9668, 45.9432],       // Romania
  CZ: [15.4730, 49.8175],       // Czech Republic
  HU: [19.5033, 47.1625],       // Hungary
  SK: [19.6990, 48.6690],       // Slovakia
  HR: [15.2, 45.1],             // Croatia
  SI: [14.9955, 46.1512],       // Slovenia
  RS: [21.0059, 44.0165],       // Serbia
  BG: [25.4858, 42.7339],       // Bulgaria
};

// Get country name from ISO code
export const countryNames: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  FR: 'France',
  DE: 'Germany',
  SE: 'Sweden',
  NO: 'Norway',
  FI: 'Finland',
  NL: 'Netherlands',
  IT: 'Italy',
  ES: 'Spain',
  BR: 'Brazil',
  JP: 'Japan',
  CH: 'Switzerland',
  AT: 'Austria',
  BE: 'Belgium',
  DK: 'Denmark',
  IS: 'Iceland',
  PL: 'Poland',
  GR: 'Greece',
  PT: 'Portugal',
  IE: 'Ireland',
  MX: 'Mexico',
  AR: 'Argentina',
  CL: 'Chile',
  CO: 'Colombia',
  PE: 'Peru',
  VE: 'Venezuela',
  RU: 'Russia',
  IN: 'India',
  CN: 'China',
  KR: 'South Korea',
  TH: 'Thailand',
  ID: 'Indonesia',
  MY: 'Malaysia',
  SG: 'Singapore',
  PH: 'Philippines',
  VN: 'Vietnam',
  ZA: 'South Africa',
  EG: 'Egypt',
  NG: 'Nigeria',
  KE: 'Kenya',
  NZ: 'New Zealand',
  TR: 'Turkey',
  SA: 'Saudi Arabia',
  AE: 'UAE',
  IL: 'Israel',
  UA: 'Ukraine',
  RO: 'Romania',
  CZ: 'Czech Republic',
  HU: 'Hungary',
  SK: 'Slovakia',
  HR: 'Croatia',
  SI: 'Slovenia',
  RS: 'Serbia',
  BG: 'Bulgaria',
};
