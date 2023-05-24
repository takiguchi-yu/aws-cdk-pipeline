#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCdkPipelineStack } from '../lib/stack/aws-cdk-pipeline-stack';
import { devParameter, devPipelineParameter } from '../parameter';

const app = new cdk.App();

new AwsCdkPipelineStack(app, 'AwsCdkPipelineStack', {
  env: {
    account: devPipelineParameter.env.account || process.env.CDK_DEFAULT_ACCOUNT,
    region: devPipelineParameter.env.region || process.env.CDK_DEFAULT_REGION,
  },
  tags: {
    Repository: 'takiguchi-yu/aws-cdk-pipeline',
    Environment: 'development',
  },
  targetParameters: [devParameter],
  sourceRepository: devPipelineParameter.sourceRepository,
  sourceBranch: devPipelineParameter.sourceBranch,
  sourceConnectionArn: devPipelineParameter.sourceConnectionArn,
});
