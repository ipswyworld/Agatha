"""
Agathos Pillars: Cognitive Defense, Deepfake Detection, and Discourse Analysis.
"""

import math
import re
import hashlib
from collections import Counter
from datetime import datetime

def deep_fake_detection(media_data: bytes):
    """
    Analyzes media data for spectral artifacts and frequency anomalies 
    characteristic of AI-generated content (GANs/Diffusion models).
    
    Focuses on 'Checkerboard Artifacts' in the frequency domain.
    """
    if not media_data or len(media_data) < 1024:
        return {"error": "Insufficient data for spectral analysis", "is_fake": False}

    # Simulate Discrete Cosine Transform (DCT) / FFT analysis
    # In a real implementation, we would use numpy/scipy/opencv to perform a 2D FFT.
    # Here we simulate the detection of high-frequency periodic artifacts.
    
    # Analyze a sample of the data for periodic patterns
    sample_size = min(len(media_data), 4096)
    sample = list(media_data[:sample_size])
    
    # Calculate a simple "spectral variance" score
    # AI models often leave high-frequency 'grid' patterns that appear as spikes in the spectrum
    high_freq_spikes = 0
    for i in range(1, len(sample) - 1):
        # Look for rapid oscillations that are too regular for natural noise
        if sample[i-1] < sample[i] > sample[i+1] or sample[i-1] > sample[i] < sample[i+1]:
            diff = abs(sample[i] - sample[i-1]) + abs(sample[i] - sample[i+1])
            if diff > 100: # Significant local variance
                high_freq_spikes += 1
                
    # Normalize score
    spectral_artifact_score = high_freq_spikes / (sample_size / 2)
    
    # Typical GAN-generated images show higher spectral artifacts
    # Threshold based on empirical Agathos benchmarks
    THRESHOLD = 0.45
    is_fake = spectral_artifact_score > THRESHOLD
    
    return {
        "analysis_type": "Frequency_Spectral_Artifact_Scan",
        "spectral_artifact_score": round(spectral_artifact_score, 4),
        "threshold": THRESHOLD,
        "is_fake": is_fake,
        "confidence": round(min(spectral_artifact_score * 2, 0.99), 2),
        "detected_artifacts": ["High_Frequency_Checkerboard"] if is_fake else [],
        "timestamp": datetime.now().isoformat()
    }

def botnet_discourse_analysis(messages: list):
    """
    Identifies botnet coordination patterns across a set of messages.
    Analyzes for semantic synchronization, temporal correlation, and C2 signal injection.
    """
    if not messages:
        return {"status": "NO_DATA", "threat_level": 0.0}

    # 1. Semantic Synchronization (Text overlap / repetition)
    text_corpus = [m.get("content", "").lower() for m in messages]
    unique_messages = set(text_corpus)
    repetition_rate = 1.0 - (len(unique_messages) / len(messages)) if messages else 0

    # 2. Temporal Correlation (Rapid fire / burst patterns)
    timestamps = []
    for m in messages:
        ts = m.get("timestamp")
        if isinstance(ts, (int, float)):
            timestamps.append(ts)
        elif isinstance(ts, str):
            try:
                timestamps.append(datetime.fromisoformat(ts).timestamp())
            except ValueError:
                pass
    
    temporal_variance = 1.0
    if len(timestamps) > 1:
        timestamps.sort()
        intervals = [timestamps[i] - timestamps[i-1] for i in range(1, len(timestamps))]
        avg_interval = sum(intervals) / len(intervals)
        # Low variance in intervals suggests automated scheduling
        var_interval = sum((x - avg_interval)**2 for x in intervals) / len(intervals)
        temporal_variance = math.sqrt(var_interval)

    # 3. C2 Signal Detection (Specific patterns used for orchestration)
    # Bots often use hidden triggers or specific hashtag sequences
    c2_markers = [
        r"#[a-z0-9]{8}$", # Random-looking 8-char hashtag at end
        r"^[0-9]{2}:[0-9]{2}:[0-9]{2} \. [a-z]+", # Specific prefix format
        r"run_cmd_[a-f0-9]+"
    ]
    detected_markers = 0
    for text in text_corpus:
        for marker in c2_markers:
            if re.search(marker, text):
                detected_markers += 1

    # Aggregate Threat Score
    sync_weight = repetition_rate * 0.4
    temp_weight = (1.0 / (temporal_variance + 0.1)) * 0.3 if temporal_variance < 5 else 0
    marker_weight = (detected_markers / len(messages)) * 0.3 if messages else 0
    
    threat_score = min(sync_weight + temp_weight + marker_weight, 1.0)
    
    return {
        "analysis_mode": "Distributed_Discourse_Correlation",
        "threat_score": round(threat_score, 4),
        "repetition_rate": round(repetition_rate, 4),
        "temporal_cohesion": "HIGH" if temporal_variance < 2.0 else "NORMAL",
        "coordination_detected": threat_score > 0.6,
        "recommendation": "ISOLATE_ACCOUNT_CLUSTER" if threat_score > 0.7 else "MONITOR",
        "timestamp": datetime.now().isoformat()
    }

def psychological_firewall(text: str):
    """
    Detects and neutralizes manipulative psychological triggers in text.
    Uses heuristic pattern matching for common exploitation techniques.
    """
    manipulation_vectors = {
        "fear_induction": [
            r"urgent action required", r"account will be deleted", r"legal consequences",
            r"final warning", r"compromised", r"risk of arrest"
        ],
        "scarcity_exploit": [
            r"limited time offer", r"only \d+ spots left", r"don't miss out",
            r"expires in", r"once in a lifetime"
        ],
        "authority_impersonation": [
            r"official notice from", r"administrator", r"security department",
            r"government agency", r"the system requires"
        ],
        "gaslighting": [
            r"you're overreacting", r"that never happened", r"everyone knows that",
            r"you must be confused", r"it's for your own good"
        ],
        "guilt_tripping": [
            r"after all we've done", r"how could you", r"disappointing",
            r"it's your fault if"
        ]
    }

    detections = []
    mitigated_text = text

    for vector, patterns in manipulation_vectors.items():
        found = False
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                detections.append(vector)
                found = True
                # Redact the specific trigger if found
                mitigated_text = re.sub(pattern, f"[MITIGATED_{vector.upper()}]", mitigated_text, flags=re.IGNORECASE)
        
    manipulation_index = len(detections) / 5.0 # Normalized score
    
    return {
        "integrity_scan": "Psychological_Firewall_V2",
        "manipulation_index": round(min(manipulation_index, 1.0), 2),
        "vectors_detected": list(set(detections)),
        "is_adversarial": len(detections) > 0,
        "mitigated_content": mitigated_text,
        "action": "STRIP_EMOTIONAL_PAYLOAD" if len(detections) > 1 else "PASS",
        "timestamp": datetime.now().isoformat()
    }
