class AddDescriptionToTodo < ActiveRecord::Migration[4.2]
  def change
    add_column :todos, :description, :string
  end
end
