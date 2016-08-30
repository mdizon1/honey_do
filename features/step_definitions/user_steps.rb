Given /^a user exists with the email "(.*?)" and password "(.*?)"$/ do |email, password|
  FactoryGirl.create(:user, :email => email, :password => password, :password_confirmation => password)
end

Given /^the user "(.*?)" belongs to the household "(.*?)"$/ do |email, household_name|
  user = User.find_by(:email => email)
  household = Household.find_by(:name => household_name)
  household.members << user
end
