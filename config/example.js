
var configuration = {
	sender: {
		service: "Gmail",
		auth: {
			user: "user@gmail.com",
			pass: "password"
		}
	},
	reader: {
	  user: 'user@gmail.com',
      password: 'password',
      host: 'imap.gmail.com',
      port: 993,
      secure: true
	},
	database: "mongodb://localhost/whatidone_example"
};

module.exports = configuration;	  
	  