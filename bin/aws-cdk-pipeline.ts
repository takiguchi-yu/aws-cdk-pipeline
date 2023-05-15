#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCdkPipelineStack } from '../lib/aws-cdk-pipeline-stack';

const app = new cdk.App();
new AwsCdkPipelineStack(app, 'AwsCdkPipelineStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
