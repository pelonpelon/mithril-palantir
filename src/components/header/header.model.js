'use strict';

var header = {};

header.vm = (function () {
  var vm = {};

  vm.init = function () {
    vm.title = 'Mithril Patterns';
    vm.subtitle = 'Conventions and best practices collected from the internet';

    // nothing

    return vm;
  };

  return vm;
}());

module.exports = header;
