# DINOWIG 
## WYSIWIG - Editor

WYSIWIG редактор для редактирования текста

- [Основной функционал](#Основной-функционал)
- [Быстрый старт](#Быстрый-старт)
- [Демо](#Демо)

<br>

## Основной функционал

- управление набором инструментов
- undo/redo модуль заменяющий браузерный
- использование API Selection и Range, в дополнению к execCommand

## Быстрый старт

-  `git clone https://github.com/ireneBird/wysiwyg.git`

- `npm install`

- `npm run dev`

Пример инициализации редактрора 

```html
<!-- Initialize editor editor -->
<script>
  const editor = new Wysiwyg({
    selector: `.editor`,
    toolbar: [
      'blocks',
      'fonts',
      'bold',
      'italic',
      'underline',
      'strikeThrough',
      'align',
      'undo',
      'redo',
    ],
  });
</script>
```

## Демо

https://dinowig.maffin.pw/


