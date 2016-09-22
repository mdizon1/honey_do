@javascript

Feature: Create todo item
         In order to manage household chores
         As a member of the household
         I want to be able to create todo items

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
