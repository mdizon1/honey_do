class CustomSessionsController < Devise::SessionsController
  before_action :before_login, :only => :create
  after_action :after_login, :only => :create

  def before_login
  end

  def after_login
    current_user.reset_authentication_token!
  end
end
