from flask import Flask, request
import nmslib
# from search_functions import text_query, get_device, spellcheck_query, shortcut_query
from search_functions import text_query, get_device, shortcut_query
import pandas as pd

# app = Flask(__name__)
app = Flask(__name__, static_folder="../build", static_url_path="/")


@app.route('/')
def index():
    return app.send_static_file('index.html')


def text_search_query(user_input_query, user_input_program, user_input_device):
    # perform query spellcheck
    # misspell_boolean, corrected_query = spellcheck_query(user_input_query)

    ids = text_query(user_input_query, user_input_program, user_input_device)

    # return ids, corrected_query, misspell_boolean
    return ids, '', False


def shortcut_search_query(user_input_query, user_input_program, user_input_device):
    index = nmslib.init(method='hnsw', space='cosinesimil')
    index.loadIndex('../src/models/sparse_index_word2vec_shortcut_search.bin', load_data=True)

    ids = shortcut_query(user_input_query, user_input_program, user_input_device, index)
    return ids


@app.route('/api/getSearchResults', methods=['POST'])
def get_search_results():
    # get user inputs
    user_input_text_search = request.json['textSearch']
    user_input_shortcut_query = request.json['inputShortcut']
    user_input_query = request.json['query']
    user_input_program = request.json['selectedProgram'].replace(' ', '_').lower()
    if user_input_program == 'null':
        user_input_program = 'all'
    user_input_device = get_device(int(request.json['tabsValue']))

    if user_input_text_search:
        ids, corrected_query, misspell_boolean = text_search_query(user_input_query,
                                                                   user_input_program,
                                                                   user_input_device)
    else:
        ids = shortcut_search_query(user_input_shortcut_query, user_input_program, user_input_device)
        corrected_query = ''
        misspell_boolean = False

    # extract relevant rows from csv and order them according to ranking
    all_shortcuts = pd.read_csv('../src/models/shortcuts.csv')
    results = all_shortcuts[all_shortcuts['id'].isin(ids)]
    results = results.set_index('id')
    results = results.loc[ids]
    results.reset_index(inplace=True)

    # convert dataframe to dict
    if user_input_program == 'all':
        filtered_results = results.loc[(results['device_gram'] == user_input_device)].to_dict(orient='records')
    else:
        filtered_results = results.loc[(results['device_gram'] == user_input_device) &
                                       (results['program_gram'] == user_input_program)].to_dict(orient='records')

    return {'results': filtered_results,
            'correctedQuery': corrected_query,
            'misspell': misspell_boolean}
