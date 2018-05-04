/** This class handles activation of a function when a given element is
 * scrolled into the center of the screen
 *
 * This class handles "hovering" behavior on touch devices.  The idea is that
 * hovering over an element represents the user's focus/attention on it.  To
 * recreate that without a cursor, the assumption is that an element scrolled
 * into the middle of the screen is what has their focus.  Thus, an element in
 * the center of the screen triggers the hover behavior.  The prerequisite is
 * that there is a css class called 'hover' which contains the same style
 * directives as the :hover pseudo selector.
 *
 * There is a window in the viewport which is considered the active area.  In
 * the center of this is a trigger line.  When an element which has the
 * [data-touch-hover] selector intersects the trigger line, then it gains the
 * hover class.  As long as the element remains within the focus area, it will
 * execute the in or the on behavior (depending on how it was configured). When
 * it is scrolled out it gets the out event.  area.  These can be arranged by
 * groups, elements within the same group can be declared as exclusive and so
 * The behavior will only apply to one of them, otherwise it'll apply to all
 * in the group.
 */
import _ from "lodash"

const TOP_OFFSET = 20;
const BOTTOM_OFFSET = 10;
const SCROLL_EVT_THROTTLE = 300;

function _createEmptyGroup(groupName){
  return {
    groupName: groupName,
    items: []
  };
}

class ScrollTriggerItem {
  constructor(options){
    var {element, onActivate, onDeactivate, isExclusive} = options;
    this.element = element;
    this.onActivate = onActivate;
    this.onDeactivate = onDeactivate;
    this.isExclusive = isExclusive;
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
    this.onActivate();
  }
  deactivate() {
    this.onDeactivate();
    this.isActive = false;
  }
}

export default class ScrollTrigger {

  constructor(){
    this.groups = {};
    this._calculateFocusZone({topOffset: TOP_OFFSET, bottomOffset: BOTTOM_OFFSET});
    $(window).on("scroll", _.throttle(this._handleScroll.bind(this), SCROLL_EVT_THROTTLE));
    $(window).on("resize", _.throttle(this._handleWindowResize.bind(this), 500));
  }

  bindScrollCallback(options) {
    var {element, groupName, isExclusive, callback} = options;

    this._initializeGroupIfNotPresent(groupName);

    this.groups[groupName].items.push(new ScrollTriggerItem(options));
  }

  //private
  _calculateFocusZone(options) {
    var {topOffset, bottomOffset} = options;

    this.topOffset = window.innerHeight * (topOffset / 100);
    this.bottomOffset = window.innerHeight - (window.innerHeight * (bottomOffset / 100));
    this.focusTrigger = (this.topOffset + this.bottomOffset) / 2;
  }


  _createGroup(groupName) {
    this.groups[groupName] = _createEmptyGroup(groupName);
  }

  _findActiveItems(){
    var group_name, out;
    out = [];

    _.each(this.groups, (group, group_name) => {
      out = out.concat(_.filter(group.items, (curr_item) => {
        return curr_item.isActive;
      }));
    });
    return out;
  }

  _initializeGroupIfNotPresent(groupName) {
    if(!(this.groups[groupName] && !_.isEmpty(this.groups[groupName]))){
      this._createGroup(groupName);
    }
  }

  _isRectInFocusZone(rect) {
    return (
      ( // rect is on screen
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
      ) &&
      ( // rect is at least intersected by the focus zone
          rect.top >= this.topOffset ||
       rect.bottom <= this.bottomOffset
      )
    );
  }

  _handleScroll(evt) {
    var rect, self, active_items, $curr_elt, exclusive_group_active, itor;
    self = this;

    // loop over active elements
    // are they in the focus zone?
    //   if not then deactivate
    active_items = this._findActiveItems();
    _.each(active_items, (curr_item, index) => {
      rect = curr_item.element.getBoundingClientRect();
      if(!this._isRectInFocusZone(rect)){
        curr_item.deactivate();
      }
    });

    //loop over all items,
    _.each(this.groups, (curr_group, curr_group_name) => {
      exclusive_group_active = false;

      for(var itor = 0; itor<curr_group.items.length; itor++){
        var curr_item;

        curr_item = curr_group.items[itor];
        rect = curr_item.element.getBoundingClientRect();
        if(!self._isRectInFocusZone) { continue; }
        if(!self._isIntersectedByFocusLine(rect)) { continue; }
        if(curr_item.isActive) { continue; }
        if(curr_item.isExclusive) {
          if(exclusive_group_active){
            // do  nothing if there's already a member of the exclusive group which is active
          }else{
            // disable other active hovers
            _.each(curr_group.items, (disable_curr_item) => {
              if(disable_curr_item.isActive) { disable_curr_item.deactivate(); }
            });
            curr_item.activate();//._activateHover($curr_elt);
            exclusive_group_active=true;

          }
        }else{
          curr_item.activate();//._activateHover($curr_elt);
        }
      }
    });
  }

  _isIntersectedByFocusLine(rect){
    return ( rect.top <= this.focusTrigger
      && rect.bottom >= this.focusTrigger);
  }

  _handleWindowResize(evt) {
    this._calculateFocusZone({topOffset: TOP_OFFSET, bottomOffset: BOTTOM_OFFSET});
  }
}
