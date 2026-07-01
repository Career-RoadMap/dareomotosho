# IAM policy vs Service Control Policy (SCP), what's the difference?

The key difference is scope. An IAM policy works at the level of an individual user or account, granting permissions on what a user or service can do. A Service Control Policy (SCP) works at the Organizational Unit (OU) level. When organizations group multiple AWS accounts together, SCPs govern that group, while IAM policies apply within a single account, multiple accounts versus a single account.
