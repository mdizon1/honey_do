class AddUniqueIndexOnTaggable < ActiveRecord::Migration
  def change
    add_index :tags, [:taggable_id, :taggable_type], :unique => true, :name => 'tags_taggable_id_taggable_type_idx'
  end
end
