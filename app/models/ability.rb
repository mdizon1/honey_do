class Ability
  include CanCan::Ability

  # See the wiki for details:
  # https://github.com/ryanb/cancan/wiki/Defining-Abilities
  def initialize(user)

    ############################## Household ##############################
    can :administrate, Household do |household|
      user.administrates?(household)
    end

    can :add_admin, Household do |household|
      user == household.head_admin
    end

    ############################## Completable ##############################
    can :accept, Completable do |todo|
      household = todo.household
      can?(:edit, todo) &&
        todo.completed? &&
        !todo.accepted? &&
        can?(:administrate, household)
    end

    can :complete, Completable do |todo|
      household = todo.household
      user.household == household &&
        !todo.completed? &&
        !todo.accepted?
    end

    can :destroy, Completable do |todo|
      household = todo.household
      user.household == household &&
        ( can?(:administrate, household) ||
          todo.creator_id == user.id && !todo.accepted?
        )
    end

    can :edit, Completable do |todo|
      household = todo.household
      todo.creator_id == user.id || 
        can?(:administrate, household)
    end

    can :reorder, Completable do |todo|
      can?(:complete, todo) || can?(:uncomplete, todo)
    end

    can :uncomplete, Completable do |todo|
      household = todo.household
      user.household == household &&
        !todo.accepted? && 
        todo.completed? &&
        (todo.completor_id == user.id || can?(:edit, todo))
    end

  end
end
