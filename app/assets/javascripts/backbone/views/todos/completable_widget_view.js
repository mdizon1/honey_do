HoneyDo.Views.Todos ? null : HoneyDo.Views.Todos = {};

HoneyDo.Views.Todos.CompletableWidgetView = Backbone.View.extend({
  template: JST["backbone/templates/todos/completable_widget_view"],

  events: { },

  tagName: "div",

  initialize: function (options){
    this.options = options;
    this._setupViewOptions();
    this._initializeCollection();
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

    this.collection.each(function (todo){
      self._attachListenersToTodo(todo);
    });

    this.collection.on("add", function (model, collection, options){
      self._attachListenersToTodo(model);
    });
  },

  _attachListenersToTodo: function (todo){
    todo.on("todoCompleted", this._todoComplete.bind(this));
    todo.on("todoUncompleted", this._todoUncomplete.bind(this));
    todo.on("todoAccepted", this._todoAccepted.bind(this));
    todo.on("destroy", this._todoDestroyed.bind(this));
  },

  _initializeCollection: function (){
    this.collection = new HoneyDo.Collections.TodosCollection(this.options.todos);
    this.collection.comparator = "position";
  },

  _initializeCompletedView: function (){
    this._completed_view = new HoneyDo.Views.Todos.CompletableListView({
      el: this.$el.find(".completed-list-container"),
      collection: this.collection,
      show_state: "completed"
    });
  },

  _initializeFlash: function (){
    this.flash = new HoneyDo.Views.Flash();
  },

  _initializeActiveView: function (){
    this._active_view = new HoneyDo.Views.Todos.CompletableListView({
      el: this.$el.find(".active-list-container"),
      collection: this.collection,
      show_state: "active"
    });
  },

  _initializeSubViews: function (){
    // Note: Might want to destroy sub views here if this was being rendered again.
    this._initializeActiveView();
    this._initializeCompletedView();
  },

  _renderSubViews: function (){
    this._active_view.render();
    this._completed_view.render();
  },

  _setupModals: function (){
    this._new_todo_view = new HoneyDo.Views.Todos.TodoNewView({ 
      klass: "Completable::Todo",
      collection: this.collection
    });
  },

  _setupViewOptions: function (){
    this.view_options = _.pick(this.options, "can_administrate_household");
  },

  _todoAccepted: function (evt){
    this.collection.remove(evt.model);
    this.updateFlash({notice: "The todo was accepted and removed"});
  },

  _todoComplete: function (evt){
    this._renderSubViews();
    this.updateFlash({notice: evt.notice});
  },

  _todoDestroyed: function (evt){
    this.updateFlash({notice: "The todo item was removed"});
  },

  _todoUncomplete: function (evt){
    this._renderSubViews();
    this.updateFlash({notice: evt.notice});
  },
});
