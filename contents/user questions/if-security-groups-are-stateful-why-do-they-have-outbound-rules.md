# If security groups are stateful, why do they have outbound rules?

Even though security groups are stateful, the outbound rules section still lets you control egress. You can modify inbound rules to deny specific inbound traffic, while by default all outbound traffic is allowed, the section exists so you can tighten that when you need to.
