import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    database: 'moviesdatabase',
    user: 'postgres',
    password: 'admin',
});

async function checkPosters() {
    const client = await pool.connect();

    try {
        const { rows } = await client.query('SELECT id, title, poster_url, backdrop_url FROM movies ORDER BY id');
        
        console.log('\n=== Movie Posters ===\n');
        for (const m of rows) {
            console.log(`${m.id}. ${m.title}`);
            console.log(`   poster:  ${m.poster_url}`);
            console.log(`   backdrop: ${m.backdrop_url}`);
            console.log('');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

checkPosters();
