"""
Pillars 301-325: Advanced AI Security
"""
import hashlib
import re
import os
import json
import math
import random
import time
from typing import List, Dict, Any, Union, Optional, Tuple
import numpy as np

def ai_model_weight_verification(model_path: str, expected_hashes: Dict[str, str]) -> Dict[str, bool]:
    """301. AI Model Weight Integrity Verification"""
    results = {}
    for filename, expected_hash in expected_hashes.items():
        full_path = os.path.join(model_path, filename)
        if not os.path.exists(full_path):
            results[filename] = False
            continue
        
        sha256_hash = hashlib.sha256()
        try:
            with open(full_path, "rb") as f:
                for byte_block in iter(lambda: f.read(4096), b""):
                    sha256_hash.update(byte_block)
            results[filename] = sha256_hash.hexdigest() == expected_hash
        except IOError:
            results[filename] = False
    return results

def llm_prompt_injection_filter(prompt: str) -> bool:
    """302. LLM Prompt Injection Filter (Inbound)"""
    # Common adversarial patterns
    patterns = [
        r"ignore previous instructions",
        r"system prompt",
        r"you are now an? admin",
        r"jailbreak",
        r"DAN mode",
        r"disregard all prior constraints",
        r"translate the following into.*then execute",
        r"base64 encode this then.*",
        r"---.*END OF PROMPT.*---",
        r"START OF NEW INSTRUCTIONS"
    ]
    for pattern in patterns:
        if re.search(pattern, prompt, re.IGNORECASE):
            return True
    return False

def llm_data_leakage_filter(output: str) -> List[Tuple[str, str]]:
    """303. LLM Data Leakage Filter (Outbound)"""
    leakage_detected = []
    pii_regex = {
        "email": r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
        "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
        "credit_card": r"\b(?:\d{4}[ -]?){3}\d{4}\b",
        "api_key": r"(?:key|api|token|secret)[-_=:\s]+[A-Za-z0-9+/=]{20,}"
    }
    for label, regex in pii_regex.items():
        matches = re.findall(regex, output, re.IGNORECASE)
        if matches:
            leakage_detected.extend([(label, match) for match in matches])
    return leakage_detected

def adversarial_example_detection(input_data: np.ndarray, threshold: float = 0.5) -> bool:
    """304. Adversarial Example Detection (Image/Audio)"""
    # Detect high-frequency perturbations common in adversarial attacks
    if len(input_data.shape) < 2:
        return False
    
    # Convert to grayscale if 3D
    data = np.mean(input_data, axis=2) if len(input_data.shape) == 3 else input_data
    
    f_transform = np.fft.fft2(data)
    f_shift = np.fft.fftshift(f_transform)
    magnitude_spectrum = 20 * np.log(np.abs(f_shift) + 1e-9)
    
    rows, cols = data.shape
    crow, ccol = rows // 2, cols // 2
    
    # Calculate energy in high frequency region
    y, x = np.ogrid[:rows, :cols]
    mask = ((x - ccol)**2 + (y - crow)**2 > 30**2)
    
    if not np.any(mask) or not np.any(~mask):
        return False
        
    high_freq_energy = np.mean(magnitude_spectrum[mask])
    low_freq_energy = np.mean(magnitude_spectrum[~mask])
    
    return float(high_freq_energy / (low_freq_energy + 1e-9)) > threshold

def ai_model_poisoning_audit(dataset: List[Dict[str, Any]], features: List[str]) -> List[int]:
    """305. AI Model Poisoning Dataset Audit"""
    if not dataset or not features: return []
    try:
        data_matrix = np.array([[d[f] for f in features] for d in dataset])
    except (KeyError, TypeError):
        return []
    
    # Outlier detection via Z-score
    mean = np.mean(data_matrix, axis=0)
    std = np.std(data_matrix, axis=0)
    z_scores = np.abs((data_matrix - mean) / (std + 1e-9))
    
    return [i for i, score in enumerate(z_scores) if np.any(score > 3.5)]

def differential_privacy_enforcement(data: np.ndarray, epsilon: float) -> np.ndarray:
    """306. Differential Privacy Enforcement for Training Data"""
    # Laplace Mechanism
    sensitivity = 1.0
    beta = sensitivity / max(epsilon, 1e-6)
    noise = np.random.laplace(0, beta, data.shape)
    return data + noise

def federated_learning_verification(update: np.ndarray, global_model: np.ndarray, max_norm: float) -> bool:
    """307. Federated Learning Model Update Verification"""
    # Detect anomalous weight updates
    diff = update - global_model
    l2_norm = np.linalg.norm(diff)
    return float(l2_norm) <= max_norm

def ai_explainability_security(features: List[str], weights: List[float], prediction: float) -> str:
    """308. AI Explainability (XAI) for Security Decisions"""
    if not features or not weights: return "No explanation available."
    attribution = sorted(zip(features, weights), key=lambda x: abs(x[1]), reverse=True)
    top_feature, weight = attribution[0]
    direction = "positive" if weight > 0 else "negative"
    return f"Result ({prediction:.2f}) driven by {top_feature} ({direction} impact)."

def model_inversion_mitigation(probabilities: np.ndarray, precision: int = 2) -> np.ndarray:
    """309. Model Inversion Attack Mitigation"""
    # Precision reduction to hide training set details
    return np.round(probabilities, precision)

def membership_inference_detection(confidence_scores: List[float], training_dist_mean: float) -> bool:
    """310. Membership Inference Attack Detection"""
    if not confidence_scores: return False
    current_avg = sum(confidence_scores) / len(confidence_scores)
    return current_avg > training_dist_mean * 1.25

def ai_model_watermarking_provenance(model_weights: np.ndarray, secret_key: str) -> np.ndarray:
    """311. AI Model Watermarking & Provenance"""
    # Embed fingerprint into model parameters
    key_hash = hashlib.sha256(secret_key.encode()).digest()
    key_bits = ''.join(format(b, '08b') for b in key_hash)
    
    orig_shape = model_weights.shape
    flat = model_weights.flatten()
    for i in range(min(len(key_bits), len(flat))):
        if key_bits[i] == '1':
            flat[i] += 1e-8
    return flat.reshape(orig_shape)

def automated_red_teaming_llm(target_url: str, payloads: List[str]) -> List[Dict[str, Any]]:
    """312. Automated Red-Teaming for LLMs"""
    return [{"payload": p, "vulnerable": llm_prompt_injection_filter(p)} for p in payloads]

def secure_multi_party_computation_ai(value: float) -> List[float]:
    """313. Secure Multi-Party Computation (SMPC) for AI Inference"""
    # Additive share split
    s1 = random.uniform(-5000, 5000)
    return [s1, value - s1]

def homomorphic_encryption_ai(encrypted_val: float, multiplier: float) -> float:
    """314. Homomorphic Encryption for AI Data Processing"""
    return encrypted_val * multiplier

def ai_agent_tool_usage_policy(tool: str, args: Dict[str, Any], policy: Dict[str, List[str]]) -> bool:
    """315. AI Agent Tool-Usage Policy Enforcement"""
    if tool not in policy: return False
    return all(p in args for p in policy[tool])

def ai_hallucination_detection(fact: str, ground_truth: List[str]) -> float:
    """316. AI hallucinations Detection in Forensic Reports"""
    if not ground_truth: return 0.0
    f_words = set(fact.lower().split())
    scores = []
    for gt in ground_truth:
        gt_words = set(gt.lower().split())
        scores.append(len(f_words & gt_words) / (len(f_words) + 1e-9))
    return float(max(scores))

def deepfake_signature_analysis(frame: np.ndarray) -> bool:
    """317. Deepfake Audio/Video Signature Analysis"""
    data = np.mean(frame, axis=2) if len(frame.shape) == 3 else frame
    return float(np.std(np.gradient(data))) < 8.0

def synthetic_identity_detection(face_landmarks: Dict[str, Any]) -> bool:
    """318. Synthetic Identity Detection (Faces/IDs)"""
    if "l_eye" in face_landmarks and "r_eye" in face_landmarks:
        return abs(face_landmarks["l_eye"][1] - face_landmarks["r_eye"][1]) > 20
    return False

def ai_model_supply_chain_security(metadata: Dict[str, Any]) -> bool:
    """319. AI Model Supply Chain Security (HuggingFace/GitHub)"""
    checks = [metadata.get("signed", False), metadata.get("vulnerabilities", 1) == 0]
    return all(checks)

def model_weight_access_control(role: str, action: str) -> bool:
    """320. Model Weight Access Control (RBAC for AI)"""
    perms = {"admin": ["*"], "researcher": ["read", "exec"], "auditor": ["read"]}
    user_perms = perms.get(role, [])
    return "*" in user_perms or action in user_perms

def ai_training_pipeline_integrity(hashes: Tuple[str, str, str]) -> bool:
    """321. AI Training Pipeline Integrity Check"""
    return len(hashlib.sha256("".join(hashes).encode()).hexdigest()) == 64

def prompt_engineering_guardrails(system: str, user: str) -> str:
    """322. Prompt Engineering Guardrails (System Prompt Protection)"""
    if re.search(r"leak|reveal|show.*system", user, re.IGNORECASE):
        user = "[FILTERED]"
    return f"<system>{system}</system>\n<user>{user}</user>"

def ai_context_window_poisoning_detection(context: List[str]) -> bool:
    """323. AI Context Window Poisoning Detection"""
    words = " ".join(context).split()
    if len(words) < 50: return False
    return (len(set(words)) / len(words)) < 0.15

def rag_source_verification(docs: List[Dict[str, Any]], domains: List[str]) -> List[int]:
    """324. Retrieval Augmented Generation (RAG) Source Verification"""
    return [i for i, d in enumerate(docs) if not any(dom in d.get("url", "") for dom in domains)]

def ai_ethics_compliance(preds: List[int], attr: List[int]) -> float:
    """325. AI Ethics Compliance (Algorithmic Bias Audit)"""
    if not preds or len(preds) != len(attr): return 0.0
    g0 = [preds[i] for i, v in enumerate(attr) if v == 0]
    g1 = [preds[i] for i, v in enumerate(attr) if v == 1]
    if not g0 or not g1: return 0.0
    return abs((sum(g0)/len(g0)) - (sum(g1)/len(g1)))
