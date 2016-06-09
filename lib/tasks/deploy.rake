namespace :deploy do
  desc 'deploy to heroku'
  task :heroku do
    return if Rails.env != 'development'
    # clean out the assets generated from the previous webpack compilation
    clean_public_assets


    # compile webpack assets
    Rake::Task['webpack:compile'].invoke
    # commit the 
    `git push heroku master`
    `heroku run rake db:migrate`
  end
end

def clean_public_assets
  public_asset_path = Rails.root.join('public', 'assets')
  `rm -f #{public_asset_path}`
end
