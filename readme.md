Step 0:-  open backend folder and work inside the backend
step1:- npm init -y
step2:- npm i express mongoose cors dotenv jsonwebtoken bcrypt nodemon

Step3:- create index.js , .gitignore , .env files
step 4:- create a folder in root named models
step 5:- create a folder in root named controllers
step 6:- create a folder in root named routes
step 7:- create a folder in root named middleware
step 8:- create a folder in root named utils

step 9:- inside model craete some files  like :- 
        user.js
        category.js
        product.js
        order.js
step 10:- inside controller craete some files  like :- 
        userController.js
        categoryController.js
        productController.js
        orderController.js
Step 11:- inside routes create some files like :- 
        userRoute.js
        categoryRoute.js
        productRoute.js
        orderRoute.js
Step 12:- inside middleware create some files like :- 
        auth.js
Step 13:- create a folder in root named config

step 14:-inside middleware create some files like :- 
          db.js
          


http://localhost:5000/api/user/register



req 

middleware  upload url :-  path of image 
        public id :-  edit / delete 

res 
User:

POST http://localhost:5000/api/user/register — body: JSON
POST http://localhost:5000/api/user/login — body: JSON
POST http://localhost:5000/api/user/forgot-password — body: JSON
POST http://localhost:5000/api/user/reset-password — body: JSON
GET http://localhost:5000/api/user/check-token — Header: Authorization: Bearer 
Category:

POST http://localhost:5000/api/category/create-category — body: form-data (file field name: image), auth header required
GET http://localhost:5000/api/category/all-category — no auth
Product:

POST http://localhost:5000/api/product/create — body: form-data (file field name: images, up to 5 files), auth header required
GET http://localhost:5000/api/product/get-all — no auth
Order:

POST http://localhost:5000/api/order/create-order — body: JSON, auth header required
Seed (placeholder):