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
  }
});

HoneyDo.Collections.TodosCollection = Backbone.Collection.extend({
  model: HoneyDo.Models.Todo,
  url: '/todos'
});
