document.addEventListener("DOMContentLoaded", () => {
  "use strict";


  const elementosAno = document.querySelectorAll("[data-ano]");
  const anoAtual = new Date().getFullYear();

  elementosAno.forEach((elemento) => {
    elemento.textContent = anoAtual;
  });



  const menuToggle = document.getElementById("menuToggle");
  const menuPrincipal = document.getElementById("menuPrincipal");

  function fecharMenu() {
    if (!menuToggle || !menuPrincipal) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu de navegação");
    menuPrincipal.classList.remove("menu-visivel");
    document.body.classList.remove("menu-aberto");
  }

  if (menuToggle && menuPrincipal) {
    menuToggle.addEventListener("click", () => {
      const aberto =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!aberto));
      menuToggle.setAttribute(
        "aria-label",
        aberto ? "Abrir menu de navegação" : "Fechar menu de navegação"
      );

      menuPrincipal.classList.toggle("menu-visivel", !aberto);
      document.body.classList.toggle("menu-aberto", !aberto);
    });

    menuPrincipal.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", fecharMenu);
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") {
        fecharMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) {
        fecharMenu();
      }
    });
  }



  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (evento) => {
      const destino = link.getAttribute("href");

      if (!destino || destino === "#") return;

      const secao = document.querySelector(destino);

      if (!secao) return;

      evento.preventDefault();

      secao.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });
    });
  });



  const slideContainer = document.getElementById("slideAssociacao");

  if (slideContainer) {
    const slides = Array.from(
      slideContainer.querySelectorAll(".slide-item")
    );

    const pontos = Array.from(
      slideContainer.querySelectorAll(".slide-ponto")
    );

    const botaoAnterior = document.getElementById("slideAnterior");
    const botaoSeguinte = document.getElementById("slideSeguinte");

    let slideAtual = 0;
    let temporizadorSlide = null;

    const movimentoReduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    function mostrarSlide(indice) {
      if (!slides.length) return;

      slideAtual = (indice + slides.length) % slides.length;

      slides.forEach((slide, index) => {
        const ativo = index === slideAtual;

        slide.classList.toggle("ativo", ativo);
        slide.setAttribute("aria-hidden", String(!ativo));
      });

      pontos.forEach((ponto, index) => {
        const ativo = index === slideAtual;

        ponto.classList.toggle("ativo", ativo);
        ponto.setAttribute("aria-pressed", String(ativo));
      });
    }

    function pararSlideAutomatico() {
      if (temporizadorSlide !== null) {
        window.clearInterval(temporizadorSlide);
        temporizadorSlide = null;
      }
    }

    function iniciarSlideAutomatico() {
      pararSlideAutomatico();

      if (slides.length < 2 || movimentoReduzido.matches) {
        return;
      }

      temporizadorSlide = window.setInterval(() => {
        mostrarSlide(slideAtual + 1);
      }, 5000);
    }

    function mudarSlide(indice) {
      mostrarSlide(indice);
      iniciarSlideAutomatico();
    }

    if (botaoAnterior) {
      botaoAnterior.addEventListener("click", () => {
        mudarSlide(slideAtual - 1);
      });
    }

    if (botaoSeguinte) {
      botaoSeguinte.addEventListener("click", () => {
        mudarSlide(slideAtual + 1);
      });
    }

    pontos.forEach((ponto, index) => {
      ponto.addEventListener("click", () => {
        mudarSlide(index);
      });
    });

    slideContainer.addEventListener("mouseenter", pararSlideAutomatico);
    slideContainer.addEventListener("mouseleave", iniciarSlideAutomatico);

    slideContainer.addEventListener("focusin", pararSlideAutomatico);
    slideContainer.addEventListener("focusout", (evento) => {
      if (!slideContainer.contains(evento.relatedTarget)) {
        iniciarSlideAutomatico();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        pararSlideAutomatico();
      } else {
        iniciarSlideAutomatico();
      }
    });

    movimentoReduzido.addEventListener?.("change", iniciarSlideAutomatico);

    mostrarSlide(0);
    iniciarSlideAutomatico();
  }


  const formVotacao = document.getElementById("formVotacao");
  const resultadosVotacao = document.getElementById("resultadosVotacao");

  const chaveVotos = "jancer_associacao_votos_v1";
  const chaveVotoUtilizador = "jancer_associacao_voto_utilizador_v1";

  const opcoesValidas = [
    "cultura",
    "desporto",
    "solidariedade"
  ];

  const votosIniciais = {
    cultura: 0,
    desporto: 0,
    solidariedade: 0
  };

  function lerVotos() {
    try {
      const dados = localStorage.getItem(chaveVotos);

      if (!dados) {
        return { ...votosIniciais };
      }

      const guardados = JSON.parse(dados);

      return {
        cultura: numeroValido(guardados.cultura),
        desporto: numeroValido(guardados.desporto),
        solidariedade: numeroValido(guardados.solidariedade)
      };
    } catch (erro) {
      console.warn("Não foi possível ler os votos locais.", erro);
      return { ...votosIniciais };
    }
  }

  function numeroValido(valor) {
    const numero = Number(valor);

    if (!Number.isFinite(numero) || numero < 0) {
      return 0;
    }

    return Math.floor(numero);
  }

  function guardarVotos(votos) {
    try {
      localStorage.setItem(chaveVotos, JSON.stringify(votos));
      return true;
    } catch (erro) {
      console.warn("Não foi possível guardar os votos locais.", erro);
      return false;
    }
  }

  function lerVotoUtilizador() {
    try {
      const voto = localStorage.getItem(chaveVotoUtilizador);

      return opcoesValidas.includes(voto) ? voto : null;
    } catch (erro) {
      return null;
    }
  }

  function atualizarResultados() {
    if (!resultadosVotacao) return;

    const votos = lerVotos();

    const total =
      votos.cultura +
      votos.desporto +
      votos.solidariedade;

    resultadosVotacao.hidden = false;

    document.querySelectorAll(".resultado-item").forEach((item) => {
      const opcao = item.dataset.resultado;

      if (!opcoesValidas.includes(opcao)) return;

      const quantidade = votos[opcao];
      const percentagem = total > 0
        ? Math.round((quantidade / total) * 100)
        : 0;

      const elementoPercentagem =
        item.querySelector(".resultado-percentagem");

      const barra =
        item.querySelector(".barra-preenchimento");

      const elementoVotos =
        item.querySelector(".resultado-votos");

      if (elementoPercentagem) {
        elementoPercentagem.textContent = `${percentagem}%`;
      }

      if (barra) {
        barra.style.width = `${percentagem}%`;
      }

      if (elementoVotos) {
        elementoVotos.textContent =
          `${quantidade} ${quantidade === 1 ? "voto" : "votos"}`;
      }
    });
  }

  function bloquearVotacao(votoRegistado) {
    if (!formVotacao) return;

    formVotacao.querySelectorAll('input[name="voto"]').forEach((radio) => {
      radio.disabled = true;
      radio.checked = radio.value === votoRegistado;
    });

    const botao = formVotacao.querySelector('button[type="submit"]');

    if (botao) {
      botao.disabled = true;
      botao.textContent = "Voto já registado neste navegador";
    }
  }

  if (formVotacao && resultadosVotacao) {
    const votoAnterior = lerVotoUtilizador();

    if (votoAnterior) {
      bloquearVotacao(votoAnterior);
      atualizarResultados();
    }

    formVotacao.addEventListener("submit", (evento) => {
      evento.preventDefault();

      if (lerVotoUtilizador()) {
        atualizarResultados();
        return;
      }

      const selecionado = formVotacao.querySelector(
        'input[name="voto"]:checked'
      );

      if (!selecionado || !opcoesValidas.includes(selecionado.value)) {
        formVotacao.reportValidity();
        return;
      }

      const opcaoEscolhida = selecionado.value;
      const votos = lerVotos();

      votos[opcaoEscolhida] += 1;

      if (!guardarVotos(votos)) {
        window.alert(
          "Não foi possível guardar o voto neste navegador. Tenta novamente."
        );
        return;
      }

      try {
        localStorage.setItem(chaveVotoUtilizador, opcaoEscolhida);
      } catch (erro) {
        window.alert(
          "O voto foi contabilizado apenas temporariamente nesta página. " +
          "O navegador não permitiu guardar a confirmação."
        );
      }

      bloquearVotacao(opcaoEscolhida);
      atualizarResultados();
    });
  }



  const botaoWhatsApp = document.querySelector(".whatsapp-float");

  if (botaoWhatsApp) {
    botaoWhatsApp.setAttribute("target", "_blank");
    botaoWhatsApp.setAttribute("rel", "noopener noreferrer");
    botaoWhatsApp.setAttribute(
      "aria-label",
      "Inscrever-se num evento do Colégio Jancer pelo WhatsApp"
    );
  }

})