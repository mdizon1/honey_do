require('expose?$!expose?jQuery!jquery'); // adds $ to window so we can jquery in global scope
require('bootstrap-loader');

// DEV_NOTE: This works.  I can move some of this off to the loaders section of 
// configuration which allows me to omit the !style!css!sass bit
//var css = require("!style!css!sass!./../../assets/stylesheets/foo.scss");
require("./../../assets/stylesheets/application.scss");
 
var _ = require('lodash');
_.times(5, function(i) {
  console.log(i);
});



// DEV_NOTE: to prove that babel install is working ?
//  the => syntax seems to work
var foo = [1,2,3,4,5,6];
foo = foo.map(v => v*2);
console.log(foo);

foo = _.map(foo, (v => v/2));
console.log(foo);
