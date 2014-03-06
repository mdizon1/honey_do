class Todo < ActiveRecord::Base
  belongs_to :household
  belongs_to :creator, :foreign_key => :creator_id, :class_name => "User"
  belongs_to :completor, :foreign_key => :completor_id, :class_name => "User"

  def complete!(completor)
    raise "A completor was not provided to complete! the todo" unless completor
    self.completed_at = Time.now if  self.completed_at == nil
    self.completor = completor if self.completor == nil
  end

  def complete?
    #IMPLEMENT ME!!!
    if(self.completed_at != nil && self.completor != nil)
      return true
    end
  end

  def uncomplete!
    #IMPLEMENT ME
    raise NotImplementedError
  end
end
