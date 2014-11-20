HoneyDo.Views.Todos ? null : HoneyDo.Views.Todos = {};

HoneyDo.Views.Todos.CompletableListView = Backbone.View.extend({
  template: JST["backbone/templates/todos/completable_list_view"],

  events: { },

  tagName: "div",

  initialize: function (options){
    this.options = options;
    this.el = $(options.container)[0];
    // setup configuration
    // initialize collections
    // initialize pending list view
    // initialize completed list view
    // render self
    this.render();
  },

  destroy: function (){ },

  render: function (){
    console.log("DEBUG: render being called on completable_list_view");
  }

  //private
});
