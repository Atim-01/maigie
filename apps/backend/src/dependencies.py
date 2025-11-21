"""Dependency injection system."""

from typing import Annotated

from fastapi import Depends, Header, HTTPException, status

from .config import Settings, get_settings


def get_settings_dependency() -> Settings:
    """Dependency to get application settings."""
    return get_settings()


# Common dependencies
SettingsDep = Annotated[Settings, Depends(get_settings_dependency)]


async def verify_api_key(
    x_api_key: Annotated[str | None, Header()] = None,
    settings: SettingsDep = None,
) -> bool:
    """
    Verify API key header (placeholder for future implementation).
    
    For now, this is a placeholder that always returns True.
    In production, implement proper API key validation.
    """
    # TODO: Implement API key validation
    return True


def get_current_user_id() -> str:
    """
    Get current user ID from request (placeholder for future implementation).
    
    This will be implemented when authentication is added.
    """
    # TODO: Extract user ID from JWT token
    return "user-id-placeholder"


# Dependency for authenticated endpoints
CurrentUserIdDep = Annotated[str, Depends(get_current_user_id)]

