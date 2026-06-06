use crate::shadows::ShadowAction;

pub struct RopChainConstruction;
impl ShadowAction for RopChainConstruction {
    fn name(&self) -> &'static str { "ROP Chain Construction" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct AslrBypass;
impl ShadowAction for AslrBypass {
    fn name(&self) -> &'static str { "ASLR Bypass" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct ThermalThrottlingAttack;
impl ShadowAction for ThermalThrottlingAttack {
    fn name(&self) -> &'static str { "Thermal Throttling Attack" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct VoltageManipulationHammer;
impl ShadowAction for VoltageManipulationHammer {
    fn name(&self) -> &'static str { "Voltage Manipulation (Hammer)" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct DllSideLoading;
impl ShadowAction for DllSideLoading {
    fn name(&self) -> &'static str { "DLL Side-Loading" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct ProcessHollowing;
impl ShadowAction for ProcessHollowing {
    fn name(&self) -> &'static str { "Process Hollowing" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct EntitlementBloatExploit;
impl ShadowAction for EntitlementBloatExploit {
    fn name(&self) -> &'static str { "Entitlement Bloat Exploit" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct AdvancedSqlInjection;
impl ShadowAction for AdvancedSqlInjection {
    fn name(&self) -> &'static str { "Advanced SQL Injection" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}
