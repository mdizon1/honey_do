class SetDefaultsForTodos < ActiveRecord::Migration
  def change
    change_column :todos, :completed_at, :datetime, :default => nil
    change_column :todos, :accepted_at, :datetime, :default => nil
  end
end
