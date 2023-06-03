import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import {
  AllowedMethods,
  Distribution,
  OriginAccessIdentity,
  PriceClass,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class Documentation extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // S3
    const apiDocBucket = new Bucket(this, 'ApiDocumentBucket', {
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Cloudfront
    const cloudfrontOAI = new OriginAccessIdentity(this, 'CloudfrontOAI');
    apiDocBucket.grantRead(cloudfrontOAI);
    const distribution = new Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      priceClass: PriceClass.PRICE_CLASS_200,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultBehavior: {
        origin: new S3Origin(apiDocBucket, { originAccessIdentity: cloudfrontOAI }),
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    // OpenAPI Documentation (redoc)
    // const apiDocSource: ISource = Source.asset('../api/spec', {
    //   bundling: {
    //     image: DockerImage.fromRegistry('node'),
    //     // image: DockerImage.fromBuild('../api/spec/docker'),
    //     command: [
    //       '/bin/sh',
    //       '-c',
    //       'pwd && ls -l && ' +
    //         'node --version && npm --version && ' +
    //         'npm install -g @redocly/cli && ' +
    //         'redocly build-docs openapi.yaml --output build/index.html && ' +
    //         'cp build/* /asset-output/',
    //     ],
    //     user: 'root',
    //     outputType: BundlingOutput.NOT_ARCHIVED,
    //   },
    // });

    // S3 deploy
    new BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [Source.asset('../api/spec/build')],
      // sources: [apiDocSource],
      destinationBucket: apiDocBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Cfn Output
    new CfnOutput(this, 'CloudfrontDistributionId', { value: distribution.distributionId });
    new CfnOutput(this, 'CloudfrontURL', { value: `https://${distribution.distributionDomainName}` });
    new CfnOutput(this, 'ApiDocumentBucketName', { value: apiDocBucket.bucketName });
  }
}
