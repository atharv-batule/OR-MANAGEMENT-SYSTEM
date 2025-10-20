import { Client } from 'pg';

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'USERS'
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })

  export {client};
