# An excellent answer to a question nobody asked

The meeting is calm. Nobody is accusing anybody of anything. Somebody who does not work for you, a customer's lawyer or an auditor or one of your own board members, asks a short and entirely fair question about something your agent did back in March. Not what it did. Why it did that one and not the other one.

And you can produce an extraordinary amount of material. Every request it sent, every answer it got back, what time, with which settings, more of it than a person could read in a fortnight. You put all of that on the table and it does not touch the question.

The instinct in that moment is that something failed to get captured. It did not. What you are holding was written for a different reader.

## The receipt nobody thought was important

A shop can have a camera pointed at every corner and still not be able to tell you what was sold on Tuesday afternoon. The footage exists. Somebody has to give up an afternoon to it, and then the angle turns out to be wrong, and you still end up guessing.

The receipt does the job the camera cannot. It is small and dull, nobody thinks about it while it is being printed, and it is issued in the same second as the thing it describes. Ten years later it still answers.

Your systems keep the footage. What was never set up was the receipt book.

## Why the record cannot hold a reason

There is a record of everything your agent did, call by call, and the word for it is a **trace**. It is genuinely complete. It is also, by construction, a description of events that happened.

A reason is not that. A reason names the thing that was chosen and the things that were put aside. The options it put aside were never run, so they touched nothing and left no trace. You can read the file forever and they are not in it to find.

This used to be survivable, and it is worth being clear about why. When a person made a call somebody later questioned, you went and asked the person. The reason was in somebody's memory, and memory holds up for a year or so, which is usually long enough. An agent makes that same kind of call hundreds of times a day with nobody sitting there. So either the reason gets written down as it happens, by the thing doing it, or it is not anywhere.

## More logging has never once fixed this

Teams try it. It never lands, and the reason it never lands is not volume.

Nobody who has opened an agent log has ever come away thinking there was too little of it. So turn the question round: who were those logs built for?

Engineers wrote them, for engineers, to answer one question, which is *what broke*. That is an excellent instrument and it has been sharpened for thirty years. Now look at who is asking the new one. An auditor. A customer. A board member. They are not asking for a description of events. They want a justification, and a justification is a different kind of sentence entirely.

So the record is not short of anything. It is addressed to the wrong reader.

## One line, written at the moment

When the agent does something consequential, have it write down why, right then. One sentence, plain language, aimed at somebody who has never opened your codebase. Not the settings it used. What it was trying to get done, and what it decided against.

Two things keep it from becoming another firehose.

**Only the consequential actions.** One test does the work: does this reach past the engineering team? Money moving, a customer's record changing, something going to a person outside the building. Everything else can stay where it already is.

**Plain language, deliberately.** If somebody technical has to sit with a reader and interpret it, you have built more footage.

## The part that is a real cost

It is worth saying out loud rather than letting you find it in month two. Writing that sentence costs latency on every one of those actions, and engineering time to put in, and in almost every case nobody will ever read what it produces. That is a genuine trade, and it is most of the reason this does not already exist.

But be clear about what skipping it buys. It is not "we will work it out later". You are choosing, now, not to be able to answer. That can be the right call. It just has to be a call.

## It is much older than agents

Take any incident you have watched an organisation explain its way through. The ones that got explained were never the ones with the best logging. They were the ones where somebody wrote a sentence while it was happening.

A pricing exception that never made it into any minutes. A hire agreed in a corridor. A promise made to a customer on a call that only two people were on. Same missing sentence every time, and it is always somebody from outside who finds it, asking a perfectly reasonable question.

Reconstruction is not a record. The difference between them only ever shows up when there is an audience.

Which of your agent's actions are the ones that will get asked about, and what sentence each of them ought to be leaving behind, is worked through on a page here: https://dareomotosho.com/resources/field-kit
