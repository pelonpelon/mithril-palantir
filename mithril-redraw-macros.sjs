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
  case { $_ $name:ident ($params (,) ...) {$body ...} } => {

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
        $body ...
      }
    }
  }
  case { $_ } => { return #{function} }
}
export function

let if = macro {

  case { $_ ( typeof $data.$attrs.$config === $FUNCTION ) { $body ... } } => {
    if (#{$FUNCTION}[0].token.value === 'FUNCTION') {
      console.log('made it')
      return #{
        if ( typeof $data.$attrs.$config === 'function' ) {
          $data.$attrs.config0 = $data.$attrs.$config;
          $data.$attrs.$config = function(args){
            $data.$attrs.config0(this, args);
            /* highlight(el, isInit, context); */
          }
          $body ...
        }
      }
    }
  }
  case {if} => { return #{if} }
}
export if
