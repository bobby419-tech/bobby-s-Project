output "api_base_url" {
  value = "https://${aws_api_gateway_rest_api.api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_stage.prod.stage_name}"
}

output "s3_bucket" {
  value = aws_s3_bucket.mp3_bucket.bucket
}

output "dynamodb_table" {
  value = aws_dynamodb_table.posts.name
}

output "cloudfront_url" {
  value = "https://${aws_cloudfront_distribution.website_distribution.domain_name}"
}

output "website_bucket" {
  value = aws_s3_bucket.website_bucket.bucket
}