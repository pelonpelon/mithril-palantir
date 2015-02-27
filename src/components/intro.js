'use strict';

// redraw_all:
function redrawDiff() {
  console.log('forced diff');
  m.startComputation();
  m.redraw.strategy('diff');
  m.endComputation();
}

function redrawAll() {
  console.log('forced all');
  m.startComputation();
  m.redraw.strategy('all');
  m.endComputation();
}

function redrawNone() {
  console.log('forced none');
  m.startComputation();
  m.redraw.strategy('none');
  m.endComputation();
}

var template = [
  m('h2', 'Intro'),
  m('p', 'Open your developer tools vertically to sit side-by-side with the page.'),
  m('p', 'Open the console and refresh the page.'),
  m('ul', { class: 'plain-list'  }, [
    m('li',
      m('a[href="javascript:;"]', { onclick: redrawDiff }, 'redraw with strategy set to "diff"')
      ),
    m('li',
      m('a[href="javascript:;"]', { onclick: redrawAll }, 'redraw with strategy set to "all"')
      ),
    m('li',
      m('a[href="javascript:;"]', { onclick: redrawNone }, 'redraw with strategy set to "none"')
      )
  ])
];

var intro = {};

intro.controller = function () {

};

intro.view = function (ctrl) {
  return [
    m('.intro', template)
  ];
};

module.exports = intro;
