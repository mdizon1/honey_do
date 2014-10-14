class Household < ActiveRecord::Base
  has_many :memberships
  has_many :members, :through => :memberships, :source => :user
  has_many :todos

  def create_todo(notes, creator)
    raise ArgumentError, "No notes provided" if notes.blank?
    raise ArgumentError, "No creator provided" unless creator
    raise ArgumentError, "Creator is not a member of this household" unless self.has_member?(creator)
    Todo.create(:household => self, :notes => notes, :creator => creator)
  end

  def add_member(user)
  end

  def remove_member(user)
  end

  def has_member?(user)
    members.include?(user)
  end
end
