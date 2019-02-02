window.__forceSmoothScrollPolyfill__ = true

var trackingData = [];
var observerName = "";
var courseID = "";
var classAct = "";
var studentBeh = "";
var valance = "";
var arousal ="";

var trackingState = {
    classAct: "Discussion",
    studentBeh:"Chatting with friends",
    valance: "1",
    arousal: "1",
    currentTime: "",
}

var idToOtherMap = {
    classActSelector: "otherClassActText",
    studentActSelector: "otherBehText",
}

var selectorIds = ["classActSelector", "studentActSelector", "valSelector", "aroSelector"]

function registerButton(){
    document.getElementById("btnStart").addEventListener("click", (e) =>{
        e.preventDefault();
        observerName = document.getElementById("observerName").value;
        courseID = document.getElementById("courseID").value;

        if(observerName === "" || courseID === ""){
            showModal();
        }else{
            addToTrackingData("START","START","START", "START","START",getCurrentTimeInString());
            console.log(trackingData)
            enableBtns();
            enableSelectors();
            lockRequiredForm();
            document.getElementById("btnStart").setAttribute("disabled", true);
        }
    });

    document.getElementById("btnSubmit").addEventListener("click", e => {
        if(getCheckedValue("partcheckbox").length == 0){
            showPartCheckModal();
        }else{
            getCheckedValue("partcheckbox").forEach(p => {
                addToTrackingData(
                    p,
                    trackingState.classAct,
                    trackingState.studentBeh,
                    trackingState.valance,
                    trackingState.arousal,
                    trackingState.currentTime
                );
            })
    
            document.querySelectorAll("textarea").forEach(el => {
                el.value = "";
            });
            
            resetSelectors();

            document.getElementById("classActForm").scrollIntoView({behavior: 'smooth', block: 'start'});
            document.getElementsByName("partcheckbox").forEach(c => {
                c.checked = false;
            });
            disbaleSubmit();
        }
    });

    document.getElementById("btnCheckAll").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementsByName("partcheckbox").forEach(c => {
            c.checked = true;
        })
    })

    document.getElementById("btnClearCheck").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementsByName("partcheckbox").forEach(c => {
            c.checked = false;
        })
    })

    document.getElementById("btnStop").addEventListener("click", e => {
        e.preventDefault();
        addToTrackingData("STOP","STOP","STOP","STOP","STOP", getCurrentTimeInString());
    });

    document.getElementById("btnDownload").addEventListener("click", (e) =>{
        e.preventDefault();
        // convertArrayOfObjectsToCSV(trackingData);
        downloadCSV({"filename": observerName});
    });

    document.getElementById("btnRecTime").addEventListener("click", (e) => {
        trackingState.currentTime = getCurrentTimeInString();
        enableSubmit();
    })
}

function registerSelectors(id, key){
    document.getElementById(id).addEventListener("change", (e) => {
        e.preventDefault();
        let selectedOption = e.srcElement[e.srcElement.selectedIndex].value;
        if(selectedOption.startsWith("other")){
            let localtextArea = document.getElementById(selectedOption);
            localtextArea.removeAttribute("disabled");
            localtextArea.classList.remove("d-none");
            trackingState[key] = localtextArea.value;
            localtextArea.addEventListener("input", (e) => {
                e.preventDefault();
                trackingState[key] = localtextArea.value;
            })
        }else{
            if(id in idToOtherMap){
                document.getElementById(idToOtherMap[id]).setAttribute("disabled", true);
                document.getElementById(idToOtherMap[id]).classList.add("d-none");
            }
            trackingState[key] = selectedOption;
        }
    })
}

function addToTrackingData(partId, classActivity, studentBehavior, valance, arousal, time){
    let obj = {
        Observer: "",
        CourseID: "",
        Participant: "",
        "Class Activity": "",
        "Student's Specific Behavior": "", 
        Valance: "",
        Arousal: "",
        Date: "",
        TimeStamp: "",
    };
    obj.Observer = observerName.replace(/,/g, " ");
    obj.CourseID = courseID.replace(/,/g, " ");
    obj.Participant = partId;
    obj["Class Activity"] = classActivity.replace(/,/g, " ");
    obj["Student's Specific Behavior"] = studentBehavior.replace(/,/g, " ");
    obj.Valance = valance;
    obj.Arousal = arousal;
    let datetimearray = time.split(",");
    obj.Date = datetimearray[0];
    obj.TimeStamp = datetimearray[1];
    trackingData.push(obj);
}

function getCheckedValue(radGroupName){
    let retValue = [];
    document.getElementsByName(radGroupName).forEach(el => {
        if(el.checked == true){
            retValue.push(el.value);
        }
    });
    return retValue;
}

function showModal(){
    $("#requiredModal").modal('show');

    $("#requiredModal").on('hidden.bs.modal', function () {
        if(observerName === ""){
            document.getElementById("partID").focus();
        }else{
            document.getElementById("courseID").focus();
        }
    });
}

function showPartCheckModal(){
    $("#requirePartCheck").modal('show');
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

//true or false does not matter in this function, to re-enable button, attribute disabled must be removed
function disableBtns() {
    document.getElementById("btnStop").setAttribute("disabled", true);
    document.getElementById("btnDownload").setAttribute("disabled", true);
    document.getElementById("btnSubmit").setAttribute("disabled", true);
    document.getElementById("btnRecTime").setAttribute("disabled", true);
}

function disableSelectors(){
    document.getElementById("classActForm").setAttribute("disabled", true);
    document.getElementById("studentForm").setAttribute("disabled", true);
    document.getElementById("valAroForm").setAttribute("disabled", true);
}

function enableSelectors(){
    document.getElementById("classActForm").removeAttribute("disabled");
    document.getElementById("studentForm").removeAttribute("disabled");
    document.getElementById("valAroForm").removeAttribute("disabled");
}

function enableBtns() {
    document.getElementById("btnStop").removeAttribute("disabled");
    document.getElementById("btnDownload").removeAttribute("disabled");
    document.getElementById("btnRecTime").removeAttribute("disabled");
}

function lockRequiredForm(){
    document.getElementById("observerName").setAttribute("readonly", true);
    document.getElementById("courseID").setAttribute("readonly", true);
}

function enableRequiredForm(){
    document.getElementById("observerName").removeAttribute("readonly");
    document.getElementById("courseID").removeAttribute("readonly");
}

function disbaleSubmit() {
    document.getElementById("btnSubmit").setAttribute("disabled", true);
}

function enableSubmit(){
    document.getElementById("btnSubmit").removeAttribute("disabled");
}

function resetSelectors(){
    selectorIds.forEach(id => {
        document.getElementById(id).selectedIndex = 0
        document.getElementById(id).dispatchEvent(new Event("change"))
    });

    document.getElementsByName("othertextarea").forEach((a) => {
        a.classList.add("d-none");
        a.setAttribute("disabled", true);
    });
}

registerSelectors("classActSelector", "classAct");
registerSelectors("studentActSelector", "studentBeh");
registerSelectors("valSelector", "valance");
registerSelectors("aroSelector", "arousal");

disableBtns();
disableSelectors();
registerButton();
