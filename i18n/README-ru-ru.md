# Паттерны в AngularJS

<!--toc-->

## Table of Contents

* [Переводы](#переводы)
* [Краткий обзор](#праткий-обзор)
* [Введение](#Введение)
* [Краткий обзор AngularJS](#краткий-обзор-AngularJS)
  * [Partials](#partials)
  * [Controllers](#controllers)
  * [Scope](#scope)
  * [Directives](#directives)
  * [Filters](#filters)
  * [Services](#services)
* [AngularJS Patterns](#angularjs-patterns)
  * [Services](#services-1)
    * [Singleton](#singleton)
    * [Factory Method](#factory-method)
    * [Decorator](#decorator)
    * [Facade](#facade)
    * [Proxy](#proxy)
    * [Active Record](#active-record)
    * [Intercepting Filters](#intercepting-filters)
  * [Directives](#directives-1)
    * [Composite](#composite)
    * [Interpreter](#interpreter)
    * [Template View](#template-view)
  * [Scope](#scope-1)
    * [Observer](#observer)
    * [Chain of Responsibilities](#chain-of-responsibilities)
    * [Command](#command)
  * [Controller](#controller-1)
    * [Page Controller](#page-controller)
  * [Others](#others)
    * [Module Pattern](#module-pattern)
    * [Data Mapper](#data-mapper)
    * [Шаблон Observer как внешний сервис](#шаблон-observer-как-внешний-сервис)
* [Ссылки](#Ссылки)

<!--endtoc-->

## Переводы

- [Japanese Translation](https://github.com/mgechev/angularjs-in-patterns/blob/master/i18n/README-ja-jp.md) by [morizotter](https://twitter.com/morizotter)
- [Russian Translation](http://habrahabr.ru/post/250149/)
- [French Translation](https://github.com/mgechev/angularjs-in-patterns/blob/master/i18n/README-fr-fr.md) by [manekinekko](https://github.com/manekinekko)
- [Chinese Translation](https://github.com/mgechev/angularjs-in-patterns/blob/master/i18n/README-zh-cn.md) by [carlosliu](https://github.com/carlosliu)

## Краткий обзор

Один из лучших способов изучить, что то новое, это увидеть, как в нем используются уже знакомые нам вещи. Эта статья не намерена ознакомить читателей с проектированием или шаблонами проектирования. Она предлагает базовое понимание концепций ООП, шаблонов проектирования и архитектурных шаблонов. Цель статьи описать, как различные конструкции программного обеспечения и архитектурные шаблоны используются в AngularJS и написанных на нем <a href="https://ru.wikipedia.org/wiki/Single_Page_Application">SPA

## Введение

Статья начинается с краткого обзора фреймворка AngularJS. Обзор объясняет основные компоненты AngularJS: directives, filters, controllers, services, scope. Во втором разделе перечислены и описаны различные конструкции и архитектурные шаблоны, которые реализованы внутри фреймворка. Шаблоны сгруппированы по компонентам AngularJS, в которых они используются. Если некоторые шаблоны используются в нескольких компонентах, это будет указано.

Последний раздел включает несколько архитектурных шаблонов, которые обычно используются в SPA построенных на AngularJS.

## Краткий обзор AngularJS

AngularJS это JavaScript веб фреймворк разработанный Google. Он намерен обеспечить прочную основу для разработки <a href="https://ru.wikipedia.org/wiki/CRUD">CRUD</a> SPA . SPA загружается только один раз и не требует перезагрузки страницы при работе с ним. Это означает, что все ресурсы приложения (data, templates, scripts, styles) должны быть загружены при загрузке главной страницы или по требованию. Поскольку большинство CRUD приложений имеют общие характеристики и требования, AngularJS намерен предоставить их оптимальный набор из коробки. Вот несколько важных особенностей AngularJS:

- two-way data binding (Двустороннее связывание данных)
- dependency injection, DI (Внедрение зависимостей)
- separation of concerns (Разделение ответственности)
- testability
- abstraction

Разделение ответственности достигается путем деления каждого AngularJS приложения на отдельные компоненты, такие как:

- partials
- controllers
- directives
- services
- filters

Эти компоненты могут быть сгруппированы внутри различных модулей, которые помогают достичь более высокого уровня абстракции. Каждый компонент включает определенную часть логики приложения.

### Partials

Partials это HTML строки. Они могут содержать AngularJS выражения внутри элементов или их атрибутов. Одним из преимуществ AngularJS перед другими фреймворками, является то, что шаблоны AngularJS не находятся в промежуточном формате, который должен быть преобразован в HTML (как например в mustache.js)

Вначале каждое SPA загружает файл Index.html. В случае с AngularJS этот файл содержит набор стандартных (и не очень) HTML атрибутов, элементов и комментариев, которые настраивают и запускают приложение. Каждое действие пользователя требует загрузки других partials (HTML строк или файлов с кусками HTML) или изменение состояния приложения, например через связывание данных (data binding) предоставленное фреймворком.


**Пример partials:**

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

Вместе с выражениями AngularJS, partials определяют, какие действия должны быть выполнены для взаимодействия с пользователем. В примере выше значение атрибута ng-click означает, что метод changeFoo() будет вызван из текущего scope.

### Controllers

Контроллеры в AngularJS – это обычные функции, которые позволяют обрабатывать взаимодействие пользователя и  приложения (например события мыши, клавиатуры и тд.) путем добавления методов в scope. Все внешние зависимости для контроллеров предоставляются при помощи механизма DI в AngularJS. Контроллеры также отвечают за взаимодействие моделей с partials путем добавления данных в scope. Это можно рассматривать как модель представления (view model).

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

Например, если мы подключим контроллер представленный выше в предыдущую секцию, то пользователь будет иметь возможность взаимодействовать с приложением несколькими способами:

1. Изменение "foo" путем ввода данных в поле ввода. Это немедленно отразится на значении "foo" из-за двустороннего связывания данных.
2. Изменение значения "foo" нажатием на кнопку с названием Click me to change foo!»

Все пользовательские элементы, атрибуты, комментарии или классы могут быть директивами AngularJS (если они предварительно определены).

### Scope

В AngularJS scope является JavaScript объектом, который доступен для partials. Scope может включать различные свойства – примитивы, объекты или методы. Все методы добавленные в scope, могут быть вызваны с помощью выражений AngularJS внутри partials, которые связанны с данным scope или прямым вызовом метода любым компонентом, у которого есть ссылка на scope. С помощью соответствующих директив, данные добавляются в scope, и могут быть связаны с представлением, таким образом, каждое изменение в свойстве scope будет отражено в представлении и каждое изменение в представлении будет отображено в scope.

Еще одной важной характеристикой scope в любом AngularJS приложении является то, что они связаны через механизм наследования прототипа (за исключением изолированных scope). Таким образом любой дочерний scope может использовать методы его родителя, так как это свойства его прямого или косвенного прототипа.

Наследование scope показано в следующем примере:

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

С div#child связан scope ChildCtrl, но поскольку scope ChildCtrl является вложенным в BaseCtrl, то все методы из BaseCtrl доступны в ChildCtrl, при помощи наследования прототипа и поэтому метод foo будет доступен при нажатии на кнопку button#parent-method.

### Directives

Директивы в AngularJS – это место где должны выполняться все манипуляции с DOM. Как правило если у вас в контроллере происходят манипуляции с DOM, то необходимо создать новую директиву или провести рефакторинг, который устранит манипуляции с DOM в контроллере. В простейшем случае у директивы есть имя и определение функции postLink, которая включает логику директивы. В более сложных случаях директива может содержать множество свойств, таких как:

- template
- compile function
- link function
- etc...

Директивы можно использовать в partials, например:

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

В примере выше тег <alert-button></alert-button> будет заменен элементом button и при нажатии на кнопку, появиться предупреждение с текстом 42.

### Filters

Фильтры в AngularJS отвечают за инкапсуляцию логики, необходимой для форматирования данных. Обычно фильтры используются внутри partials, но так же через DI они доступны в контроллерах, директивах, сервисах или других фильтрах.

Здесь простой пример фильтра, который преобразует строку в верхний регистр:

```JavaScript
myModule.filter('uppercase', function () {
  return function (str) {
    return (str || '').toUpperCase();
  };
});
```

Внутри partials фильтры могут быть использованы с помощью синтаксиса Unix конвейеров (Unix's piping):

```HTML
<div>{{ name | uppercase }}</div>
```

Внутри контроллера фильтр может быть использован следующим образом:

```JavaScript
function MyCtrl(uppercaseFilter) {
  $scope.name = uppercaseFilter('foo'); //FOO
}
```

### Services

Любая часть логики, которая не относится к компонентам описанным выше, должна быть помещена в сервис. Обычно сервисы инкапсулируют специфическую область логики, неизменяемую логику, XHR, WebSockets и т. д. Когда контроллеры в приложении становятся слишком "толстыми", повторяющийся код должен быть вынесен в сервисы.

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

Сервисы могут быть добавлены в любой компонент, который поддерживает DI (контроллеры, фильтры, директивы, другие сервисы):

```JavaScript
function MyCtrl(Developer) {
  var developer = new Developer();
  developer.live();
}
```

## Паттерны AngularJS

В двух последующих разделах, мы рассмотрим как традиционное проектирование и архитектурные шаблоны используются в компонентах AngularJS.

В последней главе мы рассмотрим некоторые архитектурные шаблоны, которые часто используются при разработке SPA (и не только) на AngularJS.

### Services

#### Singleton

>Singleton (одиночка) - шаблон проектирования, который ограничивает создание экземпляра класса одним объектом. Это полезно когда необходимо координировать действия во всей системе. Концепция подходит для систем, которые функционируют более эффективно, когда существует только один объект или когда экземпляры ограничены некоторым количеством объектов.

UML диаграмма иллюстрирует шаблон singleton:

![Singleton](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/singleton.svg "Fig. 1")

Когда какому любо компоненту требуется зависимость, AngularJS разрешает ее используя следующий алгоритм:

- Берет имя зависимости и делает поиск в хеш-карте, которая определяется в лексическом замыкании. (поэтому она имеет приватную область видимости).
- Если зависимость найдена AngularJS передает ее как параметр компонента.
- >Если зависимость не найдена:
  - AngularJS создает ее при помощи вызова фабричного метода или его провайдера (т. е. $get). Обратите внимание, что создание зависимости может потребовать рекурсивный вызов по тому же алгоритму для определения всех зависимостей данной зависимости. Этот процесс может привести к циклической зависимости.
  - AngularJS кеширует ее внутри хеш-карты упомянутой выше.
  - AngularJS передает ее в качестве параметра компонента, для которого она указана.

Лучше взгляните на исходный код AngularJS, который реализует getService:

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

Представьте, что каждый service это singleton, потому что service создается только один раз. Кэш можно рассматривать, как менеджера singleton. Так же эта реализация немного отличается от той, что представлена в UML диаграмме, потому что вместо создания статической приватной ссылки на singleton внутри его конструктора, мы сохраняем ссылку внутри менеджера singleton.

Таким образом, service это фактически singleton, но реализован не через шаблон singleton, тем самым обеспечивая некоторые преимущества по сравнению со стандартной реализацией:

- улучшает тестируемость кода
- можно управлять созданием объектов singleton (В данном случае <a href="https://ru.wikipedia.org/wiki/%D0%98%D0%BD%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F">IoC</a> контейнер контролирует создание объектов используя ленивые вызовы.)

Для более детального рассмотрения данной темы можете ознакомиться со <a href="http://googletesting.blogspot.ru/2008/05/tott-using-dependancy-injection-to.html">статьей</a> Misko Hevery's в блоге Google Testing.

#### Factory Method

>Factory Method (Фабричный метод так же известен как Виртуальный конструктор (англ. Virtual Constructor)) — порождающий шаблон проектирования, предоставляющий подклассам интерфейс для создания экземпляров некоторого класса. В момент создания наследники могут определить, какой класс создавать. Иными словами, Фабрика делегирует создание объектов наследникам родительского класса. Это позволяет использовать в коде программы не специфические классы, а манипулировать абстрактными объектами на более высоком уровне.

![Factory Method](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/factory-method.svg "Fig. 2")

Давайте рассмотрим следующий фрагмент:

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

Здесь для определения нового "provider" используется функция обратного вызова config. "Provider" это объект с методом $get. Поскольку в JavaScript нет интерфейсов и язык использует "утиную" типизацию, то договорились фабричный метод в "provider" называть $get.

Каждый service, filter, directive и controller имеют provider (т. е объект, который имеет фабричный метод $get), он отвечает за создание экземпляров компонента.

Мы можем копнуть немного глубже в реализацию AngularJS:

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

В примере вы можете видеть как в действительности используется метод $get:

```JavaScript
instanceInjector.invoke(provider.$get, provider, undefined, servicename)
```

В фрагменте выше вызывается метод invoke и ему в качестве первого аргумента передается фабричным метод ($get) сервиса. Внутри метода invoke вызывается функция annotate, которой в качестве первого аргумента так же передается фабричный метод. Функция annotate разрешает все зависимости, через механизм DI AngularJS (рассматривался выше). После разрешения всех зависимостей, вызывается фабричный метод:

Если рассуждать в терминах описанной выше UML диаграммы, то мы можем вызвать Creator, который через фабричный метод вызовет "ConcreteCreator" который создаст "Product".

В данном случае мы получаем некоторые преимущества используя шаблон фабричный метод, потому что используется косвенное создание экземпляров. Таким образом фреймворк влияет на макеты/шаблоны создания новых компонентов, потому что:

- это наиболее подходящий момент, когда нужно создать компонент
- разрешить все зависимости компонента
- управлять количеством разрешенных экземпляров компонента (для service и filter один, но много для controller)

#### Decorator

>Decorator (Декоратор) — структурный шаблон проектирования, предназначенный для динамического добавления дополнительного поведения к объекту. Шаблон Декоратор предоставляет гибкую альтернативу создания подклассов с целью расширения функциональности.

![Decorator](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/decorator.svg "Fig. 4")

AngularJS из коробки предоставляет возможности для расширения и/или повышения функциональности уже существующих service' ов. Используя метод decorator или $provide вы можете создать обертку для любого service, уже определенного вами или из сторонней библиотеки:

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
Приведенный выше пример определяет новый service с именем "foo". В функции обратного вызова "config" вызывается метод $provide.decorator и ему в качестве первого аргумента передается имя service, который мы хотим декорировать, вторым аргументом передается функция, она собственно и реализует декоратор. $delegate хранит ссылку на оригинальный service foo. Мы декорируем service переопределяя его метод bar. Фактически декорирование просто расширение bar, путем включения еще одного состояния console.log - console.log('Decorated') и после чего вызываем оригинальный метод bar в соответствующем контексте.

Использование шаблона особенно полезно, когда нам нужно, изменить функциональность service созданных третьими лицами. В тех случаях, когда необходимы многочисленные декораторы (например, при измерении  производительности методов, авторизации, регистрации и т.д.) может получиться много дублируемого кода и нарушение принципа <a href="https://ru.wikipedia.org/wiki/Don%E2%80%99t_repeat_yourself">DRY</a>. В таких случаях целесообразно использовать <a href="http://en.wikipedia.org/wiki/Aspect-oriented_programming">аспектно-ориентированое</a> программирование. АОП фреймворк для AngularJS можно найти на <a href="https://github.com/mgechev/angular-aop">github.com/mgechev/angular-aop.</a>

#### Facade

>Шаблон Facade (фасад) — структурный шаблон проектирования, позволяющий скрыть сложность системы путем сведения всех возможных внешних вызовов к одному объекту, делегирующему их соответствующим объектам системы.
Facade может:

>1. Сделать более легким использование библиотек, понимание и тестирование, так как facade имеет более подходящие методы для выполнения общих задач

>2. Cделать библиотеку более читабельной, по той же причине

>3. Уменьшить зависимость внутренних библиотек от внешнего кода, поскольку большая часть кода использует facade, это позволяет разрабатывать систему более гибко

>4. Обернуть плохо спроектированную коллекцию API-интерфейсов, одной хорошо спроектированной (в соответствии с потребностями задачи)

![Facade](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/facade.svg "Fig. 11")

В AngularJS есть несколько facade' ов. Каждый раз когда вы хотите предоставить высокоуровневый API для некоторой функциональности, вы практически создаете фасад.

К примеру, давайте посмотрим как мы можем создать XMLHttpRequest POST запрос:

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
Если мы хотим отправить данные используя AngularJS $http сервис, мы можем:

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
или даже:

```JavaScript
$http.post('/someUrl', data)
.then(function (response) {
  alert(response);
});
```
Второй вариант представляет предварительно настроенную версию, которая создает HTTP POST запрос.

Третий вариант, это высокоуровневая абстракция созданная с помощью $resource service и построена поверх $http service. Мы еще раз рассмотрим этот service в разделах Active Record и Proxy.

#### Proxy

>Proxy (Заместитель) — структурный шаблон проектирования, предоставляет объект, который контролирует доступ к другому объекту, перехватывая все вызовы (выполняет функцию контейнера). Proxy может взаимодействовать с чем угодно: сетевым соединением, большим объектом в памяти, файлом или другими ресурсами, которые дорого или невозможно копировать.

![Proxy](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/proxy.svg "Fig. 9")

Мы можем различать три типа прокси:

- Virtual Proxy
- Remote Proxy
- Protection Proxy

В этом подразделе мы рассмотрим реализованный в AngularJS Virtual Proxy.

В фрагменте ниже, мы вызываем метод get объекта $resource с именем User:

```JavaScript
var User = $resource('/users/:id'),
    user = User.get({ id: 42 });
console.log(user); //{}
```

console.log выведет пустой объект. Так как AJAX запрос выполнится асинхронно после вызова User.get, и во время вызова console.log у нас не будет данных пользователя. Сразу после вызова User.get, выполняется GET запрос, он возвращает пустой объект и сохраняет ссылку на него. Мы можем представить себе этот объект как virtual proxy, он будет заполнен данными как только клиент получит ответ от сервера.

Как это работает в AngularJS? Давайте рассмотрим следующий фрагмент:

```JavaScript
function MainCtrl($scope, $resource) {
  var User = $resource('/users/:id'),
  $scope.user = User.get({ id: 42 });
}
```

```html
<span ng-bind="user.name"></span>
```
После выполнения фрагмента кода, показанного выше, свойство user объекта $scope будет пустым объектом ({}), это означает, что user.name будет undefined и не будет отображено. После того как сервер вернет ответ для GET запроса, AngularJS заполнит этот объект данными, полученными с сервера. В течении следующего $digest цикла, AngularJS обнаружит изменения в $scope.user и это приведет к обновлению представления.

#### Active Record

>Active Record – это объект, который хранит данные и поведение. Обычно большинство данных в этом объекте постоянны, обязанность объекта Active Record заботиться о связи с базой данных для создания, обновления, поиска и удаления данных. Он может делегировать эту ответственность на объекты более низкого уровня, но вызов объекта Active Record или его статических методов, приведет к взаимодействию с БД.

![Active Record](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/active-record.svg "Fig. 7")

В AngularJS определен service $resource. В текущей версии AngularJS (1,2+) он распространяется отдельным модулем и не включен в ядро.
В соответствии с документацией $resource:

>$resource - это фабрика для создания объектов $resource, которые позволяют взаимодействовать с RESTfull источниками данных на стороне сервера. Объект $resource имеет методы, которые предоставляют высокоуровневое поведение, без необходимости взаимодействовать с низкоуровневым service' ом $http.

Здесь показано, как можно использовать $resource:

```JavaScript
var User = $resource('/users/:id'),
    user = new User({
      name: 'foo',
      age : 42
    });

user.$save();
```

Вызов $resource создает конструктор для экземпляров нашей модели. Каждый из экземпляров модели будет иметь методы, которые могут быть использованы для различных операций CRUD.

Таким образом мы можем использовать функцию конструктор и его статические методы:

```JavaScript
User.get({ userid: userid });
```

Код выше будет сразу возвращать пустой объект и сохранять ссылку на него. После того, как будет получен и проанализирован ответ, AngularJS заполнит объект полученными данными (см. proxy).
Вы можете найти более детальную документацию по "магии" объекта $resource и AngularJS.
Так Мартин Фаулер утверждает что:

>Объект Active Record должен заботиться о связи с БД, для того что бы создавать…
$resource не реализует полного шаблона Active Record, так как он взаимодействует с RESTful сервисом вместо БД. Во всяком случае мы можем рассматривать его как "Active Record для взаимодействия с RESTful".

#### Intercepting Filters

>Создает цепочку фильтров для выполнения простых задач пред/пост обработки запросов.

![Composite](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/intercepting-filters.svg "Fig. 3")

В некоторых случаях вам нужно будет сделать какую либо пред/пост обработку HTTP запросов. В данном случае Intercepting Filters предназначены для пред/пост обработки HTTP запросов/ответов, для ведения журнала, безопасности или любой другой задачи, которой необходимо тело или заголовок запроса. Обычно шаблон Intercepting Filters включает цепочку фильтров, каждый из которых обрабатывает данные в определенном порядке. Выход каждого фильтра является входом для следующего.

В AngularJS мы имеем представление о Intercepting Filters в $httpProvider. $httpProvider имеет свойство interceptors (перехватчики), оно включает список объектов. У каждого объекта есть свойства: request, response, requestError, responseError.

requestError вызывается если в предыдущем перехватчике произошла ошибка или он был отклонен, соответственно responseError вызывается, когда предыдущий перехватчик ответа возбудил исключение.

Ниже базовый пример, как вы можете добавить перехватчики используя литерал объекта:

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

>Шаблон composite (компоновщик) – структурный шаблон проектирования. Шаблон composite описывает, как группировать объекты, что бы к ним можно было обращаться, так же как к одному объекту. Цель composite составить объекты в древовидную структуру, для представления иерархии от частного к целому.

![Composite](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/composite.svg "Fig. 3")

Согласно "Банде четырех", MVC ни что иное как сочетание:

- Strategy
- Composite
- Observer

Они утверждают что представление является композицией компонентов. В AngularJS аналогичная ситуация. Представления формируются композицией директив и элементов DOM, на которых эти директивы построены.

Давайте посмотрим на следующий пример:

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

В этом примере создается директива, которая является компонентом пользовательского интерфейса. Созданный компонент (с именем “zippy”) имеет заголовок и содержание. При нажатии на его заголовок переключается видимость его содержимого.

Из первого примера мы можем заметить, что дерево DOM это композиция элементов. Корневой компонент это html, сразу же за ним следуют вложенные элементы head, body и так далее…

Во втором примере, мы видим, что свойство директивы template содержит разметку с директивой ng-transclude. Это означает, что внутри директивы “zippy” может быть еще одна директива ng-transclude т. е. композиция директив. Теоретически мы можем делать бесконечную вложенность компонентов пока не достигнем конечного узла.

#### Interpreter

>Interpreter (интерпретатор) – поведенческий шаблон проектирования, указывает, как определять выражения в языке. Основная идея, классифицировать каждый символ (терминальный или не терминальный) в специализированном языке программирования. Синтаксическое дерево (пример шаблона композиция) выражений используется для анализа (интерпретирования) выражения.

![Interpreter](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/interpreter.svg "Fig. 6")

С помощью $parse, AngularJS предоставляет свою собственную реализацию интерпретатора DSL (Domain Specific Language). Использование DSL упрощает и изменяет JavaScript. Основная разница между AngularJS и JavaScript выражениях в том что AngularJS выражения:

- могут включать фильтры с UNIX подобным синтаксисом
- не возбуждают никаких исключений
- не имеют никакого управления потоком состояния (исключения, циклы, условия так же могут использовать тернарный оператор)
- выполняются в полученном контексте (контекст текущего $scope)

Внутри $parse определены два основных компонента:

```JavaScript
//Responsible for converting given string into tokens
var Lexer;
//Responsible for parsing the tokens and evaluating the expression
var Parser;
```

При получении выражения, оно разбивается на лексемы и кэшируется (из-за проблем с производительностью).

Терминальные выражения в AngularJS DSL определены следующим образом:

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

Каждую функцию связанную с каждым терминальным символом, можно представить как реализацию интерфейса AbstractExpression (абстрактных выражений).

Клиент интерпретирует полученное выражение в определенном контексте – определенного $scope.

Несколько простых выражений AngularJS:

```JavaScript
// toUpperCase filter is applied to the result of the expression
// (foo) ? bar : baz
(foo) ? bar : baz | toUpperCase
```

#### Template View

> Преобразует данные в HTML путем встраивания маркеров в HTML страницу.

![Template View](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/template-view.svg "Fig. 8")

The dynamic page rendering is not that trivial thing. It is connected with a lot of string concatenations, manipulations and frustration. Far easier way to build your dynamic page is to write your markup and embed little expressions inside it, which are lately evaluated in given context and so the whole template is being compiled to its end format. In our case this format is going to be HTML (or even DOM). This is exactly what the template engines do - they take given DSL, evaluate it in the appropriate context and then turn it into its end format.

Динамическое отображение страницы не такая простая задача. Это связано с большим количеством конкатенации строк, манипуляций и проблем. Наиболее простой способ построить динамическую страницу - это написать свою разметку и включить в нее несколько выражений, которые будут обработаны в определенном контексте, в результате весь шаблон будет преобразован в конечный формат. В нашем случае этим форматом будет HTML (или даже DOM). Это именно то что делают шаблонизаторы – они получают DSL, обрабатывают его в соответствующем контексте и затем преобразуют в конечный формат.

Шаблоны очень часто используются на back-end. Например вы можете вставлять PHP код внутри HTML и создавать динамические страницы, так же вы можете использовать Smarty или eRuby в Ruby, чтобы вставлять Ruby код в статические страницы.

В JavaScript есть много шаблонизаторов, таких как mustache.js, handlebars и т.д. Большинство из них работают с шаблоном как со строкой. Шаблон может храниться различными способами:

- статический файл, который будет получен AJAX’ом
- скрипт встроенный внутри вашего представления
- строка внутри вашего JavaScript кода

К примеру:

```html
<script type="template/mustache">
  <h2>Names</h2>
  {{#names}}
    <strong>{{name}}</strong>
  {{/names}}
</script>
```

Шаблонизатор превращает строку в элементы DOM, путем объединения ее с полученным контекстом. Таким образом все встроенные в разметку выражения анализируются и заменяются их значениями.

Например, если мы обработаем шаблон показанный выше в контексте объекта: { names: ['foo', 'bar', 'baz'] } то получим:

```html
<h2>Names</h2>
  <strong>foo</strong>
  <strong>bar</strong>
  <strong>baz</strong>
```

На самом деле шаблоны в AngularJS это обычный HTML. Они не находятся в промежуточном формате, как большинство шаблонов. Что делает AngularJS компилятор, что бы обойти дерево DOM и найти уже известные директивы (элементы, атрибуты, классы или даже комментарии) ? Когда AngularJS находит любую из этих директив он вызывает логику связанную с ней, она может включать определение различных выражений в контексте текущего $scope.

К примеру:


```html
<ul ng-repeat="name in names">
  <li>{{name}}</li>
</ul>
```

В контексте scope:

```javascript
$scope.names = ['foo', 'bar', 'baz'];
```

Будет получен тот же результат что и выше. Главное отличие в том, что шаблон расположен не внутри тега script, здесь это просто HTML.


### Scope

#### Observer

>Шаблон observer (наблюдатель) – поведенческий шаблон проектирования, в котором объект называемый субъектом, хранит список своих зависимостей, которые называются наблюдателями и уведомляет их при каких либо изменениях состояния, обычно вызовом одного из их методов. В основном используется для реализации распределенных систем обработки событий.

![Observer](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/observer.svg "Fig. 7")

В приложениях AngularJS есть два основных способа взаимодействия между scope. 

Первый, вызов методов родительского scope из дочернего scope. Это возможно, потому что дочерний scope наследует прототип своего родителя, как упоминалось выше (смотреть Scope). Это позволяет осуществлять одностороннее взаимодействие от ребенка к родителю. Иногда необходимо вызвать метод дочернего scope или уведомить его о возникновении события в родительском scope. AngularJS предоставляет встроенный шаблон наблюдатель, который позволяет делать это. 

Второй возможный вариант использования шаблона observer, когда несколько scope подписаны на события, но scope в котором оно возникает ничего о нем не знает. Это позволяет уменьшить связанность scope' ов, они не должны ничего знать о других scope.

Каждый scope в AngularJS имеет публичные методы $on, $emit и $broadcast. Метод $on в качестве аргументов принимает имя события и функцию обратного вызова. Эту функцию можно представить как наблюдателя – объект который реализует интерфейс observer (В JavaScript все функции первого класса, поэтому мы можем обеспечить только реализацию метода уведомления).

```JavaScript
function ExampleCtrl($scope) {
  $scope.$on('event-name', function handler() {
    //body
  });
}
```

Таким образом текущий scope подписывается на событие "event-name". Когда оно возникнет в любом из родительских или дочерних scope, будет вызван обработчик.

Методы $emit и $broadcast используются для запуска событий, соответственно вверх и вниз по цепочке наследования. 

К примеру:

```JavaScript
function ExampleCtrl($scope) {
  $scope.$emit('event-name', { foo: 'bar' });
}
```

В примере выше scope генерирует событие "event-name" вверх для всех scope. Это значит что каждый родительский scope, который подписан на событие "event-name", будет уведомлен и его обработчик будет вызван.

Тоже самое происходит когда вызывается метод $broadcast. Разница лишь в том, что событие будет передаваться вниз – для всех дочерних scope. Каждый scope может подписаться на любое событие с несколькими функциями обратного вызова (т. е. он может связать несколько наблюдателей с данным событием).

В JavaScript сообществе этот шаблон более известен как публикация/подписка.

For a best practice example see [Observer Pattern as an External Service](#observer-pattern-as-an-external-service)

#### Chain of Responsibilities

>Chain of Responsibilities (цепочка обязанностей) – поведенческий шаблон проектирования, состоит из объекта команды и последовательности обрабатывающих объектов (обработчиков). Каждый обработчик содержит логику, определяющую тип команды, которую он может обработать. Затем команда поступают к следующему обработчику в цепочке. Шаблон так же содержит механизм для добавления новых обработчиков в конец этой цепочки.

![Chain of Responsibilities](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/chain-of-responsibilities.svg "Fig. 5")

Как показано выше, scope образует иерархию, известную как цепочка scope. Некоторые из этих scope изолированы, это значит, что они не наследуют прототипы своих родительских scope, но связаны с ним через его свойство $parent.

После вызова $emit или $broadcast возникает событие, которое начинает движение (вниз или вверх в зависимости от вызванного метода) по цепочке scope, ее можно представить как шину событий или точнее как цепочку обязанностей. Каждый последующий scope может:

- Обработать событие и передать его следующему scope в цепочке
- Обработать событие и остановить его распространение
- Пропустить событие к следующему scope в цепочке, без его обработки
- Остановить распространение события без его обработки

В примере ниже, ChildCtrl генерирует событие, которое распространяется вверх по цепочке scope. Здесь каждый родительский scope (ParentCtrl и MainCtrl) должны обработать событие записав в консоль: "foo received". Если какой нибудь из scope должен быть конечным получателем, он может вызвать метод stopPropagation в объекте события.

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

Обработчики в показанной выше UML диаграмме, являются различными scope, добавленными в контроллер.

#### Command

>Command - поведенческий шаблон проектирования, в котором объект используется для инкапсуляции всей необходимой информации и вызова метода через некоторое время. Эта информация включает имя метода, объект которому принадлежит метод и значения параметров метода.

![Command](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/command.svg "Fig. 11")

В AngularJS шаблон Command позволяет описать реализацию связывания данных (data binding).

Когда мы хотим связать нашу модель с представлением мы можем использовать директиву ng-bind (для одностороннего связывания данных) и ng-model (для двустороннего связывания данных). К примеру, если мы хотим, что бы каждое изменение модели отображалось в представлении:

```html
<span ng-bind="foo"></span>
```

Теперь каждый раз когда мы изменяем значение foo, текст внутри тега span тоже будет изменен. Также можно использовать более сложные выражения:

```html
<span ng-bind="foo + ' ' + bar | uppercase"></span>
```

В примере выше значением тега span будет сумма значений foo и bar в верхнем регистре. Что происходит внутри ?
В каждом scope есть метод $watch. Когда компилятор AngularJS находит директиву ng-bind, он создает нового наблюдателя для выражения foo + ' ' + bar | uppercase, ($scope.$watch("foo + ' ' + bar | uppercase", function () { /* body */ });). Функция обратного вызова будет вызвана каждый раз когда изменяется значение выражения. В данном случае функция обратного вызова будет обновлять значение тега span.

Вот несколько первых строк реализации $watch:

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

Мы можем представить watcher как Command. Выражение Command будет вычисляться в каждом цикле "$digest". Как только AngularJS обнаружит изменение выражения, он вызовет функцию слушателя. Watcher включает всю необходимую информацию для наблюдения и делегирования выполнение команды слушателю (фактическому получателю). Мы можем представить $scope как Client и цикл $digest как Invoker команд.

### Controllers

#### Page Controller

>Объект, который обрабатывает запросы определенной страницы или действия на сайте. Мартин Фаулер.

![Page Controller](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/page-controller.svg "Fig. 8")

Согласно [4](#Ссылки) контроллерами на страницу:

>Шаблон контроллер страницы допускает ввод данных с полученной страницы, выполнение запрошенных действий для модели и определяет правильное представление для результирующей страницы. Разделение диспетчерской логики от остального кода представления.

Из-за большого количества дублируемого кода на страницах (к примеру футеры, хедеры, код заботящийся о сессии пользователя) контроллеры могут образовывать иерархию. В AngularJS есть контроллеры, которые ограничены scope. Они не принимают запросы пользователей, так как это ответственность $route или $state, а за отображение отвечают директивы ng-view/ui-view.

Так же как в контроллерах страницы, контроллеры AngularJS отвечают за взаимодействие с пользователем, обеспечивая обновление моделей. Эти модели после добавления в scope не защищены от просмотра, все методы включенные в представление в итоге становятся действиями пользователя (методы scope). Другое сходство между контроллерами страниц и AngularJS контроллерами – это иерархия, которую они образуют. Этому соответствует иерархия scope видимости. Таким образом простыми действиями мы можем изолировать базовые контроллеры.

Контроллеры AngularJS очень похожи на ASP.NET WebForms, так как их обязанности практически одинаковы. Вот пример иерархии между несколькими контроллерами:

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

Этот пример иллюстрирует самый простой способ повторного использования логики с помощью базового контроллера, но в любом случае в "production" приложениях не рекомендуется помещать логику авторизации в контроллеры. Доступ к различным маршрутам можно определить на более высоком уровне абстракции.

ChildCtr отвечает за отображение модели в представлении и обработку действий, таких как нажатие на кнопку с названием «Click».

### Others

#### Module Pattern

На самом деле это не шаблон  проектирования от "банды четырех" и даже ни один из "Patterns of Enterprise Application Architecture". Это традиционный JavaScript шаблон проектирования, целью которого является обеспечение инкапсуляции.
Используя шаблон модуль вы можете получить приватность данных на основе функционально-лексической области видимости. Каждый модуль может иметь ноль и более приватных методов, которые скрыты в локальной области видимости. 

Эта функция возвращает объект, который предоставляет публичный API для данного модуля:

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

В примере выше IIFE (Immediately-Invoked Function Expression - выражение немедленно вызванной функции), которая после вызова возвращает объект, с двумя методами (setTitle и getTitle). Возвращенный объект присвоен переменной Page. В таком случае пользователь объекта Page не имеет прямого доступа к переменной title, которая определена внутри локальной области видимости IIFE.

Шаблон модуль очень полезен при определении service в AngularJS. Используя этот шаблон мы можем достичь (и на самом деле достигаем) приватности:

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

После того как мы добавим foo в любой другой компонент, у нас не будет возможности использовать приватные методы, только публичные. Это решение является довольно мощным, особенно, когда мы создаем библиотеки для повторного использования.

#### Data Mapper

>Шаблон Data Mapper – это слой доступа к данным, который выполняет двунаправленную передачу данных между постоянным хранилищем данных (часто это реляционная БД) и данными в памяти. Цель этого шаблона – хранить в памяти представление постоянных данных, независимо друг от друга и от себя самого.

![Data Mapper](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/data-mapper.svg "Fig. 10")

Как уже говорилось Data Mapper используется для двунаправленной передачи данных между постоянным хранилищем данных и данными в памяти. Обычно AngularJS приложение взаимодействует с API сервера, которое написано на любом серверном языке (Ruby, PHP, Java, JavaScript и т.д.).

Если у нас есть RESTful API, service $resource поможет нам взаимодействовать с сервером в Active Record подобном стиле. Хотя некоторые приложения возвращают данные с сервера не в самом подходящем формате, который мы хотим использовать на front-end.

Давайте предположим что в нашем приложении, у каждого пользователя есть:

- name
- address
- list of friends

И API у которого есть следующие методы:

- `GET /user/:id` - возвращает имя и адрес полученного пользователя
- `GET /friends/:id` - возвращает список друзей данного пользователя

Одно из решений, использовать два различных service, один для первого метода и другой для второго. Возможно более подходящим решением будет, использование одного service, который называется User, он загружает друзей пользователя, когда мы запрашиваем User:

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

Таким образом мы создали псевдо Data Mapper, который адаптируется к нашему API в соответствии с требованиями SPA.

Мы можем использовать User следующим образом:

```javascript
function MainCtrl($scope, User) {
  User.get({ id: 1 })
  .then(function (data) {
    $scope.user = data;
  });
}
```

И соответствующий шаблон:

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

#### Шаблон Observer как внешний сервис

##### Описание

Пример ниже взят отсюда [here](https://github.com/greglbd/angular-observer-pattern). Здесь фабрика создает сервис, который реализует шаблон Observer. 
Этот шаблон хорошо работает при использовании синтаксиса ControllerAs и может быть более эффективным чем `$scope.$watch`, так же Observer будет более специфичным для конкретного scope или объекта, когда они правильно используют $emit and $broadcast

**Вариант использования:** Вы можете использовать этот шаблон для взаимодействия двух контроллеров, которые обращаются к одной модели, но не подключены друг к другу.

##### Пример контроллера

Пример ниже показывает как подписаться, сгенерировать и отписаться от события.

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
Еще один способ удалить событие

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

## Ссылки

1. [Wikipedia](https://en.wikipedia.org/wiki). Краткое описание шаблонов проектирования в Википедии.
2. [AngularJS' documentation](https://docs.angularjs.org)
3. [AngularJS' git repository](https://github.com/angular/angular.js)
4. [Page Controller](http://msdn.microsoft.com/en-us/library/ff649595.aspx)
5. [Patterns of Enterprise Application Architecture (P of EAA)](http://martinfowler.com/books/eaa.html)
6. [Using Dependancy Injection to Avoid Singletons](http://googletesting.blogspot.com/2008/05/tott-using-dependancy-injection-to.html)
7. [Why would one use the Publish/Subscribe pattern (in JS/jQuery)?](https://stackoverflow.com/questions/13512949/why-would-one-use-the-publish-subscribe-pattern-in-js-jquery)
