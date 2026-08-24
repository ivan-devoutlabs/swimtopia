# Starter Theme

Стартова WordPress-тема: Gutenberg-first, `theme.json` як дизайн-система,
кастомні блоки на `@wordpress/scripts`, SCSS-збірка.

## Запуск

```bash
npm install
npm run build      # зібрати блоки + SCSS
npm run start      # режим розробки з watch
```

Для лінтерів PHP додатково: `composer install`.

## Структура

```
├── functions.php          тонкий — лише підключення модулів з inc/
├── theme.json             дизайн-система: кольори, шрифти, відступи
├── inc/
│   ├── setup.php          theme supports, меню, віджети
│   ├── enqueue.php        підключення CSS/JS
│   ├── blocks.php         реєстрація кастомних блоків
│   ├── block-styles.php   стилі ядрових блоків, колірні схеми
│   ├── block-patterns.php категорія патернів
│   └── post-types.php     заготовка CPT (вимкнена)
├── src/
│   ├── blocks/hero/       приклад динамічного блоку
│   └── scss/              вихідні стилі
├── patterns/              патерни (реєструються автоматично)
└── build/                 результат збірки, у git не потрапляє
```

## Як додати блок

1. Скопіюйте `src/blocks/hero/` під новою назвою, змініть `name` у `block.json`
2. Додайте скрипти в `package.json` за зразком `hero` — **разом із `copy:` для `render.php`**
3. Додайте назву блоку в масив `$blocks` у `inc/blocks.php`
4. `npm run build`

## Правила проєкту

- Кольори, відступи й розміри беруться з `theme.json` через
  `var(--wp--preset--*)`. Хардкод ламає перемикання колірних схем.
- Редагувати `src/`, не `build/` і не `assets/css/main.css` — вони
  перезаписуються збіркою.
- Блок, що показує дані з CPT, робіть динамічним (`render.php` +
  `save: () => null`). Статичний `save.js` ламає збережені сторінки
  при зміні розмітки.
- Нова логіка — окремий файл у `inc/`, а не дописування в `functions.php`.

## Підвал

Збирається блоками на сторінці зі слагом `global-footer`. Якщо такої
сторінки немає, виводиться простий запасний варіант із меню `footer`.
