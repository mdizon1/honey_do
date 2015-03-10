class Household < ActiveRecord::Base
  has_many :memberships
  has_many :members, :through => :memberships, :source => :user
  has_many :todos, -> { order('position ASC') }, :class_name => 'Completable::Todo', :dependent => :destroy
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

  def create_todo(title, creator, options={})
    raise ArgumentError, "No title provided" if title.blank?
    raise ArgumentError, "No creator provided" unless creator
    raise ArgumentError, "Creator is not a member of this household" unless self.has_member?(creator)
    raise ArgumentError, "Creator is not an administrator of the household" unless creator.administrates? self
    new_todo = Completable::Todo.new(:household => self, :title => title, :notes => options[:notes], :creator => creator)
    new_todo.tag_with(options[:tags]) if options[:tags]
    new_todo.type = options[:klass] || 'Completable::Todo'
    new_todo.save!
    new_todo
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
