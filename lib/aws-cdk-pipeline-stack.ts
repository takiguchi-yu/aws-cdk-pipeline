import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CodePipeline, CodePipelineSource, ShellStep, CodeBuildStep, ManualApprovalStep} from 'aws-cdk-lib/pipelines'
import { BlogPipelineStage } from './aws-cdk-pipeline-stage';
import { MyPipelineAppStage } from './aws-cdk-pipeline-lambda-stage';
import { ManualApprovalAction } from 'aws-cdk-lib/aws-codepipeline-actions';

export class AwsCdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // パイプラインに Source ステージと Build ステージ、Update Pipeline ステージを作成
		const pipeline = new CodePipeline(this, "BlogPipeline", {
			pipelineName: "BlogPipeline",
			synth: new CodeBuildStep("Synth", {
				input: CodePipelineSource.connection(
					"takiguchi-yu/aws-cdk-pipeline",
					"main", {
						connectionArn: "arn:aws:codestar-connections:ap-northeast-1:887277492962:connection/a6c5beb2-34a4-4224-99a9-0332ee4a054c"
					}),
				installCommands: ["npm install -g aws-cdk"],
				commands: ["npm ci", "npm run build", "npx cdk synth"]
			})
		});

    // ステージを追加
    const testingStage = pipeline.addStage(new MyPipelineAppStage(this, "test", {}))
    testingStage.addPost(new ManualApprovalStep('approval'))
  }
}
