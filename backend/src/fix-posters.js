import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    database: 'moviesdatabase',
    user: 'postgres',
    password: 'admin',
});

async function fixAllPosters() {
    const client = await pool.connect();

    try {
        // TMDB images - they load fine in browsers, just not from this server
        const updates = [
            { title: 'Интерстеллар', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', backdrop: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVfjko.jpg' },
            { title: 'Начало', poster: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg', backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg' },
            { title: 'Побег из Шоушенка', poster: 'https://image.tmdb.org/t/p/w500/9cjIGRQL5UiXMmEJ8nEuXnJlqZl.jpg', backdrop: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg' },
            { title: 'Тёмный рыцарь', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgMe1nNaD.jpg', backdrop: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5ez.jpg' },
            { title: 'Форрест Гамп', poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', backdrop: 'https://image.tmdb.org/t/p/original/7c9UVPPiTPltouxRVY6N9uugaVA.jpg' },
            { title: 'Матрица', poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', backdrop: 'https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg' },
            { title: 'Бойцовский клуб', poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', backdrop: 'https://image.tmdb.org/t/p/original/hZkgoQYus5dXo3H8T7Uef6DNknV.jpg' },
            { title: 'Властелин колец: Возвращение короля', poster: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', backdrop: 'https://image.tmdb.org/t/p/original/sRouEkmCRjVJjM5bXs5gEJbXZjP.jpg' },
            { title: 'Дюна: Часть третья', poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nez7H.jpg', backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg' },
            { title: 'Мстители: Судный день', poster: 'https://image.tmdb.org/t/p/w500/d9CTnTHip1RbVi2OQbA2LJJQAGI.jpg', backdrop: 'https://image.tmdb.org/t/p/original/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg' },
            { title: 'Аватар 4', poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', backdrop: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg' },
            { title: 'Миссия невыполнима 8', poster: 'https://image.tmdb.org/t/p/w500/8uUU2pxm6IYZw8UgnKJzx0Ylq0h.jpg', backdrop: 'https://image.tmdb.org/t/p/original/Af4bXE5GluV2wgNQeV3BRgAjNcg.jpg' },
            { title: 'Бэтмен: Часть вторая', poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', backdrop: 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyFAJlMTk9q91MOUE5.jpg' },
        ];

        for (const m of updates) {
            await client.query(
                'UPDATE movies SET poster_url = $1, backdrop_url = $2 WHERE title = $3',
                [m.poster, m.backdrop, m.title]
            );
            console.log(`✓ ${m.title}`);
        }

        console.log('\n✅ All poster URLs updated!');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

fixAllPosters();
