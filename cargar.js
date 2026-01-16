document.addEventListener("DOMContentLoaded", function() {
      setTimeout(function() {
        const overlay = document.getElementById('overlay');
        overlay.classList.add('hidden');

        // Mostramos todo el contenido
        document.querySelectorAll("body > *:not(#overlay)").forEach(el => {
          el.style.visibility = "visible";
        });
      }, 5000); // 1 segundo
    });