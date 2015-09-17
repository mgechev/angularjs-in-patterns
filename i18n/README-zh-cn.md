# AngularJS 模式

<!--toc-->

## 目录

* [译本](#translations)
* [摘要](#abstract)
* [介绍](#introduction)
* [AngularJS 概览](#angularjs-overview)
  * [Partials](#partials)
  * [Controllers](#controllers)
  * [Scope](#scope)
  * [Directives](#directives)
  * [Filters](#filters)
  * [Services](#services)
* [AngularJS 模式](#angularjs-patterns)
  * [Services](#services-1)
    * [单例模式 (Singleton)](#singleton)
    * [工厂方法模式 (Factory Method)](#factory-method)
    * [修饰模式 (Decorator)](#decorator)
    * [外观模式](#facade)
    * [代理模式](#proxy)
    * [Active Record](#active-record)
    * [截取筛选器](#intercepting-filters)
  * [Directives](#directives-1)
    * [组合模式](#composite)
  * [Interpreter](#interpreter)
    * [Template View](#template-view)
  * [Scope](#scope-1)
    * [观察者模式](#observer)
    * [责任链模式](#chain-of-responsibilities)
    * [命令模式](#command)
  * [Controller](#controller-1)
    * [页面控制器](#page-controller)
  * [其它](#others)
    * [模块模式](#module-pattern)
    * [数据映射模式](#data-mapper)
    * [Observer Pattern as an External Service](#observer-pattern-as-an-external-service)
* [参考文献](#references)

<!--endtoc-->

## <a name='translations'>译本</a>

- [日文](https://github.com/mgechev/angularjs-in-patterns/blob/master/i18n/README-ja-jp.md) 译者：[morizotter](https://twitter.com/morizotter)
- [俄文](http://habrahabr.ru/post/250149/)
- [法文](https://github.com/mgechev/angularjs-in-patterns/blob/master/i18n/README-fr-fr.md) 译者：[manekinekko](https://github.com/manekinekko)

## <a name='abstract'>摘要</a>

学习新事物的最好方式之一就是观察其如何运用整合已知的知识。本文将介绍基本的面向对象、设计模式和架构模式概念，而非向读者传授如何熟练使用设计或架构模式。本文的主旨是细述各种软件设计和架构模式是如何运用在 AngularJS 或者任何单页 AngularJS 应用中。
<!--
One of the best ways to learn something new is to see how the things you already know are used in it.
This document does not intend to make its readers familiar with the design or architectural patterns; it suggests basic understanding of the concepts of the OOP, design patterns and architectural patterns.
The goal of this paper is to describe how different software design and architectural patterns are applied in AngularJS or any AngularJS single-page application.
-->

## <a name='introduction'>介绍</a>

本文将首先简要介绍 AngularJS 框架，解释其主要构件 - directives, filters, controllers, services, scope。第二部分会依照 AngularJS 构件组成顺序，分别列述 AngularJS 框架中所实现的各种设计和架构模式，其中会特别注出被多个构件使用的模式。
<!--
The document begins with brief overview of the AngularJS framework. The overview explains the main AngularJS components - directives, filters, controllers, services, scope. The second section lists and describes different design and architectural patterns, which are implemented inside the framework. The patterns are grouped by the AngularJS component they are used in. If some patterns are used inside multiple components it will be explicitly mentioned.
-->

文章最后会提及在 AngularJS 单页应用中常用的架构模式。
<!--
The last section contains a few architectural patterns, which are commonly used inside most of the single-page applications built with AngularJS.
-->

## <a name='angularjs-overview'>AngularJS 概览</a>

AngularJS 是由 Google 开发的 JavaScript 框架，其提供了一个用于开发 CRUD 单页应用 (SPA) 的稳健基础。单页应用指的是一旦网页完成加载后，用户进行任何操作都无需重新加载完整的网页。这也意味着所有应用资源 (数据、模版、代码、样式) 都应该预先完成加载，或者更理想的是按需加载。由于大部分 CRUD 应用都包含共通的特质，AngularJS 提供了一套经过优化的现成工具实现来满足此需求。其中重要特质包括：
<!--
AngularJS is a JavaScript framework developed by Google. It intends to provide a solid base for the development of CRUD Single-Page Applications (SPA).
SPA is a web application, which once loaded, does not require full page reload when the user performs any actions with it. This means that all application resources (data, templates, scripts, styles) should be loaded with the initial request or better - the information and resources should be loaded on demand.
Since most of the CRUD applications has common characteristics and requirements, AngularJS intends to provide the optimal set of them out-of-the-box. A few important features of AngularJS are:
-->

- 双向数据绑定 (two-way data binding)
- 依赖注入 (dependency injection)
- 关注点分离 (separation of concerns)
- 可测试性 (testability)
- 抽象化 (abstraction)

实现关注点分离是将 AngularJS 应用划分为相互隔离的构件，如：
<!--
The separation of concerns is achieved by dividing each AngularJS application into separate components, such as:
-->

- partials
- controllers
- directives
- services
- filters

这些构件可以在不同的模块中组合，以帮助实现更高层级的抽象化以及处理复杂事件。每个单独构件会封装应用程序中特定部分的逻辑。
<!--
These components can be grouped inside different modules, which helps to achieve a higher level of abstraction and handle complexity. Each of the components encapsulates a specific piece of the application's logic.
-->

### Partials

Partial (模版片段) 实际就是 HTML 字符串，其元素和属性中可能含有一些 AngularJS 表达式。与 mustache.js 和 handlebars 等框架相比，AngularJS 的一个不同之处就是其模版并非是一种需要转化为 HTML 的中间格式。
<!--
The partials are HTML strings. They may contain AngularJS expressions inside the elements or their attributes. One of the distinctions between AngularJS and the others frameworks is the fact that AngularJS' templates are not in an intermediate format, which needs to be turned into HTML (which is the case with mustache.js and handlebars, for example).
-->

每个单页应用都会在初始化时读取 `index.html` 文件。在 AngularJS 中，此文件包含有一套用来配置和启动应用程序的标准和自定义 HTML 属性、元素和注释。接下来每个用户操作将仅仅加载一个 partial 文件或者通过软件框架的数据绑定等方式改变应用的当前状态。
<!--
Initially each SPA loads `index.html` file. In the case of AngularJS this file contains a set of standard and custom HTML attributes, elements and comments, which configure and bootstrap the application. Each sub-sequenced user action requires only load of another partial or change of the state of the application, for example through the data binding provided by the framework.
-->

**Partial 示例**

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
```

Partial 文件可以通过 AngularJS 表达式来定义不同用户交互操作所对应的行为。例如在上面的示例中，`ng-click` 属性的值表示执行当前 *scope* 中的 `changeFoo` 函数。
<!--
With AngularJS expressions partials define what kind of actions should be performed for handling different user interactions. In the example above the value of the attribute `ng-click` states that the method `changeFoo` of the current *scope* will be invoked.
-->

### Controllers

AnuglarJS 中的 controller (控制器) 则是 JavaScript 函数，可以通过将函数绑定到对应的 *scope* 上， 来帮助处理用户与网页应用的交互操作 (例如鼠标或键盘事件等)。Controller 所需要的所有外部构件都是通过 AngularJS 的依赖注入 (Dependency Injection) 机制实现。Controller 还将数据绑定到 *scope* 上，从而给 partial 提供 *model* 功能。我们可以将这些数据看成是 *view model*。
<!--
The AngularJS controllers are JavaScript functions, which help handling the user interactions with the web application (for example mouse events, keyboard events, etc.), by attaching methods to the *scope*. All required external, for the controllers, components are provided through the Dependency Injection mechanism of AngularJS. The controllers are also responsible for providing the *model* to the partials by attaching data to the *scope*. We can think of this data as *view model*.
-->

```JavaScript
function MyController($scope) {
  $scope.buttonText = 'Click me to change foo!';
  $scope.foo = 42;

  $scope.changeFoo = function () {
    $scope.foo += 1;
    alert('Foo changed');
  };
}
```

如果将以上 controller 示例与前一节中的 partial 示例结合在一起，用户就可以跟应用程序进行一些不同的交互操作。
<!--
For example, if we wire the sample controller above with the partial provided in the previous section the user will be able to interact with the application in few different ways.
-->

1. 通过输入框改变 `foo` 的值。由于这里使用了双向数据绑定，`foo` 值会立刻改变。
2. 点击 `Click me to change foo!` 按钮来改变 `foo` 的值。

<!--
1. Change the value of `foo` by typing in the input box. This will immediately reflect the value of `foo` because of the two-way data binding.
2. Change the value of `foo` by clicking the button, which will be labeled `Click me to change foo!`.
-->

所有自定义的元素、属性、注释或类，只要被预先定义过，就都可以被 AngularJS 的 *directive* 识别。
<!--
All the custom elements, attributes, comments or classes could be recognized as AngularJS *directives* if they are previously defined as ones.
-->

### Scope

在 AngularJS 中，scope 是一个开放给 partial 的 JavaScript 对象。Scope 可以包含不同的属性 - 基本数据 (primitives)、对象和函数。所有归属于 scope 的函数都可以通过解析该 scope 所对应 partial 中的 AngularJS 表达式来执行，也可以由任何构件直接调用该函数，which keeps reference to the scope。附属于 scope 的数据可以通过使用合适的 *directives* 来绑定到视图 (view) 上，如此所有 partial 中的修改都会映射为某个 scope 属性的变化，反之亦然。
<!--
In AngularJS scope is a JavaScript object, which is exposed to the partials. The scope could contain different properties - primitives, objects or methods. All methods attached to the scope could be invoked by evaluation of AngularJS expression inside the partials associated with the given scope or direct call of the method by any component, which keeps reference to the scope. By using appropriate *directives*, the data attached to the scope could be binded to the view in such a way that each change in the partial will reflect a scope property and each change of a scope property will reflect the partial.
-->

AngularJS 应用中的 scope 还有另一个重要的特质，即它们都被连接到一条原型链 (prototypical chain) 上 (除了那些被表明为*独立 (isolated)* 的 scope)。在这种方式中，任何子 scope 都能调用属于其父母的函数，因为这些函数是该 scope 的直接或间接原型 (prototype) 的属性。
<!--
Another important characteristics of the scopes of any AngularJS application is that they are connected into a prototypical chain (except scopes, which are explicitly stated as *isolated*). This way any child scope will be able to invoke methods of its parents since they are properties of its direct or indirect prototype.
-->

以下示例展示了 scope 继承关系：
<!--
Scope inheritance is illustrated in the following example:
-->

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

尽管 `div#child` 归属于 `ChildCtrl`，但由于 `ChildCtrl` 中所注入的 scope 通过原型继承了其父 scope (即 `BaseCtrl` 中注入的 scope)，因此`button#parent-method` 可以接触到 `foo` 函数。
<!--
With `div#child` is associated `ChildCtrl` but since the scope injected inside `ChildCtrl` inherits prototypically from its parent scope (i.e. the one injected inside `BaseCtrl`) the method `foo` is accessible by `button#parent-method`.
-->

### Directives

在 AngularJS 中，所有 DOM 操作都应该放置在 directive 内。作为一个经验法则，每当你的 controller 里出现了 DOM 操作，你就应该创建一个新的 directive 或者考虑重构现有的 directive 用来处理 DOM 操作需求。每个 directive 都有其自己的名称和逻辑。最简化的 directive 仅仅包含名称和 *postLink* 函数定义，其中封装了所有该 directive 所需的逻辑。较复杂的 directive 可以包含很多属性，例如：
<!--
In AngularJS the directives are the place where all DOM manipulations should be placed. As a rule of thumb, when you have DOM manipulations in your controller you should create a new directive or consider refactoring of already existing one, which could handle the required DOM manipulations.
Each directive has a name and logic associated with it. In the simplest case the directive contains only name and definition of *postLink* function, which encapsulates all the logic required for the directive. In more complex cases the directive could contain a lot of properties such as:
-->

- template (模版)
- compile 函数
- link 函数
- 等等

通过引用 directive 的名称，这些属性可以被用于声明该 directive 的 partial 中。
<!--
By citing the name of the directives they can be used inside the declarative partials.
-->

示例：
<!--
Example:
-->

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

在上述例子中，`<alert-button></alert-button>` 标签会被按钮元素所替换。当用户点击按钮时，会弹出显示 `42` 的警告框。
<!--
In the example above the tag `<alert-button></alert-button>` will be replaced button element. When the user clicks on the button the string `42` will be alerted.
-->

由于本文的关注点并非解释 AnuglarJS 的完整 API，directive 就解释到这里为止。
<!--
Since the intent of this paper is not to explain the complete API of AngularJS, we will stop with the directives here.
-->

### Filters

AngularJS 中的 filter (过滤器) 负责封装进行数据格式化所需的逻辑。Filter 通常被用在 partial 中，但也可以通过依赖注入方式在 controller、directive、*service* 和其它 filter 中使用。
<!--
The filters in AngularJS are responsible for encapsulating logic required for formatting data. Usually filters are used inside the partials but they are also accessible in the controllers, directives, *services* and other filters through Dependency Injection.
-->

以下是一个范例 filter 的定义，用来将给定的字符串转变为大写。
<!--
Here is a definition of a sample filter, which changes the given string to uppercase:
-->

```JavaScript
myModule.filter('uppercase', function () {
  return function (str) {
    return (str || '').toUpperCase();
  };
});
```

此 filter 可以用 Unix 的管道语法用于 partial 中。
<!--
Inside a partial this filter could be used using the Unix's piping syntax:
-->

```HTML
<div>{{ name | uppercase }}</div>
```

在 controller 中，filter 可以按如下方式使用：
<!--
Inside a controller the filter could be used as follows:
-->

```JavaScript
function MyCtrl(uppercaseFilter) {
  $scope.name = uppercaseFilter('foo'); //FOO
}
```

### Services

所有其它逻辑，如果不属于以上所述构件，则应该放置到 service (服务) 中。Service 通常会封装领域专用逻辑 (domain specific logic)、持久层逻辑 (persistence logic)、XHR、WebSockets 等。当应用程序中 controller 变得过于臃肿是，就应该考虑将重复的代码放入一个 service 中。
<!--
Every piece of logic, which doesn't belong to the components described above should be placed inside a service. Usually services encapsulate the domain specific logic, persistence logic, XHR, WebSockets, etc. When the controllers in the application became too "fat" the repetitive code should be placed inside a service.
-->

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

Service 可以被注入到任何支持依赖注入机制的构件中，例如 controller、其它 service、filter 和 directive。
<!--
The service could be injected inside any component, which supports dependency injection (controllers, other services, filters, directives).
-->

```JavaScript
function MyCtrl(Developer) {
  var developer = new Developer();
  developer.live();
}
```

## <a name='angularjs-patterns'>AngularJS 模式</a>

我们将在接下来的几节中探讨传统的设计和架构模式是如何在 AngularJS 的各个构件中组合实现的。并在最后一节讨论使用 AngularJS (或其它框架) 开发单页应用程序时常用的架构模式。
<!--
In the next a couple of sections, we are going to take a look how the traditional design and architectural patterns are composed in the AngularJS components.

In the last chapter we are going to take a look at some architectural patterns, which are frequently used in the development of Single-Page Applications with (but not limited to) AngularJS.
-->

### Services

#### <a name='singleton'>单例模式 (Singleton)</a>

>单例模式是一种软件设计模式。在应用这个模式时，单例对象的类必须保证只有一个实例存在。许多时候整个系统只需要拥有一个的全局对象，这样有利于我们协调系统整体的行为。如果系统在仅有一个对象或者有限个数的对象实例的环境中运行更加高效，也时常被归属为单例模式概念。
<!--
>The singleton pattern is a design pattern that restricts the instantiation of a class to one object. This is useful when exactly one object is needed to coordinate actions across the system. The concept is sometimes generalized to systems that operate more efficiently when only one object exists, or that restrict the instantiation to a certain number of objects.
-->

以下 UML 图展示了单例设计模式。
<!--
In the UML diagram bellow is illustrated the singleton design pattern.
-->

![Singleton](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/singleton.svg "Fig. 1")

AngularJS 会按照以下算法来解决构件所需要的依赖关系：
<!--
When given dependency is required by any component, AngularJS resolves it using the following algorithm:
-->

- 提取所依赖组件的名称，并查询哈希表 (该表是定义在一个闭包中，所以外部不可见)。
- 如果此依赖组件已经存在于应用中，AngularJS 会在需要的时候以参数的形式将其传递给对应的构件。
- 如果所依赖的组件不存在：
  - AngularJS 首先会调用其提供者的生成函数，如 `$get`。值得注意的是，创建此依赖组件的实例时，可能会对算法内容进行递归调用，以解决该组件本事的依赖关系。
  - AngularJS 然后会将其缓存在上面提到的哈希表中。
  - AngularJS 最后会在需要的时候将其传递给对应组件。
  
<!--
- Takes its name and makes a lookup at a hash map, which is defined into a lexical closure (so it has a private visibility).
- If the dependency exists AngularJS pass it as parameter to the component, which requires it.
- If the dependency does not exists:
  - AngularJS instantiate it by calling the factory method of its provider (i.e. `$get`). Note that instantiating the dependency may require recursive call to the same algorithm, for resolving all the dependencies required by the given dependency. This process may lead to circular dependency.
  - AngularJS caches it inside the hash map mentioned above.
  - AngularJS passes it as parameter to the component, which requires it.
-->

以 AngularJS 源代码中 `getService` 函数的实现为例：
<!--
We can take better look at the AngularJS' source code, which implements the method `getService`:
-->

```JavaScript
function getService(serviceName) {
  if (cache.hasOwnProperty(serviceName)) {
    if (cache[serviceName] === INSTANTIATING) {
      throw $injectorMinErr('cdep', 'Circular dependency found: {0}', path.join(' <- '));
    }
    return cache[serviceName];
  } else {
    try {
      path.unshift(serviceName);
      cache[serviceName] = INSTANTIATING;
      return cache[serviceName] = factory(serviceName);
    } catch (err) {
      if (cache[serviceName] === INSTANTIATING) {
        delete cache[serviceName];
      }
      throw err;
    } finally {
      path.shift();
    }
  }
}
```

由于每个 service 只会被实例化一次，我们可以将每个 service 看成是一个单例。缓存则可以被认为是单例管理器。这里与上面展示的 UML 图有微小的区别，那就是我们并不将单例的静态私有的 reference 保存在其构造 (constructor) 函数中，而是将 reference 保存在单例管理器中 (以上代码中的 `cache`)。
<!--
We can think of each service as a singleton, because each service is instantiated no more than a single time. We can consider the cache as a singleton manager. There is a slight variation from the UML diagram illustrated above because instead of keeping static, private reference to the singleton inside its constructor function, we keep the reference inside the singleton manager (stated in the snippet above as `cache`).
-->

如此 service 实际还是单例，但并不是以传统单例设计模式的方法所实现。相比之下，这种方式有如下优点：
<!--
This way the services are actually singletons but not implemented through the Singleton pattern, which provides a few advantages over the standard implementation:
-->

- 增强代码的可测试性
- 控制单例对象的创建 (在本节例子中，IoC 容器通过懒惰式单例实例化方式帮我们进行控制)

<!--
- It improves the testability of your source code
- You can control the creation of singleton objects (in our case the IoC container controls it for us, by instantiating the singletons lazy)
-->

对于更深入的讨论，可以参考 Misko Hevery 在 Google Testing blog 上的[文章](http://googletesting.blogspot.com/2008/05/tott-using-dependancy-injection-to.html)。
<!--
For further discussion on this topic Misko Hevery's [article](http://googletesting.blogspot.com/2008/05/tott-using-dependancy-injection-to.html) in the Google Testing blog could be considered.
-->

#### <a name='factory-method'>工厂方法模式 (Factory Method)</a>

>工厂方法模式是一种创建型模式，其实现了一个“工厂方法”概念来处理在不指定对象具体类型的情况下创建对象的问题。其解决方式不是通过构造函数来完成，而是在接口 (abstract class) 中定义一个用来创建对象的工厂方法，然后在实现类 (concrete classes) 中实现它。或者在一个基础类 (base class) 中实现它，而该类又可以通过继承关系被派生类 (derived class) 所重写。
<!--
>The factory method pattern is a creational pattern, which uses factory methods to deal with the problem of creating objects without specifying the exact class of object that will be created. This is done by creating objects via a factory method, which is either specified in an interface (abstract class) and implemented in implementing classes (concrete classes); or implemented in a base class, which can be overridden when inherited in derived classes; rather than by a constructor.
-->

![Factory Method](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/factory-method.svg "Fig. 2")

用如下代码为例：
<!--
Lets consider the following snippet:
-->

```JavaScript
myModule.config(function ($provide) {
  $provide.provider('foo', function () {
    var baz = 42;
    return {
      //Factory method
      $get: function (bar) {
        var baz = bar.baz();
        return {
          baz: baz
        };
      }
    };
  });
});

```

在上面的代码中，我们使用 `config` 回调来定义一个新的“provider”。Provider 是一个对象，其中含有一个 `$get` 函数。由于 JavaScript 语言没有接口 (interface)，而语言本身是鸭子类型 (duck-typed)，所以这里提供了一个给 provider 命名工厂方法的规则。
<!--
In the code above we use the `config` callback in order to define new "provider". Provider is an object, which has a method called `$get`. Since in JavaScript we don't have interfaces and the language is duck-typed there is a convention to name the factory method of the providers that way.
-->

每个 service、filter、directive 和 controller 都包含一个 provider (即工厂方法名为 `$get` 的对象)，用于负责创建该组件的实例。
<!-- 
Each service, filter, directive and controller has a provider (i.e. object which factory method, called `$get`), which is responsible for creating the component's instance.
-->

让我们更深入的来看看 AngularJS 中是如何实现的：
<!-- 
We can dig a little bit deeper in AngularJS' implementation:
-->

```JavaScript
//...

createInternalInjector(instanceCache, function(servicename) {
  var provider = providerInjector.get(servicename + providerSuffix);
  return instanceInjector.invoke(provider.$get, provider, undefined, servicename);
}, strictDi));

//...

function invoke(fn, self, locals, serviceName){
  if (typeof locals === 'string') {
    serviceName = locals;
    locals = null;
  }

  var args = [],
      $inject = annotate(fn, strictDi, serviceName),
      length, i,
      key;

  for(i = 0, length = $inject.length; i < length; i++) {
    key = $inject[i];
    if (typeof key !== 'string') {
      throw $injectorMinErr('itkn',
              'Incorrect injection token! Expected service name as string, got {0}', key);
    }
    args.push(
      locals && locals.hasOwnProperty(key)
      ? locals[key]
      : getService(key)
    );
  }
  if (!fn.$inject) {
    // this means that we must be an array.
    fn = fn[length];
  }

  return fn.apply(self, args);
}
```

从以上例子中，我们注意到 `$get` 函数被下面的代码使用：
<!-- 
From the example above we can notice how the `$get` method is actually used:
-->

```JavaScript
instanceInjector.invoke(provider.$get, provider, undefined, servicename)
```

上面这个代码片段调用了 `instanceInjector` 的 `invoke` 函数，其中第一个参数就是某服务的工厂方法 (即 `$get`)。在 `invoke` 内部，`annotate` 函数又将该工厂方法作为其第一个参数。如代码所示，`annotate` 使用 AngularJS 的依赖注入机制来解决所有依赖关系。当所有依赖关系都满足后，工厂方法函数就会被调用：`fn.apply(self, args)`。
<!-- 
The snippet above calls the `invoke` method of `instanceInjector` with the factory method (i.e. `$get`) of given service, as first argument. Inside `invoke`'s body `annotate` is called with first argument the factory method. Annotate resolves all dependencies through the dependency injection mechanism of AngularJS, which was considered above. When all dependencies are resolved the factory method is being called: `fn.apply(self, args)`.
-->

如果对照上面的 UML 图来看，我们可以认为这里的 provider 就是图中的“ConcreteCreator”，而实际组件就是“Product”。
<!--
If we think in terms of the UML diagram above we can call the provider a "ConcreteCreator" and the actual component, which is being created a "Product".
-->

由于工厂方法能间接的创建对象，使用这种设计模式能带来一些益处。尤其是框架能够在组件实例化的过程中关注解决一些 boilerplate:
<!--
There are a few benefits of using the factory method pattern in this case, because of the indirection it creates. This way the framework can take care of the boilerplates during the instantiation of new components like:
-->

- 最恰当的时候来完成组件所需的实例化过程
- 解决组件所需的所有依赖关系
- 给定组件所允许存在的实例个数 (对于 service 和 filter 来说只有一个，而 controller 可以有多个实例)

<!--
- The most appropriate moment, when the component needs to be instantiated
- Resolving all the dependencies required by the component
- The number of instances the given component is allowed to have (for services and filters only a single one but multiple for the controllers)
-->

#### <a name='decorator'>修饰模式 (Decorator)</a>
>修饰模式又被称为 wrapper，与 Adapter 模式的别名一样。它是一种可以动态或静态的往一个独立对象中添加新的行为，而不影响同一类所生成的其它对象的行为的设计模式。
<!--
>The decorator pattern (also known as Wrapper, an alternative naming shared with the Adapter pattern) is a design pattern that allows behavior to be added to an individual object, either statically or dynamically, without affecting the behavior of other objects from the same class.
-->

![Decorator](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/decorator.svg "Fig. 4")

AngularJS 已经提供了这种方式来扩展/增强现有 service 的功能。在这里通过使用 `$provide` 的 `decorator` 函数，我们可以在第三方已经定义和使用的 service 上创建一个“wrapper”：
<!--
AngularJS provides out-of-the-box way for extending and/or enhancing the functionality of already existing services. Using the method `decorator` of `$provide` you can create "wrapper" of any service you have previously defined or used by a third-party:
-->

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

上述例子定义了一个名为 `foo` 的新 service。在 `config` 中，回调了 `$provide.decorator` 函数，其第一个参数 `“foo”` 就是我们想要修饰的 service 的名称，而第二个参数则是实现修饰内容的函数。`$delegate` 则保持引用原有 `foo` service。通过使用 AngularJS 的依赖注入机制，这个本地依赖的 reference 是以构造函数的第一个参数传递。在这里，我们对 service 的修饰是重写其 `bar` 函数。实际修饰内容只是多执行一条 `console.log 语句` - `console.log('Decorated');`，然后继续在对应的上下文中调用原有 `bar` 函数。
<!--
The example above defines new service called `foo`. In the `config` callback is called the method `$provide.decorator` with first argument `"foo"`, which is the name of the service, we want to decorate and second argument factory function, which implements the actual decoration. `$delegate` keeps reference to the original service `foo`. Using the dependency injection mechanism of AngularJS, reference to this local dependency is passed as first argument of the constructor function.
We decorate the service by overriding its method `bar`. The actual decoration is simply extending `bar` by invoking one more `console.log statement` - `console.log('Decorated');` and after that call the original `bar` method with the appropriate context.
-->

在需要修改第三方 service 的功能时，使用这种模式特别有用。如果需要多个类似功能的修饰时 (例如函数的性能测量，授权，日志记录等)，我们可能会生成大量重复的代码，违反 DRY 原则。这种情况就需要使用[面向侧面的程序设计 (aspect-oriented programming)](http://en.wikipedia.org/wiki/Aspect-oriented_programming)。目前我所知的 AngularJS 的唯一 AOP 框架是 [github.com/mgechev/angular-aop](https://github.com/mgechev/angular-aop)。
<!--
Using this pattern is especially useful when we need to modify the functionality of third party services. In cases when multiple similar decorations are required (like performance measurement of multiple methods, authorization, logging, etc.), we may have a lot of duplications and violate the DRY principle. In such cases it is useful to use [aspect-oriented programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming). The only AOP framework for AngularJS I'm aware of could be found at [github.com/mgechev/angular-aop](https://github.com/mgechev/angular-aop).
-->

#### Facade

>A facade is an object that provides a simplified interface to a larger body of code, such as a class library. A facade can:

>1. make a software library easier to use, understand and test, since the facade has convenient methods for common tasks;

>2. make the library more readable, for the same reason;

>3. reduce dependencies of outside code on the inner workings of a library, since most code uses the facade, thus allowing more flexibility in developing the system;

>4. wrap a poorly designed collection of APIs with a single well-designed API (as per task needs).

![Facade](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/facade.svg "Fig. 11")

There are a few facades in AngularJS. Each time you want to provide higher level API to given functionality you practically create a facade.

For example, lets take a look how we can create an `XMLHttpRequest` POST request:

```JavaScript
var http = new XMLHttpRequest(),
    url = '/example/new',
    params = encodeURIComponent(data);
http.open("POST", url, true);

http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
http.setRequestHeader("Content-length", params.length);
http.setRequestHeader("Connection", "close");

http.onreadystatechange = function () {
  if(http.readyState == 4 && http.status == 200) {
    alert(http.responseText);
  }
}
http.send(params);
```
But if we want to post this data using the AngularJS' `$http` service we can:

```JavaScript
$http({
  method: 'POST',
  url: '/example/new',
  data: data
})
.then(function (response) {
  alert(response);
});
```
or we can even:

```JavaScript
$http.post('/someUrl', data)
.then(function (response) {
  alert(response);
});
```
The second option provides pre-configured version, which creates a HTTP POST request to the given URL.

Even higher level of abstraction is being created by `$resource`, which is build over the `$http` service. We will take a further look at this service in [Active Record](#active-record) and [Proxy](#proxy) sections.

#### Proxy

>A proxy, in its most general form, is a class functioning as an interface to something else. The proxy could interface to anything: a network connection, a large object in memory, a file, or some other resource that is expensive or impossible to duplicate.

![Proxy](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/proxy.svg "Fig. 9")

We can distinguish three different types of proxy:

- Virtual Proxy
- Remote Proxy
- Protection Proxy

In this sub-chapter we are going to take a look at AngularJS' implementation of Virtual Proxy.

In the snippet bellow, there is a call to the `get` method of `$resource` instance, called `User`:

```JavaScript
var User = $resource('/users/:id'),
    user = User.get({ id: 42 });
console.log(user); //{}
```

`console.log` would outputs an empty object. Since the AJAX request, which happens behind the scene, when `User.get` is invoked, is asynchronous, we don't have the actual user when `console.log` is called. Just after `User.get` makes the GET request it returns an empty object and keeps reference to it. We can think of this object as virtual proxy (a simple placeholder), which would be populated with the actual data once the client receives response by the server.

How does this works with AngularJS? Well, lets consider the following snippet:

```JavaScript
function MainCtrl($scope, $resource) {
  var User = $resource('/users/:id'),
  $scope.user = User.get({ id: 42 });
}
```

```html
<span ng-bind="user.name"></span>
```
Initially when the snippet above executes, the property `user` of the `$scope` object will be with value an empty object (`{}`), which means that `user.name` will be undefined and nothing will be rendered. Internally AngularJS will keep reference to this empty object. Once the server returns response for the get request, AngularJS will populate the object with the data, received from the server. During the next `$digest` loop AngularJS will detect change in `$scope.user`, which will lead to update of the view.

#### Active Record

>The Active Record object is an object, which carries both data and behavior. Usually most of the data in these objects is persistent, responsibility of the Active Record object is to take care of the communication with the database in order to create, update, retrieve or delete the data. It may delegate this responsibility to lower level objects but calls to instance or static methods of the active record object cause the database communication.

![Active Record](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/active-record.svg "Fig. 7")

AngularJS defines a service called `$resource`. In the current version of AngularJS (1.2+) it is being distributed in module outside of the AngularJS' core.

According to the AngularJS' documentation `$resource` is:

>A factory which creates a resource object that lets you interact with RESTful server-side data sources.
>The returned resource object has action methods which provide high-level behaviors without the need to interact with the low level $http service.

Here is how `$resource` could be used:

```JavaScript
var User = $resource('/users/:id'),
    user = new User({
      name: 'foo',
      age : 42
    });

user.$save();
```

The call of `$resource` will create a constructor function for our model instances. Each of the model instances will have methods, which could be used for the different CRUD operations.

This way we can use the constructor function and its static methods by:

```JavaScript
User.get({ userid: userid });
```

The code above will immediately return an empty object and keep reference to it. Once the response have been successfully returned and parsed, AngularJS will populate this object with the received data (see [proxy](#proxy)).

You can find more details for `$resource` [The magic of $resource](http://blog.mgechev.com/2014/02/05/angularjs-resource-active-record-http/) and [AngularJS' documentation](https://docs.angularjs.org/api/ngResource/service/$resource).

Since Martin Fowler states that

> responsibility of the Active Record object is to take care of the communication with the databse in order to create...

`$resource` does not implements exactly the Active Record pattern, since it communicates with RESTful service instead of the database. Anyway, we can consider it as "Active Record like RESTful communication".

#### Intercepting Filters

>Create a chain of composable filters to implement common pre-processing and post-processing tasks during a Web page request.

![Composite](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/intercepting-filters.svg "Fig. 3")

In some cases you need to do some kind of pre and/or post processing of HTTP requests. In the case of the Intercepting Filters you pre/post process given HTTP request/response in order to include logging, security or any other concern, which is influenced by the request body or headers. Basically the Intercepting Filters pattern include a chain of filters, each of which process data in given order. The output of each filter is input of the next one.

In AngularJS we have the idea of the Intercepting Filters in `$httpProvider`. `$httpProvider` has an array property called `interceptors`, which contains a list of objects. Each object may have properties called: `request`, `response`, `requestError`, `responseError`.

`requestError` is an interceptor, which gets called when a previous interceptor threw an error or resolved with a rejection, respectively `responseError` is being called when the previous `response` interceptor has thrown an error.

Here is a basic example how you can add interceptors using object literal:

```JavaScript
$httpProvider.interceptors.push(function($q, dependency1, dependency2) {
  return {
   'request': function(config) {
       // same as above
    },
    'response': function(response) {
       // same as above
    }
  };
});
```

### Directives

#### Composite

>The composite pattern is a partitioning design pattern. The composite pattern describes that a group of objects are to be treated in the same way as a single instance of an object. The intent of a composite is to "compose" objects into tree structures to represent part-whole hierarchies.

![Composite](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/composite.svg "Fig. 3")

According to the Gang of Four, MVC is nothing more than combination of:

- Strategy
- Composite
- Observer

They state that the view is composition of components. In AngularJS the situation is similar. Our views are formed by a composition of directives and DOM elements, on which these directives could be applied.

Lets look at the following example:

```HTML
<!doctype html>
<html>
  <head>
  </head>
  <body>
    <zippy title="Zippy">
      Zippy!
    </zippy>
  </body>
</html>
```

```JavaScript
myModule.directive('zippy', function () {
  return {
    restrict: 'E',
    template: '<div><div class="header"></div><div class="content" ng-transclude></div></div>',
    link: function (scope, el) {
      el.find('.header').click(function () {
        el.find('.content').toggle();
      });
    }
  }
});
```

This example defines a simple directive, which is a UI component. The defined component (called "zippy") has header and content. Click on its header toggles the visibility of the content.

From the first example we can note that the whole DOM tree is a composition of elements. The root component is the `html` element, directly followed by the nested elements `head` and `body` and so on...

In the second, JavaScript, example we see that the `template` property of the directive, contains markup with `ng-transclude` directive inside it. So this means that inside the directive `zippy` we have another directive called `ng-transclude`, i.e. composition of directives. Theoretically we can nest the components infinitely until we reach a leaf node.

### Interpreter

>In computer programming, the interpreter pattern is a design pattern that specifies how to evaluate sentences in a language. The basic idea is to have a class for each symbol (terminal or nonterminal) in a specialized computer language. The syntax tree of a sentence in the language is an instance of the composite pattern and is used to evaluate (interpret) the sentence.

![Interpreter](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/interpreter.svg "Fig. 6")

Behind its `$parse` service, AngularJS provides its own implementation of interpreter of a DSL (Domain Specific Language). The used DSL is simplified and modified version of JavaScript.
The main differences between the JavaScript expressions and AngularJS expressions that AngularJS expressions:

- may contain filters with UNIX like pipe syntax
- don't throw any errors
- don't have any control flow statements (exceptions, loops, if statements although you can use the ternary operator)
- are evaluated in given context (the context of the current `$scope`)

Inside the `$parse` service are defined two main components:

```JavaScript
//Responsible for converting given string into tokens
var Lexer;
//Responsible for parsing the tokens and evaluating the expression
var Parser;
```

Once given expression have been tokenized it is cached internally, because of performance concerns.

The terminal expressions in the AngularJS DSL are defined as follows:

```JavaScript
var OPERATORS = {
  /* jshint bitwise : false */
  'null':function(){return null;},
  'true':function(){return true;},
  'false':function(){return false;},
  undefined:noop,
  '+':function(self, locals, a,b){
        //...
      },
  '*':function(self, locals, a,b){return a(self, locals)*b(self, locals);},
  '/':function(self, locals, a,b){return a(self, locals)/b(self, locals);},
  '%':function(self, locals, a,b){return a(self, locals)%b(self, locals);},
  '^':function(self, locals, a,b){return a(self, locals)^b(self, locals);},
  '=':noop,
  '===':function(self, locals, a, b){return a(self, locals)===b(self, locals);},
  '!==':function(self, locals, a, b){return a(self, locals)!==b(self, locals);},
  '==':function(self, locals, a,b){return a(self, locals)==b(self, locals);},
  '!=':function(self, locals, a,b){return a(self, locals)!=b(self, locals);},
  '<':function(self, locals, a,b){return a(self, locals)<b(self, locals);},
  '>':function(self, locals, a,b){return a(self, locals)>b(self, locals);},
  '<=':function(self, locals, a,b){return a(self, locals)<=b(self, locals);},
  '>=':function(self, locals, a,b){return a(self, locals)>=b(self, locals);},
  '&&':function(self, locals, a,b){return a(self, locals)&&b(self, locals);},
  '||':function(self, locals, a,b){return a(self, locals)||b(self, locals);},
  '&':function(self, locals, a,b){return a(self, locals)&b(self, locals);},
  '|':function(self, locals, a,b){return b(self, locals)(self, locals, a(self, locals));},
  '!':function(self, locals, a){return !a(self, locals);}
};
```

We can think of the function associated with each terminal as implementation of the `AbstractExpression`'s interface.

Each `Client` interprets given AngularJS expression in a specific context - specific scope.

Few sample AngularJS expressions are:

```JavaScript
// toUpperCase filter is applied to the result of the expression
// (foo) ? bar : baz
(foo) ? bar : baz | toUpperCase
```

#### Template View

> Renders information into HTML by embedding markers in an HTML page.

![Template View](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/template-view.svg "Fig. 8")

The dynamic page rendering is not that trivial thing. It is connected with a lot of string concatenations, manipulations and frustration. Far easier way to build your dynamic page is to write your markup and embed little expressions inside it, which are lately evaluated in given context and so the whole template is being compiled to its end format. In our case this format is going to be HTML (or even DOM). This is exactly what the template engines do - they take given DSL, evaluate it in the appropriate context and then turn it into its end format.

Templates are very commonly used especially in the back-end.
For example, you can embed PHP code inside HTML and create a dynamic page, you can use Smarty or you can use eRuby with Ruby in order to embed Ruby code inside your static pages.

For JavaScript there are plenty of template engines, such as mustache.js, handlebars, etc. Most of these engines manipulate the template as a string. The template could be located in different places - as static file, which is fetched with AJAX, as `script` embedded inside your view or even inlined into your JavaScript.

For example:

```html
<script type="template/mustache">
  <h2>Names</h2>
  {{#names}}
    <strong>{{name}}</strong>
  {{/names}}
</script>
```

The template engine turns this string into DOM elements by compiling it within a given context. This way all the expressions embedded in the markup are evaluated and replaced by their value.

For example if we evaluate the template above in the context of the following object: `{ names: ['foo', 'bar', 'baz'] }`, so we will get:

```html
<h2>Names</h2>
  <strong>foo</strong>
  <strong>bar</strong>
  <strong>baz</strong>
```

AngularJS templates are actually HTML, they are not in an intermediate format like the traditional templates are.
What AngularJS compiler does is to traverse the DOM tree and look for already known directives (elements, attributes, classes or even comments). When AngularJS finds any of these directives it invokes the logic associated with them, which may involve evaluation of different expressions in the context of the current scope.

For example:

```html
<ul ng-repeat="name in names">
  <li>{{name}}</li>
</ul>
```

in the context of the scope:

```javascript
$scope.names = ['foo', 'bar', 'baz'];
```

will produce the same result as the one above. The main difference here is that the template is not wrapped inside a `script` tag but is HTML instead.


### Scope

#### Observer

>The observer pattern is a software design pattern in which an object, called the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods. It is mainly used to implement distributed event handling systems.

![Observer](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/observer.svg "Fig. 7")

There are two basic ways of communication between the scopes in an AngularJS application. The first one is calling methods of parent scope by a child scope. This is possible since the child scope inherits prototypically by its parent, as mentioned above (see [Scope](#scope)). This allows communication in a single direction - child to parent. Some times it is necessary to call method of given child scope or notify it about a triggered event in the context of the parent scope. AngularJS provides built-in observer pattern, which allows this. Another possible use case, of the observer pattern, is when multiple scopes are interested in given event but the scope, in which context the event is triggered, is not aware of them. This allows decoupling between the different scopes, non of the scopes should be aware of the rest of the scopes.

Each AngularJS scope has public methods called `$on`, `$emit` and `$broadcast`. The method `$on` accepts topic as first argument and callback as second. We can think of the callback as an observer - an object, which implements the `Observer` interface (in JavaScript the functions are first-class, so we can provide only implementation of the `notify` method):

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

In the JavaScript community this pattern is better known as publish/subscribe.

For a best practice example see [Observer Pattern as an External Service](#observer-pattern-as-an-external-service)

#### Chain of Responsibilities

>The chain-of-responsibility pattern is a design pattern consisting of a source of command objects and a series of processing objects. Each processing object contains logic that defines the types of command objects that it can handle; the rest are passed to the next processing object in the chain. A mechanism also exists for adding new processing objects to the end of this chain.

![Chain of Responsibilities](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/chain-of-responsibilities.svg "Fig. 5")

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

The different handlers from the UML diagram above are the different scopes, injected to the controllers.

#### Command

>In object-oriented programming, the command pattern is a behavioral design pattern in which an object is used to represent and encapsulate all the information needed to call a method at a later time. This information includes the method name, the object that owns the method and values for the method parameters.

![Command](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/command.svg "Fig. 11")

Before continuing with the application of the command pattern lets describe how AngularJS implements data binding.

When we want to bind our model to the view we use the directives `ng-bind` (for single-way data binding) and `ng-model` (for two-way data binding). For example, if we want each change in the model `foo` to reflect the view we can:

```html
<span ng-bind="foo"></span>
```

Now each time we change the value of `foo` the inner text of the span will be changed. We can achieve the same effect with more complex AngularJS expressions, like:

```html
<span ng-bind="foo + ' ' + bar | uppercase"></span>
```

In the example above the value of the span will be the concatenated uppercased value of `foo` and `bar`. What happens behind the scene?

Each `$scope` has method called `$watch`. When the AngularJS compiler find the directive `ng-bind` it creates a new watcher of the expression `foo + ' ' + bar | uppercase`, i.e. `$scope.$watch("foo + ' ' + bar | uppercase", function () { /* body */ });`. The callback will be triggered each time the value of the expression change. In the current case the callback will update the value of the span.

Here are the first a couple of lines of the implementation of `$watch`:

```javascript
$watch: function(watchExp, listener, objectEquality) {
  var scope = this,
      get = compileToFn(watchExp, 'watch'),
      array = scope.$$watchers,
      watcher = {
        fn: listener,
        last: initWatchVal,
        get: get,
        exp: watchExp,
        eq: !!objectEquality
      };
//...
```

We can think of the `watcher` object as a command. The expression of the command is being evaluated on each [`"$digest"`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) loop. Once AngularJS detects change in the expression, it invokes the `listener` function. The `watcher` command encapsulates the whole information required for watching given expression and delegates the execution of the command to the `listener` (the actual receiver). We can think of the `$scope` as the command's `Client` and the `$digest` loop as the command's `Invoker`.

### Controllers

#### Page Controller

>An object that handles a request for a specific page or action on a Web site. Martin Fowler

![Page Controller](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/page-controller.svg "Fig. 8")

According to [4](#references) the page controller:

>Page Controller pattern accept input from the page request, invoke the requested actions on the model, and determine the correct view to use for the resulting page. Separate the dispatching logic from any view-related code

Since there is a lot of duplicate behavior between the different pages (like rendering footers, headers, taking care of the user's session, etc.) page controllers can form a hierarchy. In AngularJS we have controllers, which are with more limited scope of responsibilities. They don't accept user requests, since this is responsibility of the `$route` or `$state` services and the page rendering is responsibility of the directives `ng-view`/`ui-view`.

Similarly to the page controllers, AngularJS controllers handle user interactions, provide and update the models. The model is exposed to the view when it is being attached to the scope, all methods invoked by the view, in result of user actions, are ones, which are already attached to the scope. Another similarity between the page controllers and the AngularJS controllers is the hierarchy, which they form. It corresponds to the scope hierarchy. That way common actions can be isolated to the base controllers.

The controllers in AngularJS are quite similar to the code-behind in ASP.NET WebForms, since their responsibilities almost overlap.
Here is an example hierarchy between few controllers:

```HTML
<!doctype html>
<html>
  <head>
  </head>
  <body ng-controller="MainCtrl">
    <div ng-controller="ChildCtrl">
      <span>{{user.name}}</span>
      <button ng-click="click()">Click</button>
    </div>
  </body>
</html>
```

```JavaScript
function MainCtrl($scope, $location, User) {
  if (!User.isAuthenticated()) {
    $location.path('/unauthenticated');
  }
}

function ChildCtrl($scope, User) {
  $scope.click = function () {
    alert('You clicked me!');
  };
  $scope.user = User.get(0);
}
```

This example aims to illustrates the most trivial way to reuse logic by using a base controller, anyway in production applications I don't recommend you to put your authorization logic in the controllers. The access to the different routes could be determined on a higher level of abstraction.

The `ChildCtrl` is responsible for handling actions such as clicking the button with label `"Click"` and exposing the model to the view, by attaching it to the scope.

### <a name='others'>其它</a>

#### Module Pattern

This is actually not a design pattern from Gang of Four, neither one from P of EAA. This is a traditional JavaScript pattern, which main goal is to provide encapsulation and privacy.

Using the module pattern you can achieve privacy based on the JavaScript's functional lexical scope. Each module may have zero or more private members, which are hidden in the local scope of a function. This function returns an object, which exports the public API of the given module:

```javascript
var Page = (function () {

  var title;

  function setTitle(t) {
    document.title = t;
    title = t;
  }

  function getTitle() {
    return title;
  }

  return {
    setTitle: setTitle,
    getTitle: getTitle
  };
}());
```

In the example above we have IIFE (Immediately-Invoked Function Expression), which after being called returns an object, with two methods (`setTitle` and `getTitle`). The returned object is being assigned to the `Page` variable.

In this case the user of the `Page` object doesn't has direct access to the `title` variable, which is defined inside the local scope of the IIFE.

The module pattern is very useful when defining services in AngularJS. Using this pattern we can simulate (and actually achieve) privacy:

```javascript
app.factory('foo', function () {

  function privateMember() {
    //body...
  }

  function publicMember() {
    //body...
    privateMember();
    //body
  }

  return {
    publicMember: publicMember
  };
});
```

Once we want to inject `foo` inside any other component we won't be able to use the private methods, but only the public ones. This solution is extremely powerful especially when one is building a reusable library.

### Data Mapper

>A Data Mapper is a Data Access Layer that performs bidirectional transfer of data between a persistent data store (often a relational database) and an in memory data representation (the domain layer). The goal of the pattern is to keep the in memory representation and the persistent data store independent of each other and the data mapper itself.

![Data Mapper](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/data-mapper.svg "Fig. 10")

As the description above states, the data mapper is used for bidirectional transfer of data between a persistent data store and an in memory data representation. Usually our AngularJS application communicates with API server, which is written in any server-side language (Ruby, PHP, Java, JavaScript, etc.).

Usually, if we have RESTful API `$resource` will help us communicate with the server in Active Record like fashion. Although, in some applications the data entities returned by the server are not in the most appropriate format, which we want to use in the front-end.

For instance, lets assume we have application in which each user has:

- name
- address
- list of friends

And our API has the methods:

- `GET /user/:id` - returns the user's name and the address of given user
- `GET /friends/:id` - returns the list of friends of given user

Possible solution is to have two different services, one for the first method and one for the second one. Probably more useful solution would be if we have a single service called `User`, which loads the user's friends when we request the user:

```javascript
app.factory('User', function ($q) {

  function User(name, address, friends) {
    this.name = name;
    this.address = address;
    this.friends = friends;
  }

  User.get = function (params) {
    var user = $http.get('/user/' + params.id),
        friends = $http.get('/friends/' + params.id);
    $q.all([user, friends])
    .then(function (user, friends) {
      return new User(user.name, user.address, friends);
    });
  };
  return User;
});
```

This way we create pseudo-data mapper, which adapts our API according to the SPA requirements.

We can use the `User` service by:

```javascript
function MainCtrl($scope, User) {
  User.get({ id: 1 })
  .then(function (data) {
    $scope.user = data;
  });
}
```

And the following partial:

```html
<div>
  <div>
    Name: {{user.name}}
  </div>
  <div>
    Address: {{user.address}}
  </div>
  <div>
    Friends with ids:
    <ul>
      <li ng-repeat="friend in user.friends">{{friend}}</li>
    </ul>
  </div>
</div>
```

### Observer Pattern as an External Service

##### About

Below is an example taken from [here](https://github.com/greglbd/angular-observer-pattern). This is an angular factory which creates a service implementing the Observer Pattern.  It works well with the ControllerAs method of working as it can be much more efficient that `$scope.$watch` and more specific to a unique scope or object than $emit and $broadcast when used correctly.

**Use Case:** You would use this pattern to communicate between 2 controllers that use the same model but are not connected in anyway.

##### Controller Example

Below example shows how to attach, notify and detach an event.

```javascript
angular.module('app.controllers')
  .controller('ObserverExample', ObserverExample);
ObserverExample.$inject= ['ObserverService', '$timeout'];

function ObserverExample(ObserverService, $timeout) {
  var vm = this;
  var id = 'vm1';

  ObserverService.attach(callbackFunction, 'let_me_know', id)

  function callbackFunction(params){
    console.log('now i know');
    ObserverService.detachByEvent('let_me_know')
  }

  $timeout(function(){
    ObserverService.notify('let_me_know');
  }, 5000);
}
```
Alternative way to remove event

```javascript
angular.module('app.controllers')
  .controller('ObserverExample', ObserverExample);
ObserverExample.$inject= ['ObserverService', '$timeout', '$scope'];

function ObserverExample(ObserverService, $timeout, $scope) {
  var vm = this;
  var id = 'vm1';
  ObserverService.attach(callbackFunction, 'let_me_know', id)

  function callbackFunction(params){
    console.log('now i know');
  }

  $timeout(function(){
    ObserverService.notify('let_me_know');
  }, 5000);

  // Cleanup listeners when this controller is destroyed
  $scope.$on('$destroy', function handler() {
    ObserverService.detachByEvent('let_me_know')
  });
}
```

## <a name='references'>参考文献</a>

1. [维基百科](https://en.wikipedia.org/wiki) 本文所有设计模式的简介都引自维基百科。
2. [AngularJS 文档](https://docs.angularjs.org)
3. [AngularJS 源码库](https://github.com/angular/angular.js)
4. [Page Controller](http://msdn.microsoft.com/en-us/library/ff649595.aspx)
5. [企业应用架构模式 (P of EAA)](http://martinfowler.com/books/eaa.html)
6. [Using Dependancy Injection to Avoid Singletons](http://googletesting.blogspot.com/2008/05/tott-using-dependancy-injection-to.html)
7. [Why would one use the Publish/Subscribe pattern (in JS/jQuery)?](https://stackoverflow.com/questions/13512949/why-would-one-use-the-publish-subscribe-pattern-in-js-jquery)
