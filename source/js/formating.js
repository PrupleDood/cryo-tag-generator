const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const options = ["Increment", "Decrement"]

let labels = [];

// c - checkbox d - dropdown n - number p - preset t - text input

function add_options(object_id, start=null, end=null, array=null) {
    let object = document.getElementById(object_id);

    let start_int = 0;
    let end_int;

    if (start != null && end != null) {
        start_int = start;
        end_int = end;
    }
    else {
        end_int = array.length;
    }


    for (let i = start_int; i < end_int; i++) {
        let childElement = document.createElement("option");
        let appendChildElement = object.appendChild(childElement);

        let value;
        if (array != null){
            value = array[i];
        }
        else {
            value = i;
        }

        appendChildElement.value = value;
        appendChildElement.innerHTML = value;
    }
}

function array_add_options(base_id, start_id=null, end_id=null, array=null) {

    for (let i = start_id; i < end_id+1; i++) {
        add_options(object_id=base_id+i, null, null, array=array);
    }

}

function get_options_map() {
    let options_map = new Map();

    for (let i = 1; i < 4; i++) {
        options_map.set("OD"+i, document.getElementById("OD"+i));
    }

    let length = 3;
    for (let i = 1; i < 4; i++) {
        for (let i2 = 1; i2 < length+1; i2++) {
            id_1 = "OC"+i+"-"+i2;
            id_2 = "Row-"+i+"-N"+i2;

            if (i == 2 && i2 == 2) {
                id_2 = "Row-2-D1";
            }

            options_map.set(document.getElementById(id_1), document.getElementById(id_2));
        }
        length--;
    }

    return options_map;
}

let fix_value = (value, id) => {
    if (id == 1 && value.length == 1) {
        value = '0'+value
    }
    else if (id == 2) {
        if (value.length == 1) { 
            value = '00' + value
        }
        else if (value.length == 2) {
            value = '0' + value
        }
    }
    return value
}

function generate_label() {
    let row_1 = [
            document.getElementById("Row-1-D1"), 
            document.getElementById("Row-1-N1"), 
            document.getElementById("Row-1-N2"),
            document.getElementById("Row-1-N3")
        ];

    let row_2;
    
    if (document.getElementById("Row-2-C1").checked == true) {
        row_2 = [
            document.getElementById("Row-2-N1"),
            document.getElementById("Row-2-D1"),
            document.getElementById("Row-2-D2"),
            document.getElementById("Row-2-N2")
        ];
    }

    let row_3;
    
    if (document.getElementById("Row-3-C1").checked == true) {
        row_3 = [
            document.getElementById("Row-3-N1")
        ];
    }

    let row_4 = [
        document.getElementById("Row-4-T1"),
        document.getElementById("Row-1-D1"), 
        document.getElementById("Row-1-N1"), 
        document.getElementById("Row-1-N2")
    ];

    if (document.getElementById("Row-4-C1").checked == true) {
        row_4 = row_4.concat([document.getElementById("Row-4-T2")]);
    }

    let label = [];

    let label_data = [row_1, row_2, row_3, row_4]

    for (let i = 0; i < label_data.length; i++) {
        if (label_data[i] == null){
            continue
        }

        let element_values = [];

        for (let element of label_data[i]) {
            element_values.push(element.value);
        }

        switch (i) {
            case 0:
                element_values[1] = fix_value(element_values[1], 1)
                element_values[2] = fix_value(element_values[2], 2)
                
                section_1 = element_values.slice(0, 2).join('');
                section_2 = element_values.slice(2);

                element_values = [section_1].concat(section_2);
                element_values = element_values.join('-');
                break;
            
            case 1:
                section_1 = 'D-' + element_values[0];
                section_2 = ' ' + element_values.slice(1, element_values.length).join("");

                element_values = section_1 + section_2;
                break;
            
            case 2:
                element_values = '(ET):' + element_values[0];
                break;
            
            case 3:
                section_1 = element_values[0];
                section_2 = element_values.slice(1, 3).join('');
                section_3 = element_values.slice(3)

                section_3 = section_3.slice(0, -1) + ' ' + section_3[section_3.length-1]

                element_values = [section_1].concat([section_2], section_3)
                element_values = element_values.join('-')

                break;
        }

        label.push(element_values);
    }

    return label;
}

function add_label() {
    let menu_element = document.getElementById("vm");

    let childElement = document.createElement("a")
    childElement.id = "Label-" + labels.length+1;

    let label = generate_label();

    childElement.innerHTML = label.join('<br>');
    let temp_br = document.createElement('br');
    childElement.appendChild(temp_br);

    let rm_button = document.createElement("button");
    rm_button.innerHTML = "Remove";

    rm_button.addEventListener("click", (event) => {
        remove_label(rm_button.parentElement);
    });

    childElement.appendChild(rm_button);

    menu_element.appendChild(childElement);

    apply_options()
}

function apply_options() {
    let options_map = get_options_map()

    option_checkboxes = Array.from(options_map.keys()).slice(3)

    for (let check of option_checkboxes) {
        if (check.checked == false) {
            continue;
        }

        let corresponding_element = options_map.get(check);

        let increment_value = 1;
        if (corresponding_element.outerHTML.includes("border-color: rgb(215, 0, 34)")) {
            increment_value = -1;
        }

        switch(corresponding_element.placeholder) {
            case "000":
                corresponding_element.value = ""+(parseInt(corresponding_element.value)+increment_value)
                
                if (parseInt(corresponding_element.value) > 999) {
                    corresponding_element.value = "999"
                } else if (parseInt(corresponding_element.value) < 0) {
                    corresponding_element.value = "0"
                }

                break;
            
            case "00":
                corresponding_element.value = ""+(parseInt(corresponding_element.value)+increment_value)

                if (parseInt(corresponding_element.value) > 99) {
                    corresponding_element.value = "99"
                } else if (parseInt(corresponding_element.value) < 0) {
                    corresponding_element.value = "0"
                }

                break;
            
            case "Number":
                corresponding_element.value = ""+(parseInt(corresponding_element.value)+increment_value);

                if (parseInt(corresponding_element.value) < 0) {
                    corresponding_element.value = "0";
                }
                break;

            case undefined:
                console.log(corresponding_element.value)
                let last_value = corresponding_element.value
                corresponding_element.value = ""+(parseInt(corresponding_element.value)+increment_value);
                
                console.log(corresponding_element.value)

                if (corresponding_element.value == "" && last_value == "31") {
                    if (last_value == "31") {
                        corresponding_element.value = "31";
                        break;
                    }
                    corresponding_element.value = "1";
                }
                
                console.log(corresponding_element.value)

                break;
                
            default:
                break;
        }

    }
}

function remove_label(label_object) { 
    let parent_object = label_object.parentElement;
    parent_object.removeChild(label_object);
}

function addEventListeners() {
    //updates corresponding elements
    let inputs = [document.getElementById("Row-1-D1"), 
                    document.getElementById("Row-1-N1"), 
                    document.getElementById("Row-1-N2")
                ];

    let objects = [document.getElementById("Row-4-P1"), 
                    document.getElementById("Row-4-P2"), 
                    document.getElementById("Row-4-P3")
                ];

    for (let i = 0; i < 3; i++){
        inputs[i].addEventListener("input", (event) => {
            if (inputs[i].value == ""){
                objects[i].innerHTML = inputs[i].placeholder;
            }
            else {
                objects[i].innerHTML = fix_value(inputs[i].value, i);
            }
        });
    }

    //button event listeners
    let add_button = document.getElementById("submit");
    add_button.addEventListener("click", (event) => {
        add_label();
    });

    let text_button = document.getElementById("generate");
    text_button.addEventListener("click", (event) => {
        download("label_text.txt", format_labels().join('|'));
    });


    // options event listeners
    let parent_elements = document.getElementsByClassName("second-row");
    let option_checkboxes = [];

    let options_map = get_options_map()

    for (let i of parent_elements) {
        option_checkboxes = option_checkboxes.concat(Array.from(i.children))
    }

    for (let i of option_checkboxes) {
        let corresponding_element = options_map.get(i);

        i.addEventListener("mouseover", (event) => {

            if (i.checked == true) {
                return
            }

            let option_value = options_map.get("OD"+i.name[2]).value

            border_color = "deepskyblue";
            if (option_value == "Decrement") {
                border_color = "#d70022"; //red
            }

            corresponding_element.style = "border-color: "+border_color;
        });

        i.addEventListener("mouseout", (event) => {

            if (i.checked == true) {
                return;
            }

            corresponding_element.style = null;
        });

    }
}

function format_labels() {
    let ret_array = [];

    let label_menu = document.getElementById("vm").children;


    for (let label_object of label_menu) {
        let label_string = label_object.innerHTML.split("<br>");

        label_string = label_string.slice(0, label_string.length-1);
        label_string = label_string.join('\n')
        label_string = '\n' + label_string

        ret_array.push(label_string)
    }

    return ret_array
}

function download(filename, text) {
    let res = confirm("Download data file (must be saved in path to work)")

    if (res == false) {
        return
    }
    
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Start file download.
// download("hello.txt","This is the content of my file :)");

add_options("Row-1-D1", null, null, array=alphabet);
add_options("Row-2-D1", start=1, end=32);
add_options("Row-2-D2", null, null, array=months);
array_add_options("OD", 1, 3, options)

addEventListeners()

//checkboxes use the object.checked value
