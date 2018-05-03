require("expose-loader?$!expose-loader?jQuery!jquery"); // adds $ to window so we can jquery in global scope
require("jquery-ujs");
require("bootstrap-loader");
require("font-awesome-sass-loader");

if(process.env.NODE_ENV != 'production') {
  require("../styles/landing.scss");
}
