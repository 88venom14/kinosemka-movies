import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'moviesdatabase.sqlite');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('foreign_keys = OFF');

const schemaPath = path.join(process.cwd(), 'database', 'schema-sqlite.sql');
if (fs.existsSync(schemaPath)) {
    db.exec(fs.readFileSync(schemaPath, 'utf-8'));
}

const { count } = db.prepare('SELECT COUNT(*) as count FROM movies').get();
if (count > 0) {
    console.log('Database already seeded. Skipping.');
    db.close();
    process.exit(0);
}

const insertMovie = db.prepare(
    `INSERT INTO movies (title, description, duration, poster_url, backdrop_url, rating, release_date, director, cast, genres)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

const movies = [
    { title: 'Интерстеллар', description: 'Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, команда исследователей и учёных отправляется сквозь червоточину в поисках нового дома.', duration: 169, poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVfjko.jpg', rating: 8.6, release_date: '2014-11-07', director: 'Кристофер Нолан', cast: ['Мэттью Макконахи', 'Энн Хэтэуэй', 'Джессика Честейн'], genres: ['фантастика', 'драма', 'приключения'] },
    { title: 'Начало', description: 'Кобб — талантливый вор, лучший из лучших в опасном искусстве извлечения — кражи ценных секретов из глубин подсознания во время сна.', duration: 148, poster_url: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg', rating: 8.7, release_date: '2010-07-16', director: 'Кристофер Нолан', cast: ['Леонардо ДиКаприо', 'Джозеф Гордон-Левитт', 'Эллиот Пейдж'], genres: ['фантастика', 'боевик', 'триллер'] },
    { title: 'Матрица', description: 'Хакер Нео узнаёт, что его мир — виртуальная реальность, созданная машинами. Он присоединяется к восстанию против них.', duration: 136, poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg', rating: 8.5, release_date: '1999-03-31', director: 'Лана Вачовски, Лилли Вачовски', cast: ['Киану Ривз', 'Лоренс Фишбёрн', 'Кэрри-Энн Мосс'], genres: ['фантастика', 'боевик'] },
    { title: 'Форрест Гамп', description: 'Сидя на скамейке, Форрест Гамп рассказывает случайным встречным историю своей необыкновенной жизни.', duration: 142, poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/7c9UVPPiTPltouxRVY6N9uugaVA.jpg', rating: 8.9, release_date: '1994-07-06', director: 'Роберт Земекис', cast: ['Том Хэнкс', 'Робин Райт', 'Гэри Синиз'], genres: ['драма', 'комедия', 'мелодрама'] },
    { title: 'Бойцовский клуб', description: 'Терзаемый хронической бессонницей и отчаянно пытающийся вырваться из мучительно скучной жизни, клерк знакомится со страховым агентом.', duration: 139, poster_url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/hZkgoQYus5dXo3H8T7Uef6DNknV.jpg', rating: 8.6, release_date: '1999-10-15', director: 'Дэвид Финчер', cast: ['Брэд Питт', 'Эдвард Нортон', 'Хелена Бонем Картер'], genres: ['триллер', 'драма'] },
    { title: 'Властелин колец: Возвращение короля', description: 'Повелитель сил тьмы Саурон направляет свою бесчисленную армию под стены Минас-Тирита. Хранители Кольца отправляются к Роковой горе.', duration: 201, poster_url: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', backdrop_url: 'https://image.tmdb.org/t/p/original/sRouEkmCRjVJjM5bXs5gEJbXZjP.jpg', rating: 8.6, release_date: '2003-12-17', director: 'Питер Джексон', cast: ['Элайджа Вуд', 'Вигго Мортенсен', 'Иэн Маккеллен'], genres: ['фэнтези', 'приключения', 'драма'] },
];

const insertMovieTx = db.transaction((movies) => {
    for (const m of movies) {
        insertMovie.run(m.title, m.description, m.duration, m.poster_url, m.backdrop_url, m.rating, m.release_date, m.director, JSON.stringify(m.cast), JSON.stringify(m.genres));
    }
});
insertMovieTx(movies);
console.log('✓ Movies inserted');

const insertHall = db.prepare(`INSERT INTO halls (name, total_rows, seats_per_row) VALUES (?, ?, ?)`);
const hall1 = insertHall.run('Зал 1', 8, 12);
const hall2 = insertHall.run('Зал 2', 8, 12);
const hall3 = insertHall.run('VIP Зал', 6, 10);
console.log('✓ Halls inserted');

const halls = [
    { id: hall1.lastInsertRowid, rows: 8, cols: 12, vipRows: ['G', 'H'] },
    { id: hall2.lastInsertRowid, rows: 8, cols: 12, vipRows: ['G', 'H'] },
    { id: hall3.lastInsertRowid, rows: 6, cols: 10, vipRows: ['E', 'F'] },
];

const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const insertSeat = db.prepare(`INSERT INTO seats (hall_id, row_letter, seat_number, seat_type, price_multiplier) VALUES (?, ?, ?, ?, ?)`);

const insertSeatsTx = db.transaction((halls) => {
    for (const hall of halls) {
        for (let r = 0; r < hall.rows; r++) {
            const rowLetter = rowLetters[r];
            const isVip = hall.vipRows.includes(rowLetter);
            for (let c = 1; c <= hall.cols; c++) {
                insertSeat.run(hall.id, rowLetter, c, isVip ? 'vip' : 'standard', isVip ? 1.5 : 1.0);
            }
        }
    }
});
insertSeatsTx(halls);
console.log('✓ Seats inserted');

const movieIds = db.prepare('SELECT id FROM movies').all().map(r => r.id);
const times = [
    { hour: 10, minute: 0, price: 350 },
    { hour: 13, minute: 0, price: 350 },
    { hour: 16, minute: 0, price: 400 },
    { hour: 19, minute: 0, price: 450 },
    { hour: 21, minute: 30, price: 500 },
];
const hallIds = halls.map(h => h.id);
const insertSession = db.prepare(`INSERT INTO sessions (movie_id, hall_id, start_time, base_price) VALUES (?, ?, ?, ?)`);

const insertSessionsTx = db.transaction(() => {
    for (let day = 0; day < 7; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day);
        date.setHours(0, 0, 0, 0);
        for (const movieId of movieIds) {
            for (let t = 0; t < times.length; t++) {
                const time = times[t];
                const sessionDate = new Date(date);
                sessionDate.setHours(time.hour, time.minute, 0, 0);
                if (sessionDate <= new Date()) continue;
                const hallId = hallIds[t % hallIds.length];
                insertSession.run(movieId, hallId, sessionDate.toISOString(), time.price);
            }
        }
    }
});
insertSessionsTx();
console.log('✓ Sessions inserted');

const sessions = db.prepare('SELECT id, hall_id FROM sessions').all();
const insertSessionSeat = db.prepare(`INSERT INTO session_seats (session_id, seat_id, status) VALUES (?, ?, ?)`);

const insertSessionSeatsTx = db.transaction((sessions) => {
    for (const session of sessions) {
        const seats = db.prepare('SELECT id FROM seats WHERE hall_id = ?').all(session.hall_id);
        for (const seat of seats) {
            const isOccupied = Math.random() < 0.15;
            insertSessionSeat.run(session.id, seat.id, isOccupied ? 'sold' : 'available');
        }
    }
});
insertSessionSeatsTx(sessions);
console.log('✓ Session seats populated');

const bcrypt = require('bcrypt');
const adminHash = bcrypt.hashSync('admin123', 10);
const userHash = bcrypt.hashSync('user123', 10);
const johnHash = bcrypt.hashSync('password123', 10);

db.prepare(`INSERT INTO users (name, email, password_hash, role) VALUES ('Админ', 'admin@cineselect.com', ?, 'admin'), ('Пользователь', 'user@cineselect.com', ?, 'user'), ('Джон', 'john@example.com', ?, 'user')`).run(adminHash, userHash, johnHash);
console.log('✓ Test users inserted');

console.log('\nDatabase seeded successfully!');
db.close();
