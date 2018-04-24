/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb


require("expose-loader?$!expose-loader?jQuery!jquery"); // adds $ to window so we can jquery in global scope
require("jquery-ujs");
require("bootstrap-loader");
require("font-awesome-sass-loader");
//var process = require("process");
var _ = require("lodash");



console.log('Hello World from Webpacker');
if(process.env.NODE_ENV != 'production') {
  require("../styles/application.scss");
}




// BEGIN TYPESCRIPT CHECK
class Student {
  fullName: string;
  constructor(public firstName, public middleInitial, public lastName) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

//var user = "Jane User";
//var user = [0,1,2]; // Compiler error
//var user = { firstName: "Jane", lastName: "Donnahue" };
var user = new Student("Jane", "M.", "User");

console.log("DEBUG: Typescript check ---> ", greeter(user));
// END TYPESCRIPT CHECK
//
//

require ("./honey_do/entry.js");
