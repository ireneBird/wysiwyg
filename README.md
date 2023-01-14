# DINOWIG 
## WYSIWIG - Editor

WYSIWIG редактор для редактирования текста

[Быстрый старт](#Быстрый-старт)

<br>

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


