class AddPositionToCompletable < ActiveRecord::Migration[4.2]
  def change
    add_column :completables, :position, :integer
  end
end
