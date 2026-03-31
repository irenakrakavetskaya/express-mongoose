exports.getLogin = (req, res, next) => {
  const cookieHeader = req.get('Cookie') || '';

  const cookies = cookieHeader
    .split(';')
    .map(c => c.trim())
    .filter(Boolean);

  const loggedInCookie = cookies.find(c => c.startsWith('loggedIn='));
  const isLoggedIn = loggedInCookie
    ? loggedInCookie.split('=')[1] === 'true'
    : false;

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true');
  res.redirect('/');
};