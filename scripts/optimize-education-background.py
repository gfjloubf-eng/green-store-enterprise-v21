from pathlib import Path
from PIL import Image

public = Path('/home/ubuntu/green-store-github/frontend-react/public')
source = public / 'education-fruit-background.png'
image = Image.open(source).convert('RGB')
max_width = 1600
if image.width > max_width:
    ratio = max_width / image.width
    image = image.resize((max_width, round(image.height * ratio)), Image.Resampling.LANCZOS)
output = public / 'education-fruit-background.webp'
image.save(output, format='WEBP', quality=78, method=6)
print(f'{output}: {output.stat().st_size} bytes, {image.size[0]}x{image.size[1]}')
