# How do S3 Block Public Access, IAM policies, and bucket policies relate?

S3 Block Public Access blocks all public access to a bucket, effectively making it private, and controls access to the bucket and its objects for all users (you can still allow specific users via an Access Control List). IAM policies grant a user or service permission on what they can do in an account, for example, create S3 buckets but not delete them. Bucket policies work similarly to IAM policies but apply only at the bucket level, controlling what happens to a bucket and its objects.
