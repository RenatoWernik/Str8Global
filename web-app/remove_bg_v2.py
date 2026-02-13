import os
from PIL import Image

def remove_white_bg(input_path, threshold=240):
    try:
        print(f"Processing {input_path}...")
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check if pixel is white-ish
            if item[0] > threshold and item[1] > threshold and item[2] > threshold:
                newData.append((255, 255, 255, 0)) # Transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(input_path, "PNG")
        print(f"Success: {input_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

target_images = [
    "public/images/gear/sirui-85mm.png",
    "public/images/gear/samyang-35-150.png",
    "public/images/gear/sigma-17-40.png"
]

for img in target_images:
    if os.path.exists(img):
        remove_white_bg(img)
    else:
        print(f"File not found: {img}")
