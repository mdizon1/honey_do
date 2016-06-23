# Tag is the join object that connects the taggable to the TagTitle which holds
# the actual tag content
class Tag < ActiveRecord::Base
  belongs_to :taggable, :polymorphic => true
  belongs_to :tag_title

  validates :taggable_id, :taggable_type, :presence => true
end
