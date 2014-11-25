# Todos

Basic Todo List adapted from TodoMVC using Backbone.js, Require.js, and Flask

## Initial set up

To set up the Flask backend, first set up a virtual environment and install the appropriate packages.

```sh
$ virtalenv venv --no-site-packages
$ . venv/bin/activate
$ pip install -r requirements.txt
```

Then initialize the database from the python environment.

```sh
$ python
```

```py
>>> from models import db
>>> db.create_all()
>>> exit()
```

## Start program

To start the app, run `$ python run.py` from the command line. The app can now be viewed on your local machine at `127.0.0.1:8002`.

A live version of this app is deployed at [http://todo.connienguyen.me]
