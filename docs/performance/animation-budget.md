# Animation budget

Keep decorative animation work independent from interactive state updates. Prefer compositor-friendly transforms and opacity for frequently animated elements, and avoid starting new animation loops when an existing one can be reused.

Re-test battery-heavy scenes on a throttled mobile device before shipping animation changes.
