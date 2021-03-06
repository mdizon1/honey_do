class Completable < ApplicationRecord
  belongs_to :household
  belongs_to :creator, :foreign_key => :creator_id, :class_name => "User"
  belongs_to :completor, :foreign_key => :completor_id, :class_name => "User"
  belongs_to :acceptor, :foreign_key => :acceptor_id, :class_name => "User"
  has_many :tags, :as => :taggable, :dependent => :destroy
  has_many :tag_titles, :through => :tags
  has_many :completed_events, :as => :target, :class_name => 'Event::TodoCompleted'
  has_many :accepted_events, :as => :target, :class_name => 'Event::TodoAccepted'

  validates :household_id, :creator_id, :title, :presence => true, :allow_blank => false
  validate :creator_is_member

  acts_as_list :scope => :household

  accepts_nested_attributes_for :tag_titles, :allow_destroy => true

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
    event :accept, :after => :move_to_bottom do
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
      :can_edit => a.can?(:edit, self),
      :can_tag => a.can?(:tag, self)
    }
  end

  def reorder_near(target, is_target_above=true)

    return false if(target == self)

    if( # see if target todo would move at all
      (is_target_above && self == target.lower_item) ||
      (!is_target_above && self == target.higher_item)
    )
      return false
    end

    # if moving upwards, account for target shifting downwards
    if(higher_items.include?(target))
      target_position = target.position.to_i + (is_target_above ? 1 : 0)
    else
      target_position = target.position.to_i + (is_target_above ? 0 : -1)
    end

    insert_at(target_position <= 0 ? 1 : target_position)
  end

  def remove_tag(tag_string)
    output = false
    tags.each do |t|
      if(t.tag_title.title == tag_string)
        t.destroy
        output = true
      end
    end
    reload
    output
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

  def creator_is_member
    return unless household
    errors.add(:creator, "is not a member of the household") unless household.has_member?(creator)
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
    transition_options = {} if(!transition_options)
    self.completor = nil
    clear_completed_timestamps
    Event::TodoUncompleted.create(
      :target => self,
      :actor => transition_options[:uncompleted_by])
    save
  end
end
