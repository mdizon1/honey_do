Given /^there is a (shopping|todo) item titled "([^"]*)" which belongs to the household "([^"]*)"$/  do |todo_type, item_title, household_name|
  household = Household.find_by(:name => household_name)
  raise unless household
  case(todo_type)
  when 'shopping'
    todo = FactoryGirl.create(:shopping_item, :title => item_title, :household => household)
  when 'todo'
    todo = FactoryGirl.create(:todo, :title => item_title, :household => household)
  else
    raise "Should be impossible to get here"
  end
end
