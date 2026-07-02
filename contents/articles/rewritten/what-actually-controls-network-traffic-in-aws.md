# What actually controls network traffic in AWS, and why the layers matter

Most confusion about AWS network security comes down to one question people never quite settle: what's actually enforcing the rule I think I set. Traffic control in AWS happens at more than one layer, and each layer behaves differently enough that mixing them up leads directly to either an outage or a security gap.

## Network ACLs operate at the subnet, and they don't remember anything

A Network Access Control List sits at the edge of a subnet and controls everything moving in or out of it. The defining trait is that it's stateless: it has no memory of past connections. If you allow inbound traffic on a given port, that permission says nothing about the response traffic leaving on the way back out, you need a separate, explicit outbound rule for that, typically covering the ephemeral port range (1024 to 65535) that responses use.

A few other things follow from how NACLs work. They apply to an entire subnet, so every instance inside inherits the same rules. They support both ALLOW and DENY rules, which makes them useful for explicitly blocking specific IP ranges rather than just permitting what you want. Rules are evaluated in numeric order, and the first match wins, no further rules apply once one matches. And if nothing matches at all, the default behavior is to deny. A simple example makes the statelessness concrete: allowing inbound HTTP on port 80 to a public web server also requires a matching outbound rule on the ephemeral port range, or the response never leaves.

## Security Groups operate at the instance, and they do remember

A Security Group works one layer down, attached directly to an instance (or a load balancer, an RDS database, and similar resources) rather than a subnet. The key difference from a NACL is that it's stateful: if you allow inbound traffic on a port, the matching outbound response traffic is automatically permitted, no separate rule required.

Security Groups only support ALLOW rules, there's no explicit deny the way NACLs have one; you block traffic by simply not allowing it. And if nothing matches an ALLOW rule, the implicit result is a deny. Allowing SSH access on port 22, for instance, takes a single inbound rule, the response traffic is handled automatically.

Put simply: NACLs are the coarse, stateless filter at the subnet boundary, evaluated in order and capable of explicit denial. Security Groups are the finer, stateful filter at the instance level, permission-only, and self-managing on the return path. Designing traffic flow usually means using both together, NACLs for broad subnet-level filtering, Security Groups for precise instance-level control.

## Security doesn't stop at the firewall: DNS and content delivery matter too

Controlling who can reach your infrastructure is only half the picture. How users actually find it, and how quickly content reaches them once they do, are architectural decisions with their own security and performance implications.

Amazon Route 53 is AWS's DNS service, translating human-readable domain names into the IP addresses machines actually use. It's highly available and scalable, and it supports several routing strategies depending on what you need: Simple routing to a single resource, Weighted routing to distribute traffic across multiple resources by specified proportions, Latency-based routing to send users to whichever region responds fastest for them, Geolocation routing based on where a user actually is, and Failover routing that redirects to a healthy resource the moment a primary one degrades. It's the piece that maps your custom domain onto whatever AWS resources are actually serving it.

Amazon CloudFront, AWS's content delivery network, speeds up how static and dynamic content reaches users by caching it at edge locations distributed globally. When a request comes in, CloudFront serves it from the nearest edge location rather than the origin server, cutting latency significantly. A site hosted in Europe serving a user in Asia illustrates the difference directly: without CloudFront, that request travels all the way to Europe and back; with it, cached content is already sitting close to the user in Asia. CloudFront also integrates with AWS WAF and AWS Shield, adding a layer of protection against malicious traffic and DDoS attacks on top of the performance benefit.

## Knowing what each layer is for is the actual skill

None of these four pieces, NACLs, Security Groups, Route 53, CloudFront, replace the others, and none of them alone secures an application. The real competency isn't memorizing what each one does in isolation. It's being able to trace a request's entire path, from how a user finds your domain, through how traffic reaches your subnet, down to which specific instance-level rule allows it through, and knowing which layer is responsible for which part of that journey. That's what turns a services list into an actual architecture.
