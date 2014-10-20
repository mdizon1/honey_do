class Membership < ActiveRecord::Base
  belongs_to :household
  belongs_to :user, :foreign_key => :member_id

  validates :is_head_admin, :uniqueness => { :scope => [:household_id], :allow_blank => true }
  validates :household_id, :uniqueness => {:scope => [:member_id] }
end
