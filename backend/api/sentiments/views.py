import json
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
        results['nlps'][key] = pipeline("sentiment-analysis", model=name, tokenizer=name)
        results['predictions'][key] = results['nlps'][key](reviews, truncation=True)
        results['labels_true'][key] = labels
        results['prediction_labels'][key] = [
            0 if prediction['label'].lower() in ['neg', 'negative', 'label_0'] else 1 for prediction in
            results['predictions'][key]]
        results['reports'][key] = classification_report(
            results['labels_true'][key], results['prediction_labels'][key])

    lst = list(results['prediction_labels'].items())
    print('results:', results['predictions'])
    # print('results:', lst)
    return HttpResponse(json.dumps(lst))
