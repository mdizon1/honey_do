class CompletableDecorator < Draper::Decorator
  include Draper::LazyHelpers
  delegate_all

  # TODO: move to serializer
  def to_json(user=nil)
    attrs = {
      :id           => id,
      :position     => position,
      :title        => title,
      :notes        => notes,
      :state        => aasm_state,
      :tags         => tag_titles.map(&:title).join(', '),
      :isActive    => active?,
      :isCompleted => completed?,
      :completedAt => completed_at
    }
    attrs[:permissions] = permissions_for_user(user) if user
    attrs
  end

end
