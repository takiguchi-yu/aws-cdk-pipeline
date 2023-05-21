# CDK パイプラインを使用した継続的インテグレーションと継続的デリバリー (CI/CD)

下記サイトを参考に CDK Pipeline を構築します。

https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html

## AWS 環境をブートストラップする

`--cloudformation-execution-policies` は、将来の CDK Pipelines デプロイメントが実行されるポリシーの ARN を指定します。デフォルトの AdministratorAccessポリシーにより、パイプラインがあらゆる種類の AWS リソースをデプロイできるようになります。

```bash
cdk bootstrap aws://ACCOUNT-NUMBER/REGION --profile ADMIN-PROFILE \
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
```

cdk bootstrap --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess --profile myaws-cli

## プロジェクトの初期化

```bash
git clone GITHUB-CLONE-URL my-pipeline
cd my-pipeline
cdk init app --language typescript
```

## パイプラインを定義する

Github には CodeStar Connection を使って接続します。

```js
// lib/aws-cdk-pipeline-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CodePipeline, CodePipelineSource, ShellStep, CodeBuildStep} from 'aws-cdk-lib/pipelines'

export class AwsCdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

		const pipeline = new CodePipeline(this, "BlogPipeline", {
			pipelineName: "BlogPipeline",
			synth: new CodeBuildStep("SynthStep", {
				input: CodePipelineSource.connection(
					"takiguchi-yu/aws-cdk-pipeline",
					"main", {
						connectionArn: "arn:aws:codestar-connections:ap-northeast-1:887277492962:connection/a6c5beb2-34a4-4224-99a9-0332ee4a054c"
					}),
				installCommands: ["npm install -g aws-cdk"],
				commands: ["npm ci", "npm run build", "npx cdk synth"]
			})
		});
  }
}
```

## ドキュメント生成

[widdershins](https://github.com/Mermade/widdershins)

```bash
widdershins --search false --language_tabs 'javascript:JavaScript' 'python:Python' 'java:Java' --summary ./api/openapi.yaml -o ./slate/source/index.html.md
```

### redoc 

```bash
npm install -g @redocly/cli
redocly build-docs api/spec/openapi.yaml --output api/spec/build/index.html --title "Page Title"
```

