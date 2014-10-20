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


## TODO: 

---

### CURRENT

### BACKLOG

##### Create unique index on is\_head\_admin for membership
Ensure only 1 head admin per household
##### A user can be a household administrator
  * Gets associated when they create a household
  * Can add todo items
  * Can invite other members
  * Can turn other members into administrators
  * Each household has a single head who has highest admin access

##### Allow user to edit their profile
##### Change user to has\_one household
##### User can create a household
##### When user logs in, if they have a household, goto the show view
##### User can create a todo item for the household
##### User can complete a todo item
##### User can uncomplete a todo item
##### User can add another user to the household
##### Add indexes to households table
##### Add indexes to todos table
##### Switch to Thin server

### DONE 
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
  + Members are users

##### Create household model
##### Attach devise to user model
##### Create user model

