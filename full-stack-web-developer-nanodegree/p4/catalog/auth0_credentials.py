class Auth0:
    """Class for holding Auth0 parameters """

    def __init__(self):
        # Input your Auth0 parameters here
        self.client_id = 'VFLcuGdWEwCE9pgz3xNBUcFAR8JPIPyy'
        self.client_secret = (
            'bIch44aEgIGkFWqtQdfkxxUzDYma0bHe1ryPQuso23BuixpMswcUm_HynBLhifNM'
            )
        self.api_base_url = 'https://dev-71lnfuf3.auth0.com'
        self.audience = self.api_base_url + '/userinfo'


# Create Auth 0 configuration instance
auth0_config = Auth0()
