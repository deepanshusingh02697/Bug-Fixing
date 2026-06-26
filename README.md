### Bug Fixing Project

## Project1: Todo
1. Remove comment from local Storage and enable it to store todo items in the local storage.
2. Enable checkbox functionality to mark the task completed or not
3. Enable delete functionality via index of array
4. Enable filter functionality
5. ClearCompleted by enabling re-render

## Project3: Shopping
1. Add crooss icon and enable functionality to closed the opened cart.
2. Handle quantity update, quantity neither be less than 1 in cart and nor be greater than the quantity available in stock.
3. Cart make empty once user placed or checkout order.

## Project2 : Weather-widget
1. Correct name of the key in localstorage to get and set the value in localstroage, should same to access and set the value
2. avoid duplicate city to render or add in localstroage
3. Empty the input field once searched the location of weather
4. Remove recent history by enabling clearhistory and also remove the card from of the deatails of the weather for the recent searched location.


## Project node-01: products-api
1. In GET /products/:id convert the params id type into number 
2. To parse the data for post,put,patch use the middleware express.json()
3. In PUT /products/:id, convert the params id type into number 
4. when product update some fields of product then other fields should be remaing which are not update
5. error middelware is present but never used so used in catch block by the use of next keyword
6. In GET /products/stats, the route should not be start with /products becuase to get the product detail already used so it will search in that and will not hit that api so change the name of starting point of the api for same http methodl due to app.get.
7. process.env.PORT used but never used so create .env file and used this by defining at the top of the code.


## Project node-02: auth-System
1. Dotenv avilable but never used
2. Remove the immdediate authentication during the registration- user first verify during login then generate token
3. add token expiration time in jwt.sign so that the token will not be forever.
4. Email validation is not correct like accept s@gmal so correct the email validation using regex


## Project node-03: notes-api
1. mockAuth midleware, verify the auth by maintaing userid should <=2 and >=1
2. In getNotesForUser, resolve should be inside the setTimeout because this is the asynchronous operation and take time to resolve and result is depen on the setTimeout so it will be used inside otherwise synchronous taks will execte first and giev undeinded for the getNotesForUser.
3. change the api point from /notes/search to /notes1/search becuase it will hit the same api which starts from the /notes for same methods.


## Project react-01: user-dashboard
1. add array dependency so that when search it will not rerender at every character 
2. replace Math.round with Math.ceil due to which filter will work correctly by available page number
3. add statusFilter in array dependency so that component will render and fetch through filter
