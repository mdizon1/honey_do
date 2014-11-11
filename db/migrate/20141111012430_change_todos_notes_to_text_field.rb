class ChangeTodosNotesToTextField < ActiveRecord::Migration
  def change
    change_column :todos, :notes, :text, :default => ''
  end
end
