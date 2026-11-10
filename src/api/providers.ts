import { Provider, SERVICE_CATEGORIES, ServiceCategory } from '../types';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

/** Shape of a user returned by JSONPlaceholder (only the fields we use). */
interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: { street: string; suite: string; city: string; zipcode: string };
  company: { name: string; catchPhrase: string; bs: string };
}

const DESCRIPTIONS: Record<ServiceCategory, string> = {
  'Car Wash':
    'Full exterior and interior car wash, including vacuuming, dashboard cleaning and tyre shine. Mobile service available at your home or office.',
  Cleaning:
    'Thorough home and office cleaning: dusting, mopping, kitchen and bathroom sanitising. All cleaning supplies are provided.',
  Plumbing:
    'Leak repairs, pipe installation, blocked drains and water heater servicing by certified plumbers. Emergency call-outs available.',
  Laundry:
    'Wash, dry, iron and fold with free pickup and delivery. Special care for delicate fabrics and native wear.',
  Electrician:
    'Wiring, socket and switch installation, fault finding and inverter setup by licensed electricians, with safety checks included.',
};

const BASE_PRICE: Record<ServiceCategory, number> = {
  'Car Wash': 5000,
  Cleaning: 15000,
  Plumbing: 10000,
  Laundry: 4000,
  Electrician: 12000,
};

/**
 * JSONPlaceholder has no service data, so the category, rating and price are
 * generated deterministically from the user id. The same provider always gets
 * the same values, which keeps the list stable between refreshes.
 */
export function mapUserToProvider(user: ApiUser): Provider {
  const category = SERVICE_CATEGORIES[(user.id - 1) % SERVICE_CATEGORIES.length];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    website: user.website,
    companyName: user.company.name,
    catchPhrase: user.company.catchPhrase,
    category,
    description: DESCRIPTIONS[category],
    city: user.address.city,
    address: `${user.address.street}, ${user.address.suite}, ${user.address.city} ${user.address.zipcode}`,
    rating: Number((4 + ((user.id * 7) % 10) / 10).toFixed(1)),
    priceFrom: BASE_PRICE[category] + (user.id % 4) * 1000,
  };
}

export async function fetchProviders(signal?: AbortSignal): Promise<Provider[]> {
  const response = await fetch(API_URL, { signal });

  if (!response.ok) {
    throw new Error(`Could not load services (status ${response.status}).`);
  }

  const users = (await response.json()) as ApiUser[];
  return users.map(mapUserToProvider);
}
