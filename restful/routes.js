var Types = require('hapi').Types;
var pg = require('pg');
var inflection = require('inflection');
//var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/jjsa';
var connectionString = 'postgres://localhost:5432/jjsa';
var client = new pg.Client(connectionString);

module.exports = [
	{ 
		method: 'GET', 
		path: '/api/v1/accounts', 
		config: { 
			handler: getAccounts, 
			query: { name: Types.String() } 
		} 
	},
	{ 
		method: 'GET', 
		path: '/api/v1/accounts/{id}', 
		config: { handler: getAccount } 
	},
	{ 
		method: 'GET', 
		path: '/api/v1/roles', 
		config: { 
			handler: getRoles, 
			query: { name: Types.String() } 
		} 
	},
	{ 
		method: 'GET', 
		path: '/api/v1/roles/{id}', 
		config: { handler: getRole } 
	},
	{ 
		method: 'POST', 
		path: '/api/v1/roles', 
		config: { 
			handler: addRole, 
			payload: 'parse', 
			schema: { name: Types.String().required().min(3) }, 
			response: { id: Types.Number().required() } 
		} 
	}
];

function getAllRows(className) {
	var tblname = inflection.plularize(className.toLowerCase());
	var results = [];
	var queryStr = "SELECT * FROM " + tblname + " ORDER BY " + className.toLowerCase() + "_id ASC;";

	/*pg.connect(connectionString, function(err, client, done) {
		var query = client.query(queryStr);

		query.on('row', function(row) {
			results.push(row);
		});

		query.on('end', function() {
			client.end();
		});

		if(err) {
			console.log(err);
		}
	}*/
}

function getAccounts(request) {
	var results = [];
	
	pg.connect(connectionString, function(err, client, done) {
		if(request.query.name) {
			var query = client.query("SELECT * FROM accounts WHERE username=$1 ORDER BY account_id ASC;", [request.query.name]);
		} else {
			var query = client.query("SELECT * FROM accounts ORDER BY account_id ASC;");
		}

		query.on('row', function(row) {
			results.push(row); 
		});

		query.on('end', function() {
			client.end();
			request.reply(results);
		});

		// Handle Errors
		if(err) {
			console.log(err);
		}
	});
}

function findAccounts(name) {
	return accounts.filter(function(account) {
		return account.name.toLowerCase() === name.toLowerCase(); 
	});
}

function getAccount(request) {
	var account = accounts.filter(function(p) {
		return p.id == request.params.id;
	}).pop();

	request.reply(account);
}

function getRoles(request) {
	var results = [];
	
	pg.connect(connectionString, function(err, client, done) {
		if(request.query.name) {
			var query = client.query("SELECT * FROM roles WHERE role_name=$1 ORDER BY role_id ASC;", [request.query.name]);
		} else {
			var query = client.query("SELECT * FROM roles ORDER BY role_id ASC;");
		}

		query.on('row', function(row) {
			results.push(row); 
		});

		query.on('end', function() {
			client.end();
			request.reply(results);
		});

		// Handle Errors
		if(err) {
			console.log(err);
		}
	});
}

function findRoles(name) {
	return roles.filter(function(role) {
		return roles.name.toLowerCase() === name.toLowerCase(); 
	});
}

function getRole(request) {
	var role = roles.filter(function(p) {
		return p.id == request.params.id; 
	}).pop();
	
	request.reply(role); 
}

function addRole(request) {
	var role = { 
		id: roles[roles.length - 1].id + 1, 
		name: request.payload.name
	};

	roles.push(role);

	request.reply.created('/roles/' + role.id) ({
		id: role
	}); 
}

var accounts = [{
	id: 1, 
	name: 'AK Nwede',
	username: 'aeekay',
	gender: true, 
	emailaddr: 'admin@aeekay.com',
	confirmed: '2015-06-01 17:45:14'
	}, 
	{
	id: 2, 
	name: 'Test User', 
	username: 'testuser', 
	gender: false,
	emailaddr: 'test@aeekay.com',
	confirmed: '2015-06-01 21:31:23'
	}
];

var roles = [{
	id: 1,
	name: 'Administrator'
	},
	{
	id: 2,
	name: 'User'
	}
];
