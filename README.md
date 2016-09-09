# Cycle connect server

Cycle connect server originally started as an API endpoint but has been refactored to an AWS lambda function.

### Want to try it yourself?
Prerequisite:
 - [Twillio account](https://www.twilio.com/)
 - NPM
 - Node

Copy `.env.example` to `.env` and replace the following fields:

- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- FROM_PHONE_NUMBER
- TO_PHONE_NUMBER

Install the dependencies using `npm install`.

Then run `npm start` which uses [node-lambda](https://www.npmjs.com/package/node-lambda) to replicate AWS lambda locally. If successful you should now receive a text message.

### Want to deploy it to AWS Lambda?
Prerequisite (local only):
 - [Twillio account](https://www.twilio.com/)
 - AWS Account
 - NPM
 - Node

Copy `.env.example` to `.env` and replace the following fields:

- AWS_ENVIRONMENT
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_ROLE_ARN
- AWS_REGION
- AWS_FUNCTION_NAME
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- FROM_PHONE_NUMBER
- TO_PHONE_NUMBER

Install the dependencies using `npm install`.

Deploy the package to AWS by running `npm run deploy`.

If successful your script should now be deployed.
