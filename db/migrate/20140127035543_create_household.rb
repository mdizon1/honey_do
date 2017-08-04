class CreateHousehold < ActiveRecord::Migration[4.2]
  def change
    create_table :households do |t|
      t.string 'name'
    end
  end
end
