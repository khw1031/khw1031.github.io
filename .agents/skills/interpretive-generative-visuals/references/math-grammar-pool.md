# Math Grammar Pool

Use this pool to choose formula families after the semantic profile is defined. This is a set of candidate mathematical grammars, not a style preset library. Do not choose a family because it is easy to render. Choose it because the semantic forces require it.

## Selection Rules

- Pick 1 primary family and 1-2 secondary families.
- Explain why at least 2 plausible families were rejected.
- Avoid `sin`, `cos`, `tau`, polar coordinates, and circular orbits unless rhythm, rotation, periodic return, enclosure, or phase is semantically central.
- Prefer a family that changes topology, primitive mix, or material behavior over one that only changes constants.
- If the renderer cannot express the selected family, extend the renderer instead of forcing the concept back into curves, points, edges, and void circles.

## Formula Families

### Parametric Curves And Splines

Use when the concept is a path, trace, gesture, transfer, handwriting-like pressure, or continuous motion.

Candidate forms:

```txt
P(u) = (x(u), y(u), z(u))
P(u) = sum_k a_k sin(k u + phi_k) + b_k cos(k u + psi_k)
P(u) = Bezier(A, B, C, D, u)
```

Avoid using this as the default. A curve family without semantic pressure often becomes the same visual again.

### Recurrence And Dynamical Systems

Use when a concept feeds back into itself, iterates, learns, repeats, spirals, branches by state, or fails to converge.

Candidate forms:

```txt
s_{t+1} = F(s_t, input, theta)
x_{n+1} = r x_n (1 - x_n)
p_{t+1} = A p_t + beta tanh(B p_t) + epsilon_t
```

Good for overthinking, habit, revision, memory loops, escalation, and error accumulation.

### Vector Fields, Potential Fields, Curl Fields

Use when invisible forces pull, repel, circulate, compress, or transport material.

Candidate forms:

```txt
v(p) = -grad Phi(p)
v(p) = curl A(p)
p_{t+1} = p_t + dt * v(p_t)
Phi(p) = sum_i w_i / (epsilon + ||p - c_i||^alpha)
```

Good for pressure, attraction, avoidance, containment, migration, and semantic gravity.

### Noise, fBM, And Stochastic Fields

Use when the concept contains texture, uncertainty, material grain, organic drift, terrain, cloud, damage, or local irregularity.

Candidate forms:

```txt
n(p) = noise(p)
fbm(p) = sum_i amp_i * noise(freq_i * p)
p' = p + strength * grad noise(p)
```

References: Ken Perlin's original noise paper and improved noise paper are useful background for gradient noise and procedural texture: [1985 PDF](https://www.cs.drexel.edu/~david/Classes/Papers/p287-perlin.pdf), [2002 PDF](https://www.cs.cmu.edu/~jkh/462_s07/paper445.pdf).

### Reaction-Diffusion And Turing Patterns

Use when local interaction creates global pattern: growth, skin, corrosion, chemical diffusion, contagion, competing agents, stains, or biological patterning.

Candidate Gray-Scott style form:

```txt
du/dt = D_u laplacian(u) - u v^2 + F(1 - u)
dv/dt = D_v laplacian(v) + u v^2 - (F + k)v
```

References: Turing's morphogenesis paper, Pearson's simple pattern system, and Turk's reaction-diffusion textures: [Turing page](https://royalsocietypublishing.org/rstb/article/237/641/37/112910/The-chemical-basis-of-morphogenesis), [Pearson PDF](https://www3.nd.edu/~powers/pearson.pdf), [Turk PDF](https://faculty.cc.gatech.edu/~turk/my_papers/reaction_diffusion.pdf).

### Graph Grammars And Force-Directed Layouts

Use when relations, dependency, citation, memory, social structure, routes, or causality matter more than continuous geometry.

Candidate forms:

```txt
E = {(i, j) | relation(i, j) satisfies rule}
F_attr(i, j) = k_a log(d_ij / L)
F_rep(i, j) = -k_r / d_ij^2
```

Reference: Fruchterman and Reingold force-directed placement: [PDF](https://www.reingold.co/force-directed.pdf).

### L-Systems And Rewriting Grammars

Use when the concept grows by symbolic rules: plants, branching, procedures, nested instructions, recursion, lineage, and protocol expansion.

Candidate form:

```txt
axiom: A
rules: A -> F[+A][-A]FA
render: turtle(rule^n(axiom))
```

Reference: Prusinkiewicz and Lindenmayer's algorithmic botany work: [The Algorithmic Beauty of Plants PDF](https://algorithmicbotany.org/papers/abop/abop.pdf).

### Cellular Automata

Use when local state rules produce emergent global order: grid behavior, epidemic spread, crowding, erosion, repair, crystallization, or simple local decisions.

Candidate form:

```txt
c_{t+1}(i, j) = rule(c_t(i, j), neighbors(c_t, i, j))
```

Vary neighborhood, state count, birth/death conditions, anisotropy, and boundary behavior from the semantic profile.

### Voronoi, Delaunay, Lattices, And Tilings

Use when ownership, territories, cells, cracks, allocation, proximity, packing, mosaics, or nearest-source influence matters.

Candidate forms:

```txt
cell_i = {p | dist(p, s_i) <= dist(p, s_j) for all j}
edge = dual(cell_i, cell_j)
```

Reference: Aurenhammer's Voronoi survey: [PDF](https://www.wias-berlin.de/people/si/course/files/Aurenhammer91-Voronoi.pdf).

### Signed Distance Fields, Level Sets, And Implicit Surfaces

Use when boundaries, membranes, holes, cuts, collision, shell thickness, soft Boolean operations, or sculptural form matter.

Candidate forms:

```txt
d(p) = min(d_a(p), d_b(p))
d_union = min(d1, d2)
d_intersection = max(d1, d2)
d_difference = max(d1, -d2)
surface = {p | d(p) = 0}
```

For 3D extraction, marching cubes can convert scalar fields to meshes. Reference: Lorensen and Cline's marching cubes paper: [PDF](https://www.cs.toronto.edu/~jacobson/seminar/lorenson-and-cline-1987.pdf).

### Contours, Isolines, And Scalar Fields

Use when pressure, elevation, confidence, risk, temperature, semantic density, or hidden intensity should be read as bands rather than objects.

Candidate forms:

```txt
f(p) = sum_i w_i K(||p - c_i||)
contour_k = {p | f(p) = k}
```

Good for diagnostic, atmospheric, analytic, and evidence-based concepts.

### Residual, Error, And Compression Fields

Use when the concept involves approximation, loss, memory, revision, summarization, failure, archive gaps, or signal compression.

Candidate forms:

```txt
r(p) = original(p) - reconstructed(p)
q(p) = quantize(f(p), levels)
loss = ||x - decode(encode(x))||
```

This family is useful for making absence and distortion visible without adding decorative void circles.

### Transport, Interpolation, And Morph Maps

Use when the concept crosses from one domain to another: read to write, input to output, private to public, raw to processed, or question to answer.

Candidate forms:

```txt
T(u, v) = (1 - alpha) A(u, v) + alpha B(u, v)
p' = M p + b + nonlinear_gate(p)
```

The visual should show what is preserved, lost, folded, or amplified during transfer.

## Shader And Shape References

The Book of Shaders provides practical references for shaping functions, distance fields, noise, cellular texture, and ray marching:

- [Shaping functions](https://thebookofshaders.com/05/)
- [Shapes and distance fields](https://thebookofshaders.com/07/)
- [Book contents](https://thebookofshaders.com/)

Use these for implementation vocabulary, not as final visual templates.

## Rejection Prompt

Before finalizing a formula family, answer:

```txt
primary family:
why this concept needs it:
secondary families:
rejected family 1 and reason:
rejected family 2 and reason:
what topology changes compared with recent patterns:
what primitive changes compared with recent patterns:
```
