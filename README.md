# aws-lambda

AWS Lambda 操作モジュール

## 概要

`@dependahub/aws-lambda` は AWS Lambda 関数を簡単に操作するためのモジュールです。このモジュールを使用することで、Lambda 関数の同期実行および非同期実行を簡単に行うことができます。

## インストール

```bash
npm install @dependahub/aws-lambda
```

## 使用方法

### 初期設定

初期状態ではAWS SDKの動作に基づいたローカル認証設定が適用されています。  
AWS プロファイル名やリージョンを指定してLambdaClientを初期化できます。

```javascript
import {lambda} from '@dependahub/aws-lambda';

lambda.configure({
  profile: 'my-profile', // (Optional) AWSプロファイル名を指定できます
  region: 'ap-northeast-1', // (Optional) AWSリージョンを指定できます
});
```

### Lambda 関数の呼び出し

#### 同期実行

レスポンスが必要な場合は `post` メソッドを使用します。  
返り値がJSON形式の場合は自動で JSON.parse() されます。

```javascript
const response = await lambda.post('functionName', {
  key1: value1,
  key2: value2,
  ...
});
console.log(response);
```

#### 非同期実行

レスポンスが不要な場合は `push` メソッドを使用します。

```javascript
await lambda.push('functionName', {
  key1: value1,
  key2: value2,
  ...
});
```

## ライセンス

このプロジェクトは [MIT ライセンス](./LICENSE) のもとで公開されています。
