(function(window, document) {

    var stack = [];

    var waitor = {
      interval: 300,
      timeout: false,
      on: function(what, fn) {
        stack.push({
          type: what.slice(0,7) === 'window.' ? 'variable' : 'selector',
          require: what,
          callback: fn
        });
        this.flush();
      },
      flush: function() {
        var item,
          search,
          i = 0,
          il = stack.length,
          parts, j, jl;
        for (; i<il; i++) {
          switch (stack[i].type) {
            case 'selector':
              item = document.querySelectorAll(stack[i].require);
              if (!item.length) continue;
              break;
            case 'variable':
              search = window;
              parts = stack[i].require.split('.');
              for (j=1, jl=parts.length; j<jl; j++) {
                if (!search[parts[j]]) {
                  search = false;
                  break;
                }
                search = search[parts[j]];
              }
              item = search;
              if (!search) continue;
              break;
          }
          stack[i].callback(item);
          stack.splice(i, 1);
        }
        clearTimeout(this.timeout);
        if (stack.length) {
          this.timeout = setTimeout(this.flush.bind(this), this.interval);
        }
      }
    };

    window.waitor = {
      on: waitor.on.bind(waitor)
    };

})(window, document);