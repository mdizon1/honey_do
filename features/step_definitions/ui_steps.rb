
When /^(?:|I )click the "(.+)" control$/ do |control_identifier|
  eval(control_identifier.gsub(' ', '_'))
end

def new_todo_button
  find('.honey-do-app-wrap .new-todo-button').click
end
