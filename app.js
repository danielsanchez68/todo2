const form = document.getElementById('task-form')
const input = document.getElementById('task-input')
const list = document.getElementById('tasks')
const counter = document.getElementById('counter')
const clearBtn = document.getElementById('clear-btn')

let tasks = JSON.parse(localStorage.getItem('todo_tasks') || '[]')

function saveTasks(){
  localStorage.setItem('todo_tasks', JSON.stringify(tasks))
}

function updateCounter(){
  const remaining = tasks.filter(t => !t.done).length
  counter.textContent = `${remaining} tarea${remaining===1?'':'s'}`
}

function render(){
  list.innerHTML = ''
  if(tasks.length===0){
    const el = document.createElement('li')
    el.className = 'task'
    el.textContent = 'No hay tareas. Añade una arriba.'
    list.appendChild(el)
    updateCounter()
    return
  }

  tasks.forEach(task => {
    const li = document.createElement('li')
    li.className = 'task'
    li.dataset.id = task.id

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = !!task.done
    checkbox.setAttribute('aria-label','Marcar tarea')

    const span = document.createElement('span')
    span.className = 'text' + (task.done? ' completed':'')
    span.textContent = task.text

    const del = document.createElement('button')
    del.className = 'btn-delete'
    del.textContent = 'Eliminar'
    del.setAttribute('aria-label','Eliminar tarea')

    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked
      saveTasks(); render()
    })

    del.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id)
      saveTasks(); render()
    })

    li.appendChild(checkbox)
    li.appendChild(span)
    li.appendChild(del)
    list.appendChild(li)
  })

  updateCounter()
}

form.addEventListener('submit', e => {
  e.preventDefault()
  const text = input.value.trim()
  if(!text) {
    input.style.outline = '2px solid #fca5a5'
    setTimeout(()=> input.style.outline = '', 800)
    return
  }
  tasks.push({ id: Date.now(), text, done: false })
  input.value = ''
  saveTasks(); render()
})

clearBtn.addEventListener('click', ()=>{
  if(!tasks.length) return
  if(!confirm('¿Vaciar todas las tareas?')) return
  tasks = []
  saveTasks(); render()
})

// initial render
render()
