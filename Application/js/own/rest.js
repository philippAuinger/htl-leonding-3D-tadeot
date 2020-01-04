function request(){
    console.log("REST-Abfrage gestartet.");

    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest()

    //your backend url
    request.open('GET', 'http://vm85.htl-leonding.ac.at:8080/Tadeot/api/exhibit');
    request.onload = function() {
        var data = JSON.parse(this.response)
        exhibits = data;

        exhibits.forEach(t => t.room.name = t.room.name.replace(/[^ \w]/g, ""));
        exhibits.sort((a, b) => a.name.localeCompare(b.name));

        if (request.status >= 200 && request.status < 400) {
            console.log(exhibits);
            addItemsToHTML(exhibits);
            setupSpheres();
            getAllRooms();
        } else {
            console.log('error')
        }
    }

    // Send request
    request.send();
}

function addItemsToHTML(list){
    var itemsDiv = $("#items-wrapper");
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        //color the list Items
        var departments = [];
        if(item.department.includes("Informatik")){
            departments.push("#004f9f");
        }
        if(item.department.includes("Medientechnik")){
            departments.push("#6cb6dd");
        }
        if(item.department.includes("Medizintechnik")){
            departments.push("#be1522");
        }
        if(item.department.includes("Elektronik")){
            departments.push("#f18800");
        }

        //var segments = 100 / departments.length;

        var styleString = "background: linear-gradient(to right," + departments[0] +" 100%) !important";

        var html =
          '<li>' +
          '<a id="' + item.room.name + 'listItem' + '" class="download cursor" onclick="chooseExhibit(\'' + 
          item.room.name + '\',\'' + item.supervisor + '\',\'' + item.name + '\',\'' + item.department + 
          '\')"' +
          '>' +
          item.name + " (Raum: " + item.room.name +
          ")</a></li>";
        itemsDiv.append(html);
        console.log(departments);
        if(departments.length == 2){
            $('#' + item.room.name + 'listItem').css('background', 'linear-gradient(90deg, '+ departments[0] +' 50%, '+ departments[1] +' 50%');
            $('#' + item.room.name + 'listItem').css('color', 'white');
        }
        if(departments.length == 1){
            $('#' + item.room.name + 'listItem').css('background', 'linear-gradient(90deg, '+ departments[0] +' 100%, #ffffff 0%');
            $('#' + item.room.name + 'listItem').css('color', 'white');
        }
      }
}

function setupSpheres(){
    var exhibitsWithoutRooms = exhibits.filter(e => allRooms.filter(r => r.name == e.room.name) == 0);
    console.log(exhibitsWithoutRooms);
    exhibitsWithoutRooms.forEach(e => {
        var geometry = new THREE.SphereGeometry(80, 32, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        var exhibit = new THREE.Mesh(geometry, material);
        exhibit.name = e.room.name;
        exhibit.position.x = e.x;
        exhibit.position.y = e.y;
        exhibit.position.z = e.z;
        exhibit.geometry.attributes = {};
        exhibit.geometry.attributes.position = {};
        exhibit.geometry.attributes.position.array = [exhibit.position.x,exhibit.position.y,exhibit.position.z];
        scene.add(exhibit);
        objectArr.push(exhibit);
    });
}

function chooseExhibit(room, supervisor, name, department){
    chooseRoom(room, supervisor, name, department, false);
}