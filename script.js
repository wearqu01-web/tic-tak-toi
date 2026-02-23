const nameInput   = document.querySelector('#name');
const priceInput  = document.querySelector('#price');
const amountInput = document.querySelector('#amount');
const addBtn      = document.querySelector('#add');
const table       = document.querySelector('#table');
const totalSpan   = document.querySelector('#total');

function createCell(tr, value, className) {
  const td = document.createElement('td');
  td.textContent = value;
  td.classList.add(className);

  if (className === 'name' || className === 'price' || className === 'amount') {
    td.classList.add('editable');
    td.title = 'Двойной клик → редактировать';
  }
  
  tr.appendChild(td);
  return td;
}

function recountTotal() {
  let sum = 0;
  table.querySelectorAll('tbody .cost').forEach(td => {
    sum += Number(td.textContent) || 0;
  });
  totalSpan.textContent = sum.toFixed(2).replace(/\.?0+$/, '');
}

function startEditing(td) {
  if (td.classList.contains('editing')) return;

  const oldValue = td.textContent.trim();
  const input = document.createElement('input');
  input.type = (td.classList.contains('price') || td.classList.contains('amount'))
    ? 'number'
    : 'text';
  input.value = oldValue;
  input.style.width = '100%';
  input.style.boxSizing = 'border-box';
  input.style.padding = '4px';
  input.style.font = 'inherit';
  input.style.textAlign = 'center';

  td.textContent = '';
  td.appendChild(input);
  td.classList.add('editing');
  input.focus();
  input.select();

  function finishEditing() {
    let newValue = input.value.trim();
    
    if (td.classList.contains('price') || td.classList.contains('amount')) {
      newValue = Number(newValue);
      if (isNaN(newValue) || newValue < 0) newValue = oldValue;
      newValue = newValue.toString();
    }

    td.textContent = newValue;
    td.classList.remove('editing');

    if (td.parentElement) {
      const tr = td.parentElement;
      const price  = Number(tr.querySelector('.price')?.textContent)  || 0;
      const amount = Number(tr.querySelector('.amount')?.textContent) || 0;
      const costTd = tr.querySelector('.cost');
      if (costTd) {
        costTd.textContent = (price * amount).toFixed(2).replace(/\.?0+$/, '');
      }
    }

    recountTotal();
  }

  input.addEventListener('blur', finishEditing);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEditing();
    }
    if (e.key === 'Escape') {
      td.textContent = oldValue;
      td.classList.remove('editing');
    }
  });
}

addBtn.addEventListener('click', () => {
  const name   = nameInput.value.trim();
  const price  = Number(priceInput.value);
  const amount = Number(amountInput.value);

  if (!name || isNaN(price) || price <= 0 || isNaN(amount) || amount <= 0) {
    alert('Заполните все поля корректно');
    return;
  }

  const tr = document.createElement('tr');

  createCell(tr, name,   'name');
  createCell(tr, price,  'price');
  createCell(tr, amount, 'amount');
  createCell(tr, (price * amount).toFixed(2).replace(/\.?0+$/, ''), 'cost');

  const removeTd = createCell(tr, 'удалить', 'remove');
  removeTd.addEventListener('click', () => {
    tr.remove();
    recountTotal();
  });

  table.tBodies[0].appendChild(tr);
  recountTotal();

  nameInput.value = '';
  priceInput.value = '';
  amountInput.value = '';
  nameInput.focus();
});

table.addEventListener('dblclick', e => {
  const td = e.target.closest('td.editable');
  if (td) {
    startEditing(td);
  }
});