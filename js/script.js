let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueOfTextbox = '';
let textbox = null;

window.onload =  async () => {
  textbox = document.getElementById('textbox')
  textbox.addEventListener('change', updateValue);
  const resp = await fetch("http://localhost:8000/allTasks" , {
    method: "GET"
  })
  let result = await resp.json();
  tasks = result.data;
  render();

}

onButtonClick = async () => {
  
  if(textbox.value !== ''){
    const resp = await fetch("http://localhost:8000/createTask" , {
      method: "POST",
      headers: {
        'Content-type': 'application/json;charset=utf-8',
        'Acces-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        text: valueOfTextbox,
        isCheck: false
      })
    })
   
    let result = await resp.json();
    tasks = result.data;
    render();
  }
}

render = () => {
  const content = document.getElementById('content') ;

  while(content.firstChild){
    content.removeChild(content.firstChild);
  }
  tasks.sort((a,b) => {
    if (a.isCheck === b.isCheck) return 0;
    return (a.isCheck > b.isCheck ? 1 : -1);
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
    checkbox.checked = element.isCheck;
    wrap.appendChild(checkbox);
    checkbox.onclick = () =>{
      onChangeCheckbox(element.id, element.isCheck);
    } 
    const label = document.createElement('label');

    label.htmlFor = `checkbox_${index}`;
    label.className = 'task_label';
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
          
        
        onEditClick(wrap,index, element.id);
      }
    }
    content.appendChild(wrap);
  })
}

onEditClick = (wrap, index, id) => {
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
    if(editTextbox.value !== '')
    onEditApplyClick(editTextbox.value, id);
  }
}
onEditApplyClick = async (value, id) => {
  const resp = await fetch("http://localhost:8000/updateTask" , {
      method: "PATCH",
      headers: {
        'Content-type': 'application/json;charset=utf-8',
        'Acces-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        id: id,
        text: value
        
      })
    })
    let result = await resp.json();
    tasks = result.data;
    render();
}
onDeleteClick = async (id) => {

  const resp = await fetch(`http://localhost:8000/deleteTask?id=${id}` , {
    method: "DELETE",
    headers: {
      'Content-type': 'application/json;charset=utf-8',
      'Acces-Control-Allow-Origin': '*'
    }
  })
  let result = await resp.json();
  tasks = result.data;
  render();
}

updateValue = (event) => {
 valueOfTextbox = event.target.value;
}

onChangeCheckbox = async (id, isCheck) => {
  const resp = await fetch("http://localhost:8000/updateTask" , {
      method: "PATCH",
      headers: {
        'Content-type': 'application/json;charset=utf-8',
        'Acces-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        id: id,
        isCheck: !isCheck
        
      })
    })
    let result = await resp.json();
    tasks = result.data;
    render();
}
