@javascript

Feature: User Sign in
         In order to use the app
         As a registered user
         I want to be able to log in

  Scenario: A registered user should be able to sign-in to the app
    Given a household named "Tuttle" exists
    And a user exists with the email "foo@bar.com" and password "123456"
    And the user "foo@bar.com" belongs to the household "Tuttle"
    And I visit the home page
    Then I should see "Honey Do"

    When I click the sign in link
    Then I should see the sign in fields
    When I fill in "foo@bar.com" for "user_email"
    And I fill in "123456" for "user_password" 
    And I submit the "new_user" form

    Then I should see "Signed in successfully."
    And I should see "TODO LIST"
    And I should see "No items"
