import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CodePipeline, CodePipelineSource, CodeBuildStep} from 'aws-cdk-lib/pipelines'
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import { MyPipelineAppStage } from './aws-cdk-pipeline-lambda-stage';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { AllowedMethods, Distribution, OriginAccessIdentity, PriceClass, SecurityPolicyProtocol, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CfnOutput } from 'aws-cdk-lib';

export class AwsCdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

		// APIドキュメントのためのS3バケットを作成
		const apiDocumentBucket = new Bucket(this, 'ApiDocumentBucket', {
			bucketName: 'api-document-bucket',
			publicReadAccess: false,
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL
		})

		// S3を参照するためのCloudfrontを作成
		const cloudfrontOAI = new OriginAccessIdentity(this, 'Cloudfront-OAI');
    apiDocumentBucket.grantRead(cloudfrontOAI);

		const distribution = new Distribution(this, 'Distribution', {
			defaultRootObject: 'index.html',
			priceClass: PriceClass.PRICE_CLASS_200,
			minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
			defaultBehavior: {
				origin: new S3Origin(apiDocumentBucket, { originAccessIdentity: cloudfrontOAI}),
				compress: true,
				allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
			}
		})
		new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

		// Codepipelineを作成
    const pipeline = new codepipeline.Pipeline(this, 'APIDocumentPipeline', {
      pipelineName: 'APIDocumentPipeline',
    });

		const sourceOutput = new codepipeline.Artifact('SourceOutput');
		const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
			actionName: 'Github',
			owner: 'takiguchi-yu',
			repo: 'aws-cdk-pipeline',
			branch: 'main',
			output: sourceOutput,
			connectionArn: 'arn:aws:codestar-connections:ap-northeast-1:887277492962:connection/a6c5beb2-34a4-4224-99a9-0332ee4a054c',
		});
    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

		// const pipeline = new CodePipeline(this, "APIDocumentPipeline", {
		// 	pipelineName: "APIDocumentPipeline",
		// 	synth: new CodeBuildStep("Synth", {
		// 		input: CodePipelineSource.connection(
		// 			"takiguchi-yu/aws-cdk-pipeline",
		// 			"main", {
		// 				connectionArn: "arn:aws:codestar-connections:ap-northeast-1:887277492962:connection/a6c5beb2-34a4-4224-99a9-0332ee4a054c"
		// 			}),
		// 		installCommands: ["npm install -g aws-cdk"],
		// 		commands: ["npm ci", "npm run build", "npx cdk synth"],
		// 	})
		// });

    // // ステージを追加
    // const testingStage = pipeline.addStage(new MyPipelineAppStage(this, "Deploy", {}))
  }
}
