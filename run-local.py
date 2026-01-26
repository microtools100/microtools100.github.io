#!/usr/bin/env python3
"""
Simple HTTP server for local testing of MicroTools
"""
import http.server
import socketserver
import os
import sys

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def translate_path(self, path):
        # Serve from public directory
        path = super().translate_path(path)
        relpath = os.path.relpath(path, os.getcwd())
        public_path = os.path.join(os.getcwd(), 'public', relpath)
        if os.path.exists(public_path):
            return public_path
        return path

def main():
    port = 8000
    
    # Change to project root directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print(f"Starting MicroTools local server on http://localhost:{port}")
    print(f"Serving from: {os.getcwd()}/public")
    print("\nAvailable tools:")
    print("  • Homepage: http://localhost:8000/")
    print("  • Text Uppercase: http://localhost:8000/tools/text-uppercase/")
    print("  • Text Lowercase: http://localhost:8000/tools/text-lowercase/")
    print("  • Remove Spaces: http://localhost:8000/tools/remove-extra-spaces/")
    print("  • Charades: http://localhost:8000/tools/charades-random/")
    print("  • Password Generator: http://localhost:8000/tools/password-generator/")
    print("\nPress Ctrl+C to stop the server")
    
    with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            httpd.shutdown()

if __name__ == "__main__":
    main()