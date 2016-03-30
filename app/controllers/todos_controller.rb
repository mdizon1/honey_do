class TodosController < ApplicationController
  # TODO: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  #   Add a filter to verify that the request includes an authentication 
  #   token which matches the users current one
  before_filter :authenticate_user!
  before_filter :load_current_user_household, :except => [:new]
  before_filter :load_todo, :only => [:accept, :complete, :destroy, :update, :uncomplete]

  def index
    # TODO: (ha ha ha...) this must be heavily optimized, mapping over the 
    # todos to get permissions per item will be costly
    @todos = @household.todos.decorate.map{|td| [td.id, td.to_json(current_user)] }.to_h
    @shopping_items = @household.shopping_items.decorate.map{|si| [si.id, si.to_json(current_user)] }.to_h
    render :json => {:todos => @todos, :shoppingItems => @shopping_items}, :status => :ok
  end

  def show
  end

  def edit
  end

  def new
  end

  def create
    @household = current_user.household
    respond_to do |format|
      format.html do
        if params[:completable_todo]
          new_todo = @household.create_todo(params[:completable_todo][:title], current_user, {
            notes => params[:completable_shopping_item][:notes]
          })
        elsif params[:completable_shopping_item]
          new_todo = @household.create_todo(params[:completable_shopping_item][:title], current_user, {
            notes => params[:completable_shopping_item][:notes],
            klass => 'CompletableTodo::ShoppingItem'
          })
        end
        flash[:notice] = "#{new_todo.friendly_name} created successfully." if new_todo.valid?
        redirect_to household_path
      end

      format.js do
        if params[:todo]
          new_todo = @household.create_todo(params[:todo][:title], current_user, {
            :notes => params[:todo][:notes], 
            :tags  => params[:todo][:tags],
            :klass => params[:todo][:klass]
          })
          render :json => new_todo.to_backbone(current_user), :status => :ok
        end
      end
    end
  end

  def update
    return render :status => 400 unless @todo 
    return render :status => 500 unless @todo.update_attributes(todo_params)
    render :json => @todo.to_json(current_user), :status => :ok
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
    return unauthorized_response unles can?(:accept, @todo)
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
    params.require(:todo).permit(:title, :notes, :position)
  end

  def render_todo_to_json(status)
    render :json => @todo.to_json(current_user), :status => status
  end
end
