class AddTitleToTodos < ActiveRecord::Migration
  def change
    add_column :todos, :title, :string, :default => ''
  end
end
