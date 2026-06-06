use crate::shadows::ShadowAction;

pub struct MobileIntentInjection;
impl ShadowAction for MobileIntentInjection {
    fn name(&self) -> &'static str { "Mobile Intent Injection" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct SimSwapSocialEngineering;
impl ShadowAction for SimSwapSocialEngineering {
    fn name(&self) -> &'static str { "Sim-Swap Social Engineering" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct MobilePermissionEscalation;
impl ShadowAction for MobilePermissionEscalation {
    fn name(&self) -> &'static str { "Mobile Permission Escalation" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}
