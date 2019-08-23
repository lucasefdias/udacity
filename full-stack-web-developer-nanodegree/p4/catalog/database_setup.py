#  -------------------------------------------------------------------
# Initial Configuration: import models and methods
#  -------------------------------------------------------------------
from models import Base
from sqlalchemy import create_engine

#  -------------------------------------------------------------------
# Create database
#  -------------------------------------------------------------------
engine = create_engine('sqlite:///catalog.db')
Base.metadata.create_all(engine)
