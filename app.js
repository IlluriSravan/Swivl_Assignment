const express = require('express')
const {open} = require('sqlite')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())
const path = require('path')
const sqlite3 = require('sqlite3')
const dbPath = path.join(__dirname, 'app.db')
let db = null
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Listening at 3000')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

class User {
  async registration(request, response) {
    const {username, password, gender, location} = request.body

    const hashedPassword = await bcrypt.hash(password, 10)
    const checkUser = `SELECT * FROM user WHERE username='${username}'`
    const dbUser = await db.get(checkUser)
    console.log(dbUser)
    if (dbUser === undefined) {
      const createUserQuery = `INSERT INTO user (username,password,gender,location) values('${username}','${hashedPassword}','${gender}','${location}')`
      const createdUserResponse = await db.run(createUserQuery)
      response.send('User created Successfully')
    } else {
      response.send('User Exists Please Login')
    }
  }

  async login(request, response) {
    const {username, password} = request.body
    // const hashedPassword = await bcrypt.hash(password, 10)
    const checkUserQuery = `SELECT * FROM user WHERE username='${username}'`
    const dbUser = await db.get(checkUserQuery)
    if (dbUser === undefined) {
      response.status(400)
      response.send('Invalid User')
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
      console.log(password, dbUser.password, isPasswordMatched)
      if (isPasswordMatched === true) {
        const payload = {username: username}
        const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
        response.send(jwtToken)
      } else {
        response.status(400)
        response.send('Invalid Password')
      }
    }
  }

  authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization']
    let jwtToken
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(' ')[1]
    }
    if (jwtToken === undefined) {
      response.status(401)
      response.send('NOT AUTHORIZED')
    } else {
      jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, user) => {
        if (error) {
          response.status(401)
          response.send('NOT AUTHORIZED')
        } else {
          next()
        }
      })
    }
  }
}

class Recipe {
  async getRecipe(request, response) {
    const {recipeId} = request.params
    const getRecipeQuery = `SELECT * FROM recipees WHERE id=${recipeId}`
    const returnedRecipe = await db.get(getRecipeQuery)
    console.log(returnedRecipe)
    response.send(returnedRecipe)
  }

  async postRecipe(request, response) {
    const recipeDetails = request.body
    const {title, description, ingredients, instructions, imageUrl, id} =
      recipeDetails
    const addRecipeQuery = `INSERT INTO recipees (title,description,ingredients,instructions,imageUrl,id) 
    VALUES ('${title}','${description}','${ingredients},'${instructions}','${imageUrl}',${id})`
    const addResponse = await db.run(addRecipeQuery)
    response.send({recipeId: id})
  }

  async putRecipe(request, response) {
    const recipeDetails = request.body
    const {recipeId} = request.params
    const {title, description, ingredients, instructions, imageUrl, id} =
      recipeDetails
    const putRecipeQuery = `UPDATE recipees SET (title='${title}',
    description='${title}',ingredients='${ingredients}',instructions='${instructions}',imageUrl='${imageUrl}',id=${id}}) 
    WHERE id=${recipeId}`

    const putResponse = await db.run(putRecipeQuery)
    response.send('Updated Successfully')
  }

  async deleteRecipe(request, response) {
    const {recipeId} = request.params
    const deleteQuery = `DELETE FROM recipees WHERE id=${recipeId}`
    const deleteResponse = await db.run(deleteQuery)
    response.send('Recipe Deleted Successfully')
  }
}

const user1 = new User()
const recipe = new Recipe()
app.post('/login/', (request, response) => {
  user1.login(request, response)
})
app.post('/user/register/', (request, response) => {
  user1.registration(request, response)
})
app.get('/recipe/:recipeId/', user1.authenticateToken, (request, response) => {
  recipe.getRecipe(request, response)
})
app.post('/recipe/', user1.authenticateToken, (request, response) => {
  recipe.postRecipe(request, response)
})
app.put('/recipe/:recipeId/', user1.authenticateToken, (request, response) => {
  recipe.putRecipe(request, response)
})
app.delete(
  '/recipe/:recipeId/',
  user1.authenticateToken,
  (request, response) => {
    recipe.deleteRecipe(request, response)
  },
)
