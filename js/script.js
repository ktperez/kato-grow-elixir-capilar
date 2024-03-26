document.addEventListener('DOMContentLoaded', function() {
    const chatBtn = document.getElementById('chat-btn');
    const chatPopup = document.getElementById('chat-popup');
    const closeBtn = document.getElementById('close-btn');
    const imageInput = document.getElementById('image-input'); // Movido aquí para estar disponible en toda la función
    const uploadLabel = document.getElementById('upload-label');

    // Función para hacer saltar el chat
    function jumpChat() {
        let originalBottom = chatPopup.style.bottom || '20px';
        let jumpHeight = 20; // Altura del salto en píxeles
        let duration = 100; // Duración en milisegundos
        let iterations = 5; // Número de iteraciones

        // Aplicar efecto de salto con transición
        chatPopup.style.transition = 'all 0.2s ease';

        for (let i = 0; i < iterations; i++) {
            setTimeout(() => {
                if (i % 2 === 0) {
                    chatPopup.style.bottom = (parseInt(originalBottom) + jumpHeight) + 'px';
                    chatPopup.style.transform = 'scale(1.1)';
                } else {
                    chatPopup.style.bottom = originalBottom;
                    chatPopup.style.transform = 'scale(1)';
                }
            }, i * duration);
        }
    }

    // Verificar si la imagen del botón se carga correctamente
    chatBtn.onerror = function() {
        console.error("Error al cargar la imagen del botón de chat.");
    };

    // Llamar a la función para hacer saltar el chat al cargar la página
    jumpChat();

    // Restaurar la posición del chat después del salto
    setTimeout(() => {
        chatPopup.style.bottom = '';
        chatPopup.style.transform = '';
        chatPopup.style.transition = ''; // Eliminar transición después del salto
    }, 1000); // Restaurar después de 1 segundo (1000 milisegundos)

    // Abrir la ventana emergente del chat al hacer clic en el botón de chat
    chatBtn.addEventListener('click', function() {
        chatPopup.style.display = 'block';
        jumpChat(); // Llamar al efecto de salto al abrir el chat
    });

    // Cerrar la ventana emergente del chat al hacer clic en el botón de cerrar
    closeBtn.addEventListener('click', function() {
        chatPopup.style.display = 'none';
    });

    // Enviar mensaje al servidor al hacer clic en Enviar o presionar Enter
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-query');

    sendBtn.addEventListener('click', function() {
        sendMessage();
    });

    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Función para enviar el mensaje al servidor
    function sendMessage() {
        let message = userInput.value.trim();

        if (message !== '') {
            // Aquí puedes realizar la lógica para enviar el mensaje al servidor,
            // ya sea mediante una petición fetch o mediante WebSockets, dependiendo de tu configuración del servidor
            // Por ejemplo:
            // fetch('/send-message', {
            //     method: 'POST',
            //     body: JSON.stringify({ message: message }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // })
            // .then(response => response.json())
            // .then(data => {
            //     const response = data.response;
            //     addMessage('bot', response);
            // });

            addMessage('user', message);
            userInput.value = '';
        }
    }

    // Función para agregar un mensaje al chat
    function addMessage(sender, message) {
        const chatDisplay = document.getElementById('chat-display');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        messageElement.innerText = message;
        chatDisplay.appendChild(messageElement);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    // Función para enviar imagen al servidor al hacer clic en el botón de subir imagen
    uploadLabel.addEventListener('click', function() {
        imageInput.click();
    });

    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                addImageMessage('user', imageData); // Agregar imagen al chat
                sendImageToServer(imageData); // Enviar imagen al servidor
            };
            reader.readAsDataURL(file);
        }
    });

    // Función para agregar la imagen al chat
    function addImageMessage(sender, imageData) {
        const chatDisplay = document.getElementById('chat-display');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;

        // Crear un elemento de imagen
        const imageElement = document.createElement('img');
        imageElement.src = imageData;
        imageElement.alt = 'Uploaded Image';

        // Insertar la imagen en el mensaje
        messageElement.appendChild(imageElement);

        // Agregar el mensaje al chat
        chatDisplay.appendChild(messageElement);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    // Función para enviar la imagen al servidor
    function sendImageToServer(imageData) {
        // Aquí puedes realizar la lógica para enviar la imagen al servidor,
        // ya sea mediante una petición fetch o mediante WebSockets, dependiendo de tu configuración del servidor
        // Por ejemplo:
        // fetch('/upload-image', {
        //     method: 'POST',
        //     body: JSON.stringify({ image: imageData }),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        // .then(response => response.json())
        // .then(data => {
        //     const response = data.response;
        //     addMessage('bot', response);
        // });
    }

    

});
