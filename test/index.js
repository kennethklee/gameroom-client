var should = require('should'),
    uid = require('uid'),
    redis = require('node-redis-mock').createClient(),
    Server = require('http').Server,
    Gameroom = require('gameroom'),
    io = require('socket.io-client'),
    Client = require('..');

var connectSocket = function(server, opts) {
    var addr = server.address() || server.listen().address();

    return io('ws://' + addr.address + ':' + addr.port, opts);
};

var keyJoin = function() {
    return Array.prototype.slice.call(arguments, 0).join(':');
};

var mockOptions = {
    pub: redis,
    sub: redis,
    cmd: redis
};

describe('Gameroom Client', function() {

    it('should register login identity', function(done) {
        var server = new Server(),
            gameroom = new Gameroom(server, mockOptions);

        var io = connectSocket(server),
            client = new Client(io);

        client.on('login', function(id) {
            this.login.should.not.be.empty;
            gameroom.sockets.connected.should.have.property(this.login);
            done();
        });
    });

    it('should create a new room', function(done) {
        var server = new Server(),
            gameroom = new Gameroom(server, mockOptions),
            roomName = uid();

        var io = connectSocket(server),
            client = new Client(io);

        client.room.create(roomName, function(err, room) {
            room.name.should.equal(roomName);
            room.players.length.should.equal(1);
            room.players[0].should.equal(client.login);

            redis.smembers(keyJoin('sockets', client.login, 'rooms'), function(err, rooms) {
                rooms.length.should.equal(1);
                done();
            });
        });
    });

    it('should emit join event on player join', function(done) {
        var server = new Server(),
            gameroom = new Gameroom(server, mockOptions),
            roomName = uid();

        var io1 = connectSocket(server, { multiplex: false }),
            io2 = connectSocket(server, { multiplex: false }),
            client1 = new Client(io1),
            client2 = new Client(io2);

        client1.room.create(roomName, function(err, hostRoom) {
            hostRoom.name.should.equal(roomName);

            hostRoom.on('join', function(player) {
                player.should.equal(client2.login);
                done();
            });

            client2.room.join(roomName, function() {});
        });
    });

    it('should join an existing room and update player list', function(done) {
        var server = new Server(),
            gameroom = new Gameroom(server, mockOptions),
            roomName = uid();

        var io1 = connectSocket(server, { multiplex: false }),
            io2 = connectSocket(server, { multiplex: false }),
            client1 = new Client(io1),
            client2 = new Client(io2);

        client1.room.create(roomName, function(err, hostRoom) {
            hostRoom.name.should.equal(roomName);

            client2.room.join(roomName, function(err, room) {
                room.name.should.equal(roomName);

                redis.smembers(keyJoin('rooms', room.name, 'sockets'), function(err, sockets) {
                    sockets.length.should.equal(2);

                    setTimeout(function() {
                        hostRoom.players.length.should.equal(2);
                        done();
                    }, 50);
                });
            });
        });
    });

    it('should update player list on room leave');
    it('should message a room', function(done) {
        var server = new Server(),
            gameroom = new Gameroom(server, mockOptions),
            roomName = uid();

        var io1 = connectSocket(server, { multiplex: false }),
            io2 = connectSocket(server, { multiplex: false }),
            client1 = new Client(io1),
            client2 = new Client(io2);

        client1.room.create(roomName, function(err, hostRoom) {
            hostRoom.name.should.equal(roomName);

            hostRoom.on('message', function(data) {
                data.should.have.property('player').and.equal(client2.login);
                data.should.have.property('message').and.equal('a message');
                done();
            });

            client2.room.join(roomName, function(err, room) {
                room.say('a message');
            });

        });
    });

    it('should message a player', function(done) {
        var server = new Server(),
            gameroom = new Gameroom(server, mockOptions),
            roomName = uid();

        var io1 = connectSocket(server, { multiplex: false }),
            io2 = connectSocket(server, { multiplex: false }),
            client1 = new Client(io1),
            client2 = new Client(io2);

        client2.on('message', function(data) {
            data.should.have.property('player').and.equal(client1.login);
            data.should.have.property('message').and.equal('a message');
            done();
        });

        setTimeout(function() {
            client1.player.say(client2.login, 'a message', function() {});
        }, 50);
    });

});