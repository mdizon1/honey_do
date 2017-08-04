class RemoveUniqueHeadAdminIndex < ActiveRecord::Migration[4.2]
  def change
    remove_index :memberships, [:household_id, :is_head_admin]
  end
end
