class TodosController < ApplicationController
  before_filter :authenticate_user!
  before_filter :load_current_user_household, :except => [:new]
  before_filter :load_todo, :only => [:accept, :complete, :destroy, :update, :uncomplete]
  before_filter :authorize_modify_todo, :only => [:accept, :destroy, :uncomplete]

  def index
    # TODO: (ha ha ha...) this must be heavily optimized, mapping over the 
    # todos to get permissions per item will be costly
    @todos = @household.todos.decorate.map{|td| td.to_json(current_user) }
    @shopping_items = @household.shopping_items.decorate.map{|si| si.to_json(current_user) }
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
    respond_to do |format|
      format.js do
        return render :status => 400 unless @todo
        @todo.update_attributes(sanitized_todo_params)
        render :json => @todo.to_backbone(current_user), :status => :ok
      end
    end
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

  #TODO: (hah, meta) catch exceptions thrown by accept! and return appropriate flash
  def accept
    success_message = 'Todo item accepted and removed'
    respond_to do |format|
      format.html do 
        @todo.accept!(:accepted_by => current_user)
        flash[:notice] = success_message
        redirect_to household_path
      end

      format.js do
        #@todo.accept!(:accepted_by => current_user)
        # TODO: change the structure of the response here to something more consistent.  Shouldn't be :model => xxx, but something more along the best practices for an api.
        render :json => {:notice => success_message, :model => @todo.decorate.to_json(current_user)}, :status => :ok
      end
    end
  end

  def complete
    success_message = 'Todo completed'
    binding.pry
    respond_to do |format|
      format.js do
        @todo.complete!(:completed_by => current_user)
        render :json => {:notice => success_message, :model => @todo.to_backbone(current_user)}, :status => :ok
      end
    end
  end

  def uncomplete
    success_message = 'The todo was pushed back to pending'
    respond_to do |format|
      format.html do
        @todo.uncomplete!(:uncompleted_by => current_user)
        flash[:notice] = success_message
        redirect_to household_path
      end

      format.js do
        @todo.uncomplete!(:uncompleted_by => current_user)
        render :json => {:notice => success_message, :model => @todo.to_backbone(current_user)}, :status => :ok
      end
    end
  end

  private

  def authorize_modify_todo
    unless can?(:edit, @todo)
      flash[:alert] = 'You are not authorized to modify that item'
      return redirect_to root_url
    end
  end

  def load_todo
    @todo = Completable.find(params[:id] || 
                             params[:todo_id] || 
                             params[:todo][:id])
  end

  def todo_params
    params.require(:todo).permit(:title, :notes, :position)
  end

  def sanitized_todo_params
    todo_params.merge :position => (params[:todo][:position]+1) # jquery row positions are 0 indexed
  end
end
