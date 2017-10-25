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

### Premium features:
  + Recurring tasks
  + Scheduled tasks (with a due date)
  + Meal plans
  + Analytics
  + Scorekeeping
  + Checking off on behalf of others

### NOTES:

#### Remote development
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

### Development setup
Install Docker.
Install docker-compose
docker-compose build
docker-compose up
docker-compose run --rm web bundle exec rake db:create db:migrate dev:seed

### Deploy process
heroku container:push web

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
