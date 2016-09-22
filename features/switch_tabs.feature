@javascript

Feature: Switch tags
         In order to manage household tasks
         As a member of the household
         I want to be able switch from todo items to the shopping list

  Scenario: Create todo item from blank list
    Given a household named "Tuttle" exists
    And a user exists with the email "foo@bar.com" and password "123456"
    And the user "foo@bar.com" belongs to the household "Tuttle"
    And there is a shopping item titled "Buy milk" which belongs to the household "Tuttle"
    And I visit the home page
    When I click the sign in link
    When I fill in "foo@bar.com" for "user_email"
    And I fill in "123456" for "user_password" 
    And I submit the "new_user" form
    # Logged in

    Then I should see "No items"
    When I press the "Shopping list" button
    Then I should see "Buy milk"
