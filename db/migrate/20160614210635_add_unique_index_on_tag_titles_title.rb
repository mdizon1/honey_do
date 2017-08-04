class AddUniqueIndexOnTagTitlesTitle < ActiveRecord::Migration[4.2]
  def change
    add_index :tag_titles, :title, :unique => true, :name => 'tag_titles_title_idx'
  end
end
