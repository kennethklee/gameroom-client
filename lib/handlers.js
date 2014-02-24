exports.identity = function(id) {
    this.login = id;

    this.emit('login');
};

exports.join = function(data) {
    if (this.rooms[data.game]) {
        var room = this.rooms[data.game];

        room.players.push(data.player);
        room.emit('join', data.player);
    }
};

exports.left = function(data) {
    console.log(data);
    if (this.rooms[data.game]) {
        var room = this.rooms[data.game];

        //room.players.push(data.player);
        room.players.splice(room.players.indexOf(data.player), 1);
        room.emit('left', data.player);
    }
};

exports.message = function(data) {
    if (data.room) {
        var room = this.rooms[data.room];

        room.emit('message', data);

    } else {
        this.emit('message', data);
    }
};