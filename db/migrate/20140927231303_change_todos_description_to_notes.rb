class ChangeTodosDescriptionToNotes < ActiveRecord::Migration[4.2]
  def change
    rename_column :todos, :description, :notes
  end
end
