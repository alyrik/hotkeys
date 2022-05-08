resource "aws_lambda_function" "sqs_processor_lambda" {
  filename         = data.archive_file.sqs_processor_lambda_source.output_path
  function_name    = var.sqs_processor_lambda
  role             = aws_iam_role.sqs_processor_lambda_role.arn
  runtime          = "nodejs14.x"
  source_code_hash = data.archive_file.sqs_processor_lambda_source.output_sha
  handler          = "index.handler"

  environment {
    variables = {
      AWS_TABLE = var.presentation_table_name
    }
  }
}

resource "aws_lambda_event_source_mapping" "example" {
  event_source_arn = aws_sqs_queue.hotkeys_responses.arn
  function_name    = aws_lambda_function.sqs_processor_lambda.arn
}
