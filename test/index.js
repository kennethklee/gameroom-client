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

        setTimeout(function() {
            client.login.should.not.be.empty;
            gameroom.sockets.connected.should.have.property(client.login);
            done();
        }, 100);
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

    it('should join an existing room', function(done) {
        var server = new Server(),
            gameroom = new Gameroom(server, mockOptions);
            roomName = uid();

        var io1 = connectSocket(server, { multiplex: false }),
            io2 = connectSocket(server, { multiplex: false }),
            client1 = new Client(io1),
            client2 = new Client(io2);

        client1.room.create(roomName, function(err, room) {
            room.name.should.equal(roomName);

            client2.room.join(roomName, function(err, room) {
                room.name.should.equal(roomName);

                redis.smembers(keyJoin('rooms', room.name, 'sockets'), function(err, sockets) {
                    sockets.length.should.equal(2);
                    done();
                });
            });
        });
    });

});