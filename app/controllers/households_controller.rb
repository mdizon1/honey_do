class HouseholdsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :load_current_user_household, :only => [:show, :edit, :update, :destroy]

  def show
    @pending_todos = @household.pending_todos
    @completed_todos = @household.completed_todos
  end

  def edit
  end

  def new
    @household = Household.new
  end

  def create
    @household = Household.create(household_params)
    @household.add_member!(current_user)
    @household.make_head_admin(current_user)
    redirect_to household_path
  end

  def update
  end

  def destroy
  end

  private

  def household_params
    params.require(:household).permit(:name)
  end
end
