use crate::shadows::ShadowAction;

pub struct WifiDeauthAttack;
impl ShadowAction for WifiDeauthAttack {
    fn name(&self) -> &'static str { "Wi-Fi Deauth Attack" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct EvilTwinDeployment;
impl ShadowAction for EvilTwinDeployment {
    fn name(&self) -> &'static str { "Evil Twin Deployment" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct Wpa3HandshakeCrack;
impl ShadowAction for Wpa3HandshakeCrack {
    fn name(&self) -> &'static str { "WPA3 Handshake Crack" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct DnsCachePoisoning;
impl ShadowAction for DnsCachePoisoning {
    fn name(&self) -> &'static str { "DNS Cache Poisoning" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct BgpRouteHijack;
impl ShadowAction for BgpRouteHijack {
    fn name(&self) -> &'static str { "BGP Route Hijack" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct VpnTunnelInterception;
impl ShadowAction for VpnTunnelInterception {
    fn name(&self) -> &'static str { "VPN Tunnel Interception" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct AdvancedRouterLevelRedirection;
impl ShadowAction for AdvancedRouterLevelRedirection {
    fn name(&self) -> &'static str { "Advanced Router-Level Redirection" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct AdvancedCertificateAuthorityBreach;
impl ShadowAction for AdvancedCertificateAuthorityBreach {
    fn name(&self) -> &'static str { "Advanced Certificate Authority Breach" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}
