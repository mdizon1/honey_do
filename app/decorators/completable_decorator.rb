class CompletableDecorator < Draper::Decorator
  include Draper::LazyHelpers
  delegate_all

  # TODO: move to serializer
  def to_json(user=nil)
    attrs = {
      :id          => id,
      :position    => position,
      :title       => title,
      :notes       => notes,
      :state       => aasm_state,
      :klass       => source.class.to_s,
      :tags        => tag_titles.map(&:title).join(', '),
      :isActive    => active?,
      :isCompleted => completed?,
      :completedAt => completed_at
    }
    if user
      permissions = permissions_for_user(user)
      permissions = Hash[permissions.map{|k,v| 
        new_key = k.to_s.camelize
        new_key = new_key[0, 1].downcase + new_key[1..-1]
        new_key = new_key.to_sym
        [new_key, v]
      }]
      attrs[:permissions] = permissions
    end
    attrs
  end

end
