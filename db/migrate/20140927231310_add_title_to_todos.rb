class AddTitleToTodos < ActiveRecord::Migration[4.2]
  def change
    add_column :todos, :title, :string, :default => ''
  end
end
