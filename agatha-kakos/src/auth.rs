use std::collections::HashMap;
use std::net::IpAddr;
use std::sync::RwLock;
use serde::{Deserialize, Serialize};
use ed25519_dalek::{Verifier, VerifyingKey, Signature};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum OperationMode {
    Agathos,    // Defensive
    Kakos,      // Offensive (requires authorization)
    Hybrid,     // Both
    Seed,       // Portable deployment
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScopeConfig {
    pub authorized_targets: Vec<IpAddr>,
    pub forbidden_targets: Vec<IpAddr>,
    pub time_window_start: Option<DateTime<Utc>>,
    pub time_window_end: Option<DateTime<Utc>>,
    pub max_rate_limit: u32, // requests per second
    pub jurisdictions: Vec<String>, // Legal jurisdictions allowed
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthorizationToken {
    pub token_id: Uuid,
    pub principal: String,
    pub scope_signature: Vec<u8>,
    pub expiry: DateTime<Utc>,
    pub capabilities: Vec<Capability>,
    pub signatures: Vec<u8>, // Ed25519 signature
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Capability {
    Reconnaissance,
    VulnerabilityScan,
    ExploitExecution,
    LateralMovement,
    DataExfiltration,
    DefensiveMonitor,
    IncidentResponse,
    SwarmCoordination,
}

pub struct AuthorizationEngine {
    master_public_key: VerifyingKey,
    active_tokens: RwLock<HashMap<Uuid, AuthorizationToken>>,
    scope_config: ScopeConfig,
}

impl AuthorizationEngine {
    pub fn new(master_public_key: VerifyingKey, scope_config: ScopeConfig) -> Self {
        AuthorizationEngine {
            master_public_key,
            active_tokens: RwLock::new(HashMap::new()),
            scope_config,
        }
    }

    pub fn validate_token(&self, token: &AuthorizationToken) -> Result<bool, String> {
        // Check expiry
        if Utc::now() > token.expiry {
            return Err("Token expired".to_string());
        }
        
        // Verify signature
        let message = format!("{:?}{:?}", token.token_id, token.principal);
        
        let signature_bytes: [u8; 64] = token.signatures.clone().try_into()
            .map_err(|_| "Invalid signature length. Expected 64 bytes.".to_string())?;
        let signature = Signature::from_bytes(&signature_bytes);
        
        self.master_public_key
            .verify(message.as_bytes(), &signature)
            .map_err(|e| e.to_string())?;
        
        // Check scope
        self.validate_scope(token)?;
        
        // Store token in active cache
        let mut active = self.active_tokens.write().unwrap();
        active.insert(token.token_id, token.clone());
        
        Ok(true)
    }

    fn validate_scope(&self, _token: &AuthorizationToken) -> Result<(), String> {
        // Check time window
        if let Some(start) = self.scope_config.time_window_start {
            if Utc::now() < start {
                return Err("Authorization not yet valid".to_string());
            }
        }
        
        if let Some(end) = self.scope_config.time_window_end {
            if Utc::now() > end {
                return Err("Authorization expired".to_string());
            }
        }
        
        Ok(())
    }

    pub fn check_target_authorized(&self, target: &IpAddr) -> Result<bool, String> {
        if self.scope_config.forbidden_targets.contains(target) {
            return Ok(false);
        }
        
        if self.scope_config.authorized_targets.is_empty() {
            // If no explicit whitelist, check blacklist only
            return Ok(true);
        }
        
        Ok(self.scope_config.authorized_targets.contains(target))
    }

    pub fn enforce_rate_limit(&self) -> Result<(), String> {
        Ok(())
    }
}

// ============================================================================
// MODULE SYSTEM (Plugin Architecture)
// ============================================================================

pub trait AgathaModule: Send + Sync {
    fn name(&self) -> &str;
    fn capabilities(&self) -> Vec<Capability>;
    fn execute(&self, params: &ModuleParams) -> Result<ModuleResult, String>;
    fn is_offensive(&self) -> bool;
}

pub struct ModuleParams {
    pub target: Option<IpAddr>,
    pub command: String,
    pub args: HashMap<String, String>,
    pub token: Option<AuthorizationToken>,
}

pub struct ModuleResult {
    pub success: bool,
    pub output: String,
    pub artifacts: Vec<std::path::PathBuf>,
    pub metadata: HashMap<String, String>,
}

// Example: Dark Web Module Stub
pub struct DarkWebIntelligenceModule;

impl AgathaModule for DarkWebIntelligenceModule {
    fn name(&self) -> &str { "darkweb_intel" }
    fn capabilities(&self) -> Vec<Capability> { 
        vec![Capability::Reconnaissance] 
    }
    fn is_offensive(&self) -> bool { false } // Intel gathering is defensive
    
    fn execute(&self, _params: &ModuleParams) -> Result<ModuleResult, String> {
        // Requires: Tor proxy configured
        // Scrapes: Markets, forums, leak sites
        // Output: Structured threat intelligence
        Ok(ModuleResult {
            success: true,
            output: "Dark web intelligence gathered".to_string(),
            artifacts: vec![],
            metadata: HashMap::new(),
        })
    }
}
