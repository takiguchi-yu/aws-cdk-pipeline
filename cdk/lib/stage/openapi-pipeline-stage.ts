import { Stack, StackProps, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Documentation } from '../construct/documentation';

export interface OpenAPIPipelineStageProps extends StackProps {
  securityNotifyEmail: string;
  securitySlackWorkspaceId?: string;
  securitySlackChannelId?: string;
}

export class OpenAPIPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: OpenAPIPipelineStageProps) {
    super(scope, id, props);

    // Define a stack and associate same constructs as normal to this.
    const stack = new Stack(this, 'Documentation', {
      tags: {
        Repository: 'takiguchi-yu/aws-cdk-pipeline',
      },
    });

    new Documentation(stack, 'Documentation');
  }
}
