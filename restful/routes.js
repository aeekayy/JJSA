var Types = require('hapi').Types;

module.exports = [
	{ method: 'GET', path: '/accounts', config: { handler: getAccounts, query: { name: Types.String() } } },
	{ method: 'GET', path: '/accounts/{id}', config: { handler: getAccount } },
	{ method: 'GET', path: '/roles', config: { handler: getRoles, query: { name: Types.String() } } },
	{ method: 'GET', path: '/roles/{id}', config: { handler: getRole } },
	{ method: 'POST', path: '/roles', config: { handler: addRole, payload: 'parse', schema: { name: Types.String().required().min(3) }, response: { id: Types.Number().required() } } }
];

function getAccounts(request) {
	if (request.query.name) {
		request.reply(findAccounts(request.query.name));
	} else {
		request.reply(accounts);
	}
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
	if (request.query.name) {
		request.reply(findRoles(request.query.name));
	} else {
		request.reply(roles);
	}
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
