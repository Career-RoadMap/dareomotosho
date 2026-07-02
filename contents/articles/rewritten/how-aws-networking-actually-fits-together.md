# How AWS networking actually fits together, from VPCs to Direct Connect

Networking is the part of AWS that looks abstract right up until something doesn't reach the internet, or reaches it when it shouldn't have. Understanding how the pieces fit together, rather than memorizing them as isolated services, is what turns networking from a source of anxiety into a design tool.

## The VPC is your own isolated slice of AWS

A Virtual Private Cloud is your own private network inside AWS: your IP address ranges, your subnets, your route tables, your gateways, isolated from every other AWS customer. Every account gets a default VPC per region at no charge, ready to use, but anything beyond simple use cases usually calls for a custom one.

A few characteristics define what a VPC gives you. It's isolated from other customers by default. You control the IP space, subnets, routing, and gateways inside it. You can run multiple VPCs per account, five per region by default, extendable on request. And you define your address range using CIDR notation: a /16 block gives you 65,536 addresses, the largest AWS allows for a single VPC, while a /28 gives you only 16. That range can't be changed after the VPC is created, which makes sizing it correctly upfront one of the few genuinely irreversible decisions in this whole layer.

## Subnets carve the VPC into purpose-built sections

Inside a VPC, you divide the address space into subnets, each one living entirely within a single Availability Zone for fault tolerance. Public subnets are for anything that needs to be reachable from the internet, web servers being the obvious case, and they connect through an Internet Gateway. Private subnets hold anything that shouldn't be directly reachable, databases and application servers, and when those resources need outbound internet access, that traffic routes through a NAT Gateway instead.

## Route tables decide where traffic actually goes

Every subnet is tied to a route table, and that table is what determines where incoming and outgoing traffic ends up. An Internet Gateway is a redundant, highly available component that lets a VPC talk to the public internet, and it's what public subnets rely on. A NAT Gateway does something more specific: it lets private-subnet instances initiate outbound connections without ever exposing them to inbound ones. AWS's managed NAT Gateway has effectively replaced the older self-managed NAT instance approach, since it's simpler to run and more resilient by default.

## Extending the network beyond one VPC

As soon as you need more than one VPC, or need to reach on-premises infrastructure, a handful of connectivity options come into play. VPC Peering connects two VPCs, in the same account or across accounts, so they behave like one network. AWS Site-to-Site VPN gives you an encrypted tunnel between your on-premises environment and your VPC, a cost-effective option for hybrid setups. AWS Direct Connect goes further: a dedicated private connection from your data center to AWS, with better bandwidth, lower latency, and more consistent performance than anything running over the public internet.

The choice between these isn't purely technical. A financial institution or healthcare provider operating in South Africa, for instance, might specifically choose Direct Connect, partnering with a local network provider for a dedicated fiber connection, because sensitive customer data needs to stay within a defined geographic and compliance boundary even while the workload runs on AWS. That's a business and regulatory decision expressed through a networking choice, not the other way around.

Once a cloud footprint grows past a few VPCs, managing individual peering connections between all of them turns into its own maintenance problem. AWS Transit Gateway solves that by acting as a central hub connecting VPCs, on-premises networks, and other AWS accounts through a single point of control, a hub-and-spoke model instead of a tangle of point-to-point links.

## The network is where architecture becomes visible

Every one of these components, VPCs, subnets, gateways, peering, Direct Connect, exists to answer a version of the same question: what should be reachable, from where, and under what conditions. Get that question right early, and the rest of your cloud architecture inherits a foundation that's secure and predictable by design, rather than secure by accident.
