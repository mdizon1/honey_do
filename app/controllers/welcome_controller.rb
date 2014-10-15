class WelcomeController < ApplicationController
  before_filter :goto_household, :only => :index

  def index
    #nothing here yet
  end

  private
  def goto_household
    if user_signed_in? && household = current_user.households.first
      return redirect_to household_path
    end
  end
end
