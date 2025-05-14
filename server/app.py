from flask import Flask, render_template, request,jsonify 
import pickle
import difflib

app = Flask(__name__)

# Load your pickled data once at the start
movie_list = pickle.load(open('movies_list.pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))
list_of_titles = movie_list['original_title'].values


@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message':'Movie Recommendation🍿📽️'
    })
@app.route('/predict', methods=['POST'])
def recommend():
    try:
        
        data= request.get_json()
        title=data['title']
        # Find close match
        find_close_match = difflib.get_close_matches(title, list_of_titles)

        if not find_close_match:
            return render_template('index.html', error='Sorry, the movie is not in my dataset. I shall update it soon. Thank you!')

        close_match = find_close_match[0]
        movie_index = movie_list[movie_list['original_title'] == close_match]['index'].values[0]
        similarity_score = list(enumerate(similarity[movie_index]))
        sorted_sim = sorted(similarity_score, key=lambda x: x[1], reverse=True)

        # Get top 10 similar movies (excluding the input movie itself)
        recommended_movies = []
        for i in sorted_sim[1:11]:  # Skips the input movie itself
            index = i[0]
            title_from_index = movie_list[movie_list['index'] == index]['original_title'].values[0]
            recommended_movies.append(title_from_index)

        return jsonify({
            'message':'The recommended movies are: ',
            'data':recommended_movies
            })
    except Exception as e:
         return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=2000, debug=True)
