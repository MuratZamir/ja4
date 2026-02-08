# JA4+ Dashboard — Local Setup

## Prerequisites

- **Node.js** (v18 or later)
- **Python 3** (v3.8 or later)
- **tshark** (the CLI component of Wireshark — required for PCAP analysis)

### Installing tshark

**macOS:**

```bash
brew install wireshark
```

**Ubuntu / Debian:**

```bash
sudo apt update && sudo apt install tshark
```

**Windows:**

Install [Wireshark](https://www.wireshark.org/download.html) — tshark is included in the installer.

Verify it's available:

```bash
tshark --version
```

## Setup

1. **Clone the repository** (ensure the `ja4-github-repo` directory sits alongside this project):

   ```
   projects/
   ├── ja4/                  # this dashboard
   └── ja4-github-repo/      # JA4+ Python tool (github.com/FoxIO-LLC/ja4)
   ```

   If the JA4 repo is located elsewhere, set the `JA4_SCRIPT_PATH` environment variable to point to `ja4.py`:

   ```bash
   export JA4_SCRIPT_PATH="/path/to/ja4.py"
   ```

2. **Install Node dependencies:**

   ```bash
   cd ja4
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm start
```
