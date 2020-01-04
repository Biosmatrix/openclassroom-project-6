// eslint-disable-next-line no-extend-native,func-names
Function.prototype.bind =
  Function.prototype.bind ||
  // eslint-disable-next-line func-names
  function(target) {
    const self = this;
    // eslint-disable-next-line func-names
    return function(args) {
      if (!(args instanceof Array)) {
        // eslint-disable-next-line no-param-reassign
        args = [args];
      }
      self.apply(target, args);
    };
  };

// eslint-disable-next-line func-names
(function() {
  if (
    typeof window.Element === 'undefined' ||
    'classList' in document.documentElement
  ) {
    return;
  }

  const { prototype } = Array;
  const { push } = prototype;
  const { splice } = prototype;
  const { join } = prototype;

  function DOMTokenList(el) {
    this.el = el;
    // The className needs to be trimmed and split on whitespace
    // to retrieve a list of classes.
    const classes = el.className
      .replace(/^\s+|\s+$/g, '')
      .split(/\s+/);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < classes.length; i++) {
      push.call(this, classes[i]);
    }
  }

  DOMTokenList.prototype = {
    add(token) {
      if (this.contains(token)) return;
      push.call(this, token);
      this.el.className = this.toString();
    },
    contains(token) {
      // eslint-disable-next-line eqeqeq
      return this.el.className.indexOf(token) !== -1;
    },
    // item(index) {
    //   return this[index] || null;
    // },
    remove(token) {
      let i;
      if (!this.contains(token)) return;
      // eslint-disable-next-line no-plusplus
      for (i = 0; i < this.length; i++) {
        if (this[i] === token) break;
      }
      splice.call(this, i, 1);
      this.el.className = this.toString();
    },
    toString() {
      return join.call(this, ' ');
    },
    toggle(token) {
      if (!this.contains(token)) {
        this.add(token);
      } else {
        this.remove(token);
      }

      return this.contains(token);
    }
  };

  window.DOMTokenList = DOMTokenList;

  function defineElementGetter(obj, prop, getter) {
    if (Object.defineProperty) {
      Object.defineProperty(obj, prop, {
        get: getter
      });
    } else {
      // eslint-disable-next-line no-restricted-properties,no-underscore-dangle
      obj.__defineGetter__(prop, getter);
    }
  }

  // eslint-disable-next-line func-names
  defineElementGetter(HTMLElement.prototype, 'classList', function() {
    return new DOMTokenList(this);
  });
})();

// eslint-disable-next-line func-names
(function() {
  let lastTime = 0;
  const vendors = ['webkit', 'moz'];
  // eslint-disable-next-line no-plusplus
  for (
    let x = 0;
    x < vendors.length && !window.requestAnimationFrame;
    // eslint-disable-next-line no-plusplus
    ++x
  ) {
    window.requestAnimationFrame =
      window[`${vendors[x]}RequestAnimationFrame`];
    window.cancelAnimationFrame =
      window[`${vendors[x]}CancelAnimationFrame`] ||
      window[`${vendors[x]}CancelRequestAnimationFrame`];
  }

  if (!window.requestAnimationFrame) {
    // eslint-disable-next-line func-names
    window.requestAnimationFrame = function(callback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(() => {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    // eslint-disable-next-line func-names
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})();
