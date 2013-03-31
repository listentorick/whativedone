exports.index = function(req, res){
  res.render('index', { title: 'Home', brand: 'Kockout.js Tutorials' });
};
