use crate::shadows::ShadowAction;

pub struct CookieFixationAttack;
impl ShadowAction for CookieFixationAttack {
    fn name(&self) -> &'static str { "Cookie Fixation Attack" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct TabNabbing;
impl ShadowAction for TabNabbing {
    fn name(&self) -> &'static str { "Tab-Nabbing" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}

pub struct XssToRceChain;
impl ShadowAction for XssToRceChain {
    fn name(&self) -> &'static str { "XSS-to-RCE Chain" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}
