class RemoveUniqueHeadAdminIndex < ActiveRecord::Migration
  def change
    remove_index :memberships, [:household_id, :is_head_admin]
  end
end
