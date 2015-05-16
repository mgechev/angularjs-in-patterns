# AngularJS in Patterns

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
* [AngularJSのパターン](#AngularJSのパターン)
  * [サービス](#サービス-1)
    * [シングルトン](#シングルトン)
    * [ファクトリ・メソッド](#ファクトリメソッド)
    * [デコレータ](#デコレータ)
    * [ファサード](#ファサード)
    * [プロキシ](#プロキシ)
    * [アクティブ・レコード](#アクティブレコード)
    * [傍受フィルタ](#傍受フィルタ)
  * [ディレクティブ](#ディレクティブ-1)
    * [コンポジット](#コンポジット)
  * [インタープリタ](#インタープリタ)
    * [テンプレート・ビュー](#テンプレートビュー)
  * [スコープ](#スコープ-1)
    * [オブザーバ](#オブザーバ)
    * [チェーン・オブ・レスポンシビリティ](#チェーンオブレスポンシビリティ)
    * [コマンド](#コマンド)
  * [コントローラ](#コントローラ-1)
    * [ページ・コントローラ](#ページコントローラ)
  * [その他](#その他)
    * [モジュール・パターン](#モジュールパターン)
    * [データ・マッパ](#データマッパ)
    * [外部サービスとしてのオブザーバパターン](#外部サービスとしてのオブザーバパターン)
* [References](#references)

<!--endtoc-->

## 要旨

新しいことを学ぶ際のもっともよい方法の１つとして、既に知っているものがそこでどのように使われているかを観察するという方法があります。
このドキュメントは読者にデザインやアーキテクチャのパターンに親しんでもらおうとして書かれているものではありませんので、オブジェクト指向やデザイン・パターン、アーキテクチャ・パターンについての基本的な理解をしておくことをおすすめします。
このドキュメントの目的は、AngularJSやAngularJSのシングル・ページ・アプリケーションにどれだけ様々なソフトウェア・デザインやアーキテクチャのパターンが採用されているかを述べることです。

## Translations

- [Main](https://mgechev.github.io/angularjs-in-patterns/)
- [Russian Translation](http://habrahabr.ru/post/250149/)

## はじめに

このドキュメントはAngularJSの概要を簡単に見ていくところから始まります。「AngularJSの概要」ではAngularJSの主なコンポーネントとして、ディレクティブ、フィルタ、コントローラ、サービス、スコープを見ていきます。２番目のセクションでは、フレームワークの内部で利用されているそれぞれのデザインとアーキテクチャのパターンを解説していきます。いくつかのコンポーネントで利用されているパターンがあった場合は、言及していきます。

最後のセクションでは、AngularJSで構築されているシングル・ページ・アプリケーションでよく使われているいくつかのアーキテクチャ・パターンを解説します。

## AngularJSの概要

AngularJSはCRUDなシングル・ページ・アプリケーション（SPA）開発の基盤を提供する目的で作られたGoogle製のJavascriptフレームワークです。

SPAとは一度ロードされたら以後ページの全要素を再読込する必要なく、ユーザの操作を受け付けるウェブ・アプリケーションです。これはデータ、テンプレート、スクリプト、スタイルなど全てのリソースを最初のリクエスト時に、または、それが必要になった時にロードすることです。ほとんどすべてのCRUDなアプリケーションは共通の特性と要求を持っているので、AngularJSはそれらのアプリケーションが必要とするものをまとめてすぐに使える最高のツール・セットを提供しようとしています。AngularJSの重要な特徴は下記のとおりです:

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

これらのコンポーネントはそれぞれのモジュールの中でグループ化することができるので、高度な抽象化や、複雑な処理の扱いもしやすくなっています。それぞれのコンポーネントはアプリケーションの必要なロジックを隠蔽します。

### パーシャル

パーシャルはHTMLの文字列です。パーシャルはエレメントまたはアトリビュートの中にAngularJSの式を含むことがあります。AngularJSとその他のフレームワークの違いの１つは、AngularJSのテンプレートがHTMLに変換される前の中間的なフォーマット（例えば、mustache.jsやhandlebarsのようなもの）ではないということです。

SPAは最初に `index.html` ファイルを読み込みます。AngularJSの場合、このファイルに標準のHTMLアトリビュート、エレメント、コメントに加えカスタムのものも含みます。この段階で、アプリケーションの設定と準備をします。これに続くユーザのアクションは、例えば、フレームワークによって提供されるデータ・バインディングを通すなどして、アプリケーションの他のパーシャルの読み込みや、状態の変更のみで対応します。

**パーシャルのサンプル**

```HTML
<html ng-app>
 <!-- BodyタグはngControllerディレクティブによって機能追加されます  -->
 <body ng-controller="MyController">
   <input ng-model="foo" value="bar">
   <!-- ng-clickディレクティブ付きのButtonタグと
          "{{ }}"マークアップで囲われた 'buttonText'
          式です -->
   <button ng-click="changeFoo()">{{buttonText}}</button>
   <script src="angular.js"></script>
 </body>
</html>
```

AngularJSの式でパーシャルはユーザとの対話の中でどのアクションを実行すべきかを定義します。上記の例では、 `ng-click` 属性の値は、現在の *scope* の `changeFoo` メソッドが実行されることを意味しています。

### コントローラ

AngularJSのコントローラはユーザとウェブ・アプリケーションとの双方向のやりとり（マウスイベント、キーボードイベントなど）を扱うJavaScriptの関数です。 *scope* に、メソッドを追加することで実現します。コントローラに必要なコンポーネントはAngularJSの依存性の注入によって提供されます。コントローラはまた *scope* にデータを追加する方法で、パーシャルに *model* を提供する責務を負います。このデータを *view model* と考えることができます。

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

AngularJSではスコープはパーシャルに露出したJavaScriptのオブジェクトです。スコープはプリミティブ、オブジェクト、メソッドなど異なるプロパティを含んでいます。スコープに追加された全てのメソッドはスコープと関連付けられたパーシャルの中でAngularJSの式によって評価され実行されます。また、スコープへの参照を持つコンポーネントから直接呼び出されます。適切な *ディレクティブ* を使うことでスコープに追加されたデータはビューにバインディングされ、パーシャルの中の変更がスコープのプロパティに反映されます。また、プロパティの変更がパーシャルに反映されます。

AngularJSアプリケーションのスコープのもう一つの重要な特性は、それがプロトタイプ・チェーンと結びついていることです（ 明示的に *分離* されたものを除きます）。これにより、子のスコープは親のスコープのメソッドを実行することができます。この場合のメソッドは子のスコープの直接、または間接のプロトタイプのプロパティだからです。

スコープの継承を次の例で説明します:

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

AngularJSでは全てのDOM操作がなされるべき場所です。目安としては、コントローラがDOM操作を含む場合、新しいディレクティブを作るか、必要なDOM操作ができるようにすでにあるディレクティブをリファクタリングするべきでしょう。
全てのディレクティブは名前と関連するロジックを持っています。最もシンプルなケースとしては、ティレクティブはその名前と *postLink* 関数のみを持ちます。 *postLink*　関数が必要なすべてのロジックをカプセル化します。少し複雑なケースでは、下記のようなたくさんのプロパティを持ちます:

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

上記の例では、 `<alert-button></alert-button>` タグはボタン・エレメントに置換えられます。ユーザがボタンをクリックした時に、文字列の `42` がアラートとして表示されます。

このドキュメントはAngularJSの完全なAPIの解説をすることを意図しているわけではないので、ディレクティブの説明はこの辺りでやめておきます。

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

サービスは依存性の注入を扱えるどのコンポーネント（コントローラ、他のサービス、フィルター、ディレクティブ）にも注入できます。

```JavaScript
function MyCtrl(Developer) {
  var developer = new Developer();
  developer.live();
}
```

## AngularJSのパターン

次の２つのセクションで、伝統的なデザインとアーキテクチャのパターンがAngularJSのコンポーネントの中でどのように構成されているのかを見ていきます。

最後の章ではAngularJSに限らずシングル・ページ・アプリケーションで頻繁に使われるアーキテクチャのパターンについて見ていきます。

### サービス

#### シングルトン

>シングルトン・パターンはクラスのインスンタンスを１つに制限するデザイン・パターンです。システムを通してアクションを調整するオブジェクトが１つで良い場合に役に立ちます。この考え方はしばしばシステムに対して、オブジェクトを１つにして効率的に稼働させることや、オブジェクトの数を一定の数以下にを制限することために適用されます。

下記のUMLダイアグラムはシングルトンのデザイン・パターンを表しています。

![Singleton](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/singleton.svg "Fig. 1")

コンポーネントが依存性を必要とする際、AngularJSは次のアルゴリズムを使って依存性の解決を行っています:

- 依存性の名前でクロージャの中に定義されているハッシュ・マップを検索します（プライベートにアクセスできるようになっています）。
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

サービスは一度しかインスタンス化されないので、全てのサービスをシングルトンと考えることができます。キャッシュはシングルトンのマネージャと考えることができます。上記のUMLダイアグラムと少し違いがあります。コンストラクタ関数の中のシングルトン・オブジェクトに静的でプライベートな参照を保つ代わりに、シングルトン・マネージャ（上記のコードの中の `cache` ）の中に参照を保ちます。

このように、サービスは実際にはシングルトンですが、シングルトン・パターンを通して実装されているわけではありません。これは、一般的な実装に比べていくつかの利点があります。

- テストをしやすくします。
- シングルトン・オブジェクトの生成をコントロールできます（私達のケースでは、IoCコンテナがコントロールしています。IoCコンテナがシングルトンを遅延インスタンス化しています）。

このトピックに関する更に一歩踏み込んだ議論のために、Google Testing blogのMisko Heveryの [記事](http://googletesting.blogspot.com/2008/05/tott-using-dependancy-injection-to.html) は考慮に値するでしょう。

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

新しい "プロバイダ" を定義するために、上記のコードで `config` コールバックを利用しています。プロバイダは `$get` メソッドを持っているオブジェクトです。JavaScriptはインターフェイスを持たず、ダックタイプなので、このようにプロバイダのファクトリ・メソッドを名付ける慣例があります。

サービス、フィルタ、ディレクティブ、コントローラはそれぞれコンポーネントのインスタンスを生成する責務を負うプロバイダ（ `$get` を持つオブジェクト）を持ちます。

AngularJSの実装をもう少し深く探っていくことができます:

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

#### デコレータ

>デコレータ・パターン（アダプタ・パターンの別名でもあるラッパーとしても知られています。）は個別のオブジェクトに静的であっても動的であっても同じクラスの他のオブジェクトに影響をあたえることなく振る舞いを追加するデザイン・パターンです。

![Decorator](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/decorator.svg "Fig. 4")

AngularJSは既に存在するサービスの機能を追加したり、強化するための簡単な方法を提供しています。 `$provide` の `decorator` メソッドを使うことによりカスタムのサービスやサード・パーティで使われているサービスに "ラッパー" を作ることができます:

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

上記の例では `foo` という名の新しいサービスを定義しています。 `config` のコールバックは、最初の引数をデコレートしたいサービス名である `foo` として `$provide.decorator` を呼び出しています。２番目の引数は実際のデコレーションを実装しているファクトリ関数です。 `$delegate` はオリジナルサービス `foo` への参照を持っています。AngularJSの依存性の注入メカニズムを使うことにより、ローカルな依存性への参照はコンストラクタ関数の最初の引数として渡されます。
`bar` メソッドを上書きすることによってサービスをデコレートします。実際のデコレーションは単に `bar` でもう一つの `console.log ステートメント` - `console.log('Decorated');` を実行するように拡張することです。その後、オリジナルの 'bar' メソッドを適切な文脈で利用します。

サード・パーティの機能を変更する必要がある場合特にこのパターンは役に立ちます。複数の似たようなデコレーションが必要となった時（複数のメソッドのパフォーマンス計測、認証、ログ出力など）、複製がたくさんでき、DRYの原則を破ってしまいます。そのような場合には[アスペクト指向プログラミング（AOP）](http://en.wikipedia.org/wiki/Aspect-oriented_programming)を取り入れるとよいでしょう。AngularJSで利用できるAOPフレームワークとしては、分かる範囲では唯一、　[github.com/mgechev/angular-aop](https://github.com/mgechev/angular-aop) があります。

#### ファサード

>ファサードはクラス・ライブラリのような多くのコードにシンプルなインターフェイスを提供するオブジェクトです。ファサードは次のことができます:

>1. ソフトウェア・ライブラリを理解しやすく、使いやすくします。またテストをしやすくします。ファサードはよく使われるタスクを実行するための使いやすいメソッドを持つからです;

>2. 同じ理由から、ライブラリを読みやすくします。

>3. 外部のコードのライブラリの処理に対する依存性を減らします。ほとんどのコードはファサードを使うことでシステム開発の際の柔軟性を許容します。

>4. うまくデザインされていないAPI群を、（タスクが必要とする単位で）よくデザインされたAPIとしてラップします。

![Facade](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/facade.svg "Fig. 11")

AngularJSにはいくつかのファサードがあります。高レベルのAPIを提供された機能に追加したいとき、実際にファサードを作ることになります。

例えば、 `XMLHttpRequest` のPOSTリクエストをどのように作るか見て行きましょう:

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

しかし、このデータをポストしたいとき、AngularJSの `$http` サービスを使うことができます:

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

また、このように書いても同じです:

```JavaScript
$http.post('/someUrl', data)
.then(function (response) {
  alert(response);
});
```

２番目の例は、与えられたURLでHTTP POSTリクエストを作る様に設定されたバージョンです。

更に高レベルの抽象化は `$http` サービスをもとに構築された `$resource` で行うことができます。このサービスに関しては、 [アクティブ・レコード](#アクティブ・レコード) と [プロキシ](#プロキシ) のところでもう少し深く見ていきます。

#### プロキシ

>プロキシの最も一般的な形は、何か別のものに対するインターフェイスとしての振る舞うクラスの働きです。プロキシは、通信接続、メモリ上の大きなオブジェクト、ファイル、複製するのが不可能だったりコストが掛かり過ぎるその他のリソースなどいろいろなもののインターフェイスになることができます。

![Proxy](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/proxy.svg "Fig. 9")

プロキシは3つの種類に分けることができます:

- バーチャル・プロキシ
- リモート・プロキシ
- プロテクション・プロキシ

この副章では、AngularJSのバーチャル・プロキシの実装を見ていきます。

下記のスニペットでは、 `User` という名の `$resource` インスタンスの `get` メソッドを呼んでいます:

```JavaScript
var User = $resource('/users/:id'),
    user = User.get({ id: 42 });
console.log(user); //{}
```

`console.log` は空のオブジェクトを出力します。 AJAXリクエストは、 `User.get` が呼ばれた時点で非同期で処理されていて、 `console.log` が呼ばれた時点ではまだ実際のユーザが準備されていないのです。 `User.get` はGETリクエストをし、空のオブジェクトを返しますが、参照は持ち続けています。このオブジェクトをバーチャル・プロキシ（単に、プレースホルダーとも）考えることができます。クライアントがサーバからレスポンスを受け取ると実際のデータが格納されます。

これはAngularJSでどのように使われるのでしょうか？ 次のスニペットを考えてみましょう:

```JavaScript
function MainCtrl($scope, $resource) {
  var User = $resource('/users/:id'),
  $scope.user = User.get({ id: 42 });
}
```

```html
<span ng-bind="user.name"></span>
```

上記のスニペットが実行された直後、 `$scope` の `user` プロパティは空のオブジェクト（ `{}` ）になります。 `user.name` はundefinedとなり何もレンダリングされません。内部ではAngularJSはこの空のオブジェクトに参照を保っています。サーバがGETリクエストのレスポンスを返すと、AngularJSはサーバから受け取ったデータをオブジェクトに格納します。次の `$digest` ループでAngularJSは `$scope.user` の変更を検知し、ビューの更新に移ります。

#### アクティブ・レコード

>アクティブ・レコードはデータと振る舞いを持つオブジェクトです。普通、アクティブ・レコード内のほとんどのデータは永続的です。アクティブ・レコード・オブジェクトの責務はデータの生成、更新、取得、削除をするためのデータベースとのやりとりを適切に行うことです。この責務を更に低レベルのオブジェクトに委譲することはありますが、アクティブ・レコード・オブジェクトのインスタンスや静的メソッドの呼び出しはデータベースとのやりとりをもたらします。

![Active Record](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/active-record.svg "Fig. 7")

AngularJSは `$resource` と呼ばれるサービスを定義しています。 AngularJS(1.2+)ではAngularJSのコアの外部モジュールとして配布されています。

AngularJSのドキュメントによると `$resource` は:

>RESTFullサーバ・サイド・データ構造とやりとりするためのリソース・オブジェクトを生成するファクトリ。
> 返却されたリソース・オブジェクトは低レベルの$httpサービスを直接操作する必要なく、高レベルの振る舞いを提供するアクションを持っています。

`$resource` がどのように使われているかしめします:

```JavaScript
var User = $resource('/users/:id'),
    user = new User({
      name: 'foo',
      age : 42
    });

user.$save();
```

`$resource` の呼び出しはモデルインスタンスのコンストラクタ関数を生成します。それぞれのモデルインスタンスはCRUDオペレーションに応じたメソッドを持つことになります。

このように、コンストラクタ関数と静的メソッドを使います:

```JavaScript
User.get({ userid: userid });
```

上記のコードはすぐに空のオブジェクトを返し、それに対して参照を持ち続けます。レスポンスが成功して、パースされるとAngularJSは受け取ったデータをオブジェクトに格納します（参考: [プロキシ](#プロキシ) ）。

`$resource` についての詳細は、 [The magic of $resource](http://blog.mgechev.com/2014/02/05/angularjs-resource-active-record-http/) や [AngularJS' documentation](https://docs.angularjs.org/api/ngResource/service/$resource) で確認できます。

Martin Fowlerがこのように宣言しているように:

> アクティブ・レコード・オブジェクトの責務はデータの生成、更新、取得、削除をするためのデータベースとのやりとりを適切に行うことです。...

`$resource` はデータベースではなくRESTfulサービスとのやりとりをするので、アクティブ・レコード・パターンそのままの実装ではありません。そうは言っても、 "アクティブ・レコードのようなRESTFulコミュニケーション" と考えることができます。

#### 傍受フィルタ

>ウェブページのリクエストの際の共通の事前処理と事後処理タスクを実装するために構成可能なフィルタ・チェーンを作成する

![Composite](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/intercepting-filters.svg "Fig. 3")

HTTPリクエストの際に、事前処理、または、事後処理、またはその両方をしたい時があります。傍受フィルタを使うと、ログ出力、セキュリティまたリクエストのボディやヘッダによって影響を受ける関心事に対応するために、HTTPリクエストやレスポンスに事前・事後プロセスを追加することができます。基本的に傍受フィルタ・パターンはフィルタのチェーンを含みます。それぞれのフィルタは順番通りにデータを処理します。それぞれのフィルタのアウトプットは次のフィルタのインプットになります。

AngularJSでは `$httpProvider` で傍受フィルタの考え方を採用しています。 `$httpProvider` は `interceptors` と呼ばれている配列プロパティを持っています。それぞれのオブジェクトは `リクエスト` , `レスポンス` , `requestError` , `responseError` と呼ばれるプロパティを必要に応じて持ちます。

`requestError` は一つ前のインターセプタがエラーを投げた時や、処理の拒否を行って終了した時に呼び出されるインターセプタです。 `responseError` は、一つ前の　`response` インターセプタがエラーを投げた時に呼び出されます。

これは、インターセプタをオブジェクト・リテラルで利用する例です:

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

### ディレクティブ

#### コンポジット

>コンポジット・パターンは分離をするためのデザイン・パターンです。コンポジット・パターンはオブジェクトのまとまりは１つのオブジェクトのインスタンスとして同じように扱われるべきとしています。コンポジットの意図は、複数のオブジェクトを部分と全体の階層構造を表す3つの構造に "構成する" ということです。

![Composite](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/composite.svg "Fig. 3")

Gang of Fourによると、MVCは次の組み合わせであるに過ぎないということです:

- ストラテジ
- コンポジット
- オブザーバ

これらはビューはコンポーネントのコンポジションであるということを表しています。AngularJSでは状況は似ています。ビューはディレクティブとディレクティブが適用されていることもあるDOM要素のコンポジションです。

次の例を見てみましょう:

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

この例はUIコンポーネントとしてのシンプルなディレクティブを定義しています。定義されたコンポーネント（"zippy"）はヘッダとコンテントを持っています。ヘッダをクリックするとコンテントが見え隠れします。

最初の例から、全てのDOM要素の木構造は要素のコンポジションであると気づきます。ルート・コンポーネントは `html` 要素です。そしてそこに、 `head` や `body` などが続きます。

2番目のJavaScriptの例から、ディレクティブの `template` プロパティは `ng-transclude` ディレクティブが付加されたマークアップを見つけることができます。 `zippy` ディレクティブの中で別のディレクティブである `ng-transclude` を持つことを意味しています。つまり、ディレクティブのコンポジションです。理論上はコンポーネントは末節のノードまで無限にネストすることができます。

### インタープリタ

>コンピュータプログラミングではインタープリタ・パターンはある言語の文をどのように評価するかを決めるデザイン・パターンです。言語に特化したそれぞれのシンボル（オペレータであるかそうでないかは関係なく）に対する分類を持つというのが基本的な考え方です。文のシンタックス・ツリーはコンポジットパターンのインスタンスです。そして、それは分を評価（解釈）する際に使われます。

![Interpreter](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/interpreter.svg "Fig. 6")

`$parse` サービスの背後では、AngularJSは独自のDSL（Domain Specific Language）記法のインタープリタを実装しています。DSLはシンプルに変更されたJavaScriptです。
JavaScript記法とAngularJS機能の主な違いとして、AngularJS記法は:

- UNIX的なパイプ・シンタックスを含んでいること
- エラーを投げないこと
- コントロール・フロー文をもたないこと（オペレータは使えるが、例外、ループ、if文は持たない）
- 所与のコンテクスト内で評価されること（現在の `$scope` のコンテクスト）

`$parse` サービスのの内部では２つの主なコンポーネントが定義されています：

```JavaScript
//与えられた文字列をトークンに変換する責務を追う
var Lexer;
//トークンをパースして式を評価する責務を追う
var Parser;
```

式がトークン化されると、パフォーマンスのために内部にキャッシュされます。

AngularJS DSLではオペレータは下記のように定義されています:

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

それぞれのオペレータに関連付けられた関数を `AbstractExpression` のインターフェイス実装と考えることができます。

それぞれの `Client` は与えられたAngularJSの式を固有のコンテキスト - 固有のスコープで解釈します。

AngularJSのサンプルの式です:

```JavaScript
// toUpperCase フィルタは式の結果に対して適用されます
// (foo) ? bar : baz
(foo) ? bar : baz | toUpperCase
```

#### テンプレート・ビュー

> ページの中にマーカーを埋め込むことにより情報をHTMLにレンダーします。

![Template View](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/template-view.svg "Fig. 8")

動的なページのレンダリングはそんなに簡単なことではありません。たくさんの文字列の連結や操作やいらいらと結びついています。動的なページを構築するとても簡単な方法はマークアップとちょっとした式をページに書き込んでしまうことです。それはコンテキスト内で評価されテンプレートは最終的な形にコンパイルされます。今回そのフォーマットはHTML(DOM)になります。これはまさにテンプレート・エンジンそのものです - 与えられたDSLを適切なコンテキスト内で評価し、最終的な形に変換します。

テンプレートはバックエンド環境ではよく使われています。例えば、Smartyを使ってPHPコードをHTMLに埋め込んで動的なページを作ることができます。RubyではeRubyを使って静的なページにコードを埋め込むことができます。

JavaScriptにはmustache.jsやhandlebarsなどたくさんのテンプレートエンジンがあります。これらのエンジンの殆どは文字列としてテンプレートを操作します。テンプレートは別の場所に静的ファイルとして置いてAJAXで取得します。また、 `script` としてビューやJavaScriptの中に埋め込まれます。

例えばこのように:

```html
<script type="template/mustache">
  <h2>Names</h2>
  {{#names}}
    <strong>{{name}}</strong>
  {{/names}}
</script>
```

テンプレートエンジンはコンテキストの中でコンパイルすることにより文字列をDOM要素に変換します。このように全てのマークアップに埋め込まれている全ての式は評価されそれらの値に変換されます。

例えば、上記のテンプレートを次のオブジェクト・コンテキスト `{ names: ['foo', 'bar', 'baz'] }` の状態で評価するとこのような結果を得ることができます:

```html
<h2>Names</h2>
  <strong>foo</strong>
  <strong>bar</strong>
  <strong>baz</strong>
```

AngularJSのテンプレートは本物のHTMLです。伝統的なテンプレート・エンジンがするような中間フォーマットではありません。

AngularJSコンパイラはDOMツリーを行き来し、既に知っているディレクティブ（要素、アトリビュート、クラス、コメント）を探します。AngularJSがこれらのディレクティブを見つけると、それと関連付けられたロジックを実行します。現在のスコープ・コンテキストの中で別の式を評価することもあります。

例えば:

```html
<ul ng-repeat="name in names">
  <li>{{name}}</li>
</ul>
```

スコープのコンテキストの中は:

```javascript
$scope.names = ['foo', 'bar', 'baz'];
```

これは、上記のものと同じ結果を出力します。ここでの主な違いはテンプレートが `script` にラップされていず、HTMLのままであるということです。

### スコープ

#### オブザーバ

>オブザーバはサブジェクトと呼ばれるオブジェクトが依存しているオブザーバのリストを管理し、変更があったらオブザーバのメソッドを呼び出すことで通知するデザイン・パターンです。主に分散したイベント・ハンドリング・システムで利用されます。

![Observer](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/observer.svg "Fig. 7")

AngularJSアプリケーションのスコープ間では主に２つの基本的なやりとりの方式があります。一つ目は子スコープが親スコープのメソッドを呼び出すことです。子スコープは親スコープをプロトタイプ継承しているのでこれが可能になります（参考: [スコープ](#スコープ) ）。これは子から親への1方向のコミュニケーションです。時に、親スコープから子スコープのメソッドを呼び出したり、子スコープにイベントの通知を送りたい時があります。AngularJSはこれを実現するための組み込みのオブザーバ・パターンを用意しています。オブザーバ・パターンが必要とされる別のケースとして、複数のスコープがあるイベントに関心があるものの、そのイベントは別スコープにあるため気づけないというものがあります。別々のスコープ間の分離が行われているため、別のスコープの変更に気づくことができません。

それぞれのAngularJSのスコープは `$on` 、 `$emit` 、 `$broadcast` と呼ばれるパブリック・メソッドを持っています。 `$on` メソッドは最初の引数として関心のある項目をとり、２つ目の引数としてコールバックをとります。このコールバックを `Observer`  インターフェイスが実装されたオブザーバと考えることができます（JavaScriptでは関数は第一級オブジェクトなので、ただ、 `notify` メソッドを実装すればよいだけです）:

```JavaScript
function ExampleCtrl($scope) {
  $scope.$on('event-name', function handler() {
    //内容
  });
}
```

この方法で、現在のスコープは `event-name` のイベントを登録することができます。 `event-name` が親スコープや子スコープで実行された場合、 `handler` が呼ばれます。

`$emit` メソッドと `$broadcast` メソッドはそれぞれスコープチェーンの上方向と下方向にイベントを伝播します。
例えば:

```JavaScript
function ExampleCtrl($scope) {
  $scope.$emit('event-name', { foo: 'bar' });
}
```

上記のスコープは、 `event-name` を上方向に伝播します。 `event-name` を登録している全ての親スコープは通知を受け、登録されているコールバックが実行されます。

`$broadcast` が呼ばれたときも同様です。違いは、イベントの伝播が下方向（すべての子スコープ）に行くということです。
それぞれのスコープが複数のコールバックを登録することができます（複数のオブザーバと関連することができます）。

JavaScriptコミュニティではこのパターンはパブリッシュ／サブスクライブとして知られています。

ベストプラクティスの一例は [Observer Pattern as an External Service](#observer-pattern-as-an-external-service) を確認して下さい。

#### チェーン・オブ・レスポンシビリティ

>チェーン・オブ・レスポンシビリティ・パターンはコマンド・オブジェクトと続く一連の処理オブジェクトからなるデザイン・パターンです。それぞれの処理オブジェクトは処理が可能なコマンド・オブジェクトを規定するロジックを持っています。残りの部分は次の処理オブジェクトに連鎖的に渡されます。新しい処理オブジェクトを連鎖の末尾に追加するメカニズムも存在しています。

![Chain of Responsibilities](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/chain-of-responsibilities.svg "Fig. 5")

上述のようにAngularJSアプリケーションのスコープはスコープ・チェーンという階層構造を持っています。いくつかのスコープは "分離" しています。 "分離" とは親スコープからプロトタイプ継承していないということを意味しています。しかし、親スコープへは `$parent` プロパティでアクセスできます。

`$emit` や `$broadcast` が呼ばれた時、スコープ・チェーンをイベント・バスとして、またはより正確に責任の連鎖と考えることができます。イベントが起こると、それは（呼ばれたメソッドに応じて）下方向に、または、上方向に伝播します。続くスコープは下記の処理を行います:

- イベントを処理し、次のスコープに渡す
- イベントを処理し、そこで伝播を止める
- イベントを処理せず、次のスコープに渡す
- イベントを処理せず、そこで伝播を止める

下の例では `ChildCtrl` がイベントを発し、スコープ・チェーンの上方向に伝播させるところを確認できます。 親のスコープ( `ParentCtrl` と `MainCtrl` )はコンソールにログを出します: `"foo received"` 。スコープがイベントの終着地点である場合は、イベント・オブジェクトの `stopPropagation` メソッドを呼び出し、コールバックに渡します。

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

上記UMLダイアグラムの別々のハンドラーはそれぞれコントローラに注入された別々のスコープです。

#### コマンド

>オブジェクト指向プログラミングでは、コマンド・パターンは後々メソッドの呼び出しをする際に必要となる情報をカプセル化した振る舞いのデザイン・パターンです。この情報はメソッド名、メソッドやメソッドパラメータとして利用される値を持つオブジェクトを含みます。

![Command](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/command.svg "Fig. 11")

コマンド・パターンのアプリケーションに進む前に、AngularJSではどのようにデータ・バインディングをしているか説明しましょう。

モデルとビューをバインドしたいとき、 `ng-bind` (1方向データ・バインディング)や `ng-model` （双方向データ・バインディング）を使います。例えば、 `foo` モデルの変更をビューに反映させたいとき、このように書くことができます:

```html
<span ng-bind="foo"></span>
```

`foo` が変更される度に、spanのテキストは変わります。もう少し複雑なAngularJSの式を書くこともできます:

```html
<span ng-bind="foo + ' ' + bar | uppercase"></span>
```

このケースでは、spanは大文字化した `foo` と `bar` の組み合わせとなります。裏では何が起こっているのでしょうか？

`$scope` は `$watch` と呼ばれるメソッドを持っています。AngularJSコンパイラが `ng-bind` を見つけると、 `foo + ' ' + bar | uppercase` 式のwatcherを生成します。具体的には、 `$scope.$watch("foo + ' ' + bar | uppercase", function () { /* body */ });` です。式の値が変わる度に、コールバックが呼ばれます。今回のケースではspanを更新します。

これは、 `$watch` の実装の最初の行です:

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

`watcher` オブジェクトをコマンドと考えることができます。コマンドの式は、 [`"$digest"`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest)  ループの度に評価されます.AngularJSが式の変更を検知すると、 `listner` 関数を呼びます。 `watcher` コマンドは式の変更に必要な情報をカプセル化しています。そして、コマンドの実行を `listner` （実際のレシーバ）に委譲します。 `$scope` をコマンドの `Client` 、 `$digest` ループをコマンドの `Invoker` と考えることができます。

### コントローラ

#### ページ・コントローラ

>ウェブサイトの特定のページやアクションのリクエストを扱うオブジェクト。 Martin Fowler

![Page Controller](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/page-controller.svg "Fig. 8")

[4](#references) によると、ページ・コントローラは:

>ページ・コントローラ・パターンはページのリクエストを受け、モデルに対して要求されたアクションを実行します。そして、リクエストされたページのための正しいビューを決定します。ビューと関連するコードはロジックと分離します。

ページ毎にたくさんの似たような振る舞いがある（フッタやヘッダのレンダリング、ユーザ・セッションの扱い）ので、ページコントローラは階層構造を持っています。AngularJSでは責任の制限されたコントローラを持っています。このコントローラは  `$route` や `$state` サービスがあるため、ユーザのリクエストを受け付けません。また、ページのレンダリングは `ng-view` や `ui-view` ディレクティブの責任です。

ページ・コントローラと同じようにAngularJSのコントローラはユーザのインタラクションを扱いますし、モデルを提供して更新します。モデルはスコープに付けられた場合、ビューに露出します。ユーザのアクションによってビューから呼び出されるメソッドは既にスコープに付けられたものです。ページ・コントローラとAngularJSのコントローラのもう一つの類似点は、階層構造です。これはスコープの階層構造に対応しています。このやりかたで、共通のアクションはベース・コントローラに分離することができます。

AngularJSのコントローラはASP.NET WebFormsのコードにとても良く似ています。これらの責任はほぼ重なります。
いくつかのコントローラの階層構造の例です:

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

この例ではベース・コントローラを使ってロジックの再利用をするよくある例を示しています。それはそうとして、プロダクション環境で認証ロジックをコントローラで行うことはおすすめしません。別のルートにアクセスするロジックは抽象化した高レベルのところで決められるべきです。

`ChildCtrl` は `"Click"` ラベルのあるボタンをクリックするアクションを扱い、また、モデルをスコープに取り付けビューに露出させる責任があります。

### その他

#### モジュール・パターン

これは実際にはGang of FourやP of EAAのデザイン・パターンではありません。これはカプセル化と非公開性を目的とした伝統的なJavaScriptのパターンです。

モジュール・パターンを利用することで、JavaScriptの関数スコープにおける非公開性を達成することができます。それぞれのモジュールは関数のローカル・スコープの中に隠されたゼロかプリミティブな番号を持っています。この関数は与えられたモジュールのパブリックAPIを出力するオブジェクトを返します。

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

上記の例は２つのメソッド( `setTitle` と `getTitle` )を持ったオブジェクトを返すIIFE（Immediately-Invoked Function Expression）を持っています。返却されたオブジェクトは、 `Page` 変数に関連付けられています。

このケースでは `Page` オブジェクトのユーザは `title` に直接アクセスするすべを持っていません。 `title` はIIFEのローカルスコープの中に定義されているからです。

モジュール・パターンはAngularJSでサービスを定義する際にとても有益です。このパターンを使うことで、非公開性をシミュレート（事実上達成）することができます:

```javascript
app.factory('foo', function () {

  function privateMember() {
    //内容...
  }

  function publicMember() {
    //内容...
    privateMember();
    //内容
  }

  return {
    publicMember: publicMember
  };
});
```

`foo` を別のコンポーネントに注入すると、パブリック・メソッドだけにアクセスしてプライベートメソッドを呼ぶ必要がありません。この方法は再利用可能なライブラリを作成する際にとても強力な助けになります。

### データ・マッパ

>データ・マッパは永続データ・ストア（リレーショナル・データベースがよく使われる）とイン・メモリ・データ・リプリゼンテーション（ドメイン層）との双方向のやりとりをするためのデータ・アクセス層です。このパターンの目的はイン・メモリ・リプリゼンテーションと永続データ・ストアとマッパそれ自体をそれぞれ独立させることです。

![Data Mapper](https://rawgit.com/mgechev/angularjs-in-patterns/master/images/data-mapper.svg "Fig. 10")

上記の図が示すように、データ・マッパは永続データ・ストアとイン・メモリ・データ・リプレゼンテーションの双方向通信をするために利用されています。普通、AngluarJSアプリケーションでは、サーバ・サイドの言語（Ruby, PHP, Java, JavaScriptなど）で書かれたAPIサーバとやりとりします。

普通、RESTful APIを持っている場合、 `$resource` がアクティブ・レコードのような形でその通信をサポートします。しかし、アプリケーションによってはサーバから返されるデータがフロントエンドで利用するには適切で無いフォーマットで返されることもあります。

例えば、ユーザが次の要素を持つと想定してみてください:

- 名前
- 住所
- 友達リスト

そして、APIが次のメソッドを持つとします:

- `GET /user/:id` - ユーザの名前と住所を返します
- `GET /friends/:id` - ユーザの友達リストを返します

解決策としては２つの別々のサービスを作ることです。恐らくもう少し有効な解決策は、 `User` という１つのサービスがあった場合に、ユーザをリクエストした際に、ユーザの友達リストも一緒に読み込むことです。

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

この方法でSPAの要求に応じてAPIを適用させた仮のデータ・マッパを作ることができます。

`User` サービスはこのように利用することができます:

```javascript
function MainCtrl($scope, User) {
  User.get({ id: 1 })
  .then(function (data) {
    $scope.user = data;
  });
}
```

そして、パーシャルがこちらです:

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

### 外部サービスとしてのオブザーバパターン

##### 概要

下記の例は[こちら](https://github.com/greglbd/angular-observer-pattern)から持ってきたものです。これはオブザーバパターンを実装したサービスを生成するファクトリです。 正しく使われた場合、`$scope.$watch` より効率的で、$emitや$broadcastよりもスコープやオブジェクトに限定して使えるControllerAsメソッドとよく協調して機能します。

##### コントローラの例

イベントのアタッチ、通知、デタッチの例を示します。

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

イベントを削除する別の方法

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

  // コントローラが破棄された時にリスナーを外します
  $scope.$on('$destroy', function handler() {
    ObserverService.detachByEvent('let_me_know')
  });
}
```

## References

1. [Wikipedia](https://en.wikipedia.org/wiki). The source of all brief descriptions of the design patterns is wikipedia.
2. [AngularJS' documentation](https://docs.angularjs.org)
3. [AngularJS' git repository](https://github.com/angular/angular.js)
4. [Page Controller](http://msdn.microsoft.com/en-us/library/ff649595.aspx)
5. [Patterns of Enterprise Application Architecture (P of EAA)](http://martinfowler.com/books/eaa.html)
6. [Using Dependancy Injection to Avoid Singletons](http://googletesting.blogspot.com/2008/05/tott-using-dependancy-injection-to.html)
7. [Why would one use the Publish/Subscribe pattern (in JS/jQuery)?](https://stackoverflow.com/questions/13512949/why-would-one-use-the-publish-subscribe-pattern-in-js-jquery)
