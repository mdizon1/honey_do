FactoryGirl.define do 
  factory :tag do
    association :tag_title, :factory => :tag_title
  end

  factory :tag_title do
    title { Faker::Lorem.word }
  end

  factory :color_tag_title, :parent => :tag_title do
    title { Faker::Color.color_name }
  end
end
