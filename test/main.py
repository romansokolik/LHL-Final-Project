import json
import os
from pprint import pprint
from turtle import pd

import numpy as np
from PIL import Image
from certifi import contents
from tensorflow.keras.preprocessing import image

import matplotlib.pyplot as plt
import matplotlib.image as mpimg

from keras.applications.vgg16 import VGG16
from sklearn.metrics.pairwise import cosine_similarity
from typing_extensions import TextIO

vgg16 = VGG16(weights='imagenet', include_top=False,
              pooling='max', input_shape=(224, 224, 3))

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
    return input_image.resize((224, 224))


def get_image_embeddings(object_image: image):
    """
      -----------------------------------------------------
      convert image into 3d array and add additional dimension for model input
      -----------------------------------------------------
      return embeddings of the given image
    """
    image_array = np.expand_dims(image.img_to_array(object_image), axis=0)
    return vgg16.predict(image_array)


def get_similarity_score(first_image: str, second_image: str):
    """
        -----------------------------------------------------
        Takes image array and computes its embedding using VGG16 model.
        -----------------------------------------------------
        return embedding of the image
    """
    first_image = load_image(first_image)
    second_image = load_image(second_image)
    first_image_vector = get_image_embeddings(first_image)
    second_image_vector = get_image_embeddings(second_image)
    return cosine_similarity(first_image_vector, second_image_vector).reshape(1, )


def show_image(image_path):
    image = mpimg.imread(image_path)
    imgplot = plt.imshow(image)
    plt.show()

    # define the path of the images


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


# Define the path to the images
path = '../frontend/public/images/posters/tmdb/'
# Specify the JSON file name to save the similarity scores
json_file_out = "similarity-scores.json"
# Get directory contents
tmdbs = [int(i) for i in os.listdir(path) if i.isdigit()]
tmdbs = sorted(tmdbs)
# Open the JSON file to create brand new
open(json_file_out, mode='w', encoding="utf-8")
# Number of rounds to iterate
num_rounds = 100
# Iterate over the images and compute the similarity scores
for i, tmdb1 in enumerate(tmdbs):
    scores = {}
    similarity = 0
    tmdb_match = tmdb1
    for j, tmdb2 in enumerate(tmdbs):
        # Skip the same image
        if tmdb1 == tmdb2: continue
        img1 = f'{path}{tmdb1}/w220_and_h330_face.jpg'
        img2 = f'{path}{tmdb2}/w220_and_h330_face.jpg'
        score = get_similarity_score(img1, img2)
        score = round(float(score[0]), 7)
        scores[tmdb2] = score
        # print(f'The similarity score between {tmdb2} and {i} is {score}')
        if score > similarity:
            similarity = score
            tmdb_match = tmdb2
        if num_rounds and j >= num_rounds: break
    # print('scores:', scores)
    # print(f'tmdb({tmdb1}) scores - max score match:', max(scores, key=scores.get))
    # Sort the scores in descending order
    sorted_scores = dict(sorted(scores.items(), key=lambda x: x[1], reverse=True))
    # print(f'tmdb({tmdb1}) sorted scores - max score match:', max(sorted_scores, key=sorted_scores.get))
    # Limit the number of scores to save
    limit = None
    # Get the top N scores
    top_n_scores = dict(list(sorted_scores.items())[:limit])
    # Append the scores to the JSON file
    append_to_json_file(json_file_out, {tmdb1: top_n_scores}, tmdb1)
    # print(f'The most similar image to {tmdb1} is {tmdb_match} with a similarity score of {similarity}')
    if num_rounds and i >= num_rounds: break

# Load the JSON file back into a Python dictionary
with open(json_file_out, mode='r') as json_file:
    loaded_scores = json.load(json_file)
# print("Loaded scores:", pprint(loaded_scores))
