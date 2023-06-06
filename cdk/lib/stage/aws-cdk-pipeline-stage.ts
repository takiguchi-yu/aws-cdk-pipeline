import { Stack, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsCdkPipelineStackProps } from 'lib/stack/aws-cdk-pipeline-stack';
import { Api } from '../construct/api';
import { Documentation } from '../construct/documentation';

export class AwsCdkPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: AwsCdkPipelineStackProps) {
    super(scope, id, props);

    // Define a stack and associate same constructs as normal to this.
    const stack = new Stack(this, 'AwsCdkOpenApi', {
      tags: {
        Repository: props.appParameter.sourceRepository,
      },
    });

    // new Iam(stack, 'Iam');

    // AWS CloudTrail configuration in Control Tower Landing Zone v3.0 will not create CloudWatch Logs LogGroup in each Guest Accounts.
    // And it will delete these LogGroups when AWS CloudTrial Configuration is disabled in case of updating Landing Zone version from older one.
    // BLEA should notify their alarms continuously. So, if there is no CloudTrail and CloudWatch Logs in Guest Account, BLEA creates them to notify the Alarms.
    // const logging = new Logging(stack, 'Logging');

    // Security Alarms
    // !!! Need to setup SecurityHub, GuardDuty manually on Organizations Management account
    // AWS Config and CloudTrail are set up by Control Tower
    // new Detection(stack, 'Detection', {
    //   notifyEmail: props.securityNotifyEmail,
    //   cloudTrailLogGroupName: logging.trailLogGroup.logGroupName,
    // });

    new Api(stack, 'Api');

    // OpenAPI Documentation
    new Documentation(stack, 'Documentation');
  }
}
