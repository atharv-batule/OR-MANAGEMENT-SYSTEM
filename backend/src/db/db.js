const { Client } = require('pg');

const client = new Client({
  host: 'localhost',   // or your server IP
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'USERS'
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })

