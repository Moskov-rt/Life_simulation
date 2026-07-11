import urllib.request
import json
import websocket
import time
import subprocess
import base64

# Start Chrome with remote debugging
chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
args = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--remote-allow-origins=*",
    "--window-size=1280,800",
    "http://localhost:3000/"
]

print("Launching Chrome to take screenshot...")
chrome_proc = subprocess.Popen(args)
time.sleep(4) # Wait for Chrome to load and React to render

try:
    url = "http://localhost:9222/json"
    with urllib.request.urlopen(url) as response:
        targets = json.loads(response.read().decode())
    
    ws_url = None
    for t in targets:
        if t.get('type') == 'page':
            ws_url = t.get('webSocketDebuggerUrl')
            break
            
    if not ws_url:
        print("No page target found.")
        chrome_proc.terminate()
        exit(1)
        
    ws = websocket.create_connection(ws_url)
    
    # Take screenshot command
    ws.send(json.dumps({
        "id": 1, 
        "method": "Page.captureScreenshot", 
        "params": {
            "format": "png",
            "quality": 100
        }
    }))
    
    print("Waiting for screenshot response...")
    start_time = time.time()
    screenshot_data = None
    while time.time() - start_time < 5:
        ws.settimeout(0.5)
        try:
            msg = ws.recv()
            data = json.loads(msg)
            if data.get('id') == 1:
                screenshot_data = data['result']['data']
                break
        except websocket.WebSocketTimeoutException:
            continue
            
    if screenshot_data:
        # Decode and save to a file in artifacts directory
        # Let's save it directly to the artifacts directory as a PNG file
        artifact_path = "C:/Users/ACER/.gemini/antigravity/brain/3780781f-5b84-4e45-8e4e-8a207df5a347/game_preview.png"
        with open(artifact_path, "wb") as f:
            f.write(base64.b64decode(screenshot_data))
        print(f"Screenshot successfully saved to: {artifact_path}")
    else:
        print("Failed to capture screenshot.")
        
    ws.close()
    
except Exception as e:
    print("Error:", e)

chrome_proc.terminate()
print("Done.")
