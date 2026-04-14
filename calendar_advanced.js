
class StudyCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.currentView = 'month';
        this.events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
        this.searchTimeout = null;
        this.reminders = [];

        this.init();
        this.render();
        this.updateStats();
        this.setupReminders();
    }

    init() {

        this.periodTitleElement = document.getElementById('periodTitle');
        this.calendarDaysElement = document.getElementById('calendarDays');
        this.prevPeriodBtn = document.getElementById('prevPeriod');
        this.nextPeriodBtn = document.getElementById('nextPeriod');
        this.todayBtn = document.getElementById('todayBtn');
        this.searchBtn = document.getElementById('searchBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.addEventBtn = document.getElementById('addEventBtn');

        this.monthViewBtn = document.getElementById('monthView');
        this.weekViewBtn = document.getElementById('weekView');
        this.dayViewBtn = document.getElementById('dayView');

        this.eventModal = document.getElementById('eventModal');
        this.quickEventModal = document.getElementById('quickEventModal');
        this.searchModal = document.getElementById('searchModal');
        this.eventForm = document.getElementById('eventForm');
        this.quickEventForm = document.getElementById('quickEventForm');

        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');


        this.formTabButtons = document.querySelectorAll('.form-tab');
        this.formTabContents = document.querySelectorAll('.form-tab-content');


        this.weekDaysHeader = document.getElementById('weekDaysHeader');
        this.weekBody = document.getElementById('weekBody');
        this.dayTitle = document.getElementById('dayTitle');
        this.timeSlots = document.getElementById('timeSlots');

        this.setupEventListeners();
    }

    setupEventListeners() {

        this.prevPeriodBtn.addEventListener('click', () => this.navigatePeriod(-1));
        this.nextPeriodBtn.addEventListener('click', () => this.navigatePeriod(1));
        this.todayBtn.addEventListener('click', () => this.goToToday());


        this.monthViewBtn.addEventListener('click', () => this.switchView('month'));
        this.weekViewBtn.addEventListener('click', () => this.switchView('week'));
        this.dayViewBtn.addEventListener('click', () => this.switchView('day'));

        this.searchBtn.addEventListener('click', () => this.openSearchModal());
        this.exportBtn.addEventListener('click', () => this.exportEvents());
        this.addEventBtn.addEventListener('click', () => this.openEventModal());


        this.setupModalListeners();


        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });


        this.formTabButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchFormTab(btn.dataset.tab));
        });

        document.addEventListener('dblclick', (e) => {
            if (e.target.closest('.calendar-day') && !e.target.closest('.event-indicator')) {
                const dayElement = e.target.closest('.calendar-day');
                const dayIndex = Array.from(dayElement.parentNode.children).indexOf(dayElement);
                this.openQuickEventModal(dayIndex);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'm':
                        e.preventDefault();
                        this.switchView('month');
                        break;
                    case 'w':
                        e.preventDefault();
                        this.switchView('week');
                        break;
                    case 'd':
                        e.preventDefault();
                        this.switchView('day');
                        break;
                    case 't':
                        e.preventDefault();
                        this.goToToday();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.openEventModal();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.openSearchModal();
                        break;
                }
            }
        });
    }

    setupModalListeners() {

        document.getElementById('closeEventModal').addEventListener('click', () => this.closeEventModal());
        document.getElementById('cancelEvent').addEventListener('click', () => this.closeEventModal());
        this.eventForm.addEventListener('submit', (e) => this.saveEventHandler(e));


        document.getElementById('closeQuickEventModal').addEventListener('click', () => this.closeQuickEventModal());
        document.getElementById('cancelQuickEvent').addEventListener('click', () => this.closeQuickEventModal());
        this.quickEventForm.addEventListener('submit', (e) => this.saveQuickEventHandler(e));


        document.getElementById('closeSearchModal').addEventListener('click', () => this.closeSearchModal());
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('searchType').addEventListener('change', () => this.handleSearch());
        document.getElementById('searchDateRange').addEventListener('change', () => this.handleSearch());

  
        [this.eventModal, this.quickEventModal, this.searchModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
    }

    render() {
        this.updatePeriodTitle();
        this.renderCurrentView();
        this.renderEvents();
        this.updateStats();
    }

    switchView(view) {
        this.currentView = view;

  
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${view}View`).classList.add('active');

  
        document.querySelectorAll('.calendar-view').forEach(view => view.classList.remove('active'));
        document.getElementById(`${view}ViewContainer`).classList.add('active');

        this.render();
    }

    navigatePeriod(direction) {
        switch (this.currentView) {
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() + direction);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
                break;
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() + direction);
                break;
        }
        this.render();
    }

    goToToday() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.render();
    }

    updatePeriodTitle() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        switch (this.currentView) {
            case 'month':
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                   'July', 'August', 'September', 'October', 'November', 'December'];
                this.periodTitleElement.textContent = `${monthNames[month]} ${year}`;
                break;
            case 'week':
                const weekStart = new Date(this.currentDate);
                weekStart.setDate(this.currentDate.getDate() - this.currentDate.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                this.periodTitleElement.textContent = `${this.formatDate(weekStart)} - ${this.formatDate(weekEnd)}`;
                break;
            case 'day':
                this.periodTitleElement.textContent = this.formatDate(this.currentDate, true);
                break;
        }
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'month':
                this.renderMonthView();
                break;
            case 'week':
                this.renderWeekView();
                break;
            case 'day':
                this.renderDayView();
                break;
        }
    }

    renderMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        this.calendarDaysElement.innerHTML = '';

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 42; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';

            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dayNumber = currentDate.getDate();
            const isCurrentMonth = currentDate.getMonth() === month;
            const isToday = currentDate.toDateString() === today.toDateString();
            const isSelected = currentDate.toDateString() === this.selectedDate.toDateString();
            const dateKey = this.formatDateKey(currentDate);
            const dayEvents = this.events[dateKey] || [];

            dayElement.innerHTML = `
                <span class="day-number ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}">
                    ${dayNumber}
                </span>
                <div class="day-events">
                    ${dayEvents.slice(0, 3).map(event => `
                        <div class="day-event ${event.type}" title="${event.title}">
                            <span class="event-dot"></span>
                            ${event.time ? `<span class="event-time">${event.time}</span>` : ''}
                        </div>
                    `).join('')}
                    ${dayEvents.length > 3 ? `<div class="more-events">+${dayEvents.length - 3} more</div>` : ''}
                </div>
            `;

            if (isCurrentMonth) {
                dayElement.addEventListener('click', () => this.selectDate(currentDate));
            }

            this.calendarDaysElement.appendChild(dayElement);
        }
    }

    renderWeekView() {
        const weekStart = new Date(this.currentDate);
        weekStart.setDate(this.currentDate.getDate() - this.currentDate.getDay());

        this.weekDaysHeader.innerHTML = '';

        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = day.toDateString() === this.selectedDate.toDateString();

            this.weekDaysHeader.innerHTML += `
                <div class="week-day-header ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" onclick="calendar.selectDate(new Date('${day.toISOString()}'))">
                    <div class="day-name">${day.toLocaleDateString('en', { weekday: 'short' })}</div>
                    <div class="day-date">${day.getDate()}</div>
                </div>
            `;
        }


        this.weekBody.innerHTML = '';

        for (let hour = 0; hour < 24; hour++) {
            this.weekBody.innerHTML += `
                <div class="week-row">
                    <div class="time-column">
                        <span class="time-label">${hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}</span>
                    </div>
                    <div class="week-day-columns">
                        ${Array.from({length: 7}, (_, i) => {
                            const day = new Date(weekStart);
                            day.setDate(weekStart.getDate() + i);
                            const dateKey = this.formatDateKey(day);
                            const dayEvents = this.events[dateKey] || [];
                            const hourEvents = dayEvents.filter(event => {
                                if (!event.time) return false;
                                const eventHour = parseInt(event.time.split(':')[0]);
                                return eventHour === hour;
                            });

                            return `
                                <div class="week-day-column" data-date="${dateKey}">
                                    ${hourEvents.map(event => `
                                        <div class="week-event ${event.type}" data-event-id="${event.id}" onclick="calendar.editEvent('${dateKey}', '${event.id}')">
                                            <div class="event-title">${event.title}</div>
                                            <div class="event-time">${event.time}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
    }

    renderDayView() {
        this.dayTitle.textContent = this.formatDate(this.currentDate, true);

        this.timeSlots.innerHTML = '';

        const dateKey = this.formatDateKey(this.currentDate);
        const dayEvents = this.events[dateKey] || [];

        for (let hour = 0; hour < 24; hour++) {
            const hourEvents = dayEvents.filter(event => {
                if (!event.time) return false;
                const eventHour = parseInt(event.time.split(':')[0]);
                return eventHour === hour;
            });

            this.timeSlots.innerHTML += `
                <div class="time-slot">
                    <div class="time-label">${hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`}</div>
                    <div class="time-events">
                        ${hourEvents.map(event => `
                            <div class="day-event ${event.type}" data-event-id="${event.id}">
                                <div class="event-content">
                                    <div class="event-title-section">
                                        <div class="event-type-icon ${event.type}">${this.getEventTypeIcon(event.type)}</div>
                                        <div class="event-title">${event.title}</div>
                                    </div>
                                    <div class="event-meta">
                                        ${event.time} - ${event.endTime || 'End time not set'}
                                        ${event.location ? ` • ${event.location}` : ''}
                                    </div>
                                    ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                                    <div class="event-badges">
                                        <span class="event-type-badge ${event.type}">${this.getEventTypeLabel(event.type)}</span>
                                        ${event.priority && event.priority !== 'medium' ? `<span class="priority-badge ${event.priority}">${event.priority}</span>` : ''}
                                        ${event.recurrence && event.recurrence !== 'none' ? `<span class="recurrence-badge"><i class="fas fa-redo"></i> ${event.recurrence}</span>` : ''}
                                    </div>
                                </div>
                                <div class="event-actions">
                                    <button onclick="calendar.editEvent('${dateKey}', '${event.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="calendar.deleteEvent('${dateKey}', '${event.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    selectDate(date) {
        this.selectedDate = date;
        this.renderEvents();
        this.updateSelectedDateHighlight();
    }

    updateSelectedDateHighlight() {
        document.querySelectorAll('.day-number.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.week-day-header.selected').forEach(el => el.classList.remove('selected'));

        const selectedDateStr = this.selectedDate.toDateString();

        document.querySelectorAll('.day-number').forEach(el => {
            const dayElement = el.closest('.calendar-day');
            if (dayElement) {
                const dayIndex = Array.from(dayElement.parentNode.children).indexOf(dayElement);
                
            }
        });
    }

    renderEvents() {
        const dateKey = this.formatDateKey(this.selectedDate);
        const dayEvents = this.events[dateKey] || [];

        const selectedDateTitle = document.getElementById('selectedDateTitle');
        selectedDateTitle.textContent = this.formatDate(this.selectedDate, true);

        const eventsList = document.getElementById('eventsList');

        if (dayEvents.length === 0) {
            eventsList.innerHTML = `
                <div class="no-events">
                    <i class="fas fa-calendar-check"></i>
                    <p>No events scheduled</p>
                    <button class="add-first-event" onclick="calendar.openEventModal()">Add your first event</button>
                </div>
            `;
        } else {
            eventsList.innerHTML = dayEvents.map((event, index) => `
                <div class="event-item ${event.priority || 'medium'}" data-event-id="${event.id || index}">
                    <div class="event-header">
                        <div class="event-title-section">
                            <div class="event-type-icon ${event.type}">${this.getEventTypeIcon(event.type)}</div>
                            <div class="event-title">${event.title}</div>
                        </div>
                        <div class="event-actions">
                            <button class="edit-event" onclick="calendar.editEvent('${dateKey}', '${event.id || index}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-event" onclick="calendar.deleteEvent('${dateKey}', '${event.id || index}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    ${event.time ? `<div class="event-time"><i class="fas fa-clock"></i> ${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</div>` : ''}
                    ${event.location ? `<div class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</div>` : ''}
                    <div class="event-badges">
                        <span class="event-type-badge ${event.type}">${this.getEventTypeLabel(event.type)}</span>
                        ${event.priority && event.priority !== 'medium' ? `<span class="priority-badge ${event.priority}">${event.priority}</span>` : ''}
                        ${event.recurrence && event.recurrence !== 'none' ? `<span class="recurrence-badge"><i class="fas fa-redo"></i> ${event.recurrence}</span>` : ''}
                    </div>
                    ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                </div>
            `).join('');
        }
    }

    updateStats() {
        const allEvents = Object.values(this.events).flat();
        const upcomingEvents = allEvents.filter(event => new Date(event.date) >= new Date());
        const completedEvents = allEvents.filter(event => event.completed);

        document.getElementById('totalEvents').textContent = allEvents.length;
        document.getElementById('upcomingEvents').textContent = upcomingEvents.length;
        document.getElementById('completedEvents').textContent = completedEvents.length;

        const categories = ['study', 'exam', 'assignment', 'meeting', 'other'];
        categories.forEach(category => {
            const count = allEvents.filter(event => event.type === category).length;
            document.getElementById(`${category}Count`).textContent = count;
        });
    }

    switchTab(tabName) {
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    switchFormTab(tabName) {
        this.formTabButtons.forEach(btn => btn.classList.remove('active'));
        this.formTabContents.forEach(content => content.classList.remove('active'));

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    openEventModal(eventToEdit = null) {
        const modalTitle = document.getElementById('modalTitle');

        if (eventToEdit) {
            modalTitle.textContent = 'Edit Event';
            this.populateForm(eventToEdit);
        } else {
            modalTitle.textContent = 'Add New Event';
            this.eventForm.reset();
            document.getElementById('eventDate').value = this.formatDateInput(this.selectedDate);
            this.switchFormTab('basic');
        }

        this.eventModal.classList.add('active');
    }

    openQuickEventModal(dayIndex) {
        const startDate = new Date(this.currentDate);
        startDate.setDate(1);
        startDate.setDate(startDate.getDate() - startDate.getDay() + dayIndex);

        this.selectedDate = startDate;
        this.quickEventModal.classList.add('active');
        document.getElementById('quickEventTitle').focus();
    }

    openSearchModal() {
        this.searchModal.classList.add('active');
        document.getElementById('searchInput').focus();
    }

    closeEventModal() {
        this.eventModal.classList.remove('active');
        this.eventForm.reset();
    }

    closeQuickEventModal() {
        this.quickEventModal.classList.remove('active');
        this.quickEventForm.reset();
    }

    closeSearchModal() {
        this.searchModal.classList.remove('active');
        document.getElementById('searchInput').value = '';
        document.getElementById('searchResults').innerHTML = '';
    }

    closeAllModals() {
        this.closeEventModal();
        this.closeQuickEventModal();
        this.closeSearchModal();
    }

    saveEventHandler(e) {
        e.preventDefault();

        const formData = new FormData(this.eventForm);
        const eventData = {
            id: Date.now().toString(),
            title: formData.get('eventTitle'),
            date: formData.get('eventDate'),
            endDate: formData.get('eventEndDate') || formData.get('eventDate'),
            time: formData.get('eventTime'),
            endTime: formData.get('eventEndTime'),
            type: formData.get('eventType'),
            description: formData.get('eventDescription'),
            recurrence: formData.get('eventRecurrence'),
            reminder: formData.get('eventReminder'),
            priority: formData.get('eventPriority'),
            location: formData.get('eventLocation'),
            allDay: formData.get('eventAllDay') === 'on',
            completed: false,
            created: new Date().toISOString()
        };

        const dateKey = eventData.date;
        if (!this.events[dateKey]) {
            this.events[dateKey] = [];
        }

        const editIndex = this.eventForm.dataset.editIndex;
        if (editIndex !== undefined) {
            const existingEvent = this.events[dateKey][parseInt(editIndex)];
            eventData.id = existingEvent.id;
            this.events[dateKey][parseInt(editIndex)] = eventData;
            delete this.eventForm.dataset.editIndex;
        } else {
            this.events[dateKey].push(eventData);
        }

        this.saveEvents();
        this.render();
        this.closeEventModal();

        if (eventData.reminder && eventData.reminder !== 'none') {
            this.scheduleReminder(eventData);
        }

        showNotification('Event saved successfully!');
    }

    saveQuickEventHandler(e) {
        e.preventDefault();

        const title = document.getElementById('quickEventTitle').value.trim();
        if (!title) return;

        const eventData = {
            id: Date.now().toString(),
            title: title,
            date: this.formatDateKey(this.selectedDate),
            type: 'other',
            completed: false,
            created: new Date().toISOString()
        };

        const dateKey = eventData.date;
        if (!this.events[dateKey]) {
            this.events[dateKey] = [];
        }

        this.events[dateKey].push(eventData);

        this.saveEvents();
        this.render();
        this.closeQuickEventModal();

        showNotification('Event added successfully!');
    }

    editEvent(dateKey, eventId) {
        const eventIndex = this.events[dateKey].findIndex(event => (event.id || event.index) == eventId);
        if (eventIndex === -1) return;

        const event = this.events[dateKey][eventIndex];
        this.eventForm.dataset.editIndex = eventIndex;
        this.openEventModal(event);
    }

    deleteEvent(dateKey, eventId) {
        const eventIndex = this.events[dateKey].findIndex(event => (event.id || event.index) == eventId);
        if (eventIndex === -1) return;

        if (confirm('Are you sure you want to delete this event?')) {
            this.events[dateKey].splice(eventIndex, 1);
            if (this.events[dateKey].length === 0) {
                delete this.events[dateKey];
            }
            this.saveEvents();
            this.render();
            showNotification('Event deleted successfully!');
        }
    }

    handleSearch(query = '') {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            const typeFilter = document.getElementById('searchType').value;
            const dateFilter = document.getElementById('searchDateRange').value;

            let results = [];

            Object.entries(this.events).forEach(([dateKey, dayEvents]) => {
                dayEvents.forEach(event => {
                    const matchesQuery = !query ||
                        event.title.toLowerCase().includes(query.toLowerCase()) ||
                        (event.description && event.description.toLowerCase().includes(query.toLowerCase()));

                    const matchesType = typeFilter === 'all' || event.type === typeFilter;

                    let matchesDate = true;
                    if (dateFilter !== 'all') {
                        const eventDate = new Date(event.date);
                        const today = new Date();
                        const weekFromNow = new Date();
                        weekFromNow.setDate(today.getDate() + 7);

                        switch (dateFilter) {
                            case 'today':
                                matchesDate = eventDate.toDateString() === today.toDateString();
                                break;
                            case 'week':
                                matchesDate = eventDate >= today && eventDate <= weekFromNow;
                                break;
                            case 'month':
                                matchesDate = eventDate.getMonth() === today.getMonth() &&
                                             eventDate.getFullYear() === today.getFullYear();
                                break;
                        }
                    }

                    if (matchesQuery && matchesType && matchesDate) {
                        results.push({ ...event, dateKey });
                    }
                });
            });

            this.displaySearchResults(results);
        }, 300);
    }

    displaySearchResults(results) {
        const searchResults = document.getElementById('searchResults');

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No events found</div>';
            return;
        }

        searchResults.innerHTML = results.map(event => `
            <div class="search-result-item" onclick="calendar.selectDate(new Date('${event.date}'))">
                <div class="result-header">
                    <div class="result-title">${event.title}</div>
                    <div class="result-date">${this.formatDate(new Date(event.date))}</div>
                </div>
                <div class="result-meta">
                    <span class="result-type ${event.type}">${this.getEventTypeLabel(event.type)}</span>
                    ${event.time ? `<span class="result-time">${event.time}</span>` : ''}
                </div>
                ${event.description ? `<div class="result-description">${event.description}</div>` : ''}
            </div>
        `).join('');
    }

    exportEvents() {
        const dataStr = JSON.stringify(this.events, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `studyflow-calendar-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        showNotification('Calendar exported successfully!');
    }

    scheduleReminder(event) {
        if (!event.reminder || event.reminder === 'none') return;

        const eventDateTime = new Date(`${event.date}T${event.time || '00:00'}`);
        let reminderTime;

        switch (event.reminder) {
            case '5min':
                reminderTime = new Date(eventDateTime.getTime() - 5 * 60 * 1000);
                break;
            case '15min':
                reminderTime = new Date(eventDateTime.getTime() - 15 * 60 * 1000);
                break;
            case '30min':
                reminderTime = new Date(eventDateTime.getTime() - 30 * 60 * 1000);
                break;
            case '1hour':
                reminderTime = new Date(eventDateTime.getTime() - 60 * 60 * 1000);
                break;
            case '1day':
                reminderTime = new Date(eventDateTime.getTime() - 24 * 60 * 60 * 1000);
                break;
        }

        if (reminderTime > new Date()) {
            const reminderId = setTimeout(() => {
                this.showReminder(event);
            }, reminderTime - new Date());

            this.reminders.push({ id: reminderId, eventId: event.id });
        }
    }

    showReminder(event) {
        const notification = document.createElement('div');
        notification.className = 'reminder-notification';
        notification.innerHTML = `
            <div class="reminder-content">
                <i class="fas fa-bell"></i>
                <div class="reminder-text">
                    <strong>Reminder:</strong> ${event.title}
                    ${event.time ? ` at ${event.time}` : ''}
                </div>
                <button class="reminder-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    setupReminders() {
        Object.values(this.events).flat().forEach(event => {
            if (event.reminder && event.reminder !== 'none') {
                this.scheduleReminder(event);
            }
        });
    }

    populateForm(event) {
        document.getElementById('eventTitle').value = event.title || '';
        document.getElementById('eventDate').value = event.date || '';
        document.getElementById('eventEndDate').value = event.endDate || '';
        document.getElementById('eventTime').value = event.time || '';
        document.getElementById('eventEndTime').value = event.endTime || '';
        document.getElementById('eventType').value = event.type || 'other';
        document.getElementById('eventDescription').value = event.description || '';
        document.getElementById('eventRecurrence').value = event.recurrence || 'none';
        document.getElementById('eventReminder').value = event.reminder || 'none';
        document.getElementById('eventPriority').value = event.priority || 'medium';
        document.getElementById('eventLocation').value = event.location || '';
        document.getElementById('eventAllDay').checked = event.allDay || false;
    }

    saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(this.events));
    }

    formatDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    formatDateInput(date) {
        return date.toISOString().split('T')[0];
    }

    formatDate(date, full = false) {
        if (full) {
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    getEventTypeIcon(type) {
        const icons = {
            study: '📚',
            exam: '📝',
            assignment: '📋',
            meeting: '👥',
            project: '🚀',
            other: '📌'
        };
        return icons[type] || '📌';
    }

    getEventTypeLabel(type) {
        const labels = {
            study: 'Study Session',
            exam: 'Exam',
            assignment: 'Assignment',
            meeting: 'Meeting',
            project: 'Project',
            other: 'Other'
        };
        return labels[type] || 'Other';
    }
}

let calendar;
document.addEventListener('DOMContentLoaded', () => {
    calendar = new StudyCalendar();
});