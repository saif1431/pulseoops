"""Webhooks router — Stripe webhook handler, implementation in B4."""
from fastapi import APIRouter

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])
