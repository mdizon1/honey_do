class TodosController < ApplicationController
  before_filter :authenticate_user!
  before_filter :load_current_user_household, :except => [:new]
  before_filter :load_todo, :only => [:complete]

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

  def complete
    unless can?(:manage, @todo)
      flash[:alert] = 'You are not authorized to complete that item'
      return redirect_to root_url
    end
    @todo.complete!(current_user)
    flash[:notice] = 'Todo completed'
    redirect_to household_path
  end

  private
  def todo_params
    params.require(:todo).permit(:title, :notes)
  end

  def load_todo
    @todo = Todo.find(params[:id] || params[:todo_id])
  end
end
