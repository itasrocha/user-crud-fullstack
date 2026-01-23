import pytest
from fastapi import status

async def create_user_helper(client, name="Hakurei Reimu", email="donations-wanted@hakurei.jp", password="100YenOrBust!"):
    payload = {
        "name": name,
        "email": email,
        "password": password,
    }
    return await client.post("/users/", json=payload)


@pytest.mark.asyncio
class TestCreateUser:
    async def test_create_user_success(self, async_client):
        """
        Cenário: Criar um usuário válido.
        Expectativa: 201 Created e dados íntegros.
        """
        payload = {
            "name": "Kirisame Marisa",
            "email": "daze@kirisame.jp",
            "password": "MasterSpark_8oz"
        }
        
        response = await async_client.post("/users/", json=payload)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert "id" in data
        assert "password" not in data

    async def test_create_user_duplicate_email(self, async_client):
        """
        Cenário: Tentar criar um usuário com email duplicado.
        Expectativa: 400 Bad Request.
        """
        email = "flandre@scarlet.jp"
        await create_user_helper(async_client, name="Flan_001", email=email, password="495Years_BearBust")
        
        response = await create_user_helper(async_client, name="Flan_002", email=email, password="495Years_BearBust")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.json()["detail"] == "Email already registered"


@pytest.mark.asyncio
class TestReadUser:
    async def test_read_users_list(self, async_client):
        """
        Cenário: Listar usuários cadastrados (paginado).
        Expectativa: Retornar lista de usuários criados.
        """
        await create_user_helper(async_client, name="Satori Komeiji", email="satori@komeiji.net", password="OpenThirdEye")
        await create_user_helper(async_client, name="Koishi Komeiji", email="koishi@komeiji.net", password="ClosedThirdEye")

        response = await async_client.get("/users/", params={"limit": 10, "skip": 0})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2

    async def test_read_user_by_id_success(self, async_client):
        """
        Cenário: Buscar por ID existente.
        Expectativa: Retornar o usuário com o ID especificado.
        """
        user_resp = await create_user_helper(async_client)
        user_name = user_resp.json()["name"]
        user_id = user_resp.json()["id"]

        response = await async_client.get(f"/users/{user_id}")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["name"] == user_name

    async def test_read_user_not_found(self, async_client):
        """
        Cenário: Buscar por ID inexistente.
        Expectativa: 404 Not Found.
        """
        response = await async_client.get("/users/9999")
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.asyncio
class TestUpdateUser:
    async def test_update_user_name_only(self, async_client):
        """
        Cenário: Atualizar apenas o nome de um usuário.
        Expectativa: Nome alterado.
        """
        user_resp = await create_user_helper(async_client, name="Patchouli Knowledge", email="patchy@knowledge.jp", password="library_voile")
        user_email = user_resp.json()["email"]
        user_id = user_resp.json()["id"]

        update_payload = {"name": "Patchy"}
        response = await async_client.patch(f"/users/{user_id}", json=update_payload)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Patchy"
        assert data["email"] == "patchy@knowledge.jp"


@pytest.mark.asyncio
class TestDeleteUser:
    async def test_delete_user_flow(self, async_client):
        """
        Cenário: Deletar usuário. 
        Expectativa: Após deletado, 404 Not Found ao buscar.
        """
        user_resp = await create_user_helper(async_client, name="Cirno", email="cirno@fairy.jp", password="STRONGEST_NINE")
        user_id = user_resp.json()["id"]

        del_response = await async_client.delete(f"/users/{user_id}")
        assert del_response.status_code == status.HTTP_204_NO_CONTENT

        get_response = await async_client.get(f"/users/{user_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND