require("expose-loader?$!expose-loader?jQuery!jquery"); // adds $ to window so we can jquery in global scope
require("jquery-ujs");
require("bootstrap-loader");
require("font-awesome-sass-loader");
var _ = require("lodash");

import ScrollTrigger from "../landing/scroll_trigger"
import TouchDeviceBinder from "../landing/touch_device_binder"
import MobileHover from "../landing/mobile_hover"
import NavbarParker from "../nav/navbar_parker"

require("../styles/landing.scss");

window.onload = () => {
  let scrollTrigger = new ScrollTrigger();

  new TouchDeviceBinder(() => {
    new MobileHover(scrollTrigger);
  })
  new NavbarParker();
}
