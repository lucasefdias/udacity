from db import Session
from datetime import datetime
from flask import flash, redirect
from models import Item, User
from sqlalchemy import exc


# ----------------------- #
# User methods
# ----------------------- #
def create_user(login_session, redirect_url):
    """Creates a new user and add to database"""

    # Create db_session
    db_session = Session()

    # Check to see if user exists in database and add it otherwise
    user_id = get_user_id(login_session['profile']['username'])

    if not user_id:
        # Add user to database
        try:
            new_user = User(username=login_session['profile']['username'])
            db_session.add(new_user)
            db_session.commit()
            flash("User created", "success")
        except exc.SQLAlchemyError:
            flash("Failed to create user", "danger")
            return redirect(redirect_url)

    # Query created user
    user = db_session.query(User).filter_by(
        username=login_session['profile']['username']).one()

    # Close DB session
    db_session.close()

    return user.id


def get_user_info(user_id):
    """Query user by id"""

    # Create db_session
    db_session = Session()

    # Query user by id
    user = db_session.query(User).filter_by(id=user_id).one()

    # Close DB session
    db_session.close()

    return user


def get_user_id(username):
    """Get user id given a username"""

    try:
        # Create db_session
        db_session = Session()

        # Query user by email
        user = db_session.query(User).filter_by(username=username).one()

        # Close DB session
        db_session.close()

        return user.id
    except:  # noqa: E722
        return None


# ----------------------- #
# Item methods
# ----------------------- #
# Create
def create_item(request, redirect_url, user_id):
    """Creates a new item and add to database"""

    # Check if form is complete
    check_item_form_data(request, redirect_url)

    # Create DB session
    db_session = Session()

    # Add new item to database
    try:
        new_item = Item(
            title=request.form.get("title"),
            description=request.form.get("description"),
            category_id=request.form.get("category"),
            owner_id=user_id)
        db_session.add(new_item)
        db_session.commit()
    except exc.SQLAlchemyError:
        flash("There was an error. Please try again.", "danger")
        return redirect(redirect_url)

    # Close DB session
    db_session.close()

    flash("Item added!", "success")


# Update
def update_item(item_id, request, redirect_url):
    """Update item in database"""

    # Check if form is complete
    check_item_form_data(request, redirect_url)

    # Create DB session
    db_session = Session()

    # Query item in database by id
    item = db_session.query(Item).filter_by(id=item_id).one()

    # Update corresponding item in database
    try:
        item.title = request.form.get("title")
        item.description = request.form.get("description")
        item.category_id = request.form.get("category")
        item.last_updated = datetime.utcnow()
        db_session.add(item)
        db_session.commit()
    except exc.SQLAlchemyError:
        flash("There was an error. Please try again.", "danger")
        return redirect(redirect_url, item_id=item_id)

    # Close DB session
    db_session.close()


# Delete
def delete_item(item_id, redirect_url):
    """Delete an item from database"""

    # Create DB session
    db_session = Session()

    # Delete corresponding item
    try:
        item = db_session.query(Item).filter_by(id=item_id).one()
        db_session.delete(item)
        db_session.commit()
    except exc.SQLAlchemyError:
        flash("There was an error. Please try again.", "danger")
        return redirect(redirect_url)

    # Close DB session
    db_session.close()


# Auxiliar
def check_item_form_data(request, redirect_url):
    """ Verifies if item form is complete """

    # Check for required form data
    if not request.form.get("title"):
        flash("Please provide item title", "danger")
        return redirect(redirect_url)
    if not request.form.get("description"):
        flash("Please provide item description", "danger")
        return redirect(redirect_url)
    if not request.form.get("category"):
        flash("Please provide item category", "danger")
        return redirect(redirect_url)


def check_item_ownership(item_id, user_id):
    """Check if current user is the owner of the item"""

    # Create DB session
    db_session = Session()

    # Query corresponding item
    item = db_session.query(Item).filter_by(id=item_id).one()

    # Close DB session
    db_session.close()

    if item.owner_id == user_id:
        return True
    else:
        return False
