use crate::shadows::ShadowAction;

pub struct SwiftMessageForgery;
impl ShadowAction for SwiftMessageForgery {
    fn name(&self) -> &'static str { "SWIFT Message Forgery" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct PosSkimmingSimulation;
impl ShadowAction for PosSkimmingSimulation {
    fn name(&self) -> &'static str { "POS Skimming Simulation" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct AtmJackpottingLogic;
impl ShadowAction for AtmJackpottingLogic {
    fn name(&self) -> &'static str { "ATM Jackpotting Logic" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct FlashCrashInitiation;
impl ShadowAction for FlashCrashInitiation {
    fn name(&self) -> &'static str { "Flash Crash Initiation" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct CryptoWalletSeedPhish;
impl ShadowAction for CryptoWalletSeedPhish {
    fn name(&self) -> &'static str { "Crypto-Wallet Seed Phish" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}
