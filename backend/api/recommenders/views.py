import random, sqlite3
# from os import getcwd
from os.path import isfile
from django.http import HttpResponse, JsonResponse
from django.db import connection
import pandas as pd
# Import TfIdfVectorizer from scikit-learn
from sklearn.feature_extraction.text import TfidfVectorizer
# Import linear_kernel
from sklearn.metrics.pairwise import linear_kernel
from sqlalchemy import create_engine


def get_random_number():
    return random.randint(70, 100) / 70


def index(request):
    cursor = connection.cursor()
    # qry = "SELECT tmdbId FROM posters_tmdb"
    # with connection.cursor() as cursor:
    query = (
        "SELECT tmdb_id, genres FROM posters_tmdb "
        "JOIN links l USING(tmdb_id) "
        "JOIN movies m USING(movie_id) "
        "JOIN (SELECT ROUND(AVG(rating),1) AS avg_rating FROM ratings GROUP BY user_id) USING(movie_id)"
        "WHERE tmdb_id IN (SELECT tmdb_id FROM main.posters_tmdb ORDER BY RANDOM() LIMIT 60)"
    )
    query = """
    WITH T1 AS (
        SELECT DISTINCT movie_id, ROUND(AVG(rating), 1) AS avg_rating 
        FROM ratings WHERE rating IS NOT NULL GROUP BY movie_id
    )
    , T2 AS (
        SELECT DISTINCT tmdb_id, movie_id, title, genres 
        FROM posters_tmdb
        LEFT JOIN links l USING (tmdb_id)
        LEFT JOIN movies m USING (movie_id)
    )
    SELECT * FROM T2 LEFT JOIN T1 USING(movie_id)
    WHERE tmdb_id IN (SELECT tmdb_id FROM posters_tmdb ORDER BY RANDOM() LIMIT 60)
    """

    # print('query:', query)
    cursor.execute(query)
    results = cursor.fetchall()
    # print('cwd:', getcwd())
    items = []
    genres = {}
    ids = []
    # Select only those posters that exist
    for row in results:
        # if not f'../frontend/public/images/posters/tmdb/{row[0]}/w220_and_h330_face.jpg': continue
        tmdb_id = row[0]
        movie_id = row[1]
        arr = row[3].split('|')
        [genres.update({genre: 1}) for genre in arr if genre not in ['(no genres listed)']]
        genre = ' '.join(arr)
        # weight = get_random_number()
        title = row[2]
        rating = row[4] if row[4] is not None else 2.5
        items.append({
            'tmdb_id': tmdb_id,
            'rating': rating,
            'genre': genre,
            'title': title,
            'movie_id': movie_id
        })
        # else: ids.append(row[0])
    # print('ids:', ids)

    # print('genres:', list(genres.keys()))
    return JsonResponse({'slides': items, 'genres': list(genres.keys())})


def movies(request):
    return JsonResponse({'error': 'movie_id is required'}, status=400)


def contents_based(request, tmdb_id, title='Toy Story'):
    # Function that takes in movie title as input and outputs most similar movies
    def get_recommendations(df, cosine_sim, limit=10, tmdb_id=None, title=None):
        # Construct a reverse map of indices and movie titles
        # index_col = 'original_title' if tmdb_id is not None else 'original_title'
        indices = pd.Series(df.index, index=df['title']).drop_duplicates()
        # Get the index of the movie that matches the title
        idx = indices[tmdb_id if tmdb_id is None else title]
        # Get the pairwise similarity scores of all movies with that movie
        sim_scores = list(enumerate(cosine_sim[idx]))
        # Sort the movies based on the similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        # Get the scores of the 10 most similar movies
        sim_scores = sim_scores[1:limit + 1]
        # Get the movie indices
        movie_indices = [i[0] for i in sim_scores]
        # Return the top 10 most similar movies
        return df[['tmdb_id', 'original_title']].iloc[movie_indices]

    # Create a database engine using SQLAlchemy
    engine = create_engine('sqlite:///../backend/db.sqlite3')
    cursor = connection.cursor()
    # Query the database
    query = f"SELECT title FROM recommender_contents_based WHERE tmdb_id = {tmdb_id};"
    cursor.execute(query)
    results = cursor.fetchall()
    #Get the title for the tmdb_id if it exists
    title = results[0][0] if results else None
    query = (
        # "DROP TABLE IF EXISTS recommender_contents_based; "
        # "CREATE TABLE IF NOT EXISTS recommender_contents_based AS "
        # # # "CREATE VIEW IF NOT EXISTS view_contents_based AS ("
        # "SELECT DISTINCT tmdb_id, title, original_title, overview "
        # "FROM posters_tmdb pt "
        # "LEFT JOIN movies_metadata mm ON pt.tmdb_id = mm.id "
        # # "LEFT JOIN links l USING(tmdb_id) "
        # # "LEFT JOIN movies_metadata mm ON l.tmdb_id = mm.id "
        # # ")"
        # # "SELECT * FROM view_contents_based;"
        "SELECT * FROM recommender_contents_based;"
    )
    print('query:', query)

    # Use Pandas' `read_sql_query` method to directly fetch the query results into a DataFrame
    # # WARNING: pandas only supports SQLAlchemy connectable (engine/connection) or database string URI or sqlite3 DBAPI2 connection. Other DBAPI2 objects are not tested. Please consider using SQLAlchemy.
    # df = pd.read_sql_query(query, connection)
    # Use Pandas to read the query result directly
    df = pd.read_sql_query(query, engine)


    # df = pd.read_csv('../data/ml-latest-small/movies_metadata.csv', low_memory=False)
    # df = df[['id', 'title', 'original_title', 'overview']]
    # df.rename(columns={'id': 'tmdb_id'}, inplace=True)
    # print('df:', df.head())


    # # Close the connection after use
    # connection.close()

    # Define a TF-IDF Vectorizer Object. Remove all english stop words such as 'the', 'a'
    tfidf = TfidfVectorizer(stop_words='english')

    # Replace NaN with an empty string
    df['overview'] = df['overview'].fillna('')

    # Construct the required TF-IDF matrix by fitting and transforming the data
    tfidf_matrix = tfidf.fit_transform(df['overview'])

    # # Output the shape of tfidf_matrix
    # print('shape:', tfidf_matrix.shape)
    # # Array mapping from feature integer indices to feature name.
    # print('feature names:', tfidf.get_feature_names_out()[5000:5010])

    # Compute the cosine similarity matrix
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    # print('cosine_sim shape:', cosine_sim.shape)
    # print('cosine_sim:', list(cosine_sim[1]))

    # print('indices:', indices[:10])

    # title = 'The Godfather'
    limit = 10
    recommendations = get_recommendations(df, cosine_sim, limit, tmdb_id, title)
    print(f'recommendations for "{tmdb_id} : {title}"', recommendations, sep='\n')

    return JsonResponse({'results': recommendations.to_dict(orient='records')})


def image(request):
    tmdb_id = request.GET.get('tmdb_id')
    if tmdb_id is None:
        return JsonResponse({'error': 'tmdb_id is required'}, status=400)
    if not tmdb_id.isdigit():
        return JsonResponse({'error': 'tmdb_id must be a number'}, status=400)
    if not isfile(f'../frontend/public/images/posters/tmdb/{tmdb_id}/w220_and_h330_face.jpg'):
        return JsonResponse({'error': 'image not found'}, status=404)
    with open(f'../frontend/public/images/posters/tmdb/{tmdb_id}/w220_and_h330_face.jpg', 'rb') as f:
        return HttpResponse(f.read(), content_type='image/jpeg')
    # return JsonResponse({'error': 'unknown error'}, status=500)
