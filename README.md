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

```html
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
```