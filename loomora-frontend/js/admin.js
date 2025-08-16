async function loadList(){
  const data = await apiGet('/products') || [];
  const list = document.getElementById('admin-list'); list.innerHTML='';
  data.forEach(p=>{
    list.insertAdjacentHTML('beforeend', `
      <div class="row">
        <div style="display:flex;gap:10px;align-items:center">
          <img src="${p.image}" style="width:60px;height:60px;object-fit:cover;border-radius:8px">
          <div><strong>${p.name}</strong><div class="muted">₹${p.price} • stock ${p.countInStock}</div></div>
        </div>
        <div>
          <button onclick='edit(${JSON.stringify(p).replace(/'/g,"&apos;")})'>Edit</button>
          <button onclick='del("${p._id}")'>Delete</button>
        </div>
      </div>
    `);
  });
}

function edit(p){
  document.getElementById('pid').value = p._id || '';
  document.getElementById('pname').value = p.name || '';
  document.getElementById('pimage').value = p.image || '';
  document.getElementById('pprice').value = p.price || 0;
  document.getElementById('pstock').value = p.countInStock || 0;
  document.getElementById('pdesc').value = p.description || '';
  window.scrollTo({top:0, behavior:'smooth'});
}

async function del(id){
  if(!confirm('Delete product?')) return;
  const res = await apiAuthed('DELETE', '/products/'+id);
  if(res?.message || res?._id || res?.acknowledged){ loadList(); } else alert('Delete failed');
}

window.addEventListener('DOMContentLoaded', ()=>{
  updateNavAuth(); updateCartCount();
  const u = user();
  if(!u || !u.isAdmin){ alert('Admin only'); location.href='login.html'; return; }

  document.getElementById('prod-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const body = {
      name: document.getElementById('pname').value.trim(),
      image: document.getElementById('pimage').value.trim(),
      price: Number(document.getElementById('pprice').value),
      countInStock: Number(document.getElementById('pstock').value),
      description: document.getElementById('pdesc').value.trim()
    };
    const id = document.getElementById('pid').value;
    const res = id
      ? await apiAuthed('PUT', '/products/'+id, body)
      : await apiAuthed('POST','/products', body);

    if(res?._id){ alert('Saved'); (document.getElementById('prod-form')).reset(); document.getElementById('pid').value=''; loadList(); }
    else alert(res?.message || 'Save failed');
  });

  loadList();
});
