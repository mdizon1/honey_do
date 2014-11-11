FactoryGirl.define do
  factory :todo do
    title { Faker::Lorem.sentence }
    notes { Faker::Lorem.paragraph }
    association :household, :factory => :household
  end

  factory :completed_todo, :parent => :todo do
    completed_at { Time.now - Random.rand(10).weeks }
    association :completor, :factory => :user
  end

  factory :accepted_todo, :parent => :completed_todo do
    accepted_at { self.completed_at + 1.day }
    association :acceptor, :factory => :user
  end
end
