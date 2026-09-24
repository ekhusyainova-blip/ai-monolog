# конвертировать SVG в PNG
# pip install cairosvg
import cairosvg
cairosvg.svg2png(url="static/icon.svg", write_to="static/icon-192.png", output_width=192)
cairosvg.svg2png(url="static/icon.svg", write_to="static/icon-512.png", output_width=512)