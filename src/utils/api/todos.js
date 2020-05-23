import crud from './crud';

export default {
  ...crud('todos'),

  batchDelete: (todoIds) => {
    return fetch(`/.netlify/functions/todos-delete-batch`, {
      body: JSON.stringify({
        ids: todoIds
      }),
      method: 'POST'
    }).then(response => {
      return response.json()
    })
  },

  getCompleted: () => {
    return fetch(`/.netlify/functions/todos-completed`)
    .then(response => response.json());
  },
};
