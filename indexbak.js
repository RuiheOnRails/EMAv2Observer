//for smooth scroll to work the same in all browser
window.__forceSmoothScrollPolyfill__ = true

var trackingData = [];
var partID = "";
var courseID = "";

function addEventListenerToBtns(){

    //when other is selected focus the text box
    document.querySelectorAll(".tagOther").forEach(el => {
        el.addEventListener("click", e => {
            document.getElementById(el.value).focus();
        })
    });

    document.getElementById("btnSubmit").addEventListener("click", e => {
        addToTrackingData(
            getRadioOrOtherValue("classActivityRadios"),
            getRadioOrOtherValue("studentBehaviorRadios"),
            document.getElementById("notes").value,
            getRadioOrOtherValue("cogAffStateRadios"),
            getCurrentTimeInString());
    
        clearchecks("classActivityRadios");
        clearchecks("studentBehaviorRadios");
        clearchecks("cogAffStateRadios");
        
        document.getElementById("notes").value = "";

        document.getElementById("classActForm").scrollIntoView({behavior: 'smooth', block: 'start'});
    });

    document.getElementById("btnStop").addEventListener("click", e => {
        e.preventDefault();
        addToTrackingData("","","","",getCurrentTimeInString());
    });

    document.getElementById("btnStart").addEventListener("click", (e) =>{
        e.preventDefault();
        partID = document.getElementById("partID").value;
        courseID = document.getElementById("courseID").value;

        if(partID === "" || courseID === ""){
            showModal();
        }else{
            addToTrackingData("","","","",getCurrentTimeInString());
            enableBtns();
            enableFields();
            lockRequiredForm();
            document.getElementById("btnStart").setAttribute("disabled", true);
        }
    });
    
    document.getElementById("btnDownload").addEventListener("click", (e) =>{
        e.preventDefault();
        convertArrayOfObjectsToCSV(trackingData);
        downloadCSV({"filename": partID});
    });
}

function clearchecks(radGroupName){
    document.getElementsByName(radGroupName).forEach(el => {
        el.checked = false;
    });

    //set first one to be checked by default
    document.getElementsByName(radGroupName)[0].checked = true;
}

function getRadioOrOtherValue(radGroupName){
    let retValue = "";
    document.getElementsByName(radGroupName).forEach(el => {
        if(el.checked == true){
            if(el.getAttribute("tag") === "other"){
                retValue = document.getElementById(el.value).value;
                document.getElementById(el.value).value = "";
            }else{
                retValue = el.value;
            }
        }
    });

    return retValue;
}
//true or false does not matter in this function, to re-enable button, attribute disabled must be removed
function disableBtns() {
    document.getElementById("btnStop").setAttribute("disabled", true);
    document.getElementById("btnDownload").setAttribute("disabled", true);
}

function disableFields(){
    // document.querySelectorAll("fieldset").forEach(ele => ele.setAttribute("disabled", true));
    document.getElementById("classActForm").setAttribute("disabled", true);
    document.getElementById("studentForm").setAttribute("disabled", true);
    document.getElementById("cogStateForm").setAttribute("disabled", true);
    document.getElementById("notes").setAttribute("disabled", true);
    document.getElementById("btnSubmit").setAttribute("disabled", true);
}

function enableFields(){
    document.querySelectorAll("fieldset").forEach(ele => ele.removeAttribute("disabled"));
    document.getElementById("notes").removeAttribute("disabled");
    document.getElementById("btnSubmit").removeAttribute("disabled");
}

function enableBtns() {
    document.getElementById("btnStop").removeAttribute("disabled");
    document.getElementById("btnDownload").removeAttribute("disabled");
}

function lockRequiredForm(){
    document.getElementById("partID").setAttribute("readonly", true);
    document.getElementById("courseID").setAttribute("readonly", true);
}

function enableRequiredForm(){
    document.getElementById("partID").removeAttribute("readonly");
    document.getElementById("courseID").removeAttribute("readonly");
}

function convertArrayOfObjectsToCSV(args) {  
    let result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function downloadCSV(args) {  
    let data, filename, link;
    let csv = convertArrayOfObjectsToCSV({
        data: trackingData
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}

function getCurrentTimeInString(){
    return (new Date).toLocaleString();
}

// function addToTrackingData(classActivity, studentBehavior, otherObs, cognState, time){
//     let obj = {
//         PartID: "",
//         CourseID: "",
//         "Class Activity": "",
//         "Student's Specific Behavior": "", 
//         "Other Observation" : "",
//         "Cognitive-affective state": "",
//         Date: "",
//         TimeStamp: "",
//     };
//     obj.PartID = partID.replace(/,/g, " ");
//     obj.CourseID = courseID.replace(/,/g, " ");
//     obj["Class Activity"] = classActivity.replace(/,/g, " ");
//     obj["Student's Specific Behavior"] = studentBehavior.replace(/,/g, " ");
//     obj["Cognitive-affective state"] = cognState.replace(/,/g, " ");
//     let datetimearray = time.split(",");
//     obj.Date = datetimearray[0];
//     obj.TimeStamp = datetimearray[1];
//     let txtAreaNotes = otherObs.replace(/,/g, " ");
//     obj["Other Observation"] = txtAreaNotes;
//     trackingData.push(obj);
// }

function showModal(){
    $("#requiredModal").modal('show');

    $("#requiredModal").on('hidden.bs.modal', function () {
        if(partID === ""){
            document.getElementById("partID").focus();
        }else{
            document.getElementById("courseID").focus();
        }
    });
}

addEventListenerToBtns();
disableBtns();
disableFields();
