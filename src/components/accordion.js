'use strict';
// accordion.js

var heredoc = require('heredoc');
var style = require('insert-css');

var accordion = function(url) {
  return {
    controller: function() {
      var _this = this;
      m.request({method: 'GET', url: url}).then(function(data) {
        _this.data = data;
      });
      this.toggle = function(id) {
        this.open = id;
      };
    },
    view: function(ctrl) {
      return !ctrl.data
      ? m('loading....')
      : m('.accordion', ctrl.data.map(function(line, id) {
        return m('div', {onclick:ctrl.toggle.bind(ctrl, id)}, [
          line[0],
          m('div', {style:'display:' + (ctrl.open === id ? 'block' : 'none')}, line[1])
        ]);
      }));
    }
  };
};

module.exports = accordion;

// m.module(document.getElementById('app'),{
  // view:function(ctrl){
    // return m(accordion('../assets/accordion.json'),{style:{background:'red'}});
  // }
// });

var css = heredoc(function() {/*
.accordion {
  width:150px;
  background-color:#ddd;
}
.item {padding:5px};
.item div {background-color:white;padding 1px;}
*/
});

style(css, { prepend: true });
