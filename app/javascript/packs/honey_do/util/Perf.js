// This module has some custom performance debugging methods

export const Perf = {
  _lastCall: null,
  read: function (str) {
    if(!this._lastCall) {
      this._lastCall = Date.now();
      console.log(`D PERF: First call: ${str} __ time: ${this._lastCall}`);
      return;
    }
    let time_gap = Date.now() - this._lastCall;
    console.log(`D PERF: ${str} __ time since last: ${time_gap}`);
    this._lastCall = Date.now();
  }
}
