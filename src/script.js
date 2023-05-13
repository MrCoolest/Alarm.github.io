const Intialize = function () {
    const time_heading = document.getElementById('time-heading');
    const alarm_form = document.getElementById('alarm-form');
    const alarmAudio = new Audio('assets/sounds/alarm-clock-short-6402.mp3');
    const stopBtn = document.getElementById('stop');
    const icon = document.getElementById('clock-icon-display');
    const alarm_list = document.getElementById('all-alarm-div')
    const alarm_ul = document.getElementById('set_alarms_details');

    function clock() {
        setInterval(renderClock, 1000);

        function renderClock() {
            time_heading.innerHTML = getTime();
            return;
        }

    }


    function getTime(date = null) {
        let flag = true;
        if (date == null) {
            date = new Date();
            flag = false;
        }
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        let strTime = ''
        if (flag) {
            strTime = `${hours}:${minutes} ${ampm}`;
        } else {
            strTime = `${hours}:${minutes}:${seconds} ${ampm}`;
        }
        return strTime;
    }


    function setAlarm() {
        document.addEventListener('submit', makeAlarm)

        function makeAlarm(event) {
            event.preventDefault();
            let hour = parseInt(document.getElementById('hour').value)
            let minute = parseInt(document.getElementById('minute').value)
            let zone = document.getElementById('zone').value


            if (!isNaN(hour) && !isNaN(minute) && zone) {
                const alarm_time = getAlarmTime(hour, minute, zone)
                setLocalStorage(alarm_time)
                alarm_ul.innerHTML = '';
                renderAlarms();
            } else {
                alert('Please Fill Proper Values');
            }


        }

        function setLocalStorage(time) {
            const timeStamp = new Date().getUTCMilliseconds();
            const value = { id: timeStamp, 'alarm_time': time, status: true }
            let localSt = JSON.parse(localStorage.getItem('alarm_list'))
            localSt = [...(localSt || []), value];
            localSt = localStorage.setItem('alarm_list', JSON.stringify(localSt))
            localSt = localStorage.getItem('alarm_list')

        }


        


        function getAlarmTime(hour, minute, zone) {
            const alarm_time = new Date();
            const hours = zone == 'PM' ? 12 + parseInt(hour) : hour;
            const minutes = minute;
            alarm_time.setHours(hours);
            alarm_time.setMinutes(minutes);
            alarm_time.setSeconds(0);
            return alarm_time;
        }


      


        function stopAlarm() {
            icon.innerHTML = '<i class="fa-solid fa-clock fa-2xl"></i>'
            stopBtn.classList.add('hide');
            alarmAudio.pause();
            alarmAudio.currentTime = 0;

        }

        stopBtn.addEventListener('click', stopAlarm);


    }


    function ringBell() {
        playAudio();
        icon.innerHTML = '<i class="fa-solid fa-clock fa-bounce fa-2xl"></i>'
        stopBtn.classList.remove('hide')

    }

    function playAudio() {
        alarmAudio.play();
        alarmAudio.loop = true;
    }

    function renderAlarms() {
        let localSt = localStorage.getItem('alarm_list');
        localSt = JSON.parse(localSt)
        if (localSt.length > 0) {
            localSt.forEach(element => {
                let date = new Date(element.alarm_time);
                let time = getTime(date)
                let li = `
                <li class="alarm-detail ${!element.status ? 'text-color-grey' : ''}">
                <span>
                <i class="fa-solid fa-trash fa-xl delete-icon" data-delete-icon=${element.id}></i>        
                <h2>
                        ${time}
                        </h2>
                        </span>
                        <label class="switch">
                            <input type="checkbox" class="toggle" data-toggle-alarm=${element.id} ${element.status ? 'checked' : ''}>
                            <span class="slider round"></span>
                          </label>
                    </li>`

                alarm_ul.innerHTML += li;
            });
            alarm_list.style.display = 'block';
        } else {
            alarm_list.style.display = 'none';
        }

        setAllAlarms();

    }

    function setAllAlarms() {
        let localSt = localStorage.getItem('alarm_list');
        localSt = JSON.parse(localSt);
        if (localSt.length > 0) {
            localSt = localSt.filter(element => element.status == true);
            if(localSt.length > 0) {
                const current_time = new Date();
                let differences = localSt.map(element => {
                    let alarmDate = new Date(element.alarm_time);
                    return (alarmDate.getTime() - current_time.getTime())
                })

                differences.forEach(item => {
                    if (item > 0) {
                        let ring_alarm = setTimeout(function () {
                            ringBell();
                        }, item)
                    }
                })
            }
        }
    }



    function EventTrigger() {
        alarm_ul.addEventListener('click', MonitorEvents)

        function MonitorEvents(e) {
            const dataSet = e.target.dataset;
            if ('deleteIcon' in dataSet) {
                DeleteAlarm(dataSet['deleteIcon'])
            } else if ('toggleAlarm' in dataSet) {
                toggleAlarm(dataSet['toggleAlarm']);
            }
        }

        function DeleteAlarm(id) {
            if (id) {
                let localSt = localStorage.getItem('alarm_list');
                localSt = JSON.parse(localSt);
                if (localSt.length > 0){
                    localSt = localSt.filter(element => element.id != id);
                    localSt = localStorage.setItem('alarm_list', JSON.stringify(localSt));
                    alarm_ul.innerHTML = '';
                    renderAlarms();    
                }
            }

        }

        function toggleAlarm(id) {
            if (id) {
                let localSt = localStorage.getItem('alarm_list');
                localSt = JSON.parse(localSt);
                toggleObj = localSt.find(element => element.id == id);
                toggleObj['status'] = !toggleObj['status'];
                localSt = localSt.filter(element => element.id != id);
                localSt = [...localSt, toggleObj];
                localSt = localStorage.setItem('alarm_list', JSON.stringify(localSt));
                alarm_ul.innerHTML = '';
                renderAlarms();
            }

        }
    }

    EventTrigger()
    renderAlarms();
    clock();
    setAlarm();
}();