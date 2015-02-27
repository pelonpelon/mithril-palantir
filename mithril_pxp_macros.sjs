/* 'use strict'; */

macro to_str {
  case { _ ($toks ...) } => {
    return [makeValue(#{ $toks ... }.map(unwrapSyntax).join(''), #{ here })];
  }
}

macro get_env {
  case { _ ($arg) } => {
    var arg = unwrapSyntax(#{$arg})
    letstx $DEBUG = [makeValue(process.env[arg] || 'false', #{ here })]
    return #{$DEBUG}
  }
}

let function = macro {
  case infix { $m.$method = | $_ ($params (,) ...) {$body ...} } => {

      if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.log(to_str($method) + '()', $m.$method.arguments)

    if (#{m}[0].token.value === 'm' && #{$method}[0].token.value === 'module') {
    // can't get timing because module function returns to caller before end of body
      return #{
        $m.$method = function ($params (,) ...) {
          if (Number(get_env('MITHRIL_DEBUG')) >= 2 ) console.log('m.route() ', m.route());
          /* if (Number(get_env('MITHRIL_DEBUG')) >= 2 ) console.dir($method.controller.prototype); */
          if (Number(get_env('MITHRIL_DEBUG')) >= 2 ) console.log($method.controller.prototype, $m.$method.arguments)
          $body ...;
        }
      }
    }

    if (#{m}[0].token.value === 'm' && #{$method}[0].token.value === 'render') {
      return #{
        $m.$method = function ($params (,) ...) {
          if (Number(get_env('MITHRIL_DEBUG')) >=2) console.time('RENDER');
          if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.log(to_str($method) + '()', $m.$method.arguments)
          if (Number(get_env('MITHRIL_DEBUG')) >=4 ) console.groupCollapsed('m.render() {BODY}');
          $body ...;
          if (Number(get_env('MITHRIL_DEBUG')) >=4 ) console.groupEnd('m.render() {BODY}');
          if (Number(get_env('MITHRIL_DEBUG')) >=2) console.timeEnd('RENDER');
        }
      }
    }

    if (#{m}[0].token.value === 'm' && #{$method}[0].token.value === 'request') {
      return #{
        $m.$method = function ($params (,) ...) {
          if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.log(to_str($method) + '()', $m.$method.arguments)
          if (Number(get_env('MITHRIL_DEBUG')) >= 2) console.time('REQUEST');
          $body ...;
          if (Number(get_env('MITHRIL_DEBUG')) >= 2) console.timeEnd('REQUEST');
        }
      }
    }

    if (#{m}[0].token.value === 'm' && #{$method}[0].token.value === 'startComputation') {
      return #{
        $m.$method = function ($params (,) ...) {
          if (Number(get_env('MITHRIL_DEBUG')) >= 3) console.time('COMPUTATION');
          if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.log(to_str($method) + '()', $m.$method.arguments)
          $body ...
        }
      }
    }

    if (#{m}[0].token.value === 'm' && #{$method}[0].token.value === 'endComputation') {
      return #{
        $m.$method = function ($params (,) ...) {
          if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.log(to_str($method) + '()', $m.$method.arguments)
          $body ...
          if (Number(get_env('MITHRIL_DEBUG')) >= 3) console.timeEnd('COMPUTATION');
        }
      }
    }

    return #{ $m.$method = function ($params (,) ...) {
      if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.log(to_str($method) + '()', $m.$method.arguments)
      $body ...
      }
    }
  }
  case { $_ $name:ident ($params (,) ...) {$body ...} } => {


    if (#{$name}[0].token.value === 'app') {
      return #{
        function $name($params (,) ...) {

          if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.log($name.name.replace(/\$.*/, '') + '()', $name.arguments);
          if (Number(get_env('MITHRIL_DEBUG')) >= 3 ) console.time('TIME SINCE MITHRIL SOURCED')
          $body ...
        }
      }
    }

    if (#{$name}[0].token.value === 'initialize') {
      return #{
        function $name($params (,) ...) {

          if (Number(get_env('MITHRIL_DEBUG')) >= 3 ) {
            function mithrilLoadTime() {
              console.warn('DOMContentLoaded');
              console.timeEnd('TIME SINCE MITHRIL SOURCED');
              console.time('TIME SINCE DOMContentLoaded');
            }
            window.document.onload = addEventListener("DOMContentLoaded", mithrilLoadTime, true)
          }

          if (Number(get_env('MITHRIL_DEBUG')) >= 2 ) {

            function mithrilClickTime() {console.time('CLICK'); console.warn('CLICK HAPPENED')}
            window.onclick = addEventListener("click", mithrilClickTime, true)

            function mithrilChangeTime() {console.time('CHANGE'); console.warn('CHANGE HAPPENED')}
            window.onchange = addEventListener("change", mithrilChangeTime, true)
          }

          if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.log($name.name.replace(/\$.*/, '') + '()', $name.arguments);

          $body ...
        }
      }
    }
    if (#{$name}[0].token.value === 'build') {
      return #{
        function $name($params (,) ...) {
          if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.count('BUILD');
          $body ...
        }
      }
    }
    if (#{$name}[0].token.value === 'redraw') {
      letstx $rdsd = [ makeIdent('_count_diff', #{ $name }) ]
      letstx $rdsa = [ makeIdent('_count_all', #{ $name }) ]
      letstx $rdsn = [ makeIdent('_count_none', #{ $name }) ]
      return #{
        function $name ($params (,) ...) {
          var strategy = m.redraw.strategy();
          if (typeof $name.$rdsd === 'undefined') $name.$rdsd = m.prop(0)
          if (typeof $name.$rdsa === 'undefined') $name.$rdsa = m.prop(0)
          if (typeof $name.$rdsn === 'undefined') $name.$rdsn = m.prop(0)
          if (Number(get_env('MITHRIL_DEBUG')) >= 2) console.time('REDRAW');
          if (Number(get_env('MITHRIL_DEBUG')) >= 2) console.timeStamp('REDRAW BEGIN ')
          if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.log($name.name.replace(/\$.*/, '') + '()', $name.arguments);
          if (Number(isNaN(get_env('MITHRIL_DEBUG')))) console.profile('REDRAW');

          $body ...;

          if (Number(isNaN(get_env('MITHRIL_DEBUG')))) console.profileEnd('REDRAW');
          if (Number(get_env('MITHRIL_DEBUG')) >= 2) console.timeStamp('REDRAW END')
          if (Number(get_env('MITHRIL_DEBUG')) >= 2) console.timeEnd('CLICK');
          if (Number(get_env('MITHRIL_DEBUG')) >= 2) console.timeEnd('CHANGE');
          if (Number(get_env('MITHRIL_DEBUG')) >= 2) console.timeEnd('REDRAW');
          if (Number(get_env('MITHRIL_DEBUG')) >= 3) console.timeEnd('TIME SINCE DOMContentLoaded');
          if ( strategy === 'diff' ) $name.$rdsd( $name.$rdsd() + 1 )
          if ( strategy === 'all' ) $name.$rdsa( $name.$rdsa() + 1 )
          if ( strategy === 'none' ) $name.$rdsn( $name.$rdsn() + 1 )
          console.info($name.name,
          '[' + strategy + ']',
          $name.$rdsd()+'d',
          $name.$rdsa()+'a',
          $name.$rdsn()+'n'
          );
        }
      }
    }
    return #{
      function $name($params (,) ...) {
        if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.log($name.name.replace(/\$.*/, '') + '()', $name.arguments);
        $body ...
      }
    }
  }
  case { $_ } => { return #{function} }
}
export function

let var = macro {
  case { $_ $name = function ($params (,) ...) { $body ... } } => {
    var name = unwrapSyntax(#{$name})
    letstx $fname = [makeValue(name, #{ here })]
    return #{
      var $name = function($params (,) ...) {
        if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.log($fname, $name.arguments);
        $body ...
      }
    }
  }

  case { $_ $name = function $fname ($params (,) ...) { $body ... } } => {
    if (#{$name}[0].token.value === 'm' && #{$fname}[0].token.value === 'app') {
      return #{
        var $name = function $fname($params (,) ...) {
        if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) {
          console.log($name, $name.arguments);
          console.log($fname, $fname.arguments);
        }
        $body ...
        }
      }
    }
    return #{
      var $name = function $fname($params (,) ...) {
      if (Number(get_env('MITHRIL_DEBUG')) >= 4 ) console.log($name, $name.arguments);
      $body ...
      }
    }
  }

  case {var} => { return #{var} }
}
export var

