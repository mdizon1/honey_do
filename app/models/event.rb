class Event < ApplicationRecord
  belongs_to :actor, :class_name => 'User'
  belongs_to :target, :polymorphic => true

  def self.to_s
    'Override me in subclasses!'
  end

  def to_s
    'Override me in subclasses!'
  end
end
