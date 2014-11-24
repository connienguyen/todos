from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
db = SQLAlchemy(app)

class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(80))
    done = db.Column(db.Boolean)
    order = db.Column(db.Integer)

    def __init__(self, content, done, order):
	self.content = content
	self.done = done
	self.order = order

    def __repr__(self):
	return '<Todo %r>' % self.content

    def to_dict(self):
	return {'content': self.content, 'done': self.done,
		'id': self.id, 'order': self.order}
