#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { AwsCdkPipelineStack } from '../lib/stack/aws-cdk-pipeline-stack';
import { devParameter, devPipelineParameter } from '../parameter';

const app = new cdk.App();

// 開発環境
if (process.env.CDK_DEFAULT_ACCOUNT == '887277492962') {
  new AwsCdkPipelineStack(app, 'AwsCdkPipelineStack', {
    env: {
      account: devPipelineParameter.env.account || process.env.CDK_DEFAULT_ACCOUNT,
      region: devPipelineParameter.env.region || process.env.CDK_DEFAULT_REGION,
    },
    tags: {
      Repository: devPipelineParameter.sourceRepository,
      Environment: devParameter.envName,
    },
    targetParameters: [devParameter],
    sourceRepository: devPipelineParameter.sourceRepository,
    sourceBranch: devPipelineParameter.sourceBranch,
    sourceConnectionArn: devPipelineParameter.sourceConnectionArn,
  });
} else {
  console.log('環境変数[CDK_DEFAULT_ACCOUNT]が設定されていません');
}
