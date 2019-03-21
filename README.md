# Honey Do

## An app for managing a household.

### Basic structure:
  + Household has many family members
  + Some of the family members are owners of the household
  + The household has many items (to do)
  + Any family member may check off an item
  + Any family member may create items
  + Only an owner of the household may accept that an item is complete
  + Only an owner of the household may delete an item
  + The household has a shopping list

### Features:

##### Responsive
All you need is a browser

##### Streamlined UX
The app's workflow is structured for ease and swiftness of use. The software is
meant to get out of your way and function simply as a tool.

##### Quick tagging
When creating a new Todo or Shopping item, simply add a hashtagged word to tag that item.  For example:

`Milk #grocery`

will create a todo item named Milk with the tag grocery.  Further:

`Eggs #grocery #safeway #costco`

would tag Eggs with grocery, safeway, and costco

### Premium Features:
  + Recurring tasks
  + Scheduled tasks (with a due date)
  + Meal plans
  + Analytics
  + Scorekeeping
  + Checking off on behalf of others

### NOTES:

#### Remote Development
When running the development server on a remote machine (e.g. on ec2) then use
the following line:
```
REMOTE_DEVELOPMENT=<ip_address> rails s -b 0.0.0.0
```
The webpack dev server must also be run with the appropriate arguments
```
webpack: ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --content-base build/ --config config/webpack/development.config.js --inline --hot --host 0.0.0.0
```
Lastly, a change must be made to the remote_development.js config file.  The
file itself has the necessary instruction

### Development Setup
Install Docker.
Install docker-compose
docker-compose build
docker-compose up
docker-compose run --rm webpack-dev ./bin/yarn install
docker-compose run --rm web bundle exec rake db:create db:migrate dev:seed

### Deploy process
#### Via Amazon ec2 machine
First deploy steps:
  + Provision machine
  + Create and keep key for SSL
  + Set proper security group for machine
  + Install Tools
    * tmux
    * neovim
    * git
  + Install Docker
  + Add docker group
  + Add ec2-user to the docker group
  + Setup machine with Git key
  + Pull application code
  + Swap Dockerfile.prod with Dockerfile
  + Swap docker-compose.prod.yml with docker-compose.yml
  + Set HONEYDO_PROD_PW environment variable (for database)
  + docker-compose build
  + create/migrate db
  + docker-compose up
  + Copy cert_chain file into app directory
  + Copy certificate private key into app directory
  + setup elastic ip on machine
  + setup route53 to point honey-do.app to point to that ip

Subsequent deploy steps:
  + ssh into production machine
  + git clean -df
  + git pull
  + Swap Dockerfile.prod with Dockerfile
  + Swap docker-compose.prod.yml with docker-compose.yml
  + docker-compose down
  + docker-compose up --build # if rebuild is necessary else just docker-compose up
  + (if new migrations) docker-compose run --rm web rake db:migrate

----

#### DEPRECATED
##### Via Elastic Beanstalk
Steps:
  + asset precompile
    RAILS_ENV=production NODE_ENV=production bin/rake assets:precompile
  * zip source
    using the provided script/deploy
  * upload source to beanstalk
  * if the environment changed or is restarted, need to up the instance to at
    least m1.med because a t1.micro won't survive bundle install
  * if the environment changed or is restarted, need to update the Environment
    variable with the new db hostname

----

### Production Maintenance
Tasks:
  + Backup DB
  + Drain logs regularly or set up a logging service

### Open issues:

#### Material UI Nested list items
I'm currently using nested list items to show the longer descriptions or notes
under each todo or shopping item.  http://www.material-ui.com/#/components/list
The default behavior adds a caret to the right side that expands the nested
list, however, I need a little expander menu there instead to handle more
controls than just expand/contract.

The problem is, when I want to attach some handler to the menu so that the
nested items expand or collapse, I can't.  The way nested items works is there
is a prop to pass into the ListItem called initiallyOpen which will render the
nested items as expanded or not.  The problem is when updating the state to
flip initiallyOpen to true/false, it doesn't rerender.  I'm not sure if this
is a bug or intentional.

I was able to work around this by having two entirely different ListItems be
rendered depending on whether the nested items were to be expanded or not.
One which has nestedItems and one without.  Both would have initiallyOpen
set to true.  If the list was supposed to be flipped open, it would render the
ListItem with nested items, otherwise it would render the ListItem without any
nested items.

---
