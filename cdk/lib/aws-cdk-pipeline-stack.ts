import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CodePipeline, CodePipelineSource, CodeBuildStep} from 'aws-cdk-lib/pipelines'

export class AwsCdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

		// Codepipelineを作成
		const pipeline = new CodePipeline(this, "APIDocumentPipeline", {
			pipelineName: "APIDocumentPipeline",
			synth: new CodeBuildStep("Synth", {
				input: CodePipelineSource.connection(
					"takiguchi-yu/aws-cdk-pipeline",
					"main", {
						connectionArn: "arn:aws:codestar-connections:ap-northeast-1:887277492962:connection/a6c5beb2-34a4-4224-99a9-0332ee4a054c"
					}),
				installCommands: ["npm install -g aws-cdk"],
				commands: ["npm ci", "npm run build", "npx cdk synth"],
			})
		});
    // ステージを追加
    // const deployStage = pipeline.addStage(new MyPipelineAppStage(this, "Deploy", {}))
  }
}
