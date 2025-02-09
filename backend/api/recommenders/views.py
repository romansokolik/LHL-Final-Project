import json, os
import random, sqlite3
from django.http import HttpResponse, JsonResponse
from django.db import connection
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sqlalchemy import create_engine
import numpy as np
from PIL import Image
from tensorflow.keras.preprocessing import image
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from keras.applications.vgg16 import VGG16
from sklearn.metrics.pairwise import cosine_similarity

# Create a database engine using SQLAlchemy
engine = create_engine('sqlite:///../backend/db.sqlite3')

# Load the VGG16 model
vgg16 = VGG16(weights='imagenet', include_top=False, pooling='max', input_shape=(224, 224, 3))
# print the summary of the model's architecture.
# vgg16.summary()
for model_layer in vgg16.layers:
    model_layer.trainable = False


def load_image(image_path):
    """
        -----------------------------------------------------
        Process the image provided.
        - Resize the image
        - Convert to RGB if necessary
        -----------------------------------------------------
        return resized RGB image
    """
    input_image = Image.open(image_path)
    # Ensure the image is in RGB format
    if input_image.mode != 'RGB':
        input_image = input_image.convert('RGB')
    return input_image
    # return input_image.resize((224, 224))


def get_image_embeddings(object_image: image):
    """
      -----------------------------------------------------
      convert image into 3d array and add additional dimension for model input
      -----------------------------------------------------
      return embeddings of the given image
    """
    image_array = np.expand_dims(image.img_to_array(object_image), axis=0)
    return vgg16.predict(image_array)


def get_image_vector(image_path: str):
    """
        -----------------------------------------------------
        Takes image array and computes its embedding using VGG16 model.
        -----------------------------------------------------
        return embedding of the image
    """
    image = load_image(image_path)
    return get_image_embeddings(image)


def get_similarity_score(first_image: str, second_image: str):
    """
        -----------------------------------------------------
        Takes image array and computes its embedding using VGG16 model.
        -----------------------------------------------------
        return embedding of the image
    """

    first_image_vector = get_image_vector(first_image)
    second_image_vector = get_image_vector(second_image)
    return cosine_similarity(first_image_vector, second_image_vector).reshape(1, )


def show_image(image_path):
    image = mpimg.imread(image_path)
    imgplot = plt.imshow(image)
    plt.show()


# Function to append objects to a JSON file
def append_to_json_file(filename: str, new_data: dict, tmdb_id: int = 0):
    # Check if the file exists
    if os.path.exists(filename):
        # If the file exists, read its content
        with open(filename, mode="r") as json_file:
            try:
                data = json.load(json_file)  # Load existing data
            except json.JSONDecodeError:
                data = []  # If the file is empty or corrupted, start with an empty list
    else:
        data = []  # If the file doesn't exist, start with an empty list
    # If the JSON data is a dictionary, update it with the new data
    if isinstance(data, dict):
        data.update(new_data)
    elif isinstance(data, list):
        # If the JSON data is a list, append the new data
        data.append(new_data)
    else:
        raise ValueError("Unsupported JSON format. The file must contain either a list or dictionary.")
    # Write updated data back to the file
    with open(filename, mode='w', encoding='utf-8') as file:
        file.write(json.dumps(data, separators=(',', ':')))  # Save the updated data with pretty formatting
    print(f"Appended data for tmdb({tmdb_id}) to {filename}")


def get_random_number():
    return random.randint(70, 100) / 70


def index(request):
    # qry = "SELECT tmdbId FROM tmdb_posters"
    # with connection.cursor() as cursor:
    query = (
        "SELECT tmdb_id, genres FROM tmdb_posters "
        "JOIN links l USING(tmdb_id) "
        "JOIN movies m USING(movie_id) "
        "JOIN (SELECT ROUND(AVG(rating),1) AS avg_rating FROM ratings GROUP BY user_id) USING(movie_id)"
        "WHERE tmdb_id IN (SELECT tmdb_id FROM main.tmdb_posters ORDER BY RANDOM() LIMIT 60)"
    )
    query = """
    WITH T1 AS (
        SELECT DISTINCT movie_id, ROUND(AVG(rating), 1) AS avg_rating 
        FROM ratings WHERE rating IS NOT NULL GROUP BY movie_id
    )
    , T2 AS (
        SELECT DISTINCT tmdb_id, movie_id, title, genres 
        FROM tmdb_posters
        LEFT JOIN links l USING (tmdb_id)
        LEFT JOIN movies m USING (movie_id)
    )
    SELECT * FROM T2 LEFT JOIN T1 USING(movie_id)
    WHERE tmdb_id IN (SELECT tmdb_id FROM tmdb_posters ORDER BY RANDOM() LIMIT 60)
    """
    # Create a connection object
    cursor = connection.cursor()
    # print('query:', query)
    cursor.execute(query)
    results = cursor.fetchall()
    items = []
    genres = {}
    ids = []
    # Select only those posters that exist
    for row in results:
        tmdb_id = row[0]
        movie_id = row[1]
        arr = row[3].split('|')
        [genres.update({genre: 1}) for genre in arr if genre not in ['(no genres listed)']]
        genre = ' '.join(arr)
        title = row[2]
        rating = row[4] if row[4] is not None else 2.5
        items.append({
            'tmdb_id': tmdb_id,
            'rating': rating,
            'genre': genre,
            'title': title,
            'movie_id': movie_id
        })
    # print('genres:', list(genres.keys()))
    connection.close()
    return JsonResponse({'slides': items, 'genres': list(genres.keys())})


def movies(request, tmdb_id):
    return JsonResponse({'success': f'tmdb_id: {tmdb_id}'}, status=200)


def contents_based(request, tmdb_id, title='Toy Story'):
    # Function that takes in movie title as input and outputs most similar movies
    def get_recommendations(df, cosine_sim, limit=10, tmdb_id=None, title=None):
        print('cosine_sim:', cosine_sim.shape)
        # Construct a reverse map of indices and movie titles
        index_col = 'tmdb_id' if tmdb_id is not None else 'title'
        indices = pd.Series(df.index, index=df[index_col]).drop_duplicates()
        # print('indices:', indices[:10])
        # Get the index of the movie that matches the title or tmdb_id
        # Check if indices[tmdb_id] exists
        if tmdb_id not in indices:
            print('tmdb_id not found')
            return pd.DataFrame({'tmdb_id': [], 'title': []})
        idx = indices[tmdb_id if tmdb_id is not None else title]
        # Get the pairwise similarity scores of all movies with that movie
        # print('imdb_id:', tmdb_id, 'idx:', idx, 'title:', f'"{title}"')
        sim_scores = list(enumerate(cosine_sim[idx]))
        # Sort the movies based on the similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        # Get the scores of the 10 most similar movies
        sim_scores = sim_scores[1:limit + 1]
        # Get the movie indices
        movie_indices = [i[0] for i in sim_scores]
        # Return the top 10 most similar movies
        df.rename(columns={'tmdb_id': 'id'}, inplace=True)
        return df[['id', 'title']].iloc[movie_indices]

    # Query the database
    query = "SELECT * FROM content_based_recommendations;"
    # print('query:', query)
    # Use Pandas' `read_sql_query` method to directly fetch the query results into a DataFrame
    # # WARNING: pandas only supports SQLAlchemy connectable (engine/connection) or database string URI or sqlite3 DBAPI2 connection. Other DBAPI2 objects are not tested. Please consider using SQLAlchemy.
    # df = pd.read_sql_query(query, connection)
    # Use Pandas to read the query result directly
    df = pd.read_sql_query(query, engine)
    # print('df:', df.head())
    # return
    # df = pd.read_csv('../data/ml-latest-small/metadata_movies.csv', low_memory=False)
    # df = df[['id', 'title', 'original_title', 'overview']]
    # df.rename(columns={'id': 'tmdb_id'}, inplace=True)
    # print('df:', df.head())
    # # Close the connection after use
    # connection.close()
    # Define a TF-IDF Vectorizer Object. Remove all english stop words such as 'the', 'a'
    tfidf = TfidfVectorizer(stop_words='english')
    # Replace NaN with an empty string
    df['overview'] = df['overview'].fillna('')
    # print('df:', df['overview'][df['id'] == tmdb_id])
    # return
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
    limit = 12
    recommendations = get_recommendations(df, cosine_sim, limit, tmdb_id, title)
    # print(f' recommendations for "{tmdb_id} : {title}"', recommendations, sep='\n')
    return JsonResponse({'results': recommendations.to_dict(orient='records')})


def matched_posters(request, tmdb_id):
    posters = []
    query = (
        f'SELECT match_id, score FROM poster_matches '
        f'WHERE base_id={tmdb_id} ORDER BY score DESC LIMIT 9;')
    # Create a connection object
    cursor = connection.cursor()
    # print('query:', query)
    cursor.execute(query)
    results = cursor.fetchall()
    scores = []
    for row in results:
        posters.append({
            'id': row[0],
            'score': row[1]
        })
    # print('posters:', posters)
    connection.close()
    return JsonResponse({'posters': posters})


# Compare poster to find the best match
def compare_poster(request, tmdb_id):
    # Define the path to the images
    path = '../frontend/public/images/posters/tmdb/'
    tmdbs = [i for i in os.listdir(path) if i.isdigit()]
    random.shuffle(tmdbs)
    top_n_scores = dict()
    top_n = 10
    limit = 100
    query = (
        f'SELECT matched_ids FROM poster_searches '
        f'WHERE base_id={tmdb_id} LIMIT 1;')
    # Create a connection object
    cursor = connection.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    # print('results:', results[0][0])
    searched_ids = set(results[0][0].split(',')) if len(results) else set()
    query = (
        f'SELECT match_id, score FROM poster_matches '
        f'WHERE base_id={tmdb_id} ORDER BY score DESC LIMIT {top_n};')
    # Reuse the cursor object
    cursor.execute(query)
    results = cursor.fetchall()
    # print('results:', results)
    # Get the scores from the database
    for row in results:
        top_n_scores[row[0]] = row[1]
    lowest = min(top_n_scores.values()) if len(top_n_scores) > 0 else 0
    match = lowest
    img1 = f'{path}{tmdb_id}/224x224.jpg'
    img_vector = get_image_vector(img1)
    # LOOP THROUGH ALL IMAGES
    for i, tmdb in enumerate(tmdbs):
        if i >= len(tmdbs): break
        # Skip the same image
        if int(tmdb) == int(tmdb_id): continue
        if (int(tmdb) in top_n_scores) or (tmdb in searched_ids):
            # print(f'{tmdb} already exists')
            tmdbs.remove(tmdb)
            # print(f'{tmdb} removed')
            # print(tmdbs[i])
            i -= 1
            # break
            continue
        if i >= limit: break
        # Add the current tmdb to the searched list
        searched_ids.add(tmdb)
        # Get the image file path
        img2 = f'{path}{tmdb}/224x224.jpg'
        img_vector2 = get_image_vector(img2)
        score = cosine_similarity(img_vector, img_vector2).reshape(1, )
        score = round(float(score[0]), 7)
        if len(top_n_scores) >= top_n:
            if score > lowest:
                lowest_key = min(top_n_scores, key=top_n_scores.get)
                del top_n_scores[lowest_key]
                top_n_scores[tmdb] = score
                lowest = min(top_n_scores.values())
        else:
            top_n_scores[tmdb] = score
        n = i + 1
        if (n > 1 and n % 10 == 0) or n == limit or n == len(tmdbs):
            data = [[tmdb_id, k, v] for k, v in top_n_scores.items()]
            # print('data:', data)
            # Create a connection object
            cursor = connection.cursor()
            # Execute the query for multiple inserts
            cursor.executemany(
                'INSERT INTO poster_matches (base_id, match_id, score) '
                'VALUES (?, ?, ?) '
                'ON CONFLICT(base_id, match_id) '
                'DO UPDATE SET score=excluded.score', data)
            # print last query
            # print(cursor.query)
            connection.commit()
            connection.close()
            print(f'{n} images processed')

    # Save the searched images ids
    ids = ','.join(searched_ids)
    query = (
        f'INSERT INTO poster_searches (base_id, matched_ids) '
        f'VALUES ({tmdb_id}, "{ids}") '
        f'ON CONFLICT(base_id) '
        f'DO UPDATE SET matched_ids="{ids}";')
    cursor = connection.cursor()
    # print('query:', query)
    cursor.execute(query)
    connection.commit()
    connection.close()
    return JsonResponse({'scores': top_n_scores})


def poster_searches(request, tmdb_id):
    query = f'SELECT match_id, score FROM poster_matches WHERE base_id={tmdb_id} ORDER BY score DESC LIMIT 9;'
    # print('query:', query)
    # Create a connection object
    cursor = connection.cursor()
    # Execute the query
    cursor.execute(query)
    # Fetch all the results
    results = cursor.fetchall()
    scores = []
    for row in results:
        scores.append({
            'id': row[0],
            'score': row[1]
        })
    connection.close()
    return JsonResponse({'scores': scores})
