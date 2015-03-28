# AngularJS in Patterns

_このドキュメントは[AngularJS in Patterns](https://github.com/mgechev/angularjs-in-patterns/blob/master/README.md)の日本語翻訳版です。_

<!--toc-->

## 目次

* [要旨](#要旨)
* [はじめに](#はじめに)
* [AngularJSの概要](#AngularJSの概要)
* [パーシャル](#パーシャル)
* [コントローラ](#コントローラ)
* [スコープ](#スコープ)
* [ディレクティブ](#ディレクティブ)
* [フィルタ](#フィルタ)
* [サービス](#サービス)
* [AngularJSのパターン](#angularjs-patterns)
* [サービス](#services-1)
  * [シングルトン](#シングルトン)
  * [ファクトリ・メソッド](#ファクトリ・メソッド)
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
* [References](#references)

<!--endtoc-->

## 要旨

新しいことを学ぶ際のもっともよい方法の１つとして、既に知っているものがそこでどのように使われているかを観察するという方法があります。
このドキュメントは読者にデザインやアーキテクチャのパターンに親しんでもらおうとして書かれているものではありませんので、オブジェクト指向やデザイン・パターン、アーキテクチャ・パターンについての基本的な理解をしておくことをおすすめします。
このドキュメントの目的は、AngularJSやAngularJSのシングル・ページ・アプリケーションにどれだけ様々なソフトウェア・デザインやアーキテクチャのパターンが採用されているかを述べることです。

## はじめに

このドキュメントはAngularJSの概要を簡単に見ていくところから始まります。「AngularJSの概要」ではAngularJSの主なコンポーネントとして、ディレクティブ、フィルタ、コントローラ、サービス、スコープを見ていきます。２番目のセクションでは、フレームワークの内部で利用されている別のデザインとアーキテクチャのパターンを解説していきます。いくつかのコンポーネントで利用されているパターンがあった場合は、言及していきます。

最後のセクションでは、AngularJSで作られているシングル・ページ・アプリケーションでよく使われているいくつかのアーキテクチャ・パターンを解説します。

## AngularJSの概要

AngularJSはCRUDなシングル・ページ・アプリケーション（SPA）開発の基盤を提供する目的で作られたGoogle製のJavascriptフレームワークです。

SPAとは一度ロードされたら以後ページの全要素を再読込する必要なく、ユーザの操作を受け付けるウェブ・アプリケーションです。これはデータ、テンプレート、スクリプト、スタイルなど全てのリソースを最初のリクエスト時に、または、それが必要になった時にロードすることを意味します。ほとんどすべてのCRUDなアプリケーションは共通の特性と要求を持っているので、AngularJSはそれらのアプリケーションが必要とするものをまとめてすぐに使える最高セットを提供しようとしています。AngularJSのいくつかの重要な特徴は下記のとおりです:

- 双方向バインディング
- 依存性の注入
- 関心の分離
- テストの容易性
- 抽象化

関心の分離はそれぞれのAngularJSアプリケーションを別々のコンポーネント（下記）に分けることで達成されています。

- パーシャル
- コントローラ
- ディレクティブ
- サービス
- フィルタ

これらのコンポーネントはそれぞれのモジュールの中でグループ化することができるので、高度な抽象化がやりやすくなりますし、複雑な処理も扱いやすくなっています。それぞれのコンポーネントはアプリケーションの必要なロジックを隠蔽します。

### パーシャル

パーシャルはHTMLの文字列です。パーシャルはエレメントまたはアトリビュートの中にAngularJSのエクスプレッションを含むことがあります。AngularJSとその他のフレームワークの違いの１つは、AngularJSのテンプレートがHTMLに変換される前の中間的なフォーマット（例えば、mustache.jsやhandlebarsのようなもの）ではないということです。

SPAは最初に `index.html` ファイルを読み込みます。AngularJSの場合、このファイルに標準のHTMLアトリビュート、エレメント、コメントに加えカスタムのものも含みます。この段階で、アプリケーションの設定と準備をします。これに続くユーザのアクションは、例えば、フレームワークによって提供されるデータ・バインディングを通すなどして、アプリケーションの他のパーシャルの読み込みや、状態の変更のみで対応します。

**パーシャルのサンプル**

```HTML
<html ng-app>
 <!-- BodyタグはngControllerディレクティブによって機能追加されます  -->
 <body ng-controller="MyController">
   <input ng-model="foo" value="bar">
   <!-- ng-clickディレクティブ付きのButtonタグと
          "{{ }}"マークアップで囲われた 'buttonText'
          エクスプレッションです -->
   <button ng-click="changeFoo()">{{buttonText}}</button>
   <script src="angular.js"></script>
 </body>
</html>
```

AngularJSのエクスプレッションでパーシャルはユーザとの対話の中でどのアクションを実行すべきかを定義します。上記の例では、 `ng-click` の値は、現在の *scope* の `changeFoo` メソッドが実行されることを表しています。

### コントローラ

AngularJSのコントローラはユーザとウェブ・アプリケーションとの双方向のやりとり（マウスイベント、キーボードイベントなど）を扱うJavaScriptの関数です。 *scope* に、メソッドを追加することで実現します。コントローラに必要なコンポーネントはAngularJSの依存性の注入によって提供されます。コントローラはまた *scope* にデータを追加することで、パーシャルに *model* を提供する責務を負います。このデータを *view model* と考えることができます。

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

例えば、もし上記のサンプルコントローラと、前述のパーシャルをつなげた場合、ユーザはアプリケーションといくつかの方法でコミュニケーションができるようになります。

1. インプット・ボックスにタイプすることで、 `foo` の値を変更します。双方向バインディングによって、この変更はすぐに `foo` の値に反映されます。
2. `Click me to change foo!` と表示されているボタンをクリックすることで `foo` の値を変更します。

全てのカスタム・エレメント、コメント、また、クラスは事前に定義されている場合、AngularJSの *ディレクティブ* として認識されます。

### スコープ

AngularJSではスコープはパーシャルに露出したJavaScriptのオブジェクトです。スコープはプリミティブ、オブジェクト、メソッドなど異なるプロパティを含んでいます。スコープに追加された全てのメソッドはスコープと関連付けられたパーシャルの中でAngularJSのエクスプレッションによって評価され実行されます。また、スコープへの参照を持つコンポーネントから直接呼び出されます。適切な *ディレクティブ* を使うことでスコープに追加されたデータはビューにバインディングされ、パーシャルの中の変更がスコープのプロパティに反映されます。また、プロパティの変更がパーシャルに反映されます。

AngularJSアプリケーションのスコープのもう一つの重要な特性は、それがプロトタイプ・チェーンと結びついていることです（ 明示的に *分離* されたものを除きます）。これにより、子のスコープは親のスコープのメソッドを実行することができます。この場合のメソッドは子のスコープの直接、または関節のプロトタイプのプロパティだからです。

スコープの継承は次の例で説明します:

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

`div#child` は `ChildCtrl` と結びついていますが、 `ChildCtrl` に注入されたスコープは親のスコープ（ `BaseCtrl` に注入されたスコープ ）からプロトタイプ継承をしているので、 `foo` メソッドは `button#parent-method` でアクセス可能になっています。

### ディレクティブ

AngularJSでは全てのDOM操作がなされるべき場所です。目安としては、コントローラがDOM操作を含む場合、新しいディレクティブを作るか、すでにあるディレクティブが必要なDOM操作ができるようにするためのリファクタリングをするべきでしょう。
全てのディレクティブは名前と関連するロジックを持っています。最もシンプルなケースとしては、ティレクティブは名前と必要なすべてのロジックをカプセル化するための *postLink* 関数を持ちます。少し複雑なケースでは、下記のようなたくさんのプロパティを持ちます:

- テンプレート
- コンパイル関数
- リンク関数
- などなど...

ディレクティブの名前を利用することで、パーシャルの中で利用することができます。

例:

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

上記の例では、 `<alert-button></alert-button>` タグはボタンエレメントに置換えられます。ユーザがボタンをクリックした時に、文字列の `42` がアラートとして表示されます。

このドキュメントの意図はAngularJSの完全なAPIの解説をすることを意図しているわけではないので、ディレクティブの説明はこの辺りでやめておきます。

### フィルタ

AngularJSのフィルタはデータをフォーマットするために必要なロジックをカプセル化する責務を負っています。普通、フィルタはパーシャルの中で利用されますが、コントローラやディレクティブ、 *サービス* 、また依存性の注入を用いて他のフィルタの中で利用することも可能です。

与えられた文字列を全て大文字にするサンプルフィルタの定義です。

```JavaScript
myModule.filter('uppercase', function () {
  return function (str) {
    return (str || '').toUpperCase();
  };
});
```

パーシャルの中ではUnixのパイプ記法でこのフィルタを使うことができます:

```HTML
<div>{{ name | uppercase }}</div>
```

コントローラの中では次のように利用します:

```JavaScript
function MyCtrl(uppercaseFilter) {
  $scope.name = uppercaseFilter('foo'); //FOO
}
```

### サービス

上述のコンポーネントに属さない全てのロジックはサービスに格納されるべきです。普通、サービスは問題領域(ドメイン)固有のロジックや、永続化に関わるロジック、XHR、ウェブソケットなどをカプセル化します。アプリケーションの中のコントローラが "肥大化" した際には、何度も利用されるコードをサービスに移し替えるべきです。

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

サービスは依存性の注入を扱えるどのコンポーネント（コントローラ、多のサービス、フィルター、ディレクティブ）にも注入できます。

```JavaScript
function MyCtrl(developer) {
  var developer = new Developer();
  developer.live();
}
```

## AngularJSのパターン

次の２つのセクションで、伝統的なデザインとアーキテクチャのパターンがAngularJSのコンポーネントの中でどのように構成されているのかを見ていきます。

最後の章ではAngularJSに限らずシングル・ページ・アプリケーションで頻繁に使われるアーキテクチャのパターンについて見ていきます。

### サービス

#### シングルトン

>シングルトン・パターンはクラスのインスンタンスを１つに制限するデザイン・パターンです。システムを通してアクションを調整するオブジェクトが１つで良い場合に役に立ちます。この考え方はしばしばシステムに対して、オブジェクトを１つにして効率的に稼働させることや、オブジェクトの数を一定の数以下にを制限することに一般化されます。

下記のUMLダイアグラムはシングルトンのデザイン・パターンを表しています。

![Singleton](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/singleton.svg "Fig. 1")

依存性がコンポーネントに必要とされる際に、AngularJSは次のアルゴリズムを使って依存性の解決を行っています:

- 依存性の名前で語彙のクロージャの中に定義されているハッシュ・マップを検索します（プライベートにアクセスできるようになっています）。
- 依存性がAngularJSの中に存在する場合は、それを必要としているコンポーネントにパラメタとして渡します。
- 依存性が存在しない場合は:
  - AngularJSはプロバイダのファクトリ・メソッド（ `$get` ）を用いてその依存性をインスタンス化します。 依存性のインスタンス化は必要に応じて、同じアルゴリズムを用いて再帰的に行われます。このプロセスは循環依存を起こします。
  - AngularJSはそのインスタンスを上述のハッシュ・マップにキャッシュします。
  - AngularJSは必要としているコンポーネントにパラメタとしてそのインスタンスを渡します。

`getService` メソッドが実装されている部分のソースコードを見たほうが良いでしょう。

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

サービスは一度しかインスタンス化されないので、全てのサービスをシングルトンと考えることができます。キャッシュはシングルトンのマネージャと考えることができます。上記のUMLダイアグラムと少し違いがあります。コンストラクタ関数の中のシングルトンオブジェクトにスタティックでプライベートな参照を保つ代わりに、シングルトン・マネージャ（上記のコードの中の `cache` ）の中に参照を保ちます。

このように、サービスは実際にはシングルトンですが、シングルトン・パターンを通して実装されているわkではありません。これは、一般的な実装に比べていくつかの利点があります。

- テストをしやすくします。
- シングルトンオブジェクトの生成をコントロールできます（私達のケースでは、IoCコンテナがシングルトンを遅延インスタンス化することでコントロールしています）。

このトピックに関する更に一歩踏み込んだ議論のために、Google Testing blogのMisko Heveryの [記事](http://googletesting.blogspot.com/2008/05/tott-using-dependancy-injection-to.html) を考慮にいれましょう。

#### ファクトリ・メソッド

>ファクトリ・メソッド・パターンは生成のパターンです。生成のパターンは生成するクラス指定のないオブジェクトを生成する際に生じる問題をうまく扱うためにファクトリ・メソッドを利用します。コンストラクタではなく、インターフェイス（抽象クラス）で指定されているファクトリメソッド、実装クラス（具象クラス）に実装されているファクトリメソッド、また、継承される可能性もあるのですが、ベースクラスに実装されているファクトリメソッドを通してオブジェクトが生成される場合に利用されます。

![Factory Method](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/factory-method.svg "Fig. 2")

次のスニペットを考えてみましょう:

```JavaScript
myModule.config(function ($provide) {
  $provide.provider('foo', function () {
    var baz = 42;
    return {
      //ファクトリ・メソッド
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

新しい "プロバイダ" を定義するために、上記のコードで `config` コールバックを利用しています。プロバイダは `$get` メソッドを持っているオブジェクトです。JavaScriptでインターフェイスを持たず、ダックタイプされているので、このようにプロバイダのファクトリ・メソッドを名付ける慣例があります。

サービス、フィルタ、ディレクティブ、コントローラはそれぞれコンポーネントのインスタンスを生成する責務を負うプロバイダ（ `$get` を持つオブジェクト）を持ちます。

AngularJSの実装をもう少し深く探っていくことが出います:

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
    // これは配列でなければいけないことを意味しています
    fn = fn[length];
  }

  return fn.apply(self, args);
}
```

上記の例から、 `$get` メソッドが実際に利用されていることを知ることができます:

```JavaScript
instanceInjector.invoke(provider.$get, provider, undefined, servicename)
```

上記のスニペットは `instanceInjector` の `invoke` メソッドを最初の引数にサービスのファクトリ・メソッド（ `$get` ）を指定して呼んでいます。 `invoke`メソッドの中では、最初の引数にファクトリメソッドを指定して `annotate` が呼ばれています。アノテートはAngularJSの依存性の注入メカニズムを通して全ての依存性を解決します。全ての依存性の解決ができた時、ファクトリ・メソッドが呼ばれます: `fn.apply(self, args)` 。

上記のUMLダイアグラムの観点から考えると、プロバイダを "ConcreteCreator" と呼ぶことができます。そして、実際のコンポーネントは作られた "Product" となります。

ファクトリ・メソッドの間接性にファクトリ・メソッドを使ういくつかの利点があります。この方法で、フレームワークは新しいコンポーネントを生成する際の基本的な中身に注意を払うことができます:

- コンポーネントがインスタンス化される最も適切なタイミング
- コンポーネントに必要とされるすべての依存性の解決
- コンポーネントが持つことを許されているインスタンスの数（サービスとフィルタは１つ。コントローラは複数）

#### Decorator

>The decorator pattern (also known as Wrapper, an alternative naming shared with the Adapter pattern) is a design pattern that allows behavior to be added to an individual object, either statically or dynamically, without affecting the behavior of other objects from the same class.

![Decorator](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/decorator.svg "Fig. 4")

AngularJS provides out-of-the-box way for extending and/or enhancing the functionality of already existing services. Using the method `decorator` of `$provide` you can create "wrapper" of any service you have previously defined or used by a third-party:

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
The example above defines new service called `foo`. In the `config` callback is called the method `$provide.decorator` with first argument `"foo"`, which is the name of the service, we want to decorate and second argument factory function, which implements the actual decoration. `$delegate` keeps reference to the original service `foo`. Using the dependency injection mechanism of AngularJS, reference to this local dependency is passed as first argument of the constructor function.
We decorate the service by overriding its method `bar`. The actual decoration is simply extending `bar` by invoking one more `console.log statement` - `console.log('Decorated');` and after that call the original `bar` method with the appropriate context.

Using this pattern is especially useful when we need to modify the functionality of third party services. In cases when multiple similar decorations are required (like performance measurement of multiple methods, authorization, logging, etc.), we may have a lot of duplications and violate the DRY principle. In such cases it is useful to use [aspect-oriented programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming). The only AOP framework for AngularJS I'm aware of could be found at [github.com/mgechev/angular-aop](https://github.com/mgechev/angular-aop).

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

### Others

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

## References

1. [Wikipedia](https://en.wikipedia.org/wiki). The source of all brief descriptions of the design patterns is wikipedia.
2. [AngularJS' documentation](https://docs.angularjs.org)
3. [AngularJS' git repository](https://github.com/angular/angular.js)
4. [Page Controller](http://msdn.microsoft.com/en-us/library/ff649595.aspx)
5. [Patterns of Enterprise Application Architecture (P of EAA)](http://martinfowler.com/books/eaa.html)
6. [Using Dependancy Injection to Avoid Singletons](http://googletesting.blogspot.com/2008/05/tott-using-dependancy-injection-to.html)
7. [Why would one use the Publish/Subscribe pattern (in JS/jQuery)?](https://stackoverflow.com/questions/13512949/why-would-one-use-the-publish-subscribe-pattern-in-js-jquery)
