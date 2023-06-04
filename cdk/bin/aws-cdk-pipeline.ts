#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { AwsCdkPipelineStack } from '../lib/stack/aws-cdk-pipeline-stack';
import { devPipelineParameter } from '../parameter';

const app = new cdk.App();

// 開発環境
if (devPipelineParameter.env.account == '887277492962') {
  new AwsCdkPipelineStack(app, 'AwsCdkPipelineStack', {
    env: devPipelineParameter.env,
    tags: {
      Repository: devPipelineParameter.sourceRepository,
      Environment: devPipelineParameter.envName,
    },
    appParameter: devPipelineParameter,
  });
}
