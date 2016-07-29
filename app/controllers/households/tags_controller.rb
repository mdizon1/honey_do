module Households
  class TagsController < ApplicationController
    before_filter :authenticate_user!
    before_filter :load_current_user_household

    def index
      load_tags

      render :json => @tags.to_json, :status => :ok
    end

    private

    # TODO later this should smartly load only the tags necessary for this household to protect against loading up the browsers memory.
    def load_tags
      @tags = TagTitle.pluck(:title)
    end
  end
end
