# Keberoast Case Study

*The Cost of Uptime at Aegis Health (Well Architected Framework)*

## The Corporate Background & Strategic Context

Aegis Health Logistics, a regional supplier of medical equipment, had just completed the acquisition of a smaller competitor to expand its Midwest distribution network. As part of the merger, Aegis inherited "Apex," a 12-year-old legacy inventory management application that processed over **$4 million in daily supply orders**. The business was under immense pressure from the board to integrate the acquisition smoothly without disrupting quarterly revenue.

## The Incident

During the integration audit, Sarah Jenkins, Aegis's CISO, discovered a critical vulnerability. The Apex application ran on a dedicated Active Directory service account (svc_apex). Because the application was poorly documented, the IT team had never changed the service account's password since **2014**. Worse, to make sure the application "just worked," previous administrators had lazily granted svc_apex full **Domain Admin privileges**. Sarah immediately drafted a risk memo to David Torres, the VP of Infrastructure, demanding an immediate password rotation or a migration to an automated Group Managed Service Account (gMSA).

## The Boardroom Collision

**David Torres (VP of Infrastructure):** "Sarah, we don't have the original vendor support for Apex. If we force a password rotation on that service account, there is a **90% chance** the application crashes. If Apex goes offline, we halt **$4 million a day** in medical shipments. Our perimeter firewalls are state-of-the-art. Let the firewalls do their job and leave production alone. We accept the risk to maintain business continuity."

**Sarah Jenkins (CISO):** "The firewall is irrelevant. If an attacker gets even the lowest level of access inside the building, they can request the encrypted ticket for svc_apex from our Kerberos system, take it offline, and crack it. They don't have to bypass our firewalls; they just have to ask our own system to hand them the keys."

The CEO sided with David to protect the **$4M daily revenue**. Three months later, a warehouse shipping clerk clicked on a phishing email. The attacker gained standard user access, queried Active Directory for the svc_apex ticket, and took it offline. Because the password hadn't been changed since 2014, it took their GPU array exactly **47 minutes** to crack it. Equipped with Domain Admin rights, the attacker bypassed all internal security and deployed ransomware to every server. Aegis Health was taken offline for **two weeks**, resulting in **$56 million in lost revenue**.

## The Decision Points

1. **The Uptime Dilemma:** If you were the CEO, how would you objectively weigh a guaranteed **$4M disruption** today against a hypothetical **$56M disruption** in the future? What data would you demand to make that decision?

2. **The Illusion of the Perimeter:** How does this case study prove that investing in expensive edge firewalls is an incomplete strategy without internal identity governance?

3. **The Rollback Compromise:** If you were Sarah, what operational safety net (rollback plan) could you have built with David's team to make the CFO feel comfortable authorizing the password change?
