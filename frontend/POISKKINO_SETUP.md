# Настройка PoiskKino API для CineSelect

## Получение API ключа

1. Зарегистрируйтесь на [PoiskKino](https://poiskkino.dev/)
2. Перейдите в личный кабинет или телеграм бот @poiskkinodev_bot для получения токена
3. Скопируйте ваш API токен

## Настройка проекта

1. Откройте файл `.env` в папке `frontend/`:
```bash
VITE_POISKKINO_TOKEN=DE6VTGR-X9KMDQH-GYJGRVY-6NG562K
```

2. Перезапустите dev-сервер:
```bash
npm run dev
```

## Использование API

API автоматически используется при загрузке фильмов:
- **Сейчас в кино** - `/movies?filter=now-playing`
- **Скоро** - `/movies?filter=upcoming`
- **Поиск** - `/movies/search?q=название`

Если API недоступен или токен не указан, приложение автоматически переключается на mock-данные из `data/db.json`.

## Endpoints

API использует PoiskKino API v1.5 (cursor-based) и v1.4 (для получения фильма по ID).

### Получить популярные фильмы
```typescript
const movies = await poiskkinoApi.getPopular(20);
```

### Получить фильмы по году
```typescript
const movies = await poiskkinoApi.getByYear(2024, 20);
```

### Получить фильм по ID (KinoPoisk ID)
```typescript
const movie = await poiskkinoApi.getMovieById(123456);
```

### Поиск фильмов по названию
```typescript
const movies = await poiskkinoApi.searchMovies('Дюна', 20);
```

### Получить фильмы по жанру
```typescript
const movies = await poiskkinoApi.getByGenre('Фантастика', 20);
```

## Параметры запроса

API v1.5 поддерживает следующие параметры:

- `limit` - количество результатов (1-250)
- `year` - год выпуска (например, `2024` или `2020-2024`)
- `genres.name` - жанр (например, `"драма"`, `"комедия"`)
- `rating.kp` - рейтинг Кинопоиск (например, `6-10`)
- `rating.imdb` - рейтинг IMDb
- `query` - поисковый запрос
- `type` - тип (`movie`, `tv-series`, `cartoon`, `anime`)
- `countries.name` - страна
- и многие другие

## Лимиты API

- **Суточный лимит**: зависит от тарифа (проверьте в @poiskkinodev_bot)
- **Максимум в запросе**: 250 фильмов
- **Пагинация**: курсорная (next/prev)

## Структура ответа

API v1.5 возвращает:
```json
{
  "docs": [...],
  "limit": 20,
  "hasNext": true,
  "hasPrev": false,
  "next": "eyJ2Ijpb...]"
}
```

API v1.4 (фильм по ID) возвращает объект фильма.

## Поля фильма

Каждый фильм содержит:
- `id` - ID KinoPoisk
- `name` - название на русском
- `enName` - название на английском
- `alternativeName` - альтернативное название
- `description` - описание
- `shortDescription` - краткое описание
- `year` - год выпуска
- `movieLength` - продолжительность в минутах
- `rating.kp` - рейтинг Кинопоиск
- `rating.imdb` - рейтинг IMDb
- `genres` - жанры
- `countries` - страны
- `persons` - персоны (актёры, режиссёры)
- `posters.url` - постер
- `backdrop.url` - фон
