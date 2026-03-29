#!/usr/bin/env python3
"""
serve.py — One-command local development server for ContractForge.

Usage:
    python3 serve.py          (serves on http://localhost:8000)
    python3 serve.py 9000     (custom port)

This is needed when opening the app locally because browsers block
loading separate JS/CSS files from disk (file:// protocol).
If you're hosting on a web server, you don't need this file.
"""

import http.server
import socketserver
import sys
import os
import webbrowser

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

# Serve from the directory containing this script
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    url = f"http://localhost:{PORT}"
    print(f"ContractForge running at {url}")
    print("Press Ctrl+C to stop.\n")
    webbrowser.open(url)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
