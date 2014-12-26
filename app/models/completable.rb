class Completable < ActiveRecord::Base
  belongs_to :household
  belongs_to :creator, :foreign_key => :creator_id, :class_name => "User"
  belongs_to :completor, :foreign_key => :completor_id, :class_name => "User"
  belongs_to :acceptor, :foreign_key => :acceptor_id, :class_name => "User"

  state_machine :state, :initial => :active do
    after_transition :on => :complete, :do => [:rec_complete_event, :rec_completor]
    after_transition :on => :accept, :do => [:rec_accept_event, :rec_acceptor]
    after_transition :completed => :active, :do => [:rec_uncomplete_event, :clear_completed_timestamps]

    event(:complete) { transition :active => :completed }
    event(:uncomplete) { transition :completed => :active }
    event(:accept) { transition :completed => :accepted }
  end

  def friendly_name
    'Completable'
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
      :is_active => active?,
      :is_completed => completed?,
      :completed_at => completed_at
    }
    attrs[:permissions] = permissions_for_user(user) if user
    attrs
  end

  private

  def clear_completed_timestamps
    self.completed_at = nil
    self.accepted_at = nil
    save
  end

  def rec_accept_event(transition)
    self.accepted_at = Time.now
    # TODO: CREATE EVENT HERE --------------
    save
  end

  def rec_acceptor(transition)
    self.acceptor = transition.args.first
    raise ArgumentError unless self.acceptor
    save
  end

  def rec_complete_event(transition)
    self.completed_at = Time.now
    # TODO: CREATE EVENT HERE ~~~~~~~~~~~~~~~~
    save
  end

  def rec_completor(transition)
    self.completor = transition.args.first
    raise ArgumentError unless self.completor
    save
  end

  def rec_uncomplete_event
    self.completor = nil
    clear_completed_timestamps
    # TODO: CREATE EVENT HERE ~~~~~~~~~~~~~~~
    save
  end
end
