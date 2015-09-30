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
    * [单例模式](#singleton)
    * [工厂方法模式](#factory-method)
    * [修饰模式](#decorator)
    * [外观模式](#facade)
    * [代理模式](#proxy)
    * [Active Record 模式](#active-record)
    * [截取筛选器模式](#intercepting-filters)
  * [Directives](#directives-1)
    * [组合模式](#composite)
    * [解释器模式](#interpreter)
    * [模版视图模式](#template-view)
  * [Scope](#scope-1)
    * [观察者模式](#observer)
    * [责任链模式](#chain-of-responsibilities)
    * [命令模式](#command)
  * [Controllers](#controllers-1)
    * [页面控制器模式](#page-controller)
  * [其它](#others)
    * [模块模式](#module-pattern)
    * [数据映射器模式](#data-mapper)
    * [观察者模式作为外部服务](#observer-pattern-as-an-external-service)
* [参考文献](#references)

<!--endtoc-->

## <a name='translations'>译本</a>

- [英文原文](https://github.com/mgechev/angularjs-in-patterns/blob/master/README.md) 作者：[mgechev](https://github.com/mgechev)
- [日文翻译](https://github.com/mgechev/angularjs-in-patterns/blob/master/i18n/README-ja-jp.md) 译者：[morizotter](https://twitter.com/morizotter)
- [法文翻译](https://github.com/mgechev/angularjs-in-patterns/blob/master/i18n/README-fr-fr.md) 译者：[manekinekko](https://github.com/manekinekko)
- [俄文翻译](http://habrahabr.ru/post/250149/)

(由于 AngularJS 的组件名称和专有术语通常会被直接用于程序源代码中，此中文版会尽量将此类词汇保留为原有英文，或将其译名放置在注释内，以避免歧义。如果您对本译文有任何改进建议，请提交 Pull Request。)

## <a name='abstract'>摘要</a>

学习新事物的最好方式之一就是观察其如何运用整合已知的知识。本文将介绍面向对象、设计模式和架构模式的基本概念，而非向读者传授如何熟练使用这些设计或架构模式。本文的主旨是介绍 AngularJS 框架中的各种软件设计和架构模式以及如何在 AngularJS 单页应用中运用它们。
<!--
One of the best ways to learn something new is to see how the things you already know are used in it.
This document does not intend to make its readers familiar with the design or architectural patterns; it suggests basic understanding of the concepts of the OOP, design patterns and architectural patterns.
The goal of this paper is to describe how different software design and architectural patterns are applied in AngularJS or any AngularJS single-page application.
-->

## <a name='introduction'>介绍</a>

本文将首先简要介绍 AngularJS 框架，分析其主要构件 - directive、filter、controller、service 和 scope。第二部分会依照 AngularJS 构件组成顺序，分别列述 AngularJS 框架所实现的各种设计和架构模式，其中会特别注出被多个构件共同使用的模式。
<!--
The document begins with brief overview of the AngularJS framework. The overview explains the main AngularJS components - directives, filters, controllers, services, scope. The second section lists and describes different design and architectural patterns, which are implemented inside the framework. The patterns are grouped by the AngularJS component they are used in. If some patterns are used inside multiple components it will be explicitly mentioned.
-->

在文章最后还会提及一些 AngularJS 单页应用中常用的架构模式。
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

关注点分离是依靠将 AngularJS 应用划分为相互隔离的构件来实现的，如：
<!--
The separation of concerns is achieved by dividing each AngularJS application into separate components, such as:
-->

- partials (片段)
- controllers (控制器)
- directives (指示器)
- services (服务)
- filters (筛选器)

这些构件可以在不同的模块中组合，以帮助实现更高层级的抽象化以及处理复杂事件。每个单独构件都会封装应用程序中特定部分的逻辑。
<!--
These components can be grouped inside different modules, which helps to achieve a higher level of abstraction and handle complexity. Each of the components encapsulates a specific piece of the application's logic.
-->

### Partials

Partial (模版片段) 实际就是 HTML 字符串，其元素和属性中可能包含一些 AngularJS 表达式。与 mustache.js 和 handlebars 等框架相比，AngularJS 的一个不同之处就是其模版并非是一种需要转化为 HTML 的中间格式。
<!--
The partials are HTML strings. They may contain AngularJS expressions inside the elements or their attributes. One of the distinctions between AngularJS and the others frameworks is the fact that AngularJS' templates are not in an intermediate format, which needs to be turned into HTML (which is the case with mustache.js and handlebars, for example).
-->

每个单页应用都会在初始化时读取 `index.html` 文件。在 AngularJS 中，此文件包含有一套用来配置和启动应用程序的标准的和自定义的 HTML 属性、元素和注释。接下来的每个用户操作将仅仅加载一个 partial 文件或者通过软件框架的数据绑定等方式来改变应用的当前状态。
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

Partial 文件可以通过 AngularJS 表达式来定义不同用户交互操作所对应的行为。例如在上面的例子中，`ng-click` 属性的值表示将执行当前 *scope* 中的 `changeFoo` 函数。
<!--
With AngularJS expressions partials define what kind of actions should be performed for handling different user interactions. In the example above the value of the attribute `ng-click` states that the method `changeFoo` of the current *scope* will be invoked.
-->

### Controllers

AnuglarJS 中的 controller (控制器) 本质上就是 JavaScript 函数。它可以通过将函数绑定到对应的 *scope* 上来帮助处理用户与网页应用的交互操作 (例如鼠标或键盘事件等)。Controller 所需要的所有外部构件都是通过 AngularJS 的依赖注入 (Dependency Injection) 机制实现。Controller 还会将数据也绑定到 *scope* 上，从而给 partial 提供模型 (*model*) 功能。我们可以将这些数据看成是视图模型 (*view model*)。
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

如果将以上 controller 示例与前一节中的 partial 示例结合在一起，用户就可以在应用程序中进行一些不同的交互操作。
<!--
For example, if we wire the sample controller above with the partial provided in the previous section the user will be able to interact with the application in few different ways.
-->

1. 通过改写输入框中的文本来改变 `foo` 的值。由于这里使用了双向数据绑定，`foo` 值会立刻改变。
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

在 AngularJS 中，scope 是一个开放给 partial 的 JavaScript 对象。Scope 可以包含不同的属性 - 基本数据 (primitives)、对象和函数。所有归属于 scope 的函数都可以通过解析该 scope 所对应 partial 中的 AngularJS 表达式来执行，也可以由任何构件直接调用该函数 (使用这种方式将保留指向该 scope 的引用不变)。附属于 scope 的数据可以通过使用合适的 *directive* 来绑定到视图上，如此一来，所有 partial 中的修改都会映射为某个 scope 属性的变化，反之亦然。
<!--
In AngularJS scope is a JavaScript object, which is exposed to the partials. The scope could contain different properties - primitives, objects or methods. All methods attached to the scope could be invoked by evaluation of AngularJS expression inside the partials associated with the given scope or direct call of the method by any component, which keeps reference to the scope. By using appropriate *directives*, the data attached to the scope could be binded to the view in such a way that each change in the partial will reflect a scope property and each change of a scope property will reflect the partial.
-->

AngularJS 应用中的 scope 还有另一个重要的特质，即它们都被连接到一条原型链 (prototypical chain) 上 (除了那些被表明为独立 (*isolated*) 的 scope)。在这种方式中，任何子 scope 都能调用属于其父母的函数，因为这些函数是该 scope 的直接或间接原型的属性。
<!--
Another important characteristics of the scopes of any AngularJS application is that they are connected into a prototypical chain (except scopes, which are explicitly stated as *isolated*). This way any child scope will be able to invoke methods of its parents since they are properties of its direct or indirect prototype.
-->

以下例子展示了 scope 继承关系：
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

尽管 `div#child` 归属于 `ChildCtrl`，但由于 `ChildCtrl` 中所注入的 scope 通过原型继承了其父 scope (即 `BaseCtrl` 中所注入的 scope)，因此 `button#parent-method` 就可以接触到 `foo` 函数。
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

由于本文的关注点并非分析 AnuglarJS 的完整 API，directive 就解释到这里为止。
<!--
Since the intent of this paper is not to explain the complete API of AngularJS, we will stop with the directives here.
-->

### Filters

AngularJS 中的 filter (筛选器) 负责封装数据格式化所需的逻辑。Filter 通常被用在 partial 中，但也可以通过依赖注入方式在 controller、directive、service 以及其它 filter 中使用。
<!--
The filters in AngularJS are responsible for encapsulating logic required for formatting data. Usually filters are used inside the partials but they are also accessible in the controllers, directives, *services* and other filters through Dependency Injection.
-->

以下定义了一个 filter 范例，用来将给定的字符串转变为大写。
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

此 filter 可以通过 Unix 管道语法在 partial 中使用。
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

所有其它逻辑，如果不属于以上所述构件，则应该放置到 service (服务) 中。Service 通常会封装领域专用逻辑 (domain specific logic)、持久层逻辑 (persistence logic)、XHR、WebSockets 等。当应用程序中 controller 变得过于臃肿时，就应该考虑将重复的代码放入一个 service 中。
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

>单例模式是一种软件设计模式。在应用这个模式时，单例对象的类必须保证只有一个实例存在。许多时候整个系统只需要拥有一个的全局对象，这样有利于我们协调系统整体的行为。如果某个系统在仅有单个对象或者有限个数的对象实例的环境中运行更加高效，也时常被归属为单例模式概念。
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

- 提取所依赖组件的名称并查询哈希表 (该表是定义在一个闭包中，所以外部不可见)。
- 如果此依赖组件已经存在于应用中，AngularJS 会在需要的时候以参数的形式将其传递给对应的构件。
- 如果所依赖的组件不存在：
  - AngularJS 首先会调用其提供者的生成函数，如 `$get`。值得注意的是，创建此依赖组件的实例时，可能会对算法内容进行递归调用，以解决该组件本身的依赖关系。
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

由于每个 service 只会被实例化一次，我们可以将每个 service 看成是一个单例。缓存则可以被认为是单例管理器。这里与上面展示的 UML 图有微小的区别，那就是我们并不将单例的静态私有引用保存在其构造函数中，而是将引用保存在单例管理器中 (以上代码中的 `cache`)。
<!--
We can think of each service as a singleton, because each service is instantiated no more than a single time. We can consider the cache as a singleton manager. There is a slight variation from the UML diagram illustrated above because instead of keeping static, private reference to the singleton inside its constructor function, we keep the reference inside the singleton manager (stated in the snippet above as `cache`).
-->

如此一来，service 实际还是单例，但并不是以传统单例设计模式的方法所实现。相比之下，这种方式有如下优点：
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

>工厂方法模式是一种创建型模式，其实现了一个「工厂方法」概念来处理在不指定对象具体类型的情况下创建对象的问题。其解决方式不是通过构造函数来完成，而是在抽象类 (abstract class) 中定义一个用来创建对象的工厂方法，然后在实体类 (concrete classes) 中实现它。或者在一个基础类 (base class) 中实现它，而该类又可以通过继承关系被派生类 (derived class) 所重写。
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

在上面的代码中，我们使用 `config` 回调来定义一个新的「provider」。Provider 是一个对象，其中包含一个 `$get` 函数。由于 JavaScript 语言没有接口 (interface)，而语言本身是鸭子类型 (duck-typed)，所以这里提供了一个给 provider 的工厂方法进行命名的规则。
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

上面这个代码片段调用了 `instanceInjector` 的 `invoke` 函数，其中第一个参数就是某 service 的工厂方法 (即 `$get`)。在 `invoke` 内部，`annotate` 函数又将该工厂方法作为其第一个参数。如代码所示，`annotate` 会使用 AngularJS 的依赖注入机制来解决所有依赖关系。当所有依赖关系都满足后，工厂方法函数就会被调用：`fn.apply(self, args)`。
<!-- 
The snippet above calls the `invoke` method of `instanceInjector` with the factory method (i.e. `$get`) of given service, as first argument. Inside `invoke`'s body `annotate` is called with first argument the factory method. Annotate resolves all dependencies through the dependency injection mechanism of AngularJS, which was considered above. When all dependencies are resolved the factory method is being called: `fn.apply(self, args)`.
-->

如果对照上面的 UML 图来看，我们可以认为这里的 provider 就是图中的「ConcreteCreator」，而实际组件就是「Product」。
<!--
If we think in terms of the UML diagram above we can call the provider a "ConcreteCreator" and the actual component, which is being created a "Product".
-->

由于工厂方法能间接的创建对象，使用这种设计模式能带来很多益处。尤其是框架能够在组件实例化的过程中关注解决一些样板化问题：
<!--
There are a few benefits of using the factory method pattern in this case, because of the indirection it creates. This way the framework can take care of the boilerplates during the instantiation of new components like:
-->

- 选择最恰当的时机来完成组件所需的实例化过程
- 解决组件所需的所有依赖关系
- 设定组件所允许存在的实例个数 (对于 service 和 filter 来说只有一个，而 controller 可以有多个实例)

<!--
- The most appropriate moment, when the component needs to be instantiated
- Resolving all the dependencies required by the component
- The number of instances the given component is allowed to have (for services and filters only a single one but multiple for the controllers)
-->

#### <a name='decorator'>修饰模式 (Decorator)</a>

>修饰模式又被称为 wrapper，与适配器模式的别名一样。它是一种可以动态或静态的往一个独立对象中添加新行为，而不影响同一个类所生成的其它对象的行为的设计模式。
<!--
>The decorator pattern (also known as Wrapper, an alternative naming shared with the Adapter pattern) is a design pattern that allows behavior to be added to an individual object, either statically or dynamically, without affecting the behavior of other objects from the same class.
-->

![Decorator](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/decorator.svg "Fig. 4")

AngularJS 已经提供了这种方式来扩展/增强现有 service 的功能。下面通过使用 `$provide` 的 `decorator` 函数，我们可以在第三方现有的 service 上建立一个「包装」：
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

上述例子定义了一个名为 `foo` 的新 service。在 `config` 中，回调了 `$provide.decorator` 函数，其第一个参数 `「foo」` 就是我们想要修饰的 service 的名称，而第二个参数则是实现修饰内容的函数。`$delegate` 则保持引用原有 `foo` service。通过使用 AngularJS 的依赖注入机制，这个本地依赖的引用 (reference) 是以构造函数的第一个参数传递。在这里，我们对 service 的修饰是重写其 `bar` 函数。实际修饰内容只是多执行一条 `console.log` 语句 - `console.log('Decorated');`，然后继续在对应的上下文中调用原有 `bar` 函数。
<!--
The example above defines new service called `foo`. In the `config` callback is called the method `$provide.decorator` with first argument `"foo"`, which is the name of the service, we want to decorate and second argument factory function, which implements the actual decoration. `$delegate` keeps reference to the original service `foo`. Using the dependency injection mechanism of AngularJS, reference to this local dependency is passed as first argument of the constructor function.
We decorate the service by overriding its method `bar`. The actual decoration is simply extending `bar` by invoking one more `console.log statement` - `console.log('Decorated');` and after that call the original `bar` method with the appropriate context.
-->

在需要修改第三方 service 的功能时，使用这种模式特别有用。如果需要使用多个类似功能的修饰 (例如函数的性能测量，授权，日志记录等)，我们可能会生成大量重复的代码，因而违反 DRY 原则。这种情况就需要使用[面向侧面的程序设计 (aspect-oriented programming)](http://en.wikipedia.org/wiki/Aspect-oriented_programming)。目前我所知的 AngularJS 的唯一 AOP 框架是 [github.com/mgechev/angular-aop](https://github.com/mgechev/angular-aop)。
<!--
Using this pattern is especially useful when we need to modify the functionality of third party services. In cases when multiple similar decorations are required (like performance measurement of multiple methods, authorization, logging, etc.), we may have a lot of duplications and violate the DRY principle. In such cases it is useful to use [aspect-oriented programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming). The only AOP framework for AngularJS I'm aware of could be found at [github.com/mgechev/angular-aop](https://github.com/mgechev/angular-aop).
-->

#### <a name='facade'>外观模式 (Facade)</a>

>Facade 是为大规模代码 (例如类库) 提供简化接口的对象。Facade 可以：

>1. 由于其针对常见任务有各种易用函数，可以让软件库更易于使用、理解和测试；

>2. 在某些情况下，让库更易读；

>3. 减少库的内部工作对外部代码的依赖，允许系统开发时有更大的灵活度；

>4. 可以将一些设计低劣的 API 包装到一个设计良好的 API 中。

<!--
>A facade is an object that provides a simplified interface to a larger body of code, such as a class library. A facade can:

>1. make a software library easier to use, understand and test, since the facade has convenient methods for common tasks;

>2. make the library more readable, for the same reason;

>3. reduce dependencies of outside code on the inner workings of a library, since most code uses the facade, thus allowing more flexibility in developing the system;

>4. wrap a poorly designed collection of APIs with a single well-designed API (as per task needs).
-->

![Facade](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/facade.svg "Fig. 11")

AngularJS 中已经有很多 facade。实际上，你每次为现有功能提供更高层级的 API 时，都是在创建 facade。
<!--
There are a few facades in AngularJS. Each time you want to provide higher level API to given functionality you practically create a facade.
-->

例如，让我们看看如何创建一个 `XMLHttpRequest` POST 请求：
<!--
For example, lets take a look how we can create an `XMLHttpRequest` POST request:
-->

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

但是我们也可以用 AngularJS 的 `$http` service 来发送数据：
<!--
But if we want to post this data using the AngularJS' `$http` service we can:
-->

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

我们甚至可以用：
<!--
or we can even:
-->
```JavaScript
$http.post('/someUrl', data)
.then(function (response) {
  alert(response);
});
```

上面第二种方式使用了一个预先设定好的版本，用于向指定的 URL 创建并发送一个 HTTP POST 请求。
<!--
The second option provides pre-configured version, which creates a HTTP POST request to the given URL.
-->

`$resource` 则在 `$http` service 之上建立了更高层级的抽象化。我们会在后面的 [Active Record 模式](#active-record)和[代理模式](#proxy)章节中对其进行更深入的探讨。
<!--
Even higher level of abstraction is being created by `$resource`, which is build over the `$http` service. We will take a further look at this service in [Active Record](#active-record) and [Proxy](#proxy) sections.
-->

#### <a name='proxy'>代理模式 (Proxy)</a>

>所谓的代理者，在一般意义上，是指一个类可以作为其它东西的接口。代理者可以作任何东西的接口：网络连接、存储器中的大对象、文件或其它昂贵或无法复制的资源。

<!--
>A proxy, in its most general form, is a class functioning as an interface to something else. The proxy could interface to anything: a network connection, a large object in memory, a file, or some other resource that is expensive or impossible to duplicate.
-->

![Proxy](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/proxy.svg "Fig. 9")

我们可以将代理分为三种不同的类型：
<!--
We can distinguish three different types of proxy:
-->

- 虚拟代理 (Virtual Proxy)
- 远端代理 (Remote Proxy)
- 保护代理 (Protection Proxy)

本节将讨论虚拟代理在 AngularJS 中的实现。
<!--
In this sub-chapter we are going to take a look at AngularJS' implementation of Virtual Proxy.
-->

下面的代码会调用 `get` 函数，其属于一个名为 `User` 的 `$resource` 实例 ：
<!--
In the snippet bellow, there is a call to the `get` method of `$resource` instance, called `User`:
-->

```JavaScript
var User = $resource('/users/:id'),
    user = User.get({ id: 42 });
console.log(user); //{}
```

这里的 `console.log` 将输出一个空对象。原因是当 `User.get` 被执行时，幕后所对应的 AJAX 请求是在异步运行。当 `console.log` 被调用时，我们尚未获得 user 的内容。`User.get` 在发出 GET 请求之后，会立刻返回一个空对象，并保留指向此对象的引用。我们可以将这个对象想像成一个虚拟代理 (简单的占位器)。当客户端稍后从服务器收到响应时，再将实际数据植入此代理对象。
<!--
`console.log` would outputs an empty object. Since the AJAX request, which happens behind the scene, when `User.get` is invoked, is asynchronous, we don't have the actual user when `console.log` is called. Just after `User.get` makes the GET request it returns an empty object and keeps reference to it. We can think of this object as virtual proxy (a simple placeholder), which would be populated with the actual data once the client receives response by the server.
-->

这在 AngularJS 中是如何工作的？让我们来看下面的代码：
<!--
How does this works with AngularJS? Well, lets consider the following snippet:
-->

```JavaScript
function MainCtrl($scope, $resource) {
  var User = $resource('/users/:id'),
  $scope.user = User.get({ id: 42 });
}
```

```html
<span ng-bind="user.name"></span>
```

当上面的代码最初执行时，`$scope` 对象内的 `user` 属性将被赋值为一个空对象 (`{}`)，这意味着 `user.name` 的值是 undefined，网页也不会渲染任何内容。AngularJS 内部会保留一份对此对象的引用。一旦服务器返回对 get 请求的响应，AngularJS 会将来自服务器的数据植入此对象。在下一次 `$digest` 循环中，AngularJS 将会探测到 `$scope.user` 中的变化，然后更新页面。
<!--
Initially when the snippet above executes, the property `user` of the `$scope` object will be with value an empty object (`{}`), which means that `user.name` will be undefined and nothing will be rendered. Internally AngularJS will keep reference to this empty object. Once the server returns response for the get request, AngularJS will populate the object with the data, received from the server. During the next `$digest` loop AngularJS will detect change in `$scope.user`, which will lead to update of the view.
-->

#### <a name='active-record'>Active Record 模式</a>

>Active Record 是一种包含数据和行为的对象。通常这些对象中的大部分数据都是持久的。Active Record 对象负责处理与数据库的交流，以实现创建、更新、接收或者删除数据。它也可能将这些任务交给更低层级的对象去完成，但数据库交流依然是通过调用 active record 对象实例或静态方法来发起。
<!--
>The Active Record object is an object, which carries both data and behavior. Usually most of the data in these objects is persistent, responsibility of the Active Record object is to take care of the communication with the database in order to create, update, retrieve or delete the data. It may delegate this responsibility to lower level objects but calls to instance or static methods of the active record object cause the database communication.
-->

![Active Record](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/active-record.svg "Fig. 7")

AngularJS 定义了一种名为 `$resource` 的 service。在 AngularJS 当前版本 (1.2+) 中，它是以非 AngularJS 核心的模块形式发布。
<!--
AngularJS defines a service called `$resource`. In the current version of AngularJS (1.2+) it is being distributed in module outside of the AngularJS' core.
-->

根据 AngularJS 文档，`$resource` 是：
<!--
According to the AngularJS' documentation `$resource` is:
-->

>一个用来创建资源对象的 factory，其功用是与 RESTful 服务器端数据源进行交互操作。其返回的资源对象中包含一些提供高层级功能的 action 方法，而无需使用低层级的 `$http` 服务。

<!--
>A factory which creates a resource object that lets you interact with RESTful server-side data sources.
>The returned resource object has action methods which provide high-level behaviors without the need to interact with the low level $http service.
-->

`$resource` 可以按以下方式使用：
<!--
Here is how `$resource` could be used:
-->

```JavaScript
var User = $resource('/users/:id'),
    user = new User({
      name: 'foo',
      age : 42
    });

user.$save();
```

调用 `$resource` 将会给模型实例创建一个构造函数。每个模型实例都包含用于不同 CRUD 操作的方法函数。
<!--
The call of `$resource` will create a constructor function for our model instances. Each of the model instances will have methods, which could be used for the different CRUD operations.
-->

如此一来，我们可以用下面的形式来使用构造函数和其静态方法：
<!--
This way we can use the constructor function and its static methods by:
-->

```JavaScript
User.get({ userid: userid });
```

以上代码会立即返回一个空对象并保留指向该对象的引用。当响应成功返回并解析后，AngularJS 会将所收到的数据植入该对象 (参见[代理模式](#proxy))。
<!--
The code above will immediately return an empty object and keep reference to it. Once the response have been successfully returned and parsed, AngularJS will populate this object with the received data (see [proxy](#proxy)).
-->

更多有关 `$resource` 的内容请参阅 [The magic of $resource](http://blog.mgechev.com/2014/02/05/angularjs-resource-active-record-http/) 和 [AngularJS 文档](https://docs.angularjs.org/api/ngResource/service/$resource)。
<!--
You can find more details for `$resource` [The magic of $resource](http://blog.mgechev.com/2014/02/05/angularjs-resource-active-record-http/) and [AngularJS' documentation](https://docs.angularjs.org/api/ngResource/service/$resource).
-->

由于 Martin Fowler 说过
<!--
Since Martin Fowler states that
-->

>Active Record 对象负责处理与数据库的通信，以实现...
<!--
> responsibility of the Active Record object is to take care of the communication with the databse in order to create...
-->

而 `$resource` 是用于 RESTful 服务而非数据库交互，所以它并未完整的实现 Active Record 模式。但我们还是可以认为它是「类似 Active Record 的 RESTful 通信」。
<!--
`$resource` does not implements exactly the Active Record pattern, since it communicates with RESTful service instead of the database. Anyway, we can consider it as "Active Record like RESTful communication".
-->

#### <a name='intercepting-filters'>截取筛选器模式 (Intercepting Filters)</a>

>创建可组合的筛选器链条来完成网页请求过程中常用的预处理和后处理任务。
<!--
>Create a chain of composable filters to implement common pre-processing and post-processing tasks during a Web page request.
-->

![Composite](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/intercepting-filters.svg "Fig. 3")

在很多情况下，你需要对 HTTP 请求进行各种预处理和/或后处理工作。使用截取筛选器，你可以根据所给定的 HTTP 请求/响应的头部和正文内容来预处理或者后处理它们，以加入相应的日志、安全和其它信息。截取筛选器模式包含一个筛选器链条，并按照给定的顺序对数据进行处理。每节筛选器的输出即成为下一节的输入。
<!--
In some cases you need to do some kind of pre and/or post processing of HTTP requests. In the case of the Intercepting Filters you pre/post process given HTTP request/response in order to include logging, security or any other concern, which is influenced by the request body or headers. Basically the Intercepting Filters pattern include a chain of filters, each of which process data in given order. The output of each filter is input of the next one.
-->

AngularJS 在 `$httpProvider` 中实作了截取筛选器。`$httpProvider` 拥有一个名为 `interceptors` 的数组，其中包含一组对象。每个对象都可能拥有以下属性：`request`、`response`、`requestError` 和 `responseError`。
<!--
In AngularJS we have the idea of the Intercepting Filters in `$httpProvider`. `$httpProvider` has an array property called `interceptors`, which contains a list of objects. Each object may have properties called: `request`, `response`, `requestError`, `responseError`.
-->

`requestError` 即为一个截取器，每当之前的 `request` 截取器抛出错误或者被拒绝时就会调用 `requestError`。相应的，`responseError` 则是在之前的 `response` 截取器抛出错误时被调用。
<!--
`requestError` is an interceptor, which gets called when a previous interceptor threw an error or resolved with a rejection, respectively `responseError` is being called when the previous `response` interceptor has thrown an error.
-->

以下是一个使用对象字面量 (object literal) 添加截取器的简单例子：
<!--
Here is a basic example how you can add interceptors using object literal:
-->

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

#### <a name='composite'>组合模式 (Composite)</a>

>组合模式是一种树状结构设计模式，是将一组相似的对象与一个单一的对象实例一致对待。此模式的意图是将对象组合成树形结构以表现为「部分-整体」的树形结构。
<!--
>The composite pattern is a partitioning design pattern. The composite pattern describes that a group of objects are to be treated in the same way as a single instance of an object. The intent of a composite is to "compose" objects into tree structures to represent part-whole hierarchies.
-->

![Composite](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/composite.svg "Fig. 3")

根据「四人帮」的经典论述， MVC 实际是以下部件的组合：
<!--
According to the Gang of Four, MVC is nothing more than combination of:
-->

- 策略模式 (Strategy)
- 组合模式 (Composite)
- 观察者模式 (Observer)

其中，页面即是各部件的组合。非常相似的是，AngularJS 中的页面就是由 directive 及其对应的 DOM 元素所形成的组合。
<!--
They state that the view is composition of components. In AngularJS the situation is similar. Our views are formed by a composition of directives and DOM elements, on which these directives could be applied.
-->

让我们来看以下例子：
<!--
Lets look at the following example:
-->

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

以上例子定义了一个简单的 directive，其功能是一个 UI 构件。此构件 (名为 "zippy") 包含头部结构和正文内容。点击其头部会切换正文部分显示或隐藏。
<!--
This example defines a simple directive, which is a UI component. The defined component (called "zippy") has header and content. Click on its header toggles the visibility of the content.
-->

在第一段例子中，我们注意到整个 DOM 树就是由很多元素形成的组合。其根组件是 `html` 元素，紧接着是嵌套的 `head` 和 `body` 等等。
<!--
From the first example we can note that the whole DOM tree is a composition of elements. The root component is the `html` element, directly followed by the nested elements `head` and `body` and so on...
-->

我们可以从第二段 JavaScript 例子看到，此 directive 的 `template` 属性又包含了 `ng-transclude` directive 标记。因此，在 `zippy` directive 中又存在另一个 `ng-transclude` directive。理论上我们可以无限的嵌套这些组件直到抵达叶节点 (leaf node)。
<!--
In the second, JavaScript, example we see that the `template` property of the directive, contains markup with `ng-transclude` directive inside it. So this means that inside the directive `zippy` we have another directive called `ng-transclude`, i.e. composition of directives. Theoretically we can nest the components infinitely until we reach a leaf node.
-->

#### <a name='interpreter'>解释器模式 (Interpreter)</a>

>解释器模式是一种对计算机语言的语句进行解释估值的设计模式。其基本理念就是在该语言中，给每个终结符或者非终结符表达式赋予一个类结构。一个语句的语法树就是一个对该语句进行解释的组合模式的结构实例。
<!--
>In computer programming, the interpreter pattern is a design pattern that specifies how to evaluate sentences in a language. The basic idea is to have a class for each symbol (terminal or nonterminal) in a specialized computer language. The syntax tree of a sentence in the language is an instance of the composite pattern and is used to evaluate (interpret) the sentence.
-->

![Interpreter](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/interpreter.svg "Fig. 6")

在 AngularJS 的 `$parse` service 背后，其提供了一个 DSL (领域专用语言) 语言的解释器实例。此 DSL 语言是一个精简修改版的 JavaScript。JavaScript 表达式与 AngularJS 表达式之间的主要区别是：
<!--
Behind its `$parse` service, AngularJS provides its own implementation of interpreter of a DSL (Domain Specific Language). The used DSL is simplified and modified version of JavaScript.
The main differences between the JavaScript expressions and AngularJS expressions that AngularJS expressions:
-->

- 可以包含 UNIX 类管道语法的筛选器
- 不会抛出任何错误
- 不含任何控制流语句 (异常、循环、条件语句，但可以使用三元运算符)
- 在特定的上下文环境中进行解析估值 (当前 `$scope` 的上下文)

<!--
- may contain filters with UNIX like pipe syntax
- don't throw any errors
- don't have any control flow statements (exceptions, loops, if statements although you can use the ternary operator)
- are evaluated in given context (the context of the current `$scope`)
-->

`$parse` service 中定义了两个主要的组件：
<!--
Inside the `$parse` service are defined two main components:
-->

```JavaScript
//Responsible for converting given string into tokens
var Lexer;
//Responsible for parsing the tokens and evaluating the expression
var Parser;
```

当给定的表达式被分词后，出于性能需求会被内部缓存。
<!--
Once given expression have been tokenized it is cached internally, because of performance concerns.
-->

AngularJS DSL 中的终结符表达式定义如下：
<!--
The terminal expressions in the AngularJS DSL are defined as follows:
-->

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

我们可以将每个终结符所属函数看作是 `AbstractExpression` 接口的实现。
<!--
We can think of the function associated with each terminal as implementation of the `AbstractExpression`'s interface.
-->

每个 `Client` 在一个特定的上下文和作用域中解释给定的 AngularJS 表达式。
<!--
Each `Client` interprets given AngularJS expression in a specific context - specific scope.
-->

以下是一个 AngularJS 表达式的例子：
<!--
Few sample AngularJS expressions are:
-->

```JavaScript
// toUpperCase filter is applied to the result of the expression
// (foo) ? bar : baz
(foo) ? bar : baz | toUpperCase
```

#### <a name='template-view'>模版视图模式 (Template View)</a>

>模版视图指的是在 HTML 页面中嵌入标签符号以将信息渲染为 HTML 形式。
<!--
> Renders information into HTML by embedding markers in an HTML page.
-->

![Template View](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/template-view.svg "Fig. 8")

渲染动态页面并不是件简单的事情，其中包含大量字符串的连接、修改和一些难以解决的操作。创造动态页面的最简单的方法是编写自己的标记符号并在其中嵌入表达式。稍后在给定的上下文中对这些表达式进行解析，从而将整个模版编译成其最终格式，此处即为 HTML (或 DOM) 格式。这就是模版引擎的功用 - 提取指定的 DSL，在恰当的上下文中进行解析，并转换成其最终格式。
<!--
The dynamic page rendering is not that trivial thing. It is connected with a lot of string concatenations, manipulations and frustration. Far easier way to build your dynamic page is to write your markup and embed little expressions inside it, which are lately evaluated in given context and so the whole template is being compiled to its end format. In our case this format is going to be HTML (or even DOM). This is exactly what the template engines do - they take given DSL, evaluate it in the appropriate context and then turn it into its end format.
-->

模版是一种常用技术，尤其是在后端应用中。例如，你可以将 PHP 代码嵌入到 HTML 中形成动态页面，也可以使用 Smarty 模版引擎，或者还可以使用 eRuby 将 Ruby 代码嵌入静态页面中。
<!--
Templates are very commonly used especially in the back-end.
For example, you can embed PHP code inside HTML and create a dynamic page, you can use Smarty or you can use eRuby with Ruby in order to embed Ruby code inside your static pages.
-->

适用于 JavaScript 的模版引擎有很多，例如 mustache.js、handlebars 等。大部分引擎是将模版以字符串的方式进行操作。模版可以存放在不同的位置：一是静态文件，其可以通过 AJAX 方式获取；二是以 `script` 形式嵌在视图中；或甚至是内嵌在 JavaScript 中。
<!--
For JavaScript there are plenty of template engines, such as mustache.js, handlebars, etc. Most of these engines manipulate the template as a string. The template could be located in different places - as static file, which is fetched with AJAX, as `script` embedded inside your view or even inlined into your JavaScript.
-->

例如：
<!--
For example:
-->

```html
<script type="template/mustache">
  <h2>Names</h2>
  {{#names}}
    <strong>{{name}}</strong>
  {{/names}}
</script>
```

模版引擎在一个给定的上下文中编译此字符串，将其转换为 DOM 元素。如此一来，所有嵌在标记符中的表达式都会被解析，并替换成其计算值。
<!--
The template engine turns this string into DOM elements by compiling it within a given context. This way all the expressions embedded in the markup are evaluated and replaced by their value.
-->

例如，如果以 `{ names: ['foo', 'bar', 'baz'] }` 对象为上下文对上面的模版进行解析，我们可以得到：
<!--
For example if we evaluate the template above in the context of the following object: `{ names: ['foo', 'bar', 'baz'] }`, so we will get:
-->

```html
<h2>Names</h2>
  <strong>foo</strong>
  <strong>bar</strong>
  <strong>baz</strong>
```

AngularJS 模版实际就是 HTML，而非其他传统模版所使用的中间层格式。AngularJS 编译器会遍历 DOM 树并搜索已知的 directive (适用于元素、属性、类或甚至注释)。当 AngularJS 找到任何 directive，就会调用其所属的逻辑代码，在当前作用域的上下文中解析其中的表达式。
<!--
AngularJS templates are actually HTML, they are not in an intermediate format like the traditional templates are.
What AngularJS compiler does is to traverse the DOM tree and look for already known directives (elements, attributes, classes or even comments). When AngularJS finds any of these directives it invokes the logic associated with them, which may involve evaluation of different expressions in the context of the current scope.
-->

例如：
<!--
For example:
-->

```html
<ul ng-repeat="name in names">
  <li>{{name}}</li>
</ul>
```

在下列作用域的上下文中：
<!--
in the context of the scope:
-->

```javascript
$scope.names = ['foo', 'bar', 'baz'];
```

会生成跟上面相同的结果。其主要区别是，模版是包装在 HTML 中，而非 `script` 标签之间。
<!--
will produce the same result as the one above. The main difference here is that the template is not wrapped inside a `script` tag but is HTML instead.
-->

### Scope

#### <a name='observer'>观察者模式 (Observer)</a>

>观察者模式是软件设计模式的一种。在此种模式中，一个目标对象管理所有相依于它的观察者对象，并且在它本身的状态改变时主动发出通知。这通常透过呼叫各观察者所提供的方法来实现。此种模式通常被用来实作事件处理系统。
<!--
>The observer pattern is a software design pattern in which an object, called the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods. It is mainly used to implement distributed event handling systems.
-->

![Observer](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/observer.svg "Fig. 7")

AngularJS 应用中 scope 之间有两种互相通信的方式。其一是在子 scope 中调用父 scope 的函数方法，这是基于子 scope 与其父母的原型继承关系 (参见 [Scope](#scope))。这种方式允许一种的单向通信 - 从子到父。当然有些时候也需要在父 scope 的上下文中调用子 scope 的函数方法或者通知其某个触发事件。对于此需求，AngularJS 内置了一种观察者模式的实现。观察者模式的另一个使用场景是，如果多个 scope 都关注某个事件，但该事点件触发所处上下文对应的 scope 与其它这些 scope 并无联系。这可以切断不同 scope 之间的耦合关系，形成独立的存在。
<!--
There are two basic ways of communication between the scopes in an AngularJS application. The first one is calling methods of parent scope by a child scope. This is possible since the child scope inherits prototypically by its parent, as mentioned above (see [Scope](#scope)). This allows communication in a single direction - child to parent. Some times it is necessary to call method of given child scope or notify it about a triggered event in the context of the parent scope. AngularJS provides built-in observer pattern, which allows this. Another possible use case, of the observer pattern, is when multiple scopes are interested in given event but the scope, in which context the event is triggered, is not aware of them. This allows decoupling between the different scopes, non of the scopes should be aware of the rest of the scopes.
-->

每个 AngularJS scope 都含有几个公有函数：`$on`、`$emit` 和 `$broadcast` 。`$on` 函数接受事件主题为第一参数，事件回调函数做为第二参数。我们可以将回调函数看作为一个观察者，即实作 `Observer` 接口的对象 (因为JavaScript 的头等函数特性，所以我们只需提供 `notify` 函数方法的实现)。
<!--
Each AngularJS scope has public methods called `$on`, `$emit` and `$broadcast`. The method `$on` accepts topic as first argument and callback as second. We can think of the callback as an observer - an object, which implements the `Observer` interface (in JavaScript the functions are first-class, so we can provide only implementation of the `notify` method):
-->

```JavaScript
function ExampleCtrl($scope) {
  $scope.$on('event-name', function handler() {
    //body
  });
}
```

在这种方式中，当前 scope 会「订阅」类别为 `event-name` 的事件。当 `event-name` 在任何父 scope 或子 scope 中被触发后，`handler` 将被调用。
<!--
In this way the current scope "subscribes" to events of type `event-name`. When `event-name` is triggered in any parent or child scope of the given one, `handler` would be called.
-->

`$emit` 和 `$broadcast` 函数则分别被用于在 scope 链中向上或向下触发事件。例如：
<!--
The methods `$emit` and `$broadcast` are used for triggering events respectively upwards and downwards through the scope chain.
For example:
-->

```JavaScript
function ExampleCtrl($scope) {
  $scope.$emit('event-name', { foo: 'bar' });
}
```

以上例子中的 scope 会向上方的 scope 触发 `event-name` 事件。意思是所有订阅了 `event-name` 事件的的父 scope 都会得到通知并执行其 `handler` 回调函数。
<!--
The scope in the example above, triggers the event `event-name` to all scopes upwards. This means that each of the parent scopes of the given one, which are subscribed to the event `event-name`, would be notified and their handler callback will be invoked.
-->

`$broadcast` 函数调用与此类似。唯一的区别是事件是向下传递给所有子 scope。每个 scope 可以给任何事件订阅配属多个回调函数 (即，一个给定事件对应多个观察者)。
<!--
Analogical is the case when the method `$broadcast` is called. The only difference is that the event would be transmitted downwards - to all children scopes.
Each scope can subscribe to any event with multiple callbacks (i.e. it can associate multiple observers to given event).
-->

在 JavaScript 社群中，这种模式又被称为发布/订阅模式。
<!--
In the JavaScript community this pattern is better known as publish/subscribe.
-->

更好的实战例子请参见[观察者模式作为外部服务](#observer-pattern-as-an-external-service)章节。
<!--
For a best practice example see [Observer Pattern as an External Service](#observer-pattern-as-an-external-service)
-->

#### <a name='chain-of-responsibilities'>责任链模式 (Chain of Responsibilities)</a>

>责任链模式在面向对象程式设计里是一种软件设计模式，它包含了一些命令对象和一系列的处理对象。每一个处理对象决定它能处理哪些命令对象，它也知道如何将它不能处理的命令对象传递给该链中的下一个处理对象。该模式还描述了往该处理链的末尾添加新的处理对象的方法。
<!--
>The chain-of-responsibility pattern is a design pattern consisting of a source of command objects and a series of processing objects. Each processing object contains logic that defines the types of command objects that it can handle; the rest are passed to the next processing object in the chain. A mechanism also exists for adding new processing objects to the end of this chain.
-->

![Chain of Responsibilities](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/chain-of-responsibilities.svg "Fig. 5")

AngularJs 应用中的 scope 组成了一个层级结构，称为 scope 链。其中有些 scope 是「独立的」，指的是它们并不从其父 scope 进行原型继承，而是通过 `$parent` 属性进行连接。
<!--
As stated above the scopes in an AngularJS application form a hierarchy known as the scope chain. Some of the scopes are "isolated", which means that they don't inherit prototypically by their parent scope, but are connected to it via their `$parent` property.
-->

当调用 `$emit` 或者 `$broadcast` 时，我们可以将 scope 链看作事件传递总线，或更精确的说就是责任链。每当某个事件被触发时，无论是向上还是向下传递 (基于调用不同的函数方法)，链条中紧随而后的 scope 可能会进行如下操作：
<!--
When `$emit` or `$broadcast` are called we can think of the scope chain as event bus, or even more accurately chain of responsibilities. Once the event is triggered it is emitted downwards or upwards (depending on the method, which was called). Each subsequent scope may:
-->

- 处理该事件并传递给链条中的下一环
- 处理该事件并终止传递
- 不处理此事件，而直接将事件传递给下一环
- 不处理此事件，并终止传递
<!--
- Handle the event and pass it to the next scope in the chain
- Handle the event and stop its propagation
- Pass the event to the next scope in the chain without handling it
- Stop the event propagation without handling it
-->

从下面的例子中可以看到 `ChildCtrl` 触发了一个在 scope 链条中向上传递的事件。每个父 scope (`ParentCtrl` 和 `MainCtrl` 中的 scope) 将处理此事件，即在 console 中输出记录 `"foo received"`。如果某个 scope 被认为是最终目标，则可以在此处调用事件对象 (即回调函数中所传递的参数) 的 `stopPropagation` 方法。
<!--
In the example bellow you can see an example in which `ChildCtrl` triggers an event, which is propagated upwards through the scope chain. In the case above each of the parent scopes (the one used in `ParentCtrl` and the one used in `MainCtrl`) are going to handle the event by logging into the console: `"foo received"`. If any of the scopes should be considered as final destination it can call the method `stopPropagation` of the event object, passed to the callback.
-->

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

上面这些被注入到 controller 中的 scope 即为稍早提到的 UML 图中的各个 handler 。
<!--
The different handlers from the UML diagram above are the different scopes, injected to the controllers.
-->

#### <a name='command'>命令模式 (Command)</a>

>在面向对象程式设计的范畴中，命令模式是一种行为设计模式，它尝试以物件来代表并封装所有用于在稍后某个时间调用一个函数方法所需要的信息。此信息包括所要调用的函数的名称、宿主对象及其参数值。
<!--
>In object-oriented programming, the command pattern is a behavioral design pattern in which an object is used to represent and encapsulate all the information needed to call a method at a later time. This information includes the method name, the object that owns the method and values for the method parameters.
-->

![Command](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/command.svg "Fig. 11")

在继续讨论命令模式的应用之前，让我们来看看 AngularJS 是如何实现数据绑定的。
<!--
Before continuing with the application of the command pattern lets describe how AngularJS implements data binding.
-->

当我们需要将模型与视图绑定时，可以使用 `ng-bind` (单向数据绑定) 或 `ng-model` (双向数据绑定) directive。例如，下面的代码可以将 `foo` 模型中的每个变化反映到视图中：
<!--
When we want to bind our model to the view we use the directives `ng-bind` (for single-way data binding) and `ng-model` (for two-way data binding). For example, if we want each change in the model `foo` to reflect the view we can:
-->

```html
<span ng-bind="foo"></span>
```

每当我们改变 `foo` 的值时，span 中的 inner text 就会随之改变。我们可以使用 AngularJS 表达式来实现更复杂的的同类效果，例如：
<!--
Now each time we change the value of `foo` the inner text of the span will be changed. We can achieve the same effect with more complex AngularJS expressions, like:
-->

```html
<span ng-bind="foo + ' ' + bar | uppercase"></span>
```

上面的例子中，span 内的文本值等于 `foo` 和 `bar` 的值串联后再转为大写字母。让我们来看看幕后都发生了什么事？
<!--
In the example above the value of the span will be the concatenated uppercased value of `foo` and `bar`. What happens behind the scene?
-->

每个 `$scope` 都含有名为 `$watch` 的函数方法。当 AngularJS 编译器找到 `ng-bind` directive 时，就会为 `foo + ' ' + bar | uppercase` 表达式创建一个新的监视器，即 `$scope.$watch("foo + ' ' + bar | uppercase", function () { /* body */ });`。每当表达式的值改变时，监视器中的回调函数就会被触发。在本例中，回调将会更新 span 的文本。
<!--
Each `$scope` has method called `$watch`. When the AngularJS compiler find the directive `ng-bind` it creates a new watcher of the expression `foo + ' ' + bar | uppercase`, i.e. `$scope.$watch("foo + ' ' + bar | uppercase", function () { /* body */ });`. The callback will be triggered each time the value of the expression change. In the current case the callback will update the value of the span.
-->

下面是 `$watch` 函数的头几行：
<!--
Here are the first a couple of lines of the implementation of `$watch`:
-->

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

我们可以将 `watcher` 对象视为一条命令。该命令的表达式会在每次 [`"$digest"`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) 循环中被估值。一旦 AngularJS 发现表达式中的数值改变，就会调用 `listener` 函数。`watcher` 命令中封装了用以完成以下任务所需的全部信息。任务包括监视所给定的表达式和将命令执行委托给 `listener` 函数 (实际接收者) 。我们可以将 `$scope` 视为命令的 `Client` (客户)，将 `$digest` 循环视为命令的 `Invoker` (执行者)。
<!--
We can think of the `watcher` object as a command. The expression of the command is being evaluated on each [`"$digest"`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) loop. Once AngularJS detects change in the expression, it invokes the `listener` function. The `watcher` command encapsulates the whole information required for watching given expression and delegates the execution of the command to the `listener` (the actual receiver). We can think of the `$scope` as the command's `Client` and the `$digest` loop as the command's `Invoker`.
-->

### Controllers

#### <a name='page-controller'>页面控制器模式 (Page Controller)</a>

>页面控制器指的是用于处理网站上某个特定页面请求或操作的对象。 Martin Fowler
<!--
>An object that handles a request for a specific page or action on a Web site. Martin Fowler
-->

![Page Controller](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/page-controller.svg "Fig. 8")

根据参考文献[4](#references)：
<!--
According to [4](#references) the page controller:
-->

>页面控制器模式接受来自页面请求的输入、对具体模型调用所要求的操作，并决定在结果页面所应该使用的正确视图。将调度逻辑从视图相关代码中分离。
<!--
>Page Controller pattern accept input from the page request, invoke the requested actions on the model, and determine the correct view to use for the resulting page. Separate the dispatching logic from any view-related code
-->

由于不同的页面之间存在大量重复操作 (例如渲染页脚、页眉，处理用户会话等)，各个页面控制器在一起可以构成一个层级结构。AngularJS 中的控制器 (controller) 有着相对较有限的用途。它们并不接受用户请求，那是 `$route` 或 `$state` service 的任务，页面渲染则是 `ng-view` 或 `ui-view` directive 的责任。
<!--
Since there is a lot of duplicate behavior between the different pages (like rendering footers, headers, taking care of the user's session, etc.) page controllers can form a hierarchy. In AngularJS we have controllers, which are with more limited scope of responsibilities. They don't accept user requests, since this is responsibility of the `$route` or `$state` services and the page rendering is responsibility of the directives `ng-view`/`ui-view`.
-->

与页面控制器类似，AngularJS 的 controller 负责处理用户交互操作，提供并更新模型。当模型 (model) 附着于 scope 上，它就被暴露给页面 (view) 所使用。基于用户的操作行为，页面会调用已经附着于 scope 上的相应函数方法。页面控制器与 AngularJS controller 的另一个相似点则是由它们所组成的层级结构。此结构于 scope 层级相对应。由此，共通的操作可以被隔离出来置于基础 controller 中。
<!--
Similarly to the page controllers, AngularJS controllers handle user interactions, provide and update the models. The model is exposed to the view when it is being attached to the scope, all methods invoked by the view, in result of user actions, are ones, which are already attached to the scope. Another similarity between the page controllers and the AngularJS controllers is the hierarchy, which they form. It corresponds to the scope hierarchy. That way common actions can be isolated to the base controllers.
-->

AngularJS 中的 controller 与 ASP.NET WebForms 背后的代码非常相似，它们有着几乎相同的功用。以下是 controller 层级结构例子：
<!--
The controllers in AngularJS are quite similar to the code-behind in ASP.NET WebForms, since their responsibilities almost overlap.
Here is an example hierarchy between few controllers:
-->

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

此例子描述了一个最简单的通过使用基础控制器来实现重用逻辑的例子。当然，我们不推荐在生产应用中将授权逻辑置于控制器中。不同路径 (route) 的权限可以在更高的抽象层级来判定。
<!--
This example aims to illustrates the most trivial way to reuse logic by using a base controller, anyway in production applications I don't recommend you to put your authorization logic in the controllers. The access to the different routes could be determined on a higher level of abstraction.
-->

`ChildCtrl` 负责处理点击 `"Click"` 按钮之类的操作，并将模型附着于 scope 上，使其暴露给页面使用。
<!--
The `ChildCtrl` is responsible for handling actions such as clicking the button with label `"Click"` and exposing the model to the view, by attaching it to the scope.
-->

### <a name='others'>其它</a>

#### <a name='module-pattern'>模块模式 (Module Pattern)</a>

模块模式并非「四人帮」所提出的设计模式之一，也不是来自《企业应用架构模式》。它是一种传统的 JavaScript 模式，主要用来提供封装和私密特性。
<!--
This is actually not a design pattern from Gang of Four, neither one from P of EAA. This is a traditional JavaScript pattern, which main goal is to provide encapsulation and privacy.
-->

通过使用模块模式，你可以基于 JavaScript 的函数作用域来实现程序结构的私密性。每个模块可以拥有零至多个私有成员，这些成员都隐藏在函数的本地作用域中。此函数会返回一个对象，用于输出给定模块的公有 API：
<!--
Using the module pattern you can achieve privacy based on the JavaScript's functional lexical scope. Each module may have zero or more private members, which are hidden in the local scope of a function. This function returns an object, which exports the public API of the given module:
-->

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

上面的例子中，我们实作了一个 IIFE (立即执行函数表达式)。当它被调用后会返回一个拥有两个函数方法 (`setTitle` 和 `getTitle`) 的对象。此对象又被赋值给 `Page` 变量。
<!--
In the example above we have IIFE (Immediately-Invoked Function Expression), which after being called returns an object, with two methods (`setTitle` and `getTitle`). The returned object is being assigned to the `Page` variable.
-->

在此处，使用 `Page` 对象并不能直接修改在 IIFE 本地作用域内部所定义的 `title` 变量。
<!--
In this case the user of the `Page` object doesn't has direct access to the `title` variable, which is defined inside the local scope of the IIFE.
-->

模块模式在定义 AngularJS 中的 service 时非常有用。使用此模式可以模拟 (并实现) 私密特性：
<!--
The module pattern is very useful when defining services in AngularJS. Using this pattern we can simulate (and actually achieve) privacy:
-->

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

当 `foo` 被注入到任何其他组件中时，我们并不能使用其私有函数方法，而只能使用公有方法。这种解决方案在搭建可重用的库时极为有用。
<!--
Once we want to inject `foo` inside any other component we won't be able to use the private methods, but only the public ones. This solution is extremely powerful especially when one is building a reusable library.
-->

#### <a name='data-mapper'>数据映射器模式 (Data Mapper)</a>

>数据映射器指的是在持久化数据存储 (通常是关系型数据库) 与内存数据表述 (domain layer) 之间执行双向传输的数据存取层。此模式的目的是保持内存中的数据表述和持久化数据存储相互独立，以及数据映射器本身的独立性。
<!--
>A Data Mapper is a Data Access Layer that performs bidirectional transfer of data between a persistent data store (often a relational database) and an in memory data representation (the domain layer). The goal of the pattern is to keep the in memory representation and the persistent data store independent of each other and the data mapper itself.
-->

![Data Mapper](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/data-mapper.svg "Fig. 10")

根据以上表述，数据映射器是用来在持久化数据存储和内存中的数据表述之间进行双向数据传输。AngularJS 应用通常是与 API 服务器进行数据交流。此服务器是用某种服务器端语言 (Ruby、PHP、Java、JavaScript 等) 实现.
<!--
As the description above states, the data mapper is used for bidirectional transfer of data between a persistent data store and an in memory data representation. Usually our AngularJS application communicates with API server, which is written in any server-side language (Ruby, PHP, Java, JavaScript, etc.).
-->

一般来说，如果服务器端提供 RESTful API，`$resource` 可以帮助我们以 Active Record 类的方式与服务器通讯。尽管在某些应用中，从服务器返回的数据并非是最适合于在前端使用的格式。
<!--
Usually, if we have RESTful API `$resource` will help us communicate with the server in Active Record like fashion. Although, in some applications the data entities returned by the server are not in the most appropriate format, which we want to use in the front-end.
-->

例如，让我们假设某个应用中，每个用户包含：
<!--
For instance, lets assume we have application in which each user has:
-->

- name
- address
- list of friends

并且 API 提供了以下方法：
<!--
And our API has the methods:
-->

- `GET /user/:id` - 返回指定用户的用户名和地址
- `GET /friends/:id` - 返回指定用户的好友列表
<!--
- `GET /user/:id` - returns the user's name and the address of given user
- `GET /friends/:id` - returns the list of friends of given user
-->

一种可能的解决方案是使用两个不同的服务，分别用于以上两个方法。另一个更好的方案是，提供一个名为 `User` 的 service，它会在请求某个用户时同时加载该用户的好友。
<!--
Possible solution is to have two different services, one for the first method and one for the second one. Probably more useful solution would be if we have a single service called `User`, which loads the user's friends when we request the user:
-->

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

如此一来，我们就创建了一个伪数据映射器，用来使我们的 API 适应 SPA (单页应用程序) 的需求。
<!--
This way we create pseudo-data mapper, which adapts our API according to the SPA requirements.
-->

我们可以通过下方式使用 `User` 服务：
<!--
We can use the `User` service by:
-->

```javascript
function MainCtrl($scope, User) {
  User.get({ id: 1 })
  .then(function (data) {
    $scope.user = data;
  });
}
```

以及如下模版片段：
<!--
And the following partial:
-->

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

#### <a name='observer-pattern-as-an-external-service'>观察者模式作为外部服务 (Observer Pattern as an External Service)</a>

##### 关于

以下是一个取自[此处](https://github.com/greglbd/angular-observer-pattern)的例子。这是一个 AngularJS factory，它实作了一个观察者模式的 service。它很适用于 ControllerAs 方法，如果正确使用的话，它比 `$scope.$watch` 运行更有效率，相比于 `$emit` 和 `$broadcast`，它更明确的对应唯一的 scope 或对象。
<!--
Below is an example taken from [here](https://github.com/greglbd/angular-observer-pattern). This is an angular factory which creates a service implementing the Observer Pattern.  It works well with the ControllerAs method of working as it can be much more efficient that `$scope.$watch` and more specific to a unique scope or object than $emit and $broadcast when used correctly.
-->

**用例：**你可以通过此模式在两个使用同一模型但互不关联的控制器之间通讯。
<!--
**Use Case:** You would use this pattern to communicate between 2 controllers that use the same model but are not connected in anyway.
-->

##### 控制器实例

以下例子展示了如何添附 (attach)、通知 (notify) 以及解附 (detach) 一个事件。
<!--
Below example shows how to attach, notify and detach an event.
-->

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

另一种移除事件的方式
<!--
Alternative way to remove event
-->

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
4. [页面控制器 (Page Controller)](http://msdn.microsoft.com/en-us/library/ff649595.aspx)
5. [企业应用架构模式 (P of EAA)](http://martinfowler.com/books/eaa.html)
6. [Using Dependancy Injection to Avoid Singletons](http://googletesting.blogspot.com/2008/05/tott-using-dependancy-injection-to.html)
7. [Why would one use the Publish/Subscribe pattern (in JS/jQuery)?](https://stackoverflow.com/questions/13512949/why-would-one-use-the-publish-subscribe-pattern-in-js-jquery)
