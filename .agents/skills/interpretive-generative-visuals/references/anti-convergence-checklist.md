# Anti-Convergence Checklist

Use this checklist before asking for confirmation and again before implementation. Its purpose is to prevent unrelated concepts from collapsing into the same visual pattern.

## Hard Checks

Reject or redesign the grammar if any hard check fails.

- The grammar uses `curveFamily + points + edges + void circles` without a concept-specific reason.
- `orbit`, `circle`, `ring`, or polar layout appears only because previous examples used it.
- The coordinate system defaults to radial, cyclic, or centered composition without semantic support.
- The formula set is mostly `sin`, `cos`, phase offsets, and modular edges with changed constants.
- Negative space is represented by generic circular voids instead of a concept-specific absence, mask, cut, erosion, or gap.
- The expected visual difference from the last two patterns is only color, camera, rotation, or density.

## Required Differentiators

Before implementation, at least two of these should be true:

- A different primary formula family is used.
- A different primary primitive family is used.
- The coordinate system changes topology, not just scale or rotation.
- The concept defines a distinct material behavior such as diffusion, compression, cutting, branching, sorting, or decay.
- The negative space has a source-specific rule.
- Motion or interaction reveals a source-specific process.

## Derivation Audit

Write this audit in the confirmation brief or internal implementation note:

```txt
recent-pattern similarity risk:
primary family:
primary primitive:
coordinate topology:
specific negative-space rule:
formula families rejected:
primitive families rejected:
visual difference statement:
```

If the audit sounds interchangeable with another prompt, return to semantic interpretation.

## Seed And Randomness Guidance

- Use deterministic seeds for repeatable rendering.
- Derive seeds from the source phrase, abstraction, and selected formula family.
- Do not use a single global phase convention across patterns.
- Randomness should choose among semantically valid alternatives, not compensate for weak interpretation.
- If runtime generation is used, store the selected interpretation and formulas so that a good result can be reproduced.

## Similarity Review

Compare the new concept against recent patterns across these axes:

- silhouette
- dominant topology
- primitive mix
- density distribution
- coordinate system
- negative-space behavior
- motion model
- color semantics
- interaction model

Two patterns may share a utility renderer, but they should not share the same semantic primitive set unless they are intentionally a series.

## Forbidden Renderer Logic

These are shared-logic anti-patterns that silently force convergence even when the
interpretation is good. They are the usual reason a set of patterns looks the same
despite differing source words. Treat any of them as a defect to fix in the shared
renderer, not to work around per pattern.

- A fixed `family -> shape set` lookup with no per-concept override. This turns the
  renderer into a fixed style library; two same-family concepts become identical.
  Require a data-driven primitive override so a concept is never locked to a family.
- A universal overlay/debris layer (for example the same particle + fragment pass)
  appended to every concept. Overlays must be concept-specific data, not a default.
- A single global phase/seed convention shared by all patterns.
- A single shared camera, initial rotation, and motion model for all patterns.
- Authored per-concept layers that are silently discarded by the render path (dead
  code that makes the source look richer than what actually renders). Either render
  them or make the ignore explicit and documented.

## Mechanical Registry Audit

Guidance that is not enforced will be violated. Encode the audit as a test over the
pattern registry so a new pattern cannot converge silently. Assert, across all patterns,
that these are pairwise distinct:

- primary formula family
- declared coordinate topology (also non-empty per pattern)
- phase seed (no global phase)
- camera view (rotation/framing)
- color grammar (palette)
- motion model

If this test fails, do not relax the assertion. Return to semantic interpretation and
re-derive the offending pattern. In this repository the audit lives in
`tests/pattern-audit.test.ts`, the per-pattern equation/topology/palette data lives in
`src/lib/plot/patterns.ts` (rendered by the `src/lib/plot/plotter.ts` expression
engine), and the test runs in the `prebuild` script so `astro build` fails on a
converging or empty pattern — not only in CI.

Overlay subordination (doc-enforced, hard to assert mechanically): the primary family
primitive must visually dominate. Keep semantic overlays fewer and lower-opacity than
the primary primitive. If an overlay actually carries the concept (for example a
"constellation" of markers), promote it to the primary primitive instead of leaving a
faint primary buried under debris. A family change that is invisible because overlays
dominate is not a real change.
