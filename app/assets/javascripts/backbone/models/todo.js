HoneyDo.Models.Todo = Backbone.Model.extend({
  paramRoot: "todo",
  urlRoot: "/household/todos/",

  defaults: {
    title: null,
    notes: null,
    tags: '',
    permissions: {
      can_complete: false,
      can_uncomplete: false,
      can_destroy: false,
      can_accept: false
    }
  },

  accept: function (){
    var self = this;
    $.ajax({
      url: "/household/todos/" + this.id + "/accept",
      type: "PUT",
      dataType: 'json',
      complete: function (jqXHR, textStatus){ },
      success: function (data, textStatus, jqXHR){ 
        self.set(data.model) // update the attributes of the model
        self.trigger("todoAccepted", {notice: data.notice, model: self});
      },
      error: function (jqXHR, textStatus, errorThrown){ },
    });
  }, 

  complete: function (){
    var self = this;
    return $.ajax({
      url: "/household/todos/" + this.id + "/complete",
      type: "PUT",
      dataType: 'json',
      complete: function (jqXHR, textStatus){ },
      success: function (data, textStatus, jqXHR){
        self.set(data.model); // update the attributes of the model
        self.trigger("todoCompleted", {notice: data.notice, model: self});
      },
      error: function (jqXHR, textStatus, errorThrown){ },
    });
  },

  uncomplete: function (){
    var self = this;
    $.ajax({
      url: "/household/todos/" + this.id + "/uncomplete",
      type: "PUT",
      dataType: 'json',
      complete: function (jqXHR, textStatus){ },
      success: function (data, textStatus, jqXHR){ 
        self.set(data.model); // update the attributes of the model
        self.trigger("todoUncompleted", {notice: data.notice, model: self});
      },
      error: function (jqXHR, textStatus, errorThrown){ },
    });
  }
});

HoneyDo.Collections.TodosCollection = Backbone.Collection.extend({
  model: HoneyDo.Models.Todo,
  url: '/household/todos',
});
