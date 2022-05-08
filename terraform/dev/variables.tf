variable "project_tag_name" {
  type    = string
  default = "HotkeysDev"
}

variable "individual_table_name" {
  type    = string
  default = "hotkeys-individual-dev"
}

variable "presentation_table_name" {
  type    = string
  default = "hotkeys-dev"
}

variable "presentation_queue" {
  type    = string
  default = "HotkeysResponsesDev.fifo"
}

variable "sqs_processor_lambda_role" {
  type    = string
  default = "hotkeys-sqs-processor-lambda-dev-role"
}

variable "sqs_processor_lambda_dynamodb_policy" {
  type    = string
  default = "hotkeysLambdaDynamoDBDev"
}

variable "sqs_processor_lambda" {
  type    = string
  default = "hotkeysSqsProcessorDev"
}

