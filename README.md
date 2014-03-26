# AngularJS Patterns

## Abstract

This document describes different design patterns used in AngularJS or any AngularJS application, their purpose and applications.

## Introduction

The document begins with brief overview of the AngularJS framework. The overview explains the main AngularJS components - directives, filters, controllers, services, scope. Next sections describes the different design patterns used in the different components.

## AngularJS overview

AngularJS is JavaScript framework developed by Google. It intents to provide solid base for the development of CRUD Single-Page Applications (SPA).
SPA is web application, which doesn't require page reload when the user performs any actions. This means that all web application should be loaded with the initial request or better - the information and resources should be loaded on demand.
Since most of the CRUD applications has common characteristics and requirements AngularJS intents to provide the optimal set of them out-of-the-box. Few important features of AngularJS are:

- two-way data binding
- dependency injection
- separation of concerns
- testability
- abstraction

The separation of concerns is achieved by dividing each AngularJS application into separate components, such as:

- partials
- controllers
- directives
- services
- filters

These components can be grouped inside different modules, which helps to achieve higher level of abstraction when required.

### Partials

The partials are HTML strings. They may contain AngularJS expressions inside the elements or their attributes. One of the main advantages of AngularJS is the fact that Angular's templates are not in an intermediate format, which needs to be turned into HTML.

Initially each SPA loads `index.html` file. In the case of AngularJS this file contains a set of standard and custom HTML attributes, directives and comments, which configure and bootstrap the application. Each sub-sequenced user action requires only load of another partial or change of the state of the application, through the data binding provided by the framework.

Sample partial:

```HTML
<html ng-app>
 <!-- Body tag augmented with ngController directive  -->
 <body ng-controller="MyController">
   <input ng-model="foo" value="bar">
   <!-- Button tag with ng-click directive, and
          string expression 'buttonText'
          wrapped in "{{ }}" markup -->
   <button ng-click="changeFoo()">{{buttonText}}</button>
   <script src="angular.js">
 </body>
</html>
````

With AngularJS expressions partials define what kind of actions should be performed for handling different user interactions. In the example above the value of the attribute `ng-click` states that the method `changeFoo` of the current *scope* will be invoked.

### Controllers

The AngularJS controllers are JavaScript functions, which handle the user interactions with the partials (for example mouse events, keyboard events, etc.), by attaching methods to the *scope*. All required external for the controllers components are provided through the Dependency Injection mechanism of AngularJS. The controllers are also responsible for providing the model to the partials by attaching data to the *scope*. We can think of this data as *view model*.

```JavaScript
function MyController($scope) {

  $scope.buttonText = 'Click me to change foo!';
  $scope.foo = 42;

  $scope.changeFoo = function () {
    $scope.foo += 1;
    alert('Foo changed');
  };
}
````

For example, if we wire the sample controller above with the partial provided in the previous section the user will be able to interact with the application in few different ways.

1. Change the value of `foo` by typing in the input field. This will immediately reflect the value of `foo` because of the two-way data binding.
2. Change the value of `foo` by clicking the button, which will be labeled `Click me to change foo!`.

All the custom elements, attributes, comments or classes could be recognized as AngularJS *directives* if they are previously defined as ones.

## Scope

In AngularJS scope is JavaScript object, which is exposed to the view. The scope could contains different properties - primitives, objects or methods. All methods attached to the scope could be invoked by evaluation of AngularJS expression inside the partials associated with the given scope or direct call of the method by any component, which keeps reference to the scope.