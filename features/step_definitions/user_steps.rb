Given /^a user with the email "(.*?)" exists$/ do |email|
  FactoryGirl.create(:user, :email => email, :password => '123456', :password_confirmation => '123456')
end

Given /^the user "(.*?)" belongs to the household "(.*?)"$/ do |email, household_name|
  user = User.find_by(:email => email)
  household = Household.find_by(:name => household_name)
  household.members << user
end
