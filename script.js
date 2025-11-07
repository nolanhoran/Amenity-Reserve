let bookedDates = [];

function loadBookings() {
  db.collection("bookings").get().then((querySnapshot) => {
    bookedDates = [];
    querySnapshot.forEach((doc) => {
      bookedDates.push(doc.id);
    });
    renderCalendar();
  });
}

function renderCalendar() {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const day = new Date();
    day.setDate(today.getDate() + i);
    const dayStr = day.toISOString().split('T')[0];

    const div = document.createElement('div');
    div.className = 'day';
    div.textContent = day.getDate();
    if (bookedDates.includes(dayStr)) div.classList.add('booked');
    div.onclick = () => selectDate(dayStr);
    calendar.appendChild(div);
  }
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
      db.collection("bookings").doc(date).set({ time: time }).then(() => {
        alert(`Booked ${date} at ${time}`);
        bookedDates.push(date);
        renderCalendar();
      });
    }
  });
}

// Load bookings on page load
loadBookings();
