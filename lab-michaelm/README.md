# Lab 12

## How To Install

* From the directory where package.json is located, type:
> npm install

## How To Start The Server

* To start the server, type the following command from the root directory of the application:
> npm run start

## Routes

* To Create a leader.
> http POST localhost/api/leader?firstName=**string**.&&lastName=**string**

* To Read a leader from the database.
> http GET localhost/api/leader?_id=**id of user**

* To Update a leader's entry.
> http PUT localhost/api/leader?firstName=**string**.&&lastName=**string**

* To Delete a leader.
> http GET localhost/api/leader?_id=**id of user to be deleted**

* To Create a member.
> http POST localhost/api/member?firstName=**string**.&&lastName=**string**&&availabilityDate=**datestring**

* To Read a member from the database.
> http GET localhost/api/member?_id=**id of user**

* To Update a member's entry.
> http PUT localhost/api/member?firstName=**string**.&&lastName=**string**&&availabilityDate=**datestring**

* To Delete a member.
> http GET localhost/api/member?_id=**id of user to be deleted**
