from db import Session
from models import Category, Item, User

# Create session
session = Session()

# Query data
categories = session.query(Category).all()
items = session.query(Item).all()
users = session.query(User).all()

# JOIN Items and categories
results = (
    session
    .query(Item, Category)
    .join(Category, Item.category_id == Category.id)
    .order_by(Item.last_updated.desc())
    .limit(10)
)


session.close()

print("Categories:\n")
for category in categories:
    print("id: {}   name: {}".format(category.id, category.name))

print("\nItems:\n")
for item in items:
    print("id: {}   title: {}".format(item.id, item.title))

print("\nUsers:\n")
for user in users:
    print("id: {}   username: {}".format(
        user.id, user.username))

print("\nJoins:\n")
for result in results:
    print("""
             id: {}
             title: {}
             description: {}
             category_id: {}
             owner_id: {}
             last_updated: {}
             category_name: {}"""
          .format(
                result.Item.id,
                result.Item.title,
                result.Item.description,
                result.Item.category_id,
                result.Item.owner_id,
                result.Item.last_updated,
                result.Category.name
          ))
