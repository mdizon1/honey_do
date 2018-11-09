class HouseholdsController < ApplicationController
  before_action :authenticate_user!
  before_action :verify_auth_token, :only => :permissions
  before_action :load_current_user_household, :only => [:show, :edit, :update, :destroy, :permissions]
  before_action :prevent_user_from_create_new_household, :only => :new

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

  # TODO move this to household/permissions controller once we need more
  # functionality there
  def permissions
    return render :json => current_user.decorate.permissions_json(@household), :status => :ok
  end

  private

  def household_params
    params.require(:household).permit(:name)
  end

  def prepare_honey_do_config
    @honey_do_config = ReactComponents::HoneyDo.new(current_user, @household, @browser).config
  end

  def prevent_user_from_create_new_household
    if current_user.membership.present?
      return redirect_to edit_household_settings_path(current_user.household)
    end
  end
end
