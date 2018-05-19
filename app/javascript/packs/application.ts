//require("expose-loader?$!expose-loader?jQuery!jquery"); // adds $ to window so we can jquery in global scope
require("jquery-ujs");
require("bootstrap-loader");
require("font-awesome-sass-loader");

import NavbarParker from "../nav/navbar_parker"

require("../styles/application.scss");

window.onload = () => {
  new NavbarParker();
}
