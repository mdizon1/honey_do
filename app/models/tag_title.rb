# TagTitle holds the actual tag content such as title and any associated 
# metadata
class TagTitle < ActiveRecord::Base
  has_many :tags, :dependent => :destroy
  has_many :todos, :through => :tags#, :source => :taggable, :source_type => 'Completable::Todo'

  validates :title, :presence => :true, :uniqueness => true
end
