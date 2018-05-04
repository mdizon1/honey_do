/* This class listens for touch event once after which it fires a callback.
 * It's use is to activate touch specific functionality once a touch is
 * detected
 *
 * TODO: The last thing to implement here is exclusive functionality between
 * touch and non-touch environments.  That is, there would be a listener or
 * listeners that are initially bound which are intended for mouse control, but
 * once a touch is detected we unbind that and activate the callback for touch
 * specific functionality
 */

export default class TouchDeviceBinder {
  constructor(callback) {
    this.callback = callback;
    this._bindListenForTouch(callback)
  }

  //private
  _bindListenForTouch(callback) {
    this.boundFunc = this._handleTouch.bind(this)
    window.addEventListener("touchstart", this.boundFunc);
  }

  _handleTouch(){
    window.removeEventListener("touchstart", this.boundFunc, false);
    this.callback();
  }
}
