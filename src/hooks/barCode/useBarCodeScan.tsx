import { useState, useEffect, useCallback, useRef } from "react";

interface UseBarcodeScanOptions {
  /**
   * Función a ejecutar cuando se detecta un código de barras completo
   */
  onScan?: (barcode: string) => void;

  /**
   * Determina si el hook está activo y escuchando escaneos
   * @default true
   */
  enabled?: boolean;

  /**
   * Tiempo máximo (en ms) entre caracteres para considerarse parte del mismo escaneo
   * @default 50
   */
  maxDelayBetweenChars?: number;

  /**
   * Tiempo adicional (en ms) a esperar después del último carácter antes de considerar completo el escaneo
   * @default 20
   */
  finalizationDelay?: number;

  /**
   * Longitud mínima esperada para un código de barras válido
   * @default 5
   */
  minBarcodeLength?: number;

  /**
   * Longitud máxima esperada para un código de barras válido
   * @default 20
   */
  maxBarcodeLength?: number;

  /**
   * Tiempo de espera (en ms) antes de permitir un nuevo escaneo del mismo código
   * @default 1000
   */
  duplicateScanDelay?: number;

  /**
   * Patrón regex para validar el formato del código de barras
   * Si no se proporciona, se acepta cualquier formato
   */
  barcodePattern?: RegExp;

  /**
   * Si es true, se procesará la entrada manual del teclado como códigos de barras
   * @default false
   */
  processManualInput?: boolean;
}

interface UseBarcodeScanResult {
  /**
   * El último código de barras escaneado
   */
  barcode: string;

  /**
   * Indica si actualmente se está escaneando un código de barras
   */
  isScanning: boolean;

  /**
   * Función para borrar el último código de barras escaneado
   */
  clearBarcode: () => void;

  /**
   * Función para forzar la finalización del escaneo actual
   */
  forceFinalize: () => void;
}

/**
 * Hook personalizado para detectar escaneos de códigos de barras
 */
function useBarcodeScan({
  onScan,
  enabled = true,
  maxDelayBetweenChars = 50,
  finalizationDelay = 20,
  minBarcodeLength = 5,
  maxBarcodeLength = 20,
  duplicateScanDelay = 1000,
  barcodePattern,
  processManualInput = false,
}: UseBarcodeScanOptions = {}): UseBarcodeScanResult {
  const [barcode, setBarcode] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Referencias para persistir valores entre renderizados
  const barcodeBuffer = useRef<string>("");
  const lastCharTime = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScannedBarcode = useRef<string>("");
  const lastScanTime = useRef<number>(0);
  const scanStartTime = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);
  const manualInputRef = useRef<boolean>(false);
  const scanSpeedRef = useRef<number[]>([]);
  const lastValidScanTimeRef = useRef<number>(0);

  /**
   * Valida si un código de barras cumple con los criterios establecidos
   */
  const isValidBarcode = useCallback(
    (code: string): boolean => {
      // Verificar longitud
      if (code.length < minBarcodeLength || code.length > maxBarcodeLength) {
        console.log(
          `useBarcodeScan - Código no válido por longitud: ${code.length} (min: ${minBarcodeLength}, max: ${maxBarcodeLength})`
        );
        return false;
      }

      // Verificar patrón si existe
      if (barcodePattern && !barcodePattern.test(code)) {
        console.log(`useBarcodeScan - Código no válido por patrón: ${code}`);
        return false;
      }

      // Verificar si es un duplicado reciente
      const currentTime = Date.now();
      if (
        code === lastScannedBarcode.current &&
        currentTime - lastScanTime.current < duplicateScanDelay
      ) {
        console.log(`useBarcodeScan - Código duplicado reciente: ${code}`);
        return false;
      }

      return true;
    },
    [minBarcodeLength, maxBarcodeLength, barcodePattern, duplicateScanDelay]
  );

  /**
   * Finaliza el proceso de escaneo y procesa el código de barras
   */
  const finalizeScan = useCallback(() => {
    if (barcodeBuffer.current && !isProcessingRef.current) {
      isProcessingRef.current = true;

      const scannedCode = barcodeBuffer.current;
      console.log(
        "useBarcodeScan - Finalizando escaneo con código:",
        scannedCode
      );

      // Validar el código escaneado
      if (isValidBarcode(scannedCode)) {
        console.log("useBarcodeScan - Código válido, procesando");

        // Actualizar el estado con el código escaneado
        setBarcode(scannedCode);

        // Guardar el código y tiempo para evitar duplicados
        lastScannedBarcode.current = scannedCode;
        lastScanTime.current = Date.now();
        lastValidScanTimeRef.current = Date.now();

        // Ejecutar callback si existe
        if (onScan) {
          console.log(
            "useBarcodeScan - Llamando a onScan con código:",
            scannedCode
          );
          try {
            onScan(scannedCode);
          } catch (error) {
            console.error("useBarcodeScan - Error al ejecutar onScan:", error);
          }
        } else {
          console.log("useBarcodeScan - No hay callback onScan definido");
        }
      } else {
        console.log(
          "useBarcodeScan - Código no válido, ignorando:",
          scannedCode
        );
      }

      // Limpiar buffer y actualizar estado
      barcodeBuffer.current = "";
      setIsScanning(false);
      isProcessingRef.current = false;
      manualInputRef.current = false;
      scanSpeedRef.current = [];
    } else {
      console.log(
        "useBarcodeScan - No hay código para finalizar o ya se está procesando"
      );
    }
  }, [onScan, isValidBarcode]);

  /**
   * Determina si la entrada es de un escáner o de un teclado manual
   */
  const isScannerInput = useCallback(
    (timeSinceLastChar: number): boolean => {
      // Si es la primera pulsación, no podemos determinar si es escáner o teclado
      if (scanSpeedRef.current.length === 0) {
        return true;
      }

      // Calcular la velocidad promedio de las pulsaciones anteriores
      const avgSpeed =
        scanSpeedRef.current.reduce((sum, speed) => sum + speed, 0) /
        scanSpeedRef.current.length;

      // Si la velocidad actual es similar a la velocidad promedio, probablemente sea un escáner
      // Los escáneres suelen tener una velocidad de pulsación muy consistente
      const isConsistentSpeed = Math.abs(timeSinceLastChar - avgSpeed) < 10;

      // Si la velocidad es muy rápida y consistente, probablemente sea un escáner
      return timeSinceLastChar < maxDelayBetweenChars && isConsistentSpeed;
    },
    [maxDelayBetweenChars]
  );

  /**
   * Maneja los eventos de pulsación de teclas para detectar escaneos
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignorar eventos si ya estamos procesando un escaneo
      if (isProcessingRef.current) {
        return;
      }

      const currentTime = Date.now();
      const timeSinceLastChar = currentTime - lastCharTime.current;

      // Si es Enter, finalizar el escaneo (típico de los escáneres)
      if (event.key === "Enter") {
        finalizeScan();
        return;
      }

      // Ignorar teclas especiales que no son parte de códigos de barras
      if (event.key.length > 1 && event.key !== "Enter") {
        return;
      }

      // Determinar si este carácter es parte de un escaneo o una entrada manual
      const isPartOfScan =
        timeSinceLastChar <= maxDelayBetweenChars || lastCharTime.current === 0;

      // Si no estamos procesando entrada manual y la velocidad no es consistente con un escáner,
      // probablemente sea entrada manual
      if (
        !manualInputRef.current &&
        !isScannerInput(timeSinceLastChar) &&
        processManualInput
      ) {
        manualInputRef.current = true;
      }

      // Si es parte de un escaneo o estamos procesando entrada manual
      if (isPartOfScan || manualInputRef.current) {
        // Iniciar escaneo si no está ya activo
        if (!isScanning) {
          setIsScanning(true);
          scanStartTime.current = currentTime;
        }

        // Añadir carácter al buffer
        barcodeBuffer.current += event.key;

        // Guardar la velocidad de pulsación para análisis
        if (timeSinceLastChar > 0) {
          scanSpeedRef.current.push(timeSinceLastChar);
          // Mantener solo las últimas 10 pulsaciones para el análisis
          if (scanSpeedRef.current.length > 10) {
            scanSpeedRef.current.shift();
          }
        }

        // Reiniciar cualquier timeout existente
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Establecer timeout para finalizar si no hay más caracteres
        // Usar un tiempo más largo para entrada manual
        const delay = manualInputRef.current ? 500 : finalizationDelay;
        timeoutRef.current = setTimeout(finalizeScan, delay);
      } else {
        // Si ha pasado demasiado tiempo, considerar una nueva entrada
        barcodeBuffer.current = event.key;
        setIsScanning(true);
        scanStartTime.current = currentTime;
        scanSpeedRef.current = [];
      }

      // Actualizar el tiempo del último carácter
      lastCharTime.current = currentTime;
    },
    [
      finalizationDelay,
      finalizeScan,
      isScanning,
      maxDelayBetweenChars,
      processManualInput,
      isScannerInput,
    ]
  );

  /**
   * Función para borrar el último código de barras escaneado
   */
  const clearBarcode = useCallback(() => {
    setBarcode("");
    lastScannedBarcode.current = "";
  }, []);

  /**
   * Función para forzar la finalización del escaneo actual
   */
  const forceFinalize = useCallback(() => {
    if (barcodeBuffer.current) {
      finalizeScan();
    }
  }, [finalizeScan]);

  // Efecto para reiniciar el estado después de un período de inactividad
  useEffect(() => {
    const resetInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastValidScan = currentTime - lastValidScanTimeRef.current;

      // Si ha pasado más de 5 segundos desde el último escaneo válido, reiniciar el estado
      if (timeSinceLastValidScan > 5000) {
        console.log(
          "useBarcodeScan - Reiniciando estado después de inactividad"
        );
        isProcessingRef.current = false;
        manualInputRef.current = false;
        scanSpeedRef.current = [];

        // Si hay un timeout pendiente, limpiarlo
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Si hay un buffer pendiente, limpiarlo
        if (barcodeBuffer.current) {
          barcodeBuffer.current = "";
          setIsScanning(false);
        }
      }
    }, 1000);

    return () => {
      clearInterval(resetInterval);
    };
  }, []);

  // Configurar y limpiar event listeners
  useEffect(() => {
    if (enabled) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, handleKeyDown]);

  return {
    barcode,
    isScanning,
    clearBarcode,
    forceFinalize,
  };
}

export default useBarcodeScan;
