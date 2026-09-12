"""Credentials shared only by gallery story generation and photo search."""

import os


def api_key():
    """Prefer the gallery override, including an explicit blank to disable it.

    Older deployments without the override retain their general provider key.
    A gallery-only key does not enable other features that use that general key.
    """
    if "GALLERY_ANTHROPIC_API_KEY" in os.environ:
        return os.environ["GALLERY_ANTHROPIC_API_KEY"].strip()
    return os.environ.get("ANTHROPIC_API_KEY", "").strip()
