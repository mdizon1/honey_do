HoneyDo.Views.Todos ? null : HoneyDo.Views.Todos = {};

HoneyDo.Views.Todos.CompletableWidgetView = Backbone.View.extend({
  template: JST["backbone/templates/todos/completable_widget_view"],

  events: { },

  tagName: "div",

  initialize: function (options){
    this.options = options;
    this._setupViewOptions();
    this._initializeCollections();
    this._attachListeners();
    this.render();
  },

  //destroy: function (){ },

  render: function (){
    this.$el.html(this.template(this.view_options));

    this._initializeSubViews();
    this._pending_view.render();
    this._completed_view.render();
  },

  //private

  _attachListeners: function (){
    var self = this;
    //self.on("todoCompleted", this._todoComplete);
    this.pending_collection.each(function (todo){
      todo.on("todoCompleted", self._todoComplete.bind(self));
    });
  },

  _initializeCollections: function (){
    this.pending_collection = new HoneyDo.Collections.TodosCollection(this.options.pending_completables);
    this.completed_collection = new HoneyDo.Collections.TodosCollection(this.options.complete_completables); 
  },

  _initializeCompletedView: function (){
    this._completed_view = new HoneyDo.Views.Todos.CompletableListView({
      el: this.$el.find(".completed-list-container"),
      collection: this.completed_collection
    });
  },

  _initializePendingView: function (){
    this._pending_view = new HoneyDo.Views.Todos.CompletableListView({
      el: this.$el.find(".pending-list-container"),
      collection: this.pending_collection
    });
  },

  _initializeSubViews: function (){
    // Note: Might want to destroy sub views here if this was being rendered again.
    this._initializePendingView();
    this._initializeCompletedView();
  },

  _setupViewOptions: function (){
    this.view_options = _.pick(this.options, "can_administrate_household");
  },

  _todoAccepted: function (evt){
    // Remove the todo from the completed collection
  },

  _todoComplete: function (evt){
    // Remove the todo from the pending collection and move it to the completed collection
    this.completed_collection.add(evt.model);
    this.pending_collection.remove(evt.model);
    // rerender the views
  },

  _todoUncomplete: function (){
  }
});