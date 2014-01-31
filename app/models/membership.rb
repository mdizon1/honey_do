class Membership < ActiveRecord::Base
  belongs_to :household
  belongs_to :user, :foreign_key => :member_id
end
