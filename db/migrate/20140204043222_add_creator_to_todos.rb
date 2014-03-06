class AddCreatorToTodos < ActiveRecord::Migration
  def change
    add_column :todos, :creator_id, :integer
  end
end
