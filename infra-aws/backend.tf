# -----------------------------------------------------------------------------
#  Terraform state
#
#  By default state is a local file: infra/terraform.tfstate. That is fine for
#  one person on one laptop, which is where you are starting.
#
#  When you want to (a) run this from more than one machine, (b) run it in CI,
#  or (c) not risk losing state — move it to S3 + DynamoDB locking.
#
#  Steps:
#    1. Create a bucket (e.g. alingnene-tfstate) and a DynamoDB table
#       (e.g. alingnene-tflock) with primary key "LockID" (String). You can do
#       this by hand in the console the first time — it's the classic
#       chicken-and-egg.
#    2. Uncomment the block below.
#    3. Run:  terraform init -migrate-state
#
#  terraform {
#    backend "s3" {
#      bucket         = "alingnene-tfstate"
#      key            = "website/terraform.tfstate"
#      region         = "ap-southeast-1"
#      dynamodb_table = "alingnene-tflock"
#      encrypt        = true
#    }
#  }
# -----------------------------------------------------------------------------
