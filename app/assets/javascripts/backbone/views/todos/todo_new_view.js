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
    this.$el.html(this.template({klass: this.klass, title: this.options.title}));
    $('body').append(this.$el);
  },

  attachListeners: function (){
    // clear fields when modal is hidden
    this.getModal().on("hidden.bs.modal", this._clearModalFields.bind(this));
  },

  getModal: function (){
    return this.$el.find(".modal")
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
    this.$el.find("[name='new_todo_tags']" ).val("");
  },

  _closeModal: function (){
    this.$el.find(".modal").modal("hide");
  },

  _getValuesFromFields: function (){
    return {
      title: this.$el.find("[name='new_todo_title']").val(),
      notes: this.$el.find("[name='new_todo_notes']").val(),
      tags:  this.$el.find("[name='new_todo_tags']" ).val(),
      klass: this.$el.find("[name='new_todo_klass']").val()
    }
  },
});
