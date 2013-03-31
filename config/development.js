
var configuration = {
	sender: {
		service: "Gmail",
		auth: {
			user: "WhatIDidToday2013@gmail.com",
			pass: "ILoveBear2013"
		}
	},
	reader: {
	  user: 'WhatIDidToday2013@gmail.com',
      password: 'ILoveBear2013',
      host: 'imap.gmail.com',
      port: 993,
      secure: true
	},
	//database: "mongodb://localhost/whatidone_dev"//,
	database: "mongodb://heroku:transparent@linus.mongohq.com:10040/app14300091"
};

module.exports = configuration;	  
	  