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

  filter: function (filter_value){
    var filter_regex;
    if(!filter_value || _.isEmpty(filter_value)) {
      this._filter = null;
    }else{
      // TODO: Candidate for refactor here. the function could be moved into the model
      filter_regex = new RegExp("("+filter_value + "|,\\s*"+filter_value + ")");
      this._filter = function (curr_model){
        return(
          filter_regex.exec(curr_model.get("title")) ||
            filter_regex.exec(curr_model.get("tags")) ||
            filter_regex.exec(curr_model.get("notes"))
        );
      };
    }
    this.render();
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
    var self = this;
    return this.collection.filter(function (curr_model) {
      var filter_value = (self._filter ? self._filter(curr_model) : true);
       
      return filter_value && 
        curr_model.get("state") === self.show_state;
    });
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
