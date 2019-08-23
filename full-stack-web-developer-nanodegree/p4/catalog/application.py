from flask import (Flask, flash, jsonify, make_response, redirect,
                   render_template, request, session as login_session, url_for)
from db import Session
from functools import wraps
from middleware import (check_item_ownership, create_item, update_item,
                        delete_item, create_user, get_user_id)
from models import Category, Item, User

# Auth0 imports
from authlib.flask.client import OAuth
from six.moves.urllib.parse import urlencode

import json
import random
import string

# Configure app
app = Flask(__name__)
app.secret_key = 'mysecretkey'

# Initialize Auth0
oauth = OAuth(app)

auth0 = oauth.register(
    'auth0',
    client_id='VFLcuGdWEwCE9pgz3xNBUcFAR8JPIPyy',
    client_secret=(
        'bIch44aEgIGkFWqtQdfkxxUzDYma0bHe1ryPQuso23BuixpMswcUm_HynBLhifNM'),
    api_base_url='https://dev-71lnfuf3.auth0.com',
    access_token_url='https://dev-71lnfuf3.auth0.com/oauth/token',
    authorize_url='https://dev-71lnfuf3.auth0.com/authorize',
    client_kwargs={
        'scope': 'openid profile',
    },
)


# Wrapper for login-required routes
def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'profile' not in login_session:
            # Redirect to Login page here
            return redirect('/login')
        return f(*args, **kwargs)

    return decorated


# ------------------------------------------------------ #
#                                                        #
# ROUTES                                                 #
#                                                        #
# ------------------------------------------------------ #
# ----------------------- #
# Index                   #
# ----------------------- #
@app.route('/')
@app.route('/catalog')
def index():
    """Index route (home page): displays all categories and latest items """

    # Create DB session
    db_session = Session()

    # Query all categories
    categories = db_session.query(Category).all()
    # Query latest items with corresponding category names
    items = (
        db_session
        .query(Item, Category)
        .join(Category, Item.category_id == Category.id)
        .order_by(Item.last_updated.desc())
        .limit(10)
    )

    # Close DB session
    db_session.close()

    return render_template("index.html", categories=categories, items=items)


# ----------------------- #
# User auth               #
# ----------------------- #
@app.route('/login')
def login():
    """ Shows user login page """

    # Generate state token for request validation
    state = ''.join(random
                    .choice(string.ascii_uppercase + string.digits)
                    for x in range(32))
    login_session['state'] = state

    return render_template("login.html", state=login_session['state'])


@app.route('/auth0/<state>')
def auth0_trigger_authentication(state):
    """Trigger Auth0 authentication """

    # Validate state token
    if state != login_session['state']:
        response = make_response(json.dumps('Invalid state parameter.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    return auth0.authorize_redirect(
        redirect_uri=url_for('auth0_callback', _external=True),
        audience='https://dev-71lnfuf3.auth0.com/userinfo')


@app.route('/auth0_callback')
def auth0_callback():
    """ Handle Auth0 API response """

    # Handles response from token endpoint
    auth0.authorize_access_token()
    resp = auth0.get('userinfo')
    userinfo = resp.json()

    # Store the user information in flask session.
    login_session['jwt_payload'] = userinfo
    login_session['profile'] = {
        'user_id': userinfo['sub'],
        'username': userinfo['nickname'],
        'first_name': userinfo['given_name'],
        'last_name': userinfo['family_name']
    }

    # Check if user already exists in database and create it otherwise
    create_user(login_session, url_for('login'))

    flash("Welcome, %s" % login_session['profile']['first_name'], "success")

    return redirect(url_for('index'))


@app.route('/logout')
def logout():
    """Logout using Auth0"""

    # Clear session stored data
    login_session.clear()

    # Redirect user to logout endpoint
    params = {'returnTo': url_for('index', _external=True),
              'client_id': auth0.client_id}

    flash("Successfully logged out!", "success")

    return redirect(auth0.api_base_url + '/v2/logout?' + urlencode(params))


# ----------------------- #
#                         #
# CRUD Routes             #
#                         #
# ----------------------- #
# ----------------------- #
# Category - read         #
# ----------------------- #
@app.route('/catalog/<category_name>/')
def category(category_name):
    """ Shows all items for a specific category """

    # Create DB session
    db_session = Session()

    # Query all categories and find selected category
    categories = db_session.query(Category).all()
    for category in categories:
        if category.name == category_name:
            current_category = category
            break

    # Query items for corresponding category
    items = (
        db_session
        .query(Item)
        .filter_by(category_id=current_category.id)
        .order_by(Item.title)
        .all()
    )

    # Close DB session
    db_session.close()

    return render_template("category.html",
                           category_name=category_name,
                           categories=categories,
                           items=items)


# ----------------------- #
# Items                   #
# ----------------------- #
# Create
@app.route('/catalog/new', methods=["GET", "POST"])
@requires_auth
def item_new():
    """ Item create route """

    # POST
    if request.method == 'POST':

        username = login_session['profile']['username']

        create_item(request, url_for('item_new'), get_user_id(username))

        return redirect(url_for('index'))

    # GET
    else:
        # Create DB session
        db_session = Session()

        # Query all categories
        categories = db_session.query(Category).all()

        # Close DB session
        db_session.close()

        return render_template("item_new.html", categories=categories)


# Read
@app.route('/catalog/<category_name>/<int:item_id>')
def item_show(category_name, item_id):
    """ Item show page """

    # Create DB session
    db_session = Session()

    # Query selected item
    item = db_session.query(Item).filter_by(id=item_id).one()

    user_id = None

    # If user is logged in, get user id
    if('profile' in login_session):
        username = login_session['profile']['username']
        user_id = get_user_id(username)

    # Close DB session
    db_session.close()

    return render_template("item_show.html",
                           category_name=category_name,
                           item=item,
                           user_id=user_id)


# Update
@app.route('/catalog/<int:item_id>/edit', methods=["GET", "POST"])
@requires_auth
def item_edit(item_id):
    """ Item edit route """

    # Check user permission
    username = login_session['profile']['username']
    if not check_item_ownership(item_id,
                                get_user_id(username)):
        flash("You don't have permission to do that.", "danger")
        return redirect(url_for('index'))

    # POST
    if request.method == 'POST':

        # Update corresponding item in database
        update_item(item_id, request, url_for('item_edit', item_id=item_id))

        # Create DB session
        db_session = Session()

        # Query category name to build redirect url
        category = (db_session
                    .query(Category)
                    .filter_by(id=request.form.get("category"))
                    .one())

        # Close DB session
        db_session.close()

        flash("Item updated!", "success")
        return redirect(url_for('item_show',
                                category_name=category.name,
                                item_id=item_id))

    # GET
    else:
        # Create DB session
        db_session = Session()

        # Query all categories
        categories = db_session.query(Category).all()
        # Query selected item
        item = db_session.query(Item).filter_by(id=item_id).one()

        # Close DB session
        db_session.close()

        return render_template("item_edit.html",
                               categories=categories,
                               item=item)


# Delete
@app.route('/catalog/<int:item_id>/delete', methods=["GET", "POST"])
@requires_auth
def item_delete(item_id):
    """ Item delete route """

    # Check user permission
    username = login_session['profile']['username']
    if not check_item_ownership(item_id,
                                get_user_id(username)):
        flash("You don't have permission to do that.", "danger")
        return redirect(url_for('index'))

    # POST
    if request.method == 'POST':

        # Delete corresponding item
        delete_item(item_id, url_for('item_delete', item_id=item_id))

        flash("Item deleted!", "success")

        return redirect(url_for('index'))

    # GET
    else:
        # Create DB session
        db_session = Session()

        # Query selected item
        item = db_session.query(Item).filter_by(id=item_id).one()

        # Query item category to build redirect url
        category = (db_session
                    .query(Category)
                    .filter_by(id=item.category_id)
                    .one())

        # Close DB session
        db_session.close()

        return render_template("item_delete.html",
                               category_name=category.name,
                               item=item)


# ----------------------- #
# API Endpoints           #
# ----------------------- #
# Full catalog
@app.route('/api/v1/catalog.JSON')
def catalogJSON():
    """ Full catalog API Endpoint """

    # Create DB session
    db_session = Session()

    # Query all categories
    categories = db_session.query(Category).all()
    serialized_categories = []
    for category in categories:
        # Query all items for each category
        items = (
            db_session
            .query(Item)
            .filter_by(category_id=category.id)
            .order_by(Item.title)
            .all()
        )
        # Serialize current category and add corresponding serialized items
        serialized_category = category.serialize
        serialized_category["Items"] = []
        for item in items:
            serialized_category["Items"].append(item.serialize)
        serialized_categories.append(serialized_category)

    # Close DB session
    db_session.close()

    return jsonify(Categories=[
        category for category in serialized_categories])


# Categories
@app.route('/api/v1/catalog/categories.JSON')
def categoriesJSON():
    """ Categories API Endpoint """

    # Create DB session
    db_session = Session()

    # Query all categories
    categories = db_session.query(Category).all()

    # Close DB session
    db_session.close()

    return jsonify(Categories=[category.serialize for category in categories])


@app.route('/api/v1/catalog/categories/<category_name>/JSON')
def categoryJSON(category_name):
    """ JSON data for specific category """

    # Create DB session
    db_session = Session()

    # Query all categories
    category = db_session.query(Category).filter_by(name=category_name).one()

    # Query items for corresponding category
    items = (
        db_session
        .query(Item)
        .filter_by(category_id=category.id)
        .order_by(Item.title)
        .all()
    )

    # Serialize current category and add corresponding serialized items
    serialized_category = category.serialize
    serialized_category["Items"] = []
    for item in items:
        serialized_category["Items"].append(item.serialize)

    # Close DB session
    db_session.close()

    return jsonify(Category=serialized_category)


# Items
@app.route('/api/v1/catalog/items.JSON')
def itemsJSON():
    """ Items API Endpoint """

    # Create DB session
    db_session = Session()

    # Query all items
    items = db_session.query(Item).all()

    # Close DB session
    db_session.close()

    return jsonify(Items=[item.serialize for item in items])


@app.route('/api/v1/catalog/items/<int:item_id>/JSON')
def itemJSON(item_id):
    """ JSON data for specific item """

    # Create DB session
    db_session = Session()

    # Query specific item
    item = db_session.query(Item).filter_by(id=item_id).one()

    # Close DB session
    db_session.close()

    return jsonify(item.serialize)


# Users
@app.route('/api/v1/catalog/users.JSON')
def usersJSON():
    """ Users API Endpoint """

    # Create DB session
    db_session = Session()

    # Query all users
    users = db_session.query(User).all()

    # Close DB session
    db_session.close()

    return jsonify(Users=[user.serialize for user in users])


@app.route('/api/v1/catalog/users/<int:user_id>/JSON')
def userJSON(user_id):
    """ JSON data for specific user """

    # Create DB session
    db_session = Session()

    # Query specific item
    user = db_session.query(User).filter_by(id=user_id).one()

    # Close DB session
    db_session.close()

    return jsonify(user.serialize)


# ------------------------------------------------------
# RUN SERVER
# ------------------------------------------------------
if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8000)
