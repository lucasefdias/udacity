#!/usr/bin/env python
import psycopg2

# Database parameter for connection using DB-API
DATABASE_NAME = "dbname=news"

# ------------------
# FUNCTIONS
# ------------------


def execute_query(query):
    """Execute a given select query"""
    db = psycopg2.connect(DATABASE_NAME)
    cursor = db.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    db.close
    return results


def get_most_popular_articles():
    """Queries database for top 3 articles and print results"""

    query = """
    SELECT title, views
    FROM views_per_article
    GROUP BY title, views
    ORDER BY views DESC
    LIMIT 3;
    """
    results = execute_query(query)

    file.write("1. What are the three most popular articles of all time?\n")
    file.write("\n")
    for result in results:
        file.write('"{article}" - {views} views\n'.format(article=result[0],
                                                          views=result[1]))

    file.write("\n")


def get_most_popular_authors():
    """Queries database for most popular authors and print results"""

    query = """
    SELECT authors.name, sum(views_per_article.views) AS total_views
    FROM authors JOIN views_per_article
    ON authors.id = views_per_article.author
    GROUP BY authors.name
    ORDER BY total_views DESC;
    """
    results = execute_query(query)

    file.write("2. Who are the most popular authors of all time?\n")
    file.write("\n")
    for result in results:
        file.write('{author} - {views} views\n'.format(author=result[0],
                                                       views=result[1]))
    file.write("\n")


def get_days_with_most_errors():
    """Queries database for days when more than 1% of requests resulted
    in errors and print results"""

    query = """
    SELECT time, error_percentile
    FROM error_percentiles
    WHERE error_percentile > 1;
    """
    results = execute_query(query)

    file.write("3. Which days more than 1% of requests resulted in errors?\n")
    file.write("\n")
    for result in results:
        file.write('{day} - {errors}% errors\n'.format(day=result[0]
                                                       .strftime("%B %d, %Y"),
                                                       errors=result[1]))


# ------------------
# MAIN
# ------------------

file = open('report.txt', 'w')

get_most_popular_articles()
get_most_popular_authors()
get_days_with_most_errors()

file.close()
