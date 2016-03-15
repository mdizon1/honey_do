FactoryGirl.define do
  factory :household do
    name { Faker::Name.last_name }
  end
end
