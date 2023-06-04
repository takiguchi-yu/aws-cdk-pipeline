#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { AwsCdkPipelineStack } from '../lib/stack/aws-cdk-pipeline-stack';
import { devParameter, devPipelineParameter } from '../parameter';

const app = new cdk.App();

// 開発環境
if (devPipelineParameter.env.account == '887277492962') {
  new AwsCdkPipelineStack(app, 'AwsCdkPipelineStack', {
    env: {
      account: devPipelineParameter.env.account,
      region: devPipelineParameter.env.region,
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
}
