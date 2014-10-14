class ChangeTodosDescriptionToNotes < ActiveRecord::Migration
  def change
    rename_column :todos, :description, :notes
  end
end
