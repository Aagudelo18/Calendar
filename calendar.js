document.addEventListener('DOMContentLoaded', function() {

    let resquest_calendar = "./events.json";
 
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: 'es', 

        events: function(info, successCallback, failureCallback) {
            fetch(resquest_calendar)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    let events = data.events.map(function(event) {
                        return {
                            title: event.palabraClave,
                            start: event.fechayhorainicio, // Fecha de inicio con formato correcto
                            end: event.fechayhorafin,     // Fecha de fin con formato correcto
                            extendedProps: {
                                ficha: event.ficha,
                                instructor: event.instructor,
                                sede: event.sede,
                                ambiente: event.ambiente
                            }
                        };
                    });
                    successCallback(events);
                })
                .catch(function(error) {
                    failureCallback(error);
                });
        },

        eventContent: function(info) {
            return {
                html: `
                <div style="overflow: hidden; font-size: 12px; position: relative; cursor: pointer; font-family: 'Inter', sans-serif;">
                    <div><strong>${info.event.title}</strong></div>
                    <div>Sede: ${info.event.extendedProps.sede}</div>
                    <div>Ambiente: ${info.event.extendedProps.ambiente}</div>
                </div>
                `
            }
        },

        eventMouseEnter: function(mouseEnterInfo) {
            let el = mouseEnterInfo.el;
            el.classList.add("relative");

            let newEl = document.createElement("div");
            let newElTitle = mouseEnterInfo.event.title;
            let newElContent = `
                <strong>${newElTitle}</strong>
                <div>Ficha: ${mouseEnterInfo.event.extendedProps.ficha}</div>
                <div>Instructor: ${mouseEnterInfo.event.extendedProps.instructor}</div>
                <div>Sede: ${mouseEnterInfo.event.extendedProps.sede}</div>
                <div>Ambiente: ${mouseEnterInfo.event.extendedProps.ambiente}</div>
                <div>Fecha: ${mouseEnterInfo.event.start.toLocaleDateString(
                    "es-US",
                    {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    }
                )}</div>
                <div>Hora: ${mouseEnterInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${mouseEnterInfo.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            `;

            newEl.innerHTML = `
            <div
                class="fc-hoverable-event"
                style="position: absolute; bottom: 100%; left: 0; width: 300px; height: auto; background-color: white; z-index: 50; border: 1px solid #e2e8f0; border-radius: 0.375rem; padding: 0.75rem; font-size: 14px; font-family: 'Inter', sans-serif; cursor: pointer;"
            >
                ${newElContent}
            </div>
          `;
          el.after(newEl);
        },

        eventMouseLeave: function(mouseLeaveInfo) {
            let el = document.querySelector(".fc-hoverable-event");
            if (el) el.remove();
        }
    });
    calendar.render();
});
