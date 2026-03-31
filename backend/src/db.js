import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    database: 'moviesdatabase',
    user: 'postgres',
    password: 'admin',
});

export default pool;
