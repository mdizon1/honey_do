class CreateTagTitles < ActiveRecord::Migration[4.2]
  def change
    create_table :tag_titles do |t|
      t.string :title

      t.timestamps
    end
  end
end
