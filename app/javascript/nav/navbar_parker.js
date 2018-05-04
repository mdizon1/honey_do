/* This class sets a nav to be parked when the user is
 * scrolled to the top of the window and sets the nav to
 * fixed when scrolled down.
 */

import _ from "lodash"
const PARKABLE_NAV_SELECTOR = "[data-parkable-nav]";
const DEFAULT_SCROLL_THRESHOLD = 40;
const PARKED_NAV_CLASS = "parked";
const FIXED_NAV_CLASS = "fixed";

     
function setElementFixed($elt){
  $elt.removeClass(PARKED_NAV_CLASS);
  $elt.addClass(FIXED_NAV_CLASS);
}

function setElementParked($elt){
  $elt.removeClass(FIXED_NAV_CLASS);
  $elt.addClass(PARKED_NAV_CLASS);
}

class NavbarParky {
  constructor($element){

    this.$elements = $(PARKABLE_NAV_SELECTOR);
    this.scrollThreshold = DEFAULT_SCROLL_THRESHOLD;

    self.scrollListener = $(window).on("scroll", _.debounce(this.handleScroll, 12));
  }

  handleScroll = (evt) => {
    var self = this;
    let scroll_pos = window.pageYOffset;
    this.$elements.each((curr_index, curr_elt) => {
      let $curr_elt = $(curr_elt);

      if(
        $curr_elt.hasClass(PARKED_NAV_CLASS) 
        && scroll_pos < this.scrollThreshold
      ){
        return; 
      }else if(
        $curr_elt.hasClass(FIXED_NAV_CLASS)
        && scroll_pos >= this.scrollThreshold
      ){
        return;
      }else if(
        $curr_elt.hasClass(PARKED_NAV_CLASS)
        && scroll_pos > this.scrollThreshold
      ){
        setElementFixed($curr_elt);
      }else if(
        $curr_elt.hasClass(FIXED_NAV_CLASS)
        && scroll_pos <= this.scrollThreshold
      ){
        setElementParked($curr_elt);
      }else{
        //throw new Error("Navbar element in bad state ---> ", $curr_elt);
        //not really a problem if we get in here
      }
    });
  }
}

function attachScrollListeners($nav){
  $(PARKABLE_NAV_SELECTOR).each((current_nav) => {
    new NavbarParker($(current_nav));
  });
}

export default class NavbarParker {
  constructor(options) {
    new NavbarParky();
  }
}
