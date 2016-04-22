class TodosController < ApplicationController
  before_filter :authenticate_user!
  before_filter :verify_auth_token
  before_filter :load_current_user_household, :only => [:index, :create]
  before_filter :load_todo, :only => [:accept, :complete, :destroy, :update, :uncomplete, :reorder]

  def index
    # TODO: (ha ha ha...) this must be heavily optimized, mapping over the 
    # todos to get permissions per item will be costly
    @todos = @household.todos.includes([{:household => :members}, :creator, :completor, :acceptor, :tags]).decorate.map{|td| [td.id, td.to_json(current_user)] }.to_h
    @shopping_items = @household.shopping_items.includes([{:household => :members}, :creator, :completor, :acceptor, :tags]).decorate.map{|si| [si.id, si.to_json(current_user)] }.to_h
    render :json => {:todos => @todos, :shoppingItems => @shopping_items}, :status => :ok
  end

  def show
  end

  def edit
  end

  def new
  end

  def create
    begin
      @todo = Completable.create(todo_params.merge({:household => @household, :creator => current_user}))
      @todo = Completable.find(@todo.id).decorate # Reload with correct Model class
      status = :ok
    rescue
      status = 500
    end
    render_todo_to_json(status)
  end

  def update
    return render :status => 400 unless @todo 
    return render :status => 500 unless @todo.update_attributes(todo_params)
    render_todo_to_json(:ok)
  end

  def destroy
    respond_to do |format|
      format.html do
        @todo.destroy
        flash[:notice] = 'Todo item has been removed'
        redirect_to household_path
      end

      format.js do
        @todo.destroy if can?(:destroy, @todo) #TODO: elaborate on this and use it on all actions
        render :json => {:success => true}, :status => :ok # We don't care what the response is for now
      end
    end
  end

  def accept
    return unauthorized_response unless can?(:accept, @todo)
    begin
      @todo.accept!(:accepted_by => current_user)
      status = :ok
    rescue
      status = 500
    end
    render_todo_to_json(status)
  end

  def complete
    return unauthorized_response unless can?(:complete, @todo)
    begin
      @todo.complete!(:completed_by => current_user)
      status = :ok
    rescue
      status = 500
    end
    render_todo_to_json(status)
  end

  def reorder
    return unauthorized_response unless can?(:reorder, @todo)
    begin
      params[:positions_jumped].to_i.abs.times do |itor|
        (params[:positions_jumped].to_i > 0) ? @todo.move_lower : @todo.move_higher
      end
      status = :ok
    rescue
      status = 500
    end
    render_todo_to_json(status)
  end

  def uncomplete
    return unauthorized_response unless can?(:uncomplete, @todo)
    begin
      @todo.uncomplete!(:uncompleted_by => current_user)
      status = :ok
    rescue
      status = 500
    end
    render_todo_to_json(status)
  end

  private

  def unauthorized_response(message=nil)
    render :json => {:message => message}, :status => 403
  end

  def load_todo
    @todo = Completable.find(params[:id] || 
                             params[:todo_id] || 
                             params[:todo][:id])
                       .decorate
  end

  def todo_params
    params.require(:todo).permit(:title, :notes, :position, :type)
  end

  def render_todo_to_json(status)
    render :json => @todo.to_json(current_user), :status => status
  end
end
