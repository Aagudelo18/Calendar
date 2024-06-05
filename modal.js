document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close');
    const agendarButton = document.getElementById('agendarButton');
    const eventForm = document.getElementById('eventForm');

    // Mostrar el modal cuando se hace clic en el botón "Agendar"
    agendarButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    // Cerrar el modal cuando se hace clic en la "X"
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Cerrar el modal cuando se hace clic fuera del área del modal
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Manejar el envío del formulario
    eventForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que se envíe el formulario automáticamente

        // Capturar los valores del formulario
        const formData = new FormData(eventForm);
        const newEvent = {
            "ficha": formData.get("ficha"),
            "palabraClave": formData.get("palabraClave"),
            "instructor": document.getElementById('instructorSelect').value,
            "sede": formData.get("sede"),
            "ambiente": formData.get("ambiente"),
            "fechayhorainicio": formData.get("fechaInicio"),
            "fechayhorafin": formData.get("fechaFin")
        };

        // Obtener los eventos actuales del archivo events.json
        fetch("./events.json")
            .then(response => response.json())
            .then(data => {
                // Agregar el nuevo evento al array de eventos
                data.events.push(newEvent);

                // Escribir los datos actualizados en el archivo events.json
                fetch("./events.json", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                .then(() => {
                    // Cerrar el modal después de guardar el evento
                    modal.style.display = 'none';

                    // Recargar el calendario para reflejar los cambios
                    window.location.reload();
                })
                .catch(error => console.error("Error al guardar el evento: ", error));
            })
            .catch(error => console.error("Error al obtener los eventos: ", error));
    });
});
