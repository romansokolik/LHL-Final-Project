from django.db import models


class Movie(models.Model):
    movie_id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=200)
    genres = models.CharField(max_length=200)

    class Meta:
        db_table = 'movies'


class Link(models.Model):
    movie_id = models.IntegerField()
    imdb_id = models.CharField(max_length=200)
    tmdb_id = models.IntegerField()

    class Meta:
        db_table = 'links'


class Rating(models.Model):
    user_id = models.IntegerField()
    movie_id = models.IntegerField()
    rating = models.FloatField()
    timestamp = models.IntegerField()

    class Meta:
        db_table = 'ratings'


class Tag(models.Model):
    user_id = models.IntegerField()
    movie_id = models.IntegerField()
    tag = models.CharField(max_length=200)
    timestamp = models.IntegerField()

    class Meta:
        db_table = 'tags'


class TmdbPoster(models.Model):
    tmdb_id = models.IntegerField(primary_key=True)
    file_name = models.CharField(max_length=100)
    alt = models.CharField(max_length=100)
    youtube_id = models.CharField(max_length=50)
    image_exists = models.BooleanField(default=0)

    class Meta:
        db_table = 'tmdb_posters'


class PosterMatch(models.Model):
    base_id = models.IntegerField()
    match_id = models.IntegerField()
    score = models.FloatField()

    class Meta:
        db_table = 'poster_matches'
        unique_together = ('base_id', 'match_id')


class ImdbReview(models.Model):
    text = models.TextField()
    label = models.IntegerField()

    class Meta:
        db_table = 'imdb_reviews'


# class MetadataMovie(models.Model):
#     id = models.IntegerField()
#     imdb_id = models.CharField(max_length=200)
#     title = models.CharField(max_length=200)
#     original_title = models.CharField(max_length=200)
#     overview = models.TextField()
#     release_date = models.DateField()
#     runtime = models.IntegerField()
#     tagline = models.CharField(max_length=200)
#
#     class Meta:
#         db_table = 'metadata_movies'


class ContentBasedRecommendation(models.Model):
    tmdb_id = models.IntegerField()
    title = models.CharField(max_length=200)
    original_title = models.CharField(max_length=200)
    overview = models.TextField()

    class Meta:
        db_table = 'content_based_recommendations'
