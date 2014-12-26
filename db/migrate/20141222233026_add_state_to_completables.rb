class AddStateToCompletables < ActiveRecord::Migration
  def change
    add_column :completables, :state, :string
  end
end
