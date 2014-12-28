class Event::TodoUncompleted < Event
  def self.to_s
    'The todo item was uncompleted'
  end

  def to_s
    "The todo item was uncompleted on #{created_at} by #{actor.try(:name)}"
  end
end
