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
  task :realistic_seed => :environment do
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
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Eggs', :notes => ''
    i.tag_titles = [costco]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Steak 3lbs', :notes => ''
    i.tag_titles = [costco]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Ground beef', :notes => ''
    i.tag_titles = [costco]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'String cheese', :notes => ''
    i.tag_titles = [costco]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Parmesean', :notes => ''
    i.tag_titles = [costco]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Ravioli', :notes => ''
    i.tag_titles = [safeway]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'kids multivitamin', :notes => ''
    i.tag_titles = [costco, walgreens]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Cough syrup', :notes => ''
    i.tag_titles = [walgreens]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Cough drops', :notes => ''
    i.tag_titles = [walgreens]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Milk', :notes => ''
    i.tag_titles = [costco, safeway]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Butter', :notes => ''
    i.tag_titles = [andronicos]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Flour', :notes => ''
    i.tag_titles = [safeway]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Celery', :notes => ''
    i.tag_titles = [farm, costco]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Baby formula', :notes => 'Babys only brand'
    i.tag_titles = [andronicos]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Sardines', :notes => ''
    i.tag_titles = [andronicos]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Bread', :notes => ''
    i.tag_titles = [andronicos]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Oatmeal', :notes => ''
    i.tag_titles = [luckys, costco]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Cereal', :notes => ''
    i.tag_titles = [costco, safeway]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Coffee', :notes => ''
    i.tag_titles = [safeway, andronicos]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Garbage bags', :notes => ''
    i.tag_titles = [costco]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Ziploc bags', :notes => ''
    i.tag_titles = [target, costco]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Balloons', :notes => ''
    i.tag_titles = [target]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'WD40', :notes => ''
    i.tag_titles = [target]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Onions', :notes => ''
    i.tag_titles = [costco]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Spinach', :notes => ''
    i.tag_titles = [farm]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Kale', :notes => ''
    i.tag_titles = [farm]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Bitter melon', :notes => ''
    i.tag_titles = [ranch]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'An Choy', :notes => ''
    i.tag_titles = [ranch]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Soft tofu', :notes => ''
    i.tag_titles = [ranch]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Miso', :notes => ''
    i.tag_titles = [ranch]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Rice', :notes => ''
    i.tag_titles = [ranch]; i.save
    i = FactoryGirl.create :shopping_item, :household => household, :title => 'Ginger', :notes => ''
    i.tag_titles = [ranch]; i.save
  end
end
