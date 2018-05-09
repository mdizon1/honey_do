class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :resource_name, :resource, :devise_mapping, :resource_class

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

  def detect_browser
    @browser = Browser.new(request.user_agent, accept_language: "en-us")
  end

  def load_current_user_household
    @household = current_user.household
  end

  def verify_auth_token
    begin
      u = User.find_by(:authentication_token => params[:authentication_token])
      raise unless u && u == current_user
    rescue
      return render :json => {:message => 'Your authentication token is invalid, it may have expired or you may have logged in from another location.  Please log out, then log in and try again.'}, :status => 403
    end
  end

  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def resource_class
    User
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end
end
