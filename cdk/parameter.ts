import { Environment } from 'aws-cdk-lib';

export interface PipelineParameter {
  env: Environment;
  envName: string;
  sourceRepository: string;
  sourceBranch: string;
  sourceConnectionArn: string;
}

export const devPipelineParameter: PipelineParameter = {
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
  },
  envName: 'Dev',
  sourceRepository: 'takiguchi-yu/aws-cdk-pipeline',
  sourceBranch: 'main',
  sourceConnectionArn:
    'arn:aws:codestar-connections:ap-northeast-1:887277492962:connection/a6c5beb2-34a4-4224-99a9-0332ee4a054c',
};
