# CDK パイプラインを使用した継続的インテグレーションと継続的デリバリー (CI/CD)

下記サイトを参考に CDK Pipeline を構築する。

https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html

## AWS 環境をブートストラップする

`--cloudformation-execution-policies` は、将来の CDK Pipelines デプロイメントが実行されるポリシーの ARN を指定します。デフォルトの AdministratorAccessポリシーにより、パイプラインがあらゆる種類の AWS リソースをデプロイできるようになります。

```bash
npx cdk bootstrap aws://ACCOUNT-NUMBER/REGION --profile ADMIN-PROFILE \
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
```

## プロジェクトの初期化

```bash
git clone GITHUB-CLONE-URL my-pipeline
cd my-pipeline
cdk init app --language typescript
```

## パイプラインを定義する

```bash

```
