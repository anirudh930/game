
/*
 * GET mobile listing.
 */

exports.display = function(req, res){
  res.render('mobile', { title: 'MOBILE' });
  //res.send("What's up?");
};