#!/usr/bin/env sh

echo "configuring sqs and sns"
echo "==================="
LOCALSTACK_HOST=localhost
AWS_REGION=eu-west-2

create_queue() {
  local QUEUE_NAME_TO_CREATE=$1
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name ${QUEUE_NAME_TO_CREATE} --region ${AWS_REGION} --attributes VisibilityTimeout=30
}

create_topic() {
  local TOPIC_NAME_TO_CREATE=$1
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns create-topic --name ${TOPIC_NAME_TO_CREATE} --region ${AWS_REGION}
}

subscribe_queue_to_topic() {
  local TOPIC=$1
  local QUEUE=$2
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns subscribe --topic-arn arn:aws:sns:${AWS_REGION}:000000000000:${TOPIC} --protocol sqs --notification-endpoint http://sqs.${AWS_REGION}.${LOCALSTACK_HOST}.localstack.cloud:4566/000000000000/${QUEUE} --region ${AWS_REGION}
}

create_queue "queue1"
create_topic "topic1"

subscribe_queue_to_topic "topic1" "queue1"
