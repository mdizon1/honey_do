HoneyDo.Views.Todos ? null : HoneyDo.Views.Todos = {};

HoneyDo.Views.Todos.CompletableListView = Backbone.View.extend({
  template: JST["backbone/templates/todos/completable_list_view"],

  events: { },

  tagName: "div",

  initialize: function (options){
    this._buildViewsForCollection();
    this._setupViewOptions();
  },

  //destroy: function (){},

  render: function (){
    var self = this;
    this.$el.html(this.template(this.view_options));
    _.each(this.views, function (view){
      view.render();
      self.$el.find("tbody").append(view.$el);
    });
  },

  //private

  _buildViewsForCollection: function (){
    this.views = this.collection.map(function(item){
      return new HoneyDo.Views.Todos.CompletableShowView({model: item});
    });
  },

  _setupViewOptions: function (){
    this.view_options = {};    // Nothing yet
  }
});
