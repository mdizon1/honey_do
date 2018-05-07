module ReactComponents
  class HoneyDo
    include Rails.application.routes.url_helpers

    attr_accessor :user, :household, :browser

    def initialize(user, household, browser)
      @user = user
      @household = household
      @browser = browser
    end

    def config
      {
        :configState => {
          :identity => {
            :userId => user.id,
            :userFirstName => user.first_name,
            :userLastName => user.last_name,
            :authToken => user.authentication_token,
            :householdId => household.id,
            :householdName => household.name,
          },
          :apiEndpoint => household_path,
          :interface => (browser.device.mobile? ? 'touch' : 'html5')
        }
      }.to_json
    end
  end
end
