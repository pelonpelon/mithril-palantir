'use strict';

var heredoc = require('heredoc');
var style = require('insert-css');

var menu = require('./menu.model.js');

menu.view = function (ctrl) {
  return [
    m('div.menu',
      [
        m('ul', [
          ctrl.pages().map(function (page) {
            return m('li',
              [
                m('a.title', { href: page.url, config: m.route }, page.title),
                m('div.note', (page.note || '')),
                m('p.note',
                  [
                    m('span', m('a[href=' + page.link + '][target=_blank]', page.source)),
                    page.author ? m('span', ' by ' + page.author) : ''
                  ])
              ]);
          }),
        ]
          )]
      )];
};

var css = heredoc(function () {/*
.menu ul {
  list-style-type: none;
  padding-left: 0;
}
.menu li {
  padding: 5px 0;
}
.menu .note {
  font-size: smaller;
  margin: 0 0 0 5%;
}
*/});
style(css, {prepend: true});

var el = document.createElement('style');
el.setAttribute('type', 'text/css');
el.innerHTML = style;
var st0 = document.querySelectorAll('link')[0] || document.querySelectorAll('style')[0];
var st0Parent = st0.parentNode || document.head;
st0Parent.insertBefore(el, st0);

module.exports = menu;
