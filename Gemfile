source 'https://rubygems.org'

ruby '2.4.1'
gem 'rails', '5.1.2'

gem 'acts_as_list'
gem 'autoprefixer-rails'
gem 'aasm'
gem 'browser'
gem 'cancan'
gem 'devise'
gem 'devise-token_authenticatable'
gem 'draper'
gem 'foreman'
gem 'haml'
gem 'haml-rails'
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'pg', '~>0.18' # want to upgrade, but need this for rails 5
gem 'rails-backbone'
gem 'therubyracer'
gem 'uglifier'
gem 'webpacker'

group :development do
  gem 'awesome_print'
  gem 'better_errors'
  gem 'byebug'
  gem 'spring'
  gem 'spring-commands-rspec'
  # TODO: Install and setup guard so specs re-run when i change them
end

group :test do
  gem 'cucumber-rails', :require => false
  gem 'database_cleaner'
  gem 'selenium-webdriver'
  gem 'shoulda-matchers'
end

group :development, :test do
  gem 'factory_girl_rails'
  gem 'faker'
  gem 'pry'
  gem 'pry-rails'
  gem 'rspec-rails'
end

group :production do
  #gem 'rails_12factor' #required for heroku assets
  gem 'passenger'
  gem 'tzinfo-data'
end
