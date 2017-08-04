class AddTimestampsToHousehold < ActiveRecord::Migration[4.2]
  def change
    add_column :households, :created_at, :datetime
    add_column :households, :updated_at, :datetime
  end
end
