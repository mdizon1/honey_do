class TagTitle < ActiveRecord::Base
  has_many :tags, :dependent => :destroy
  has_many :todos, :through => :tags#, :source => :taggable, :source_type => 'Completable::Todo'
end
