class TodosController < ApplicationController
  before_filter :authenticate_user!
  before_filter :load_current_user_household, :except => [:new]
  before_filter :load_todo, :only => [:accept, :complete]
  before_filter :authorize_modify_todo, :only => [:accept, :complete]

  def show
  end

  def edit
  end

  def new
  end

  def create
    @household = current_user.household
    new_todo = @household.create_todo(params[:todo][:title], params[:todo][:notes], current_user)
    if new_todo.valid?
      flash[:notice] = 'Todo created successfully.'
    end
    redirect_to household_path
  end

  def update
  end

  def destroy
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

  private

  def authorize_modify_todo
    unless can?(:edit, @todo)
      flash[:alert] = 'You are not authorized to modify that item'
      return redirect_to root_url
    end
  end

  def load_todo
    @todo = Todo.find(params[:id] || params[:todo_id])
  end

  def todo_params
    params.require(:todo).permit(:title, :notes)
  end
end
