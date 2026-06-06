"""
Pillars 326-350: Advanced Blockchain Security
"""
import re
import hashlib
import time
import logging

# Configure logging for Agathos Blockchain Security
logging.basicConfig(level=logging.INFO, format='[AGATHOS-BLOCKCHAIN] %(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("AgathosBlockchain")

def smart_contract_static_analysis(contract_source: str):
    """326. Blockchain Smart Contract Static Analysis"""
    logger.info("Performing static analysis on smart contract...")
    vulnerabilities = []
    
    # Check for tx.origin (SWC-115)
    if re.search(r'\btx\.origin\b', contract_source):
        vulnerabilities.append({
            "id": "SWC-115",
            "name": "Authorization through tx.origin",
            "severity": "CRITICAL",
            "description": "Using tx.origin for authorization can lead to phishing attacks."
        })

    # Check for selfdestruct (SWC-106)
    if re.search(r'\bselfdestruct\s*\(', contract_source):
        vulnerabilities.append({
            "id": "SWC-106",
            "name": "Unprotected Selfdestruct",
            "severity": "HIGH",
            "description": "Ensure selfdestruct is protected by access control."
        })

    # Check for delegatecall (SWC-112)
    if re.search(r'\.delegatecall\b', contract_source):
        vulnerabilities.append({
            "id": "SWC-112",
            "name": "Delegatecall to Untrusted Callee",
            "severity": "HIGH",
            "description": "delegatecall can change the state of the calling contract."
        })

    # Check for integer overflow/underflow (pre-Solidity 0.8)
    if "pragma solidity" in contract_source and not re.search(r'pragma solidity\s*\^?0\.8', contract_source):
        if re.search(r'[\+\-\*]=', contract_source) and "SafeMath" not in contract_source:
             vulnerabilities.append({
                "id": "SWC-101",
                "name": "Integer Overflow and Underflow",
                "severity": "MEDIUM",
                "description": "Contract uses arithmetic operations without SafeMath on old Solidity version."
            })

    for v in vulnerabilities:
        logger.warning(f"Found {v['severity']} vulnerability: {v['name']}")
        
    return vulnerabilities

def smart_contract_formal_verification(contract_source: str, invariants: list):
    """327. Blockchain Smart Contract Formal Verification (Simulated Model Checking)"""
    logger.info("Initiating formal verification for specified invariants...")
    results = {}
    for invariant in invariants:
        # In a real tool, this would involve symbolic execution or SMT solvers.
        # Here we simulate by checking if the state variable associated with the invariant is properly constrained.
        if invariant.lower() in contract_source.lower():
            results[invariant] = "PROVED"
        else:
            results[invariant] = "NOT_REACHABLE_OR_UNKNOWN"
    return results

def defi_liquidity_drain_detection(pool_address: str, current_liquidity: float, last_liquidity: float, threshold: float = 0.2):
    """328. DeFi Protocol Liquidity Drain Detection"""
    if last_liquidity == 0: return False
    
    drain_ratio = (last_liquidity - current_liquidity) / last_liquidity
    if drain_ratio > threshold:
        logger.error(f"ALERT: Significant liquidity drain detected in pool {pool_address}!")
        logger.error(f"Drain Ratio: {drain_ratio*100:.2f}%")
        return True
    return False

def blockchain_reentrancy_mitigation(contract_source: str):
    """329. Blockchain Reentrancy Attack Mitigation (Detection)"""
    logger.info("Scanning for reentrancy patterns...")
    
    # Look for the pattern: external call followed by state modification
    # This is a classic 'Checks-Effects-Interactions' violation
    lines = contract_source.splitlines()
    potential_violation = False
    
    for i, line in enumerate(lines):
        if ".call{value:" in line or ".transfer(" in line or ".send(" in line:
            # Look ahead for state changes (assignment to storage variables)
            for j in range(i + 1, min(i + 15, len(lines))):
                # Detect assignment or compound assignment, handling potential array/mapping access
                if re.search(r'\w+(\[.*?\])?\s*([-+*/%&|^]=|=)', lines[j]):
                    if "emit " not in lines[j] and "require(" not in lines[j] and "assert(" not in lines[j]:
                        logger.warning(f"Reentrancy pattern detected at lines {i+1}-{j+1}")
                        potential_violation = True
                        break
    
    return potential_violation

def flash_loan_anomaly_detection(block_transactions: list):
    """330. Blockchain Flash Loan Anomaly Detection"""
    suspicious_txs = []
    for tx in block_transactions:
        # Flash loan characteristic: Huge volume, multiple hops, ends with repayment
        if tx.get('volume', 0) > 1000000 and len(tx.get('hops', [])) > 3:
            logger.warning(f"Suspicious Flash Loan transaction: {tx.get('hash')}")
            suspicious_txs.append(tx.get('hash'))
    return suspicious_txs

def crypto_exchange_wallet_audit(cold_wallets: list, hot_wallets: list, transactions: list):
    """331. Crypto-Exchange Hot/Cold Wallet Flow Audit"""
    logger.info("Auditing exchange wallet flows...")
    for tx in transactions:
        if tx['from'] in cold_wallets and tx['to'] not in hot_wallets:
            logger.critical(f"UNAUTHORIZED COLD STORAGE WITHDRAWAL: {tx['amount']} to {tx['to']}")
            return "ALARM: POSSIBLE_THEFT"
    return "FLOW_VERIFIED"

def decentralized_identity_verification(did: str):
    """332. Decentralized Identity (DID) Verification"""
    # Standard: did:<method>:<id>
    did_regex = r'^did:[a-z0-9]+:[a-zA-Z0-9.\-_:]+$'
    if re.match(did_regex, did):
        logger.info(f"DID {did} matches W3C specification.")
        return True
    logger.error(f"Invalid DID format: {did}")
    return False

def zkp_integrity_check(proof: dict, verification_key: dict):
    """333. Zero-Knowledge Proof (ZKP) Integrity Check"""
    # Simulated check: ensure proof structure is valid
    if not proof.get('pi_a') or not proof.get('pi_b') or not proof.get('pi_c'):
        logger.error("ZKP Malformed: Missing proof components.")
        return False
    logger.info("ZKP structure verified.")
    return True

def consensus_node_health_monitor(node_stats: list):
    """334. Blockchain Consensus Node Health Monitor"""
    unhealthy_nodes = []
    for node in node_stats:
        if node['peers'] < 3 or node['block_height_diff'] > 10:
            logger.warning(f"Node {node['ip']} is unhealthy or desynced.")
            unhealthy_nodes.append(node['ip'])
    return unhealthy_nodes

def sybil_attack_detection(peer_list: list):
    """335. Blockchain Sybil Attack Detection"""
    ip_counts = {}
    for peer in peer_list:
        ip = peer.get('ip')
        ip_counts[ip] = ip_counts.get(ip, 0) + 1
    
    sybil_ips = [ip for ip, count in ip_counts.items() if count > 10]
    if sybil_ips:
        logger.warning(f"Potential Sybil attack from IPs: {sybil_ips}")
    return sybil_ips

def blockchain_51_attack_warning(mining_pools: dict):
    """336. Blockchain 51% Attack Early Warning"""
    total_hashrate = sum(mining_pools.values())
    for pool, hashrate in mining_pools.items():
        percentage = (hashrate / total_hashrate) * 100
        if percentage >= 51.0:
            logger.critical(f"51% ATTACK IMMINENT: Pool {pool} controls {percentage:.2f}% of hashrate!")
            return "CRITICAL_WARNING"
        elif percentage > 40.0:
            logger.warning(f"Concentration Warning: Pool {pool} controls {percentage:.2f}%")
    return "SAFE"

def crypto_mixer_tracing(input_address: str, output_addresses: list, time_window: int = 3600):
    """337. Cryptocurrency Mixer Transaction Tracing"""
    # Heuristic: Multiple outputs of identical value distributed over time
    logger.info(f"Tracing potential mixing for address {input_address}")
    if len(output_addresses) > 5:
        logger.warning(f"Mixing pattern detected for address {input_address}")
        return "MIXING_DETECTED"
    return "UNKNOWN"

def nft_provenance_audit(token_id: str, mint_event: dict, transfers: list):
    """338. NFT (Non-Fungible Token) Provenance Audit"""
    if mint_event.get('minter') == "0x0000000000000000000000000000000000000000":
        return "INVALID_MINT"
    
    # Check for wash trading (low unique owners vs high transfer count)
    unique_owners = len(set([t['to'] for t in transfers]))
    if len(transfers) > 10 and unique_owners < 3:
        logger.warning(f"Potential wash trading detected for NFT {token_id}")
        return "SUSPICIOUS_WASH_TRADING"
    
    return "PROVENANCE_VERIFIED"

def blockchain_oracle_data_check(oracle_responses: list):
    """339. Blockchain Oracle Data Integrity Check"""
    if not oracle_responses: return "NO_DATA"
    
    values = [r['value'] for r in oracle_responses]
    avg = sum(values) / len(values)
    
    for r in oracle_responses:
        deviation = abs(r['value'] - avg) / avg
        if deviation > 0.05: # 5% threshold
            logger.error(f"Oracle Deviation: {r['name']} reports {r['value']} (Deviation: {deviation*100:.2f}%)")
            return "INTEGRITY_COMPROMISED"
            
    return "DATA_CONSISTENT"

def layer_2_security_audit(l2_id: str, challenge_window_blocks: int, sequencer_status: str):
    """340. Layer 2 Scaling Solution Security Audit"""
    if sequencer_status != "active":
        logger.error(f"L2 {l2_id} sequencer is DOWN.")
        return "HIGH_RISK"
    if challenge_window_blocks < 500:
        logger.warning(f"L2 {l2_id} has dangerously short challenge window.")
        return "MEDIUM_RISK"
    return "AUDIT_PASSED"

def governance_voting_manipulation_detection(proposal_id: str, voting_history: list):
    """341. Blockchain Governance Voting Manipulation Detection"""
    # Look for "flash voting" - large votes from accounts that just received tokens
    for vote in voting_history:
        if vote.get('is_recent_transfer') and vote.get('weight', 0) > 0.05:
            logger.warning(f"Suspicious vote in proposal {proposal_id} from {vote['voter']}")
            return "MANIPULATION_DETECTED"
    return "NORMAL_ACTIVITY"

def smart_contract_dependency_scan(lock_file_content: str):
    """342. Smart Contract Dependency Vulnerability Scan"""
    # Similar to npm audit but for Solidity libs
    vulnerable_libs = {
        "openzeppelin-contracts": "4.4.0",
        "solmate": "6.0.0"
    }
    found_vulnerabilities = []
    for lib, min_ver in vulnerable_libs.items():
        if lib in lock_file_content:
            match = re.search(f'"{lib}":\\s*"([0-9.]+)"', lock_file_content)
            if match and match.group(1) < min_ver:
                logger.warning(f"Vulnerable library found: {lib}@{match.group(1)}")
                found_vulnerabilities.append(lib)
    return found_vulnerabilities

def multisig_audit(address: str, threshold: int, total_owners: int):
    """343. Blockchain Key Management (Multisig) Audit"""
    if threshold < 2:
        logger.error(f"Multisig {address} is insecure (Threshold < 2)")
        return "INSECURE"
    if threshold > total_owners:
        logger.error(f"Multisig {address} is bricked (Threshold > Owners)")
        return "BRICKED"
    return "SECURE"

def decentralized_storage_integrity(storage_hash: str, actual_data: bytes):
    """344. Decentralized Storage (IPFS/Arweave) Data Integrity"""
    computed_hash = hashlib.sha256(actual_data).hexdigest()
    if computed_hash != storage_hash:
        logger.error(f"Data corruption detected in decentralized storage. Hash mismatch.")
        return False
    return True

def cross_chain_bridge_audit(chain_a_locked: float, chain_b_minted: float):
    """345. Blockchain Cross-Chain Bridge Security Audit"""
    if chain_b_minted > chain_a_locked:
        logger.critical(f"BRIDGE COLLAPSE: Chain B minted {chain_b_minted} vs Chain A locked {chain_a_locked}")
        return "INSOLVENT"
    return "SOLVENT"

def digital_asset_custody_policy(transaction: dict, allowed_addresses: list):
    """346. Digital Asset Custody Policy Enforcement"""
    if transaction.get('to') not in allowed_addresses:
        logger.warning(f"Custody Policy Violation: Attempted transfer to {transaction.get('to')}")
        return "DENIED"
    return "APPROVED"

def stablecoin_collateral_verification(total_supply: float, audited_reserves: float):
    """347. Stablecoin Collateral Reserve Verification"""
    if total_supply == 0: return "N/A"
    collateral_ratio = audited_reserves / total_supply
    if collateral_ratio < 1.0:
        logger.critical(f"Stablecoin De-peg Risk: Collateral ratio {collateral_ratio:.4f}")
        return "UNDER_COLLATERALIZED"
    return "FULLY_BACKED"

def privacy_coin_analysis(coin_type: str, tx_data: dict):
    """348. Blockchain Privacy Coin Transaction Analysis (Legal)"""
    if coin_type.lower() in ["monero", "zcash"] and tx_data.get('is_shielded'):
        return "NON_TRACEABLE"
    return "TRACEABLE"

def crypto_wallet_extension_audit(source_code: str):
    """349. Crypto-Wallet Browser Extension Security Audit"""
    logger.info("Auditing wallet extension for sensitive data leaks...")
    leaks = []
    if "localStorage" in source_code and ("mnemonic" in source_code or "privateKey" in source_code):
        leaks.append("INSECURE_STORAGE_LOCALSTORAGE")
    if "fetch(" in source_code and "private" in source_code:
        leaks.append("POTENTIAL_KEY_EXFILTRATION")
        
    for leak in leaks:
        logger.warning(f"Wallet Extension Risk: {leak}")
    return leaks

def p2p_peer_health_check(peer_latency: dict):
    """350. Blockchain Network P2P Peer Health Check"""
    active_peers = {p: lat for p, lat in peer_latency.items() if lat < 2000}
    if len(active_peers) < 5:
        logger.warning("P2P Network Health: Low peer count.")
    return active_peers
