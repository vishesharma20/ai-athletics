"""Collects every route module into one router.

Later milestones add lines here, for example:
    api_router.include_router(auth.router, prefix="/auth")
"""
from fastapi import APIRouter

from app.api.routes import health

api_router = APIRouter()
api_router.include_router(health.router)
