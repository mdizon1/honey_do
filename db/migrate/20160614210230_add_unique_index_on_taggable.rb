class AddUniqueIndexOnTaggable < ActiveRecord::Migration[4.2]
  def up
    add_index :tags, [:taggable_id, :taggable_type, :tag_title_id], :unique => true, :name => 'tags_join_idx'
  end

  def down
    remove_index :tags, :name => 'tags_join_idx'
  end
end
