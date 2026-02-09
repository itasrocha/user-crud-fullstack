FROM python:3.14-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    POETRY_VERSION=2.2.1 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1 

ENV PATH="$POETRY_HOME/bin:$PATH"

WORKDIR /code


RUN apt-get update \
    && apt-get install -y --no-install-recommends curl libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry using the standalone installer
RUN curl -sSL https://install.python-poetry.org | python3 -

COPY pyproject.toml poetry.lock ./

# Development
FROM base AS development
RUN poetry install --no-root
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Production
FROM base AS production
RUN poetry install --no-root --only main
COPY . .
CMD ["gunicorn", "app.main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]