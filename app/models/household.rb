class Household < ActiveRecord::Base
  has_many :memberships
  has_many :members, :through => :memberships, :source => :user
  has_many :todos, -> { order('position ASC').where("aasm_state NOT IN ('accepted')") }, :class_name => 'Completable::Todo', :dependent => :destroy
  has_many :shopping_items, -> { order('position ASC') }, :class_name => 'Completable::ShoppingItem', :dependent => :destroy

  def accepted_todos
    todos.where(:aasm_state => 'accepted')
  end

  def active_shopping_items
    shopping_items.where(:aasm_state => %w(active completed))
  end

  def active_todos
    todos.where(:aasm_state => %w(active completed))
  end

  def add_member!(user)
    members << user
  end

  def admins
    memberships.includes(:user).where('memberships.is_admin IS TRUE OR memberships.is_head_admin IS TRUE').map(&:user)
  end

  def completed_shopping_items
    shopping_items.where(:aasm_state => 'completed')
  end

  def completed_todos
    todos.where(:aasm_state => 'completed')
  end

  def has_member?(user)
    members.include?(user)
  end

  def head_admin
    memberships.find_by(:is_head_admin => true).user
  end

  def invite_admin(email)
    u = User.find_by_email(email)
    if u
      # TODO: send email to the user with the invite control
      #   build out a notification system so we can
      #   display some action item(s) when they log in
      # For now, we'll just find the user and make that person an admin
      make_admin(u)
    else
      raise NotImplementedError, 'This user does not exist, the onboarding process is coming soon!'
    end
  end

  def make_admin(user)
    m = Membership.find_by(:household_id => self.id, :member_id => user.id)
    return false unless m
    m.is_admin = true
    m.save
  end

  def make_head_admin(user)
    m = Membership.find_by(:household_id => self.id, :member_id => user.id)
    return false unless m
    m.is_head_admin = true
    m.save
  end

  def remove_member(user)
    members.destroy(user)
  end
end
