variable "project_tag_name" {
  type    = string
  default = "HotkeysProd"
}

variable "individual_table_name" {
  type    = string
  default = "hotkeys-individual"
}

variable "presentation_table_name" {
  type    = string
  default = "hotkeys"
}

variable "presentation_queue" {
  type    = string
  default = "HotkeysResponses.fifo"
}

variable "sqs_processor_lambda_role" {
  type    = string
  default = "hotkeys-sqs-processor-lambda-role"
}

variable "sqs_processor_lambda_dynamodb_policy" {
  type    = string
  default = "hotkeysLambdaDynamoDB"
}

variable "sqs_processor_lambda" {
  type    = string
  default = "hotkeysSqsProcessor"
}

