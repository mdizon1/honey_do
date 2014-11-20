HoneyDo.Models.Todo = Backbone.Model.extend({
  paramRoot: 'todo',

  defaults: {
    title: null,
    notes: null
  }
});


HoneyDo.Collections.TodosCollection = Backbone.Collection.extend({
  model: HoneyDo.Models.Todo,
  url: '/todos'
});
