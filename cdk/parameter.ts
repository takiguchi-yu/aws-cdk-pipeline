import { Environment } from 'aws-cdk-lib';

export interface AppParameter {
  env?: Environment;
  envName: string;
  securityNotifyEmail: string;
  securitySlackWorkspaceId?: string; // required if deploy via CLI
  securitySlackChannelId?: string; // required if deploy via CLI
}

export interface PipelineParameter {
  env: Environment;
  envName: string;

  // AWS CodeStar Connections parameters for CDK Pipelines.
  // Only used in bin/blea-gov-base-ct-via-cdk-pipelines.ts
  sourceRepository: string;
  sourceBranch: string;
  sourceConnectionArn: string;
}

// Example for Development
export const devParameter: AppParameter = {
  envName: 'Development',
  securityNotifyEmail: 'notify-security@example.com',
  securitySlackWorkspaceId: 'T8XXXXXXX',
  securitySlackChannelId: 'C00XXXXXXXX',
  // env: { account: '887277492962', region: 'ap-northeast-1' },
};

// Example for Pipeline Deployment
export const devPipelineParameter: PipelineParameter = {
  env: { account: '887277492962', region: 'ap-northeast-1' },
  envName: 'DevPipeline',
  sourceRepository: 'takiguchi-yu/aws-cdk-pipeline',
  sourceBranch: 'main',
  sourceConnectionArn:
    'arn:aws:codestar-connections:ap-northeast-1:887277492962:connection/a6c5beb2-34a4-4224-99a9-0332ee4a054c',
};
