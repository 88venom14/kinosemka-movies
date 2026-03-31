import express from 'express';
import session from 'express-session';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/sequelize';
import sequelize, { User, Movie, Hall, Seat, Session, SessionSeat, Booking, BookingItem } from './models.js';

AdminJS.registerAdapter({ Database, Resource });

const app = express();

const admin = new AdminJS({
    databases: [{ sequelize }],
    rootPath: '/admin',
    resources: [
        {
            resource: Movie,
            options: {
                navigation: { name: 'Контент' },
                properties: {
                    description: { type: 'textarea' },
                    poster_url: { type: 'textarea' },
                    backdrop_url: { type: 'textarea' },
                },
            },
        },
        {
            resource: Hall,
            options: { navigation: { name: 'Контент' } },
        },
        {
            resource: Seat,
            options: { navigation: { name: 'Контент' } },
        },
        {
            resource: Session,
            options: {
                navigation: { name: 'Расписание' },
                properties: {
                    start_time: { type: 'datetime' },
                },
            },
        },
        {
            resource: SessionSeat,
            options: {
                navigation: { name: 'Расписание' },
                properties: {
                    reserved_until: { type: 'datetime' },
                },
            },
        },
        {
            resource: Booking,
            options: {
                navigation: { name: 'Бронирования' },
                properties: {
                    total_price: { type: 'number' },
                    created_at: { type: 'datetime' },
                    updated_at: { type: 'datetime' },
                },
            },
        },
        {
            resource: BookingItem,
            options: { navigation: { name: 'Бронирования' } },
        },
        {
            resource: User,
            options: {
                navigation: { name: 'Пользователи' },
                properties: {
                    password_hash: { isVisible: { list: false, filter: false, edit: false, show: false } },
                },
            },
        },
    ],
    locale: {
        translations: {
            labels: {
                User: 'Пользователи',
                Movie: 'Фильмы',
                Hall: 'Залы',
                Seat: 'Места',
                Session: 'Сеансы',
                SessionSeat: 'Места сеансов',
                Booking: 'Бронирования',
                BookingItem: 'Элементы бронирования',
            },
            actions: {
                new: 'Создать',
                edit: 'Редактировать',
                show: 'Просмотр',
                list: 'Список',
                delete: 'Удалить',
                save: 'Сохранить',
            },
            messages: {
                successfullyCreated: 'Запись создана',
                successfullyUpdated: 'Запись обновлена',
                successfullyDeleted: 'Запись удалена',
                thereWereValidationErrors: 'Ошибки валидации',
                forbiddenError: 'Нет прав',
            },
        },
    },
});

app.use(session({
    secret: 'admin-secret-key-change-in-production',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 },
}));

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password) => {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) return false;
            const bcrypt = await import('bcrypt');
            const valid = await bcrypt.compare(password, user.password_hash);
            return valid ? user.toJSON() : false;
        } catch {
            return false;
        }
    },
    cookiePassword: 'admin-cookie-secret-key',
});

app.use(admin.options.rootPath, adminRouter);

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`AdminJS panel: http://localhost:${PORT}/admin`);
});
