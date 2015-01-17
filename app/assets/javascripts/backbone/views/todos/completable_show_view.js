HoneyDo.Views.Todos ? null : HoneyDo.Views.Todos = {};


HoneyDo.Views.Todos.CompletableShowView = Backbone.View.extend({
  template: JST["backbone/templates/todos/completable_show_view"],

  events: { 
    "click [data-action='complete']": "complete",
    "click [data-action='uncomplete']": "uncomplete",
    "click [data-action='destroy']": "destroy_todo",
    "click [data-action='accept']": "accept",
    "shuffle": "shuffle"
  },

  tagName: "tr",

  className: "todo todo-show",

  initialize: function (options){ },

  highlight: function (){
    var self = this;
    this.$el.addClass("highlight");
    window.setTimeout(function (){
      self.$el.removeClass("highlight");
    }, 150);
  },

  render: function (){
    this.$el.html(this.template(this.model.attributes));
    this._activateTooltips();
  },

  shuffle: function (evt, index){
    var self = this;
    this.model.save({position: index}, {
      error: function (model, response, options){},
      success: function (model, response, options){
        self.highlight();
      },
      wait: true
    });
  },

  //private

  _activateTooltips: function (){
    this.$el.find('[data-toggle="tooltip"]').tooltip();
  },

  _bindListeners: function (){
    var self = this;
    if(!this.model) { return false; }
    
    this.model.on("sync", function (){ 
      self.highlight(); 
    });
    this.model.on("change", function (){ 
      self.highlight(); 
    });
  },

  _unbindListeners: function (){
    if(!this.model) { return false; }
    this.model.off("sync");
  },

  accept: function (e){
    e.preventDefault();
    this.model.accept();
  },

  complete: function (e){
    var jqXHR, self;
    self = this;
    e.preventDefault();
    jqXHR = this.model.complete();
    jqXHR.done(function (data, textStatus, jqXHR){
      // self.remove();
    }).fail(function (){
      // flash red
    });
  },

  destroy_todo: function (e){
    e.preventDefault();
    this.model.destroy();
  },

  uncomplete: function (e){
    e.preventDefault();
    this.model.uncomplete();
  }

});
