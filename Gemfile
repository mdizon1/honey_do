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
gem 'webpacker'

group :development do
  gem 'awesome_print'
  #gem 'better_errors'
  gem 'byebug'
  gem 'spring'
  gem 'spring-commands-rspec'
  # TODO: Install and setup guard so specs re-run when i change them
end

group :development, :test do
  gem 'factory_girl_rails'
  gem 'faker'
  gem 'pry'
  gem 'pry-rails'
  gem 'rspec-rails'
end

group :test do
  gem 'cucumber-rails', :require => false
  gem 'database_cleaner'
  gem 'selenium-webdriver'
  gem 'shoulda-matchers'
end

group :production do
  #gem 'rails_12factor' #required for heroku assets
  gem 'passenger', '>= 5.0.25', :require => 'phusion_passsenger/rack_handler'
end
