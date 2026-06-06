import json
import os
import sys
import torch
import asyncio
import datetime
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

# Local imports
from toolbox import AgathaToolbox
from units import get_all_units
from knowledge.rag_engine import RagEngine
from knowledge.kag_engine import KagEngine
from swarm_controller import SwarmController

class AgathaPrime:
    """
    The Millennium Command & Control (C2) Hub.
    Integrated with RAG, KAG, and Swarm Intelligence.
    """
    def __init__(self):
        self.toolbox = AgathaToolbox()
        self.units = get_all_units(self.toolbox)
        self.swarm_ctrl = SwarmController(self.units)
        
        # Intelligence Layers
        self.rag = RagEngine()
        self.kag = KagEngine()
        
        # SLM Brain
        self.model_id = "microsoft/Phi-3-mini-4k-instruct"
        print(f"Initializing Agatha Prime with {self.model_id}...")
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_id)
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_id, 
            device_map="auto", 
            torch_dtype="auto", 
            trust_remote_code=True,
        )
        self.pipe = pipeline("text-generation", model=self.model, tokenizer=self.tokenizer)
        
        # Load Capability Map (CAG - Cache-Augmented)
        self.capability_map = self._load_capability_map()
        print(f"Prime Online. RAG/KAG Integrated. {len(self.units)} Units ready.")

    async def _run_daily_ingestion(self):
        """Background task for daily CVE updates."""
        from knowledge.ingestor import CVEIngestor
        ingestor = CVEIngestor(rag=self.rag, kag=self.kag)
        while True:
            current_year = str(datetime.datetime.now().year)
            print(f"[Background] Starting CVE ingestion for {current_year}...")
            html = ingestor.fetch_recent_cves(current_year)
            if html:
                ingestor.parse_and_ingest(html)
            
            # Wait 24 hours
            await asyncio.sleep(86400)

    def _load_capability_map(self):
        """Pre-loads the 1,000 capability list for context injection."""
        # In a real CAG setup, this would be in a KV-cache. 
        # Here we keep it as a hot string for the system prompt.
        try:
            with open(os.path.join(os.path.dirname(__file__), '..', 'MASTER_CAPABILITIES.md'), 'r') as f:
                return f.read()[:2000] # Limit to first 2k chars for context efficiency
        except:
            return "Capability list unavailable."

    async def decide_strategy(self, goal, history):
        """Brain logic with RAG/KAG context injection."""
        
        # 1. RAG: Retrieve relevant past mission data
        past_context = self.rag.query(goal)
        context_str = "\n".join([f"- {d['text']}" for d in past_context])
        
        # 2. KAG: Suggest counter-measures based on semantic knowledge
        kag_suggestion = self.kag.suggest_counter_measure(goal)
        kag_context = f"KAG Suggestion: {kag_suggestion}" if kag_suggestion else ""

        system_prompt = f"""
You are AGATHA PRIME. You command 1,000 capabilities and 10 specialized units.
YOUR CAPABILITIES: {self.capability_map}
RELEVANT MEMORY (RAG): {context_str}
SEMANTIC KNOWLEDGE (KAG): {kag_context}

Output your move in JSON:
{{
  "thought": "Reasoning",
  "type": "SINGLE" | "SWARM",
  "unit": "UNIT_NAME", 
  "swarm_plan": [{{ "unit": "NAME", "action": "NAME", "params": {{}} }}],
  "intent": {{ "action": "pillar|shadow", "name": "Exact Name", "params": {{}} }}
}}
"""
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Goal: {goal}"}
        ]
        messages.extend(history)

        prompt = self.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        output = self.pipe(prompt, max_new_tokens=512, return_full_text=False, temperature=0.0)[0]['generated_text']
        
        try:
            start = output.find('{')
            end = output.rfind('}') + 1
            return json.loads(output[start:end])
        except:
            return {"error": "JSON parse failed", "raw": output}

    async def execute_mission(self, goal):
        """The main autonomous orchestration loop."""
        # Start background intelligence ingestion
        asyncio.create_task(self._run_daily_ingestion())

        print(f"\n[MISSION START] {goal}")
        history = []
        
        for step in range(5):
            print(f"\n--- Strategy Step {step + 1} ---")
            strategy = await self.decide_strategy(goal, history)
            
            if "error" in strategy:
                print(f"[Brain Error] {strategy['error']}")
                break

            print(f"[Thought] {strategy['thought']}")
            
            # Execute Swarm or Single Unit
            if strategy.get("type") == "SWARM":
                results = await self.swarm_ctrl.execute_swarm(strategy["swarm_plan"])
                result_str = json.dumps(results)
            else:
                unit = self.units.get(strategy["unit"])
                intent = strategy["intent"]
                print(f"[Prime] Deploying {strategy['unit']} for {intent['name']}")
                result = unit.execute(intent['name'], intent.get('params'))
                result_str = json.dumps(result)

            print(f"[Result] {result_str}")
            
            # Record in RAG for future missions
            self.rag.add_to_memory(f"Mission Goal: {goal}. Result: {result_str}")
            
            history.append({"role": "assistant", "content": json.dumps(strategy)})
            history.append({"role": "user", "content": f"Result: {result_str}"})

            if "success" in result_str.lower():
                print("\n[MISSION COMPLETE] Goal Achieved.")
                break

if __name__ == "__main__":
    prime = AgathaPrime()
    # Test Mission
    asyncio.run(prime.execute_mission("Detect and neutralize a SQL injection attempt on the financial database."))
