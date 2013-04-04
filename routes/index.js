
/*
 * GET home page.
 */

exports.index = function(req, res){
   var ua = req.header('user-agent');

    if(/mobile/i.test(ua)) {
        res.render('mobile', { title: 'Desktop' });
    } else {
        res.render('index', { title: 'Desktop' });
    }
    
  res.render('index', { title: 'Desktop' });
};