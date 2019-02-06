# Movie class module


class Movie():
    """Defines how the movies dislayed will be instantiaded"""

    # Constructor
    def __init__(self, title, storyline, poster_image, youtube_trailer):
        self.title = title
        self.storyline = storyline
        self.poster_image_url = poster_image
        self.trailer_youtube_url = youtube_trailer
