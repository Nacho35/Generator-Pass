// Obtener los elementos del DOM
const passwordInput = document.getElementById("password");
const copyButton = document.getElementById("copy");
const generateButton = document.getElementById("generate");
const clearButton = document.getElementById("clear");
const rangeInput = document.getElementById("range");
const counterSpan = document.getElementById("counter");
const strengthBar = document.getElementById("strength-bar");
const labelStrength = document.getElementById("label-strength");
const strengthText = document.getElementById("strength-text");

// Función para generar contraseña
function generatePassword(length) {
	// Caracteres posibles para la contraseña
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
	let password = "";
	for (let i = 0; i < length; i++) {
		// Seleccionar un carácter aleatorio de los posibles
		password += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}
	return password;
}

// Función para copiar contraseña al portapapeles y mostrar toast
function copyPassword() {
	const password = passwordInput.value;
	if (password !== "") {
		navigator.clipboard
			.writeText(password)
			.then(() => {
				const toast = document.createElement("div");
				toast.textContent = "Copied Password!";
				toast.classList.add("toast");
				document.body.appendChild(toast);
				setTimeout(() => {
					toast.remove();
				}, 2000);
			})
			.catch((err) => {
				console.error("Error al copiar contraseña:", err);
			});
	}
}

// Función para limpiar contraseña
function clearPassword() {
	passwordInput.value = "";
}

// Eventos de los botones
generateButton.addEventListener("click", () => {
	// Generar contraseña con la longitud seleccionada
	const length = parseInt(rangeInput.value);
	const password = generatePassword(length);
	passwordInput.value = password;
	// Evaluar la fortaleza de la nueva contraseña
	let strength = evaluatePasswordStrength(password);
	document.getElementById("strength-result").innerText =
		"Password strength: " + strength;
});

copyButton.addEventListener("click", copyPassword);

clearButton.addEventListener("click", clearPassword);

// Actualizar contador de longitud de contraseña
rangeInput.addEventListener("input", () => {
	counterSpan.textContent = rangeInput.value;
	// Evaluar la fortaleza de la contraseña con la nueva longitud
	let password = document.getElementById("password").value;
	let strength = evaluatePasswordStrength(password);
	document.getElementById("strength-result").innerText =
		"Password strength: " + strength;
});

// Función para evaluar la fortaleza de la contraseña
function evaluatePasswordStrength(password) {
	if (password.length === 0) {
		labelStrength.style.display = "block";
	} else {
		labelStrength.style.display = "none";
	}

	if (password.length === 0) {
		// No evaluar fortaleza si no hay contraseña
		const strengthBar = document.getElementById("strength-bar");
		strengthBar.style.width = "0%";
		strengthBar.style.backgroundColor = "#ccc";
		return;
	}

	let strength = 0;

	// Longitud de la contraseña
	if (password.length <= 8) {
		strength -= 2; // Restar puntos por longitud débil
	} else if (password.length > 8 && password.length <= 16) {
		strength += 1; // Sumar puntos por longitud moderada
	} else if (password.length > 16 && password.length <= 24) {
		strength += 2; // Sumar puntos por longitud fuerte
	} else if (password.length > 24 && password.length <= 64) {
		strength += 3; // Sumar puntos por longitud muy fuerte
	}

	// Uso de mayúsculas y minúsculas
	if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
		strength += 1;
	}

	// Uso de números
	if (/\d/.test(password)) {
		strength += 1;
	}

	// Uso de caracteres especiales
	if (/[^A-Za-z0-9]/.test(password)) {
		strength += 1;
	}

	// Calcular la fortaleza total
	const strengthBar = document.getElementById("strength-bar");
	if (strength >= 6) {
		strengthBar.classList.remove("weak", "moderate", "strong");
		strengthBar.classList.add("very-strong");
		strengthBar.style.width = "100%";
		strengthBar.style.backgroundColor = "#1679ab"; // Azul para muy fuerte
	} else if (strength >= 4) {
		strengthBar.classList.remove("weak", "moderate", "very-strong");
		strengthBar.classList.add("strong");
		strengthBar.style.width = "75%";
		strengthBar.style.backgroundColor = "#519259"; // Verde para fuerte
	} else if (strength >= 2) {
		strengthBar.classList.remove("weak", "strong", "very-strong");
		strengthBar.classList.add("moderate");
		strengthBar.style.width = "50%";
		strengthBar.style.backgroundColor = "#fcde70"; // Amarillo para moderada
	} else {
		strengthBar.classList.remove("moderate", "strong", "very-strong");
		strengthBar.classList.add("weak");
		strengthBar.style.width = "25%";
		strengthBar.style.backgroundColor = "#dd5353"; // Rojo para débil
	}
}
