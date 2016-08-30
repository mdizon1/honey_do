When /(?:|I )click the sign in link$/ do
  click_link('Sign in')
end

Then /(?:|I )should see the sign in fields$/ do
  expect(find_field('user_email').value).to be_blank
  expect(find_field('user_password').value).to be_blank
end
