# Manages db session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

# Connect with database
engine = create_engine('sqlite:///catalog.db')

# Estabilish a link between class definitions and corresponding tables
Base.metadata.bind = engine

# Create a session
Session = sessionmaker(bind=engine)
