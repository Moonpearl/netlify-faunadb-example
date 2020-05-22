/* Api methods to call /functions */

const create = (data) => {
  return fetch('/.netlify/functions/todos', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const read = (todoId) => {
  return fetch(`/.netlify/functions/todos/${todoId}`).then((response) => {
    return response.json()
  })
}

const readAll = () => {
  return fetch('/.netlify/functions/todos').then((response) => {
    return response.json()
  })
}

const update = (todoId, data) => {
  return fetch(`/.netlify/functions/todos/${todoId}`, {
    body: JSON.stringify(data),
    method: 'PUT'
  }).then(response => {
    return response.json()
  })
}

const deleteTodo = (todoId) => {
  return fetch(`/.netlify/functions/todos/${todoId}`, {
    method: 'DELETE',
    body: '',
  }).then(response => {
    return response.json()
  })
}

const batchDelete = (todoIds) => {
  return fetch(`/.netlify/functions/todos-delete-batch`, {
    body: JSON.stringify({
      ids: todoIds
    }),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

export default {
  create: create,
  read: read,
  readAll: readAll,
  update: update,
  delete: deleteTodo,
  batchDelete: batchDelete
}
