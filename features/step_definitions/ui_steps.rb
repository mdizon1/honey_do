When /^(?:|I )click the "(.+)" control$/ do |control_identifier|
  eval(control_identifier.gsub(' ', '_'))
end

Then /^the "(.+)" checkbox should be checked$/ do |control_selector|
  expect(page.has_css?("#{control_selector}.checkbox-checked")).to be true
end

def new_todo_button
  find('.honey-do-app-wrap .new-todo-button').click
end

def check_todo
  find('.todo-item-checkbox').click
end
