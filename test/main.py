import os

import numpy as np
from PIL import Image
from certifi import contents
from tensorflow.keras.preprocessing import image

import matplotlib.pyplot as plt
import matplotlib.image as mpimg

from keras.applications.vgg16 import VGG16
from sklearn.metrics.pairwise import cosine_similarity

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
    resized_image = input_image.resize((224, 224))
    return resized_image


def get_image_embeddings(object_image: image):
    """
      -----------------------------------------------------
      convert image into 3d array and add additional dimension for model input
      -----------------------------------------------------
      return embeddings of the given image
    """
    image_array = np.expand_dims(image.img_to_array(object_image), axis=0)
    image_embedding = vgg16.predict(image_array)
    return image_embedding


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
    similarity_score = cosine_similarity(first_image_vector, second_image_vector).reshape(1, )
    return similarity_score


def show_image(image_path):
    image = mpimg.imread(image_path)
    imgplot = plt.imshow(image)
    plt.show()

    # define the path of the images


path = '../frontend/public/images/posters/tmdb/'
# Get directory contents
# tmdbs = os.listdir(path)
tmdbs = [int(i) for i in os.listdir(path) if i.isdigit()]
tmdbs = sorted(tmdbs)
# print(sorted(tmdbs))
scores = {}
tmdb1 = 2
similarity = 0
tmdb2 = tmdb1
n = 0
for i in tmdbs:
    n += 1
    scores[i] = get_similarity_score(f'{path}{tmdb1}/w220_and_h330_face.jpg', f'{path}{i}/w220_and_h330_face.jpg')
    score = round(float(scores[i][0]), 5)
    print(f'The similarity score between {tmdb1} and {i} is {score}')
    if tmdb1 != i and score > similarity:
        similarity = score
        tmdb2 = i
    # if n > 10: break

print(f'The most similar image to {tmdb1} is {tmdb2} with a similarity score of {similarity}')
imn1 = f'{path}{tmdb1}/w220_and_h330_face.jpg'
imn2 = f'{path}{tmdb2}/w220_and_h330_face.jpg'
show_image(imn1), show_image(imn2)

# sunflower = '2/w220_and_h330_face.jpg'
# helianthus = '5/w220_and_h330_face.jpg'
# tulip = '2/w600_and_h900_bestv2.jpg'
#
# # use the show_image function to plot the images
# # show_image(sunflower), show_image(helianthus)
#
# similarity_score = get_similarity_score(sunflower, helianthus)
# print(similarity_score)
#
# # show_image(sunflower), show_image(tulip)
#
# similarity_score = get_similarity_score(sunflower, tulip)
# print(similarity_score)
