class AddTypeToTodos < ActiveRecord::Migration[4.2]
  def change
    add_column :todos, :type, :string
  end
end
