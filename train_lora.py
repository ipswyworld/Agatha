import os
import json
import torch
import logging
from typing import List, Dict, Optional
from pathlib import Path

# ML Libraries
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling,
    BitsAndBytesConfig
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training, TaskType
from datasets import Dataset

# ============================================================================
# CONFIGURATION
# ============================================================================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AgathaBrainTrainer")

class BrainConfig:
    """Configuration for Agatha Brain Training"""
    base_model: str = "microsoft/Phi-3-mini-4k-instruct"
    output_dir: str = "./agatha_brain_weights"
    lora_r: int = 64
    lora_alpha: int = 128
    lora_dropout: float = 0.05
    # Phi-3 specific target modules (combined projections)
    target_modules: List[str] = [
        "qkv_proj", 
        "o_proj", 
        "gate_up_proj", 
        "down_proj"
    ]
    batch_size: int = 1
    gradient_accumulation_steps: int = 16
    num_epochs: int = 3
    learning_rate: float = 2e-4
    max_seq_length: int = 4096

# ============================================================================
# DATASET PREPARER
# ============================================================================

class AgathaDatasetBuilder:
    """Builds and formats training data from capabilities."""

    def __init__(self, capabilities_json: List[Dict], tokenizer: AutoTokenizer):
        self.capabilities = capabilities_json
        self.tokenizer = tokenizer

    def build_training_data(self) -> List[Dict]:
        training_examples = []
        for cap in self.capabilities:
            # Generate variations of instructions for each capability
            for variation in range(3):
                instruction = f"Analyze and execute {cap['name']}: {cap['description']}"
                output = {
                    "thought": f"Assessing {cap['name']} for mission suitability...",
                    "action": "invoke_module",
                    "module": cap['name'],
                    "parameters": cap['parameters'],
                    "ethical_check": "authorized" if not cap['requires_auth'] else "pending_review"
                }

                training_examples.append({
                    "instruction": instruction,
                    "output": json.dumps(output)
                })
        return training_examples

    def format_and_tokenize(self, examples: List[Dict]) -> Dataset:
        tokenized_inputs = []
        
        for ex in examples:
            # Format using the official Phi-3 template structure
            messages = [
                {"role": "user", "content": ex['instruction']},
                {"role": "assistant", "content": ex['output']}
            ]
            
            prompt = self.tokenizer.apply_chat_template(
                messages, 
                tokenize=False, 
                add_generation_prompt=False
            )
            
            # Tokenize the formatted text
            tokenized = self.tokenizer(
                prompt,
                truncation=True,
                max_length=BrainConfig.max_seq_length,
                padding=False,
                return_tensors=None
            )
            
            # For CausalLM, labels are identical to input_ids
            tokenized["labels"] = tokenized["input_ids"].copy()
            tokenized_inputs.append(tokenized)
            
        return Dataset.from_list(tokenized_inputs)

# ============================================================================
# TRAINING ENGINE
# ============================================================================

class AgathaBrainTrainer:
    def __init__(self, config: BrainConfig):
        self.config = config

    def train(self, capabilities: List[Dict]):
        logger.info("Initializing Fine-Tuning...")

        # 1. Load Tokenizer & Set Padding Configuration
        tokenizer = AutoTokenizer.from_pretrained(self.config.base_model)
        tokenizer.pad_token = tokenizer.eos_token
        tokenizer.padding_side = "right"

        # 2. Build and Tokenize Dataset
        builder = AgathaDatasetBuilder(capabilities, tokenizer)
        training_data = builder.build_training_data()
        dataset = builder.format_and_tokenize(training_data)

        # 3. 4-bit Quantization Config
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16,
            bnb_4bit_use_double_quant=True,
        )

        # 4. Model Prep
        model = AutoModelForCausalLM.from_pretrained(
            self.config.base_model,
            quantization_config=bnb_config,
            device_map="auto",
            trust_remote_code=True
        )
        model = prepare_model_for_kbit_training(model)

        # 5. LoRA Configuration
        peft_config = LoraConfig(
            r=self.config.lora_r,
            lora_alpha=self.config.lora_alpha,
            target_modules=self.config.target_modules,
            lora_dropout=self.config.lora_dropout,
            task_type=TaskType.CAUSAL_LM,
        )
        model = get_peft_model(model, peft_config)
        model.print_trainable_parameters()

        # 6. Training Arguments (aligned with bfloat16 computation)
        training_args = TrainingArguments(
            output_dir=self.config.output_dir,
            num_train_epochs=self.config.num_epochs,
            per_device_train_batch_size=self.config.batch_size,
            gradient_accumulation_steps=self.config.gradient_accumulation_steps,
            learning_rate=self.config.learning_rate,
            save_strategy="steps",
            save_steps=100,
            logging_steps=10,
            bf16=True, # Matches bfloat16 compute precision
            fp16=False,
            optim="paged_adamw_8bit",
            remove_unused_columns=False
        )

        # 7. Trainer Setup
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=dataset,
            data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
        )

        trainer.train()
        
        # Save PEFT weights & tokenizer config
        model.save_pretrained(self.config.output_dir)
        tokenizer.save_pretrained(self.config.output_dir)
        logger.info("Training complete.")

# ============================================================================
# EXECUTION
# ============================================================================
if __name__ == "__main__":
    # Capability list database
    capabilities = [
        {
            "id": "def_001", 
            "name": "filesystem_protection", 
            "description": "Monitor for ransomware", 
            "type": "defensive",
            "parameters": {}, 
            "requires_auth": False
        },
        {
            "id": "off_001", 
            "name": "network_recon", 
            "description": "Scanning network scopes", 
            "type": "offensive", 
            "parameters": {},
            "requires_auth": True
        }
    ]

    # Instantiate Trainer & execute
    config = BrainConfig()
    trainer = AgathaBrainTrainer(config)
    trainer.train(capabilities)
