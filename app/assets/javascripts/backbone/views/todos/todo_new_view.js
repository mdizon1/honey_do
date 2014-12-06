HoneyDo.Views.Todos ? null : HoneyDo.Views.Todos = {};

HoneyDo.Views.Todos.TodoNewView = Backbone.View.extend({
  template: JST["backbone/templates/todos/todo_new_view"],

  events: { 
    "click button[type='submit']": "submitForm",
  },

  tagName: "div",

  initialize: function (options){
    this.klass = options.klass || "Completable::Todo";
    this.render();
    this.attachListeners();
  },

  render: function (){
    this.$el.html(this.template({klass: this.klass}));
    $('body').append(this.$el);
  },

  attachListeners: function (){
    // clear fields when modal is hidden
    this.$el.find(".modal").on("hidden.bs.modal", this._clearModalFields.bind(this));
  },

  submitForm: function (evt){
    var new_todo_options;

    evt.preventDefault();
    new_todo_options = this._getValuesFromFields();
    this.collection.create(new_todo_options, {wait: true});
    this._closeModal();
  },

  // private
  _clearModalFields: function (){
    this.$el.find("[name='new_todo_title']").val("");
    this.$el.find("[name='new_todo_notes']").val("");
  },

  _closeModal: function (){
    this.$el.find(".modal").modal("hide");
  },

  _getValuesFromFields: function (){
    return {
      title: this.$el.find("[name='new_todo_title']").val(),
      notes: this.$el.find("[name='new_todo_notes']").val()
    }
  },
});
