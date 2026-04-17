// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BASE_URL = 'https://app.tablecrm.com/api/v1';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchContragents(token: string, phone?: string): Promise<any[]> {
  const url = new URL(`${BASE_URL}/meta/contragents/`);
  url.searchParams.set('token', token);
  if (phone) url.searchParams.set('phone', phone);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch contragents: ${res.status} ${res.statusText}`);
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchWarehouses(token: string): Promise<any[]> {
  const url = new URL(`${BASE_URL}/warehouses/`);
  url.searchParams.set('token', token);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch warehouses: ${res.status} ${res.statusText}`);
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchPayboxes(token: string): Promise<any[]> {
  const url = new URL(`${BASE_URL}/meta/payboxes/`);
  url.searchParams.set('token', token);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch payboxes: ${res.status} ${res.statusText}`);
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchOrganizations(token: string): Promise<any[]> {
  const url = new URL(`${BASE_URL}/organizations/`);
  url.searchParams.set('token', token);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch organizations: ${res.status} ${res.statusText}`);
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchPriceTypes(token: string): Promise<any[]> {
  const url = new URL(`${BASE_URL}/price_types/`);
  url.searchParams.set('token', token);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch price types: ${res.status} ${res.statusText}`);
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchNomenclature(token: string): Promise<any[]> {
  const url = new URL(`${BASE_URL}/nomenclature/`);
  url.searchParams.set('token', token);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch nomenclature: ${res.status} ${res.statusText}`);
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createSale(token: string, payload: any): Promise<any> {
  const url = new URL(`${BASE_URL}/docs_sales/`);
  url.searchParams.set('token', token);
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create sale: ${res.status} ${res.statusText}`);
  return res.json();
}