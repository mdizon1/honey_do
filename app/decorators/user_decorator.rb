class UserDecorator < Draper::Decorator
  include Draper::LazyHelpers
  delegate_all

  def permissions_json(household)
    a = Ability.new(self)
    {
      :isAdmin => a.can?(:administrate, household),
      :canCreateTodo => true
    }
  end
end
