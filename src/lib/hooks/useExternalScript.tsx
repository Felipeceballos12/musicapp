import React from 'react';

export function useExternalScript(url: string) {
  const [state, setState] = React.useState(url ? 'loading' : 'idle');

  React.useEffect(() => {
    if (!url) {
      setState('idle');
      return;
    }

    let script = document.querySelector(
      `script[src="${url}"]`
    ) as HTMLScriptElement;

    const handleScript = (e: any) => {
      setState(e.type === 'load' ? 'ready' : 'error');
    };

    if (!script) {
      script = document.createElement('script');
      script.type = 'application/javascript';
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      script.addEventListener('load', handleScript);
      script.addEventListener('error', handleScript);
    }

    script.addEventListener('load', handleScript);
    script.addEventListener('error', handleScript);

    return () => {
      script.removeEventListener('load', handleScript);
      script.removeEventListener('error', handleScript);
      document.removeChild(script);
    };
  }, [url]);

  return state;
}
