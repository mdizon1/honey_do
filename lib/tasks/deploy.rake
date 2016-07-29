namespace :deploy do
  desc 'deploy to heroku'
  task :heroku => :environment do
    if Rails.env != 'development'
      raise 'Error, attempting to deploy from a non development environment'
    end

    clean_public_assets

    compile_webpack_assets

    commit_changes_to_git

    push_to_production

    cut_deploy_tag

    run_migrations_on_prod
  end
end

# Clean out the assets generated from the previous webpack compilation
def clean_public_assets
  status_log "Cleaning public assets."
  public_asset_path = Rails.root.join('public', 'assets')
  `rm -f #{public_asset_path}`
end

def compile_webpack_assets
  status_log "Compiling webpack assets."
  Rake::Task['webpack:compile'].invoke
end

def commit_changes_to_git
  status_log "Commiting changes to git."
  `git commit -am 'Prepare webpack assets for deploy #{Time.now.to_s}'`
end

def cut_deploy_tag
  status_log "Cutting git tag for deployment."
  `git tag -a hrkudply_attempt_#{Time.now.to_s(:compressed)} -m 'Deploying to Heroku from rake task'`
end

#TODO eventually, I want to cut this tag if deploy succeeds so need to read 
# the output from push_to_production and determine if deployment was successful
def cut_deploy_success_tag
  `git tag -a hrkudply_success_#{Time.now.to_s(:compressed)} -m 'Deploy to Heroku complete`
end

def push_to_production
  status_log "Pushing to production."
  `git push heroku master`
end

def run_migrations_on_prod
  status_log "Running migrations on production."
  `heroku run rake db:migrate`
end

def status_log(str)
  puts "DEPLOY LOG: \n\t#{str}"
end
