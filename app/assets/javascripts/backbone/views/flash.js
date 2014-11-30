HoneyDo.Views.Flash = Backbone.View.extend({
  template: JST["backbone/templates/flash"],
  events: {},
  tagName: "div",
  className: "flash flash-fixed",

  initialize: function (options){ 
    this.update(options);
  },

  render: function (){
    var view_options;

    view_options = this._prepareViewOptions();
    this.$el.html(this.template(view_options));
    $("#primary-nav").after(this.$el);
    this._highlight();
  },

  clear: function (){
    this.flush();
    this.render();
  },

  flush: function (){
    this.notice     = null;
    this.alert      = null;
    this.warning    = null;
    this.error      = null;
  },

  update: function (options){
    if(!options){return;}
    this.notice     = options.notice;
    this.alert      = options.alert;
    this.warning    = options.warning;
    this.error      = options.error;
  },

  // private

  _highlight: function (){
    //TODO: Implement me

    // an example neon effect
    //text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #ff00de, 0 0 70px #ff00de, 0 0 80px #ff00de, 0 0 100px #ff00de, 0 0 150px #ff00de;
  },

  _prepareViewOptions: function (){
    return {
      notice:   this.notice,
      alert:    this.alert,
      warning:  this.warning,
      error:    this.error
    };
  }
});
