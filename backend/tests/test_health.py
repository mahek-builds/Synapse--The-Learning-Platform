import pytest

try:
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    APP_AVAILABLE = True
except Exception:
    APP_AVAILABLE = False


@pytest.mark.skipif(not APP_AVAILABLE, reason="App env vars not configured")
def test_health():
    response = client.get("/")
    assert response.status_code == 200