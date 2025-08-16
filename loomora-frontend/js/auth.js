function updateNavAuth(){
  const nav = document.getElementById('nav-auth');
  if(!nav) return;
  const u = user();
  if(u){
    nav.innerHTML = `
      <span class="muted">Hi, ${u.name}</span>
      ${u.isAdmin ? ` • <a href="admin.html">Admin</a>`:''}
      • <a href="#" id="logout-link">Logout</a>
    `;
    setTimeout(()=>{
      const l = document.getElementById('logout-link');
      l && l.addEventListener('click', (e)=>{
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        location.href = 'index.html';
      });
    },0);
  }else{
    nav.innerHTML = `<a href="login.html">Login</a> / <a href="register.html">Signup</a>`;
  }
  updateCartCount();
}

// handle login/register forms
document.addEventListener('DOMContentLoaded', ()=>{
  updateNavAuth();

  const lf = document.getElementById('login-form');
  if(lf){
    lf.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const data = await apiAuth('/auth/login', { email, password });
      if(data?.token){
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        location.href = 'shop.html';
      }else alert(data?.message || 'Login failed');
    });
  }

  const rf = document.getElementById('register-form');
  if(rf){
    rf.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const data = await apiAuth('/auth/register', { name, email, password });
      if(data?.token){
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        location.href = 'shop.html';
      }else alert(data?.message || 'Signup failed');
    });
  }
});
