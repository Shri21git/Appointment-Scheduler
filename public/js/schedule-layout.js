// appointment schedule for each profile and
// generating the html for each in order

const PORT = "8080";
const baseUrl = "http://localhost:" + PORT + "/schedule/load/";

function getElements() {
  //Get the ids with class name as "schedule"
  const scheduleElements = [...document.getElementsByClassName("schedule")];
  scheduleElements.forEach((elem) => {
    let url = baseUrl + elem.id + "/" + getDate();
    getData(url);
  });
}

function getDate() {
  let date = document.getElementById("date-select").value;

  if (date === "" || date === undefined || date === null) {
    // if no date has been selected, use today's date.
    const dateObj = new Date();

    // formating the month
    let monthString = (dateObj.getMonth() + 1).toString();
    if (monthString.length === 1) {
      monthString = "0" + monthString;
    }
    const dateString =
      dateObj.getFullYear() + "-" + monthString + "-" + dateObj.getDate();
    return dateString;
  }

  // configure the date
  const year = date.split("-")[0];
  const month = date.split("-")[1];
  let day = date.split("-")[2];

  // if the day of the month has a leading zero, remove it
  if (day.charAt(0) === "0") {
    day = day.charAt(1);
  }

  const dateString = year + "-" + month + "-" + day;
  return dateString;
}

// get response json data
async function apiFetch(url) {
  const respone = await fetch(url);
  const data = await respone.json();
  return data;
}

const getData = async (url) => {
  const data = await apiFetch(url);
  console.log(data);
  loadData(data);
};

function sortData(data) {
  data.appointments.forEach((item) => (item.onDate = new Date(item.onDate)));
  data.appointments.sort((d1, d2) => d1.onDate - d2.onDate);
  return data.appointments;
}

function formatTimeString(date) {
  // format the hours to am or pm
  let hours = date.getHours();
  let amOrPm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be 12.

  // format the minutes
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // return the time string
  return hours + ":" + minutes + " " + amOrPm;
}

function generateHtml(appointment, profileId) {
  /**
   * .title = name, String,
   * .onDate = starting day and time, Date object,
   * .duration = time it will take, int
   * .agenda = agenda of meeting, String
   */
  const sectionElem = document.createElement("div");
  sectionElem.className = "appointment";

  // column one
  const divOne = document.createElement("div");
  divOne.className = "apt-box-1";

  const nameElem = document.createElement("p");
  nameElem.className = "apt-name";
  nameElem.innerHTML = appointment.title;

  divOne.appendChild(nameElem);

  // column two
  const divTwo = document.createElement("div");
  divTwo.className = "apt-box-2";

  const timeElem = document.createElement("p");
  timeElem.className = "apt-time";
  timeElem.innerHTML =
    "<b>Start time: </b>" + formatTimeString(appointment.onDate);

  const durationElem = document.createElement("p");
  durationElem.className = "apt-duration";
  durationElem.innerHTML = "<b>Duration: </b>" + appointment.duration;

  const detailsBtn = document.createElement("button");
  detailsBtn.className = "apt-details-btn";
  detailsBtn.id = appointment._id;
  detailsBtn.innerHTML = "Details";

  divTwo.appendChild(timeElem);
  divTwo.appendChild(durationElem);
  divTwo.appendChild(detailsBtn);

  // column three
  const divThree = document.createElement("div");
  divThree.className = "apt-box-3";

  // delete form
  const delForm = document.createElement("form");
  delForm.action = "/schedule/delete/" + profileId + "/" + appointment._id;
  delForm.method = "post";

  // delete button
  const delBtn = document.createElement("button");
  delBtn.className = "apt-delete";
  delBtn.type = "submit";
  delBtn.innerHTML = "Delete";

  // delete csrf token
  const delInput = document.createElement("input");
  delInput.type = "hidden";
  delInput.name = "_csrf";
  delInput.value = document.getElementById("_csrf").value;

  delForm.appendChild(delBtn);
  delForm.appendChild(delInput);

  divThree.appendChild(delForm);

  // agenda element
  const agendaElem = document.createElement("p");
  agendaElem.className = "agenda";
  agendaElem.innerHTML = "<b>agenda: </b>" + appointment.agenda;

  // add each column to the section
  sectionElem.appendChild(divOne);
  sectionElem.appendChild(divTwo);
  sectionElem.appendChild(divThree);
  sectionElem.appendChild(agendaElem);

  // event listener for details button
  detailsBtn.addEventListener("click", () => {
    if (detailsBtn.className !== "apt-details-btn active") {
      detailsBtn.className = "apt-details-btn active";
      durationElem.style.display = "block";
      delBtn.style.display = "block";
      agendaElem.style.display = "block";
      detailsBtn.innerHTML = "Hide";
    } else {
      detailsBtn.className = "apt-details-btn";
      durationElem.style.display = "none";
      delBtn.style.display = "none";
      agendaElem.style.display = "none";
      detailsBtn.innerHTML = "Details";
    }
  });

  return sectionElem;
}

// render the details
function loadData(data) {
  // if any appointments
  if (data.appointments.length > 0) {
    // sort the data by time
    const sortedData = sortData(data);
    profileId = data.profileId;

    // get the div for the content
    const sectionElem = document.getElementById(profileId);

    sortedData.forEach((item) => {
      sectionElem.appendChild(generateHtml(item, profileId));
    });
  } else {
    console.log("No appointments!");
    return;
  }
}

// call the function getElements
getElements();

// to clear previous data
function dateBtnControl() {
  const scheduleElem = [...document.getElementsByClassName("schedule")];
  scheduleElem.forEach((elem) => {
    elem.innerHTML = "";
  });
  getElements();
}

document.getElementById("date-btn").addEventListener("click", dateBtnControl);
