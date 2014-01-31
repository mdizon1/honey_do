class CreateTodo < ActiveRecord::Migration
  def change
    create_table :todos do |t|
      t.integer :household_id
      t.integer :completor_id
      t.datetime :completed_at
      t.integer :acceptor_id
      t.datetime :accepted_at

      t.timestamps
    end
  end
end
