'use strict';
var heredoc = require('heredoc');
var style = require('insert-css');
var submodule = function(module, args) {
  return module.view.bind(this, new module.controller(args));
};
var Modal = (function() {
  // changing to IIFE instead of 'new function'
  var Modal = {};
  var bind = function(fn, args) {
    return fn.bind(this, args);
  };
  var subview = function() {
  };
  Modal.module = (function(store) {
    // changing to IIFE instead of 'new function'
    return function(module, args) {
      if (arguments.length) {
        store = module;
        if (store) {
          subview = submodule(module);
        }
      }
      return store;
    };
  }());
  Modal.controller = function() {};
  Modal.view = function(ctrl, args) {
    args = args || {};
    return [
      m('.modal', {
        class: [
          Modal.module() ? 'modal-visible' : '',
          args.class
        ].join(' '),
        onclick: bind(Modal.module, null),
        config: Modal.config()
      }, [m('.modal-dialog', [
          m('a.modal-close[href=javascript:;]', { onclick: bind(Modal.module, null) }, '\xD7'),
          subview()
        ])]),
      m('.modal-overlay')
    ];
  };
  Modal.config = function() {
    return function(element, isInitialized, context) {
      if (!isInitialized) {
        var handleKey = function(e) {
          if (e.keyCode == 27) {
            Modal.module(null);
            m.redraw();
          }
        };
        document.body.addEventListener('keyup', handleKey);
        context.onunload = function() {
          document.body.removeEventListener('keyup', handleKey);
        };
      }
    };
  };
  return Modal;
}());
// demo originally required a complete module, now the module is created (sm)
var demo = function(inner) {
  var sm = {
    controller: function() {
    },
    view: function() {
      return inner;
    }
  };
  var demo = {};
  demo.controller = function() {
    this.modal = submodule(Modal);
  };
  demo.view = function(ctrl) {
    return [
      m('button[type=button]', { onclick: Modal.module.bind(this, sm) }, 'Click to show modal'),
      ctrl.modal({ class: 'modal-animation-8' })
    ];
  };
  return demo;
};
// export Modal and submodule for more control
module.exports = { demo: demo };
var css = heredoc(function() {
});
style(css, { prepend: true });
