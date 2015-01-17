HoneyDo.Views.Todos ? null : HoneyDo.Views.Todos = {};

HoneyDo.Views.Todos.CompletableListView = Backbone.View.extend({
  template: JST["backbone/templates/todos/completable_list_view"],

  events: { },

  tagName: "div",

  initialize: function (options){
    this._validateOptions(options);
    this.show_state = options.show_state;
    this._setupViewOptions();
    this._bindListeners();
  },

  render: function (){
    var self = this;
    this.$el.html(this.template(this.view_options));
    this._buildViewsForCollection();
    _.each(this.views, function (view){
      view.render();
      self.$el.find("tbody").append(view.$el);
    });
    this._initializeSortable();
  },

  //private

  _bindListeners: function (){
    this.collection.on("add remove reset sort", this.render.bind(this));
  }, 

  _buildViewsForCollection: function (){
    this._clearViews();
    this.views = _.map(this._getListFromCollection(), function (item){
      return new HoneyDo.Views.Todos.CompletableShowView({model: item});
    });
  },

  _clearViews: function (){
    if(!this.views){return;}
    _.each(this.views, function(v){
      v.remove();
      v = null;
    });
  },

  _getListFromCollection: function (){
    switch(this.show_state){
      case 'completed':
        return this.collection.getCompleted();
        break;
      case 'active':
        return this.collection.getActive();
        break;
      default:
        throw new Error("should never get here");
    }
  },

  _initializeSortable: function (){
    var self = this;
    if(this.show_state !== "active") { return null; }

    this.$el.find("tbody").sortable({
      axis: "y",
      containment: this.$el.find(".todo-list-wrap"),
      cursor: "move",
      distance: 5,
      handle: ".todo-reorder",
      helper: this._fixDraggableDisplay,
      revert: 400,

      // events
      deactivate: function (evt, ui){
        // Resort the collection based on positions in the list
        ui.item.trigger("shuffle", ui.item.index());
      }
    });
  },

  _fixDraggableDisplay: function (e, tr){
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function(index)
    {
      // Set helper cell sizes to match the original sizes
      $(this).width($originals.eq(index).width());
    });
    return $helper;
  },

  _setupViewOptions: function (){
    this.view_options = {};    // Nothing yet
  },

  _validateOptions: function (options){
    if(!options.show_state) { 
      throw new Error("No show state provided to CompletableListView view");
    }
  }
});
