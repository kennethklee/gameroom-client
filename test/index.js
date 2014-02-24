var should = require('should'),
    redis = require('node-redis-mock').createClient(),
    Server = require('http').Server,
    Gameroom = require('gameroom'),
    io = require('socket.io-client'),
    Client = require('..');

var connectSocket = function(server, opts) {
    var addr = server.address() || server.listen().address();

    return io('ws://' + addr.address + ':' + addr.port, opts);
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

});