# Request right-sizing: Reclaiming Your Kubernetes Runway

Question 1: "You cut thirty percent — is that durable, or does it creep back, and what did we trade for it?" (CFO / board)

High-Authority Answer: The saving is durable only if it's a control loop, not a project: usage drifts, so recommendations must run continuously (VPA in recommendation mode) with policy-as-code preventing regression at admission time. The trade is a defined headroom band derived from our latency SLO — we intentionally leave slack as priced insurance against tail latency, because queueing behavior makes the last few points of utilization the most expensive in latency terms. I report the result as both cost per month and days of runway added, and I can show the slack-versus-risk curve we're operating on.

The impostor syndrome: "I cut it once, but if it creeps back they'll say I never really fixed anything — and I can't promise it won't." The reality: You're not being asked to promise permanence; you're being asked to show a control loop and a named safety margin. "Durable because it's continuous, bounded because it's tied to our SLO" is a stronger answer than any one-time number — and it's true.

Question 2: "If VPA is setting requests automatically, what's your blast radius when it's wrong, and how do you bound it?" (CTO)

High-Authority Answer: Three bounds. First, high-criticality workloads run VPA in recommendation mode with a human gate, not auto-eviction. Second, min/max request bounds cap how far any recommendation can move, and PodDisruptionBudgets cap concurrent eviction. Third, I treat CPU and memory asymmetrically: CPU under-provisioning throttles and self-heals, so I tune it tighter; memory under-provisioning OOMKills, so I keep a wider margin. And I never run HPA and VPA on the same CPU signal — they fight. The failure mode is contained to graceful degradation, not cascading crash.

The impostor syndrome: "If I let automation set requests and it takes down a service, that's on me — maybe I shouldn't automate at all." The reality: Bounding blast radius is a design skill, not a leap of faith. Recommendation-mode gating, min/max bounds, PDBs, and the CPU/memory asymmetry are concrete guardrails; knowing them is exactly what separates competent automation from reckless automation — and you now know them.

Question 3: "How do you make sure the team that causes the waste is the team that owns it?" (CEO / auditor)

High-Authority Answer: Cost allocation by namespace and labels, surfaced as per-team showback under the FinOps Inform phase, so the engineer who sets the request sees the bill — that closes the externality where the app team feels the pager but not the cost. We enforce request presence and sane request-to-limit ratios with admission policy (OPA/Kyverno), so "no unbounded pods" is a control, not a convention — which is simultaneously a cost guardrail and an availability guardrail against noisy-neighbor starvation. Ownership sits with the app teams via a platform paved road; the platform team provides the capability, not a policing function.

The impostor syndrome: "I can fix the config, but making other teams own their costs sounds like org politics I have no authority over." The reality: You don't need authority to change behavior — you need visibility. Showback and a thin admission-policy floor let the incentive do the work; you're building a paved road, not policing people, and that's system design, not a political campaign.
