use crate::shadows::ShadowAction;

pub struct GitCommitSpoofing;
impl ShadowAction for GitCommitSpoofing {
    fn name(&self) -> &'static str { "Git Commit Spoofing" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct CicdPipelineInjection;
impl ShadowAction for CicdPipelineInjection {
    fn name(&self) -> &'static str { "CI/CD Pipeline Injection" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct MaliciousDependencyPublish;
impl ShadowAction for MaliciousDependencyPublish {
    fn name(&self) -> &'static str { "Malicious Dependency Publish" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct IacStateHijack;
impl ShadowAction for IacStateHijack {
    fn name(&self) -> &'static str { "IaC State Hijack" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}
