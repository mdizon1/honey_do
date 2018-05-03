// Wrap up some code to include and instantiate fastclick js
import FastClick from 'fastclick'

// instantiate fastclick js
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}
