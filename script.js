let bookedDates = [];

function renderCalendar() {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';
  const today = new Date();
  for (let i = 0; i < 30; i++) { // show next 30 days
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
  bookedDates.push(date);
  alert(`Booked ${date} at ${time}`);
  renderCalendar();
}

renderCalendar();
