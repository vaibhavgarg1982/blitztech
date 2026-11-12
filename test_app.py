import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from app import app


class NavigationTests(unittest.TestCase):
    def test_navigation_matches_content_file(self):
        response = app.test_client().get("/api/navigation")
        expected = json.loads(
            (Path(app.root_path) / "navigation.json").read_text(encoding="utf-8")
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, "application/json")
        self.assertEqual(response.get_json(), expected)
        self.assertEqual(response.headers["Cache-Control"], "no-store")
        self.assertEqual(app.test_client().get("/navigation.json").status_code, 404)

    def test_content_is_reloaded_on_each_request(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "navigation.json"
            with patch.object(app, "root_path", directory):
                client = app.test_client()
                path.write_text('[{"title": "Original"}]', encoding="utf-8")
                self.assertEqual(client.get("/api/navigation").get_json()[0]["title"], "Original")
                path.write_text('[{"title": "Updated"}]', encoding="utf-8")
                self.assertEqual(client.get("/api/navigation").get_json()[0]["title"], "Updated")

    def test_invalid_json_is_reported_as_server_error(self):
        with tempfile.TemporaryDirectory() as directory:
            (Path(directory) / "navigation.json").write_text("invalid", encoding="utf-8")
            with patch.object(app, "root_path", directory), self.assertLogs(app.logger, "ERROR"):
                self.assertEqual(app.test_client().get("/api/navigation").status_code, 500)


if __name__ == "__main__":
    unittest.main()
