# How you actually work with AWS, and who's responsible for what

Once the concepts click, the next question is practical: how do you actually touch AWS day to day, and when something goes wrong, whose problem is it? Both questions have clean answers, and both matter more than they first appear to.

## Three ways in, for three different situations

The AWS Management Console is the web dashboard at aws.amazon.com, and it's the natural starting point: point, click, and manage services like EC2 or S3 without writing anything. It doubles as a remote monitoring tool, letting you check on resources from anywhere, which makes it useful well past the beginner stage.

The Command Line Interface is the next step up in power. A command like `aws s3 ls` lists your storage buckets in a fraction of the time a console click-path would take, and once the initial unfamiliarity wears off, the CLI becomes the fastest way to handle repetitive tasks. It's also the kind of skill that reads clearly on a resume, because it signals you're past the exploratory phase.

Software Development Kits go a step further still, letting developers build AWS directly into applications. SDKs are code libraries, in Python, Java, and others, that let an app do things like upload a file to S3 without a human clicking through a console at all. This is exactly how a company like Netflix handles streaming at scale: not through console clicks, but through code that talks to AWS programmatically. Experimenting with AWS's Python SDK, Boto3, to automate a task is a reasonable first step toward that kind of work, and toward DevOps roles generally.

## The Shared Responsibility Model: what AWS owns, and what you own

AWS splits security duties with you, and understanding exactly where that line falls is one of the most consequential things a cloud engineer can learn early.

AWS is responsible for the "security of the cloud": the physical data centers, the hardware, the networks. Their facilities run on generators, redundant cooling, and serious physical security, and it shows in the numbers, AWS reports 99.99% uptime across its infrastructure.

You're responsible for "security in the cloud": your applications, your data, your configuration. That means managing credentials, encrypting data, and setting firewalls like security groups correctly. This isn't theoretical. Skipping multi-factor authentication on a root account is exactly the kind of oversight that turns a routine setup task into a real security incident, and it's a mistake worth learning from someone else's experience rather than your own.

Two categories inside this split are worth knowing by name, because they come up constantly and rarely get explained clearly. Customer Inherited Controls are controls a customer fully inherits the moment they start using AWS services, physical and environmental controls being the clearest example, where both AWS and the customer are effectively protecting the same thing from different sides. Shared Controls split responsibility down the middle on a single component: for the operating system on a server, AWS manages the host OS, while you manage the guest OS running on top of it.

## Reliability isn't a marketing claim, it's an architecture

AWS's data centers back up data across three Availability Zones by default, which is why a mistake as serious as an accidental database deletion is recoverable rather than catastrophic, often down to the last few minutes before the failure. That kind of resilience isn't incidental. It's why organizations moving billions of dollars in transactions can rely on AWS's global infrastructure to minimize downtime in the first place.

## Your data stays yours, but idle data still costs money

A question that comes up constantly: can you actually get your data back out? Yes. You can migrate data to on-premises systems at any time, gradually or all at once, and AWS won't delete it out from under you. The one thing to plan for is that unused data left behind after a migration keeps incurring storage fees, so cleaning up post-migration isn't optional housekeeping, it's part of the migration itself.

## Working with AWS is a set of choices, not a black box

None of this is complicated in isolation: pick the right interface for the task, know exactly where your responsibility starts, and trust the infrastructure to do what it's built to do. What separates someone who's comfortable with AWS from someone who's just used it is whether they've internalized that split clearly enough to make good calls under pressure, not just during a calm afternoon of documentation reading.
