class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :token_authenticatable

  has_one :membership, :foreign_key => :member_id
  has_one :household, :through => :membership

  def administrates?(household)
    household.admins.include?(self)
  end

  def is_household_admin?
    household.admins.include?(self)
  end
end
