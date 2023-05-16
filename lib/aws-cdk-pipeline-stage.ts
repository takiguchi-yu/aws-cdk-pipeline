import { Stage, StageProps } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { AwsCdkPipelineStack } from "./aws-cdk-pipeline-stack";

export class BlogPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props)

    new AwsCdkPipelineStack(this, "AwsCdkPipelineStack")
  }
}
