
//Нужно для нормальной работы в докере
function configureShutdown(server = null) {

    process.on('SIGINT', function onSigint() {
        console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
        shutdown();
    });

    process.on('SIGTERM', function onSigterm() {
        console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
        shutdown();
    })

    function shutdown() {
        if (server) {
            server.close(function onServerClosed(err) {
                if (err) {
                    console.error(err);
                    process.exitCode = 1;
                }
                process.exit();
            })
        } else {
            process.exit()
        }
    }
}

module.exports = configureShutdown
