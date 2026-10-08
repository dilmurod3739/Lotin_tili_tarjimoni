import os
import sys
import re
# pyrefly: ignore [missing-import]
from PIL import Image

def process_icons():
    base_res = os.path.join("android", "app", "src", "main", "res")
    if not os.path.exists(base_res):
        print(f"Error: Android res directory not found at {base_res}")
        sys.exit(1)

    icon_src = "icon.png"
    if not os.path.exists(icon_src):
        icon_src = "icon-512.png"
    
    fg_src = os.path.join("assets", "icon-foreground.png")
    if not os.path.exists(fg_src):
        fg_src = icon_src

    splash_src = os.path.join("assets", "splash.png")

    print(f"[IconGen] Using icon source: {icon_src}")
    print(f"[IconGen] Using foreground source: {fg_src}")

    # Standard launcher icon sizes (legacy / non-adaptive fallback)
    icon_sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192
    }

    # Adaptive icon foreground sizes (full layer 108dp)
    fg_sizes = {
        "mipmap-mdpi": 108,
        "mipmap-hdpi": 162,
        "mipmap-xhdpi": 216,
        "mipmap-xxhdpi": 324,
        "mipmap-xxxhdpi": 432
    }

    img_icon = Image.open(icon_src).convert("RGBA")
    img_fg = Image.open(fg_src).convert("RGBA")

    # 1. Generate PNGs in standard mipmap directories
    for density, size in icon_sizes.items():
        dir_path = os.path.join(base_res, density)
        os.makedirs(dir_path, exist_ok=True)

        # Standard icon and round icon
        resized_icon = img_icon.resize((size, size), Image.Resampling.LANCZOS)
        resized_icon.save(os.path.join(dir_path, "ic_launcher.png"), "PNG", optimize=True)
        resized_icon.save(os.path.join(dir_path, "ic_launcher_round.png"), "PNG", optimize=True)

        # Foreground for adaptive icons
        fg_size = fg_sizes[density]
        resized_fg = img_fg.resize((fg_size, fg_size), Image.Resampling.LANCZOS)
        resized_fg.save(os.path.join(dir_path, "ic_launcher_foreground.png"), "PNG", optimize=True)
        print(f"[IconGen] Generated {density}: icon ({size}x{size}), fg ({fg_size}x{fg_size})")

    # 2. Configure mipmap-anydpi-v26 for Android 8.0+ Adaptive Icons
    anydpi_dir = os.path.join(base_res, "mipmap-anydpi-v26")
    os.makedirs(anydpi_dir, exist_ok=True)

    # CRITICAL: Clean any PNG files from mipmap-anydpi-v26 to prevent AAPT2 duplicate resource errors!
    for f in os.listdir(anydpi_dir):
        if f.lower().endswith(".png"):
            os.remove(os.path.join(anydpi_dir, f))
            print(f"[IconGen] Removed conflicting PNG from anydpi-v26: {f}")

    adaptive_xml = '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
'''
    with open(os.path.join(anydpi_dir, "ic_launcher.xml"), "w", encoding="utf-8") as f:
        f.write(adaptive_xml)
    with open(os.path.join(anydpi_dir, "ic_launcher_round.xml"), "w", encoding="utf-8") as f:
        f.write(adaptive_xml)
    print("[IconGen] Configured mipmap-anydpi-v26 adaptive icon XMLs")

    # 3. Configure ic_launcher_background color safely
    values_dir = os.path.join(base_res, "values")
    os.makedirs(values_dir, exist_ok=True)

    # Write dedicated ic_launcher_background.xml
    bg_xml_file = os.path.join(values_dir, "ic_launcher_background.xml")
    with open(bg_xml_file, "w", encoding="utf-8") as f:
        f.write('''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0f172a</color>
</resources>
''')
    print("[IconGen] Created values/ic_launcher_background.xml with #0f172a")

    # Ensure no duplicate definition in colors.xml
    colors_file = os.path.join(values_dir, "colors.xml")
    if os.path.exists(colors_file):
        with open(colors_file, "r", encoding="utf-8") as f:
            content = f.read()
        if "ic_launcher_background" in content:
            content = re.sub(r'\s*<color name="ic_launcher_background">[^<]+</color>', '', content)
            with open(colors_file, "w", encoding="utf-8") as f:
                f.write(content)
            print("[IconGen] Cleaned duplicate ic_launcher_background from colors.xml")

    # 4. Update Splash drawables if splash source exists
    if os.path.exists(splash_src):
        img_splash = Image.open(splash_src)
        for root, dirs, files in os.walk(base_res):
            for file in files:
                if file.lower() == "splash.png":
                    target_path = os.path.join(root, file)
                    img_splash.save(target_path, "PNG", optimize=True)
                    print(f"[IconGen] Updated splash: {target_path}")

    print("[IconGen] Successfully completed Android launcher & adaptive icons configuration!")

if __name__ == "__main__":
    process_icons()
