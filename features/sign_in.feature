@javascript

Feature: User Sign in
  Scenario: A registered user should be able to sign-in to the app
    Given a household named "Tuttle" exists
    And a user with the email "foo@bar.com" exists
    And the user "foo@bar.com" belongs to the household "Tuttle"
    And I visit the home page
    Then I should see "Honey Do"

