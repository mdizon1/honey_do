@javascript

Feature: Check off todo item
         In order to keep track of completed household chores
         As a member of the household
         I want to be able to signal that I completed a todo item

  Scenario: Complete an existing todo item
    Given a household named "Tuttle" exists
    And a user exists with the email "foo@bar.com" and password "123456"
    And the user "foo@bar.com" belongs to the household "Tuttle"
    And there is a todo item titled "Take out the trash" which belongs to the household "Tuttle"
    And I visit the home page
    When I click the sign in link
    When I fill in "foo@bar.com" for "user_email"
    And I fill in "123456" for "user_password" 
    And I submit the "new_user" form
    # Logged in

    Then I should see "Take out the trash"
    When I click the "check todo" control
    Then the ".todo-item-checkbox" checkbox should be checked
