import random
from os import getcwd
from os.path import isfile
from django.http import HttpResponse, JsonResponse
from django.db import connection


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
            FROM ratings GROUP BY movie_id
        )
        , T2 AS (
            SELECT DISTINCT tmdb_id, movie_id, title, genres 
            FROM posters_tmdb
            LEFT JOIN links l USING (tmdb_id)
            LEFT JOIN movies m USING (movie_id)
        )
        SELECT * FROM T2 LEFT JOIN T1 USING(movie_id)
        WHERE tmdb_id IN (
            SELECT tmdb_id FROM posters_tmdb ORDER BY RANDOM() LIMIT 60
        )"""
    print('query:', query)
    cursor.execute(query)
    results = cursor.fetchall()
    print('cwd:', getcwd())
    items = []
    genres = {}
    # Select only those posters that exist
    for row in results:
        if isfile(f'../frontend/public/images/posters/tmdb/{row[0]}/w220_and_h330_face.jpg'):
            tmdb_id = row[0]
            movie_id = row[1]
            arr = row[3].split('|')
            [genres.update({genre: 1}) for genre in arr if genre not in ['(no genres listed)']]
            genre = ' '.join(arr)
            # weight = get_random_number()
            title = row[2]
            rating = row[4] if row[4] is not None else 2.5
            item = {
                'tmdb_id': tmdb_id,
                'rating': rating,
                'genre': genre,
                'title': title,
                'movie_id': movie_id
            }
            items.append(item)
        # print('genres:', list(genres.keys()))
    return JsonResponse({'slides': items, 'genres': list(genres.keys())})


def movie(request):
    return JsonResponse({'error': 'movie_id is required'}, status=400)


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
