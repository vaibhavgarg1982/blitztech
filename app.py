from pathlib import Path

from flask import Flask


app = Flask(__name__, static_folder="dist", static_url_path="")


@app.get("/")
def index():
    return app.send_static_file("index.html")


if __name__ == "__main__":
    if not (Path(app.root_path) / "dist" / "index.html").is_file():
        raise SystemExit("Frontend build not found. Run 'npm run build' first.")
    app.run(host="127.0.0.1", port=5050)
