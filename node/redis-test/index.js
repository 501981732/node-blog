const redis = require("redis"),
      client = redis.createClient(6379,'127.0.0.1');

client.on('error', function(err) {
    console.log('Error: ', err)
})

client.set("mylove", "wx", redis.print);

client.get("mylove", function(err, reply) {
    if (err) {
        console.error(err)
    } 
    console.log('val ', reply)
})