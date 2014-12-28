class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :ip_address
      t.string :description
      t.string :type
      t.integer :target_id
      t.string :target_type
      t.integer :actor_id

      t.timestamps
    end
  end
end
