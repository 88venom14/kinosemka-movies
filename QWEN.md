# CineSelect — Premium Cinema Booking Platform

## Project Overview

**CineSelect** — это современная платформа для бронирования кинобилетов с акцентом на «стерильный» минималистичный дизайн в стиле Apple. Проект использует строгий чёрный фон, точные границы, типографику и плавные микро-взаимодействия вместо визуальных эффектов вроде теней или градиентов.

### Ключевые особенности дизайна
- **Surgical Minimalism**: Чистый чёрный фон (#000000), карточки (#111111), границы 1px (#222222)
- **Типографика**: Inter / System UI с высоким контрастом
- **Анимации**: Framer Motion для fade-ins, staggered lists, scale-up эффектов
- **Цветовые акценты**: #6ba9d5 для VIP-статуса, #C5A059 для VIP-мест

---

## Технологический стек

### Frontend
| Технология | Версия | Назначение |
|------------|--------|------------|
| React | 18.2.0 | UI-библиотека |
| TypeScript | 5.0.2 | Типизация |
| Vite | 4.4.5 | Сборка и dev-сервер |
| Tailwind CSS | 3.3.3 | Стилизация |
| Framer Motion | 10.16.0 | Анимации |
| Zustand | 4.4.0 | Управление состоянием |
| React Router DOM | 6.15.0 | Роутинг |
| Axios | 1.5.0 | HTTP-клиент |

### Backend (планируется)
- Node.js (Express или Fastify) с TypeScript
- JWT-аутентификация
- Интеграция с TMDB API

---

## Структура проекта

```
C:\project\test-proj\
├── README.md                 # Основная документация
├── promt.md                  # Системный промпт и требования
├── QWEN.md                   # Этот файл
├── docs/
│   └── API.md                # Полная API-документация
├── plans/
│   └── architecture_plan.md  # Архитектурный план
└── frontend/
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env / .env.example
    ├── data/
    │   └── db.json           # Mock-данные (фильмы, сеансы, места)
    └── src/
        ├── App.tsx           # Корневой компонент с роутингом
        ├── main.tsx          # Точка входа
        ├── env.d.ts          # TypeScript декларации для Vite
        ├── assets/           # Иконки и изображения
        ├── components/
        │   ├── booking/      # Компоненты бронирования
        │   │   ├── MovieGrid.tsx
        │   │   ├── SessionSelector.tsx
        │   │   ├── SeatSelector.tsx  # Ключевой компонент
        │   │   └── CheckoutSummary.tsx
        │   ├── common/       # Общие UI-компоненты
        │   │   ├── Button.tsx
        │   │   ├── Input.tsx
        │   │   ├── Modal.tsx
        │   │   └── LoadingSpinner.tsx
        │   ├── layout/       # Layout-компоненты
        │   │   ├── Header.tsx
        │   │   ├── Footer.tsx
        │   │   └── Layout.tsx
        │   └── user/         # Компоненты пользователя
        │       ├── Dashboard.tsx
        │       ├── BookingHistory.tsx
        │       └── DigitalTicket.tsx
        ├── hooks/            # Кастомные хуки
        │   ├── useAuth.ts
        │   └── useBookingState.ts
        ├── pages/            # Страницы приложения
        │   ├── Home.tsx
        │   ├── Movies.tsx
        │   ├── BookMovie.tsx
        │   ├── Login.tsx
        │   ├── Register.tsx
        │   └── UserDashboard.tsx
        ├── services/         # API-сервисы
        │   ├── api.ts
        │   ├── authService.ts
        │   └── tmdbService.ts
        ├── stores/           # Zustand stores
        │   └── bookingStore.ts
        ├── styles/           # Глобальные стили
        │   └── globals.css
        ├── types/            # TypeScript типы
        │   └── index.ts
        └── utils/            # Утилиты и константы
            ├── constants.ts
            └── helpers.ts
```

---

## Building and Running

### Установка зависимостей
```bash
cd frontend
npm install
```

### Запуск dev-сервера
```bash
npm run dev
```
Проект откроется на **http://localhost:3000** (порт настроен в `vite.config.ts`)

### Сборка production-версии
```bash
npm run build
```

### Preview production-сборки
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

---

## Design System

### Цветовая палитра (Tailwind config)
```js
colors: {
  'cs-black': '#000000',      // Фон
  'cs-dark': '#111111',       // Карточки
  'cs-border': '#222222',     // Границы
  'cs-text-primary': '#FFFFFF',
  'cs-text-secondary': '#777777',
  'cs-accent': '#6ba9d5',     // Акцент
  'cs-vip': '#C5A059'         // VIP Gold
}
```

### Компоненты (globals.css)
- `.btn-primary` — основная кнопка (акцентный фон)
- `.btn-secondary` — вторичная кнопка (тёмный фон с границей)
- `.card` — карточка (тёмный фон с границей)

### Состояния мест (SeatSelector)
| Состояние | Стиль |
|-----------|-------|
| Available | Тонкая серая обводка, пустое |
| VIP | Приглушённая золотая обводка (#C5A059) |
| Selected | Белая заливка, чёрный текст |
| Occupied | Низкая прозрачность (0.1), не интерактивно |

---

## API Documentation

Полная документация API доступна в [`docs/API.md`](docs/API.md).

### Основные эндпоинты

#### Authentication
- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `GET /api/auth/profile` — профиль (требуется токен)

#### Movies
- `GET /api/movies` — все фильмы
- `GET /api/movies/now-playing` — сейчас в кино (TMDB)
- `GET /api/movies/upcoming` — скоро (TMDB)
- `GET /api/movies/:id` — фильм по ID
- `GET /api/movies/search?q=` — поиск

#### Showtimes
- `GET /api/showtimes` — все сеансы (фильтры: movieId, date)
- `GET /api/showtimes/:id` — сеанс по ID
- `GET /api/showtimes/:id/seats` — места для сеанса

#### Bookings
- `POST /api/bookings` — создать бронирование
- `GET /api/bookings` — бронирования пользователя
- `DELETE /api/bookings/:id` — отменить бронирование

---

## Mock Data

Проект использует mock-данные из `data/db.json`:

### Фильмы (6 шт.)
- Дюна: Часть вторая
- Оппенгеймер
- Бэтмен
- Человек-паук: Через вселенные
- Стражи Галактики. Часть 3
- Джон Уик 4

### Сеансы (15 шт.)
Разные времена, экраны и цены (300-500 ₽)

### Места
- 8 рядов (A-H) × 12 мест = 96 мест на сеанс
- Ряды G, H — VIP (цена × 1.5)

### Тестовые пользователи
| Email | Пароль |
|-------|--------|
| `admin@cineselect.com` | `admin123` |
| `user@cineselect.com` | `user123` |
| `john@example.com` | `password123` |

---

## Development Conventions

### TypeScript
- **Strict mode**: включён (`strict: true`)
- **Module**: ESNext
- **JSX**: react-jsx
- **No emit**: true (только проверка типов)

### Кодстайл
- Функциональные компоненты с TypeScript
- Zustand для глобального состояния
- Tailwind CSS для стилизации
- Framer Motion для анимаций

### Архитектурные принципы
1. **Модульность**: компоненты разделены по папкам (booking, common, layout, user)
2. **Типизация**: все данные типизированы в `types/index.ts`
3. **Сервисный слой**: API-вызовы инкапсулированы в `services/`
4. **State Management**: Zustand store для состояния бронирования

---

## Key Components

### SeatSelector (ключевой компонент)
2D top-down карта мест с:
- Минималистичными квадратами (4px border-radius)
- Состояниями: available, VIP, selected, occupied
- Framer Motion анимациями выбора
- Интеграцией с Zustand store

### Booking Flow
1. Выбор фильма → 2. Выбор сеанса → 3. Выбор мест → 4. Checkout

### User Dashboard
- Активные и прошлые бронирования
- Digital Ticket с QR-кодом (placeholder)

---

## Роутинг

| Страница | Маршрут | Компонент |
|----------|---------|-----------|
| Главная | `/` | Home |
| Фильмы | `/movies` | Movies |
| Бронирование | `/book/:movieId` | BookMovie |
| Вход | `/login` | Login |
| Регистрация | `/register` | Register |
| Личный кабинет | `/dashboard` | UserDashboard |

---

## Environment Variables

```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_TMDB_API_KEY=your_tmdb_api_key
```

---

## Future Enhancements

1. **Backend**: Реализация Node.js/Express API
2. **TMDB Integration**: Получение реальных данных о фильмах
3. **QR-коды**: Генерация QR для билетов
4. **Оплата**: Интеграция платёжных систем
5. **Админ-панель**: Управление сеансами и фильмами

---

**CineSelect** © 2024 — Premium Cinema Booking Experience
