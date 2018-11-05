module.exports = {
	development: {
		db: 'mongodb://admin:pass@mongo:27017/graphql?authSource=admin',
		app: {
			name: 'graphql'
		}
	},
	production: {
		db: 'mongodb://admin:pass@mongo:27017/graphql?authSource=admin',
		  app: {
            name: 'graphql'
        }
	}
}