import { CfnOutput, Duration, Fn, IResolvable } from 'aws-cdk-lib';
import { ApiDefinition, InlineApiDefinition, MethodLoggingLevel, SpecRestApi } from 'aws-cdk-lib/aws-apigateway';
import { CfnFunction, Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
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
    const cfnLambda = apiLambda.node.defaultChild as CfnFunction;
    cfnLambda.overrideLogicalId('ApiLambda'); // OpenAPI定義で参照

    // API Gateway
    const openApiAsset = new Asset(this, 'openApiFile', {
      path: '../api/spec/openapi.yaml',
    });
    const transformMap = {
      Location: openApiAsset.s3ObjectUrl,
    };
    const data: IResolvable = Fn.transform('AWS::Include', transformMap);
    const apiDefinition: InlineApiDefinition = ApiDefinition.fromInline(data);
    const specRestApi = new SpecRestApi(this, 'RestApi', {
      apiDefinition: apiDefinition, // Cfn組み込み関数をロードするためにインラインデータで指定
      restApiName: 'tasks-api',
      deployOptions: {
        stageName: '',
        loggingLevel: MethodLoggingLevel.INFO,
      },
    });

    // Cfn Output
    new CfnOutput(this, 'RestApiId', { value: specRestApi.restApiId });
  }
}
