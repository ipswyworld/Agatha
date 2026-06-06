use std::collections::HashMap;
use std::fs::OpenOptions;
use std::io::Write;
use std::path::PathBuf;
use serde::Serialize;
use sha2::{Sha256, Digest};
use ed25519_dalek::{Signer, SigningKey};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize)]
pub struct AuditRecord {
    pub timestamp: DateTime<Utc>,
    pub record_id: Uuid,
    pub action: ActionType,
    pub principal: String,
    pub target: Option<String>,
    pub result: ActionResult,
    pub metadata: HashMap<String, String>,
    pub previous_hash: Vec<u8>,
    pub record_hash: Vec<u8>,
    pub signature: Vec<u8>,
}

#[derive(Debug, Clone, Serialize)]
pub enum ActionType {
    AuthorizationCheck,
    ScopeVerification,
    Reconnaissance,
    VulnerabilityScan,
    ExploitAttempt,
    DefensiveAlert,
    SystemCommand,
    PythonBridge,
    SwarmMessage,
    KillSwitch,
}

#[derive(Debug, Clone, Serialize)]
pub enum ActionResult {
    Success,
    Failure(String),
    Blocked(String),
    Pending,
}

pub struct AuditLedger {
    log_path: PathBuf,
    chain: Vec<AuditRecord>,
    previous_hash: Vec<u8>,
    signing_key: SigningKey,
}

impl AuditLedger {
    pub fn new(log_path: PathBuf, signing_key: SigningKey) -> Self {
        let mut ledger = AuditLedger {
            log_path,
            chain: Vec::new(),
            previous_hash: vec![0u8; 32],
            signing_key,
        };
        
        // Genesis record
        let _ = ledger.append_record(
            ActionType::SystemCommand,
            "system",
            None,
            ActionResult::Success,
            HashMap::new()
        );
        ledger
    }

    pub fn append_record(
        &mut self,
        action: ActionType,
        principal: &str,
        target: Option<String>,
        result: ActionResult,
        metadata: HashMap<String, String>,
    ) -> Result<Uuid, String> {
        let record_id = Uuid::new_v4();
        let timestamp = Utc::now();
        
        // Create record without hash first
        let mut record = AuditRecord {
            timestamp,
            record_id,
            action,
            principal: principal.to_string(),
            target,
            result,
            metadata,
            previous_hash: self.previous_hash.clone(),
            record_hash: vec![],
            signature: vec![],
        };
        
        // Calculate hash
        let hash = self.calculate_hash(&record);
        record.record_hash = hash.clone();
        
        // Sign the record
        let signature = self.signing_key.sign(&hash);
        record.signature = signature.to_bytes().to_vec();
        
        // Persist to disk (append-only)
        self.persist_record(&record)?;
        
        // Update chain
        self.previous_hash = hash;
        self.chain.push(record);
        
        Ok(record_id)
    }

    fn calculate_hash(&self, record: &AuditRecord) -> Vec<u8> {
        let mut hasher = Sha256::new();
        let data = format!(
            "{:?}{:?}{:?}{:?}{:?}",
            record.timestamp, record.record_id, record.principal, record.target, record.previous_hash
        );
        hasher.update(data);
        hasher.finalize().to_vec()
    }

    fn persist_record(&self, record: &AuditRecord) -> Result<(), String> {
        let json = serde_json::to_string(record).map_err(|e| e.to_string())?;
        let mut file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&self.log_path)
            .map_err(|e| e.to_string())?;
        
        writeln!(file, "{}", json).map_err(|e| e.to_string())?;
        let _ = file.sync_all(); // best effort sync
        
        Ok(())
    }

    pub fn verify_chain(&self) -> bool {
        for i in 1..self.chain.len() {
            let prev = &self.chain[i-1];
            let curr = &self.chain[i];
            
            if curr.previous_hash != prev.record_hash {
                return false;
            }
        }
        true
    }
}
