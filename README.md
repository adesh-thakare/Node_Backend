
# NodeJS integration with Postgres DB

Summary - Nodejs api integrated with Postgres DB to query authors data like sales revenue, books, name, email etc from tables created in Postgres using PgAdmin GUI.

# Part 1: Optimized SQL Queries 

1. **Queries:** 
   ```bash
   SELECT name, email
   FROM authors
   ORDER BY date_of_birth
   LIMIT 10;

   SELECT SUM(sale_items.item_price * sale_items.quantity) AS total_sales
   FROM sale_items 
   JOIN books ON sale_items.book_id = books.id
   JOIN authors ON books.author_id = authors.id
   WHERE authors.name = 'Lorelai Gilmore'; 

   SELECT authors.name, SUM(sale_items.item_price * sale_items.quantity) AS total_sales
   FROM sale_items 
   JOIN books ON sale_items.book_id = books.id
   JOIN authors ON books.author_id = authors.id
   GROUP BY authors.name
   ORDER BY total_sales DESC
   LIMIT 10;



# How to setup and run the API on a local machine

## Prerequisites
prerequisites that needs to be installed:

- [Node.js](https://nodejs.org/): Download and install Node.js.
- [PostgreSQL](https://www.postgresql.org/): Download and install PostgreSQL.
- [Redis](https://redis.io/): Download and install Redis

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/adesh-thakare/Node_Backend.git
   cd Node_Backend

2. **Install the dependencies:**
     
   ```bash
   npm install

3. **Create .env file in the root directory**

   ```bash
   DB_USER=your_postgres_database_user
   DB_HOST=your_database_host
   DB_NAME=your_database_name
   DB_PASSWORD=your_database_password
   DB_PORT=your_database_port
   PORT=8000 # Change the port number if needed
   REDIS_HOST=redis_host
   REDIS_PORT=redis_port

4. **Using PgAdmin tool to setup relations and populate database tables**

   You can use either pgAdmin or psql command line to create the database, you can watch a demo here -

5. **Run the server**

   ```bash
   node app.js   

Send GET requests to http://localhost:8000/top-authors to fetch top authors and emails ( can also be modified to get top 10 authors based on sales revenue.

Testing done on Postman, Apache Jmeter.
   
Live deployment of API and Postgres done on railway web app - https://node-backend-livid.vercel.app/ need postgres setup

Connection Pool used for Postgresql for db server utilization optimization for handling large traffic - https://www.enterprisedb.com/postgres-tutorials/why-you-should-use-connection-pooling-when-setting-maxconnections-postgres

Redis for in memory storage and caching the data.

Apache ab API performance test results - 

```bash
(base) adeshthakare@Adeshs-MacBook-Air ~ % ab -n 1000 -c 1000  -r http://localhost:8000/top-authors
This is ApacheBench, Version 2.3 <$Revision: 1913912 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests


Server Software:        
Server Hostname:        localhost
Server Port:            8000

Document Path:          /top-authors
Document Length:        591 bytes

Concurrency Level:      1000
Time taken for tests:   0.373 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      855000 bytes
HTML transferred:       591000 bytes
Requests per second:    2679.84 [#/sec] (mean)
Time per request:       373.156 [ms] (mean)
Time per request:       0.373 [ms] (mean, across all concurrent requests)
Transfer rate:          2237.57 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0   18  41.5      0     302
Processing:     1   25  28.6      6      77
Waiting:        1   17  20.0      6      65
Total:          1   43  50.1      8     308

Percentage of the requests served within a certain time (ms)
  50%      8
  66%     67
  75%     80
  80%     83
  90%    100
  95%    107
  98%    206
  99%    211
 100%    308 (longest request)
(base) adeshthakare@Adeshs-MacBook-Air ~ % 

