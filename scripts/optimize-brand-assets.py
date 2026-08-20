from pathlib import Path
from PIL import Image

public = Path('/home/ubuntu/green-store-github/frontend-react/public')
source = public / 'qutoof-app-icon.png'
image = Image.open(source).convert('RGBA')
for size, filename in ((192, 'qutoof-app-icon-192.png'), (512, 'qutoof-app-icon-optimized.png')):
    resized = image.copy()
    resized.thumbnail((size, size), Image.Resampling.LANCZOS)
    output = public / filename
    resized.save(output, format='PNG', optimize=True, compress_level=9)
    print(f'{output}: {output.stat().st_size} bytes, {resized.size[0]}x{resized.size[1]}')
