class ChangeTodosNotesToTextField < ActiveRecord::Migration[4.2]
  def change
    change_column :todos, :notes, :text, :default => ''
  end
end
