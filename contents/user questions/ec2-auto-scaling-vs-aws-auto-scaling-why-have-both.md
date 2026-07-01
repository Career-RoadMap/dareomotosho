# EC2 Auto Scaling vs AWS Auto Scaling, why have both?

AWS Auto Scaling is used when you have many deployed services that need to scale automatically, for example scaling databases, EC2, and more based on each service's utilization metrics. EC2 Auto Scaling deals specifically with EC2 instances only.

The two work together: AWS Auto Scaling can coordinate EC2 Auto Scaling to monitor scaling policies and act accordingly. For ease of configuration and management, EC2 Auto Scaling is preferred when no other service is involved.
