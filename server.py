import sys
import json
import http.server
import socketserver

from pathlib import Path


PORT = 8080 if len(sys.argv) <= 1 else int(sys.argv[1])

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('access-control-allow-headers', 'content-type')        
        http.server.SimpleHTTPRequestHandler.end_headers(self)      
  
    def do_POST(self):
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself

        filepath = Path('./' +  self.path)
        filepath.parent.mkdir(exist_ok=True)
        with open(str(filepath), 'w') as fp:
            json_obj = json.loads(post_data)
            json.dump(json_obj, fp, indent = 2)

        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

print("serving at port", PORT)
httpd = socketserver.TCPServer(("", PORT), Handler)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
print("closing server")
httpd.server_close()
