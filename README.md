# AngularJS in Patterns

## Abstract

One of the best ways to learn something new is to see how the things you already know fits in it.
The goal of this paper is to show the patterns used in the AngularJS framework and any application build with this framework.

## Introduction

The document begins with brief overview of the AngularJS framework. The overview explains the main AngularJS components - directives, filters, controllers, services, scope. Next sections describe the different design patterns used in the framework and how you can take advantage of concepts we are already familiar with.

## AngularJS overview

AngularJS is JavaScript framework developed by Google. It intents to provide solid base for the development of CRUD Single-Page Applications (SPA).
SPA is web application, which once loaded, does not require full page reload when the user performs any actions with it. This means that all application resources (data, templates, scripts, styles) should be loaded with the initial request or better - the information and resources should be loaded on demand.
Since most of the CRUD applications has common characteristics and requirements, AngularJS intents to provide the optimal set of them out-of-the-box. Few important features of AngularJS are:

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

These components can be grouped inside different modules, which helps to achieve higher level of abstraction and handle complexity. Each of the components encapsulates specific piece of the application's logic.

### Partials

The partials are HTML strings. They may contain AngularJS expressions inside the elements or their attributes. One of the distinctions between AngularJS and the others frameworks is the fact that AngularJS's templates are not in an intermediate format, which needs to be turned into HTML (which is the case with mustache.js and handlebars, for example).

Initially each SPA loads `index.html` file. In the case of AngularJS this file contains a set of standard and custom HTML attributes, elements and comments, which configure and bootstrap the application. Each sub-sequenced user action requires only load of another partial or change of the state of the application, for example through the data binding provided by the framework.

**Sample partial**

```HTML
<html ng-app>
 <!-- Body tag augmented with ngController directive  -->
 <body ng-controller="MyController">
   <input ng-model="foo" value="bar">
   <!-- Button tag with ng-click directive, and
          string expression 'buttonText'
          wrapped in "{{ }}" markup -->
   <button ng-click="changeFoo()">{{buttonText}}</button>
   <script src="angular.js"></script>
 </body>
</html>
````

With AngularJS expressions partials define what kind of actions should be performed for handling different user interactions. In the example above the value of the attribute `ng-click` states that the method `changeFoo` of the current *scope* will be invoked.

### Controllers

The AngularJS controllers are JavaScript functions, which help handling the user interactions with the web application (for example mouse events, keyboard events, etc.), by attaching methods to the *scope*. All required external, for the controllers, components are provided through the Dependency Injection mechanism of AngularJS. The controllers are also responsible for providing the *model* to the partials by attaching data to the *scope*. We can think of this data as *view model*.

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

1. Change the value of `foo` by typing in the input box. This will immediately reflect the value of `foo` because of the two-way data binding.
2. Change the value of `foo` by clicking the button, which will be labeled `Click me to change foo!`.

All the custom elements, attributes, comments or classes could be recognized as AngularJS *directives* if they are previously defined as ones.

### Scope

In AngularJS scope is JavaScript object, which is exposed to the partials. The scope could contains different properties - primitives, objects or methods. All methods attached to the scope could be invoked by evaluation of AngularJS expression inside the partials associated with the given scope or direct call of the method by any component, which keeps reference to the scope. By using appropriate *directives*, the data attached to the scope could be binded to the view in such way that each change in the partial will reflect a scope property and each change of a scope property will reflect the partial.

Another important characteristics of the scopes of any AngularJS application is that they are connected into a prototypical chain (except scopes, which are explicitly stated as *isolated*). This way any child scope will be able to invoke methods of its parents since they are properties of its direct or indirect prototype.

Scope inheritance is illustrated in the following example:

```HTML
<div ng-controller="BaseCtrl">
  <div id="child" ng-controller="ChildCtrl">
    <button id="parent-method" ng-click="foo()">Parent method</button>
    <button ng-click="bar()">Child method</button>
  </div>
</div>
```

```JavaScript
function BaseCtrl($scope) {
  $scope.foo = function () {
    alert('Base foo');
  };
}

function ChildCtrl($scope) {
  $scope.bar = function () {
    alert('Child bar');
  };
}
```

With `div#child` is associated `ChildCtrl` but since the scope injected inside `ChildCtrl` inherits prototypically from its parent scope (i.e. the one injected inside `BaseCtrl`) the method `foo` is accessible by `button#parent-method`.

### Directives

In AngularJS the directives are the place where all DOM manipulations should be encapsulated. Each directive has a name and logic associated with it. In the simplest case the directive contains only name and definition of *postLink* function, which encapsulates all the logic required for the directive. In more complex cases the directive could contain a lot of properties such as:

- template
- compile function
- link function
- etc...

By citing the name of the directives they can be used inside the declarative partials.

Example:

```JavaScript
myModule.directive('alertButton', function () {
  return {
    template: '<button ng-transclude></button>',
    scope: {
      content: '@'
    },
    replace: true,
    restrict: 'E',
    transclude: true,
    link: function (scope, el) {
      el.click(function () {
        alert(scope.content);
      });
    }
  };
});
```

```HTML
<alert-button content="42">Click me</alert-button>
```

In the example above the tag `<alert-button></alert-button>` will be replaced button element. When the user clicks on the button the string `42` will be alerted.

Since the intent of this paper is not to explain the complete API of AngularJS, we will stop with the directives here.

### Filters

The filters in AngularJS are responsible for encapsulating logic required for formatting data. Usually filters are used inside the partials but they are also accessible in the controllers, directives, *services* and other filters through Dependency Injection.

Here is definition of a sample filter, which turns given string to uppercase:

```JavaScript
myModule.filter('uppercase', function () {
  return function (str) {
    return (str || '').toUpperCase();
  };
});
```

Inside a partial this filter could be used using the Unix's piping syntax:

```HTML
<div>{{ name | uppercase }}</div>
```

Inside a controller the filter could be used as follows:

```JavaScript
function MyCtrl(uppercaseFilter) {
  $scope.name = uppercaseFilter('foo'); //FOO
}
```

### Services

Every piece of logic, which doesn't belong to the components described above should be placed inside a service. Usually services encapsulate the domain specific logic, persistence logic, XHR, WebSockets, etc. When the controllers in the application became too "fat" the repetitive code should be placed inside a service.

```JavaScript
myModule.service('Developer', function () {
  this.name = 'Foo';
  this.motherLanguage = 'JavaScript';
  this.live = function () {
    while (true) {
      this.code();
    }
  };
});
```

The service could be injected inside any component, which supports dependency injection (controllers, other services, filters, directives).

```JavaScript
function MyCtrl(developer) {
  developer.live();
}
```

## AngularJS Patterns

### Singleton

>The singleton pattern is a design pattern that restricts the instantiation of a class to one object. This is useful when exactly one object is needed to coordinate actions across the system. The concept is sometimes generalized to systems that operate more efficiently when only one object exists, or that restrict the instantiation to a certain number of objects.

In the UML diagram bellow is illustrated the singleton design pattern.

![Singleton](./images/singleton.png "Fig. 1")

### Factory Method

>The factory method pattern is a creational pattern which uses factory methods to deal with the problem of creating objects without specifying the exact class of object that will be created. This is done by creating objects via a factory method, which is either specified in an interface (abstract class) and implemented in implementing classes (concrete classes); or implemented in a base class, which can be overridden when inherited in derived classes; rather than by a constructor.

![Factory Method](./images/factory-method.png "Fig. 2")

### Composite

>The composite pattern is a partitioning design pattern. The composite pattern describes that a group of objects are to be treated in the same way as a single instance of an object. The intent of a composite is to "compose" objects into tree structures to represent part-whole hierarchies.

![Composite](./images/composite.png "Fig. 3")


### Decorator

>The decorator pattern (also known as Wrapper, an alternative naming shared with the Adapter pattern) is a design pattern that allows behavior to be added to an individual object, either statically or dynamically, without affecting the behavior of other objects from the same class.

![Decorator](./images/decorator.png "Fig. 4")

AngularJS provides out-of-the-box way for extending/changing the functionality of already existing services. Using the method `decorator` of `$provide` you can create "wrapper" of any service you have previously defined:

```JavaScript
myModule.controller('MainCtrl', function (foo) {
  foo.bar();
});

myModule.factory('foo', function () {
  return {
    bar: function () {
      console.log('I\'m bar');
    },
    baz: function () {
      console.log('I\'m baz');
    }
  };
});

myModule.config(function ($provide) {
  $provide.decorator('foo', function ($delegate) {
    var barBackup = $delegate.bar;
    $delegate.bar = function () {
      console.log('Decorated');
      barBackup.apply($delegate, arguments);
    };
    return $delegate;
  });
});
```
The example above defines new service called `foo`. In the `config` callback is called the method `$provide.decorator` with first argument `"foo"`, which is the name of the service, we want to decorate and second argument factory function, which implements the actual decoration. `$delegate` keeps reference to the original service `foo`. Using the dependency injection mechanism of AngularJS, reference to this local dependency is passed as first argument. We decorate the service by overriding its method `bar`. We extend `bar` by invoking one more `console.log statement` - `console.log('Decorated');` and after that call the original `bar` method into appropriate context.

### Facade

### Flyweight

### Proxy

### Interpreter

### Observer (publish/subscribe)

>The observer pattern is a software design pattern in which an object, called the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods. It is mainly used to implement distributed event handling systems.

![Observer](./images/observer.png "Fig. 6")

There are two basic ways of communication between the scopes in an AngularJS application. The first one is calling methods of parent scope by a child scope. This is possible since the child scope inherits prototypically by its parent, as mentioned above (see [Scope](#scope)). This allows communication in a single direction - child to parent. Some times it is necessary to call method of given child scope or notify it about a triggered event in the context of the parent scope. AngularJS provides built-in observer pattern, which allows this. Another possible use case, of the observer pattern, is when multiple scopes are interested in given event but the scope, in which context the event is triggered, is not aware of them.

Each AngularJS scope has public methods called `$on`, `$emit` and `$broadcast`. The method `$on` accepts topic as first argument and callback as second. We can think of the callback as an observer (in JavaScript the functions are first-class):

```JavaScript
function ExampleCtrl($scope) {
  $scope.$on('event-name', function handler() {
    //body
  });
}
```

In this way the current scope "subscribes" to events of type `event-name`. When `event-name` is triggered in any parent or child scope of the given one, `handler` would be called.

The methods `$emit` and `$broadcast` are used for triggering events respectively upwards and downwards through the scope chain.
For example:

```JavaScript
function ExampleCtrl($scope) {
  $scope.$emit('event-name', { foo: 'bar' });
}
```

The scope in the example above, triggers the event `event-name` to all scopes upwards. This means that each of the parent scopes of the given one, which are subscribed to the event `event-name`, would be notified and their handler callback will be invoked.

Analogical is the case when the method `$broadcast` is called. The only difference is that the event would be transmitted downwards - to all children scopes.
Each scope can subscribe to any event with multiple callbacks (i.e. it can associate multiple observers to given event).

### Chain of Responsibilities

>The chain-of-responsibility pattern is a design pattern consisting of a source of command objects and a series of processing objects. Each processing object contains logic that defines the types of command objects that it can handle; the rest are passed to the next processing object in the chain. A mechanism also exists for adding new processing objects to the end of this chain.

![Chain of Responsibilities](./images/chain-of-responsibilities.png "Fig. 5")

As stated above the scopes in an AngularJS application form a hierarchy known as the scope chain. Some of the scopes are "isolated", which means that they don't inherit prototypically by their parent scope, but are connected to it via their `$parent` property.

When `$emit` or `$broadcast` are called we can think of the scope chain as event bus, or even more accurately chain of responsibilities. Once the event is triggered it is emitted downwards or upwards (depending on the method, which was called). Each subsequent scope may:

- Handle the event and pass it to the next scope in the chain
- Handle the event and stop its propagation
- Pass the event to the next scope in the chain without handling it
- Stop the event propagation without handling it

In the example bellow you can see an example in which `ChildCtrl` triggers an event, which is propagated upwards through the scope chain. In the case above each of the parent scopes (the one used in `ParentCtrl` and the one used in `MainCtrl`) are going to handle the event by logging into the console: `"foo received"`. If any of the scopes should be considered as final destination it can call the method `stopPropagation` of the event object, passed to the callback.

```JavaScript
myModule.controller('MainCtrl', function ($scope) {
  $scope.$on('foo', function () {
    console.log('foo received');
  });
});

myModule.controller('ParentCtrl', function ($scope) {
  $scope.$on('foo', function (e) {
    console.log('foo received');
  });
});

myModule.controller('ChildCtrl', function ($scope) {
  $scope.$emit('foo');
});
```

### Active record

### Page Controller

## AngularJS application Patterns

### Data Mapper