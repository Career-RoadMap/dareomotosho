# RAG versus CAG: two ways AI decides what to know, and when to use each

Ask an AI system a question it wasn't originally trained to answer, and it has to get the missing information from somewhere. That's what "augmented generation" actually means: the model isn't guessing, it's reaching for an external source before it responds. There are several ways to build that reach, but two patterns show up constantly, and understanding the difference between them matters more than the acronyms suggest.

Retrieval-Augmented Generation (RAG) and Cache-Augmented Generation (CAG) both solve the same underlying problem, but they make opposite bets about where the information should live while the model is answering you.

## RAG searches on demand

RAG treats the knowledge base like a library it hasn't memorized. When a question comes in, it searches across a large body of content, potentially millions of documents, and pulls out only the specific passages relevant to that question, then hands those to the model to build an answer. Nothing gets loaded that wasn't actually needed for this particular query.

That targeted retrieval is RAG's real advantage. Because it only pulls what's relevant, the answer tends to stay accurate and on-topic, without irrelevant material bleeding into the response. And because it searches rather than holds everything in memory, it scales to enormous datasets without strain, an index of a million documents and an index of ten million behave the same way from the model's perspective, it just searches a bigger library.

The tradeoff is speed. Searching first and answering second adds a step that a system with everything already loaded doesn't have to take.

## CAG loads everything up front

Cache-Augmented Generation takes the opposite approach: it preloads a body of context into the model's active memory before any question arrives, then answers directly from what's already there. There's no search step, because there's nothing left to search for, the relevant material is already in hand.

That preloading makes CAG fast once it's set up. There's no retrieval delay, the model already has what it needs and can respond immediately. But the tradeoff is capacity: a model's active context window can only hold so much, typically a few thousand words at a time. If the knowledge base is larger than that, it simply doesn't fit, the same way a backpack has a fixed capacity regardless of how much you'd like to carry.

That capacity limit also affects accuracy in a subtler way. With a large amount of context held at once, a model can occasionally blend unrelated pieces together, surfacing a detail that's technically present but not actually relevant to what was asked.

## Freshness is where the difference matters most

The two approaches also diverge sharply on how well they handle changing information. RAG can absorb new content almost immediately: add a document to the index, and the next search can find it. CAG is slower to update, because new information usually means reloading and repacking the entire cached context, not just appending one new fact.

## Choosing between them is a judgment about how the content behaves

The right choice comes down to how the underlying knowledge actually behaves, not which technique sounds more advanced. CAG is a strong fit for stable, slow-changing material: an internal support bot whose knowledge base updates once a year doesn't need to re-search anything, everything relevant can live in memory permanently. RAG is the better fit for anything large or fast-moving: legal research pulling in new case law, or a system that needs to reflect information that changes weekly rather than yearly.

Neither one is simply the better technology. They're built for different shapes of problem, and the actual engineering judgment is recognizing which shape you're solving for before picking a tool that happens to be trendy.
