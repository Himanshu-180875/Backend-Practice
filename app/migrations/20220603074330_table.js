/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user', table=>{
          table.increments('id');
          table.string('email', 100).notNullable();
          table.string('password', 100).notNullable();
          table.timestamp('createdOn').defaultTo(knex.fn.now())
        })
        .createTable('posts',table=>{
          table.increments('id');
          table.integer('user_id').notNullable();
          table.string('message', 200).notNullable();
          table.string('password', 200).notNullable();
          table.string('iv', 200).notNullable();
          table.timestamp('createdOn').defaultTo(knex.fn.now())
        })
        .createTable('request_logs',table=>{
          table.string('id', 100);
          table.string('request_email', 200);
          table.string('request_url', 200).notNullable();
          table.string('request_method', 200).notNullable();
          table.timestamp('createdOn').defaultTo(knex.fn.now())
        })
        .createTable('response_logs',table=>{
          table.string('id', 100);
          table.string('response_status', 200).notNullable();
          table.string('response_message', 200).notNullable();
          table.timestamp('createdOn').defaultTo(knex.fn.now())
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
return knex.schema.dropTable('posts').dropTable('user').dropTable('response_logs').dropTable('request_logs');

  
};
