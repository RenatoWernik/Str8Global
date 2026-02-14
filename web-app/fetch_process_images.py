import urllib.request
import re
import os
import io

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

SAVE_DIR = "public/images/gear"
os.makedirs(SAVE_DIR, exist_ok=True)

TARGETS = [
    { 
      "name": "smallrig-p96", 
      "url": "https://www.bhphotovideo.com/c/product/1639726-REG/smallrig_3286_p96_video_led_light.html"
    }
]

def fetch_image_url(page_url):
    print(f"Fetching {page_url}...")
    try:
        req = urllib.request.Request(page_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode('utf-8', errors='ignore')

        match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
        if match:
            return match.group(1)
            
        match = re.search(r'<meta name="twitter:image" content="([^"]+)"', html)
        if match:
            return match.group(1)
            
        return None
    except Exception as e:
        print(f"Failed to fetch page: {e}")
        return None

def process_target(target):
    img_url = fetch_image_url(target["url"])
    if not img_url:
        print(f"No image URL found for {target['name']}")
        return

    print(f"Found image URL: {img_url}")
    print(f"Downloading image...")
    try:
        req = urllib.request.Request(img_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as response:
            img_data = response.read()

        out_path = os.path.join(SAVE_DIR, f"{target['name']}.png")
        
        try:
            from rembg import remove
            print(f"Removing background for {target['name']}...")
            result = remove(img_data)
        except Exception as e:
            print(f"Background removal failed ({e}), saving original...")
            result = img_data # Fallback

        with open(out_path, "wb") as f:
            f.write(result)
        print(f"Saved: {out_path}")
        
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    for target in TARGETS:
        process_target(target)
