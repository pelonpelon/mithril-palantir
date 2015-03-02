// app.js
'use strict';

var config = require('../gulp-config.js');
var VERSION = config.version;
require('./styles/app.styl');

window.m = require('../mithril-palantir.js');
// window.m = require('mithril');

var header = require('./components/header/header.controller.js');
m.module(document.getElementById('header'), header);

var menu = require('./components/menu/menu.controller.js');
m.module(document.getElementById('menu'), menu);

var footer = require('./components/footer/footer.controller.js');
m.module(document.getElementById('footer'), footer);

var intro = require('./components/intro.js');
var example = require('./components/example.js');
var animation = require('./components/animation.js');
var components = require('./components/components_organization.js');
var binding = require('./components/bi-directional_data-binding.js');
var modal = require('./components/modal.js').demo;

m.route(document.getElementById('content'), '/', {
  '/': intro,
  '/example': example,
  '/animation': animation,
  '/components': components,
  '/binding': binding,
  '/modal': modal(m('div', 'There\'s more to this Hobbit than meets the eye.'))
});
