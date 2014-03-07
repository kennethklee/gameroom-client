exports.identity = function(id) {
    this.login = id;

    this.emit('login');
};

exports.joined = function(data) {
    if (this._rooms[data.room]) {
        var room = this._rooms[data.room];

        room.players.push(data.player);
        room.emit('joined', data.player);
    }
};

exports.left = function(data) {
    if (this._rooms[data.room]) {
        var room = this._rooms[data.room];

        //room.players.push(data.player);
        room.players.splice(room.players.indexOf(data.player), 1);
        room.emit('left', data.player);
    }
};

exports.message = function(data) {
    if (data.room) {
        var room = this._rooms[data.room];

        room.emit('message', data);

    } else {
        this.emit('message', data);
    }
};