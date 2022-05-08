resource "aws_sqs_queue" "hotkeys_responses" {
  name                        = var.presentation_queue
  fifo_queue                  = true
  content_based_deduplication = true
  max_message_size            = 16384
  message_retention_seconds   = 900
  visibility_timeout_seconds  = 30
  delay_seconds               = 1
  receive_wait_time_seconds   = 4
  deduplication_scope         = "queue"
  fifo_throughput_limit       = "perQueue"
}
