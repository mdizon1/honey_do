source 'https://rubygems.org'

ruby '2.4.1'
gem 'rails', '5.1.2'

gem 'acts_as_list'
gem 'autoprefixer-rails'
gem 'aasm'
gem 'browser'
gem 'cancan'
# gem 'bootstrap-sass'
gem 'devise'
gem 'devise-token_authenticatable'
gem 'draper'
#gem 'foreigner'
gem 'foreman'
#gem 'font-awesome-rails' # included through webpack instead
gem 'haml'
gem 'haml-rails'
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'pg'
gem 'rails-backbone'
# gem 'sass-rails'
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
  gem 'pry'
  gem 'pry-rails'
  gem 'rspec-rails'
end

group :test do
  gem 'cucumber-rails', :require => false
  gem 'database_cleaner'
  gem 'selenium-webdriver'
  gem 'shoulda-matchers', :require => false # :require => false seems to be needed for spork
  gem 'spork-rails'
end

group :production do
  gem 'rails_12factor' #required for heroku assets
end
