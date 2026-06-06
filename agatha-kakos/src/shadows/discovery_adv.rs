use crate::shadows::ShadowAction;

pub struct S3PublicFinder;
impl ShadowAction for S3PublicFinder {
    fn name(&self) -> &'static str { "S3 Public Finder" }
    fn execute(&self) { println!("Executing Shadow: {}", self.name()); }
}
