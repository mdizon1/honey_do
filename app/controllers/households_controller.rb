class HouseholdsController < ApplicationController
  before_action :authenticate_user!
  before_action :load_current_user_household, :only => [:show, :edit, :update, :destroy]

  def show
    detect_browser
    prepare_honey_do_config
    render :layout => 'honeydo'
  end

  def edit
  end

  def new
    @household = Household.new
  end

  #TODO: refactor me.  Build a HouseholdForm class
  def create
    @household = Household.create(household_params)
    @household.add_member!(current_user)
    @household.make_head_admin(current_user)
    @household.todos << Completable::Todo.create(:title => 'Create some todo task items.', :creator => current_user)
    @household.shopping_items << Completable::ShoppingItem.create(:title => 'Add some items to your shopping list.', :creator => current_user)
    redirect_to household_path
  end

  def update
    @household.update_attributes(household_params)
    if @household.save
      flash[:notice] = 'Household updated successfully'
    else
      flash[:warning] = @household.errors.full_messages.to_s
    end
    redirect_to edit_household_settings_path
  end

  def destroy
  end

  private

  def household_params
    params.require(:household).permit(:name)
  end

  def prepare_honey_do_config
    @honey_do_config = ReactComponents::HoneyDo.new(current_user, @household, @browser).config
  end
end
