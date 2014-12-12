HoneyDo.Views.Todos ? null : HoneyDo.Views.Todos = {};


HoneyDo.Views.Todos.CompletableShowView = Backbone.View.extend({
  template: JST["backbone/templates/todos/completable_show_view"],

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
    this.model.accept();
  },

  complete: function (e){
    var jqXHR, self;
    self = this;
    e.preventDefault();
    jqXHR = this.model.complete();
    jqXHR.done(function (data, textStatus, jqXHR){
      // self.remove();
    }).fail(function (){
      // flash red
    });
  },

  destroy_todo: function (e){
    e.preventDefault();
    this.model.destroy();
  },

  uncomplete: function (e){
    e.preventDefault();
    this.model.uncomplete();
  }
});
