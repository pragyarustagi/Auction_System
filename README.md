# Auction_System

The Auction system consists of following tables - 

Auction Item 
This table should contain Item name , Item description, startTime, endTime, startingAmount, winner, imageURL 

Bids: 
This table should contain all bids done, should store which item, which user and the amount. 

User:
Should store email, password and full name.

This system is implemented in NodeJS and Mongodb. The following operations take place -

APIs

1. API to list all items on auction, upcoming auctions, previous auctions.
2. API to list details of an item.
   2.1 If the item is already auctioned should give the details of buyer and the amount
   2.2 If the item is currently in auction, should list the highest bid amount
3. Run a task to automatically find the winner of each auction when it hits the endTime.Send an email to all users who bid for the item with details of the winner and final amount.
4. Submit new Bid. To submit bid the user must be logged in. To view the item details and all other stuff, no need to be authenticated.
5. View all bids submitted by an authenticated user.

For accessing the API, you can refer to the following Postman API collection - 
https://www.getpostman.com/collections/7ee3b084bbba3470620e
