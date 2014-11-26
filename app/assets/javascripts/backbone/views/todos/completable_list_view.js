HoneyDo.Views.Todos ? null : HoneyDo.Views.Todos = {};

HoneyDo.Views.Todos.CompletableListView = Backbone.View.extend({
  template: JST["backbone/templates/todos/completable_list_view"],

  events: { },

  tagName: "div",

  initialize: function (options){
    //this._buildViewsForCollection();
    this._setupViewOptions();
    this._bindListeners();
  },

  render: function (){
    var self = this;
    this.$el.html(this.template(this.view_options));
    this._buildViewsForCollection();
    _.each(this.views, function (view){
      view.render();
      self.$el.find("tbody").append(view.$el);
    });
  },

  //private

  _bindListeners: function (){
    this.collection.on("add remove reset sort", this.render.bind(this));
  }, 

  _buildViewsForCollection: function (){
    this._clearViews();
    this.views = this.collection.map(function(item){
      return new HoneyDo.Views.Todos.CompletableShowView({model: item});
    });
  },

  _clearViews: function (){
    if(!this.views){return;}
    _.each(this.views, function(v){
      v.remove();
      v = null;
    });
  },

  _setupViewOptions: function (){
    this.view_options = {};    // Nothing yet
  }
});
