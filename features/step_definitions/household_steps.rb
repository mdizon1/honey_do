Given /^a household named "(.*?)" exists$/ do |household_name|
  FactoryGirl.create(:household, :name => household_name)
end
