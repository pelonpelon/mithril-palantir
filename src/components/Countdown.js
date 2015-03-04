app = {};

app.vm = (function() {
    var vm = {};
    vm.init = function() {
      vm.timerSetIntervalId = m.prop(0);
      vm.secondsLeft = m.prop(10);
      vm.startCountdown = function() {
        function tickDown() {
          if (vm.secondsLeft() <= 0) {
            vm.stopCountdown();
            return;
          }
          vm.secondsLeft(vm.secondsLeft() - 1);
          m.redraw();
        }
        vm.timerSetIntervalId(setInterval(tickDown, 1000));
      }
      vm.stopCountdown = function() {
        clearInterval(vm.timerSetIntervalId());
        vm.timerSetIntervalId(0);
      }
      vm.isRunning = function() {
        return vm.timerSetIntervalId() != 0;
      }
      vm.toggleCountdown = function() {
        vm.isRunning() ? vm.stopCountdown() : vm.startCountdown();
      }
      vm.buttonText = function() {
        return vm.isRunning() ? 'Stop' : 'Start';
      }
    }
    return vm
}());

app.controller = function() {
  app.vm.init();
};
app.view = function() {
  return m('div', [
   m("h1", app.vm.secondsLeft()),
   m("button", {onclick: app.vm.toggleCountdown }, app.vm.buttonText())
  ]);
}

module.exports = app;

// m.module(document, {controller: app.controller, view: app.view});
// var Countdown = {};

// Countdown.model = function () {

// };

// Countdown.vm = (function() {
  // var vm = {};

  // vm.init = function() {
    // vm.countdown = m.prop( [new Countdown.model()] );
  // };

  // return vm;
// })();

// Countdown.controller = function() {
  // var vm = Countdown.vm;
// };

// Countdown.view = function(ctrl) {
  // var vm = Coun.vm;
  // return m('.countdown', {attributes}, 'Countdown';
  // );
// };

// m.module(document.getElementsByClassName('countdown')[0], Countdown);

// module.exports = Countdown;

