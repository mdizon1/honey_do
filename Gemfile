source 'https://rubygems.org'

ruby '2.2.0'
gem 'rails', '4.0.2'

gem 'acts_as_list'
gem 'autoprefixer-rails'
gem 'state_machine'
gem 'cancan'
gem 'bootstrap-sass'
gem 'devise'
#gem 'foreigner'
gem 'font-awesome-rails'
gem 'haml'
gem 'haml-rails'
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'pg'
gem 'rails-backbone'
gem 'sass-rails'

group :development do
  gem 'awesome_print'
  #gem 'better_errors'
  gem 'debugger'
end

group :development, :test do
  gem 'factory_girl_rails'
  gem 'faker'
  gem 'guard'
  gem 'guard-spork'
  gem 'rspec-rails'
end

group :test do
  gem 'shoulda-matchers', :require => false # :require => false seems to be needed for spork
  gem 'spork-rails'
end

#group :asses do
#  gem 'therubyracer', :platforms => :ruby
#end

group :production do
  gem 'rails_12factor' #required for heroku assets
end
