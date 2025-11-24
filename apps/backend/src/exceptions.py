"""
Custom exception classes and handlers.

Copyright (C) 2024 Maigie Team

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
"""

from typing import Any

from fastapi import Request, status
from fastapi.responses import JSONResponse


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: dict[str, Any] | None = None,
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class NotFoundError(AppException):
    """Resource not found exception."""

    def __init__(self, resource: str, identifier: str | None = None):
        message = f"{resource} not found"
        if identifier:
            message += f": {identifier}"
        super().__init__(message, status_code=status.HTTP_404_NOT_FOUND)


class ValidationError(AppException):
    """Validation error exception."""

    def __init__(self, message: str, details: dict[str, Any] | None = None):
        super().__init__(
            message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details,
        )


class AuthenticationError(AppException):
    """Authentication error exception."""

    def __init__(self, message: str = "Authentication failed"):
        super().__init__(
            message,
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


class AuthorizationError(AppException):
    """Authorization error exception."""

    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(
            message,
            status_code=status.HTTP_403_FORBIDDEN,
        )


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """Global exception handler for AppException."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": exc.message,
                "type": exc.__class__.__name__,
                "details": exc.details,
            }
        },
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Global exception handler for unhandled exceptions."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "message": "Internal server error",
                "type": "InternalServerError",
                "details": {},
            }
        },
    )
