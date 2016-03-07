require('expose?$!expose?jQuery!jquery'); // adds $ to window so we can jquery in global scope

var _ = require('lodash');
_.times(5, function(i) {
  console.log(i);
});
