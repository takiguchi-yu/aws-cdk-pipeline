import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AwsCdkPipelineStack } from '../lib/stack/aws-cdk-pipeline-stack';
import { devParameter, devPipelineParameter } from '../parameter';

test('Snapshot test for Pipeline Stack', () => {
  const app = new cdk.App();
  const stack = new AwsCdkPipelineStack(app, 'AwsCdkPipelineStack', {
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

  expect(Template.fromStack(stack)).toMatchSnapshot();
});
