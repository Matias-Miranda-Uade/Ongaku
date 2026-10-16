"""Carga el catálogo local sin borrar productos ni modificar su stock actual."""
import base64
import json
from pathlib import Path
import subprocess
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]

def main():
    albums = json.loads((ROOT / 'catalog/albums.json').read_text(encoding='utf-8'))
    rows = []
    for album in albums:
        image = ROOT / 'client/marketplace/public' / album['image'].lstrip('/')
        if not image.is_file() or len(album['description']) > 255:
            raise ValueError(f"Imagen o descripción inválida: {album['name']}")
        source = urlparse(album['source'])
        if source.scheme != 'https' or source.hostname != 'music.apple.com' or '/album/' not in source.path:
            raise ValueError(f"Enlace de álbum inválido: {album['name']}")
        values = [album[key] for key in ('name', 'artist', 'genre', 'year', 'price', 'discountPercentage', 'stock', 'description', 'image', 'source')]
        rows.append('\t'.join(base64.b64encode(str(value).encode('utf-8')).decode('ascii') for value in values))
    target = ROOT / 'target'
    target.mkdir(exist_ok=True)
    data = target / 'real-catalog.tsv'
    data.write_text('\n'.join(rows), encoding='utf-8')
    jars = sorted((Path.home() / '.m2/repository/com/mysql/mysql-connector-j').glob('*/mysql-connector-j-*.jar'))
    if not jars:
        raise RuntimeError('Ejecutá primero mvnw.cmd compile para descargar el conector MySQL.')
    subprocess.run(['java', '--class-path', str(jars[-1]), 'catalog/ImportCatalog.java', str(data)], cwd=ROOT, check=True)

if __name__ == '__main__':
    main()
