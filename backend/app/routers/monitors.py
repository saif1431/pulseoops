"""Monitors router — implementation in B2."""
from fastapi import APIRouter

router = APIRouter(prefix="/api/monitors", tags=["monitors"])
