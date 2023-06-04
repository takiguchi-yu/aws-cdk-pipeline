import * as cdk from 'aws-cdk-lib';
import { pipelines } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PipelineParameter } from 'parameter';
import { AwsCdkPipelineStage } from '../stage/aws-cdk-pipeline-stage';

export interface AwsCdkPipelineStackProps extends cdk.StackProps {
  appParameter: PipelineParameter;
}

export class AwsCdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsCdkPipelineStackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection(
          props.appParameter.sourceRepository,
          props.appParameter.sourceBranch,
          {
            connectionArn: props.appParameter.sourceConnectionArn,
          },
        ),
        installCommands: ['n stable', 'node --version', 'npm i -g npm', 'npm --version'],
        commands: ['npm ci --workspaces', 'cd cdk', 'npx cdk synth'],
        primaryOutputDirectory: './cdk/cdk.out',
      }),
      dockerEnabledForSelfMutation: true,
      dockerEnabledForSynth: true,
    });

    pipeline.addStage(new AwsCdkPipelineStage(this, 'Dev', props));
  }
}
