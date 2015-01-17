class AddPositionToCompletable < ActiveRecord::Migration
  def change
    add_column :completables, :position, :integer
  end
end
