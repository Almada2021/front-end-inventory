import { useState, useEffect, useCallback, useRef } from 'react';

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
}

/**
 * Hook personalizado para detectar escaneos de códigos de barras
 */
function useBarcodeScan({
  onScan,
  enabled = true,
  maxDelayBetweenChars = 50,
  finalizationDelay = 20
}: UseBarcodeScanOptions = {}): UseBarcodeScanResult {
  const [barcode, setBarcode] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  
  // Referencias para persistir valores entre renderizados
  const barcodeBuffer = useRef<string>('');
  const lastCharTime = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  /**
   * Finaliza el proceso de escaneo y procesa el código de barras
   */
  const finalizeScan = useCallback(() => {
    if (barcodeBuffer.current) {
      // Actualizar el estado con el código escaneado
      setBarcode(barcodeBuffer.current);
      
      // Ejecutar callback si existe
      if (onScan) {
        onScan(barcodeBuffer.current);
      }
      
      // Limpiar buffer y actualizar estado
      barcodeBuffer.current = '';
      setIsScanning(false);
    }
  }, [onScan]);
  
  /**
   * Maneja los eventos de pulsación de teclas para detectar escaneos
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const currentTime = Date.now();
    const timeSinceLastChar = currentTime - lastCharTime.current;
    
    // Si es Enter, finalizar el escaneo (típico de los escáneres)
    if (event.key === 'Enter') {
      finalizeScan();
      return;
    }
    
    // Determinar si este carácter es parte de un escaneo o una entrada manual
    const isPartOfScan = timeSinceLastChar <= maxDelayBetweenChars || lastCharTime.current === 0;
    
    if (isPartOfScan) {
      // Iniciar escaneo si no está ya activo
      if (!isScanning) {
        setIsScanning(true);
      }
      
      // Añadir carácter al buffer
      barcodeBuffer.current += event.key;
      
      // Reiniciar cualquier timeout existente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Establecer timeout para finalizar si no hay más caracteres
      timeoutRef.current = setTimeout(finalizeScan, finalizationDelay);
    } else {
      // Si ha pasado demasiado tiempo, considerar una nueva entrada
      barcodeBuffer.current = event.key;
      setIsScanning(true);
    }
    
    // Actualizar el tiempo del último carácter
    lastCharTime.current = currentTime;
  }, [finalizationDelay, finalizeScan, isScanning, maxDelayBetweenChars]);
  
  /**
   * Función para borrar el código de barras escaneado
   */
  const clearBarcode = useCallback(() => {
    setBarcode('');
  }, []);
  
  // Configurar y limpiar event listeners
  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, handleKeyDown]);
  
  return {
    barcode,
    isScanning,
    clearBarcode
  };
}

export default useBarcodeScan;