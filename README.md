### Bug Fixing Project

## Project1: Todo
1. Remove comment from local Storage and enable it to store todo items in the local storage.(correct)
2. Enable checkbox functionality to mark the task completed or not (correct)
3. Enable delete functionality via index of array (correct)
4. Enable filter functionality (correct)
5. ClearCompleted by enabling re-render (correct)
6. Correct left todos count by those are completed(correct)
7. To add item with Date, should be of futures
8. Add edit functionality becuase this functionality should be present in todo list.
9.  addTodo does not trim whitespace, so "   " is treated as valid input - Fix
10. due date overdue check uses >= instead of > (today is not overdue) - Fix
11. id generation uses Math.random() without seeding — duplicates possible, but worse: nextId is computed as todos.length + 1, causing ID collisions after deletions - Fix


## Project3: Shopping
1. Add crooss icon and enable functionality to closed the opened cart.
2. Handle quantity update, can't be greater than the quantity available in stock. (correct)
3. Cart make empty once user placed or checkout order. (correct)
4. In products, the USB-C Hub price is string it should be number
5. Coupan can't be apply more than once - (correct)
6. when remove item its removed by name instead of unique id (correct)
7. when user enter wrong coupan and checkout order then the error message still there it should be removed when checkout the order
8. once user checkout the discount should be set to default 0.1
9. Cart count is done by cart.length it should be count by quantity. (correct)
10. quantity can't be less than 1 in cart (correct)
11. Coupon code comparison is case-sensitive ("SAVE10" != "save10") - Fix
12. subtotal floating point not rounded (e.g. 29.999999999) - Fix

## Project2 : Weather-widget
1. Correct name of the key in localstorage to get and set the value in localstroage, should same to access and set the value
2. avoid duplicate city to render or add in localstroage
3. Empty the input field once searched the location of weather
4. Remove recent history by enabling clearhistory and also remove the card from of the deatails of the weather for the recent searched location.
5. use the hideWeatherCard by weatherCard id instad of errorMsg
6. if city doesn't exist then there should not be display wheather card for previous city
7. when user enter wrong city name then show error message and clear the history then error message should be removed
8. change the data.main.temp_min with data.main.feels_like to access the feelslike data


## Project node-01: products-api
1. In GET /products/:id convert the params id type into number 
2. To parse the data for post,put,patch use the middleware express.json()
3. During post, the status code should be 201 for create instead of success code 200
4. In PUT /products/:id, convert the params id type into number 
5. when product update some fields of product then other fields should be remaning same which are not update
6. error middelware is present but never used so used in catch block by the use of next keyword
7. In GET /products/stats, it should be written before the dynamic route otherwise, specific routes(fixed routes) will not go forward becuase in express the routes order matters. order should be specific route first then dynamic route.
8. process.env.PORT used but never used so create .env file and used this by defining at the top of the code.


## Project node-02: auth-System
1. Dotenv avilable but never used
2. Remove the immdediate authentication during the registration- user first verify during login then generate token
3. add token expiration time in jwt.sign so that the token will not be forever. (correct)
4. Email validation is not correct like accept s@gmal so correct the email validation using regex (correct)
5. apply await during comparison of password using bcrypt.compare because to compare the password it will take time so await should be there. (correct)
6. salt value should be minimum equal to 10 becuase salt value 1 like as no hasging security of hashing to low. (correct)
7. JWT is hardcoded in main file instaed of maintain in .env file so it should be keep in environment varibable for the security. (correct)
8. During registration, there is no check for duplicate email.(correct)
9. when user get, there should be send the user data without password. (correct)
10. Auth middleware attaches full user object (including password hash) to req.user -Fix


## Project node-03: notes-api
1. mockAuth midleware, verify the auth by maintaing userid should <=2 and >=1
2. In getNotesForUser, resolve should be inside the setTimeout because this is the asynchronous operation and take time to resolve and result is depen on the setTimeout so it will be used inside otherwise synchronous taks will execte first and giev undeinded for the getNotesForUser. (Correct)
3. change the order of the route because the specific/fixed route should be come first in order in express.js then dyncamic route.
4. change the order of notes/:id and notes means first come static route then dynamic route
5. when delete particular note then there should not be send all notes in response.
6. when user get the product detail user should be chcek that he opens his own note or someone else note.
7. when user update note there should be user check whether he is updateing his own note or someone else, allow only for own note to update. (correct)
8. In search, there should be used toLowerCase() otherwise it will not for the uppercase letter.(correct)
9. Async route handlers missing try/catch — unhandled promise rejections crash the server -Fix
10. Pagination: page 0 or negative page not handled — offset becomes negative -Fix
11. Note body maxLength validated on create but not on update -Fix
12. Tags are stored as a string if user sends a string instead of array — no normalization - Fix
13. Response includes internal _userId field that should be hidden from client -Fix



## Project react-01: user-dashboard
1. add array dependency so that when search it will not rerender at every character 
2. replace Math.round with Math.ceil due to which filter will work correctly by available page number (correct)
3. add statusFilter in array dependency so that component will render and fetch through filter
4. array dependencies should be present in useEffect to avoid rerendering. (correct)
5. During calcultation of total pages there should be used ceil instead of round.
6. during calculation of avgRevenue there should be check for user.length becuase if its equal to zero then it will NaN when find avgRevenue
7. when matches during search it should be used include instaed of user.email==search
8. correct the css accroing to the logic for user status active,inactive or pending (correct)
9. when search by name or email it does not set to defualt page 1 (correct)
10. useEffect cleanup missing — setState called after unmount possible - Fix
11. sortUsers mutates the original array with .sort() instead of [...arr].sort() - Fix

## Project react-02: quiz-app
1. there is no suggestion or button to start the quiz its start immediately so applied a button which indicates that user have to first start.
2. Correct the logic for time per question i.e time counter for per question (Correct)
3. Correct the logic for count the correct answer and make sure to give correct answer (correct)
4. correct the UI logic for success green color and for wrong answer give red color. () (correct)
5. once user finish the quiz then remove the previous quiz reult over the result UI. 
6. score should be increased when question correct not the wrong answer. (Correct)
7. correct the css conditions ans.correct in review answer (correct)
8. when click on next question answer should be set to false (correct)
9. when user click on restart quiz then user answer should be set to initial state [] (correct)
10. Final score percentage rounds down with Math.floor instead of Math.round - Fix
11. Timer useEffect not cleared on unmount or when quiz ends — memory leak- Fix


## Project react-03: blog-app
1. when user write post there is a issue to include the state of title into the content in value so correct via add content in value.
2. when add comment then the date is in the string format and it will take the string so i format the date via .toLocalDateStering("en-In",{}). (Correct)
3. show the count of like at current time over the home page of post.
4. when user visit post detail and like the post, the count is increasing only when like via same machine so correct it via take a state and handle like now behaves as like or dislike functionalit.(correct)
5. In add post, the value should contain content instaed of title (correct)
6. In newPost, content: content instaed of title (correct)
7. In post it should be post.likes to count instead of comment
8. In newPost, id should be Date.now instead of Math.random() becuase collision can be posible in unique ids. (correct)
9. During adding comment, there should not be add empty fields (correct)
10. search should allow case-insensitivity.
11. Post list re-renders unnecessarily — posts passed as prop but filtered inside render without useMemo - Fix
12. Back button on post detail doesn't clear selectedPost — shows blank state - Fix
13. Tags split on comma but don't trim whitespace — " React" stored with leading space- Fix



##  Project react-04: expence-tracker
1. Add array depencies in the useEffect it is re-render again and again so add array dependencies and parse transaction state on it when transaction state change then rerender
2. when add amount its taking integer amount and so parse into float amount can be float
3. total income is calculated via expencses so it should be calculated via income.
4. In sorting transaction, new transaction should be show first
5. when amount validation there should be check for greater than 0 otherwise consider amount 0 as well.
6. In deletion of transaction state directly mutating instead of setting new return array for state 
7. useEffect to persist to localStorage saves on every render, not just when transactions change (correct)
9. Balance shows sum of ALL transactions (income - expenses), not filtered view - Fix
10. Date input defaults to empty string — no default to today -Fix
