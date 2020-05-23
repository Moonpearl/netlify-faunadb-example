const FaunaDb = require('faunadb');
const getId = require('./getId');
const httpResponse = require('././httpResponse');
const checkSchema = require('./checkSchema');
const q = FaunaDb.query;

module.exports = (entity, schema) => (event, context) => {
  const { path, body, httpMethod } = event;

  const client = new FaunaDb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  });
  const id = getId(path);
  let data;
  if (typeof body !== 'undefined' && body !== '') {
    data = JSON.parse(body);

    try {
      data = checkSchema(data, schema);
    }
    catch(error) {
      return httpResponse(400, error.message);
    }
  }

  switch (httpMethod) {
    case 'GET':
      // Read single record
      if (id !== null) {
        console.log(`Read ${entity} id: ${id}`)
        return client.query(q.Get(q.Ref(`classes/${entity}/${id}`)))
        .then((response) => {
          console.log('success', response);
          return httpResponse(200, response);
        }).catch((error) => {
          console.log('error', error);
          return httpResponse(400, error);
        });
      // Read all records
      } else {
        console.log(`Read all ${entity}`)
        return client.query(q.Paginate(q.Match(q.Ref(`indexes/all_${entity}`))))
        .then((response) => {
          const todoRefs = response.data
          console.log('Todo refs', todoRefs)
          console.log(`${todoRefs.length} ${entity} found`)
          // create new query out of todo refs. http://bit.ly/2LG3MLg
          const getAllTodoDataQuery = todoRefs.map((ref) => {
            return q.Get(ref)
          })
          // then query the refs
          return client.query(getAllTodoDataQuery).then((ret) => {
            return httpResponse(200, ret);
          })
        }).catch((error) => {
          console.log('error', error)
          return httpResponse(400, error);
        });
      }

    case 'POST':
      // Create new record
      console.log(`Create new ${entity}`, data)
      if (id !== null) {
        return httpResponse(400, `Cannot pass id on ${httpMethod} request at ${path}`);
      }

      const todoItem = {
        data: data
      };
      /* construct the fauna query */
      return client.query(q.Create(q.Ref(`classes/${entity}`), todoItem))
      .then((response) => {
        console.log('success', response)
        /* Success! return the response with statusCode 200 */
        return httpResponse(200, response);
      }).catch((error) => {
        console.log('error', error)
        /* Error! return the error with statusCode 400 */
        return httpResponse(400, error);
      });
    
    case 'PUT':
      // Update existing record
      console.log(`Update ${entity} at id: ${id}`)
      if (id === null) {
        return httpResponse(400, `Id required on ${httpMethod} request at ${path}`);
      }

      return client.query(q.Update(q.Ref(`classes/${entity}/${id}`), {data}))
      .then((response) => {
        console.log('success', response)
        return httpResponse(200, response);
      }).catch((error) => {
        console.log('error', error)
        return httpResponse(400, error);
      });
    
    case 'DELETE':
      // Delete existing record
      console.log(`Delete ${entity} at id: ${id}`)
      if (id === null) {
        return httpResponse(400, `Id required on ${httpMethod} request at ${path}`);
      }

      return client.query(q.Delete(q.Ref(`classes/${entity}/${id}`)))
      .then((response) => {
        console.log('success', response)
        return httpResponse(200, response);
      }).catch((error) => {
        console.log('error', error)
        return httpResponse(400, error);
      });

    // HTTP method not supported
    default:
      return httpResponse(405, `Cannot ${httpMethod} ${path}`)
  }
}
