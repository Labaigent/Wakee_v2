import { toast } from 'sonner';

export async function copyToClipboard(text: string, successMessage: string = 'Copiado al portapapeles') {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
      return true;
    }
    
    // Fallback to older method
    return fallbackCopyToClipboard(text, successMessage);
  } catch (error) {
    // If modern API fails, use fallback
    return fallbackCopyToClipboard(text, successMessage);
  }
}

function fallbackCopyToClipboard(text: string, successMessage: string): boolean {
  try {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    
    // Select the text
    textArea.focus();
    textArea.select();
    
    // Try to copy
    const successful = document.execCommand('copy');
    
    // Remove the textarea
    document.body.removeChild(textArea);
    
    if (successful) {
      toast.success(successMessage);
      return true;
    } else {
      toast.error('No se pudo copiar. Por favor, copia manualmente.');
      return false;
    }
  } catch (error) {
    console.error('Clipboard error:', error);
    toast.error('No se pudo copiar. Por favor, copia manualmente.');
    return false;
  }
}
