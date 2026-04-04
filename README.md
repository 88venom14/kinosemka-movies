# Сайт по продаже билетов в кино

Система бронирования кинобилетов на Next.js.

## Требования

- Node.js >= 18.11
- npm

## Запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Заполнение базы данных

```bash
npm run seed
```

### 3. Запуск сервера

```bash
npm run dev
```

**http://localhost:3000**

## Функционал

- Просмотр фильмов (сейчас в кино / скоро)
- Выбор сеанса и мест (обычные и VIP)
- Бронирование билетов
- Личный кабинет с историей бронирований
- Электронный билет с деталями заказа

## Стек

| Технологии | Назначение |
|------------|------------|
| Next.js 14 (Pages Router) | Фреймворк, роутинг, API |
| React 18 + TypeScript | UI компоненты |
| SQLite + better-sqlite3 | База данных |

## Структура проекта

```
src/
├── pages/                  # Страницы и API маршруты
│   ├── _app.tsx            # Обёртка приложения (Layout + стили)
│   ├── index.tsx           # Главная страница
│   ├── movies.tsx          # Каталог фильмов
│   ├── book/[id].tsx       # Бронирование фильма
│   ├── login.tsx           # Страница входа
│   ├── register.tsx        # Страница регистрации
│   ├── dashboard.tsx       # Личный кабинет
│   └── api/                # API маршруты
│       ├── movies.ts       # GET /api/movies, /api/movies/:id
│       ├── showtimes.ts    # GET /api/showtimes
│       ├── seats.ts        # GET /api/seats
│       ├── auth/
│       │   ├── login.ts    # POST /api/auth/login
│       │   ├── register.ts # POST /api/auth/register
│       │   └── profile.ts  # GET /api/auth/profile
│       └── bookings.ts     # GET/POST /api/bookings, DELETE /api/bookings/:id
├── components/             # UI компоненты
│   ├── Button.tsx          # Кнопка
│   ├── Input.tsx           # Поле ввода
│   ├── Modal.tsx           # Модальное окно
│   ├── LoadingSpinner.tsx  # Индикатор загрузки
│   ├── Header.tsx          # Шапка
│   ├── Footer.tsx          # Подвал
│   ├── Layout.tsx          # Обёртка страницы
│   ├── SeatSelector.tsx    # Выбор мест
│   ├── Dashboard.tsx       # Виджет аккаунта
│   ├── BookingHistory.tsx  # История бронирований
│   └── DigitalTicket.tsx   # Электронный билет
├── lib/
│   └── db.ts               # Подключение к SQLite
├── stores/                 # Zustand stores
│   ├── authStore.ts        # Состояние авторизации
│   └── bookingStore.ts     # Состояние бронирования
├── types/
│   └── index.ts            # TypeScript типы
└── styles/
    └── globals.css         # Глобальные стили
```


