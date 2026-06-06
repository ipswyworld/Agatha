# Agatha Brain - Core AI Engine

This directory contains the core SLM (Small Language Model) engine for Project Agatha, focused on research and illicit content tracking.

## Setup

1. **Prerequisites**: Ensure Python 3.10+ is installed.
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Model Information

- **Model**: `microsoft/Phi-3-mini-4k-instruct`
- **Type**: Small Language Model (SLM)
- **Capability**: Efficient instruction-following and analytical reasoning on local hardware.

## Running the Brain

To test the model with the research prompt regarding illicit content tracking:

```bash
python load_model.py
```

## Research Focus

The current implementation includes a sample prompt designed to analyze characteristics of illicit content sites, including:
- Domain naming patterns
- Hosting strategies
- Encryption and obfuscation methods
