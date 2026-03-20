import requests
import json
import sys
from collections import defaultdict

def toggle_dio(base_url: str, channel: int) -> bool:
    """
    Sends the EXACT payload the web UI uses.
    """
    if not 1 <= channel <= 4:
        print(f"Error: Channel must be 1–4")
        return False

    # Track last known state so we can actually toggle
    # (we start assuming all OFF, same as fresh router)
    if channel not in toggle_dio.states:
        toggle_dio.states[channel] = False
    new_state = not toggle_dio.states[channel]
    toggle_dio.states[channel] = new_state

    payload = {
        "insert": json.dumps({
            "status": "1" if new_state else "0",
            "num": str(channel)
        })
    }

    endpoint = f"{base_url.rstrip('/')}/update.php"

    try:
        response = requests.post(
            endpoint,
            data=payload,
            headers={
                "X-Requested-With": "XMLHttpRequest",   # jQuery sets this
                "Referer": f"{base_url.rstrip('/')}/index.php",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
            timeout=6
        )
        response.raise_for_status()

        action = "ON" if new_state else "OFF"
        print(f"✓ DIO-{channel} toggled → {action}   (HTTP {response.status_code})")
        if response.text.strip():
            print(f"   Server reply: {response.text.strip()}")
        return True

    except requests.RequestException as e:
        print(f"✗ Failed DIO-{channel}: {e}")
        return False


# Shared state tracker (persists across calls)
toggle_dio.states = {}

def main():
    BASE_URL = "http://192.168.33.65:8080"   # ← CHANGE TO YOUR REAL URL

    print("IR1101 DIO Toggle Tool (exact replica of web UI)")
    print(f"Target: {BASE_URL}/update.php")
    print("Type 1–4 to toggle that DIO. Ctrl+C to quit.\n")

    while True:
        try:
            inp = input("DIO to toggle (1-4): ").strip()
            if not inp:
                continue
            channel = int(inp)
            toggle_dio(BASE_URL, channel)

        except ValueError:
            print("Please enter a number 1–4.")
        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            sys.exit(0)
        except Exception as e:
            print(f"Unexpected error: {e}")


if __name__ == "__main__":
    main()