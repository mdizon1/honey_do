// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                      TEST INITS
// Just some stuff to ensure that things are installed and working properly
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var _ = require('lodash');
_.times(5, function(i) {
  console.log(i);
});

// DEV_NOTE: to prove that babel install is working ?
//  the => syntax seems to work
var foo = [1,2,3,4,5];
foo = foo.map(v => v*2);
console.log(foo);

foo = _.map(foo, (v => v/2));
console.log(foo);

//                        END TEST INITS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
