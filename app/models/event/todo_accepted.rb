class Event::TodoAccepted < Event
  def self.to_s
    'The todo item was accepted'
  end

  def to_s
    "The todo item was accepted on #{created_at} by #{actor.try(:name)}"
  end
end
