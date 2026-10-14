# The account nobody signed for

Picture the meeting after an AI agent does something odd. Maybe it emailed a customer it had no business emailing, or it closed a few hundred support tickets overnight. Somebody asks the obvious question: who approved this? And the room goes quiet. Not because anyone is hiding something, but because the honest answer is that nobody was ever asked.

That silence is the thing worth looking at. It is easy to file it under security, and the security people are right that agents open new ways in. However, what the quiet room is missing is not a firewall. It is a decision that was never made: what is this agent allowed to do, and who said so?

## Two ways to get the same access

Think about how a new colleague gets into production. Somebody raises a request. A manager's name goes on it. The request lists which systems, and often there is a date to review it. It can feel slow, and each piece of it is there because some team once paid for not having it.

Now think about how an agent often gets the same reach. An engineer already holds a working credential, copies it into the agent's configuration, and the agent is live before lunch. No request, no name, no list of systems, no review date.

Nobody did anything wrong there. The tools are built to take friction out of the setup, and approval is friction, so it quietly left along with everything else. This is what cheap execution looks like: the wiring takes a few minutes now, which leaves the deciding as the only slow part, and the deciding is exactly the step that got skipped.

The numbers suggest this is the usual case rather than the careless one. In Gravitee's 2026 survey of 750 senior technology leaders, which is vendor research from a company that sells agent governance tools, only 7.2% said one named person was formally accountable for what their agents do.

## Start from the worst believable day

So how do you decide what an agent may do without being a security specialist? Ask what a bad day looks like, rather than what a good day needs.

Take an agent that reads customer records and opens tickets. One wrong ticket is a shrug, because somebody closes it. Four hundred wrong tickets by morning is a different conversation. So the useful limit was never whether it may open tickets. It is how many it may open in an hour, and who would notice if it hit that ceiling. You only arrive there by picturing it going wrong.

The people who keep the standard list of risks in AI applications, OWASP, have a name for an agent holding more reach than its job needs: excessive agency. The name helps. The fix is still a decision somebody makes.

Then hand the agent what a new joiner gets: an owner who is a person rather than a team, a scope written in one sentence anybody could repeat back to you, and a date when someone looks at it again. That is roughly fifteen minutes of work.

I am not the person to tell you whether your setup passes an audit; that belongs to your compliance and legal people. What I can say is simpler. Every other account in your systems leads back to a human being. An agent with a key and no owner is the one that does not.

## It is not only about agents

The same shape turns up in a cloud bill nobody owns, or an incident review where no decision-maker appears anywhere in the timeline. The technical symptom is loud and the missing decision is quiet. Agents are simply where it surfaced this time.

What those fifteen minutes look like as six questions on a page, including the line where a name goes beside every permission the agent holds, is here: https://dareomotosho.com/resources/field-kit
