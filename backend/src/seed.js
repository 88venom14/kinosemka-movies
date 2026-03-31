import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    database: 'moviesdatabase',
    user: 'postgres',
    password: 'admin',
});

async function seed() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Check if already seeded
        const { rows } = await client.query('SELECT COUNT(*) FROM movies');
        if (parseInt(rows[0].count) > 0) {
            console.log('Database already seeded. Skipping.');
            await client.query('ROLLBACK');
            return;
        }

        // Insert movies
        const movies = [
            { title: 'Интерстеллар', description: 'Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, команда исследователей и учёных отправляется сквозь червоточину в поисках нового дома.', duration: 169, poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVfjko.jpg', rating: 8.6, release_date: '2014-11-07', director: 'Кристофер Нолан', cast: ['Мэттью Макконахи', 'Энн Хэтэуэй', 'Джессика Честейн'], genres: ['фантастика', 'драма', 'приключения'] },
            { title: 'Начало', description: 'Кобб — талантливый вор, лучший из лучших в опасном искусстве извлечения — кражи ценных секретов из глубин подсознания во время сна.', duration: 148, poster_url: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg', rating: 8.7, release_date: '2010-07-16', director: 'Кристофер Нолан', cast: ['Леонардо ДиКаприо', 'Джозеф Гордон-Левитт', 'Эллиот Пейдж'], genres: ['фантастика', 'боевик', 'триллер'] },
            { title: 'Побег из Шоушенка', description: 'Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме под названием Шоушенк, он сталкивается с жестокостью тюремной жизни.', duration: 142, poster_url: 'https://image.tmdb.org/t/p/w500/9cjIGRQL5UiXMmEJ8nEuXnJlqZl.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg', rating: 9.1, release_date: '1994-09-23', director: 'Фрэнк Дарабонт', cast: ['Тим Роббинс', 'Морган Фриман'], genres: ['драма'] },
            { title: 'Тёмный рыцарь', description: 'Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Джима Гордона и прокурора Харви Дента он стремится уничтожить организованную преступность.', duration: 152, poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgMe1nNaD.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5ez.jpg', rating: 8.5, release_date: '2008-07-18', director: 'Кристофер Нолан', cast: ['Кристиан Бейл', 'Хит Леджер', 'Аарон Экхарт'], genres: ['боевик', 'триллер', 'криминал'] },
            { title: 'Форрест Гамп', description: 'Сидя на скамейке, Форрест Гамп рассказывает случайным встречным историю своей необыкновенной жизни.', duration: 142, poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/7c9UVPPiTPltouxRVY6N9uugaVA.jpg', rating: 8.9, release_date: '1994-07-06', director: 'Роберт Земекис', cast: ['Том Хэнкс', 'Робин Райт', 'Гэри Синиз'], genres: ['драма', 'комедия', 'мелодрама'] },
            { title: 'Матрица', description: 'Хакер Нео узнаёт, что его мир — виртуальная реальность, созданная машинами. Он присоединяется к восстанию против них.', duration: 136, poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg', rating: 8.5, release_date: '1999-03-31', director: 'Лана Вачовски, Лилли Вачовски', cast: ['Киану Ривз', 'Лоренс Фишбёрн', 'Кэрри-Энн Мосс'], genres: ['фантастика', 'боевик'] },
            { title: 'Бойцовский клуб', description: 'Терзаемый хронической бессонницей и отчаянно пытающийся вырваться из мучительно скучной жизни, клерк знакомится со страховым агентом.', duration: 139, poster_url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/hZkgoQYus5dXo3H8T7Uef6DNknV.jpg', rating: 8.6, release_date: '1999-10-15', director: 'Дэвид Финчер', cast: ['Брэд Питт', 'Эдвард Нортон', 'Хелена Бонем Картер'], genres: ['триллер', 'драма'] },
            { title: 'Властелин колец: Возвращение короля', description: 'Повелитель сил тьмы Саурон направляет свою бесчисленную армию под стены Минас-Тирита. Хранители Кольца отправляются к Роковой горе.', duration: 201, poster_url: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/sRouEkmCRjVJjM5bXs5gEJbXZjP.jpg', rating: 8.6, release_date: '2003-12-17', director: 'Питер Джексон', cast: ['Элайджа Вуд', 'Вигго Мортенсен', 'Иэн Маккеллен'], genres: ['фэнтези', 'приключения', 'драма'] },
        ];

        for (const m of movies) {
            await client.query(
                `INSERT INTO movies (title, description, duration, poster_url, backdrop_url, rating, release_date, director, "cast", genres)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [m.title, m.description, m.duration, m.poster_url, m.backdrop_url, m.rating, m.release_date, m.director, m.cast, m.genres]
            );
        }
        console.log('✓ Movies inserted');

        // Insert halls
        const hall1 = await client.query(
            `INSERT INTO halls (name, total_rows, seats_per_row) VALUES ('Зал 1', 8, 12) RETURNING id`
        );
        const hall2 = await client.query(
            `INSERT INTO halls (name, total_rows, seats_per_row) VALUES ('Зал 2', 8, 12) RETURNING id`
        );
        const hall3 = await client.query(
            `INSERT INTO halls (name, total_rows, seats_per_row) VALUES ('VIP Зал', 6, 10) RETURNING id`
        );
        console.log('✓ Halls inserted');

        // Insert seats for each hall
        const halls = [
            { id: hall1.rows[0].id, rows: 8, cols: 12, vipRows: ['G', 'H'] },
            { id: hall2.rows[0].id, rows: 8, cols: 12, vipRows: ['G', 'H'] },
            { id: hall3.rows[0].id, rows: 6, cols: 10, vipRows: ['E', 'F'] },
        ];

        const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        for (const hall of halls) {
            for (let r = 0; r < hall.rows; r++) {
                const rowLetter = rowLetters[r];
                const isVip = hall.vipRows.includes(rowLetter);
                for (let c = 1; c <= hall.cols; c++) {
                    await client.query(
                        `INSERT INTO seats (hall_id, row_letter, seat_number, seat_type, price_multiplier)
                         VALUES ($1, $2, $3, $4, $5)`,
                        [hall.id, rowLetter, c, isVip ? 'vip' : 'standard', isVip ? 1.5 : 1.0]
                    );
                }
            }
        }
        console.log('✓ Seats inserted');

        // Insert sessions (next 7 days)
        const movieResult = await client.query('SELECT id FROM movies');
        const movieIds = movieResult.rows.map(r => r.id);
        const times = [
            { hour: 10, minute: 0, price: 350 },
            { hour: 13, minute: 0, price: 350 },
            { hour: 16, minute: 0, price: 400 },
            { hour: 19, minute: 0, price: 450 },
            { hour: 21, minute: 30, price: 500 },
        ];
        const hallIds = halls.map(h => h.id);

        for (let day = 0; day < 7; day++) {
            const date = new Date();
            date.setDate(date.getDate() + day);
            date.setHours(0, 0, 0, 0);

            for (const movieId of movieIds) {
                for (let t = 0; t < times.length; t++) {
                    const time = times[t];
                    const sessionDate = new Date(date);
                    sessionDate.setHours(time.hour, time.minute, 0, 0);

                    // Skip if in the past
                    if (sessionDate <= new Date()) continue;

                    const hallId = hallIds[t % hallIds.length];

                    await client.query(
                        `INSERT INTO sessions (movie_id, hall_id, start_time, base_price)
                         VALUES ($1, $2, $3, $4)`,
                        [movieId, hallId, sessionDate.toISOString(), time.price]
                    );
                }
            }
        }
        console.log('✓ Sessions inserted');

        // Populate session_seats
        const sessionsResult = await client.query('SELECT id, hall_id FROM sessions');
        for (const session of sessionsResult.rows) {
            const seatsResult = await client.query('SELECT id FROM seats WHERE hall_id = $1', [session.hall_id]);
            for (const seat of seatsResult.rows) {
                // Randomly occupy ~15% of seats
                const isOccupied = Math.random() < 0.15;
                await client.query(
                    `INSERT INTO session_seats (session_id, seat_id, status)
                     VALUES ($1, $2, $3)`,
                    [session.id, seat.id, isOccupied ? 'sold' : 'available']
                );
            }
        }
        console.log('✓ Session seats populated');

        // Insert test users
        const bcrypt = await import('bcrypt');
        const adminHash = await bcrypt.hash('admin123', 10);
        const userHash = await bcrypt.hash('user123', 10);
        const johnHash = await bcrypt.hash('password123', 10);

        await client.query(
            `INSERT INTO users (name, email, password_hash, role) VALUES
             ('Админ', 'admin@cineselect.com', $1, 'admin'),
             ('Пользователь', 'user@cineselect.com', $2, 'user'),
             ('Джон', 'john@example.com', $3, 'user')`,
            [adminHash, userHash, johnHash]
        );
        console.log('✓ Test users inserted');

        await client.query('COMMIT');
        console.log('\n✅ Database seeded successfully!');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
