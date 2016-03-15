FactoryGirl.define do
  factory :todo, :class => Completable::Todo do
    title { Faker::Company.bs }
    notes { Faker::Hacker.phrases.sample }
    aasm_state 'active'
    association :household, :factory => :household
  end

  factory :completed_todo, :parent => :todo do
    completed_at { Time.now - Random.rand(10).weeks }
    association :completor, :factory => :user
    aasm_state 'completed'
  end

  factory :accepted_todo, :parent => :completed_todo do
    accepted_at { self.completed_at + 1.day }
    association :acceptor, :factory => :user
    aasm_state 'accepted'
  end
end
