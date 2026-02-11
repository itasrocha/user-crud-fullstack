import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select
from app.core.database import AsyncSessionLocal, engine
from app.models.user import UserModel
from app.core.security import get_password_hash

USERS_TO_SEED = [
    {
        "name": "Yakumo Yukari",
        "email": "trains@gap.jp",
        "password": "Ran_is_my_pet"
    },
    {
        "name": "Hakurei Reimu",
        "email": "donations-wanted@hakurei.jp",
        "password": "100YenOrBust!"
    },
    {
        "name": "Kirisame Marisa",
        "email": "daze@kirisame.jp",
        "password": "MasterSpark_8oz"
    },
    {
        "name": "Izayoi Sakuya",
        "email": "pads@mansion.jp",
        "password": "ZaWarudo"
    },
    {
        "name": "Satori Komeiji",
        "email": "satori@komeiji.net",
        "password": "OpenThirdEye"
    },
    {
        "name": "Koishi Komeiji",
        "email": "koishi@komeiji.net",
        "password": "ClosedThirdEye"
    },
    {
        "name": "Youmu Konpaku",
        "email": "myon@netherworld.jp",
        "password": "HalfPhantom"
    },
    {
        "name": "Patchouli Knowledge",
        "email": "patchy@knowledge.jp",
        "password": "library_voile"
    },
    {
        "name": "Cirno",
        "email": "cirno@fairy.jp",
        "password": "STRONGEST_NINE"
    },
     {
        "name": "Flandre Scarlet",
        "email": "flandre@scarlet.jp",
        "password": "495Years_BearBust"
    }
]

async def seed_users():
    async with AsyncSessionLocal() as session:
        print(f"Starting database seeding with {len(USERS_TO_SEED)} users...")
        
        for user_data in USERS_TO_SEED:
            result = await session.execute(
                select(UserModel).where(UserModel.email == user_data["email"])
            )
            existing_user = result.scalars().first()
            
            if not existing_user:
                print(f"Creating user: {user_data['name']} ({user_data['email']})")
                new_user = UserModel(
                    name=user_data["name"],
                    email=user_data["email"],
                    password_hash=get_password_hash(user_data["password"])
                )
                session.add(new_user)
            else:
                print(f"User already exists: {user_data['email']}, skipping.")
        
        await session.commit()
        print("Database seeding completed.")

if __name__ == "__main__":
    asyncio.run(seed_users())
