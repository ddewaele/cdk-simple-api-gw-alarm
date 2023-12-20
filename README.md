# AWS API Gateway HTTP API & CloudWatch Alarms

## Overview

This repository contains AWS Cloud Development Kit (CDK) code to set up an AWS Lambda function and an Amazon API Gateway. It also includes a Lambda function written in Node.js. The CDK code and Lambda function work together to provide a serverless API with error monitoring capabilities.

### Components

1. **AWS Lambda Function (`myLambda`):**
   - **Runtime:** Node.js 20.x
   - **Handler:** `index.handler`
   - **Code Source:** Located in the `../lambda/simple-lambda` directory.
   - **Functionality:** The Lambda function processes HTTP requests, parsing the path to determine the response. It can return various HTTP status codes (200, 400, 500, 404) based on the last path segment in the request.

2. **Amazon API Gateway (`httpApi`):**
   - **Type:** HTTP API
   - **Endpoints:**
     - `/api1/{proxy+}`
     - `/api2/{proxy+}`
   - **Methods:** Supports all HTTP methods (`ANY`).
   - **Integration:** Both endpoints are integrated with the `myLambda` function.

3. **CloudWatch Metrics and Alarm:**
   - **Metric (`metricApi2Errors`):** Monitors 5xx errors for the `/api2/{proxy+}` endpoint.
   - **Alarm (`Api2ErrorsAlarm`):** Triggers if the number of 5xx errors exceeds 5 within a single evaluation period.

4. **Output:**
   - **HTTP API URL:** Outputs the URL of the deployed API Gateway.

### Lambda Function Logic

The Lambda function `handler` takes an incoming HTTP event, logs it, and then performs the following actions based on the last segment of the request path:

- `ok`: Returns a 200 status code with a message 'OK'. (`/api1/ok or /api2/ok`)
- `error`: Returns a 500 status code with a message 'Internal Server Error'. (`/api1/error or /api2/error`)
- `bad`: Returns a 400 status code with a message 'Bad Request'. (`/api1/bad or /api2/bad`)
- `default`: Returns a 404 status code with a message 'Not Found'. (`/api1/other or /api2/other`)

For each response, the function also includes the context path derived from the request path.

## Deployment

To deploy this setup:

1. Ensure AWS CDK is installed and configured with appropriate AWS credentials.
2. Navigate to the root directory of this project.
3. Run `cdk deploy` to deploy the stack to your AWS account.

## Usage

After deployment, the API can be accessed through the URL outputted by CDK. Test the endpoints by appending different path segments to trigger various responses from the Lambda function.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
