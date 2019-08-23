#  -------------------------------------------------------------------
# Initial Configuration
#  -------------------------------------------------------------------
import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


#  -------------------------------------------------------------------
# Model definitions
#  -------------------------------------------------------------------
class Category(Base):
    """ Categories model for the catalog """

    # Table code
    __tablename__ = "categories"

    # Mapper code
    id = Column(Integer, primary_key=True)
    name = Column(String(100), index=True, nullable=False, unique=True)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }


class User(Base):
    """ User model """

    # Table code
    __tablename__ = "users"

    # Mapper code
    id = Column(Integer, primary_key=True)
    username = Column(String(100), index=True, nullable=False, unique=True)
    date_created = Column(DateTime, default=datetime.datetime.utcnow)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'date_created': self.date_created
        }


class Item(Base):
    """ Items model for the catalog """

    # Table code
    __tablename__ = "items"

    # Mapper code
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(String(500))
    category_id = Column(Integer, ForeignKey('categories.id'))
    categories = relationship(Category)
    owner_id = Column(Integer, ForeignKey('users.id'))
    users = relationship(User)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category_id': self.category_id,
            'owner_id': self.owner_id,
            'last_updated': self.last_updated
        }
