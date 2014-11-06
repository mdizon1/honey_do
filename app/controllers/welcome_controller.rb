class WelcomeController < ApplicationController
  before_filter :redirect_to_household, :only => :index

  def index
    #nothing here yet
  end

  private
  def redirect_to_household
    if user_signed_in? && current_user.household
      return redirect_to household_path
    end
  end
end
