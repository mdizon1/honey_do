class Household < ActiveRecord::Base
  has_many :memberships
  has_many :members, :through => :memberships, :source => :user
  has_many :todos

  def add_member!(user)
    members << user
  end

  def admins
    memberships.includes(:user).where('memberships.is_admin IS TRUE OR memberships.is_head_admin IS TRUE').map(&:user)
  end

  def make_admin(user)
    m = Membership.find(:household => self, :member => user)
    return false unless m
    m.is_admin = true
    m.save
  end

  def make_head_admin(user)
    m = Membership.find(:household => self, :member => user)
    return false unless m
    m.is_head_admin = true
    m.save
  end

  def create_todo(notes, creator)
    raise ArgumentError, "No notes provided" if notes.blank?
    raise ArgumentError, "No creator provided" unless creator
    raise ArgumentError, "Creator is not a member of this household" unless self.has_member?(creator)
    Todo.create(:household => self, :notes => notes, :creator => creator)
  end

  def has_member?(user)
    members.include?(user)
  end

  def head_admin
    members.where(:is_head_admin => true).first.user
  end

  def remove_member(user)
    members.destroy(user)
  end
end
