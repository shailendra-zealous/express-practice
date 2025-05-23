module.exports = {
    "development": {
        "database": "database_development",
        "dialect": "sqlite",
        "storage": "./database_development.sqlite"
    },
    "test": {
        "database": "database_test",
        "dialect": "sqlite",
        "storage": "./database_test.sqlite"
    },
    "production": {
        "database": "database_production",
        "dialect": "sqlite",
        "storage": "./database_production.sqlite"
    }
}