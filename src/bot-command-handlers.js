module.exports = {
    echo: function (args) {
        args.event.channel.send(args.message);
    },

    roll: function (args) {
        try {
            let messages = createRollMessages(args);
            args.event.channel.send(messages.join("\n"));
        } catch (e) {
            let errorId = guid();
            args.event.channel.send(
                "I had a problem figuring out what to do. Ask a mod to check the logs with this error ID: " + errorId
            );
            console.log("ERROR: " + errorId);
            console.log(e);
        }
    },
};

function createRollMessages(args){

    let messages = [];

    let separateDieRolls = []

    // create a default specification roll if nothing sent to us

    if (args.message.trim().length === 0) {
        separateDieRolls = ['1d6'];
    } else {
        separateDieRolls = args.message.split(/[ ,]+/); // split by comma or whitespace
    }

    // loop through all the separate dice rolls
    for (let i = 0; i < separateDieRolls.length; i++) {
    
        let spec = rollSpecification(separateDieRolls[i]);
        let rollResults = rollDice(spec['numDie'], spec['dieSize']);
        let message = rollResultMessage(spec, rollResults); 

        messages.push(message);
    }

    return messages;
}

function rollResultMessage(spec, rolls){
  
    let message = spec['desc'] + ': ';
    // create the result of the roll on one line
    // outcomes can be total, best, worst with possibility of modifier  
    // spec['desc'] is the roll we are creating 

    // display messages:
    // w2d10+1: 5, 7 -> worst: 5  modified: 6
    // 2d6: 2 + 5 = 7
    // 2d10-1: 5 + 8 = 13 modified: 12
    // b2d6: 2, 5 -> best: 5


    let total = rolls.reduce(function(tot, num) {
        return tot + num;
    });

    let best = Math.max.apply(null, rolls);
    let worst = Math.min.apply(null, rolls);
    let baseValue = 0;

    if (spec['prefix'] === 'w' || spec['prefix'] === 'b') {
        message = message + rolls.join(', ') + ' -> ';
        if (spec['prefix'] === 'b'){
            message = message + '  best: ' + best;
            baseValue = best;
        }
        else {
            message = message + '  worst: ' + worst;
            baseValue = worst;
        }
    }
    else {  // total is the default
        message = message + rolls.join (' + ') + ' = ' + total;
        baseValue = total;
    }
   
    // create modified value if required

    if (spec['modAmount'] > 0) {
        let modifier = Number(spec['modifier'] + spec['modAmount']);
        let modified = 0;
        modified = baseValue + modifier;

        if (modified < 0 ){
            modified = 0;
        }

        message = message + '  modified: ' + modified;
    }

    return message;

}


function rollSpecification(roll) {

    //create a specification of the dice roll

    //a default die roll spec 1d6 with no modifier and no worst/best option
    
    let spec = {
        "prefix": null,
        "numDie": 1,
        "dieSize": 6,
        "modifier": null,
        "modAmount": null,
        "desc": ""
    };

    // Pattern for getting a single roll information;
    // Default is 1d6
    // Can pick up a w or b as a prefix
    // can pick up or miss the first number(s) before  a "d" or "D" miss is default
    // can pick up or miss number(s) after a "d" or "D"  miss is default
    // can pick up a modifier + or - as well as the amount 0 through 9 
    
    let diePattern = /([wWbB])?(\d+)?[dD]+(\d+)?([+-])?(\d)?/;
    let rollInfo = [];

    // Create a default spec for just a blank roll
    
    if (roll !== '') {
       rollInfo = diePattern.exec(roll);
    }
   
    let normalize = function(spec, key, data, shouldLowCase){
        if (typeof data != 'undefined'){
            spec[key] = shouldLowCase ? data.toLowerCase() : data;
        }
    };
   
    if (rollInfo.length > 1 ) {
        normalize(spec, 'prefix', rollInfo[1], true);
        normalize(spec, 'numDie', rollInfo[2], false);
        normalize(spec, 'dieSize', rollInfo[3], false);
        normalize(spec, 'modifier', rollInfo[4], false);
        normalize(spec, 'modAmount', rollInfo[5], false);
    }


    // put the description of the roll together

    if (spec['prefix'] !== null) {
        spec['desc'] = spec['prefix'] + '[';
    }

    spec['desc'] = spec['desc'] + spec['numDie'] + 'd' + spec['dieSize'];

    if (spec['prefix'] !== null){
        spec['desc'] = spec['desc'] + ']';
    }

    if (spec['modAmount'] > 0 ) {
        spec['desc'] = spec['desc'] + spec['modifier'] + spec['modAmount'];
    }

    return spec;
}

function rollDice(numDie, dieSize) {
    // the number of dice to roll <numDie> that are of the same size <dieSize>
    
    let rolls = [];

    for (let j = 0; j < numDie; j++) {
        if (dieSize < 1) {
            rolls.push(0);
        } else if (dieSize < 2) {
            rolls.push(1);
        } else {
            let roll = Math.floor(Math.random() * dieSize) + 1;
            rolls.push(roll);
        }
    }
    return rolls;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}
