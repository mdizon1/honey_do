module ReactComponents
  DEMO_PERMISSIONS = {
    :can_complete => true,
    :can_uncomplete => true,
    :can_destroy => false,
    :can_accept => false,
    :can_edit => true,
    :can_tag => true
  }
  DEMO_DATA = {
    "1" => { 
      :id          => 1,
      :position    => 1,
      :title       => 'Take out the trash',
      :notes       => 'Tuesday garbage night',
      :state       => 'active',
      :klass       => "Completable::Todo",
      :tags        => ['chore'],
      :isActive    => true,
      :isCompleted => false,
      :permissions => DEMO_PERMISSIONS
    },
    "2" => {
      :id          => 2,
      :position    => 2,
      :title       => 'Replace doorknob',
      :notes       => "In Michaels room",
      :state       => 'active',
      :klass       => "Completable::Todo",
      :tags        => ['repair'],
      :isActive    => true,
      :isCompleted => false,
      :permissions => DEMO_PERMISSIONS
    },
    "3" => {
      :id          => 3,
      :position    => 3,
      :title       => 'Call roofer',
      :notes       => '555-5555',
      :state       => 'active',
      :klass       => "Completable::Todo",
      :tags        => ['repair'],
      :isActive    => true,
      :isCompleted => false,
      :permissions => DEMO_PERMISSIONS
    },
    "4" => {
      :id          => 4,
      :position    => 4,
      :title       => 'Replace showerhead',
      :notes       => 'new showerhead is in the bathroom closet',
      :state       => 'active',
      :klass       => "Completable::Todo",
      :tags        => ['repair'],
      :isActive    => true,
      :isCompleted => false,
      :permissions => DEMO_PERMISSIONS
    },
    "5" => {
      :id          => 5,
      :position    => 5,
      :title       => 'Replace showerhead',
      :notes       => 'new showerhead is in the bathroom closet',
      :state       => 'active',
      :klass       => "Completable::Todo",
      :tags        => ['repair'],
      :isActive    => true,
      :isCompleted => false,
      :permissions => DEMO_PERMISSIONS
    },
    "6" => {
      :id          => 6,
      :position    => 6,
      :title       => 'Milk',
      :notes       => '',
      :state       => 'active',
      :klass       => "Completable::ShoppingItem",
      :tags        => ['Safeway'],
      :isActive    => true,
      :isCompleted => false,
      :permissions => DEMO_PERMISSIONS
    },
    "7" => {
      :id          => 7,
      :position    => 7,
      :title       => 'Eggs',
      :notes       => '',
      :state       => 'active',
      :klass       => "Completable::ShoppingItem",
      :tags        => ['Safeway'],
      :isActive    => true,
      :isCompleted => false,
      :permissions => DEMO_PERMISSIONS
    },
    "8" => {
      :id          => 8,
      :position    => 8,
      :title       => 'Butter',
      :notes       => '',
      :state       => 'active',
      :klass       => "Completable::ShoppingItem",
      :tags        => ['Safeway'],
      :isActive    => true,
      :isCompleted => false,
      :permissions => DEMO_PERMISSIONS
    },
    "9" => {
      :id          => 9,
      :position    => 9,
      :title       => 'Bread',
      :notes       => '',
      :state       => 'active',
      :klass       => "Completable::ShoppingItem",
      :tags        => ['Luckys', 'Costco'],
      :isActive    => true,
      :isCompleted => false,
      :permissions => DEMO_PERMISSIONS
    },
    "10" => {
      :id          => 10,
      :position    => 10,
      :title       => 'Ice cream',
      :notes       => "Breyers if they don't have Jersey Cow",
      :state       => 'active',
      :klass       => "Completable::ShoppingItem",
      :tags        => ['Costco'],
      :isActive    => true,
      :isCompleted => false,
      :permissions => DEMO_PERMISSIONS
    },
    "11" => {
      :id          => 11,
      :position    => 11,
      :title       => 'Tomatos',
      :notes       => '',
      :state       => 'active',
      :klass       => "Completable::ShoppingItem",
      :tags        => ["Farmer's market"],
      :isActive    => true,
      :isCompleted => false,
      :permissions => DEMO_PERMISSIONS
    },
  }
  class HoneyDoDemo
    attr_accessor :user, :household, :browser

    def initialize(browser)
      @browser = browser
    end

    def config
      {
        :configState => {
          :identity => {
            :userId => nil,
            :userFirstName => "your first name",
            :userLastName => "your last name",
            :authToken => nil,
            :householdId => nil,
            :householdName => "no household name",
          },
          :apiEndpoint => nil,
          :interface => (browser.device.mobile? ? 'touch' : 'html5')
        },
        :dataState => {
          todos: DEMO_DATA
        }
      }.to_json
    end
  end
end
