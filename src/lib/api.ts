const BASE_URL = 'https://app.tablecrm.com/api/v1';

export async function fetchContragents(token: string, phone?: string): Promise<any[]> {
  const url = new URL(`${BASE_URL}/meta/contragents/`);
  url.searchParams.set('token', token);
  if (phone) url.searchParams.set('phone', phone);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch contragents');
  return res.json();
}

export async function fetchWarehouses(token: string): Promise<any[]> {
  const url = `${BASE_URL}/warehouses/?token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch warehouses');
  return res.json();
}

export async function fetchPayboxes(token: string): Promise<any[]> {
  const url = `${BASE_URL}/meta/payboxes/?token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch payboxes');
  return res.json();
}

export async function fetchOrganizations(token: string): Promise<any[]> {
  const url = `${BASE_URL}/organizations/?token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch organizations');
  return res.json();
}

export async function fetchPriceTypes(token: string): Promise<any[]> {
  const url = `${BASE_URL}/price_types/?token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch price types');
  return res.json();
}

export async function fetchNomenclature(token: string): Promise<any[]> {
  const url = `${BASE_URL}/nomenclature/?token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch nomenclature');
  return res.json();
}

export async function createSale(token: string, payload: any): Promise<any> {
  const url = `${BASE_URL}/docs_sales/?token=${token}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create sale');
  return res.json();
}