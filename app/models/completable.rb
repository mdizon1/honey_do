class Completable < ActiveRecord::Base
  belongs_to :household
  belongs_to :creator, :foreign_key => :creator_id, :class_name => "User"
  belongs_to :completor, :foreign_key => :completor_id, :class_name => "User"
  belongs_to :acceptor, :foreign_key => :acceptor_id, :class_name => "User"
  has_many :tags, :as => :taggable, :dependent => :destroy
  has_many :tag_titles, :through => :tags
  has_many :completed_events, :as => :target, :class_name => 'Event::TodoCompleted'
  has_many :accepted_events, :as => :target, :class_name => 'Event::TodoAccepted'

  include AASM

  aasm do
    state :active, :initial => true
    state :completed
    state :accepted

    event :complete do
      transitions :from => :active, :to => :completed, :after => [:rec_complete_event, :rec_completor] 
    end
    event :uncomplete do
      transitions :from => :completed, :to => :active, :after => [:rec_uncomplete_event, :clear_completed_timestamps]
    end
    event :accept do
      transitions :from => :completed, :to => :accepted, :after => [:rec_accept_event, :rec_acceptor]
    end
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
      :can_tag => a.can?(:tag, self)
    }
  end

  # Accept a string of tags separated by either commas or semicolons
  # Find or create tags from each and attach to this completable
  def tag_with(tag_string)
    found_or_created_tag_titles = []
    tag_string.split(/[,;]/).each do |new_tag|
      found_or_created_tag_titles << TagTitle.find_or_create_by(:title => new_tag.strip)
    end

    tag_titles_to_remove = tag_titles - found_or_created_tag_titles
    tag_titles_to_add = found_or_created_tag_titles - tag_titles

    tag_titles_to_remove.each do |tt|
      tag_titles.destroy(tt)
    end
    tag_titles_to_add.each do |tt|
      tag_titles << tt
    end
    tag_titles
  end

  private

  def clear_completed_timestamps
    self.completed_at = nil
    self.accepted_at = nil
    save
  end

  def rec_accept_event(transition_options)
    self.accepted_at = Time.now
    Event::TodoAccepted.create(
      :target => self, 
      :actor  => transition_options[:accepted_by])
    save
  end

  def rec_acceptor(transition_options)
    self.acceptor = transition_options[:accepted_by]
    raise ArgumentError unless self.acceptor
    save
  end

  def rec_complete_event(transition_options = {})
    self.completed_at = Time.now
    Event::TodoCompleted.create(
      :target => self,
      :actor => transition_options[:completed_by])
    save
  end

  def rec_completor(transition_options = {})
    self.completor = transition_options[:completed_by]
    raise ArgumentError unless self.completor
    save
  end

  def rec_uncomplete_event(transition_options = {})
    self.completor = nil
    clear_completed_timestamps
    Event::TodoUncompleted.create(
      :target => self,
      :actor => transition_options[:uncompleted_by])
    save
  end
end
