import pytest
from fastapi import status

@pytest.mark.asyncio
async def test_create_user_success(async_client):
    """
    Cenário: Criar um usuário válido.
    Expectativa: Retornar 201 Created e os dados sem a senha.
    """
    payload = {
        "name": "Reimu Hakurei",
        "email": "reimu@hakurei.jp",
        "password": "donation_please"
    }

    response = await async_client.post("/users/", json=payload)

    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == payload["email"]
    assert "id" in data
    assert "password" not in data

@pytest.mark.asyncio
async def test_create_user_duplicate_email(async_client):
    """
    Cenário: Tentar criar dois usuários com o mesmo e-mail.
    Expectativa: O segundo deve falhar com 400 Bad Request.
    """
    payload = {
        "name": "Duplicate User",
        "email": "dup@test.com",
        "password": "12345678"
    }

    await async_client.post("/users/", json=payload)

    response = await async_client.post("/users/", json=payload)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "Email already registered"