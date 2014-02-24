exports.identity = function(id) {
    this.login = id;

    //room.emit('login', id);
};

exports.join = function(data) {
    if (this.rooms[data.game]) {
        var room = this.rooms[data.game];

        room.players.push(data.player);
        //room.emit('join', data.player);
    }
};

exports.left = function(id) {
};

exports.message = function(id) {
};