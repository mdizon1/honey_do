FactoryGirl.define do
  factory :completable, :class => Completable do
    aasm_state 'active'
    association :household, :factory => :household
  end

  factory :todo, :parent => :completable,:class => Completable::Todo do
    title { Faker::Company.bs }
    notes { Faker::Hacker.phrases.sample }
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

  factory :shopping_item, :parent => :completable, :class => Completable::ShoppingItem do
    title { Faker::Commerce.product_name }
    notes { Faker::Commerce.price }
  end
end
