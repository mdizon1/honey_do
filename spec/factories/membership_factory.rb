FactoryGirl.define do
  factory :membership do
    association :household, :factory => :household
    association :user, :factory => :user
  end
end
