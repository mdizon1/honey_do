require('expose?$!expose?jQuery!jquery'); // adds $ to window so we can jquery in global scope

// DEV_NOTE: This works.  I can move some of this off to the loaders section of 
// configuration which allows me to omit the !style!css!sass bit
//var css = require("!style!css!sass!./../../assets/stylesheets/foo.scss");
require("./../../assets/stylesheets/application.scss");
 
var _ = require('lodash');
_.times(5, function(i) {
  console.log(i);
});
