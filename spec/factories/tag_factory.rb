FactoryGirl.define do 
  factory :tag do
    association :tag_title, :factory => :tag_title
  end

  factory :tag_title do
    title { Faker::Lorem.word }
  end
end
