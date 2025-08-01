document.addEventListener('DOMContentLoaded', function() {
  // Elementos de la interfaz
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status');
  const batteryDisplay = document.getElementById('battery');
  const speedDisplay = document.getElementById('speed');
  const signalDisplay = document.getElementById('signal');
  const operationTimeDisplay = document.getElementById('operation-time');
  const gripperHeightDisplay = document.getElementById('gripper-height');
  const gripperApertureDisplay = document.getElementById('gripper-aperture');

  // Botones de dirección
  const forwardBtn = document.getElementById('forward');
  const backwardBtn = document.getElementById('backward');
  const leftBtn = document.getElementById('left');
  const rightBtn = document.getElementById('right');
  const stopBtn = document.getElementById('stop');

  // Botones de la pinza
  const gripperUpBtn = document.getElementById('gripper-up');
  const gripperDownBtn = document.getElementById('gripper-down');
  const gripperOpenBtn = document.getElementById('gripper-open');
  const gripperCloseBtn = document.getElementById('gripper-close');

  // Variables de estado
  let isConnected = false;
  let currentSpeed = 0;
  let currentDirection = 'stop';
  let gripperHeight = 0; // 0-100%
  let gripperAperture = 0; // 0-100%
  let operationStartTime = null;
  let operationInterval = null;

  // Simular conexión
  setTimeout(() => {
    connectToVehicle();
  }, 2000);

  // Función para conectar con el vehículo
  function connectToVehicle() {
    statusText.textContent = "Conectando...";
    statusIndicator.className = "status-indicator connecting";

    // Simular tiempo de conexión
    setTimeout(() => {
      isConnected = true;
      statusText.textContent = "Conectado";
      statusIndicator.className = "status-indicator connected";
      updateBattery(85); // Valor inicial de batería
      startOperationTimer();
    }, 3000);
  }

  // Control de dirección
  function setDirection(direction) {
    if (!isConnected) return;

    currentDirection = direction;

    // Actualizar interfaz
    [forwardBtn, backwardBtn, leftBtn, rightBtn, stopBtn].forEach(btn => {
      btn.style.opacity = '1';
    });

    switch(direction) {
      case 'forward':
        forwardBtn.style.opacity = '0.6';
        currentSpeed = 50;
        break;
      case 'backward':
        backwardBtn.style.opacity = '0.6';
        currentSpeed = -30;
        break;
      case 'left':
        leftBtn.style.opacity = '0.6';
        break;
      case 'right':
        rightBtn.style.opacity = '0.6';
        break;
      case 'stop':
        stopBtn.style.opacity = '0.6';
        currentSpeed = 0;
        break;
    }

    updateSpeedDisplay();
    console.log(`Dirección: ${direction}, Velocidad: ${currentSpeed}%`);
  }

  // Control de la pinza
  function moveGripper(direction) {
    if (!isConnected) return;

    const step = 10; // Incremento/decremento por paso

    switch(direction) {
      case 'up':
        gripperHeight = Math.min(gripperHeight + step, 100);
        break;
      case 'down':
        gripperHeight = Math.max(gripperHeight - step, 0);
        break;
      case 'open':
        gripperAperture = Math.min(gripperAperture + step, 100);
        break;
      case 'close':
        gripperAperture = Math.max(gripperAperture - step, 0);
        break;
    }

    updateGripperDisplay();
    console.log(`Pinza - Altura: ${gripperHeight}%, Apertura: ${gripperAperture}%`);
  }

  // Actualizar displays
  function updateSpeedDisplay() {
    speedDisplay.textContent = `${Math.abs(currentSpeed)}%`;
    speedDisplay.style.color = currentSpeed === 0 ? 'var(--dark-color)' :
    currentSpeed > 0 ? 'var(--primary-color)' : 'var(--danger-color)';
  }

  function updateGripperDisplay() {
    gripperHeightDisplay.textContent = `${gripperHeight}%`;
    gripperApertureDisplay.textContent = `${gripperAperture}%`;
  }

  function updateBattery(percent) {
    batteryDisplay.textContent = `${percent}%`;

    // Cambiar color según el nivel de batería
    if (percent < 20) {
      batteryDisplay.style.color = 'var(--danger-color)';
    } else if (percent < 40) {
      batteryDisplay.style.color = 'var(--warning-color)';
    } else {
      batteryDisplay.style.color = 'var(--connected-color)';
    }

    // Simular descarga de batería durante la operación
    const dischargeRate = 0.1; // % por segundo
    const nextPercent = Math.max(0, percent - dischargeRate);
    setTimeout(() => updateBattery(nextPercent), 1000);
  }

  function startOperationTimer() {
    operationStartTime = new Date();
    operationInterval = setInterval(updateOperationTime, 1000);
  }

  function updateOperationTime() {
    const now = new Date();
    const diff = Math.floor((now - operationStartTime) / 1000); // diferencia en segundos
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    operationTimeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Event listeners para los botones de dirección
  forwardBtn.addEventListener('mousedown', () => setDirection('forward'));
  forwardBtn.addEventListener('touchstart', () => setDirection('forward'));

  backwardBtn.addEventListener('mousedown', () => setDirection('backward'));
  backwardBtn.addEventListener('touchstart', () => setDirection('backward'));

  leftBtn.addEventListener('mousedown', () => setDirection('left'));
  leftBtn.addEventListener('touchstart', () => setDirection('left'));

  rightBtn.addEventListener('mousedown', () => setDirection('right'));
  rightBtn.addEventListener('touchstart', () => setDirection('right'));

  stopBtn.addEventListener('click', () => setDirection('stop'));

  // Event listeners para soltar los botones de dirección
  [forwardBtn, backwardBtn, leftBtn, rightBtn].forEach(btn => {
    btn.addEventListener('mouseup', () => setDirection('stop'));
    btn.addEventListener('mouseleave', () => setDirection('stop'));
    btn.addEventListener('touchend', () => setDirection('stop'));
  });

  // Event listeners para los controles de la pinza
  gripperUpBtn.addEventListener('click', () => moveGripper('up'));
  gripperDownBtn.addEventListener('click', () => moveGripper('down'));
  gripperOpenBtn.addEventListener('click', () => moveGripper('open'));
  gripperCloseBtn.addEventListener('click', () => moveGripper('close'));

  // Para móviles: evitar zoom con doble toque
  document.addEventListener('dblclick', function(e) {
    e.preventDefault();
  }, { passive: false });

  // Inicializar displays
  setDirection('stop');
  updateGripperDisplay();
});
