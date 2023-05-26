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
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class Documentation extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // S3
    const apiDocumentBucket = new Bucket(this, 'ApiDocumentBucket', {
      bucketName: 'takiguchi-no-api-document-bucket',
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Cloudfront
    const cloudfrontOAI = new OriginAccessIdentity(this, 'CloudfrontOAI');
    apiDocumentBucket.grantRead(cloudfrontOAI);
    const distribution = new Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      priceClass: PriceClass.PRICE_CLASS_200,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultBehavior: {
        origin: new S3Origin(apiDocumentBucket, { originAccessIdentity: cloudfrontOAI }),
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });
    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
    new CfnOutput(this, 'DistributionUrl', {
      value: `https://${distribution.distributionDomainName}`,
    });

    // S3 deploy
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('../api/spec/build')],
      destinationBucket: apiDocumentBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
