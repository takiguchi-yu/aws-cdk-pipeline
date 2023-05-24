import * as cdk from 'aws-cdk-lib';
import { pipelines, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, CodeBuildStep } from 'aws-cdk-lib/pipelines';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import {
  AllowedMethods,
  Distribution,
  OriginAccessIdentity,
  PriceClass,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { AppParameter } from '../../parameter';
import { AwsCdkPipelineStage } from '../stage/aws-cdk-pipeline-stage';

export interface AwsCdkPipelineStackProps extends cdk.StackProps {
  targetParameters: AppParameter[];
  sourceRepository: string;
  sourceBranch: string;
  sourceConnectionArn: string;
}

export class AwsCdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsCdkPipelineStackProps) {
    super(scope, id, props);

    // // APIドキュメント用S3バケット
    // const apiDocumentBucket = new Bucket(this, 'ApiDocumentBucket', {
    //   bucketName: 'takiguchi-no-api-document-bucket',
    //   publicReadAccess: false,
    //   blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    //   removalPolicy: RemovalPolicy.DESTROY,
    //   autoDeleteObjects: true,
    // });

    // // S3を参照するためのCloudfrontディストリビューション
    // const cloudfrontOAI = new OriginAccessIdentity(this, 'Cloudfront-OAI');
    // apiDocumentBucket.grantRead(cloudfrontOAI);

    // const distribution = new Distribution(this, 'Distribution', {
    //   defaultRootObject: 'index.html',
    //   priceClass: PriceClass.PRICE_CLASS_200,
    //   minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
    //   defaultBehavior: {
    //     origin: new S3Origin(apiDocumentBucket, { originAccessIdentity: cloudfrontOAI }),
    //     compress: true,
    //     allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
    //     viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //   },
    // });
    // new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection(props.sourceRepository, props.sourceBranch, {
          connectionArn: props.sourceConnectionArn,
        }),
        installCommands: ['n stable', 'node --version', 'npm i -g npm', 'npm --version'],
        commands: [
          'npm ci --workspaces',
          'cd cdk',
          'npx cdk synth --app "npx ts-node --prefer-ts-exts bin/aws-cdk-pipeline.ts"',
        ],
        primaryOutputDirectory: './cdk/cdk.out',
      }),
    });

    props.targetParameters.forEach((params) => {
      pipeline.addStage(new AwsCdkPipelineStage(this, 'Dev', params));
    });

    // const pipeline = new CodePipeline(this, 'APIDocumentPipeline', {
    //   pipelineName: 'APIDocumentPipeline',
    //   synth: new CodeBuildStep('Synth', {
    //     input: CodePipelineSource.connection('takiguchi-yu/aws-cdk-pipeline', 'main', {
    //       connectionArn:
    //         'arn:aws:codestar-connections:ap-northeast-1:887277492962:connection/a6c5beb2-34a4-4224-99a9-0332ee4a054c',
    //     }),
    //     installCommands: ['npm install -g aws-cdk'],
    //     commands: ['cd cdk', 'npm ci', 'npm run build', 'npx cdk synth --all'],
    //   }),
    // });
    // ステージを追加
    // const deployStage = pipeline.addStage(new MyPipelineAppStage(this, "Deploy", {}))
  }
}
