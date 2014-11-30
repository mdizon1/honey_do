class Completable < ActiveRecord::Base
  belongs_to :household
  belongs_to :creator, :foreign_key => :creator_id, :class_name => "User"
  belongs_to :completor, :foreign_key => :completor_id, :class_name => "User"
  belongs_to :acceptor, :foreign_key => :acceptor_id, :class_name => "User"

  def accept!(acceptor)
    raise ArgumentError, "An acceptor was not provided to accept! the todo" unless acceptor
    raise SecurityError, "The acceptor is not valid" unless acceptor.administrates?(self.household)
    if !self.complete? || self.accepted?
      raise "This todo may not be accepted"
    end
    self.accepted_at = Time.now if self.accepted_at == nil
    self.acceptor = acceptor if self.acceptor == nil
    save!
  end

  def accepted?
    return true if(self.accepted_at != nil && self.acceptor != nil)
    false
  end

  def complete!(completor)
    raise ArgumentError, "A completor was not provided to complete! the todo" unless completor
    self.completed_at = Time.now if self.completed_at == nil
    self.completor = completor if self.completor == nil
    save!
  end

  def complete?
    return true if(self.completed_at != nil && self.completor != nil)
    false
  end
  alias_method :completed?, :complete?

  def friendly_name
    'Completable'
  end

  def pending?
    return true if(self.completed_at == nil && self.accepted_at == nil)
    false
  end

  def permissions_for_user(user)
    a = Ability.new(user)
    {
      :can_complete => a.can?(:complete, self),
      :can_uncomplete => a.can?(:uncomplete, self),
      :can_destroy => a.can?(:destroy, self),
      :can_accept => a.can?(:accept, self),
    }
  end

  # TODO: to improve this: step 1, move to a presenter/draper. step 2, move to 
  #   serializer
  def to_backbone(user=nil)
    attrs = {
      :id => id,
      :title => title,
      :notes => notes,
      :is_pending => pending?,
      :is_completed => completed?,
      :completed_at => completed_at
    }
    attrs[:permissions] = permissions_for_user(user) if user
    attrs
  end

  def uncomplete!
    if complete?
      self.completed_at = nil
      self.completor = nil
      self.accepted_at = nil
      self.acceptor = nil
      save
    end
  end
end