document.addEventListener("DOMContentLoaded", () => {
  // Atualizar automaticamente o ano do rodapé
  const ano = document.querySelector("[data-ano]");

  if (ano) {
    ano.textContent = new Date().getFullYear();
  }

  // Navegação suave pelas secções da página
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const destino = link.getAttribute("href");

      if (!destino || destino === "#") return;

      const secao = document.querySelector(destino);

      if (secao) {
        event.preventDefault();

        secao.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  // Garantir as propriedades de segurança do botão WhatsApp
  const botaoWhatsApp = document.querySelector(".whatsapp-float");

  if (botaoWhatsApp) {
    botaoWhatsApp.setAttribute("target", "_blank");
    botaoWhatsApp.setAttribute("rel", "noopener noreferrer");
    botaoWhatsApp.setAttribute(
      "aria-label",
      "Inscrever-se no evento do Colégio Jancer pelo WhatsApp"
    );
  }
})
