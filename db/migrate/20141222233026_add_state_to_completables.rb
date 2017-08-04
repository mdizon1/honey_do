class AddStateToCompletables < ActiveRecord::Migration[4.2]
  def change
    add_column :completables, :state, :string
  end
end
