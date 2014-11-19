module Households
  class SettingsController < ApplicationController
    before_filter :authenticate_user!
    before_filter :load_current_user_household
    before_filter :authenticate_household_admin

    def edit
    end

    def invite_admin
      flash[:notice] = 'DEBUG: This is still under construction'
      email = params[:invite_email]
      if email.blank?
        flash[:warning] = 'You must provide an email address to invite'
        return redirect_to edit_household_settings_path
      end

      begin
        @household.invite_admin(email)
      rescue => e
        flash[:warning] = e.to_s
      end

      flash[:notice] = "An email invite was sent to #{email}"
      redirect_to edit_household_settings_path
    end

    private

    def authenticate_household_admin
      unless current_user.administrates?(@household)
        flash[:warning] = 'You are not authorized to view this page'
        return redirect_to root_url
      end
    end
  end
end
