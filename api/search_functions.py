import re
import string
from nltk.stem import PorterStemmer
from gensim.models.phrases import Phraser
import numpy as np
from gensim.models import Word2Vec
from typing import List
from spellchecker import SpellChecker
import nmslib

ps = PorterStemmer()
STOP_WORDS = {"a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into", "is", "it",
              "no", "not", "of", "on", "or", "such", "that", "the", "their", "then", "there", "these",
              "they", "this", "to", "was", "will", "with"}


def clean_tokenized_sentence(tokens: List[str],
                             remove_punctuation=True,
                             lowercase=True,
                             remove_stop_words=True,
                             stem=False) -> str:
    if remove_stop_words:
        tokens = [token for token in tokens if token not in STOP_WORDS]

    if stem:
        tokens = [ps.stem(token) for token in tokens]

    sentence = ' '.join(tokens)

    if remove_punctuation:
        sentence = sentence.translate(str.maketrans('', '', string.punctuation))

    sentence = re.sub(r' +', ' ', sentence)

    if lowercase:
        sentence = sentence.lower()

    return sentence


def get_text_search_terms(keywords, synonyms_threshold, fasttext_model):
    bi_gram_model = Phraser.load('src/models/bi_gram_model.pkl')
    tri_gram_model = Phraser.load('src/models/tri_gram_model.pkl')

    # clean tokens
    cleaned_terms = clean_tokenized_sentence(keywords.split(' ')).split()
    # remove empty terms
    cleaned_terms = [term for term in cleaned_terms if term]
    # stem terms
    cleaned_terms = [ps.stem(term) for term in cleaned_terms]
    # create bi-grams
    terms_with_bigrams = bi_gram_model[' '.join(cleaned_terms).split(' ')]
    # create tri-grams
    terms_with_trigrams = tri_gram_model[terms_with_bigrams]
    # expand query with synonyms
    search_terms = [fasttext_model.wv.most_similar(token) for token in terms_with_trigrams]
    # filter synonyms above threshold (and flatten the list of lists)
    search_terms = [synonym[0] for synonyms in search_terms for synonym in synonyms
                    if synonym[1] >= synonyms_threshold]
    # expand keywords with synonyms
    search_terms = list(terms_with_trigrams) + search_terms
    return search_terms


def text_query(user_input_query, user_input_program, user_input_device):
    try:
        index = nmslib.init(method='hnsw', space='cosinesimil')
        index.loadIndex('src/models/sparse_index_word2vec_text_search.bin', load_data=True)
        word2vec_model = Word2Vec.load('src/models/_word2vec_text_search.model')
        user_input_bi_tri_grams_synonyms = \
            get_text_search_terms(str(user_input_query), 0.9, word2vec_model)
        user_input_bi_tri_grams_synonyms.append(user_input_program)
        user_input_bi_tri_grams_synonyms.append(user_input_device)

        query_prep = [word2vec_model.wv[vec] for vec in user_input_bi_tri_grams_synonyms]
        query_prep = np.mean(query_prep, axis=0)

        if user_input_program == 'all' or user_input_query == '':
            item_output_threshold = 100
            filter_threshold = 0.25
        else:
            item_output_threshold = 25
            filter_threshold = 0.15

        ids, distances = index.knnQuery(query_prep, k=item_output_threshold)
        result_ids = []
        for i, j in zip(ids, distances):
            if round(j, 2) < filter_threshold:
                result_ids.append(i)
                # print(i, j)
    except KeyError:
        result_ids = []

    return result_ids


def get_shortcut_search_terms(keywords):
    # clean tokens
    cleaned_terms = keywords.lower().split(', ')
    # remove empty terms
    cleaned_terms = [term for term in cleaned_terms if term]
    return cleaned_terms


def shortcut_query(user_input_query, user_input_program, user_input_device, index):
    try:
        word2vec_model = Word2Vec.load('src/models/_word2vec_shortcut_search.model')

        user_input_terms = get_shortcut_search_terms(user_input_query)
        user_input_terms.append(user_input_program)
        user_input_terms.append(user_input_device)

        query_prep = [word2vec_model.wv[vec] for vec in user_input_terms]
        query_prep = np.mean(query_prep, axis=0)

        if user_input_program == 'all' or user_input_query == '':
            item_output_threshold = 100
            filter_threshold = 0.15
        else:
            item_output_threshold = 10
            filter_threshold = 0.1

        ids, distances = index.knnQuery(query_prep, k=item_output_threshold)
        result_ids = []
        for i, j in zip(ids, distances):
            if round(j, 2) < filter_threshold:
                result_ids.append(i)
                # print(i, j)
    except KeyError:
        result_ids = []

    return result_ids


def get_device(tab_value):
    switcher = {
        0: "windows",
        1: "macos",
        2: "linux",
        3: "web_application"
    }
    return switcher.get(tab_value, 0)


def spellcheck_query(query):
    spell = SpellChecker()
    wordlist = query.split()
    misspelled = list(spell.unknown(wordlist))
    corrected_wordlist = []
    for word in wordlist:
        if word in misspelled:
            corrected_wordlist.append(spell.correction(word))
        else:
            corrected_wordlist.append(word)
    corrected_query = ' '.join(corrected_wordlist)
    if not misspelled:
        misspell_boolean = False
    else:
        misspell_boolean = True
    return misspell_boolean, corrected_query
