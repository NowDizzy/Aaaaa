const chalk = require('chalk');
const moment = require('moment');


module.exports = client => {
var oyun = [
        `Zivre Of Graphics`
    ];

    setInterval(function() {

        var random = Math.floor(Math.random()*(oyun.length-0+1)+0);

        client.user.setActivity(oyun[random], "" );
        }, 2 * 9000 );
  
  client.user.setStatus("dnd");
}; 