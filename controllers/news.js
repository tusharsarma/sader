module.exports = function() {
	return {
		setRouting: function(router) {
			router.get('/latest-football-news', this.footballNews);
		},
		footballNews: function(req, res) {
			res.render('news/footballnews', { title: 'Sader - Latest News', user: req.user });
		},
	};
};
