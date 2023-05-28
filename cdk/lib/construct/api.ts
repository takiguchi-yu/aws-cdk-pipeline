import { CfnOutput, Duration } from 'aws-cdk-lib';
import { ApiDefinition, MethodLoggingLevel, SpecRestApi } from 'aws-cdk-lib/aws-apigateway';
import { CfnFunction, Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class Api extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Lambda
    const apiLambda = new Function(this, 'Function', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: Code.fromAsset('../api/lambda'),
      memorySize: 128,
      timeout: Duration.seconds(3),
      logRetention: RetentionDays.ONE_DAY,
    });
    // Lambda関数のリソースを取得
    const apiCfnFunction = apiLambda.node.defaultChild as CfnFunction;
    // 論理IDを上書き
    apiCfnFunction.overrideLogicalId('APILambda');
    console.log(apiLambda.functionArn);

    // API Gateway
    const restAPI = new SpecRestApi(this, 'PetStoreAPI', {
      apiDefinition: ApiDefinition.fromAsset('../api/spec/openapi.yaml'),
      restApiName: 'PetStoreAPI',
      deployOptions: {
        stageName: '',
        loggingLevel: MethodLoggingLevel.ERROR,
        dataTraceEnabled: false,
        metricsEnabled: true,
        tracingEnabled: false,
      },
    });

    // Cfn Output
    new CfnOutput(this, 'RestIdOutput', { value: restAPI.restApiId });
  }
}
