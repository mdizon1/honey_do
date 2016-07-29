module Households
  module Todos
    class TagsController < ApplicationController
      before_filter :authenticate_user!
      before_filter :load_current_user_household
      before_filter :load_todo

      def destroy
        @todo.remove_tag(params[:id])
        render :json => @todo, :status => :ok
      end

      private

      def load_todo
        @todo = Completable.includes(:tags => :tag_title).find(params[:todo_id])
      end

    end
  end
end
