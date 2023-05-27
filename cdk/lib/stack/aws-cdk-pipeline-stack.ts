import * as cdk from 'aws-cdk-lib';
import { pipelines } from 'aws-cdk-lib';
import { Construct } from 'constructs';
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
      dockerEnabledForSelfMutation: true, // パイプラインの自己更新を許可
      dockerEnabledForSynth: true, // バンドルされたファイルアセットを使用する
    });

    props.targetParameters.forEach((params) => {
      pipeline.addStage(new AwsCdkPipelineStage(this, 'Staging', params));
    });
  }
}
