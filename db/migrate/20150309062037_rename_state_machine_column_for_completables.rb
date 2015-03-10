class RenameStateMachineColumnForCompletables < ActiveRecord::Migration
  def change
    rename_column :completables, :state, :aasm_state
  end
end
