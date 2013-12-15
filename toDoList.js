function Todo(id, task, who, dueDate, coordValues, done) {
    this.id = id;
    this.task = task;
    this.who = who;
    this.dueDate = dueDate;
    this.coordValues = coordValues;
    this.done = done;
}
var coordValues = new Array();
var todos = new Array();

function init() {
       
    var submitButton = document.getElementById("submit");
    submitButton.onclick = geoLocate;

    getTodoItems();

    var searchButton = document.getElementById("searchButton");
    searchButton.onclick = searchText;
    
    var clearSearchButton = document.getElementById("clearSearchButton");
    clearSearchButton.onclick = clearResults;
    
    var clearMapButton = document.getElementById("clearMap");
    clearMapButton.onclick = clearMap;	

}
function addTodoToPage(todoItem) {
	var ul = document.getElementById("todoList");
	var li = createNewTodo(todoItem);
	ul.appendChild(li);
	document.forms.add.reset();
}
function addTodosToPage() {
	var ul = document.getElementById("todoList");
	var listFragment = document.createDocumentFragment();
	for (var i = 0; i < todos.length; i++) {
	var todoItem = todos[i];
	var li = createNewTodo(todoItem);
	listFragment.appendChild(li);
	}
	ul.appendChild(listFragment);
}
function createNewTodo(todoItem) {
	//variables for date processing
	//Check to make sure the Date and Time were entered properly and split into Date and Time
	var regularDate = new RegExp(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}/); 
	if (todoItem.dueDate.match(regularDate)) { 
	var nowDateMilli = (new Date()).getTime()
	var dueDateMilli = Date.parse(todoItem.dueDate);
	var dueInMilli = dueDateMilli - nowDateMilli;
	var dueInDays = (dueInMilli / 1000 / 60 / 60 / 24);
	if (dueInDays >= 0) {
	var dueIn = Math.floor(dueInDays)+" days from today";
	}
	else {
	var dueIn = Math.ceil(dueInDays)+" days from today";
	}
	}
	else {
	var dueIn = todoItem.dueDate;
	}
	var li = document.createElement("li");
	li.setAttribute("id", todoItem.id);
	var spanTodo = document.createElement("span");
	spanTodo.innerHTML = 
		todoItem.who + " needs to " + todoItem.task + " by " + todoItem.dueDate + " ( " + dueIn + " )";
	var spanDone = document.createElement("span");
	if (!todoItem.done) {
		spanDone.setAttribute("class", "notDone");
		spanDone.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	}
	else {
		spanDone.setAttribute("class", "done");
		spanDone.innerHTML = "&nbsp;&#10004;&nbsp;";
	}
	var spanHere = document.createElement("span");
	spanHere.setAttribute("class", "here");
	spanHere.innerHTML = "Map";
	
	var spanDelete = document.createElement("span");
	spanDelete.setAttribute("class", "delete");
	spanDelete.innerHTML = "&nbsp;&#10007;&nbsp;";
	var mapDiv = document.getElementById("map");
	spanHere.onclick = passLocation;
	spanDelete.onclick = deleteItem;
	spanDone.onclick = updateDone;
	
	li.appendChild(spanDone);
	li.appendChild(spanTodo);
	li.appendChild(spanHere);
	li.appendChild(spanDelete);
	
	return li;
}  
function getFormData() {
        
	var task = document.getElementById("task").value;
	if (checkInputText(task, "Please enter a task")) return;
	
	var who = document.getElementById("who").value;
	if (checkInputText(who, "Please enter a person to do the task")) return;
	
	var dueDate = document.getElementById("dueDate").value;
	if (checkInputText(dueDate, "Please enter a valid due date")) return;
		checkdueDateInput(dueDate);
	
	var id = (new Date()).getTime(); 

	var todoItem = new Todo(id, task, who, dueDate, coordValues[0], false);
        todos.push(todoItem);
        addTodoToPage(todoItem);
        saveTodoItem(todoItem);
}
function checkInputText(value, msg) {
if (value == null || value == "") {
		alert(msg);
		return true;
	}
}
function checkdueDateInput(dueDate) {
try {        
	//Check to make sure the Date and Time were entered properly and split into Date and Time
	var regularDate = new RegExp(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}/); 
	if (!dueDate.match(regularDate)) {  
            throw new Error("The to do list won't be able to calculate time in that format.");
        }
        else {
        var dt = dueDate.split(" ");
	console.log("Date: "+dt[0]+", Time: "+dt[1]);
        return dueDate;
        }
    }
    catch (ex) {
        displayError(ex.message);
    }
}
function displayError(e) {
    alert(e);
}
function saveTodoItem(todoItem) {
    if (localStorage) {
        var key = "todo" + todoItem.id;
        var item = JSON.stringify(todoItem);
        localStorage.setItem(key, item);
    }
    else {
        console.log("Error: you don't have localStorage!");
    }
}
function deleteItem(e) {
	var span = e.target;
	var id = span.parentElement.id;
	console.log("delete an item: "+id);
	
	
// find and remove the item in localStorage
    var key = "todo" + id;
    localStorage.removeItem(key);

    // find and remove the item in the array
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
            todos.splice(i, 1);
            break;
        }
    }

    // find and remove the item in the page
    var li = e.target.parentElement;
    var liId = li.getAttribute("id");
    //define object in matchResultsList
    var itemToRemove = document.getElementById(liId);
    	if (itemToRemove.parentElement.getAttribute("id") == "matchResultsList") {
        var parentOfItem = itemToRemove.parentElement;
        parentOfItem.removeChild(itemToRemove);
        }
    //redefine object in todoList because first one was deleted
    var itemToRemove = document.getElementById(liId);
        if (itemToRemove.parentElement.getAttribute("id") == "todoList") {
        var parentOfItem = itemToRemove.parentElement;
        parentOfItem.removeChild(itemToRemove);
        }
}
function updateDone(e) {
        var span = e.target;
	var id = span.parentElement.id;
	if (document.getElementById("matchResultsList").childElementCount > 0) {
	if (span.parentElement.parentElement.id == "matchResultsList") {
	var span2 = document.getElementById("todoList").children.namedItem(id).firstChild;
	}
	if (span.parentElement.parentElement.id == "todoList") {
	var span2 = document.getElementById("matchResultsList").children.namedItem(id).firstChild;
        }
        }
	for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
	var task = todos[i].task;
	var who = todos[i].who;
	var date = todos[i].dueDate;
	var coordValues = todos[i].coordValues;
	var done = todos[i].done;
	}
	}
	if (done == false || span.getAttribute("class") == "notDone") {
	if (span2) {
		if (span2.getAttribute("class") == "notDone") {
		if (document.getElementById("matchResultsList").childElementCount > 0) {
			span2.setAttribute("class", "done");
			span2.innerHTML = "&nbsp;&#10004;&nbsp;";
			}
		}
	}
	var todoItemUpdated = new Todo(id, task, who, date, coordValues, true);
	console.log("set an item to done: "+id);
	replaceTodoItem(todoItemUpdated); 
	span.setAttribute("class", "done");
	span.innerHTML = "&nbsp;&#10004;&nbsp;";
	}
	else if (done == true || span.getAttribute("class") == "done") {
	if (span2) {
		if (span2.getAttribute("class") == "done") {
			if (document.getElementById("matchResultsList").childElementCount > 0) {
				span2.setAttribute("class", "notDone");
				span2.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
				}
		}
	}
	var todoItemUpdated = new Todo(id, task, who, date, coordValues, false);
	console.log("set an item to not done: "+id);
	replaceTodoItem(todoItemUpdated);
	span.setAttribute("class", "notDone");
	span.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	}
}
function replaceTodoItem(todoItemUpdated) {
	var id = todoItemUpdated.id;
        var key = "todo" + id; 
	
	if (localStorage) {
	var JSONtodoItemUpdated = JSON.stringify(todoItemUpdated);
        localStorage.setItem(key, JSONtodoItemUpdated);
	}
	
   	 // find and update the item in the array
   	 for (var i = 0; i < todos.length; i++) {
          if (todos[i].id == id) {
            todos[i] = todoItemUpdated;
            break;
          }
	
	}
}

//Add search text capability
function searchText() {
 	var searchTerm = document.getElementById("searchTerm").value;
 	    searchTerm = trim(searchTerm);
	var search = new RegExp(searchTerm, "ig");
	
	var resultsArray = new Array();
	for (var i = 0; i < todos.length; i++) {
	   
	    var searchWho = trim(todos[i].who);
	    var searchTask = trim(todos[i].task);
	    var reswho = searchWho.match(search);
	    var restask = searchTask.match(search);

            }
            	  if ((searchWho == null || searchWho == "") || (searchTask == null || searchTask == "")) {
		        alert("Please enter a string to search for");
				return;
		      }
		  if (searchTerm == null || searchTerm == "") {
		      alert("Please enter some text to search");
				return;
		       }
          else {
	    	for (var i = 0; i < todos.length; i++) {   
	    	 var searchWho = trim(todos[i].who);
	   	 var searchTask = trim(todos[i].task);
	   	 var reswho = searchWho.match(search);
	    	 var restask = searchTask.match(search);
	    	  if (reswho || restask) {
		      //call show results to show the matches in the page
		        resultsArray.push(todos[i]);
		    }
	    
       }
      buildResults(resultsArray);
      }
    }
function clearResultsList(ul) {
	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}
}
function clearMap() {
	var div = document.getElementById("map");
	div.setAttribute("id", "map");
	div.setAttribute("style", "none");
	while (div.firstChild) {
		div.removeChild(div.firstChild);
	}
}
function clearResults() {
	var ul = document.getElementById("matchResultsList");
	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}
	document.forms.search.reset();
}
function buildResults(results) {
	var frag = document.createDocumentFragment();
	
	for (var i = 0; i < results.length; i++) {
	var li = createNewTodo(results[i]);
	frag.appendChild(li);
	}
		
	showResults(frag);
}
//show search results
function showResults(frag) {
	var ul = document.getElementById("matchResultsList");
	clearResultsList(ul);
    if (frag.firstChild) {
	ul.appendChild(frag);
	}
   else {
	alert("No matches found");
	}
		
}
//trim search 
function trim(str) {
    return str.replace(/^\s+|\s+$/g,"");
} 