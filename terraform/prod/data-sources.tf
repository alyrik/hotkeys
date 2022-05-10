data "archive_file" "sqs_processor_lambda_source" {
  type        = "zip"
  output_path = "${path.module}/../../.deploy/hotkeysSqsProcessor.zip"
  source_dir  = "${path.module}/../../lambdas/hotkeysSqsProcessor"
}
