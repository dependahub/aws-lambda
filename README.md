# aws-lambda

AWS Lambda 操作モジュール

## Example

```javascript
import {lambda} from '@dependahub/aws-lambda';

// 初期設定 - profile と region を指定できます。
lambda.configure({
  profile: 'my-profile',
  region: 'ap-northeast-1',
});

// Invoke - レスポンスが必要な場合（同期実行）
const response = await lambda.post('functionName', payload);

// Invoke - レスポンスが必要無い場合（非同期実行）
await lambda.push('functionName', payload);
```
