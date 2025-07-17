# 🚀 Деплой FixDrive на Vercel

## 📋 Подготовка к деплою

### 1. Установка зависимостей
```bash
npm install
```

### 2. Проверка веб-версии локально
```bash
npm run web
```

### 3. Сборка для продакшена
```bash
npm run web:build
```

## 🌐 Деплой на Vercel

### Автоматический деплой (рекомендуется)

1. **Подключите репозиторий к Vercel:**
   - Зайдите на [vercel.com](https://vercel.com)
   - Нажмите "New Project"
   - Выберите ваш GitHub репозиторий `FixDrive`
   - Vercel автоматически определит настройки из `vercel.json`

2. **Настройки проекта:**
   - **Framework Preset:** Expo
   - **Build Command:** `npm run web:build`
   - **Output Directory:** `web-build`
   - **Install Command:** `npm install`

### Ручной деплой

1. **Установите Vercel CLI:**
```bash
npm i -g vercel
```

2. **Войдите в аккаунт:**
```bash
vercel login
```

3. **Деплой:**
```bash
vercel --prod
```

## 🔧 Конфигурация

### vercel.json
```json
{
  "buildCommand": "npm run web:build",
  "outputDirectory": "web-build",
  "framework": "expo",
  "installCommand": "npm install",
  "devCommand": "npm run web"
}
```

### Переменные окружения
В настройках Vercel добавьте:
- `EXPO_PUBLIC_API_URL` - URL вашего API
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` - ключ Google Maps

## 📱 Доступ к приложению

После деплоя ваше приложение будет доступно по адресу:
- **Production:** `https://fixdrive.vercel.app`
- **Preview:** `https://fixdrive-git-main.vercel.app`

## 🔄 Автоматические деплои

- **main branch** → Production
- **feature branches** → Preview deployments

## 🐛 Отладка

### Локальная проверка сборки
```bash
npm run web:build
npx serve web-build
```

### Логи Vercel
```bash
vercel logs
```

## 📝 Примечания

- Приложение использует Expo Web для веб-версии
- Некоторые нативные функции могут не работать в браузере
- Рекомендуется тестировать на мобильных устройствах через Expo Go

## 🚨 Ограничения

- Push-уведомления не работают в браузере
- Некоторые нативные модули могут требовать полифиллов
- Производительность может отличаться от нативной версии 