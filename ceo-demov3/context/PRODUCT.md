# Product

## Product thesis

AmbitionBox helps a jobseeker search intentionally: find opportunities that genuinely match, understand what is real about the company and compensation, strengthen the evidence needed to compete, and act on the most useful next move.

The onboarding story currently focuses on the job search, not the entire career.

**Naming, revised 2026-09-10.** The product is **North**. North is the agent — the thing
that reads the inbox, ranks the day, drafts the reply and moves the card. **AmbitionBox is
the evidence North cites**: the ratings, the salary estimates, the review counts, and the
byline under the wordmark. Keep that split exactly. "Career Assistant" and "Career Copilot"
remain out.

## The user promise

AmbitionBox combines four jobs that usually feel disconnected:

1. Discover roles across sources and rank what matches the user's preferences.
2. Explain company reality using pay, ratings, reviews, work policy, and employee evidence.
3. Improve the user's shot through profile gaps, résumé support, interview preparation, drafting, and negotiation guidance.
4. Organize live job-search activity and surface the next action worth taking.

The product is not asking users to fire arrows everywhere. It helps them recognise the opportunity they care about and give that opportunity their best shot.

## Trust boundaries

- Gmail, Naukri, résumé import, installed-app detection, and all accounts are deterministic simulations.
- Signing in is separate from granting inbox access.
- Email connection is optional and read-only in the story.
- Nothing is sent, accepted, applied to, or changed without review.
- Unknown evidence stays unknown; the UI offers a next step instead of inventing certainty.
- Company-wide evidence is context, not a guarantee about a specific team.
- Preference Match means role-to-preference alignment. Profile Readiness means captured evidence. Never merge or relabel them.

## Canonical runtime truth

Read `src/data.js` before changing any named person, company, role, compensation value, application count, date, source, rating, match value, readiness value, or journey preset. Context documents must link to those exports rather than creating a competing fixture set.

## Onboarding objective

Move a new user from a credible first promise to reviewed career context, reviewed preferences, an optional live-search connection, and a clear Home handoff. Naukri is the golden path because it can prefill the profile, résumé, and preferences while keeping review and control visible. Google and Apple remain complete alternatives.

## Naukri profile transfer contract

The Naukri golden path is a comprehensive career-profile transfer, not a thin autofill shortcut. Import all career-relevant information available in the simulated Naukri profile, including:

- identity and contact details needed for the account;
- résumé file and available résumé metadata;
- résumé headline and profile summary;
- current professional details and complete employment history;
- total experience, role, employer, industry, function, compensation, availability, and location details when present;
- skills, certifications, projects, work samples, accomplishments, and recognitions;
- education history;
- job preferences, including desired roles, compensation, locations, work mode, and employment type.

Gender is intentionally excluded from the AmbitionBox transfer because it is not required for matching, guidance, or profile readiness. Do not turn an owner's instruction to “take it all” into permission to expose unrelated sensitive data without a product use.

Imported, résumé-parsed, and inferred values must retain distinct provenance. Missing, stale, or conflicting values remain visible instead of being silently normalised. Naukri application history, recruiter conversations, and inbox contents do not populate Tracker in this onboarding chapter; application tracking remains the later optional email-connection outcome.
