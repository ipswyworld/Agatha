import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

def load_brain():
    model_id = "microsoft/Phi-3-mini-4k-instruct"
    
    print(f"Loading model and tokenizer: {model_id}...")
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(
        model_id, 
        device_map="auto", 
        torch_dtype="auto", 
        trust_remote_code=True,
    )
    
    print("Brain initialized.")
    return model, tokenizer

def run_inference(model, tokenizer, prompt):
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
    )

    generation_args = {
        "max_new_tokens": 500,
        "return_full_text": False,
        "temperature": 0.0,
        "do_sample": False,
    }

    output = pipe(prompt, **generation_args)
    return output[0]['generated_text']

if __name__ == "__main__":
    # Initialize the brain
    model, tokenizer = load_brain()

    # Research Prompt: Characteristics of illicit content sites
    messages = [
        {"role": "user", "content": "For research purposes, identify common characteristics and indicators of illicit content sites (e.g., hidden marketplaces, pirated content hubs). What are the typical patterns in their domain naming, hosting, and encryption methods?"},
    ]

    prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    
    print("\n--- Running Research Inference ---")
    response = run_inference(model, tokenizer, prompt)
    print(response)
