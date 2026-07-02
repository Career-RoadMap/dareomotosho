# Why "it depends" is the most honest thing an architect can say

Ask any architect, cloud, enterprise, AI, doesn't matter which, the same two words eventually surface: it depends. It isn't evasion. It's an accurate description of how architectural decisions actually get made, and any architect who skips straight to a confident answer without asking a single clarifying question is usually skipping the part of the job that matters most.

I saw this play out clearly in a recent session with learners. Someone asked me how to implement a particular solution, and before I could even answer, another learner posted in the chat: "Dare's response is _it depends_." He was right. There's no universal template for a good architecture, and pretending otherwise is where bad advice comes from.

## There is no perfect architecture

I tell mentees this constantly: there's no such thing as a perfect architecture, only trade-offs managed well, informed by experience, the well-architected frameworks, business priorities, and what the customer actually needs. Nothing about how a solution should be built is written in stone. The only real discipline is trading correctly, not trading away nothing.

Take a question that sounds simple: what database should I use? My answer is always the same two words. Answering it properly means understanding whether the data is structured or unstructured, whether it's processed in batches or in real time, and what insight you're actually trying to extract from it. That's not a database question. That's a data strategy question, and skipping it is how teams end up locked into the wrong choice.

## Recommend the use case, not the vendor

How an e-commerce platform handles data looks nothing like how a machine learning pipeline or a business intelligence system handles it, because the creation, processing, and intended insight are all different. My job as an architect is to recommend the right category of solution for a given use case, a structured database here, a vector database there, a knowledge graph somewhere else, not to push a specific vendor. Which vendor gets picked within that category is usually a call the developers make, based on their own expertise and preference.

That distinction matters more than it sounds. Putting a vendor ahead of the actual business need, especially on the strength of a marketing pitch rather than genuine fit, is close to a betrayal of the role. If a product genuinely outperforms the major cloud providers for what the business actually needs, recommend it. If it doesn't, recommending it anyway because of a slick pitch does real damage, and I don't take that lightly. Good recommendations require a holistic view of the business's objectives, its real use cases, and its costs, not a scorecard of vendor features.

## Executives want a product. Architects need a diagnosis first.

The hardest part of this job isn't technical, it's educational. Executives, including plenty at the C-suite level, often come to an architect with a problem and the expectation of a specific product as the answer. I've learned to ask for time instead. A doctor who prescribes treatment before diagnosing the problem isn't practicing medicine well, and an architect who names a product before understanding the actual problem isn't practicing architecture well either. Digging into the problem before offering a solution isn't a lack of confidence. It's the entire job.

## The mantra is the discipline

"It depends" isn't a hedge. It's a commitment to finding the right fit instead of handing someone a prescriptive answer that happens to be wrong for their actual situation. Architecture done well is never about knowing the most tools. It's about knowing which trade-offs a specific business, with its specific constraints, should actually make, and having the discipline to ask before you answer.
