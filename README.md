# Honey Do

An app for managing a household.

### Basic structure:
  + Household has many family members
  + Some of the family members are owners of the household
  + The household has many items (to do)
  + Any family member may check off an item
  + Any family member may create items
  + Only an owner of the household may accept that an item is complete
  + Only an owner of the household may delete an item
  + The household has a shopping list

### Premium features:
  + Recurring tasks
  + Scheduled tasks (with a due date)
  + Meal plans
  + Analytics
  + Scorekeeping
  + Checking off on behalf of others

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

### CURRENT

### BACKLOG

##### Deploy to heroku
##### change accept todo icon
##### Iron out the signup flow
##### Craft welcome/landing page (logged out)
##### Todo items should go to the front of the list when added
##### Tags can have icons or avatars (not sure which yet, probably both)
##### Create seed list of built in tags
##### Add foreign key constraints
##### Handle submit on enter when creating todo
##### Add additional validations on todocontroller for permission verification
##### User can have an avatar (MARTY)
##### Handle close new todo modal with escape
##### Handle error on todo creation
##### Take picture of item to add to todo (or any uploaded image)
##### Household 'make head admin' command must remove other head admin
##### Household admin can invite other members
##### Create UI for choosing colors for tags (premium feature?)
##### Allow user to edit their profile
##### User can hide completed todos
##### Completed todos hidden by default except for admins
##### Show user name in navbar when logged in
##### Switch to Thin server
##### Admin can assign tasks to members

### DONE 

##### Todo list can be filtered by tag
##### Create UI for displaying tags
##### Install and set up guard-spork
##### Add interface for tagging todo items
##### Todo items (and shopping items) can be tagged
##### Add spork
##### Create shopping list and add to shopping tab
##### Update backbone
  * BUG: creating a new todo doesn't add it to the list

##### Make todos orderable
##### REFACTOR: Use 1 collection instead of 2 in backbone for todos
##### Create an event system and track events on todo transitions
##### REFACTOR: Add state machine to todos
##### Backbonize todo list control
##### Add tooltips to todo controls
##### Install/setup backbone rails
##### Household head admin can give admin status to other members
##### Design 2nd pass
  * Mobile first
  * Make it responsive
  * Todo management, shopping list management

##### Display user email in navbar when logged in
##### Add shopping list tab
##### House admin can uncomplete a todo
##### Todo can be destroyed
##### Add indexes to households table
##### Add indexes to todos table
##### User can create a todo item for the household
##### User can complete a todo item
##### When user logs in, if they have a household, goto the show view
##### First wave of style
  * Add bootstrap
  * Install a bootstrap skin
  * Bootstrapize the markup
  * Make some crappy first pass on design

##### Create proper route around todo creation: household/todos
##### Make todos acceptible
  * An admin of the household must accept a todo to remove it
  * Simply completing the todo makes it display crossed out

##### Choose/use a bootstrap theme
##### User can create a household
##### Only a household admin may create todos
##### Change user to has\_one household
##### A user can be a household administrator
  * Gets associated when they create a household
  * Each household has a single head who has highest admin access

##### Create unique index on is\_head\_admin for membership
Ensure only 1 head admin per household
##### Validate only 1 head admin per household
##### Flesh out user model more
  * Add name

##### User can sign in
  * install devise
  * generate devise actions
  * put login/out actions in place

##### Install twitter bootstrap
##### Create and push project repo to github
##### Todo item can be asked whether it's complete
##### Todo item can be uncompleted
##### Todo item can be completed
##### Household has many 'items'
##### Household has many 'members'
  * Members are users

##### Create household model
##### Attach devise to user model
##### Create user model

