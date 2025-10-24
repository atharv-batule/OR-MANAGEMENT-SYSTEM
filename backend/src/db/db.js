import { Client } from 'pg';

const client = new Client({
  host: 'db.glkubgmswyjawlcgxspw.supabase.co',
  port: 6543,
  user: 'postgres',
  password: 'DmbgELe4GarxXkS5',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })

  export {client};
