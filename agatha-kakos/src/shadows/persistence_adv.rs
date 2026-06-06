use crate::shadows::ShadowAction;

pub struct RegistryPersistence;
impl ShadowAction for RegistryPersistence {
    fn name(&self) -> &'static str { "Registry Persistence" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct WmiPersistence;
impl ShadowAction for WmiPersistence {
    fn name(&self) -> &'static str { "WMI Persistence" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct BiosFlashAttackV2;
impl ShadowAction for BiosFlashAttackV2 {
    fn name(&self) -> &'static str { "BIOS Flash Attack v2" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}
