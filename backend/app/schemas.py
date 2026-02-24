from pydantic import BaseModel, Field


class StoreCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class StoreUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class StoreOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True