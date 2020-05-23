/* bootstrap database in your FaunaDB account */
const faunadb = require('faunadb')
const chalk = require('chalk')
const insideNetlify = insideNetlifyBuildContext()
const q = faunadb.query

console.log(chalk.cyan('Creating your FaunaDB Database...\n'))

// 1. Check for required enviroment variables
if (!process.env.FAUNADB_SERVER_SECRET) {
  console.log(chalk.yellow('Required FAUNADB_SERVER_SECRET enviroment variable not found.'))
  console.log(`Make sure you have created your Fauna databse with "netlify addons:create fauna"`)
  console.log(`Then run "npm run bootstrap" to setup your database schema`)
  if (insideNetlify) {
    process.exit(1)
  }
}

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

/* idempotent operation */
const createFaunaDB = new Promise( async (resolve, reject) => {
  const createClass = (name) =>
    client.query(q.Create(q.Ref('classes'), { name }))
    .then(() => {
      console.log(`Created Fauna class '${name}'`)
      return client.query(
        q.Create(q.Ref('indexes'), {
          name: `all_${name}`,
          source: q.Ref(`classes/${name}`)
        }))
        .then(() => console.log(`Created index 'all_${name}' in Fauna class '${name}'`))
        .catch(error => console.error(error))
    }).catch((e) => {
      // Database already exists
      if (e.requestResult.statusCode === 400 && e.message === 'instance already exists') {
        console.log(`Fauna class '${name}' already exists`)
      } else if (e.requestResult.statusCode === 400 && e.message === 'validation failed') {
        console.log(`Fauna class '${name}' still cached. Please try again in 60 seconds`)
      } else {
        throw e
      }
    })
  ;

  console.log('Creating the Fauna database schema...')
  const classNames = ['todos'];

  try {
    for (const className of classNames) {
      await createClass(className);
    }

    await client.query(
      q.CreateIndex({
        name: 'completed_todos',
        source: q.Collection('todos'),
        terms: [
          { field: ['data', 'completed'] },
        ],
      })
    )
    .then(() => console.log(`Created selection index for class 'todos'`))

    resolve();
  }
  catch(error) {
    reject(error);
  }
});

// Has var. Do the thing
if (process.env.FAUNADB_SERVER_SECRET) {
  createFaunaDB.then(() => {
    console.log('Fauna Database schema has been created')
    console.log('Claim your fauna database with "netlify addons:auth fauna"')
  })
  .catch(error => console.error(error))
}

/* util methods */

// Test if inside netlify build context
function insideNetlifyBuildContext() {
  if (process.env.DEPLOY_PRIME_URL) {
    return true
  }
  return false
}
