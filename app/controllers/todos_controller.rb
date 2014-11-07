class TodosController < ApplicationController
  before_filter :authenticate_user!
  before_filter :load_current_user_household, :except => [:new]

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
  end

  private
  def todo_params
    params.require(:todo).permit(:title, :notes)
  end
end
