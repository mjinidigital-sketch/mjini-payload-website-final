const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URI });
c.connect()
  .then(() => c.query("SELECT id, populate_by FROM pages_blocks_pricing_block"))
  .then(r => console.table(r.rows))
  .then(() => c.end())
  .catch(err => { console.error(err); c.end(); });
