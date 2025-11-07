let bookedDates = [];

function loadBookings() {
  db.collection("bookings").get().then((querySnapshot) => {
    bookedDates = [];
    querySnapshot.forEach((doc) => {
      bookedDates.push(doc.id);
    });
    renderCalendar(currentMonth, currentYear);
  }).catch(err => console.error("Error loading bookings:", err));
}

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function updateMonthYearLabel() {
  const monthNames = ["January","February","March","April","May","June","July",
                      "August","September","October","November","December"];
  document.getElementById('month-year').textContent = monthNames[currentMonth] + " " + currentYear;
}

function prevMonth() {
  currentMonth--;
  if(currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
}

function nextMonth() {
  currentMonth++;
  if(currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
}

function renderCalendar(month, year) {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Add empty slots for alignment
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    calendar.appendChild(emptyDiv);
  }

  // Add days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(year, month, day);
    const dayStr = dayDate.toISOString().split('T')[0];

    const div = document.createElement('div');
    div.className = 'day';
    div.textContent = day;

    if (dayStr === today.toISOString().split('T')[0]) {
      div.classList.add('today');
    }

    if (bookedDates.includes(dayStr)) div.classList.add('booked');
    div.onclick = () => selectDate(dayStr);
    calendar.appendChild(div);
  }

  updateMonthYearLabel();
}

function selectDate(date) {
  if (bookedDates.includes(date)) {
    alert('This day is already booked.');
    return;
  }
  document.getElementById('date').value = date;
}

function book() {
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  if (!date || !time) {
    alert('Please select a date and time.');
    return;
  }

  db.collection("bookings").doc(date).get().then((doc) => {
    if (doc.exists) {
      alert('This day is already booked.');
    } else {
      db.collection("bookings").doc(date).set({ time: time })
        .then(() => {
          alert(`Booked ${date} at ${time}`);
          bookedDates.push(date);
          renderCalendar(currentMonth, currentYear);
        })
        .catch(err => alert("Error saving booking: " + err));
    }
  }).catch(err => alert("Error checking booking: " + err));
}

// Initialize calendar
loadBookings();
