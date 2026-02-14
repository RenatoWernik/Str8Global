import os
from rembg import remove
from PIL import Image

SAVE_DIR = "public/images/gear"

TARGETS = [
    { "input": "dji-mic-2tx.jpg", "output": "dji-mic-2tx.png" },
    { "input": "dji-mic-1tx.jpg", "output": "dji-mic-1tx.png" },
    { "input": "smallrig-p96.png", "output": "smallrig-p96.png" } # Process existing png to ensure transparency
]

def process_image(target):
    input_path = os.path.join(SAVE_DIR, target["input"])
    output_path = os.path.join(SAVE_DIR, target["output"])

    if not os.path.exists(input_path):
        print(f"Input file not found: {input_path}")
        return

    print(f"Processing {input_path}...")
    try:
        with open(input_path, "rb") as input_file:
            input_data = input_file.read()
            output_data = remove(input_data)
        
        with open(output_path, "wb") as output_file:
            output_file.write(output_data)
            
        print(f"Saved processed image to {output_path}")

        # If input was a JPG and output is PNG, user might want to delete the JPG later, but we'll leave it
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    for target in TARGETS:
        process_image(target)
