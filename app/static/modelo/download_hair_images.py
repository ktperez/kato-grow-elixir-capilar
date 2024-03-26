# download_hair_images.py
from icrawler.builtin import GoogleImageCrawler
import os

def download_images(keyword, limit):
    google_crawler = GoogleImageCrawler(
        feeder_threads=1,
        parser_threads=1,
        downloader_threads=4,
        storage={'root_dir': f'./app/static/modelo/hair_images/{keyword.replace(" ", "_")}'}
    )

    google_crawler.crawl(
        keyword=keyword,
        max_num=limit,
        min_size=(200, 200),
        max_size=None,
        file_idx_offset=0
    )

    # Directorio donde se descargaron las imágenes
    directory = f"app/static/modelo/hair_images/{keyword.replace(' ', '_')}"

    try:
        # Lista los archivos en el directorio
        files = os.listdir(directory)
        print(files)
    except FileNotFoundError as e:
        print(f"Error al listar archivos: {e}")

# Descargar imágenes para cada tipo de cabello
download_images("mujer cabello rizado", 100)
download_images("mujer cabello liso", 100)
download_images("mujer cabello ondulado", 100)
