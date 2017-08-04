class AddCreatorToTodos < ActiveRecord::Migration[4.2]
  def change
    add_column :todos, :creator_id, :integer
  end
end
