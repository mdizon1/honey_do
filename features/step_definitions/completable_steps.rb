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

# NOTE: NOT WORKING
When /^(?:|I )drag the todo titled "([^"]+)" over the todo titled "([^"]+)"$/ do |drag_todo_title, drop_todo_title|

  drag_target = todo_node_with_text(drag_todo_title)
  drag_target = get_drag_handle_from_node(drag_target)

  drop_target = todo_node_with_text(drop_todo_title)
  drop_target = get_drag_handle_from_node(drop_target)

  drag_target.drag_to(drop_target)
end

# NOTE: NOT WORKING
Then /^the todo titled "([^"]+)" should appear above the todo titled "([^"]+)"$/ do |first_todo_title, second_todo_title|
  expect(page).to have_css("ul:first-child", :text => first_todo_title)
  expect(page).to have_css("ul:last-child", :text => first_todo_title)
end

def todo_node_with_text(txt)
  find(:xpath, "//div[@class=\"honey-do-todo-list\"]//li//div[@class=\"todo-item-content\" and contains(., '#{txt}')]/../../..")
end

def get_drag_handle_from_node(node)
  node.find(:xpath, ".//div[@class=\"todo-item-drag-handle\"]")
end
