class AddAdminToMembership < ActiveRecord::Migration[4.2]
  def change
    add_column :memberships, :is_admin, :boolean, :default => false
    add_column :memberships, :is_head_admin, :boolean, :default => false
  end
end
