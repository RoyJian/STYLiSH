function isLogin() {
  const token = localStorage.getItem('token');
  return !!token;
}
export default isLogin;
