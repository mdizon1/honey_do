FactoryGirl.define do
  factory :household do
    name { Faker::Name.last_name + ' Household' }
  end
end
