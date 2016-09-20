Given /^there is a todo item titled "([^"]*)" which belongs to the household "([^"]*)"$/  do |todo_title, household_name|
  household = Household.find_by(:name => household_name)
  todo = FactoryGirl.create(:todo, :title => todo_title, :household => household)
end
