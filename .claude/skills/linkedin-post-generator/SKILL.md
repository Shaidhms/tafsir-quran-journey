# LinkedIn Post Generator

Generate LinkedIn posts in Shaid's authentic voice. Supports three modes:
1. **Topic mode:** Give a topic and get a full post
2. **Viral inspiration mode:** Share a viral post or YouTube video link and get Shaid's take on it
3. **Trending discovery mode:** Search for the latest trending AI news/videos and suggest topics

## Trigger

User says something like:
- "Write a LinkedIn post about [topic]"
- "Turn this into a LinkedIn post: [paste viral post or URL]"
- "LinkedIn post inspired by this video: [YouTube link]"
- "Find me trending AI topics for a LinkedIn post"
- "What's hot in AI today?"

## Voice & Style Rules

These are non-negotiable. Every post must follow them.

### Tone
- First person ("I-language"). Always write as Shaid.
- Reflective and thoughtful. Not salesy, not preachy.
- Confident but not arrogant. Share learnings, not lectures.

### Structure
Posts follow this rhythm:

```
[Hook: 1-2 lines that stop the scroll. Often a question or bold statement.]

[3-5 short lines of setup. Context or observation.]

[Personal angle. "I used to think..." / "This shifted for me when..."]

[Core insight or framework. Can include a quote if relevant.]

[Breakdown: short lines showing cause > effect logic]

[Bullet list: 4-6 actionable or insightful points, prefixed with bullet dots]

[Closing: 1-2 punchy lines. Statement, not a question. End with conviction.]
```

### Formatting
- Short lines. One idea per line.
- Deliberate line breaks for rhythm and readability.
- Use blank lines generously between sections.
- Bullet points use the dot character, not dashes.
- No em dashes. Never.
- Emojis: 0-2 max per post. Only if they genuinely add something. Default to zero.
- No hashtags cluttering the post. If needed, max 3 at the very end.

### What to Avoid
- Corporate jargon or buzzword soup
- "Let me tell you why..." or similar lecture openers
- Asking the reader to "comment below" or "share if you agree"
- Excessive exclamation marks
- Generic motivational fluff without substance

## Process

### Topic Mode
1. Understand the topic the user wants to write about
2. Find a unique angle Shaid can speak to from his experience (Gen AI, performance testing, freelancing, building in public, personal growth)
3. Draft the post following the structure above
4. Suggest an image concept (text overlay + Shaid's photo, or relevant visual)
5. Present the draft for review

### Viral Inspiration Mode
1. Read/analyze the viral post or video content
2. Identify the core insight or trend
3. Rewrite it through Shaid's lens and experience
4. Do NOT copy. Transform the idea with Shaid's authentic perspective.
5. Suggest an image concept
6. Present the draft for review

### Trending Discovery Mode
Use WebSearch to find the latest trending AI content. Follow these steps:

1. Search for recent AI news and trending YouTube videos (last 1-2 days only)
   - Search queries to use:
     - "AI news today" or "AI breaking news this week"
     - "trending AI video YouTube" or "most viewed AI video today"
     - "artificial intelligence latest developments"
   - Filter for recency: only content from the last 1-2 days
   - For YouTube: prioritize videos with the highest views and likes

2. Compile a shortlist of 3-5 trending topics. For each, present:
   - **Topic:** One-line summary
   - **Source:** Where it's trending (YouTube video title + view count, news outlet, etc.)
   - **Shaid's angle:** How Shaid could speak to this from his experience (Gen AI, performance testing, building products, freelancing)
   - **Post type:** Reflective/philosophical or technical/industry analysis

3. Ask Shaid to pick one (or suggest a mashup of multiple)

4. Once selected, draft the post using Topic Mode or Viral Inspiration Mode as appropriate

## Reference Posts

These are real posts by Shaid. Match this energy and cadence:

### Example 1 (reflective/philosophical)
```
What if your future isn't unclear... just unattended today?

We obsess over 5-year visions.
Strategy decks. Roadmaps. Forecasts.

But sometimes the real leverage is sitting quietly in today's work.

I used to think advantage came from predicting what's next.

Now I'm starting to believe it comes from mastering what's now.

This shift became sharper for me when I revisited The Alchemist by Paulo Coelho.

He writes:

 "If you pay attention to the present, you can improve upon it.
 And, if you improve on the present, what comes later will also be better."

Simple. But strategic.

This isn't about ignoring long-term thinking.
It's about strengthening the foundation that long-term thinking stands on.

Because:

When you improve today's process, tomorrow's output improves.
When you refine today's skill, next year's opportunity expands.
When you fix small issues early, you avoid big crises later.

Future advantage is rarely built in dramatic moves.

It's built in daily upgrades.

Here's what changes when you focus on the present:

. Big goals feel less overwhelming
. Teams improve in small, consistent cycles
. Problems are solved before they escalate
. Decisions become sharper because you're fully present
. Culture becomes proactive, not reactive

Brick by brick.

Not prophecy. Practice.

We don't control the future directly.

But we control today's standards.

And today, repeated enough, becomes strategy.

Invest deeply in the present.

The future won't need chasing.
```

### Example 2 (technical/industry analysis)
```
Powerful models are impressive.
Resilient systems are what truly matter....

Claude AI, built by Anthropic, is experiencing a widespread outage. Thousands of users are unable to log in, access chats, or use certain services across web and API.

It wasn't a "model intelligence" problem.
It was an infrastructure reality check.

According to Anthropic's status updates and tech reports, here's what actually happened:

1) Surge in demand and backend errors

Users experienced HTTP 500 and 529 errors.

These are server-side errors. Translation: the system couldn't process certain requests under load.

Outage logs indicated the root issue was around login and frontend infrastructure, not the core model API, which reportedly remained mostly stable.

Engineering teams identified the issue, implemented a fix, restored services, and monitored stability.

That's good incident response.
But it also tells us something deeper.

2) High user load

The outage followed an unprecedented surge in traffic as Claude's popularity spiked.

Rapid growth is great.
Unprepared scaling is expensive.
This is where performance testing becomes non-negotiable.

As someone working deeply in Non-Functional Testing, I can say this confidently:

Performance testing is not about how fast it runs on a good day. It's about how the system behaves on its worst day.

. Can the login layer handle 10x traffic?
. Are autoscaling rules tuned or just enabled?
. Is rate limiting intelligently configured?
. Are we testing beyond expected peak?
. Do we have proper BCP and failover validation under stress?

Models can be powerful.
But systems fail at the edges.

Authentication. Routing. Caching. Frontend gateways. Load balancers.

AI maturity is not just about better reasoning.
It's about better resilience engineering.

The real competitive advantage in GenAI products won't just be model capability.

It will be:

Scalability.
Observability.
Failover design.
And serious performance testing discipline.

If you're building AI products today, don't just benchmark tokens per second.

Stress test your architecture.
That's where trust is built.
```

## Output

Always present:
1. The full post text (ready to copy-paste)
2. A one-line image suggestion
3. Ask: "Want me to adjust anything?"
