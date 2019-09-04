class Auth0:
    """Class for holding Auth0 parameters """

    def __init__(self):
        # Input your Auth0 parameters here
        self.client_id = 'YOUR_CLIENT_ID'
        self.client_secret = (
            'YOUR_CLIENT_SECRET'
            )
        self.api_base_url = 'YOUR_API_BASE_URL'
        self.audience = self.api_base_url + '/userinfo'


# Create Auth 0 configuration instance
auth0_config = Auth0()
