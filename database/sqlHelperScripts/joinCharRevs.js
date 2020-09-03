const { Pool, Client } = require('pg');
const tableName = 'char_revs_joined';

// Connection to Postgres DB
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
})


// Connect to DB
client.connect()
  .then(res => {
    console.log('Connected to the DB!');

    //Drop table if exists
    return client.query(`DROP TABLE IF EXISTS ${tableName};`);
  })
  .then(res => {
    // Create tables if they're not there:
    return client.query(`
      CREATE TABLE ${tableName} AS
        (
          SELECT cr.id, cr.review_id, cr.value, c.product_id, c.name, c.id AS char_id
          FROM char_reviews AS cr
          INNER JOIN chars AS c
          ON cr.characteristic_id=c.id
        );
    `);
  })
  .then(res => {
    return client.query(`
      ALTER TABLE ${tableName}
      ADD PRIMARY KEY (id);
    `)
  })
  .then(res => {
    console.log(`Successfully created ${tableName} table!`, Object.keys(res));
    console.log(`Now delete char_reviews and chars tables`);

    return client.query(`
      DROP TABLE IF EXISTS char_reviews;
    `)
  })
  .then(res => {
    return client.query(`
      DROP TABLE IF EXISTS chars;
    `)
  })
  .then(res => {
    console.log(`Successfully deleted both char_reviews and chars tables!`);
    console.log(`Close the connection now.`);
    client.end();
  })
  .catch(e => {
    console.log('Error in connecting/querying: ', e);
  });



