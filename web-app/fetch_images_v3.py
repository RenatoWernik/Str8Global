import urllib.request
import re
import os
import io
import shutil

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

SAVE_DIR = "public/images/gear"
os.makedirs(SAVE_DIR, exist_ok=True)

TARGETS = [
    { 
      "name": "smallrig-p96", 
      "url": "https://www.smallrig.com/SmallRig-P96-Video-LED-Light-3286.html",
      "fallback_img_url": "https://image.smallrig.com/public/1618903554388.jpg"
    },
    { 
      "name": "dji-mic-2tx", 
      "url": "https://store.dji.com/product/dji-mic-mini" 
    }
]

def fetch_image_url(page_url):
    print(f"Fetching {page_url}...")
    try:
        req = urllib.request.Request(page_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as response:
            html = response.read().decode('utf-8', errors='ignore')

        match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
        if match:
            return match.group(1)
            
        return None
    except Exception as e:
        print(f"Failed to fetch page: {e}")
        return None

def process_target(target):
    img_url = fetch_image_url(target["url"])
    if not img_url:
        print(f"No OG image found for {target['name']}, trying fallback...")
        if "fallback_img_url" in target:
            img_url = target["fallback_img_url"]
        else:
            print("No fallback URL.")
            return

    print(f"Downloading image: {img_url}")
    try:
        req = urllib.request.Request(img_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as response:
            img_data = response.read()

        out_path = os.path.join(SAVE_DIR, f"{target['name']}.png")
        
        try:
            from rembg import remove
            print(f"Removing background for {target['name']}...")
            result = remove(img_data)
        except Exception as e:
            print(f"Background removal failed ({e}), saving original...")
            result = img_data

        with open(out_path, "wb") as f:
            f.write(result)
        print(f"Saved: {out_path}")
        
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    for target in TARGETS:
        process_target(target)
        
    # Copy for 1TX
    src = os.path.join(SAVE_DIR, "dji-mic-2tx.png")
    dst = os.path.join(SAVE_DIR, "dji-mic-1tx.png")
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {src} to {dst}")
    else:
        print(f"Source {src} missing, skipping copy.")
