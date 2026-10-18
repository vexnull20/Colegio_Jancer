
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================
     ANO AUTOMÁTICO
  ========================================= */

  document.querySelectorAll("[data-ano]").forEach((elemento) => {
    elemento.textContent = new Date().getFullYear();
  });

  /* =========================================
     MENU RESPONSIVO
  ========================================= */

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
      const aberto = menuToggle.getAttribute("aria-expanded") === "true";

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

    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) fecharMenu();
    });
  }

  /* =========================================
     DESLOCAÇÃO SUAVE NAS SECÇÕES
  ========================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (evento) => {
      const destino = link.getAttribute("href");

      if (!destino || destino === "#") return;

      const secao = document.querySelector(destino);

      if (!secao) return;

      evento.preventDefault();
      fecharMenu();

      secao.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });
    });
  });

  /* =========================================
     DADOS DAS FOTOGRAFIAS
     Cada fotografia tem o seu título,
     descrição e categoria.
  ========================================= */

  const imagensGaleria = {
    biblioteca: {
      src: "../biblioteca.png.jpg",
      titulo: "Biblioteca do Colégio Jancer",
      descricao:
        "Um espaço dedicado à leitura, à pesquisa e ao desenvolvimento do conhecimento dos estudantes.",
      categoria: "COLÉGIO"
    },

    evento1: {
      src: "../image1.png.jpeg",
      titulo: "Atividade da Associação",
      descricao:
        "Registo de uma atividade da Associação de Estudantes do Colégio Jancer.",
      categoria: "EVENTOS E ATIVIDADES"
    },

    evento2: {
      src: "../image2.png.jpeg",
      titulo: "Momentos dos estudantes",
      descricao:
        "Mais um momento para recordar das iniciativas e da participação dos estudantes.",
      categoria: "EVENTOS E ATIVIDADES"
    }
  };

  /* =========================================
     GALERIA: ELEMENTOS
  ========================================= */

  const galeriaGrelha = document.getElementById("galeriaGrelha");
  const galeriaModal = document.getElementById("galeriaModal");
  const modalImagem = document.getElementById("modalImagem");
  const modalTitulo = document.getElementById("modalTitulo");
  const modalDescricao = document.getElementById("modalDescricao");
  const modalCategoria = document.getElementById("modalCategoria");
  const modalContador = document.getElementById("modalContador");
  const modalMiniaturas = document.getElementById("modalMiniaturas");
  const modalFechar = document.getElementById("modalFechar");
  const modalAnterior = document.getElementById("modalAnterior");
  const modalSeguinte = document.getElementById("modalSeguinte");

  let fotografiasAtuais = [];
  let indiceFotografiaAtual = 0;
  let cartaoAnterior = null;

  function obterFotografias(cartao) {
    const ids = (cartao.dataset.fotos || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    return ids
      .map((id) => imagensGaleria[id])
      .filter((fotografia) => fotografia && fotografia.src);
  }

  function atualizarMiniaturas() {
    if (!modalMiniaturas) return;

    modalMiniaturas.replaceChildren();

    fotografiasAtuais.forEach((fotografia, indice) => {
      const miniatura = document.createElement("button");
      miniatura.type = "button";
      miniatura.className = "miniatura-galeria";
      miniatura.classList.toggle("ativa", indice === indiceFotografiaAtual);
      miniatura.setAttribute(
        "aria-label",
        `Ver fotografia ${indice + 1}: ${fotografia.titulo}`
      );
      miniatura.setAttribute(
        "aria-pressed",
        String(indice === indiceFotografiaAtual)
      );

      const imagem = document.createElement("img");
      imagem.src = fotografia.src;
      imagem.alt = fotografia.titulo;
      imagem.loading = "lazy";

      miniatura.appendChild(imagem);

      miniatura.addEventListener("click", () => {
        mostrarFotografia(indice);
      });

      modalMiniaturas.appendChild(miniatura);
    });
  }

  function mostrarFotografia(indice) {
    if (!fotografiasAtuais.length || !modalImagem) return;

    fotografiasAtuais = fotografiasAtuais.filter(Boolean);

    if (!fotografiasAtuais.length) return;

    indiceFotografiaAtual =
      (indice + fotografiasAtuais.length) % fotografiasAtuais.length;

    const fotografia = fotografiasAtuais[indiceFotografiaAtual];

    modalImagem.src = fotografia.src;
    modalImagem.alt = fotografia.titulo;

    if (modalTitulo) {
      modalTitulo.textContent = fotografia.titulo;
    }

    if (modalDescricao) {
      modalDescricao.textContent = fotografia.descricao;
    }

    if (modalCategoria) {
      modalCategoria.textContent = fotografia.categoria;
    }

    if (modalContador) {
      modalContador.textContent =
        `${indiceFotografiaAtual + 1} / ${fotografiasAtuais.length}`;
    }

    if (modalAnterior) {
      modalAnterior.hidden = fotografiasAtuais.length < 2;
    }

    if (modalSeguinte) {
      modalSeguinte.hidden = fotografiasAtuais.length < 2;
    }

    atualizarMiniaturas();

    const miniaturaAtiva = modalMiniaturas?.querySelector(".miniatura-galeria.ativa");

    if (miniaturaAtiva) {
      miniaturaAtiva.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
      });
    }
  }

  function abrirGaleria(cartao) {
    if (!galeriaModal) return;

    const fotografias = obterFotografias(cartao);

    if (!fotografias.length) {
      window.alert("Não existem fotografias configuradas neste cartão.");
      return;
    }

    fotografiasAtuais = fotografias;
    indiceFotografiaAtual = 0;
    cartaoAnterior = cartao;

    mostrarFotografia(0);

    galeriaModal.classList.add("aberto");
    galeriaModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("galeria-aberta");

    if (modalFechar) modalFechar.focus();
  }

  function fecharGaleria() {
    if (!galeriaModal) return;

    galeriaModal.classList.remove("aberto");
    galeriaModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("galeria-aberta");

    if (modalImagem) {
      modalImagem.removeAttribute("src");
    }

    if (cartaoAnterior) {
      cartaoAnterior.focus();
    }

    fotografiasAtuais = [];
    indiceFotografiaAtual = 0;
  }

  if (galeriaGrelha && galeriaModal) {
    galeriaGrelha.querySelectorAll(".galeria-cartao").forEach((cartao) => {
      cartao.addEventListener("click", () => abrirGaleria(cartao));
    });

    if (modalFechar) {
      modalFechar.addEventListener("click", fecharGaleria);
    }

    galeriaModal.querySelectorAll("[data-fechar-galeria]").forEach((elemento) => {
      elemento.addEventListener("click", fecharGaleria);
    });

    if (modalAnterior) {
      modalAnterior.addEventListener("click", () => {
        mostrarFotografia(indiceFotografiaAtual - 1);
      });
    }

    if (modalSeguinte) {
      modalSeguinte.addEventListener("click", () => {
        mostrarFotografia(indiceFotografiaAtual + 1);
      });
    }
  }

  /* =========================================
     FILTROS DA GALERIA
  ========================================= */

  const botoesFiltro = document.querySelectorAll(".filtro-galeria");

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      const filtro = botao.dataset.filtro;

      botoesFiltro.forEach((outroBotao) => {
        const ativo = outroBotao === botao;

        outroBotao.classList.toggle("ativo", ativo);
        outroBotao.setAttribute("aria-pressed", String(ativo));
      });

      if (!galeriaGrelha) return;

      galeriaGrelha.querySelectorAll(".galeria-cartao").forEach((cartao) => {
        const categoria = cartao.dataset.categoria;
        const mostrar = filtro === "todos" || categoria === filtro;

        cartao.hidden = !mostrar;
      });
    });
  });

  /* =========================================
     TECLADO: ESC E SETAS
  ========================================= */

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      fecharMenu();

      if (galeriaModal?.classList.contains("aberto")) {
        fecharGaleria();
      }

      return;
    }

    if (!galeriaModal?.classList.contains("aberto")) return;

    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      mostrarFotografia(indiceFotografiaAtual - 1);
    }

    if (evento.key === "ArrowRight") {
      evento.preventDefault();
      mostrarFotografia(indiceFotografiaAtual + 1);
    }
  });

  /* =========================================
     VOTAÇÃO
     Os resultados são guardados localmente
     no navegador de cada visitante.
  ========================================= */

  const formVotacao = document.getElementById("formVotacao");
  const resultadosVotacao = document.getElementById("resultadosVotacao");

  const chaveVotos = "jancer_associacao_votos_v1";
  const chaveVotoUtilizador = "jancer_associacao_voto_utilizador_v1";

  const opcoesValidas = ["cultura", "desporto", "solidariedade"];

  const votosIniciais = {
    cultura: 0,
    desporto: 0,
    solidariedade: 0
  };

  function numeroValido(valor) {
    const numero = Number(valor);

    if (!Number.isFinite(numero) || numero < 0) return 0;

    return Math.floor(numero);
  }

  function lerVotos() {
    try {
      const dados = localStorage.getItem(chaveVotos);

      if (!dados) return { ...votosIniciais };

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
    const total = votos.cultura + votos.desporto + votos.solidariedade;

    resultadosVotacao.hidden = false;

    document.querySelectorAll(".resultado-item").forEach((item) => {
      const opcao = item.dataset.resultado;

      if (!opcoesValidas.includes(opcao)) return;

      const quantidade = votos[opcao];
      const percentagem = total > 0
        ? Math.round((quantidade / total) * 100)
        : 0;

      const elementoPercentagem = item.querySelector(".resultado-percentagem");
      const barra = item.querySelector(".barra-preenchimento");
      const elementoVotos = item.querySelector(".resultado-votos");

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
          "O voto foi contabilizado, mas o navegador não permitiu guardar a confirmação."
        );
      }

      bloquearVotacao(opcaoEscolhida);
      atualizarResultados();
    });
  }

  /* =========================================
     WHATSAPP FLUTUANTE
  ========================================= */

  const botaoWhatsApp = document.querySelector(".whatsapp-float");

  if (botaoWhatsApp) {
    botaoWhatsApp.setAttribute("target", "_blank");
    botaoWhatsApp.setAttribute("rel", "noopener noreferrer");
    botaoWhatsApp.setAttribute(
      "aria-label",
      "Inscrever-se numa atividade da Associação de Estudantes pelo WhatsApp"
    );
  }
});
