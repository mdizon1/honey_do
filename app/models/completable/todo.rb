class Completable::Todo < Completable
  acts_as_list :scope => :household

  accepts_nested_attributes_for :tag_titles, :allow_destroy => true
end
