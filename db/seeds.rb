# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
#

seed_tags = [
  'Target', 'Whole Foods', 'Andronicos', 'Sprouts', 'Costco'
]

seed_tags.each do |curr_tag|
  new_tag = TagTitle.find_or_create_by(:title => curr_tag)
  unless(new_tag.persisted?)
    puts("\tLOG: SEED: created a new tag for --> #{curr_tag}");
  else
    puts("\tLOG: SEED: tag was not created --> #{curr_tag} because --> #{new_tag.errors.full_messages.join(",")}");
  end
end
