document.getElementById('calculate-price').addEventListener('click', function() {
    const departure = document.getElementById('departure').value;
    const destination = document.getElementById('destination').value;
    
    const tarifs = {
        'Kinshasa-Kampala': 200,
        'Kinshasa-Nairobi': 300,
        'Kinshasa-Dubai': 600,
        'Kinshasa-Chengdu': 700,
        'Kinshasa-Canada': 1000,
        'Kinshasa-Kindia': 250,
        'Lubumbashi-Kampala': 220,
        'Lubumbashi-Nairobi': 320,
        'Lubumbashi-Dubai': 620,
        'Lubumbashi-Chengdu': 720,
        'Lubumbashi-Canada': 1020,
        'Lubumbashi-Kindia': 270,
        'Goma-Kampala': 180,
        'Goma-Nairobi': 280,
        'Goma-Dubai': 580,
        'Goma-Chengdu': 680,
        'Goma-Canada': 980,
        'Goma-Kindia': 230,
        'Kisangani-Kampala': 190,
        'Kisangani-Nairobi': 290,
        'Kisangani-Dubai': 590,
        'Kisangani-Chengdu': 690,
        'Kisangani-Canada': 990,
        'Kisangani-Kindia': 240,
        'Béni-Kampala': 210,
        'Béni-Nairobi': 310,
        'Béni-Dubai': 610,
        'Béni-Chengdu': 710,
        'Béni-Canada': 1010,
        'Béni-Kindia': 260,
        'Bunia-Kampala': 230,
        'Bunia-Nairobi': 330,
        'Bunia-Dubai': 630,
        'Bunia-Chengdu': 730,
        'Bunia-Canada': 1030,
        'Bunia-Kindia': 280,
        'Isiro-Kampala': 250,
        'Isiro-Nairobi': 350,
        'Isiro-Dubai': 650,
        'Isiro-Chengdu': 750,
        'Isiro-Canada': 1050,
        'Isiro-Kindia': 300,
        'Bukavu-Kampala': 240,
        'Bukavu-Nairobi': 340,
        'Bukavu-Dubai': 640,
        'Bukavu-Chengdu': 740,
        'Bukavu-Canada': 1040,
        'Bukavu-Kindia': 290,
        'Butembo-Kampala': 260,
        'Butembo-Nairobi': 360,
        'Butembo-Dubai': 660,
        'Butembo-Chengdu': 760,
        'Butembo-Canada': 1060,
        'Butembo-Kindia': 310,
    };

    const route = `${departure}-${destination}`;
    const price = tarifs[route] || 'Tarif non disponible';
    
    document.getElementById('price').value = price + (typeof price === 'number' ? ' USD' : '');
    
    if (typeof price === 'number') {
        loadPayPalButton(price);
        setupMPesaPayment(price);
        setupVisaPayment(price);
    } else {
        document.getElementById('paypal-button-container').innerHTML = '';
    }
});

function loadPayPalButton(price) {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                saveReservation(details);
                alert('Transaction completed by ' + details.payer.name.given_name);
                sendConfirmationEmail(details);
            });
        }
    }).render('#paypal-button-container');
}

function setupMPesaPayment(price) {
    document.getElementById('mpesa-button').onclick = function() {
        const userDetails = prompt("Veuillez entrer votre numéro de téléphone M-Pesa (format: 07XXXXXXXX):");
        if (userDetails && userDetails.trim().length === 10 && !isNaN(userDetails.trim())) {
            const paymentDetails = {
                phone: userDetails.trim(),
                amount: price,
                currency: 'USD',
                description: `Paiement pour réservation de billet`
            };

            simulateMPesaPayment(paymentDetails);
        } else {
            alert("Numéro de téléphone M-Pesa invalide. Veuillez réessayer.");
        }
    };
}

function simulateMPesaPayment(paymentDetails) {
    // Simuler l'appel API à M-Pesa
    alert(`Paiement M-Pesa de ${paymentDetails.amount} ${paymentDetails.currency} effectué avec succès sur le numéro ${paymentDetails.phone}.`);

    const details = {
        payer: {
            name: {
                given_name: 'John',
                surname: 'Doe'
            },
            email_address: 'john.doe@example.com'
        }
    };
    saveReservation(details);
    sendConfirmationEmail(details);
}

function setupVisaPayment(price) {
    document.getElementById('visa-button').onclick = function() {
        alert(`Paiement Visa de ${price} USD effectué avec succès.`);
        const details = {
            payer: {
                name: {
                    given_name: 'John',
                    surname: 'Doe'
                },
                email_address: 'john.doe@example.com'
            }
        };
        saveReservation(details);
        sendConfirmationEmail(details);
    };
}

function saveReservation(details) {
    const reservation = {
        departure: document.getElementById('departure').value,
        destination: document.getElementById('destination').value,
        date: document.getElementById('date').value,
        price: document.getElementById('price').value
    };

    fetch('/save-reservation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservation)
    }).then(response => response.json()).then(data => {
        console.log('Réservation sauvegardée:', data);
    }).catch(error => {
        console.error('Erreur de sauvegarde de réservation:', error);
    });
}

function sendConfirmationEmail(details) {
    const templateParams = {
        to_name: details.payer.name.given_name,
        from_email: 'jochuabadimba@gmail.com',
        departure: reservation.departure,
        destination: reservation.destination,
        date: reservation.date,
        price: reservation.price
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            console.log('Email envoyé avec succès!', response.status, response.text);
        }, function(error) {
            console.error('Échec de l\'envoi de l\'email:', error);
        });
}
