"""Health endpoint: answers 'is the server alive, and is it set up correctly?'"""
import shutil
from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import get_settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    settings = get_settings()
    return {
        "status": "ok",
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "server_time_utc": datetime.now(timezone.utc).isoformat(),
        # The video pipeline (Milestone 5+) needs these programs. Report the
        # real answer now so setup problems show up early. None = not found.
        "tools": {
            "ffmpeg": shutil.which("ffmpeg"),
            "ffprobe": shutil.which("ffprobe"),
        },
    }
