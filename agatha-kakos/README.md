# Kakos - Offensive Infiltration Module

Kakos is the offensive module of Project Agatha, designed for target infiltration, crawling, and data extraction.

## Architecture

Kakos is built using Rust for high performance and safety. It leverages:
- **Tokio**: Asynchronous runtime for handling concurrent network operations.
- **Reqwest**: HTTP client for web crawling, supporting SOCKS proxies for anonymity.
- **Serde**: For efficient serialization and deserialization of target data.

### Components
- **Crawler**: Asynchronous engine that traverses target URLs.
- **Infiltrator**: Logic for identifying and exploiting vulnerabilities (planned).
- **Exfiltrator**: Securely moves gathered data to the Agatha Brain (planned).

## Getting Started

### Prerequisites
- Rust (latest stable version)
- Cargo

### Installation
```bash
cargo build
```

### Running the Crawler
To run the basic crawler implemented in `main.rs`:
```bash
cargo run
```

## Usage
Currently, the module performs a basic GET request to a target URL (defaulting to example.com) and prints the response status and body length.
