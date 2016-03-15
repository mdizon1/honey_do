namespace :dev do
  desc "Reset db with bare dev seed data"
  task :reset => :environment do
    task_sequence = %w(db:reset db:drop db:create db:migrate db:test:prepare)
    
    task_sequence.each do |task_name|
      puts "\tLOG: DEV:RESET: #{task_name}"
      Rake::Task[task_name].reenable
      Rake::Task[task_name].invoke
    end
  end
 
  desc "Seed the db with dummy data that I can use to test dev stuff"
  task :seed => :environment do
    ##################################################
    ############## INIT HOUSEHOLDS ###################
    ##################################################
    puts "\tLOG: SEED: building households"

    household = FactoryGirl.create :household

    ##################################################
    ############## END INIT HOUSEHOLDS ###################
    ##################################################

    ##################################################
    ############## INIT USERS ###################
    ##################################################
    puts "\tLOG: SEED: building users"

    house_head_admin_member = FactoryGirl.create(:household_head_admin, :household => household)
    house_admin_member = FactoryGirl.create(:household_admin, :household => household)
    house_member = FactoryGirl.create(:membership, :household => household)

    user = house_member.user
    user.email = 'huser@example.com'
    user.password = user.password_confirmation = '123456'
    user.save

    house_head_admin = house_head_admin_member.user
    house_head_admin.email = 'hhadmin@example.com'
    house_head_admin.password = house_head_admin.password_confirmation = '123456'
    house_head_admin.save

    house_admin = house_admin_member.user
    house_admin.email = 'hadmin@example.com'
    house_admin.password = house_admin.password_confirmation = '123456'
    house_admin.save

    ##################################################
    ############## END INIT USERS ###################
    ##################################################


    ##################################################
    ############## INIT TODOS ###################
    ##################################################
    puts "\tLOG: SEED: building todos"
    
    (rand(50) + 10).times do |itor|
      t = FactoryGirl.create :todo, :household => household
      puts "\tLOG: SEED: todo added -> #{t.title}"
    end

    (rand(20) + 1).times do |itor|
      t = FactoryGirl.create :completed_todo, :household => household, :completor => user
      puts "\tLOG: SEED: completed todo added -> #{t.title}"
    end

    (rand(5) + 1).times do |itor|
      t = FactoryGirl.create :accepted_todo, :household => household, :completor => user, :acceptor => house_head_admin
      puts "\tLOG: SEED: accepted todo added -> #{t.title}"
    end
    
    ##################################################
    ############## END INIT TODOS ###################
    ##################################################
  end
end
