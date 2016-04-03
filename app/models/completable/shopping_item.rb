class Completable::ShoppingItem < Completable
  acts_as_list :scope => :household
end
