use crate::shadows::ShadowAction;

pub struct CurrencyDevaluationBot;
impl ShadowAction for CurrencyDevaluationBot {
    fn name(&self) -> &'static str { "Currency Devaluation Bot" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct SmartCityParalysis;
impl ShadowAction for SmartCityParalysis {
    fn name(&self) -> &'static str { "Smart-City Paralysis" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct DeepSeaCableSabotage;
impl ShadowAction for DeepSeaCableSabotage {
    fn name(&self) -> &'static str { "Deep-Sea Cable Sabotage" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct EconomicRansom;
impl ShadowAction for EconomicRansom {
    fn name(&self) -> &'static str { "Economic Ransom" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct SatelliteHijacking;
impl ShadowAction for SatelliteHijacking {
    fn name(&self) -> &'static str { "Satellite Hijacking" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct InfrastructureBrownout;
impl ShadowAction for InfrastructureBrownout {
    fn name(&self) -> &'static str { "Infrastructure \"Brownout\"" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct RemoteHardwareDisable;
impl ShadowAction for RemoteHardwareDisable {
    fn name(&self) -> &'static str { "Remote Hardware Disable" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct NetworkTsunami;
impl ShadowAction for NetworkTsunami {
    fn name(&self) -> &'static str { "Network \"Tsunami\"" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}
