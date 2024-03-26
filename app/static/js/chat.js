$(document).ready(function(){
    // Mostrar la bola emergente pequeña
    $('.chat-ball').click(function(){
        $(this).hide();
        $('.chat-popup').fadeIn();
    });

    // Cerrar la bola emergente completa
    $('#close-btn').click(function(){
        $('.chat-popup').fadeOut();
        $('.chat-ball').fadeIn();
    });

    // Enviar mensaje al hacer clic en Enviar
    $('#send-btn').click(function(){
        sendMessage();
    });

    // Enviar mensaje al presionar Enter en el campo de texto
    $('#user-input').keypress(function(event){
        if (event.which == 13) {
            sendMessage();
        }
    });

    // Función para enviar mensaje
    function sendMessage(){
        var userMessage = $('#user-input').val();
        if (userMessage.trim() !== '') {
            $('#chat-box').append('<div class="message user-message">' + userMessage + '</div>');
            $('#user-input').val('');
            playMessageSound();
            
            // Aquí puedes enviar la imagen si está presente
            sendImage();
            
            // Convertir el mensaje del usuario a minúsculas para comparar
            userMessage = userMessage.toLowerCase();

            // Definir preguntas y respuestas
            var queryPatterns = {
                "hola": "¡Hola! Soy Kato, ¿En qué puedo ayudarte hoy?",
                "producto": "Tenemos disponible el Elixir Capilar Kato Capilar, ideal para cabello, cejas y barba. ¿Te gustaría conocer más detalles?",
                "si": "El elixir capilar kato es un compuesto de diferentes aceites entre estos encontraras los mejores aceites para el cuidado capilar como lo son: aceite de ricino, jojoba, argan y vitamina E. En este producto encontraras la solucion ideal para cualquier tipo de cabello",
                "frecuencia": "Se recomienda aplicar Kato Capilar de 3 a 5 veces por semana en el cabello.",
                "gotas": "Debes aplicar un promedio de 20 a 25 gotas en todo el cuero cabelludo para una aplicación efectiva.",
                "barba": "Se sugiere aplicar Kato Capilar de 3 a 5 veces por semana en la barba.",
                "barba_cantidad": "La cantidad adecuada es un promedio de 7 a 12 gotas en toda la zona de la barba que deseas hidratar.",
                "cejas": "Se recomienda aplicar Kato Capilar entre 2 a 3 veces por semana en las cejas .",
                "pestañas": "Se recomienda aplicar Kato Capilar entre 2 a 3 veces por semana en las o pestañas.",
                "uso": "Unta la brocha de tu máscara de pestañas con nuestro elixir y cepilla bien las cejas o pestañas para una aplicación uniforme.",
                "precauciones": "Debido a que es un óleo capilar, se recomienda usarlo gradualmente para evitar irritaciones. Comienza con 3 aplicaciones a la semana y aumenta gradualmente.",
                "ingredientes": "Nuestro producto está elaborado con aceites esenciales como argán, jojoba y ricino, dedicados a la hidratación y estimulación del crecimiento capilar.",
                "irritación" : "En caso de irritación, suspende el uso del producto hasta que la irritación desaparezca completamente.",
                "comprar": "Puedes adquirir Kato Capilar en nuestra tienda en línea. ¿Te gustaría conocer más sobre cómo comprarlo?",
                "envio": "Ofrecemos envíos gratuitos para compras superiores a $150COP. ¿Necesitas más información sobre nuestros envíos?",
                "final": "Recuerda mantener tu cabello limpio con productos adecuados, evita el exceso de calor y mantén la hidratación. El Elixir Capilar Kato Capilar es un complemento perfecto para estimular el crecimiento y la salud capilar.",
                "gracias": "¡Espero haber sido de ayuda! ¿Hay algo más en lo que pueda asistirte?"
            };

            // Buscar todas las coincidencias entre la consulta del usuario y los patrones definidos
            var responses = [];
            for (var pattern in queryPatterns) {
                if (userMessage.includes(pattern)) {
                    var response = queryPatterns[pattern];
                    responses.push(response);
                }
            }

            // Mostrar todas las respuestas encontradas
            if (responses.length > 0) {
                responses.forEach(function(response) {
                    $('#chat-box').append('<div class="message kato-message">' + response + '</div>');
                    playMessageSound();
                });
            } else {
                // Si no se encuentra una coincidencia, enviar la consulta al servidor
                sendToServer(userMessage);
            }
        }
    }

    // Subir imagen (solo para fines de visualización, sin subida real)
    $('#image-btn').click(function(){
        $('#image-input').click();
    });

    $('#image-input').change(function(){
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(event){
                var imageUrl = event.target.result;
                $('#chat-box').append('<div class="message user-message"><img src="' + imageUrl + '" class="uploaded-image" alt="Uploaded Image"></div>');
                playMessageSound();
                
                // Aquí puedes enviar la imagen si está presente
                sendImage(file);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Función para enviar la imagen al servidor
    function sendImage(image){
        var formData = new FormData();
        formData.append('image', image);
        
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: formData,
            contentType: false,
            processData: false,
            success: function(data) {
                var prediction = data.prediction;
                $('#chat-box').append('<div class="message kato-message">' + prediction + '</div>');
                playMessageSound();
                
                // Mostrar la ventana emergente con la predicción
                showPrediction(prediction);
            },
            error: function(xhr, status, error) {
                console.error('Error al enviar la imagen:', error);
            }
        });
    }
    
    // Reproducir sonido al enviar un mensaje
    function playMessageSound(){
        var audio = new Audio('static/audios/message.mp3');
        audio.play();
    }

    // Mostrar la bola emergente al cargar la página
    $('.chat-ball').show();

});

