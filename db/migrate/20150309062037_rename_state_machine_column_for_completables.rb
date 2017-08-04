class RenameStateMachineColumnForCompletables < ActiveRecord::Migration[4.2]
  def change
    rename_column :completables, :state, :aasm_state
  end
end
