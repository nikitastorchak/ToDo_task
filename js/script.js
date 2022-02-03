const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueOfTextbox = '';
let textbox = null;

window.onload = function init () {
  textbox = document.getElementById('textbox')
  textbox.addEventListener('change', updateValue);
  render();

}

onButtonClick = () => {
  if(textbox.value !== ''){
    tasks.push({
      text: valueOfTextbox,
      check: false
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    valueOfTextbox = '';
    textbox.value = '';

    render();
  }
}

render = () => {
  const content = document.getElementById('content') ;

  while(content.firstChild){
    content.removeChild(content.firstChild);
  }
  tasks.sort((a,b) => {
    if (a.check === b.check) return 0;
    return (a.check > b.check ? 1 : -1);
  })
  tasks.map((element, index) => {
    const wrap = document.createElement('div');

    wrap.id = `wrap_${index}`;
    wrap.className = 'wrap';
    const text = document.createElement('p');

    text.className = 'task_name';
    text.innerText = element.text;
    wrap.appendChild(text);
    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';
    checkbox.className = 'task_check';
    checkbox.id = `checkbox_${index}`;
    checkbox.checked = element.check;
    wrap.appendChild(checkbox);
    checkbox.onclick = () =>{
      onChangeCheckbox(index);
    } 
    const label = document.createElement('label');

    label.htmlFor = `checkbox_${index}`;
    label.className = 'task_label';
    wrap.appendChild(label);
    const deleteTask = document.createElement('i');

    deleteTask.className = 'fas imgbut fa-eraser';
    wrap.appendChild(deleteTask);
    deleteTask.onclick = () => {
      onDeleteClick(index);
    }
    const editTask = document.createElement('i');

    editTask.className = 'fas imgbut fa-pen';
    wrap.appendChild(editTask);
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
          
        
        onEditClick(wrap, index);
      }
    }
    content.appendChild(wrap);
  })
}

onEditClick = (wrap, index) => {
  const editTextbox = document.createElement('input'); 

  editTextbox.value = tasks[index].text;  
  editTextbox.className = `edit_input`;
  editTextbox.type = 'text';
  const editApply = document.createElement('button');

  editApply.className = `edit_button`;
  editApply.innerText = 'done';
  wrap.appendChild(editTextbox);
  wrap.appendChild(editApply);
  editApply.onclick = () => {
    tasks[index].text = editTextbox.value;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    render();
  }
}

onDeleteClick = (index) => {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  render();
}

updateValue = (event) => {
 valueOfTextbox = event.target.value;
}

onChangeCheckbox = (index) => {
  tasks[index].check = !tasks[index].check;
  localStorage.setItem('tasks', JSON.stringify(tasks));
}