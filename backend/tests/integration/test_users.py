import pytest
from fastapi import status

async def create_user_helper(client, name="Hakurei Reimu", email="donations-wanted@hakurei.jp", password="100YenOrBust!"):
    payload = {
        "name": name,
        "email": email,
        "password": password,
    }
    return await client.post("/v1/users/", json=payload)


@pytest.mark.asyncio
class TestCreateUser:
    async def test_register_public(self, async_client):
        """
        Cenário: Registro público de novo usuário.
        Expectativa: 200 OK (Token response)
        """
        payload = {
            "name": "Kirisame Marisa",
            "email": "daze@kirisame.jp",
            "password": "MasterSpark_8oz"
        }
        
        response = await async_client.post("/v1/auth/register", json=payload)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    async def test_create_user(self, authorized_client):
        """
        Cenário: Cria usuário via endpoint protegido.
        Expectativa: 201 Created e dados íntegros.
        """
        payload = {
            "name": "Izayoi Sakuya",
            "email": "pads@mansion.jp",
            "password": "ZaWarudo"
        }
        
        response = await authorized_client.post("/v1/users/", json=payload)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
    
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert "id" in data
        assert "password" not in data

    async def test_create_user_duplicate_email(self, authorized_client):
        """
        Cenário: Tentar criar um usuário com email duplicado.
        Expectativa: 409 Conflict.
        """
        email = "flandre@scarlet.jp"
        await create_user_helper(authorized_client, name="Flan_001", email=email, password="495Years_BearBust")
        
        response = await create_user_helper(authorized_client, name="Flan_002", email=email, password="495Years_BearBust")

        assert response.status_code == status.HTTP_409_CONFLICT
        assert response.json()["detail"] == "User with this email already exists"


@pytest.mark.asyncio
class TestReadUser:
    async def test_read_users_list(self, authorized_client):
        """
        Cenário: Listar usuários cadastrados (paginado).
        Expectativa: Retornar lista de usuários criados.
        """
        await create_user_helper(authorized_client, name="Satori Komeiji", email="satori@komeiji.net", password="OpenThirdEye")
        await create_user_helper(authorized_client, name="Koishi Komeiji", email="koishi@komeiji.net", password="ClosedThirdEye")

        response = await authorized_client.get("/v1/users/", params={"limit": 10, "skip": 0})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 3 

    async def test_read_user_by_id_success(self, authorized_client):
        """
        Cenário: Buscar por ID existente.
        Expectativa: Retornar o usuário com o ID especificado.
        """
        user_resp = await create_user_helper(authorized_client, name="Youmu Konpaku", email="myon@netherworld.jp", password="HalfPhantom")
        user_name = user_resp.json()["name"]
        user_id = user_resp.json()["id"]

        response = await authorized_client.get(f"/v1/users/{user_id}")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["name"] == user_name

    async def test_read_user_not_found(self, authorized_client):
        """
        Cenário: Buscar por ID inexistente.
        Expectativa: 404 Not Found.
        """
        response = await authorized_client.get("/v1/users/9999")
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.asyncio
class TestUpdateUser:
    async def test_update_user_name_only(self, authorized_client):
        """
        Cenário: Atualizar apenas o nome de um usuário.
        Expectativa: Nome alterado.
        """
        user_resp = await create_user_helper(authorized_client, name="Patchouli Knowledge", email="patchy@knowledge.jp", password="library_voile")
        user_email = user_resp.json()["email"]
        user_id = user_resp.json()["id"]

        update_payload = {"name": "Patchy"}
        response = await authorized_client.patch(f"/v1/users/{user_id}", json=update_payload)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Patchy"
        assert data["email"] == "patchy@knowledge.jp"


@pytest.mark.asyncio
class TestDeleteUser:
    async def test_delete_user_flow(self, authorized_client):
        """
        Cenário: Deletar usuário. 
        Expectativa: Após deletado, 404 Not Found ao buscar.
        """
        user_resp = await create_user_helper(authorized_client, name="Cirno", email="cirno@fairy.jp", password="STRONGEST_NINE")
        user_id = user_resp.json()["id"]

        del_response = await authorized_client.delete(f"/v1/users/{user_id}")
        assert del_response.status_code == status.HTTP_204_NO_CONTENT

        get_response = await authorized_client.get(f"/v1/users/{user_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND