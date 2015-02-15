class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.string :taggable_type
      t.integer :taggable_id
      t.integer :tag_title_id

      t.timestamps
    end
  end
end
