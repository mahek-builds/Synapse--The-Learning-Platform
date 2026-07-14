import requests
import json
import time

print("=" * 60)
print("FULL END-TO-END TEST: Vite proxy -> Backend -> LangGraph")
print("=" * 60)

# Step 1: Test that the proxy is alive
print("\n[1/3] Testing proxy is alive...")
try:
    r = requests.get("http://localhost:3000/chat/sessions/test-user-verify", timeout=10)
    print(f"  ✓ Proxy alive - Status: {r.status_code}")
except Exception as e:
    print(f"  ✗ Proxy DEAD: {e}")
    exit(1)

# Step 2: Send a chat message
print("\n[2/3] Sending 'explain python' through Vite proxy...")
print("  (This will take ~60 seconds - LangGraph runs 5 agents)")
start = time.time()

try:
    r = requests.post(
        "http://localhost:3000/chat/",
        json={"user_id": "verify-user", "message": "explain python", "session_id": None},
        timeout=180,
    )
    elapsed = time.time() - start
    print(f"  Status: {r.status_code} in {elapsed:.1f}s")
    
    if r.status_code != 200:
        print(f"  ✗ FAILED! Response: {r.text[:500]}")
        exit(1)
    
    data = r.json()
    print(f"  ✓ Got response!")
    print(f"  - session_id: {data.get('session_id', 'MISSING')}")
    print(f"  - topic: {data.get('topic', 'MISSING')}")
    print(f"  - has response text: {bool(data.get('response'))}")
    print(f"  - has explanation: {bool(data.get('explanation'))}")
    print(f"  - has questions: {bool(data.get('questions'))}")
    print(f"  - response length: {len(data.get('response', ''))} chars")
    print(f"  - explanation length: {len(data.get('explanation', ''))} chars")
    
    session_id = data.get("session_id")
    
except requests.exceptions.Timeout:
    print(f"  ✗ TIMEOUT after {time.time()-start:.1f}s")
    exit(1)
except Exception as e:
    print(f"  ✗ ERROR after {time.time()-start:.1f}s: {e}")
    exit(1)

# Step 3: Verify messages were saved by fetching them back
print(f"\n[3/3] Fetching saved messages for session {session_id}...")
try:
    r = requests.get(f"http://localhost:3000/chat/messages/{session_id}", timeout=10)
    messages = r.json()
    print(f"  ✓ Got {len(messages)} messages back")
    for msg in messages:
        sender = msg.get("sender", "?")
        content_preview = str(msg.get("content", ""))[:80]
        has_meta = bool(msg.get("metadata"))
        print(f"    [{sender}] {content_preview}...")
        if has_meta and sender == "ai":
            meta = msg["metadata"]
            print(f"         metadata.explanation: {bool(meta.get('explanation'))}")
            print(f"         metadata.questions: {bool(meta.get('questions'))}")
            print(f"         metadata.topic: {meta.get('topic', 'N/A')}")
except Exception as e:
    print(f"  ✗ ERROR: {e}")

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)
