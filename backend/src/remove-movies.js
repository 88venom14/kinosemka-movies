import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    database: 'moviesdatabase',
    user: 'postgres',
    password: 'admin',
});

async function removeMovies() {
    const client = await pool.connect();

    try {
        const moviesToRemove = [
            'Побег из Шоушенка',
            'Тёмный рыцарь',
            'Миссия невыполнима 8',
            'Дюна: Часть третья',
        ];

        for (const title of moviesToRemove) {
            const result = await client.query(
                'DELETE FROM movies WHERE title = $1 RETURNING id',
                [title]
            );
            if (result.rows.length > 0) {
                console.log(`✓ Removed: ${title}`);
            } else {
                console.log(`✗ Not found: ${title}`);
            }
        }

        console.log('\n✅ Done!');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

removeMovies();
