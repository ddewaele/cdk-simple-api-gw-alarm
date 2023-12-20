import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch'

import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export class CdkSimpleApiGwAlarmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the Lambda function
    const myLambda = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../lambda/simple-lambda')), // Path to your Lambda function code
    });


    // Define the API Gateway
    const httpApi = new apigatewayv2.HttpApi(this, 'MyHttpApi');

    httpApi.addRoutes({
      path: '/api1/{proxy+}',
      methods: [apigatewayv2.HttpMethod.ANY],
      integration: new HttpLambdaIntegration('LambdaIntegration', myLambda),
    });


    httpApi.addRoutes({
      path: '/api2/{proxy+}',
      methods: [apigatewayv2.HttpMethod.ANY],
      integration: new HttpLambdaIntegration('LambdaIntegration', myLambda),
    });

    
  const metricApi2Errors = new cloudwatch.Metric({
    namespace: 'AWS/ApiGateway',
    metricName: '5xx', // or any other relevant metric
    statistic: cloudwatch.Stats.SUM,
    dimensionsMap: {
      ApiId: httpApi.apiId,
      Resource: '/api2/{proxy+}',
      Stage: '$default',
      Method: 'ANY'
    }
  });

  // Create a CloudWatch Alarm based on the metric
  new cloudwatch.Alarm(this, 'Api2ErrorsAlarm', {
    metric: metricApi2Errors,
    threshold: 5,
    evaluationPeriods: 1,
    datapointsToAlarm: 1,
    treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
  });

  new cdk.CfnOutput(this, 'HttpApiGatewayURL', {
    value: httpApi.url!,
  });


  }
}
