HoneyDo.Views.Todos ? null : HoneyDo.Views.Todos = {};

HoneyDo.Views.Todos.CompletableWidgetView = Backbone.View.extend({
  template: JST["backbone/templates/todos/completable_widget_view"],

  events: { },

  tagName: "div",

  initialize: function (options){
    this.options = options;
    this._setupViewOptions();
    this._initializeCollections();
    this._setupModals();
    this._initializeFlash();
    this._attachListeners();
    this.render();
  },

  //destroy: function (){ },

  render: function (){
    this.$el.html(this.template(this.view_options));

    this._initializeSubViews();
    this._renderSubViews();
  },

  updateFlash: function (options){
    this.flash.update(options)
    this.flash.render();
  },

  //private

  _attachListeners: function (){
    var self = this;

    this.pending_collection.each(function (todo){
      self._attachListenersToTodo(todo);
    });

    this.completed_collection.each(function (todo){
      self._attachListenersToTodo(todo);
    });

    this.pending_collection.on("add", function (model, collection, options){
      self._attachListenersToTodo(model);
    });
  },

  _attachListenersToTodo: function (todo){
    todo.on("todoCompleted", this._todoComplete.bind(this));
    todo.on("todoUncompleted", this._todoUncomplete.bind(this));
    todo.on("todoAccepted", this._todoAccepted.bind(this));
    todo.on("destroy", this._todoDestroyed.bind(this));
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

  _initializeFlash: function (){
    this.flash = new HoneyDo.Views.Flash();
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

  _renderSubViews: function (){
    this._pending_view.render();
    this._completed_view.render();
  },

  _setupModals: function (){
    this._new_todo_view = new HoneyDo.Views.Todos.TodoNewView({ 
      klass: "Completable::Todo",
      collection: this.pending_collection
    });
  },

  _setupViewOptions: function (){
    this.view_options = _.pick(this.options, "can_administrate_household");
  },

  _todoAccepted: function (evt){
    this.completed_collection.remove(evt.model);
    this.updateFlash({notice: "The todo was accepted and removed"});
  },

  _todoComplete: function (evt){
    this.completed_collection.add(evt.model);
    this.pending_collection.remove(evt.model);
    this.updateFlash({notice: evt.notice});
  },

  _todoDestroyed: function (evt){
    this.updateFlash({notice: "The todo item was removed"});
  },

  _todoUncomplete: function (evt){
    this.pending_collection.add(evt.model);
    this.completed_collection.remove(evt.model);
    this.updateFlash({notice: evt.notice});
  }
});
