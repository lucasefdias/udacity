from models import Category, Item
from db import Session

session = Session()

# -------------------
# Dummy data
# -------------------
# Categories
categories = []
categories.append(Category(name="Accessories"))
categories.append(Category(name="Audio"))
categories.append(Category(name="Bass"))
categories.append(Category(name="Drums"))
categories.append(Category(name="Eletronics"))
categories.append(Category(name="Guitar"))
categories.append(Category(name="Keyboard"))
categories.append(Category(name="Orchestra"))
categories.append(Category(name="Software"))

for category in categories:
    session.add(category)
    session.commit()

print("Added categories!")

# Items
items = []
items.append(Item(
                  title="Accessory 1",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=1,
                  owner_id=1
                  ))

items.append(Item(
                  title="Accessory 2",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=1,
                  owner_id=2
                  ))
items.append(Item(
                  title="Audio 1",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=2,
                  owner_id=1
                  ))

items.append(Item(
                  title="Audio 2",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=2,
                  owner_id=2
                  ))
items.append(Item(
                  title="Bass 1",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=3,
                  owner_id=1
                  ))

items.append(Item(
                  title="Bass 2",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=3,
                  owner_id=2
                  ))
items.append(Item(
                  title="Drums 1",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=4,
                  owner_id=1
                  ))

items.append(Item(
                  title="Drums 2",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=4,
                  owner_id=2
                  ))
items.append(Item(
                  title="Eletronics 1",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=5,
                  owner_id=1
                  ))

items.append(Item(
                  title="Eletronics 2",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=5,
                  owner_id=2
                  ))
items.append(Item(
                  title="Guitar 1",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=6,
                  owner_id=1
                  ))

items.append(Item(
                  title="Guitar 2",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=6,
                  owner_id=2
                  ))
items.append(Item(
                  title="Keyboard 1",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=7,
                  owner_id=1
                  ))

items.append(Item(
                  title="Keyboard 2",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=7,
                  owner_id=2
                  ))
items.append(Item(
                  title="Orchestra 1",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=8,
                  owner_id=1
                  ))

items.append(Item(
                  title="Orchestra 2",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=8,
                  owner_id=2
                  ))
items.append(Item(
                  title="Software 1",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=9,
                  owner_id=1
                  ))

items.append(Item(
                  title="Software 2",
                  description="""Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea
                   commodo consequat. """,
                  category_id=9,
                  owner_id=2
                  ))
for item in items:
    session.add(item)
    session.commit()


print("Added items!")

session.close()
