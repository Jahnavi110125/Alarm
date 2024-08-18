document.addEventListener('DOMContentLoaded', function() {
    let interval;
    const alertSound = document.getElementById('alert-sound');
    const wholeElement = document.getElementById('whole');
    const timerElement = document.getElementById('timer');
    const formElement = document.getElementById('form');
    const nameElement = document.getElementById('name');
    const givenNameElement = document.getElementById('given_name');
    const dateElement = document.getElementById('date');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    let alarmTriggered = false;

    document.getElementById('button').addEventListener('click', function(event) {
        event.preventDefault();

        if (!formElement.checkValidity()) {
            alert('Please fill in all required fields.');
            return;
        }

        wholeElement.style.display = 'none';
        timerElement.style.display = 'block';
        givenNameElement.textContent = nameElement.value || 'Remainder';

        const [given_year, given_month, given_day] = dateElement.value.split('-').map(Number);
        const [given_hours_str, period] = hoursElement.value.split(' ');
        let given_hours = parseInt(given_hours_str, 10);
        const given_mins = parseInt(minutesElement.value, 10) || 0;
        const given_secs = parseInt(secondsElement.value, 10) || 0;

        if (period === 'PM' && given_hours < 12) {
            given_hours += 12;
        } else if (period === 'AM' && given_hours === 12) {
            given_hours = 0;
        }

        target_date = new Date(given_year, given_month - 1, given_day, given_hours, given_mins, given_secs);
        if (target_date < new Date()) {
            alert('Invalid Input!');
            wholeElement.style.display = 'block';
            timerElement.style.display = 'none';
            return;
        }

        updateCurrentTime();
        interval = setInterval(function() {
            updateCurrentTime();
            checkAlarm();
        }, 1000);
    });

    function updateCurrentTime() {
        const now = new Date();
        let current_hours = now.getHours();
        if (current_hours > 12) current_hours -= 12;
        document.getElementById('hrs').textContent = current_hours.toString().padStart(2, '0');
        document.getElementById('mins').textContent = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('secs').textContent = now.getSeconds().toString().padStart(2, '0');
    }

    function checkAlarm() {
        const now = new Date();
        const difference = target_date - now;

        if (difference <= 0 && !alarmTriggered) {
            alertSound.play();
            alarmTriggered = true; 
        }
    }

    document.getElementById('restart').addEventListener('click', function() {
        clearInterval(interval);
        alertSound.pause();
        alertSound.currentTime = 0;
        alarmTriggered = false; 
        timerElement.style.display = 'none';
        wholeElement.style.display = 'block';
        formElement.reset();
    });

    document.getElementById('cancel').addEventListener('click', function() {
        alert('Alarm Cancelled!!');
        alertSound.pause();
        alertSound.currentTime = 0;
        alarmTriggered = true;
    });
});
