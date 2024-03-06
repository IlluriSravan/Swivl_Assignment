# Recipe Share API

FILES: `app.js` file and a sample database file `app.db`.

Created two tables 1.user and 2.recipees inside app.db file with sample data.

`user` table  with the following columns,

**user Table**

| Column       | Type    |
| --------     | ------- |
| username     | VARCHAR |
| password     | VARCHAR |
| gender       | VARCHAR |
| location     | VARCHAR |

**recipees Table**

| Column          | Type    |
| --------        | ------- |
| title           | VARCHAR |
| description     | TEXT    |
| ingredients     | TEXT    |
| instructions    | TEXT    |
| imageUrl        | TEXT    |
| id              |INT      |

and written APIs to perform operations on the database,

### API 1

#### Path: `/login/`

#### Method: `POST`

  - **Sample API**
    ```
    /todos/?status=TO%20DO
    ```
  - **Description**:

    Returns a token on success LOGIN

  - **Response**

 ```
   jwtToken
  
```


### API 2

#### Path: `/user/register/`

#### Method: `POST`

#### Description:

Returns message on Successful registration

#### Response

```
User created Successfully
  
```



### API 3

#### Path: `/recipe/:recipeId/`

#### Method: `GET`

#### Description:

Gets respective recipe item from the database

#### Request

```
Authorization: Bearer "jwtToken"
```

#### Response

```
{
  title:"pizza",
  description:"....",
  ingredients:"...",
  instructions:"...",
  imageUrl:"...",
  id:1
}
```

### API 4

#### Path: `/recipe/`

#### Method: `POST`

#### Description:

Adds a new recipe item to database

- **Scenario 1**

  - **Request**
    ```
    {
  title:"pizza",
  description:"....",
  ingredients:"...",
  instructions:"...",
  imageUrl:"...",
  id:1
    }
    ```
  - **Response**

    ```
    2
    ```



 

### API 5

#### Path: `/recipe/:recipeId/`

#### Method: `PUT`

#### Description:

Updates a recipe from the recipees table based on the recipeID

#### Response

```
Updated Successfully
```

### API 6

#### Path: `/recipe/:recipeId/`

#### Method: `DELETE`

#### Description:

Deletes a recipe from the recipees table based on the recipeID

#### Response

```
Recipe Deleted Successfully
```

<br/>

Use `npm install` to install the packages.

**Export the express instance using the default export syntax.**

**Use Common JS module syntax.**
