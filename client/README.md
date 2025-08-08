# 📘 Latvian Learning Flashcards (Client)

Здесь я разрабатываю и тестирую функцию сегментации латышских текстов для flashcards2

---

## ⭐️ Запуск приложения

```bash
cd client
# npm install  # в случае если зависимости еще не были установленны
npm run dev
```

После запуска приложение будет доступно по адресу:

```text
http://localhost:5174/
```

---

## 🔬 Тестирование

### ✅ Интеграционные тесты (Jest)

```bash
# Запуск всех unit/integration тестов
npm test -- --silent
```

> ⚠️ Покрытие минимальное. Планируется дополнение.

### 🧪 End-to-End тесты (Cypress)

```bash
# Открыть тесты в GUI-режиме
npm run cypress:open

# Запустить тесты в headless-режиме
npm run cypress:run

# Только тесты, без запуска dev-сервера
npm run cypress:run:only
```

> Сценарии находятся в `client/cypress/e2e/main.cy.ts`

---

## 🪑 Форматирование кода

### 🔧 Автоформатирование

```bash
npm run format           # Всё приложение
npm run format:check     # Только проверка
npm run format:client    # Только клиент
npm run format:server    # Только сервер
```

### 🤦‍♂️ Проверка формата с выводом ошибок

```bash
npm run lint -- --format codeframe         # Всё
npm run lint:client -- --format codeframe  # Только client
npm run lint:server -- --format codeframe  # Только server
```

---

## 🧠 Проверка типов

```bash
npx tsc --noEmit --pretty         # Быстро
npm run type-check                # Одноразовая
npm run type-check:watch          # Watch-режим
```

---
