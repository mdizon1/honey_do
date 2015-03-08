source 'https://rubygems.org'

ruby '2.2.0'
gem 'rails', '4.2.0'

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
gem 'therubyracer'
gem 'uglifier'

group :development do
  gem 'awesome_print'
  #gem 'better_errors'
  gem 'byebug'
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

#NOTE: assets doesn't work in rails 4
#group :assets do
#end

group :production do
  gem 'rails_12factor' #required for heroku assets
end
