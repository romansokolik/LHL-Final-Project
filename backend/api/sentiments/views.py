import json
from pprint import pprint

import numpy as np
from django.db import connection
from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import api_view
# from datasets import load_dataset
from sklearn.metrics import classification_report
# from textblob import TextBlob
from transformers import AutoTokenizer, pipeline
# from transformers import AutoModel, AutoModelForSequenceClassification
from transformers import AutoModelForTokenClassification, AutoConfig
import re


def strip_html_using_re(html_string):
    clean = re.compile('<.*?>')  # Regular expression to match HTML tags
    return re.sub(clean, '', html_string)


def index(request):
    # ds = load_dataset('imdb', split='test')
    # df = pd.DataFrame(ds)
    # df.to_csv('imdb-reviews.csv', index=False, header=True)
    cursor = connection.cursor()
    query = "SELECT * FROM imdb_reviews ORDER BY RANDOM() LIMIT 1"
    cursor = connection.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    # return HttpResponse(json.dumps({'text': strip_html_using_re(results[0][0]), 'label': results[0][1]}))
    return JsonResponse({'text': strip_html_using_re(results[0][0]), 'label': results[0][1]})


@api_view(['POST'])
def check(request):
    print('request:', request)
    # return JsonResponse({'text': 'Hello, World!', 'label': 1}, status=200)
    review = request.data
    # return JsonResponse({'text': 'Hello, World!', 'label': 1}, status=200)
    # # Create a TextBlob object
    # blob = TextBlob(review)
    # # Add a new column to the dataset with the sentiment of the text
    # # ds['sentiment'] = blob.sentiment.polarity
    # return blob.sentiment

    # Load the tokenizer and models
    model_names = {
        'robert': 'aychang/roberta-base-imdb',
        'finetuned-sst-2-english': 'distilbert-base-uncased-finetuned-sst-2-english',
        'bert': 'bert-base-uncased',
        'distilbert': 'distilbert-base-uncased'
    }
    results = {
        'models': {},
        'tokenizers': {},
        'config': {},
        'nlps': {},
        'predictions': {},
        'prediction_labels': {},
        'labels_true': {},
        'reports': {}
    }

    # Get sample review data
    text = review['text']
    label = review['label'] if review['label'] else -1
    reviews = [text]
    labels = [label]
    # print('reviews:', reviews)
    # print('labels:', labels)

    for key, name in model_names.items():
        results['models'][key] = AutoModelForTokenClassification.from_pretrained(name)
        results['tokenizers'][key] = AutoTokenizer.from_pretrained(name)
        results['config'][key] = AutoConfig.from_pretrained(name)
        # Use pipeline
        results['nlps'][key] = pipeline(
            "sentiment-analysis",
            model=name,
            tokenizer=results['tokenizers'][key]
        )
        results['predictions'][key] = results['nlps'][key](
            reviews,
            truncation=True
        )
        results['labels_true'][key] = labels
        results['prediction_labels'][key] = [
            0 if prediction['label'].lower() in ['neg', 'negative', 'label_0']
            else 1 for prediction in
            results['predictions'][key]
        ]
        results['reports'][key] = classification_report(
            results['labels_true'][key],
            results['prediction_labels'][key],
            output_dict=True
        )

    lst = list(results['prediction_labels'])
    results = {
        'results': {
            'scores': list(results['prediction_labels'].items()),
            'reports': list(results['reports'].items()),
            'predictions': list(results['predictions'].items()),
            # {'models': list(results['models'])},  # vJust the names of the models
            # {'labels_true': list(results['labels_true'].items())}
            # {'nlps': list(results['nlps'])},
            # {'config': list(results['config'])},
            # {'tokenizers': list(results['tokenizers'])},
        }
    }
    # print('lst:', pprint(lst))
    # print('\n\n predictions:', pprint(results['predictions']), type(results['predictions']))
    # print('\n\n reports:', pprint(results['reports']), type(results['reports']))
    # print('\n\n scores:', pprint(results['prediction_labels']), type(results['prediction_labels']))

    # print('\n\n nlps:', pprint(results['nlps']),type(results['nlps']))
    # print('\n\n config:', pprint(results['config']),type(results['config']))
    # print('\n\n tokenizers:', pprint(results['tokenizers']), type(results['tokenizers']))
    # print('\n\n models:', pprint(results['models']), type(results['models']))
    # print('\n\n labels_true:', pprint(results['labels_true']), type(results['labels_true']))
    # lst = list({'predictions': results['prediction_labels'].items()})
    # , {'results': results.items()}

    # 0"models"
    # 1"tokenizers"
    # 2"config"
    # 3"nlps"
    # 4"predictions"
    # 5"prediction_labels"
    # 6"labels_true"
    # 7"reports"

    # print('results:', pprint(results['predictions']))
    # print('results:', lst)
    # return HttpResponse(json.dumps(lst), content_type='application/json')
    return JsonResponse(results, status=200)
