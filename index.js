(function(window, document) {

    var stack = [];

    var waitor = {
      interval: 700,
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
        var self = waitor,
          item,
          search,
          callback,
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
          callback = stack[i].callback;
          stack.splice(i-1, 1);
          callback(item);
        }
        clearTimeout(self.timeout);
        if (stack.length && stack.length < 10) {
          self.timeout = setTimeout(self.flush, self.interval);
        }
      }
    };

    window.waitor = {
      on: waitor.on.bind(waitor)
    };

})(window, document);
