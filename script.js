document.addEventListener('DOMContentLoaded', function() {
  // Elementos de la interfaz
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status');
  const takeoffLandBtn = document.getElementById('takeoff-land');
  const emergencyBtn = document.getElementById('emergency');
  const photoBtn = document.getElementById('photo');
  const videoBtn = document.getElementById('video');
  const returnHomeBtn = document.getElementById('return-home');
  const batteryDisplay = document.getElementById('battery');
  const altitudeDisplay = document.getElementById('altitude');
  const signalDisplay = document.getElementById('signal');
  const flightTimeDisplay = document.getElementById('flight-time');

  // Variables de estado
  let isConnected = false;
  let isFlying = false;
  let flightStartTime = null;
  let flightInterval = null;
  let videoRecording = false;

  // Simular conexión (en una aplicación real, esto sería conectar con el dron)
  setTimeout(() => {
    connectToDrone();
  }, 2000);

  // Función para conectar con el dron
  function connectToDrone() {
    statusText.textContent = "Conectando...";
    statusIndicator.className = "status-indicator connecting";

    // Simular tiempo de conexión
    setTimeout(() => {
      isConnected = true;
      statusText.textContent = "Conectado";
      statusIndicator.className = "status-indicator connected";
      updateBattery(85); // Valor inicial de batería
    }, 3000);
  }

  // Control de joysticks
  setupJoystick('joystick-left', (x, y) => {
    // Joystick izquierdo: control de altura y rotación
    console.log(`Joystick izquierdo: X=${x.toFixed(2)}, Y=${y.toFixed(2)}`);
    // Enviar comandos al dron (simulado)
    updateAltitude(Math.round(-y * 10)); // Rango de -10 a 10 metros
  });

  setupJoystick('joystick-right', (x, y) => {
    // Joystick derecho: control de movimiento horizontal
    console.log(`Joystick derecho: X=${x.toFixed(2)}, Y=${y.toFixed(2)}`);
    // Enviar comandos al dron (simulado)
  });

  // Botón de despegue/aterrizaje
  takeoffLandBtn.addEventListener('click', function() {
    if (!isConnected) return;

    if (!isFlying) {
      // Despegar
      isFlying = true;
      takeoffLandBtn.innerHTML = '<i class="fas fa-landing"></i> Aterrizar';
      takeoffLandBtn.classList.add('btn-warning');
      takeoffLandBtn.classList.remove('btn-primary');
      startFlightTimer();
      updateAltitude(1); // Altura inicial después del despegue
    } else {
      // Aterrizar
      isFlying = false;
      takeoffLandBtn.innerHTML = '<i class="fas fa-rocket"></i> Despegar';
      takeoffLandBtn.classList.add('btn-primary');
      takeoffLandBtn.classList.remove('btn-warning');
      stopFlightTimer();
      updateAltitude(0); // Altura después de aterrizar
    }
  });

  // Botón de emergencia
  emergencyBtn.addEventListener('click', function() {
    if (!isConnected) return;

    // Detener motores inmediatamente
    isFlying = false;
    takeoffLandBtn.innerHTML = '<i class="fas fa-rocket"></i> Despegar';
    takeoffLandBtn.classList.add('btn-primary');
    takeoffLandBtn.classList.remove('btn-warning');
    stopFlightTimer();
    updateAltitude(0);

    alert("¡EMERGENCIA! Motores detenidos.");
  });

  // Botón de foto
  photoBtn.addEventListener('click', function() {
    if (!isConnected) return;
    alert("Foto tomada!");
  });

  // Botón de video
  videoBtn.addEventListener('click', function() {
    if (!isConnected) return;

    videoRecording = !videoRecording;

    if (videoRecording) {
      videoBtn.innerHTML = '<i class="fas fa-stop"></i> Detener';
      videoBtn.classList.add('btn-danger');
      videoBtn.classList.remove('btn-secondary');
    } else {
      videoBtn.innerHTML = '<i class="fas fa-video"></i> Video';
      videoBtn.classList.add('btn-secondary');
      videoBtn.classList.remove('btn-danger');
    }
  });

  // Botón de volver a casa
  returnHomeBtn.addEventListener('click', function() {
    if (!isConnected || !isFlying) return;

    alert("El dron está regresando al punto de despegue...");
    // Simular regreso a casa
    setTimeout(() => {
      isFlying = false;
      takeoffLandBtn.innerHTML = '<i class="fas fa-rocket"></i> Despegar';
      takeoffLandBtn.classList.add('btn-primary');
      takeoffLandBtn.classList.remove('btn-warning');
      stopFlightTimer();
      updateAltitude(0);
      alert("El dron ha llegado al punto de despegue.");
    }, 5000);
  });

  // Funciones de ayuda
  function updateBattery(percent) {
    batteryDisplay.textContent = `${percent}%`;

    // Cambiar color según el nivel de batería
    if (percent < 20) {
      batteryDisplay.style.color = 'var(--danger-color)';
    } else if (percent < 40) {
      batteryDisplay.style.color = 'var(--connecting-color)';
    } else {
      batteryDisplay.style.color = 'var(--connected-color)';
    }

    // Simular descarga de batería durante el vuelo
    if (isFlying) {
      const dischargeRate = 0.5; // % por segundo
      const nextPercent = Math.max(0, percent - dischargeRate);
      setTimeout(() => updateBattery(nextPercent), 1000);
    }
  }

  function updateAltitude(meters) {
    altitudeDisplay.textContent = `${meters} m`;
  }

  function startFlightTimer() {
    flightStartTime = new Date();
    flightInterval = setInterval(updateFlightTime, 1000);
  }

  function stopFlightTimer() {
    clearInterval(flightInterval);
  }

  function updateFlightTime() {
    const now = new Date();
    const diff = Math.floor((now - flightStartTime) / 1000); // diferencia en segundos
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    flightTimeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Configuración de joysticks táctiles
  function setupJoystick(joystickId, callback) {
    const joystick = document.getElementById(joystickId);
    const joystickHead = joystick.querySelector('.joystick-head');
    const joystickRect = joystick.getBoundingClientRect();
    const centerX = joystickRect.width / 2;
    const centerY = joystickRect.height / 2;
    const radius = joystickRect.width / 2;

    let touchId = null;

    function moveJoystick(clientX, clientY) {
      const rect = joystick.getBoundingClientRect();
      const x = clientX - rect.left - centerX;
      const y = clientY - rect.top - centerY;

      // Calcular distancia desde el centro
      const distance = Math.min(Math.sqrt(x*x + y*y), radius);
      const angle = Math.atan2(y, x);

      // Posición limitada al círculo del joystick
      const boundedX = distance * Math.cos(angle);
      const boundedY = distance * Math.sin(angle);

      // Mover el cabezal del joystick
      joystickHead.style.transform = `translate(calc(-50% + ${boundedX}px), calc(-50% + ${boundedY}px))`;

      // Normalizar valores entre -1 y 1
      const normalizedX = boundedX / radius;
      const normalizedY = boundedY / radius;

      callback(normalizedX, normalizedY);
    }

    function handleStart(e) {
      e.preventDefault();
      if (isConnected) {
        if (e.type === 'mousedown') {
          touchId = 'mouse';
          moveJoystick(e.clientX, e.clientY);
        } else if (e.type === 'touchstart' && e.touches.length === 1) {
          touchId = e.touches[0].identifier;
          moveJoystick(e.touches[0].clientX, e.touches[0].clientY);
        }
      }
    }

    function handleMove(e) {
      e.preventDefault();
      if (!touchId) return;

      if (e.type === 'mousemove' && touchId === 'mouse') {
        moveJoystick(e.clientX, e.clientY);
      } else if (e.type === 'touchmove') {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === touchId) {
            moveJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
            break;
          }
        }
      }
    }

    function handleEnd(e) {
      e.preventDefault();
      let shouldReset = false;

      if (e.type === 'mouseup' && touchId === 'mouse') {
        shouldReset = true;
      } else if (e.type === 'touchend') {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === touchId) {
            shouldReset = true;
            break;
          }
        }
      }

      if (shouldReset) {
        touchId = null;
        joystickHead.style.transform = 'translate(-50%, -50%)';
        callback(0, 0); // Resetear valores
      }
    }

    // Eventos para mouse
    joystick.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    // Eventos para pantalla táctil
    joystick.addEventListener('touchstart', handleStart);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  }
});
