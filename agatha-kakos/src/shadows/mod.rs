pub trait ShadowAction {
    fn name(&self) -> &'static str;
    fn execute(&self);
}

pub mod infiltration;
pub mod exploitation;
pub mod impact;
pub mod intelligence;
pub mod evasion;
pub mod systems;
pub mod chaos;
pub mod cognitive;
pub mod entropy;
pub mod phantom;

pub mod industrial;
pub mod fintech;
pub mod cloud;
pub mod devops;
pub mod web;
pub mod mobile;
pub mod network_adv;
pub mod binary;
pub mod osint;
pub mod forensics;
pub mod intelligence_adv;
pub mod persistence_adv;
pub mod discovery_adv;
pub mod entropy_adv;
pub mod dark_web;

pub mod kernel_chaos;
pub mod telecom_infiltration;
pub mod cloud_escape;
pub mod hardware_sabotage;
pub mod ai_subversion;
pub mod economic_entropy;
pub mod shadow_forensics;
pub mod existential_entropy;
pub mod cognitive_hijack;
pub mod orbital_strike;
pub mod quantum_collapse;
