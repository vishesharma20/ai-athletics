from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_ok():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "ATHLETEX AI API"
    assert "server_time_utc" in body


def test_health_reports_tool_availability():
    body = client.get("/api/v1/health").json()
    # Value is a path string if installed, or null if not. Key must exist.
    assert "ffmpeg" in body["tools"]
    assert "ffprobe" in body["tools"]


def test_cors_allows_frontend_origin():
    response = client.get("/api/v1/health", headers={"Origin": "http://localhost:3000"})
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_unknown_route_returns_404():
    assert client.get("/api/v1/does-not-exist").status_code == 404
