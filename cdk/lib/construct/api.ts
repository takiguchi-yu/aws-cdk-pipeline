import { MethodLoggingLevel } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import path = require('path');

export class Api extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const deployOptions = {
      stageName: '',
      loggingLevel: MethodLoggingLevel.ERROR,
      dataTraceEnabled: false,
      metricsEnabled: true,
      tracingEnabled: false,
    };
    // const restOpenAPISpec = this.resolve(
    //   Mustache.render(fs.readFileSync(path.join(__dirname, './rest-sqs.yaml'), 'utf-8'), variables),
    // );
    // new SpecRestApi(this, 'rest-to-sqs', {
    //   apiDefinition: ApiDefinition.fromInline(restOpenAPISpec),
    //   endpointExportName: 'APIEndpoint',
    //   deployOptions,
    // });
  }
}
