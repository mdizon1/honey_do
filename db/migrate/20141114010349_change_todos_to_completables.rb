class ChangeTodosToCompletables < ActiveRecord::Migration[4.2]
  def change
    rename_table :todos, :completables
  end
end
