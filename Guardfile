# A sample Guardfile
# More info at https://github.com/guard/guard#readme

## Uncomment and set this to only include directories you want to watch
directories %w(app lib config spec)

## Uncomment to clear the screen before every task
# clearing :on

## Guard internally checks for changes in the Guardfile and exits.
## If you want Guard to automatically start up again, run guard in a
## shell loop, e.g.:
##
##  $ while bundle exec guard; do echo "Restarting Guard..."; done
##
## Note: if you are using the `directories` clause above and you are not
## watching the project directory ('.'), then you will want to move
## the Guardfile to a watched dir and symlink it back, e.g.
#
#  $ mkdir config
#  $ mv Guardfile config/
#  $ ln -s config/Guardfile .
#
# and, you'll have to watch "config/Guardfile" instead of "Guardfile"

#guard :spork, :cucumber_env => { 'RAILS_ENV' => 'test' }, :rspec_env => { 'RAILS_ENV' => 'test' } do
#  watch('config/application.rb')
#  watch('config/environment.rb')
#  watch('config/environments/test.rb')
#  watch(%r{^config/initializers/.+\.rb$})
#  watch('Gemfile.lock')
#  watch('spec/spec_helper.rb') { :rspec }
#  watch('test/test_helper.rb') { :test_unit }
#  watch(%r{features/support/}) { :cucumber }
#end

#guard :rspec, :version => 2, :cli => "--color --drb -r", :bundler => false, :all_after_pass => false, :all_on_start => false, :keep_failed => false do
guard :spork, :rspec_env => { 'RAILS_ENV' => 'test' } do
  watch('spec/spec_helper.rb')                                               { "spec" }
  watch('app/controllers/application_controller.rb')                         { "spec/controllers" }
  #watch('config/routes.rb')                                                  { "spec/routing" }
  watch(%r{^spec/support/(requests|controllers|mailers|models)_helpers\.rb}) { |m| "spec/#{m[1]}" }
  watch(%r{^spec/.+_spec\.rb})

  watch(%r{^app/controllers/(.+)_(controller)\.rb})                          { |m| ["spec/routing/#{m[1]}_routing_spec.rb", "spec/#{m[2]}s/#{m[1]}_#{m[2]}_spec.rb", "spec/requests/#{m[1]}_spec.rb"] }

  watch(%r{^app/(.+)\.rb})                                                   { |m| "spec/#{m[1]}_spec.rb" }
  watch(%r{^lib/(.+)\.rb})                                                   { |m| "spec/lib/#{m[1]}_spec.rb" }
end
