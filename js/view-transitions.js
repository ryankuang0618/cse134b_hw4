if (!document.startViewTransition) {
  console.log('View Transitions API not supported in this browser');
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
      if (link.target === '_blank' || link.hostname !== window.location.hostname) {
        return;
      }
      
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:')) {
          return;
        }
        
        e.preventDefault();
        
        document.startViewTransition(() => {
          window.location.href = href;
        });
      });
    });
  });
}

