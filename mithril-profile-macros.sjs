/* 'use strict'; */

macro get_env {
  case { _ ($arg) } => {
    var arg = unwrapSyntax(#{$arg})
    letstx $DEBUG = [makeValue(process.env[arg] || 'false', #{ here })]
    return #{$DEBUG}
  }
}

let function = macro {
    case { $_ $name:ident ($params (,) ...) { $body ... } } => {

      if (#{$name}[0].token.value === 'redraw') {
        return #{
          function $name ($params (,) ...) {
            if (Number(isNaN(get_env('MITHRIL_DEBUG')))) console.profile('REDRAW');

            $body ...;

            if (Number(isNaN(get_env('MITHRIL_DEBUG')))) console.profileEnd('REDRAW');
          }
        }
      }
      return #{ function $name($params (,) ...) { $body ... }
    }
  }
  case { $_ } => { return #{function} }
}
export function

