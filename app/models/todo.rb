class Todo < ActiveRecord::Base
  belongs_to :household
  belongs_to :creator, :foreign_key => :creator_id, :class_name => "User"
  belongs_to :completor, :foreign_key => :completor_id, :class_name => "User"

  def complete!(completor)
    raise "A completor was not provided to complete! the todo" unless completor
    self.completed_at = Time.now if self.completed_at == nil
    self.completor = completor if self.completor == nil
    save
  end

  def complete?
    return true if(self.completed_at != nil && self.completor != nil)
  end

  def uncomplete!
    if complete?
      self.completed_at = nil
      self.completor = nil
      save
    end
  end
end
