class TodosController < ApplicationController
  before_filter :authenticate_user!
  before_filter :load_current_user_household, :except => [:new]
  before_filter :load_todo, :only => [:accept, :complete, :destroy, :uncomplete]
  before_filter :authorize_modify_todo, :only => [:accept, :complete, :destroy, :uncomplete]

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
          new_todo = @household.create_todo(params[:completable_todo][:title], params[:completable_todo][:notes], current_user)
        elsif params[:completable_shopping_item]
          new_todo = @household.create_shopping_item(params[:completable_shopping_item][:title], params[:completable_shopping_item][:notes], current_user)
        end
        flash[:notice] = "#{new_todo.friendly_name} created successfully." if new_todo.valid?
        redirect_to household_path
      end

      format.js do
        if params[:todo]
          new_todo = @household.create_todo(params[:todo][:title], params[:todo][:notes], current_user)
          render :json => new_todo.to_backbone(current_user), :status => :ok
        end
      end
    end
  end

  def update
  end

  def destroy
    @todo.destroy
    flash[:notice] = 'Todo item has been removed'
    redirect_to household_path
  end

  #TODO: (hah, meta) catch exceptions thrown by accept! and return appropriate flash
  def accept
    success_message = 'Todo item accepted and removed'
    respond_to do |format|
      format.html do 
        @todo.accept!(current_user)
        flash[:notice] = success_message
        redirect_to household_path
      end

      format.js do
        @todo.accept!(current_user)
        render :json => {:notice => success_message, :model => @todo.to_backbone(current_user)}, :status => :ok
      end
    end
  end

  def complete
    success_message = 'Todo completed'
    respond_to do |format|
      format.html do
        @todo.complete!(current_user)
        flash[:notice] = success_message
        redirect_to household_path
      end

      format.js do
        @todo.complete!(current_user)
        render :json => {:notice => success_message, :model => @todo.to_backbone(current_user)}, :status => :ok
      end
    end
  end

  def uncomplete
    success_message = 'The todo was pushed back to pending'
    respond_to do |format|
      format.html do
        @todo.uncomplete!
        flash[:notice] = success_message
        redirect_to household_path
      end

      format.js do
        @todo.uncomplete!
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
    @todo = Completable.find(params[:id] || params[:todo_id])
  end

  def todo_params
    params.require(:todo).permit(:title, :notes)
  end
end
