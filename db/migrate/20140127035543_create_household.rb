class CreateHousehold < ActiveRecord::Migration
  def change
    create_table :households do |t|
      t.string 'name'
    end
  end
end
