class Event::TodoCompleted < Event
  def self.to_s
    'The todo item was completed'
  end

  def to_s
    "The todo item was completed on #{created_at} by #{actor.try(:name)}"
  end
end
