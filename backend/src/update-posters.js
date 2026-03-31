import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    database: 'moviesdatabase',
    user: 'postgres',
    password: 'admin',
});

async function updatePosters() {
    const client = await pool.connect();

    try {
        const updates = [
            { title: 'Интерстеллар', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', backdrop: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVfjko.jpg' },
            { title: 'Начало', poster: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg', backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg' },
            { title: 'Побег из Шоушенка', poster: 'https://image.tmdb.org/t/p/w500/9cjIGRQL5UiXMmEJ8nEuXnJlqZl.jpg', backdrop: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg' },
            { title: 'Тёмный рыцарь', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgMe1nNaD.jpg', backdrop: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5ez.jpg' },
            { title: 'Форрест Гамп', poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', backdrop: 'https://image.tmdb.org/t/p/original/7c9UVPPiTPltouxRVY6N9uugaVA.jpg' },
            { title: 'Матрица', poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', backdrop: 'https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg' },
            { title: 'Бойцовский клуб', poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', backdrop: 'https://image.tmdb.org/t/p/original/hZkgoQYus5dXo3H8T7Uef6DNknV.jpg' },
            { title: 'Властелин колец: Возвращение короля', poster: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', backdrop: 'https://image.tmdb.org/t/p/original/sRouEkmCRjVJjM5bXs5gEJbXZjP.jpg' },
        ];

        for (const m of updates) {
            const result = await client.query(
                'UPDATE movies SET poster_url = $1, backdrop_url = $2 WHERE title = $3 RETURNING id',
                [m.poster, m.backdrop, m.title]
            );
            if (result.rows.length > 0) {
                console.log(`✓ Updated: ${m.title}`);
            } else {
                console.log(`✗ Not found: ${m.title}`);
            }
        }

        console.log('\n✅ Poster URLs updated!');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

updatePosters();
