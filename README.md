# waitor

```js

waitor.on('.modal-tabbar li:nth-child(2)', function(el) {
 $(el).trigger('click');
});

waitor.on('window.foo.a', function(v) {
  console.log(v);
});

setTimeout(function() {
  window.foo = {
    a: 'hello world'
  };
}, 500);
```
