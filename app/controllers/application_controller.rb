class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def after_sign_in_path_for(resource)
    if resource.class == User
      if resource.household
        household_path
      else
        root_path
      end
    else
      raise "Invalid resource type after signing in"
    end
  end

  def load_current_user_household
    @household = current_user.household
  end
end
