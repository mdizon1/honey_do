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
    if params[:completable_todo]
      new_todo = @household.create_todo(params[:completable_todo][:title], params[:completable_todo][:notes], current_user)
    elsif params[:completable_shopping_item]
      new_todo = @household.create_shopping_item(params[:completable_shopping_item][:title], params[:completable_shopping_item][:notes], current_user)
    end
    flash[:notice] = "#{new_todo.friendly_name} created successfully." if new_todo.valid?
    redirect_to household_path
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
    @todo.accept!(current_user)
    flash[:notice] = 'Todo item accepted and removed'
    redirect_to household_path
  end

  def complete
    @todo.complete!(current_user)
    flash[:notice] = 'Todo completed'
    redirect_to household_path
  end

  def uncomplete
    @todo.uncomplete!
    flash[:notice] = 'The todo was pushed back to pending'
    redirect_to household_path
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
