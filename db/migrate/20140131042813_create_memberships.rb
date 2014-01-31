class CreateMemberships < ActiveRecord::Migration
  def change
    create_table :memberships do |t|
      t.integer :member_id
      t.integer :household_id

      t.timestamps
    end
  end
end
