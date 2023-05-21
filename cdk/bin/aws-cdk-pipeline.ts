#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCdkPipelineStack } from '../lib/aws-cdk-pipeline-stack';
import { CloudFrontS3Stack } from '../lib/cloudfront-s3-stack';

const app = new cdk.App();

const stackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  description: "OpenAPIをビルドしてデプロイする",
  tags: { Name: 'takiguchi-yu' },
}

// TODO: CloudfrontとS3バケットを作成
new CloudFrontS3Stack(app, 'CloudFrontS3Stack', stackProps)

// TODO: Codepipelineの作成
// TODO: OpenAPI定義をS3にビルド&デプロイ
// TODO: APIGatewayにOpenAPI定義をインポート
// TODO: Lambdaにアプリケーションをビルド&デプロイ
new AwsCdkPipelineStack(app, 'AwsCdkPipelineStack', stackProps);
