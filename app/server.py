from app import app, db
from flask import Flask, render_template, jsonify, abort, request
from models import Todo

@app.route('/')
def index():
    _todos = Todo.query.all()
    return render_template('index.html', todos = _todos)

@app.route('/todos/', methods=['POST'])
def todo_create():
    newtodo = request.get_json()
    todo = Todo(newtodo['content'], newtodo['done'], newtodo['order'])
    db.session.add(todo)
    db.session.commit()
    return _todo_response(todo.to_dict())

@app.route('/todos/<int:id>')
def todo_read(id):
    todo = _todo_get_or_404(id)
    return _todo_response(todo.to_dict())

@app.route('/todos/<int:id>', methods=['PUT', 'PATCH'])
def todo_update(id):
    todo = _todo_get_or_404(id)
    updates = request.get_json()
    todo.content = updates['content']
    todo.done = updates['done']
    todo.order = updates['order']
    db.session.commit()
    return _todo_response(todo.to_dict())

@app.route('/todos/<int:id>', methods=['DELETE'])
def todo_delelte(id):
    todo = _todo_get_or_404(id)
    db.session.delete(todo)
    db.session.commit()
    return _todo_response({})

def _todo_get_or_404(id):
    todo = Todo.query.filter_by(id=id).first()
    if todo is None:
	abort(404)
    return todo

def _todo_response(todo):
    return jsonify(**todo)
