"""Decode a Drive-connector JSON dump (base64 content) into a file in the given directory."""
import base64, json, os, sys
d = json.load(open(sys.argv[1]))
out = os.path.join(sys.argv[2], d["title"])
open(out, "wb").write(base64.b64decode(d["content"]))
print(out)
