HoneyDo.Views.Todos ? null : HoneyDo.Views.Todos = {};


HoneyDo.Views.Todos.CompletableShowView = Backbone.View.extend({
  template: JST["backbone/templates/todos/completable_show"],

  events: { 
    "click [data-action='complete']": "complete",
    "click [data-action='uncomplete']": "uncomplete",
    "click [data-action='destroy']": "destroy_todo",
    "click [data-action='accept']": "accept"
  },

  tagName: "tr",

  className: "todo todo-show",

  initialize: function (options){ },

  render: function (){
    this.$el.html(this.template(this.model.attributes));
  },

  //private

  accept: function (e){
    e.preventDefault();
    console.log("DEBUG: Accept todo");
  },

  complete: function (e){
    e.preventDefault();
    console.log("DEBUG: Complete todo");
  },

  destroy_todo: function (e){
    e.preventDefault();
    console.log("DEBUG: Destroy todo");
  },

  uncomplete: function (e){
    e.preventDefault();
    console.log("DEBUG: Uncomplete todo");
  }
});
