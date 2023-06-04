import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AwsCdkPipelineStack } from '../lib/stack/aws-cdk-pipeline-stack';
import { devPipelineParameter } from '../parameter';

test('Snapshot test for Pipeline Stack', () => {
  const app = new cdk.App();
  const stack = new AwsCdkPipelineStack(app, 'AwsCdkPipelineStack', {
    env: devPipelineParameter.env,
    tags: {
      Repository: devPipelineParameter.sourceRepository,
      Environment: devPipelineParameter.envName,
    },
    appParameter: devPipelineParameter,
  });

  expect(Template.fromStack(stack)).toMatchSnapshot();
});
