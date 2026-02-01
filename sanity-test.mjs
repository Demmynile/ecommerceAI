import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6g8jpazl',
  dataset: 'production',
  apiVersion: '2026-01-15',
  useCdn: false,
});

async function test() {
  const products = await client.fetch('*[_type == "digitalGoldProduct"]{_id, name, price}');
  console.log(products);
}

test();
