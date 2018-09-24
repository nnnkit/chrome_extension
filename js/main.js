import quotes from './quotes.js';


const getUserName = document.querySelector('.prompt');
var userName = JSON.parse(localStorage.getItem('userInfo')) || '';
const prompt = document.querySelector('.prompt');
var collectionId = "1047054";
var settingImg = document.querySelector('.setting')


function addUserInfo(e){
  if(e.keyCode == 13 && e.code == "Enter"){
    var name = {name: e.target.value};
    localStorage.setItem('userInfo', JSON.stringify(name));
    userName = JSON.parse(localStorage.getItem('userInfo'));
    updateInfo();
  }
}
getUserName.addEventListener('keypress', addUserInfo);


function updateInfo() {
  prompt.innerHTML = '';
  showTimeAndGreeting()
}

if(userName.name) {
  prompt.innerHTML = '';
}

function pad2(number) {
  return (number < 10 ? '0' : '') + number;
}

function showGreeting(hours) {
  var greeting;
  if(hours < 12) return greeting = 'Good Morning';
  if(hours >= 12) return greeting = 'Good Afternoon';
}

function showTimeAndGreeting() {
  var d = new Date();
  var hours = pad2(d.getHours());
  var min = pad2(d.getMinutes());
  var time = `${hours}:${min}`
  var greeting = showGreeting(hours) + ' ' + (userName.name ? userName.name : '');
  document.querySelector('.greeting').innerHTML = greeting;
  document.querySelector('.clock').innerHTML = time;
}

setInterval(showTimeAndGreeting, 1000);

function showRandomQuote(){
  var quotesTag = document.querySelector('.quotes');
  var authorTag = document.querySelector('.author');
  var randomIndex = Math.floor(Math.random()* quotes.length);
  var quoteText = `"${quotes[randomIndex].quote}"`;
  var quoteAuthor = `${quotes[randomIndex].author}`;
  quotesTag.innerHTML = quoteText;
  authorTag.innerHTML = quoteAuthor;
}

showRandomQuote();
setInterval(showRandomQuote, 10000);


//todo list

const addTodo = document.querySelector('.add-todo');
const showTodo = document.querySelector('.show-todo');
const todoItems = JSON.parse(localStorage.getItem('todoLists')) || [];

function addTodoItem(e) {
  console.log(e)
  e.preventDefault();
  const text = (document.querySelector('[name=todoText]')).value;
  const todoItem = {
    text: text,
    done: false
  }
  todoItems.push(todoItem);
  populateLists(todoItems, showTodo);
  localStorage.setItem('todoLists', JSON.stringify(todoItems));
  addTodo.reset();
}

function populateLists(todos = [], todoLists){
  todoLists.innerHTML = todos.map(function(item,i){
    return `
      <li>
        <input type="checkbox" data-index=${i} id="item${i}" ${item.done ? 'checked' : ''} />
        ${
          showTodo.classList.contains('editmode') ?
          `<input type="text" data-index=${i} value=${item.text} />`
          :
          `<label for="item${i}"><span>${item.text}</span></label>`
        }
        
        <span data-index=${i} class="edit">✏️</span>
        <span data-index=${i} class="remove">❌</span>
      </li>
    `;
  }).join('');
}

function toggleDone(e) {
  if(e.target.tagName !== 'input' && e.target.type !== 'checkbox') return;
  const el  = e.target;
  const index = el.dataset.index;
  todoItems[index].done = !todoItems[index].done;
  localStorage.setItem('todoLists', JSON.stringify(todoItems));
  populateLists(todoItems, showTodo);
}

function deleteTodo(e) {
  if(e.target.className !== 'remove') return;
  const el = e.target;
  const index = el.dataset.index;
  todoItems.splice(index,1);
  localStorage.setItem('todoLists', JSON.stringify(todoItems));
  populateLists(todoItems, showTodo);
}

function updateEditedName(e){
  if(e.keyCode === 13){
    let id = e.target.dataset.index;
    var editInputElm = document.querySelector('.editmode');
    todoItems[id].text = e.target.value;
    localStorage.setItem('todoLists', JSON.stringify(todoItems));
    editInputElm.classList.remove('editmode');
    populateLists(todoItems, showTodo);
  }
}

function editTodo(e) {
  if(e.target.className !== 'edit') return;
  showTodo.classList.add('editmode');
  var editInputElm = document.querySelector('.editmode');
  editInputElm.addEventListener('keydown', updateEditedName);
  populateLists(todoItems, showTodo);
}

function fetchBackground() {
  const baseURL = `https://api.unsplash.com/photos/random?client_id=YOUR_ACCESS_KEY`;
  const accesToken = "?client_id=12f3e03998534cb395d67570692b1ea866712ca052c0188109c880ba535565b1";
  var uri = baseURL + accesToken;
  fetch(uri)
  .then(function(response) {
    return response.json();
  })
  .then(function(images) {
    var i = 0;
    document.body.style.backgroundImage = `url(${images.urls.regular})`;
    setInterval(function() {
      document.body.style.backgroundImage = `url(${images.urls.regular})`;
      i = i + 1;
      if (i == images.length) {
        i =  0;
      }
    }, 100000);
  });
}

fetchBackground();

function showSetting() {
  console.log('called')
  settingImg.innerHTML = `<p class="change-bg">Change background</p><input class="bg-input" />`;
}

settingImg.addEventListener('click', showSetting);
addTodo.addEventListener('submit', addTodoItem);
showTodo.addEventListener('click', toggleDone);
showTodo.addEventListener('click', deleteTodo);
showTodo.addEventListener('click', editTodo);

populateLists(todoItems, showTodo);

