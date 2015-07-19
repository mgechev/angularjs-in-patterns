# Les patrons de conception avec AngularJS 1.x

<!--toc-->

## Table des matières

* [Traductions](#translations)
* [Abstract](#abstract)
* [Introduction](#introduction)
* [Vue d'ensemble d'AngularJS](#angularjs-overview)
  * [Les vues partielles](#partials)
  * [Les contrôleurs](#controllers)
  * [Le scope](#scope)
  * [Les directives](#directives)
  * [Les filtres](#filters)
  * [Les services](#services)
* [Les patrons de conception d'AngularJS](#angularjs-patterns)
  * [Les services](#services-1)
    * [Singleton](#singleton)
    * [Factory Method](#factory-method)
    * [Decorator](#decorator)
    * [Facade](#facade)
    * [Proxy](#proxy)
    * [Active Record](#active-record)
    * [Intercepting Filters](#intercepting-filters)
  * [Les directives](#directives-1)
    * [Composite](#composite)
  * [Interpreter](#interpreter)
    * [Template View](#template-view)
  * [Le scope](#scope-1)
    * [Observer](#observer)
    * [Chaîne de responsabilités](#chain-of-responsibilities)
    * [Command](#command)
  * [Les contrôlleurs](#controller-1)
    * [Page Controller](#page-controller)
  * [Les autres patrons](#others)
    * [Module Pattern](#module-pattern)
    * [Data Mapper](#data-mapper)
    * [Le service en tant que Observer](#observer-pattern-as-an-external-service)
* [Références](#references)

<!--endtoc-->

## Traductions

- [Version original](https://github.com/mgechev/angularjs-in-patterns/blob/master/README.md)
- [Traduction japonaise](https://github.com/mgechev/angularjs-in-patterns/blob/master/i18n/README-ja-jp.md) par [morizotter](https://twitter.com/morizotter)
- [Traduction russe](http://habrahabr.ru/post/250149/)

## Abstract

Parfois, le meilleur moyen d'apprendre une nouvelle technologie est d'essayer de retrouver des concepts que l'on connait déjà, et voir comment ils sont implémentés dans cette technologie.
Ce document n'a pas pour vocation d'expliquer en détails les principes d'architecture logiciels ou de la POO.
Le but de ce papier est de décrire comment les différents patrons de conception logiciel et aussi ceux d’architecture peuvent être implémentés par AngularJS ou n'importe quelle Single Page Application codée avec AngularJS.

## Introduction

Ce document commence par une vue d'ensemble du framework AngularJS. Dans cette vue d'ensemble, nous décrivons les différents composants du framework - les directives, filtres, contrôleurs, services et scope. La second section liste et décrit les différents patrons de conception qui sont implémentés par le framework. Ces patrons sont groupés par les composants AngularJS dans lesquels ils sont implémentés. Lorsqu'un patron est utilisé dans plusieurs composants, cela sera mentionné explicitement.

La dernière section contient quelques patrons d'architecture souvent rencontrés dans la plupart des applications AngularJS.

## Vue d'ensemble d'AngularJS

AngularJS est un framework JavaScript développé par Google. Il propose de solides bases pour le développement d'application mono-page (Single-Page Application - SPA).
Une SPA est une application qui une fois chargée, ne requiert pas un rechargement total de la page lorsque l'utilisateur interagit avec elle. Cela signifie que toutes les ressources de l'application (données, templates, scripts et styles) devrait être chargées lors de la première requête, voire mieux, à la demande.
Le constat étant que les applications SPA de type CRUD ont des caractéristiques communes, AngularJS fournit de base tout un ensemble de mécanismes et fonctionnalités tels que :

- le binding bi-directionnel
- l'injection de dépendances
- la séparation des préoccupations
- les tests
- une abstraction

La séparation des préoccupations est rendue possible en divisant une application AngularJS en plusieurs composants, tels que :

- les vues partielles
- les contrôleurs
- les directives
- les services
- les filtres

Ces composants peuvent être groupés dans des modules, qui offre une abstraction supplémentaire pour mieux gérer la complexité des SPA. Chaque composant encapsule une partie bien spécifique et bien définit de la logique de l'application.

### Les vues partielles

Les vues partielles sont de l'HTML. Elles peuvent contenir des expressions AngularJS au sein des éléments HTML ou des attributs. L'une des différences majeures entre AngularJS et les autres frameworks réside dans le fait que les templates AngularJS ne sont pas un format intermédiaire qui devrait être transformé en HTML (ce qui est le cas de mustache.js ou handlebars, par exemple).

Initialement, chaque SPA charge le fichier `index.html`. Dans le cas d'AngularJS, ce fichier contient du code HTML standard enrichit avec des éléments, attributs et commentaire dont le but est de configurer et de démarrer l'application. Chaque interaction de l'utilisateur avec l'application requiert simplement le chargement d'une vue partielle ou le chargement d'un état de l'application, à travers le biding de données fournit par AngularJS.

**Exemple de vue partielle**

```HTML
<html ng-app>
 <!-- La balise body est enrichit avec la directive ng-controller -->
 <body ng-controller="MyController">
   <input ng-model="foo" value="bar">
    <!-- la balise button est enrichit avec la directive ng-click 
          et l'expression 'buttonText' est entourée par des "{{ }}" -->
   <button ng-click="changeFoo()">{{buttonText}}</button>
   <script src="angular.js"></script>
 </body>
</html>
```

Avec les expressions, les vues partielles définissent quelles actions doivent traiter les actions de l'utilisateur. Dans l'exemple précédent, la valeur de l'attribut `ng-click` précise que la méthode `changeFoo` du *scope* courant sera invoquée.

### Les contrôleurs

Les contrôleurs d'AngularJS sont des fonctions JavaScript qui gèrent les interactions de l'utilisateur avec l'application web (par exemple, les événements de la souris, des touches claviers...etc), en attachant des méthodes au *scope*. Toues les dépendances externes d'un contrôleur sont fournit via le mécanisme d'ID ou injection de dépendances d'AngularJS. Les contrôleurs ont également pour but de fournir le *modèle* à la vue en attachant des données dans le *scope*. Nous pouvons voir ces données comme des *modèle vue* (*view model*)

```
JavaScript
function MyController($scope) {
  $scope.buttonText = 'Cliquer moi pour changer foo!';
  $scope.foo = 42;

  $scope.changeFoo = function () {
    $scope.foo += 1;
    alert('Foo a été changé');
  };
}
```
Par exemple, si nous associons le contrôleur de l'exemple ci-dessus avec la vue de l'exemple dans la section précédente, l'utilisateur va pouvoir interagir avec l'application de différentes manières :

1. Changer la valeur de `foo` en saisissant une valeur dans le champ de saisie. Ceci va immédiatement refléter la valeur de `foo` grâce au mécanisme de biding bi-directionnel.
2. Changer la valeur de `foo` en cliquant sur le bouton, qui aura le libellé `Cliquer moi pour changer foo!`.

Tous les éléments, attributs, commentaires ou classes CSS personnalisés permettant d'enrichir l'HTML sont appelés des *directives* AngularJS.

### Le scope

Dans AngularJS, le scope est un objet JavaScript qui est exposé au vues partielles. Le scope peut contenir plusieurs propriétés - primitives, objets ou méthodes. Toutes les méthodes attachées au scope peuvent être invoquées en évaluant l'expression AngularJS à l'intérieur de la vue associée au scope en question, ou simplement via un appel direct à la méthode par un composant donné. En utilisant les *directives* adéquates, les données attachées au scope peuvent être attachées (data-bound) de telle sorte que chaque changement dans la vue met à jour - immédiatement et automatiquement - une propriété du scope ; ainsi que chaque changement d'une propriété du scope est immédiatement reflété dans la vue.

Une autre caractéristique très importante des scopes réside dans le fait que les scopes sont hiérarchisés en suivant le modèle de la chaîne des prototypes de JavaScript (excepté les scopes *isolés*). De cette manière, chaque scope fils a la possibilité d'invoquer des méthodes de ses parents, puisque ces derniers sont des propriétés directes ou indirectes de son prototype.

L'héritage des scopes est illustré dans l'exemple suivant :

```HTML
<div ng-controller="BaseCtrl">
  <div id="child" ng-controller="ChildCtrl">
    <button id="parent-method" ng-click="foo()">méthode du parent</button>
    <button ng-click="bar()">méthode du fils</button>
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

Le contrôleur `ChildCtrl` est associé à l'élément `div#child`, mais puisque le scope injecté par `ChildCtrl` hérite le prototype du scope de son parent (celui injecté par le contrôleur `BaseCtrl`). Ceci fait que la méthode `foo` est accessible par `button#parent-method`.

### Les directives

Dans AngularJS, les directives sont l'endroit où toutes les manipulations du DOM doivent être implémentées. Lorsque vous devez manipuler le DOM, vous devez créer une directive ou réutiliser celles qui existent.
Chaque directive possède un nom et une logique associée. Dans le cas le plus simple, une directive contient seulement un nom et une définition de la fonction *postLink*, qui encapsule toute la logique requise pour la directive. Pour les cas les plus complexes, une directive peut contenir d'autres propriétés tels que :

- un template
- une fonction `compile`
- une fonction `link`
- etc...

Pour utiliser une directive dans une vue, il suffit de référencer son nom. Par exemple :

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
<alert-button content="42">Cliquer moi</alert-button>
```

Dans cet exemple, la balise `<alert-button></alert-button>` sera remplacé par la balise `button`. Lorsque l'utilisateur cliquera sur ce bouton, le message `42` sera affiché.

Nous n'irons pas plus loin dans les explications des directives. Ce n'est pas le but de ce papier.

### Les filtres

Dans AngularJS, les filtres sont responsables d'encapsuler toute la logique nécessaire pour formater des données. Souvent, les filtres sont utilisés au sein des vues, mais il est également possible de les appeler dans des contrôleurs, directives, services ainsi que d'autres filtres grâce à l'injection de dépendances.

Voici une définition d'un filtre dont le rôle est de transformer une chaîne de caractères en majuscule :

```JavaScript
myModule.filter('uppercase', function () {
  return function (str) {
    return (str || '').toUpperCase();
  };
});
```

Ce filtre peut être utilisé au sein d'une vue en utilisant le symbole `|` d'Unix :

```HTML
<div>{{ name | uppercase }}</div>
```

Au sein d'un contrôleur, le filtre peut être utilisé de cette façon :


```JavaScript
function MyCtrl(uppercaseFilter) {
  $scope.name = uppercaseFilter('foo'); //FOO
}

### Les services

Dans AngularJS, les services sont responsables d'accueillir la logique métier des composants, la logique de persistance, les appels XHR, WebSockets, etc. Lorsque le contrôleur devient trop `gros`, le code superflu et répétitif devrait être déplacé dans un service.

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

Le service peut être injecté dans n'importe quel composant, supportant l'injection de dépendances (les contrôleurs, d'autres services, les filtres, les directives).

```JavaScript
function MyCtrl(Developer) {
  var developer = new Developer();
  developer.live();
}
```

## AngularJS Patterns

Dans les sections suivantes, nous allons voir comment les patrons de conception traditionnels sont utilisés dans les composants d'AngularJS.

Ensuite, dans le dernier chapitre, nous verrons quels sont les différents patrons d'architecture fréquemment rencontrés dans les Single-Page Application développés avec AngularJS, mais pas seulement.

### Les services

#### Le patron Singleton

>Le patron Singleton vise à assurer qu'il n'y a toujours qu'une seule instance d'un objet en fournissant une interface pour la manipuler. C'est un des patrons les plus simples. L'objet qui ne doit exister qu'en une seule instance comporte une méthode pour obtenir cette unique instance et un mécanisme pour empêcher la création d'autres instances. 

Ce patron est illustré dans le diagramme UML ci-dessous :

![Singleton](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/singleton.svg "Fig. 1")

Lorsqu'une dépendance doit être injectée par AngularJS dans un composant, voici l'algorithme utilisé par le framework :

- Prendre le nom de la dépendance et le rechercher dans une `hash map`, qui est définit au sein de sa portée lexical (ainsi elle reste privée).
- Si la dépendance existe, AngularJS la passe en tant que paramètre au composant qui l'a demandé.
- Si la dépendance n'existe pas :
  - AngularJS créé une nouvelle instance de cette dépendance en invoquant la `factory method` de son provider: la méthode `$get`. A noter qu'au moment de l'instanciation, cette dépendance peut éventuellement déclencher un appel récursive de cet algorithme, afin de résoudre toutes les dépendances requises par cette dépendance. Ce qui peut conduire à un souci de dépendances circulaires.
  - AngularJS met en cache cette instance, dans la hash map mentionnée précédemment.
  - AngularJS transmet cette instance en tant que paramètre au composant qui a demandé cette dépendance.

Voici un aperçu du code source d'AngularJS, de la méthode `getService` :

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

Nous pouvons dire que chaque service est un singleton car chaque service est instancié qu'une seule fois. Nous pouvons également considérer le cache comme un manageur de singletons. Il existe une légère variation du diagramme UML illustré ci-dessus parce qu'au lieu de garder une référence statique, au sein de son constructeur, nous conservons cette référence au sein du manager de singleton (illustré dans le bout de code ci-dessus en tant que `cache`).

De cette manière, les services sont réellement des singletons mais ne sont pas implémentés à travers le patron Singleton, ce qui offre quelques avantages par rapport à l'implémentation classique :

- améliore la testabilité de votre code source
- vous pouvez contrôler la création des objets singletons (dans notre cas, le conteneur IoC (Inversion de Contrôle) le contrôle pour nous, en instanciant le singleton).

Si vous voulez en savoir plus, vous pouvez lire l'[article](http://googletesting.blogspot.com/2008/05/tott-using-dependancy-injection-to.html) de Misko Hevery.

#### Factory Method

>Le patron Factory Method fournit une interface pour créer un objet qui laisse la possibilité aux sous-classes de décider quel type d'objet créer. Ce patron est utilisé lorsque la classe d'un objet n'est pas connue au moment de la compilation. Une méthode pour créer un objet factory method est définie dans une classe abstraite, et implémentée dans les différentes sous-classes. La factory method peut également comporter une implémentation par défaut.

![Factory Method](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/factory-method.svg "Fig. 2")

Considérons le code suivant :

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

Dans le code ci-dessus, nous utilisons la callback `config` dans le but de définir un nouveau "provider" ou un "fournisseur". Un "provider" est un objet qui possède une méthode `$get`. Puisque JavaScrit n'offre pas d'interface, la convention veut que l'on nomme cette méthode de telle sorte.

Chaque service, filtre ou contrôleur possède un "provider" qui est responsable de créer une instance de ce composant.

Jetons un oeil sur l'implémentation d'AngularJS :

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

D'après ce code, nous remarquons que la méthode `$get` est utilisé à ce niveau :

```JavaScript
instanceInjector.invoke(provider.$get, provider, undefined, servicename)
```

Dans ce bout de code, la méthode `invoke` de l'objet `instanceInjector` est invoquée avec la "factory method" `$get` en premier paramètre. Dans le corps de la fonction `invoke` la fonction `annotate` est appelée avec en premier paramètre la "factory method". Cette fonction `annotate` permet de résoudre toutes les dépendances à travers le mécanisme d'injection de dépendance d'AngularJS, vu précédemment. Lorsque toutes les dépendances sont résolues, la "factory metho" est invoquée : `fn.apply(self, args)`.

Si nous faisons le lien avec le diagramme UML précédent (en figure 2), nous pouvons associer le "provider" à "ConcreteCreator" et le composant créé, un "Product".

Utiliser le patron Factory Method offre des avantages dans notre cas grâce à l'indirection qu'il introduit. Cela permet au framework de d'avoir le contrôle de la création des nouveaux composants, comme par exemple :

- Le moment approprié d'instancier un composant.
- La résolution de toutes les dépendances requises par un composant.
- Le nombre d'instance autorisé par composant : une seule pour les filtres et les services, et plusieurs instances pour les contrôleurs.

#### Decorator

>Ce patron permet d'attacher dynamiquement des responsabilités à un objet. Une alternative à l'héritage. Ce patron est inspiré des poupées russes. Un objet peut être caché à l'intérieur d'un autre objet décorateur qui lui rajoutera des fonctionnalités, l'ensemble peut être décoré avec un autre objet qui lui ajoute des fonctionnalités et ainsi de suite. Cette technique nécessite que l'objet décoré et ses décorateurs implémentent la même interface, qui est typiquement définie par une classe abstraite.

![Decorator](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/decorator.svg "Fig. 4")

AngularJS fournit de base un moyen d'étendre et d'enrichir les fonctionnalités des services existants. En utilisant la méthode `decorator` de l'objet `$provider`, il est possible de créer des "wrapper" de n'importe quel service définit ou fournit par un module tiers :


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

L'exemple ci-dessus définit un nouveau service appelé `foo`. Dans la phase de configuration, la méthode `$provider.decorator` est invoquée avec l'argument `"foo"`, qui est le nom du service que nous souhaitons décorer, ainsi qu'un second paramètre qui est l'implémentation de la décoration souhaitée. `$delegate` garde une référence du service original `foo`. En utilisant l'injection de dépendances d'AngularJS, nous récupérant cette référence dans le décorateur. Nous décorons ensuite le service en surchargeant sa méthode `bar`, en invoquant une instruction supplémentaire : `console.log('Decorated');`. Puis nous donnons la main au service original.

Ce patron est utile si nous souhaitons modifier le comportement des services tiers. Dans certains cas où plusieurs décorations "similaires" sont nécessaires (mesure de performance, gestion des droits, gestion des logs, etc.), nous risquons d'introduire beaucoup de duplication de code et violer ainsi le principe DRY. Dans ces cas précis, il est recommandé de se recourir aux principe de la [Programmation Orienté Aspects (AOP)](http://en.wikipedia.org/wiki/Aspect-oriented_programming). Il existe un framework AOP pour AngularJS, vous pouvez le trouver à [cette adresse](https://github.com/mgechev/angular-aop).

#### Facade

>Ce patron fournit une interface unifiée sur un ensemble d'interfaces d'un système. Il est utilisé pour réaliser des interfaces de programmation. Si un sous-système comporte plusieurs composants qui doivent être utilisés dans un ordre précis, une classe façade sera mise à disposition, et permettra de contrôler l'ordre des opérations et de cacher les détails techniques des sous-systèmes. Une façade peut :

>1. rendre une librairie plus simple à utiliser et à tester.

>2. rendre une librairie plus simple à comprendre.

>3. offrir une meilleure flexibilité dans le développement de la librairie.

>4. englober une collection d'API mal conçues en une seule API bien conçue (en foncton des tâches).

![Facade](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/facade.svg "Fig. 11")

Il existe peut de façades dans AngularJS. A chaque fois que vous voulez fournir une API de haut niveau pour une certaine fonctionnalité, vous finissez par créer une façade.

Par exemple, regardons comment créer une requête POST avec `XMLHttpRequest` :

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

Voici la même chose en utilisant le service `$http` d'AngularJS :

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
ou encore :

```JavaScript
$http.post('/someUrl', data)
.then(function (response) {
  alert(response);
});
```

La seconde option offre une version pre-configurée qui créé une requête POST vers une URL donnée.

Le service `$resource` d'AngularJS est un service construit autour de `$http` et apporte une abstraction supplémentaire. Nous verrons ce nouveau dans les sections [Enregistrement Actif (Active Record)](#active-record) et [Proxy](#proxy).

#### Proxy

>Ce patron est un substitut d'un objet, qui permet de contrôler l'utilisation de ce dernier. Un proxy est un objet destiné à protéger un autre objet. Le proxy a la même interface que l'objet à protéger. Il peut être créé par exemple pour permettre d’accéder à distance à un objet (via un middleware). Un proxy, dans sa forme la plus simple, ne protège rien du tout et transmet tous les appels de méthode à l'objet cible.

![Proxy](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/proxy.svg "Fig. 9")

Nous pouvons différencier trois types de proxy :

- Proxy virtuel
- Proxy distant
- Proxy de protection

Dans cette section, nous allons parler de l'implémentation du proxy virtuel dans AngularJS.

Dans le code suivant, il y a un appel vers la méthode `get` de l'instance `$resource` référencée par `User` :

```JavaScript
var User = $resource('/users/:id'),
    user = User.get({ id: 42 });
console.log(user); // {}
```

L'appel de `console.log` affiche un objet vide. La requête AJAX, qui est émise lors de l'appel de la méthode `User.get`, est une requête asynchrone, nous n'avons pas vraiment l'objet `user` lorsque `console.log` est invoquée. Juste après que `User.get` déclenche la requête GET, elle retourne un objet vide et garde une référence vers ce dernier. Cet objet représente donc un proxy virtuel, qui sera mis à jour avec les données récupérées du serveur lors de la réception de la réponse. 

Comment cela fonctionne dans AngularJS? Considérons le code suivant :


```JavaScript
function MainCtrl($scope, $resource) {
  var User = $resource('/users/:id'),
  $scope.user = User.get({ id: 42 });
}
```

```html
<span ng-bind="user.name"></span>
```

>**Pro tip** : Il n'est pas conseillé d'utiliser `$resource` directement dans un contrôleur. Préférez le mettre dans une factory ou un service !

Lorsque ce code s'exécute, la propriété `user` de l'objet `$scope` est initialement vide (`{}`), ce qui signifie que `user.name` sera `undefined` et rien ne sera rendu dans la vue. En interne, AngularJS garde une référence de cet objet vide. Lorsque le serveur répond à la requête GET, AngularJS met à jour l'objet avec les données reçues. Lors de l'itération suivante de la boucle du `$digest`, AngularJS détecte des changements dans l'objet `$scope.user`, ce qui déclenche le rafraichissement de la vue.

#### Enregistrement Actif (Active Record)

>Active Record est une approche pour lire les données d'une base de données. Les attributs d'une table ou d'une vue sont encapsulés dans une classe. Ainsi l'objet, instance de la classe, est lié à un tuple de la base. L'objet Active Record encapsule donc les données ainsi que le comportement.

![Active Record](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/active-record.svg "Fig. 7")

AngularJS définit un service nommé `$resource` distribué dans un module additionnel. D'après la [documentation](https://docs.angularjs.org/api/ngResource/service/$resource) d'AngularJS du service `$resource` :

>Une factory pour la création d'objet permettant une interaction avec les données des sources RESTful.
>L'objet retourné possède des méthodes d'action offrant une abstraction très haut niveau et ne nécessitant pas une interaction avec le service `$http`.

Voici comment le service `$resource` peut être utilisé :

```JavaScript
var User = $resource('/users/:id'),
    user = new User({
      name: 'foo',
      age : 42
    });

user.$save();
```

l'appel à `$resource` retourne un constructeur permettant d'instancier des objets de notre modèle `User`. Chaque instance possède des méthodes correspondantes à des opérations de CRUD.

Le constructeur possède également des méthodes statiques équivalentes aux méthodes d'instances :

```JavaScript
var user = User.get({ userid: userid });
```

Ce code retourne un [proxy virtuel](#proxy). 

Les puristes dirons de suite que le service `$resource` n'implémente pas le parton Active Record, puisque ce dernier stipule que la responsabilité d'un tel patron de conception est de prendre en charge la communication avec la base de données. Or `$resource` communique lui avec des Web Services RESTful. A vrai dire, tout dépend de quel point de vue nous nous situons, pour une application SPA, une resource RESTful est considérée comme une source de données. Voilà ! problème résolue.

Vous pouvez trouver plus de détails concernant les pouvoirs du service `$resource` [ici](http://blog.mgechev.com/2014/02/05/angularjs-resource-active-record-http/).

#### Intercepting Filters

>Créé une chaîne de filtres composables afin d'implémenter des tâches de pré-processing et post-processing récurrentes lors de l'émission des requêtes.

![Composite](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/intercepting-filters.svg "Fig. 3")

Dans certains cas, il peut arriver que vous deviez traiter les requêtes HTTP sortantes et entrantes afin par exemple d'ajouter une gestion de logs, ajouter un mécanisme de sécurité, ou tout autre tâche concernée par le corps de la requête ou de ses entêtes. Les filtres d'interception inclus une chaîne de filtres pouvant chacun traiter des données dans un ordre définit. La sortie de chaque filtre est l'entrée du filtre suivant.

Dans AngularJS, nous rencontrons ce patron dans le service `$httpProvider`. Ce service possède un tableau de propriétés appelé `interceptors` qui contient une liste d'objet. Chaque objet peut posséder une ou toutes les propriété suivantes : `request`, `response`, `requestError`, `responseError`.

L'objet `requestError` est un intercepteur qui est appelé lorsque l'intercepteur `request` de la requête précédente jette une erreur ou un exception ou bien lorsqu'un promise a été rejetée. De même, `responseError` est appelé lorsque l'intercepteur `response` de la réponse précédente rencontre une erreur.

Voici un exemple basique :

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

### Les directives

#### Composite

#### Interpreter

#### Template View

### Scope

#### Observer

#### Chain of Responsibilities

#### Command

### Controllers

#### Page Controller

### Others

#### Module Pattern

### Data Mapper

### Observer Pattern as an External Service

##### About

##### Controller Example

## References

1. [Wikipedia](https://en.wikipedia.org/wiki). The source of all brief descriptions of the design patterns is wikipedia.
2. [AngularJS' documentation](https://docs.angularjs.org)
3. [AngularJS' git repository](https://github.com/angular/angular.js)
4. [Page Controller](http://msdn.microsoft.com/en-us/library/ff649595.aspx)
5. [Patterns of Enterprise Application Architecture (P of EAA)](http://martinfowler.com/books/eaa.html)
6. [Using Dependancy Injection to Avoid Singletons](http://googletesting.blogspot.com/2008/05/tott-using-dependancy-injection-to.html)
7. [Why would one use the Publish/Subscribe pattern (in JS/jQuery)?](https://stackoverflow.com/questions/13512949/why-would-one-use-the-publish-subscribe-pattern-in-js-jquery)
























(WIP...)
