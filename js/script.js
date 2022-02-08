let allTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
let valueOfTextbox = '';
const serverAdress = 'http://localhost:8000/';
let textbox = null;

window.onload =  async () => {
  textbox = document.getElementById('textbox')
  textbox.addEventListener('change', updateValue);
  const resp = await fetch(`${serverAdress}allTasks`, {
    method: 'GET'
  });
  const result = await resp.json();
  allTasks = result.data;
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
  render();
}
const onButtonClick = async () => {
  if(textbox.value !== ''){
    const resp = await fetch(`${serverAdress}createTask`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json;charset=utf-8',
        'Acces-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        text: valueOfTextbox,
        isCheck: false
      })
    });
    const result = await resp.json();
    allTasks = result.data;
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    render();
  };
};

const render = () => {
  const content = document.getElementById('content') ;
  while(content.firstChild){
    content.removeChild(content.firstChild);
  }
  allTasks
  .sort((a,b) => {
    if (a.isCheck === b.isCheck) return 0;
    return (a.isCheck > b.isCheck ? 1 : -1);
  })
  .map((element, index) => {
    const wrap = document.createElement('div');
    wrap.id = `wrap-${index}`;
    wrap.className = 'wrap';
    const text = document.createElement('p');
    text.className = 'task-name';
    text.innerText = element.text;
    wrap.appendChild(text);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.id = `checkbox-${index}`;
    checkbox.checked = element.isCheck;
    wrap.appendChild(checkbox);
    checkbox.onclick = () =>{
      onChangeCheckbox(item);
    } 
    const label = document.createElement('label');
    label.htmlFor = `checkbox-${index}`;
    label.className = 'task-label';
    wrap.appendChild(label);
    const deleteTask = document.createElement('i');
    deleteTask.className = 'fas imgbut fa-eraser';
    wrap.appendChild(deleteTask);
    deleteTask.onclick = () => {
      onDeleteClick(element.id);
    }
    const editTask = document.createElement('i');
    editTask.className = 'fas imgbut fa-pen';
    if(!checkbox.checked){
      wrap.appendChild(editTask);
    }
    checkbox.onchange = () => {
      if(checkbox.checked){
        wrap.removeChild(editTask);
      } else {
        wrap.appendChild(editTask);
      }
    }
    editTask.onclick = () => {
      if(!checkbox.checked) {
        wrap.removeChild(editTask);
        wrap.removeChild(deleteTask);
        wrap.removeChild(text);
        wrap.removeChild(checkbox);
        wrap.removeChild(label);
        onEditClick(wrap, index, element.id);
      }
    }
    content.appendChild(wrap);
  })
}
const onEditClick = (wrap, index, id) => {
  const editTextbox = document.createElement('input'); 
  editTextbox.value = allTasks[index].text;  
  editTextbox.className = `edit-input`;
  editTextbox.type = 'text';
  const editApply = document.createElement('button');
  editApply.className = `edit-button`;
  editApply.innerText = 'done';
  wrap.appendChild(editTextbox);
  wrap.appendChild(editApply);
  editApply.onclick = () => {
    if(editTextbox.value !== '')
    onEditApplyClick(editTextbox.value, id);
  }
}
const onEditApplyClick = async (value, id) => {
  const resp = await fetch(`${serverAdress}updateTask` , {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json;charset=utf-8',
      'Acces-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      id: id,
      text: value
    })
  });
  const result = await resp.json();
  allTasks = result.data;
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
  render();
}
const onDeleteClick = async (id) => {
  const resp = await fetch(`${serverAdress}deleteTask?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json;charset=utf-8',
      'Acces-Control-Allow-Origin': '*'
    }
  });
  const result = await resp.json();
  allTasks = result.data;
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
  render();
};
const updateValue = (event) => {
 valueOfTextbox = event.target.value;
};
const onChangeCheckbox = async (item) => {
  const {id, isCheck} = item;
  const resp = await fetch(`${serverAdress}updateTask` , {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json;charset=utf-8',
      'Acces-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      id: id,
      isCheck: !isCheck
    })
  });
  const result = await resp.json();
  allTasks = result.data;
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
  render();
};
