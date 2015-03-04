'use strict';

var config = require('../../../gulp-config.js');

//namespace
var menu = {};

//model
menu.PageList = function() {
  return m.request({
    method: 'GET',
    url: config.version + '/assets/menu_items.json'
  });
};

module.exports = menu;
