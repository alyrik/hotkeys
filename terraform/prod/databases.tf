resource "aws_dynamodb_table" "individual-table" {
  name         = var.individual_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  table_class  = "STANDARD"

  attribute {
    name = "userId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "presentation-table" {
  name         = var.presentation_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  table_class  = "STANDARD"

  attribute {
    name = "id"
    type = "S"
  }
}
