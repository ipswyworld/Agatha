use crate::shadows::ShadowAction;

pub struct K8sNamespaceEscape;
impl ShadowAction for K8sNamespaceEscape {
    fn name(&self) -> &'static str { "K8s Namespace Escape" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct DockerSocketAbuse;
impl ShadowAction for DockerSocketAbuse {
    fn name(&self) -> &'static str { "Docker Socket Abuse" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct IamOverPermissionExploit;
impl ShadowAction for IamOverPermissionExploit {
    fn name(&self) -> &'static str { "IAM Over-Permission Exploit" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct S3MassDataExfiltration;
impl ShadowAction for S3MassDataExfiltration {
    fn name(&self) -> &'static str { "S3 Mass Data Exfiltration" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct LambdaExecutionTimeTheft;
impl ShadowAction for LambdaExecutionTimeTheft {
    fn name(&self) -> &'static str { "Lambda Execution Time Theft" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}
