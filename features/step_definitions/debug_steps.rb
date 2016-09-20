When /^I start the debugger$/ do
  binding.pry
end

When /^I open the page$/ do
  save_and_open_page
end

When /^I save a screenshot$/ do
  save_and_open_screenshot
end

When /^I wait (\d+) seconds?$/ do |num_secs|
  sleep(num_secs.to_i)
end
