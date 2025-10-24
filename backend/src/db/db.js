// import { Client } from 'pg';

// const client = new Client({
//   host: 'db.glkubgmswyjawlcgxspw.supabase.co',
//   port: 6543,
//   user: 'postgres',
//   password: 'DmbgELe4GarxXkS5',
//   database: 'postgres',
//   ssl: { rejectUnauthorized: false }
// });

// client.connect()
//   .then(() => {
//     console.log('Connected to PostgreSQL');
//   })

//   export {client};
import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://postgres:DmbgELe4GarxXkS5@db.glkubgmswyjawlcgxspw.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err));

export { client };
