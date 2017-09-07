export const TODOS = 'TODOS'
export const SHOPPING_LIST = 'SHOPPING_LIST'
export const TODO_ITEM = 'TODO_ITEM'
export const SHOPPING_ITEM = 'SHOPPING_ITEM'

export const UiTabs = {
  TODOS: TODOS,
  SHOPPING_LIST: SHOPPING_LIST
}

export const UiTabToType = {
  TODOS: TODO_ITEM,
  SHOPPING_LIST: SHOPPING_ITEM
}

export const TodoKlassToFriendlyString = {
  "Completable::Todo": "todo",
  "Completable::ShoppingItem": "shopping item"
}

export const TodoKlassToType = {
  "Completable::Todo": TODO_ITEM,
  "Completable::ShoppingItem": SHOPPING_ITEM
}

export const TodoKlassToDataState = {
  "Completable::Todo": "todos",
  "Completable::ShoppingItem": "shoppingItems"
}

export const TodoTypeToDataState = {
  TODO_ITEM: "todos",
  SHOPPING_ITEM: "shoppingItems"
}

export const TodoTypeToFriendlyString = {
  TODO_ITEM: "todo",
  SHOPPING_ITEM: "shopping item"
}

export const TodoTypeToKlass = {
  TODO_ITEM: "Completable::Todo",
  SHOPPING_ITEM: "Completable::ShoppingItem"
}

