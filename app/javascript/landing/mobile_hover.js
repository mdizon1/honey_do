//const TOP_OFFSET = 20;
//const BOTTOM_OFFSET = 10;
//const SCROLL_EVT_THROTTLE = 300;

const HOVER_ITEM_SELECTOR = "[data-touch-hover]";
const TRIGGER_GROUP_NAME = "touch_scroll_hover";

/**
 * This class handles mimicking the hover behavior using scrolling
 */
export default class MobileHover {
  constructor(triggerController){
    var self = this;

    _.each($(HOVER_ITEM_SELECTOR), (curr_elt, index) => {
      triggerController.bindScrollCallback({
        element: curr_elt,
        groupName: TRIGGER_GROUP_NAME,
        isExclusive: true,
        onActivate: self._handleActivate.bind(curr_elt),
        onDeactivate: self._handleDeactivate.bind(curr_elt)
      });
    });
  }

  _handleActivate() {
    var elt = this;
    $(elt).addClass("hover");

  }
  _handleDeactivate(element) {
    var elt = this;
    $(elt).removeClass("hover");
  }
}
