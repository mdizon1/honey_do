HoneyDo.Models.Todo = Backbone.Model.extend({
  paramRoot: 'todo',

  defaults: {
    title: null,
    notes: null,
    permissions: {
      can_complete: false,
      can_uncomplete: false,
      can_destroy: false,
      can_accept: false
    }
  },

  accept: function (){
    $.ajax({
      url: "/household/todos/" + this.id + "/accept",
      type: "PUT",
      dataType: 'json',
      complete: function (jqXHR, textStatus){
      },
      success: function (){
      },
      error: function (){
      }
    });
  }, 

  complete: function (){
    var self = this;
    return $.ajax({
      url: "/household/todos/" + this.id + "/complete",
      type: "PUT",
      dataType: 'json',
      complete: function (jqXHR, textStatus){
      },

      success: function (data, textStatus, jqXHR){

        self.set(data.model) // update the attributes of the model

        self.trigger("todoCompleted", {notice: data.notice, model: self});
      },

      error: function (jqXHR, textStatus, errorThrown){
      },
    });
  },

  uncomplete: function (){
    $.ajax({
      url: "/household/todos/" + this.id + "/uncomplete",
      type: "PUT",
      dataType: 'json',
      complete: function (jqXHR, textStatus){
      },
      success: function (data, textStatus, jqXHR){
      },
      error: function (jqXHR, textStatus, errorThrown){
      },
    });
  }
});

HoneyDo.Collections.TodosCollection = Backbone.Collection.extend({
  model: HoneyDo.Models.Todo,
  url: '/todos'
});
