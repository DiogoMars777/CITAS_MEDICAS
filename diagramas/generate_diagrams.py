import os
import re
import urllib.request
import time

puml_file = os.path.join("diagramas", "diagramas_analisis_clases_cu01_cu12.puml")
if not os.path.exists(puml_file):
    print("No se encontró el archivo PUML")
    exit(1)

with open(puml_file, "r", encoding="utf-8") as f:
    content = f.read()

# Extraer cada bloque @startuml ... @enduml
pattern = re.compile(r"(@startuml\s+([a-zA-Z0-9_]+).*?@enduml)", re.DOTALL)
matches = pattern.findall(content)

print(f"Total diagramas encontrados: {len(matches)}")

for block, name in matches:
    png_path = os.path.join("diagramas", f"{name}.png")
    print(f"Renderizando {name}...")
    
    success = False
    for attempt in range(3):
        try:
            req = urllib.request.Request(
                "https://kroki.io/plantuml/png",
                data=block.encode("utf-8"),
                headers={
                    "Content-Type": "text/plain; charset=utf-8",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                }
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                if data.startswith(b"\x89PNG"):
                    with open(png_path, "wb") as img:
                        img.write(data)
                    print(f"  -> Éxito: {png_path} ({len(data)} bytes)")
                    success = True
                    break
                else:
                    print(f"  -> Error: Respuesta no es PNG (bytes={len(data)})")
        except Exception as e:
            print(f"  -> Intento {attempt+1} falló: {e}")
            time.sleep(1.5)
            
    if not success:
        print(f" [ERROR] No se pudo renderizar {name}")

print("\nProceso finalizado.")
