class CreateTagTitles < ActiveRecord::Migration
  def change
    create_table :tag_titles do |t|
      t.string :title

      t.timestamps
    end
  end
end
