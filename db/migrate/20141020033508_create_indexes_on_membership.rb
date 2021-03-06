class CreateIndexesOnMembership < ActiveRecord::Migration[4.2]
  def change
    add_index :memberships, [:member_id, :household_id], :unique => true
    add_index :memberships, [:household_id, :is_head_admin], :unique => true
  end
end
