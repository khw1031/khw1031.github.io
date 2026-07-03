# Render Primitives Reference

Use this reference after choosing the formula family. A different equation should usually create a different primitive mix. If every concept becomes curves, points, edges, and circular voids, the renderer is over-constraining the interpretation.

## Primitive Selection Rule

Choose primitives from the math family first, then choose Three.js objects. Do not start from the current renderer's convenient primitives and make the formulas fit.

## Continuity Rule: Points vs Lines (do not clump)

Match the primitive to the object's continuity, or the render collapses into a clumped scribble:

- A **continuous** object (function `y=f(x)`, parametric curve, contour, flow line) is a **polyline**. Consecutive samples are neighbors, so connecting them is correct.
- A **discrete iterated system** (map, recurrence, strange attractor, sampled scatter) is a **point cloud**. NEVER connect successive iterates: consecutive iterates of a chaotic map jump across the whole set, so line segments cross the entire figure and destroy the density structure. Render as unconnected points.
- Density is the aesthetic of an attractor. Use enough iterates (tens of thousands to hundreds of thousands) and low per-point opacity so frequently-visited regions accumulate into the structure. A few thousand connected points is the classic failure mode — it looks like a tangle, not the attractor.
- This is why a 2D attractor (e.g. Clifford) is beautiful even without 3D: the beauty is visit-density, not depth. Do not "fix" a clumped attractor by adding a Z axis; fix the primitive (points) and the sample count first.

## Dimensionality Rule: Every Pattern Occupies 3D Volume

This applies to ALL patterns, not just attractors. If a pattern is meant to be rotated in 360°, it must have real volume, or it collapses to a line edge-on and the rotation is pointless. Build depth into the object itself:

- Iterated systems: use a genuinely 3D system (x, y, z recurrence / flow), not a 2D map embedded in a plane.
- Parametric curves: give them a `z(t)` so the curve is a space curve, not a flat outline.
- Swept families: place each sweep value on its own depth plane (z = sweep value) so the family stacks into a volume.
- Optionally overlay rotated copies of the object (instances about an axis) to build a symmetric solid.

Enforce it mechanically: assert every pattern's rendered geometry has non-trivial z-extent relative to its x/y extent, so a flat pattern fails the audit.

## Viewing Rule: Rotation-Invariant Framing

If a pattern can be rotated, frame it by its **bounding sphere** (max distance from its center), not by per-axis extents. An orthographic view sized to the bounding-sphere diameter keeps the object at a constant scale and always in-frame at every angle.

## Expanded Primitive Vocabulary

| Primitive | Definition | Three.js direction | Good semantic fit |
| --- | --- | --- | --- |
| `curve` | Sampled path through a state or coordinate system. | `Line`, `Line2`, tube mesh | trace, transfer, route, rhythm |
| `ribbon` | Curve with width, twist, or pressure. | strip geometry, tube with varying radius | inscription, fabric, signal, handwriting |
| `surface` | Continuous 2D manifold in 3D. | `BufferGeometry` mesh | membrane, terrain, sheet, boundary |
| `isosurface` | Mesh extracted from scalar field threshold. | marching cubes to mesh | fog boundary, hidden form, density shell |
| `volume` | Semi-transparent 3D field or layered slices. | instanced planes, volume texture | uncertainty, atmosphere, memory, depth |
| `particle` | Many local agents following field or rule. | `Points`, instanced meshes | swarm, dust, diffusion, crowd, noise |
| `graph` | Nodes and relation edges. | instanced nodes, curve edges | dependency, archive, cause, memory |
| `lattice` | Repeating discrete support structure. | instanced mesh grid | schedule, infrastructure, cells, protocol |
| `cell` | Area partition around source points. | polygon mesh, line boundaries | territory, ownership, mosaic, cracks |
| `contour` | Isoline of scalar field. | line strips from sampled scalar grid | pressure, risk, semantic density |
| `band` | Filled interval between contours or states. | mesh strips, transparent planes | thresholds, strata, timeline layers |
| `mask` | Region that hides, reveals, or gates marks. | stencil, alpha map, SDF test | privacy, censorship, memory gap |
| `cut` | Subtractive boundary or deletion operation. | SDF difference, clipped geometry | absence, failure, wound, edit |
| `void` | Meaningful empty region. | SDF cutout, mask, transparent mesh | loss, reserved space, silence |
| `glyphless trace` | Mark that implies writing without letters. | ribbons, pressure curves, stipple field | read/write, notation, inscription |
| `heatmap` | Scalar field rendered as color or density. | shader material, texture plane | evidence, confidence, load, risk |

## Formula-To-Primitive Mapping

| Formula family | Primary primitive | Secondary primitive |
| --- | --- | --- |
| Parametric curve | curve, ribbon | particle trail, pressure nodes |
| Recurrence | trajectory, graph | phase portrait, residual marks |
| Vector field | particle, field line | contour, ribbon, vector glyphs |
| Noise/fBM | surface, heatmap, volume | displaced particles, contours |
| Reaction-diffusion | texture field, cell bands | contour, eroded mask |
| Graph grammar | graph | clusters, bridges, weighted ribbons |
| L-system | branching skeleton | leaf-like surfaces, growth traces |
| Cellular automaton | cell lattice | time slices, state bands |
| Voronoi/Delaunay | cell, lattice | cracked edges, source particles |
| SDF/implicit field | surface, mask, cut | contour, shell, void |
| Residual/compression | heatmap, mask | missing bands, quantized blocks |
| Transport/morph map | paired surfaces, ribbons | before/after fields, gate membrane |

## Three.js Implementation Notes

- Prefer `BufferGeometry` for generated meshes, ribbons, lattices, particles, and contour strips.
- Use instancing for repeated nodes, cells, particles, or lattice units.
- Use shader materials when the primitive is fundamentally a scalar field, mask, heatmap, or procedural texture.
- Use orthographic cameras for diagram-like formula objects and perspective cameras for volumetric or sculptural scenes.
- Keep interaction separate from interpretation. Rotate, scale, export, and copy state are tool behaviors, not semantic primitives.
- Encode the chosen primitive family in data so that future patterns can be compared mechanically.

## Current Renderer Warning

The current repository has strong support for curve families, points, edges, and void circles. That convenience is useful for shipping, but it can cause visual convergence. For new concepts, check whether the selected math family needs one of these changes:

- add mesh or ribbon generation
- add scalar field sampling
- add SDF masks or cuts
- add cell or lattice geometry
- add particle simulation
- add contour extraction

If the concept needs one of those, implement the primitive extension instead of reducing the idea to another orbit field.
