class SetDefaultsForTodos < ActiveRecord::Migration[4.2]
  def change
    change_column :todos, :completed_at, :datetime, :default => nil
    change_column :todos, :accepted_at, :datetime, :default => nil
  end
end
