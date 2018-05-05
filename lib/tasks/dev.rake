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
    ############## END INIT HOUSEHOLDS ###############
    ##################################################

    ##################################################
    ############## INIT USERS ########################
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
    ############## END INIT USERS ####################
    ##################################################

    ##################################################
    ############## INIT TAGS #########################
    ##################################################

    puts "\tLOG: SEED: building Tags"

    (rand(40) + 3).times do |itor|
      begin
        t = FactoryGirl.create :color_tag_title
        puts "\tLOG: SEED: TagTitle added -> #{t.title}"
      rescue
      end
    end

    ##################################################
    ############## END INIT TAGS #####################
    ##################################################

    ##################################################
    ############## INIT TODOS ########################
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

    (rand(10) + 3).times do |itor|
      t = FactoryGirl.create :shopping_item, :household => household
      puts "\tLOG: SEED: shopping item added -> #{t.title}"
    end

    (rand(15) + 3).times do |itor|
      t = FactoryGirl.create :food_shopping_item, :household => household
      puts "\tLOG: SEED: food item added -> #{t.title}"
    end

    ##################################################
    ############## END INIT TODOS ####################
    ##################################################

    ##################################################
    ############## TAG RANDOM TODOS ##################
    ##################################################

    all_tag_titles = TagTitle.all
    Completable.all.sample(rand(Completable.count)).each do |curr_todo|
      (rand(3) + 1).times do |itor|
        begin
          curr_todo.tag_titles << all_tag_titles.sample
        rescue
        end
      end
    end

    ##################################################
    ############## END TAG TODOS #####################
    ##################################################
  end


  desc "Seed the db with dummy data that looks like some real world use case"
  task :realisitc_seed => :environment do
    puts "\tLOG: SEED: building households"
    household = FactoryGirl.create :household

    puts "\tLOG: SEED: building users"

    house_head_admin_member = FactoryGirl.create(:household_head_admin, :household => household)
    FactoryGirl.create(:household_admin, :household => household)
    house_member = FactoryGirl.create(:membership, :household => household)

    user = house_member.user
    user.email = 'huser@example.com'
    user.password = user.password_confirmation = '123456'
    user.save

    house_head_admin = house_head_admin_member.user
    house_head_admin.email = 'hhadmin@example.com'
    house_head_admin.password = house_head_admin.password_confirmation = '123456'
    house_head_admin.save

    puts "\tLOG: SEED: building Tags"

    costco = FactoryGirl.create(:tag_title, :title => 'Costco')
    safeway = FactoryGirl.create(:tag_title, :title => 'Safeway')
    luckys = FactoryGirl.create(:tag_title, :title => 'Luckys')
    andronicos = FactoryGirl.create(:tag_title, :title => 'Andronicos')
    walgreens = FactoryGirl.create(:tag_title, :title => 'Walgreens')
    target = FactoryGirl.create(:tag_title, :title => 'Target')
    ranch = FactoryGirl.create(:tag_title, :title => 'Ranch 99')
    farm = FactoryGirl.create(:tag_title, :title => "Farmer's market")

    puts "\tLOG: SEED: building todos"
    FactoryGirl.create :todo, :household => household, :title => 'Fix kitchen door handle', :notes => ''
    FactoryGirl.create :todo, :household => household, :title => 'Replace shower head', :notes => 'In guest bathroom'
    FactoryGirl.create :todo, :household => household, :title => 'Take out trash', :notes => ''
    FactoryGirl.create :todo, :household => household, :title => 'Assemble new bookshelf', :notes => ''
    FactoryGirl.create :todo, :household => household, :title => 'Call roofer', :notes => ''
    FactoryGirl.create :todo, :household => household, :title => 'Make appointment for new brakes', :notes => 'For the Honda'
    FactoryGirl.create :todo, :household => household, :title => 'Prepare cupcakes for Stevens birthday', :notes => 'Ingredients are in the pantry'
    FactoryGirl.create :todo, :household => household, :title => 'Schedule playdate for Emily', :notes => "Call Cally's parents at 555-5543"

    puts "\tLOG: SEED: building shopping items"
    FactoryGirl.create :shopping_item, :household => household, :title => 'Eggs', :tags => [costco]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Steak 3lbs', :tags => [costco]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Ground beef', :tags => [costco]
    FactoryGirl.create :shopping_item, :household => household, :title => 'String cheese', :tags => [costco]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Parmesean', :tags => [costco]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Ravioli', :tags => [safeway]
    FactoryGirl.create :shopping_item, :household => household, :title => 'kids multivitamin', :tags => [costco, walgreens]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Cough syrup', :tags => [walgreens]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Cough drops', :tags => [walgreens]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Milk', :tags => [costco, safeway]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Butter', :tags => [andronicos]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Flour', :tags => [safeway]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Celery', :tags => [farm, costco]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Baby formula', :notes => 'Babys only brand', :tags => [andronicos]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Sardines', :tags => [andronicos]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Bread', :tags => [andronicos]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Oatmeal', :tags => [luckys, costco]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Cereal', :tags => [costco, safeway]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Coffee', :tags => [safeway, andronicos]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Garbage bags', :tags => [costco]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Ziploc bags', :tags => [target, costco]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Balloons', :tags => [target]
    FactoryGirl.create :shopping_item, :household => household, :title => 'WD40', :tags => [target]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Onions', :tags => [costco]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Spinach', :tags => [farm]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Kale', :tags => [farm]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Bitter melon', :tags => [ranch]
    FactoryGirl.create :shopping_item, :household => household, :title => 'An Choy', :tags => [ranch]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Soft tofu', :tags => [ranch]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Miso', :tags => [ranch]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Rice', :tags => [ranch]
    FactoryGirl.create :shopping_item, :household => household, :title => 'Ginger', :tags => [ranch]
  end
end
