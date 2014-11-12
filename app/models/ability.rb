class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    #   user ||= User.new # guest user (not logged in)
    #   if user.admin?
    #     can :manage, :all
    #   else
    #     can :read, :all
    #   end
    #
    # The first argument to `can` is the action you are giving the user 
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on. 
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/ryanb/cancan/wiki/Defining-Abilities

    ############################## Household ##############################
    can :administrate, Household do |household|
      user.administrates?(household)
    end

    can :add_admin, Household do |household|
      user == household.head_admin
    end

    ############################## Todo ##############################
    can [:accept, :uncomplete], Todo do |todo|
      can?(:edit, todo) &&
        todo.completed? &&
        !todo.accepted?
    end

    can :complete, Todo do |todo|
      household = todo.household
      user.household == household &&
        !todo.completed? &&
        !todo.accepted?
    end

    can :destroy, Todo do |todo|
      household = todo.household
      user.household == household &&
        !can?(:accept, todo) &&
        ( todo.creator == user ||
          can?(:administrate, household)
        )
    end

    can :edit, Todo do |todo|
      household = todo.household
      can?(:administrate, household)
    end
  end
end
