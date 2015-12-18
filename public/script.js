
document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){

	var req = new XMLHttpRequest;
	req.open("GET", '/select', true);
	req.send(null);
//Add stored data when the page loads to the rows
		req.addEventListener('load',function(){
			if (req.status >= 200 && req.status < 400){
				var data = JSON.parse(req.responseText);
				
				for(var i = 0; i < data.length; i++)
					addRow(data[i], data[i].id);
			}
	
			
			else {
			console.log("Error in network request: " + request.statusText);
			}
				
				turnOff();
			});
			
	//make all the buttons work
	document.getElementById("cancel").addEventListener("click", function(){
	swapEdit()});
	document.getElementById("mainTable").addEventListener("click", clicked, true);	
	document.getElementById('sub').addEventListener('click', submit);
	document.getElementById('update').addEventListener('click', update);
			
function update(e){
	event.preventDefault();
		var payload = {};
        payload.name = document.getElementById('ename').value;
		if(!payload.name){
			alert('Enter a Name');
			return;}
        payload.reps = document.getElementById('ereps').value;
        payload.weight = document.getElementById('eweight').value;
        payload.date = document.getElementById('edate').value;
        payload.lbs = document.getElementById('elbs').value;
		payload.id = document.getElementById('eid').value;
        var req = new XMLHttpRequest(); 

    
		req.open("GET", `/update?name=${payload.name}&reps=${payload.reps}&weight=${payload.weight}&date=${payload.date}&lbs=${payload.lbs}&id=${payload.id}`, true);
		req.send(null);
		
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status < 400){
				var data = JSON.parse(req.responseText);
				var search = "row" + payload.id;
				var deadE = document.getElementById(search);
				deadE.parentElement.removeChild(deadE);
				addRow(data[0], data[0].id);
				turnOff();
				if(document.getElementById("edit").style.display != "none")
					swapEdit();
				}
			 else {
			console.log("Error in network request: " + request.statusText);
			}
		})
	
}


function submit(e){
		e.preventDefault();
		var payload = {};
        payload.name = document.getElementById('name').value;
		if(!payload.name){
			alert('Enter a Name');
			return;}
        payload.reps = document.getElementById('reps').value;
        payload.weight = document.getElementById('weight').value;
        payload.date = document.getElementById('date').value;
        payload.lbs = document.getElementById('lbs').value;

        var req = new XMLHttpRequest(); 

    
		req.open("GET", `/insert?name=${payload.name}&reps=${payload.reps}&weight=${payload.weight}&date=${payload.date}&lbs=${payload.lbs}`, true);
		req.send(null);
		
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status < 400){
				var data = JSON.parse(req.responseText);
				
				addRow(data[0], data[0].id);
				turnOff();
				}
			 else {
			console.log("Error in network request: " + request.statusText);
			}
		})
}

function clicked(e){
	if(e.target !== e.currentTarget){
		e.preventDefault();
		if(e.target.classList[e.target.classList.length - 1] === "deletes"){
		deletes(e);
		}
		//for the edit buttons
		else{
			edit(e);
		}
	}
}
function swapEdit(){
	var x = document.getElementById("edit").style.display;
	 document.getElementById("edit").style.display = document.getElementById("input").style.display;
	 document.getElementById("input").style.display = x;
}

function edit(e){
	if(document.getElementById("edit").style.display == "none")
		swapEdit();
	var rowId = "row" + (e.target.id).slice(1);
	var row = document.getElementById(rowId);
	var element = row.getElementsByTagName("td");
	var items = ["ename", "ereps", "eweight", "edate", "elbs", "eid"];
	for(var i = 0; i < element.length; i++){
		if(!element[i].firstElementChild)
			if(i == 3){
				var d = new Date(element[i].textContent);
				document.getElementById(items[i]).value = d.yyyymmdd();
			}
			else if(i == 4){
				if(element[i].textContent == 'lbs'){
					document.getElementById("elbs").selectedIndex = 0;

					
				}
				else{
					document.getElementById("elbs").selectedIndex = 1;

					
				}
			}
			else{
			document.getElementById(items[i]).value = element[i].textContent;
			}
	}
}


function deletes(e){
	
	var req = new XMLHttpRequest();
	req.open("GET", '/delete?id='+e.target.id, true);
	req.send(null);

	req.addEventListener('load',function(){

	if(req.status >= 200 && req.status < 400){
		var search = "row" + e.target.id;
		var deadE = document.getElementById(search);
		deadE.parentElement.removeChild(deadE);
		turnOff();
		if(document.getElementById("edit").style.display != "none")
			swapEdit();
	} 

	else {
	console.log("Error in network request: " + request.statusText);
	}
	});
}


function turnOff(){
	if(document.getElementsByTagName("td").length == 0){
		document.getElementById("mainTable").style.visibility="hidden";
		document.getElementById("exists").textContent="Your Exercise Table is Empty";
		if(document.getElementById("edit").style.display != "none")
			swapEdit();
	}
	else{
		document.getElementById("mainTable").style.visibility="visible";
		document.getElementById("exists").textContent="Your Exercise Table";
	}
}
	
function addRow(payload, id){
		var row = document.createElement("tr");
		row.id = "row" + id;
		
		
		payload.date = new Date(payload.date);
		payload.date = payload.date.toUTCString();
		payload.date = payload.date.slice(0,16);
		for(var i in payload){
			if(i != "id"){
				if(i == "lbs")
				{
					payload[i] ? payload[i] = "lbs" : payload[i] = "kgs"; 
				}
			var item = document.createElement("td");
			item.textContent = payload[i];
			row.appendChild(item);
			}
			
			
		}
		var input = document.createElement("input");
		input.type="hidden";
		input.value=id;
		
		var input2 = document.createElement("input");
		input2.type="hidden";
		input2.value=id;
		
		var item = document.createElement("td");
		item.style.display = "none";
		item.textContent = payload["id"];
		row.appendChild(item);

		var button = document.createElement("input");
		button.className = "btn btn-danger btn-sm deletes"; 
		button.type = "submit";
		button.id = id;
		button.value = "Delete";
		
		var button2 = document.createElement("input");
		button2.className = "btn btn-danger btn-sm edits"; 
		button2.type = "submit";
		button2.id = "u" + id;;
		button2.value = "Edit";
		
		var fieldSet = document.createElement("fieldset");
		fieldSet.appendChild(input);
		fieldSet.appendChild(button);
		
		var fieldSet2 = document.createElement("fieldset");
		fieldSet2.appendChild(input2);
		fieldSet2.appendChild(button2);
		
		var form = document.createElement("form");
		form.appendChild(fieldSet);
		
		var form2 = document.createElement("form");
		form2.appendChild(fieldSet2);
		
		var outer2 = document.createElement("td");
		outer2.appendChild(form2);
		
		var outer = document.createElement("td");
		outer.appendChild(form);

		row.appendChild(outer);
		row.appendChild(outer2);
		
		document.getElementById("theTableB").appendChild(row);
		};
		
}

//for silly date problems from here: http://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object

 Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
  };



