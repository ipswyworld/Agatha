use crate::shadows::ShadowAction;

pub struct GeneticDataCorruptor;
impl ShadowAction for GeneticDataCorruptor {
    fn name(&self) -> &'static str { "Genetic Data Corruptor" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct QuantumDecoherenceAttack;
impl ShadowAction for QuantumDecoherenceAttack {
    fn name(&self) -> &'static str { "Quantum Decoherence Attack" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct EntropyStarvation;
impl ShadowAction for EntropyStarvation {
    fn name(&self) -> &'static str { "Entropy Starvation" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct TotalEntropy;
impl ShadowAction for TotalEntropy {
    fn name(&self) -> &'static str { "Total Entropy" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}
