from app import app
from werkzeug.contrib.fixers import ProxyFix

if __name__ == '__main__':
    app.run(debug=True, port=8002)
