import sys
from PIL import Image
import os

def upscale_pixel_art(input_path, scale=3):
    # Open image
    img = Image.open(input_path)

    # Calculate new size
    new_width = img.width * scale
    new_height = img.height * scale

    # Resize using NEAREST (important for pixel art)
    upscaled = img.resize((new_width, new_height), Image.NEAREST)

    # Build output filename
    base, ext = os.path.splitext(input_path)
    output_path = f"{base}{ext}"

    upscaled.save(output_path)
    print(f"Upscaled image saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python upsize.py <imagefile>")
        sys.exit(1)

    input_file = sys.argv[1]
    upscale_pixel_art(input_file)
