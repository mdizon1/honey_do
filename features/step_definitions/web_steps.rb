Given /^(?:|I )visit the home page$/ do
  visit(root_path)
end

Then /^(?:|I )should see "(.+)"$/ do |text|
  expect(page).to have_content(text)
end

When /^(?:|I )fill in "(.+)" for "(.+)"$/ do |value, field_name|
  fill_in(field_name, :with => value)
end

When /^(?:|I )submit the "(.+)" form$/ do |form_id|
  find("form##{form_id} [type=\"submit\"]").click
end

When /^(?:|I )press the "(.+)" button$/ do |button_text|
  find_button(button_text).click
end
