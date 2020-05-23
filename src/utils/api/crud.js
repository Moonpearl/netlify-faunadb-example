/* Api methods to call /functions */

export default (resource) => ({
  create: (data) => {
    return fetch(`/.netlify/functions/${resource}`, {
      body: JSON.stringify(data),
      method: 'POST'
    }).then(response => {
      return response.json()
    })
  },

  read: (todoId) => {
    return fetch(`/.netlify/functions/${resource}/${todoId}`).then((response) => {
      return response.json()
    })
  },

  readAll: () => {
    return fetch(`/.netlify/functions/${resource}`).then((response) => {
      return response.json()
    })
  },

  update: (todoId, data) => {
    return fetch(`/.netlify/functions/${resource}/${todoId}`, {
      body: JSON.stringify(data),
      method: 'PUT'
    }).then(response => {
      return response.json()
    })
  },

  delete: (todoId) => {
    return fetch(`/.netlify/functions/${resource}/${todoId}`, {
      method: 'DELETE',
      body: '',
    }).then(response => {
      return response.json()
    })
  },
});
