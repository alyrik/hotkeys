data "aws_iam_policy" "aws_managed_sqs_policy" {
  name = "AWSLambdaSQSQueueExecutionRole"
}

resource "aws_iam_role" "sqs_processor_lambda_role" {
  name               = var.sqs_processor_lambda_role
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Effect" : "Allow",
        "Sid" : ""
      }
    ]
  })
  managed_policy_arns = [data.aws_iam_policy.aws_managed_sqs_policy.arn]
}

resource "aws_iam_role_policy" "sqs_processor_lambda_ddb_policy" {
  name = var.sqs_processor_lambda_dynamodb_policy
  role = aws_iam_role.sqs_processor_lambda_role.id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:BatchWriteItem",
          "dynamodb:PutItem"
        ],
        "Resource" : aws_dynamodb_table.presentation-table.arn
      }
    ]
  })
}
