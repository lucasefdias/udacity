# Import necessary modules
import fresh_tomatoes
import media

# Create Movie instances

toy_story = media.Movie("Toy Story",
                        "A story about a boy and his toys that come to life.",
                        "https://bit.ly/1OHWo0L",
                        "https://www.youtube.com/watch?v=KYz2wyBy3kc")

batman = media.Movie("Batman: The Dark Knight",
                     "When the menace known as the Joker emerges from his "
                     "mysterious past, he wreaks havoc and chaos on the "
                     "people of Gotham. The Dark Knight must accept one of "
                     "the greatest psychological and physical tests of his "
                     "ability to fight injustice.",
                     "https://bit.ly/2NJfrte",
                     "https://www.youtube.com/watch?v=UwrOQ2pYDxY")

star_wars = media.Movie("Star Wars: Episode V - The Empire Strikes Back",
                        "After the rebels are brutally overpowered by the "
                        "Empire on the ice planet Hoth, Luke Skywalker begins "
                        "Jedi training with Yoda, while his friends are "
                        "pursued by Darth Vader.",
                        "https://bit.ly/1Ksk2Ya",
                        "https://www.youtube.com/watch?v=JNwNXF9Y6kY")

emperors_new_groove = media.Movie("The Emperor's New Groove",
                                  "Emperor Kuzco is turned into a llama by "
                                  "his ex-administrator Yzma, and must now "
                                  "regain his throne with the help of Pacha, "
                                  "the gentle llama herder.",
                                  "https://bit.ly/2HfTe8r",
                                  "https://www.youtube.com/watch?v=zefYX6e1g3Y"
                                  )

interestellar = media.Movie("Interestellar",
                            "A team of explorers travel through a wormhole "
                            "in space in an attempt to ensure humanity's "
                            "survival.",
                            "https://bit.ly/249Vnlj",
                            "https://www.youtube.com/watch?v=zSWdZVtXT7E")

rocky_ii = media.Movie("Rocky II",
                       "Rocky struggles in family life after his bout with "
                       "Apollo Creed, while the embarrassed champ insistently "
                       "goads him to accept a challenge for a rematch.",
                       "https://bit.ly/2LYMI4j",
                       "https://www.youtube.com/watch?v=epEBSVMtgFQ")

# Create movie list
movies = [toy_story, batman,
          star_wars, emperors_new_groove, interestellar, rocky_ii]

# Generate webpage
fresh_tomatoes.open_movies_page(movies)
