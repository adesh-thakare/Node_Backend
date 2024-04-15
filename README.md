
# NodeJS integration with Postgres DB

Summary - Nodejs api integrated with Postgres DB to query authors data like sales revenue, books, name, email etc from tables created in Postgres using PgAdmin GUI.

# Part 1: Optimized SQL Queries 
 
```bash
   SELECT name, email
   FROM authors
   ORDER BY date_of_birth
   LIMIT 10;

 ```bash
   SELECT SUM(sale_items.item_price * sale_items.quantity) AS total_sales
   FROM sale_items 
   JOIN books ON sale_items.book_id = books.id
   JOIN authors ON books.author_id = authors.id
   WHERE authors.name = 'Lorelai Gilmore'; 

```bash
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

4. **Using PgAdmin tool to setup relations and populate database tables**

   You can use either pgAdmin or psql command line to create the database, you can watch a demo here -

5. **Run the server**

   ```bash
   node app.js   

Send GET requests to http://localhost:8000/top-authors to fetch top authors and emails ( can also be modified to get top 10 authors based on sales revenue.
   
