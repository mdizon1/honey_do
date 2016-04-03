class Completable::Todo < Completable
  acts_as_list :scope => :household
end
