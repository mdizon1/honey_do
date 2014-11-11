FactoryGirl.define do
  factory :membership do
    association :household, :factory => :household
    association :user, :factory => :user
  end

  factory :household_admin, :parent => :membership do
    is_admin true
  end

  factory :household_head_admin, :parent => :membership do
    is_head_admin true
  end
end
