const Umzug = require('umzug');
const path = require('path');
const Sequelize = require('sequelize');

const migration = (sequelize) => {
    this.umzug = new Umzug({
        migrations: {
            path: path.join(process.cwd(), './src/testing/migrations/init'),
            params: [
            sequelize.getQueryInterface(),
            Sequelize,
            ],
        },
        storage: 'json',
    });

    this.migrate = () => {
        return this.umzug.up();
    }
    
    this.revert = () => {
        return this.umzug.down({ to: 0 });
    }

    this.sequelize = sequelize
    return this
}

module.exports = migration