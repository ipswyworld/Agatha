use crate::shadows::ShadowAction;

pub struct EvidenceAlteration;
impl ShadowAction for EvidenceAlteration {
    fn name(&self) -> &'static str { "Evidence Alteration" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct ForensicArtifactRemoval;
impl ShadowAction for ForensicArtifactRemoval {
    fn name(&self) -> &'static str { "Forensic Artifact Removal" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct AcousticExfiltrationV2;
impl ShadowAction for AcousticExfiltrationV2 {
    fn name(&self) -> &'static str { "Acoustic Exfiltration v2" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct MemoryStringErasure;
impl ShadowAction for MemoryStringErasure {
    fn name(&self) -> &'static str { "Memory String Erasure" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}
