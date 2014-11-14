class ChangeTodosToCompletables < ActiveRecord::Migration
  def change
    rename_table :todos, :completables
  end
end
