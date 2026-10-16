"""Obtiene álbumes y portadas del catálogo público de iTunes, sin tocar la base."""
import concurrent.futures
import json
from pathlib import Path
import re
import time
import unicodedata
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
SELECTION = [
    ('Michael Jackson', 'Thriller', 1982), ('Michael Jackson', 'Bad', 1987),
    ('Prince', 'Purple Rain', 1984), ('Madonna', 'Like a Prayer', 1989),
    ('David Bowie', 'Heroes', 1977), ('David Bowie', 'Hunky Dory', 1971),
    ('Queen', 'A Night at the Opera', 1975), ('Queen', 'The Game', 1980),
    ('Led Zeppelin', 'Led Zeppelin IV', 1971), ('Led Zeppelin', 'Led Zeppelin II', 1969),
    ('Pink Floyd', 'Wish You Were Here', 1975), ('Pink Floyd', 'Animals', 1977),
    ('The Beatles', 'Revolver', 1966), ('The Beatles', 'Rubber Soul', 1965),
    ('The Rolling Stones', 'Let It Bleed', 1969), ('The Rolling Stones', 'Sticky Fingers', 1971),
    ('Fleetwood Mac', 'Tusk', 1979), ('Eagles', 'Hotel California', 1976),
    ('AC/DC', 'Back in Black', 1980), ('Metallica', 'Master of Puppets', 1986),
    ('Nirvana', 'In Utero', 1993), ('Pearl Jam', 'Ten', 1991),
    ('Radiohead', 'The Bends', 1995), ('Radiohead', 'In Rainbows', 2007),
    ('Oasis', 'Definitely Maybe', 1994), ('Blur', 'Parklife', 1994),
    ('The Strokes', 'Is This It', 2001), ('Arctic Monkeys', 'AM', 2013),
    ('Gorillaz', 'Demon Days', 2005), ('Tame Impala', 'Currents', 2015),
    ('Daft Punk', 'Homework', 1997), ('Massive Attack', 'Mezzanine', 1998),
    ('Portishead', 'Dummy', 1994), ('The Chemical Brothers', 'Dig Your Own Hole', 1997),
    ('Björk', 'Post', 1995), ('Björk', 'Homogenic', 1997),
    ('Miles Davis', 'Bitches Brew', 1970), ('John Coltrane', 'A Love Supreme', 1965),
    ('Dave Brubeck', 'Time Out', 1959), ('Herbie Hancock', 'Head Hunters', 1973),
    ('Nina Simone', 'I Put a Spell on You', 1965), ('Marvin Gaye', "What's Going On", 1971),
    ('Stevie Wonder', 'Songs in the Key of Life', 1976), ('Lauryn Hill', 'The Miseducation of Lauryn Hill', 1998),
    ('Soda Stereo', 'Dynamo', 1992), ('Soda Stereo', 'Signos', 1986),
    ('Gustavo Cerati', 'Ahí Vamos', 2006), ('Gustavo Cerati', 'Fuerza Natural', 2009),
    ('Charly García', 'Piano Bar', 1984), ('Pescado Rabioso', 'Artaud', 1973),
]
VERIFIED_IDS = {
    'Animals': 1065974284, 'Ten': 425465247, 'Is This It': 266376953,
    'Currents': 1440838039, 'Homogenic': 20833577, 'Head Hunters': 158571524,
    'Artaud': 321645242, 'Piano Bar': 1421884385,
}

def normalize(value):
    value = ''.join(c for c in unicodedata.normalize('NFKD', value.lower()) if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]+', ' ', value).strip()

def request(url):
    for attempt in range(4):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=40)
        except Exception:
            if attempt == 3:
                raise
            time.sleep(2 + attempt)

def get_json(url):
    with request(url) as response:
        return json.load(response)

def fetch(selection):
    artist, title, original_year = selection
    slug = normalize(artist + ' ' + title).replace(' ', '-')
    cache = ROOT / 'target/catalog-cache' / (slug + '.json')
    cache.parent.mkdir(parents=True, exist_ok=True)
    if cache.exists():
        cached = json.loads(cache.read_text(encoding='utf-8'))
        if len(cached['tracks']) >= 4 and normalize(cached['referenceEdition']).startswith(normalize(title)):
            return cached
    candidates = []
    for country in ('US', 'AR', 'GB'):
        if title in VERIFIED_IDS:
            results = get_json(f'https://itunes.apple.com/lookup?id={VERIFIED_IDS[title]}&country={country}')['results']
        else:
            query = urllib.parse.urlencode(dict(term=artist + ' ' + title, entity='album', limit=25, country=country))
            results = get_json('https://itunes.apple.com/search?' + query)['results']
        for item in results:
            if item.get('trackCount', 0) < 4 or ' - Single' in item['collectionName'] or ' - EP' in item['collectionName']:
                continue
            name, performer = normalize(item['collectionName']), normalize(item['artistName'])
            if normalize(artist) not in performer and performer not in normalize(artist):
                continue
            if not name.startswith(normalize(title)):
                continue
            if any(word in name for word in ('tribute', 'karaoke', 'live', 'en vivo', 'interview')):
                continue
            candidates.append((len(name) - len(normalize(title)), item, country))
        if candidates:
            break
    if not candidates:
        raise ValueError(f'No se encontró una edición verificada: {artist} / {title}')
    _, album, country = min(candidates, key=lambda x: x[0])
    lookup = get_json(f"https://itunes.apple.com/lookup?id={album['collectionId']}&entity=song&limit=200&country={country}")
    tracks = [dict(number=t['trackNumber'], disc=t.get('discNumber', 1), name=t['trackName'], durationMs=t.get('trackTimeMillis')) for t in lookup['results'] if t.get('kind') == 'song']
    artwork = album['artworkUrl100'].replace('100x100bb', '600x600bb')
    with request(artwork) as response:
        content = response.read()
        if not content.startswith(b'\xff\xd8'):
            raise ValueError('La portada no es un JPEG válido')
    image = '/covers/real/' + slug + '.jpg'
    (ROOT / 'client/marketplace/public' / image.lstrip('/')).write_bytes(content)
    genre = album.get('primaryGenreName', 'Rock')
    if artist in ('Soda Stereo', 'Gustavo Cerati', 'Charly García', 'Pescado Rabioso'):
        genre = 'Rock nacional'
    elif genre in ('Electronic', 'Dance'):
        genre = 'Electrónica'
    elif genre == 'Alternative':
        genre = 'Rock alternativo'
    highlights = ', '.join(t['name'] for t in tracks[:3])
    description = f'Álbum de {album["artistName"]}, publicado originalmente en {original_year}. Género: {genre}.'
    if highlights and len(description + ' Incluye ' + highlights + '.') <= 255:
        description += ' Incluye ' + highlights + '.'
    result = dict(slug=slug, name=title, artist=album['artistName'], genre=genre, year=original_year,
                  price=28000 + (SELECTION.index(selection) % 9) * 1500,
                  discountPercentage=15 if SELECTION.index(selection) % 4 == 0 else 0,
                  stock=0 if SELECTION.index(selection) % 13 == 0 else 3 + SELECTION.index(selection) % 8,
                  description=description, image=image, source=album['collectionViewUrl'],
                  artworkSource=artwork, referenceEdition=album['collectionName'], tracks=tracks)
    cache.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"OK: {artist} / {title} ({len(tracks)} canciones)", flush=True)
    return result

if __name__ == '__main__':
    additions, errors = [], []
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        futures = {pool.submit(fetch, selection): selection for selection in SELECTION}
        for future in concurrent.futures.as_completed(futures):
            try:
                additions.append(future.result())
            except Exception as error:
                errors.append(str(error))
                print('ERROR: ' + str(error), flush=True)
    if errors:
        raise RuntimeError('\n'.join(errors))
    additions.sort(key=lambda a: next(i for i, s in enumerate(SELECTION) if normalize(s[1]) == normalize(a['name'])))
    manifest = ROOT / 'catalog/albums.json'
    existing = json.loads(manifest.read_text(encoding='utf-8'))
    known = {(normalize(a['artist']), normalize(a['name'])) for a in existing}
    existing += [a for a in additions if (normalize(a['artist']), normalize(a['name'])) not in known]
    if len(existing) != 62:
        raise ValueError(f'Se esperaban 62 álbumes; se obtuvieron {len(existing)}')
    manifest.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Catálogo completo: 62 álbumes. Ejecutar import_catalog.py para cargar la base.')
