# The Library: Agatha's Sovereign Learning Ecosystem

## Overview
**The Library** is the central nervous system for Project Agatha's autonomous evolution. Operating as a 24/7 sovereign learning ecosystem, it ensures that Agatha remains at the absolute frontier of cyber-intelligence. By continuously ingesting global threat data, simulating adversarial engagements, and refining her own neural weights, The Library transforms Agatha from a static model into a dynamic, self-evolving guardian.

## Architecture Wings

The Library is structured into four specialized wings, each critical to the recursive improvement cycle:

### 1. The Archives (`skills/`, `tools/`)
The foundation of Agatha's knowledge. This wing manages the ingestion of global security data, CVE databases, and novel exploit tactics. 
- **Ingestion:** Automated collection of technical primitives and defensive patterns.
- **Archiving:** Cataloging of newly developed skills and tools derived during simulations.

### 2. The Curriculum (`curator.py`, `trainings/`)
The intelligence layer that directs Agatha's focus. Guided by `The Curator`, this wing analyzes performance gaps and emerging external threats to prioritize training objectives.
- **Curator:** An intelligence-driven engine that reviews battle logs and archive updates.
- **Trainings:** Dynamically generated curriculum files that define the focus areas for the next evolution cycle.

### 3. The Proving Grounds (`gyms/`, `war_room/`)
The tactical refinement arena. This wing hosts continuous, high-fidelity simulations where Agatha tests her capabilities in both solo and adversarial environments.
- **Gyms:** Scoped environments (Agathos for defense, Kakos for offense) for targeted tactical drilling.
- **War Room:** The site of 24/7 adversarial self-play (Red vs. Blue) simulations, generating the raw data required for neural consolidation.

### 4. The Forge (`forge/`)
The manufacturing plant for intelligence. This wing handles the technical process of consolidating simulation successes into Agatha's core model.
- **Neural Consolidation:** Distilling tactical breakthroughs into permanent weights.
- **LoRA Fine-tuning:** Rapid adaptation through Low-Rank Adaptation to master specific, high-priority threats identified by The Curator.

## Usage

To activate the 24/7 learning operations and open The Library, execute the orchestrator:

```bash
python agatha-brain/library/the_librarian.py
```

`The Librarian` will automatically:
1. Initialize the Proving Grounds (Gyms and War Room).
2. Start the continuous Curation Cycle to update knowledge and training focus every hour.
3. Orchestrate the flow of data between the Archives and the Forge.

## Core Technologies

*   **24/7 Adversarial Self-Play:** Agatha continuously battles instances of herself and external "Shadow" agents in the War Room to identify weaknesses before they can be exploited by real-world adversaries.
*   **GAN-style Evolution:** Utilizing Generative Adversarial Network principles, the offensive (Kakos) and defensive (Agathos) wings push each other to higher levels of sophistication in a recursive loop.
*   **Mock Mode Simulations:** Safe execution environments that allow for the "dry-run" of destructive exploits and defensive countermeasures without risking system integrity.
*   **Intelligence-Driven Curation:** Training is never random; it is a surgical response to the delta between Agatha's current performance and the evolving global threat landscape.
