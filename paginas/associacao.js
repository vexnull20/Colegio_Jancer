document.addEventListener("DOMContentLoaded", () => {
  "use strict";


  const SUPABASE_URL =
    "https://nrwpgkvuuhqkousbmyvu.supabase.co";

  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yd3Bna3Z1dWhxa291c2JteXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNTcwODIsImV4cCI6MjEwNzkzMzA4Mn0.1rECJtNGGSZR61_K8aCTKK34Id4LZ5EImsdxDlp9Ac8";

  const OPCOES_VOTO = [
    "cultura",
    "desporto",
    "solidariedade"
  ];


  document.querySelectorAll("[data-ano]").forEach((elemento) => {
    elemento.textContent = new Date().getFullYear();
  });

  const menuToggle = document.getElementById("menuToggle");
  const menuPrincipal = document.getElementById("menuPrincipal");

  function fecharMenu() {
    if (!menuToggle || !menuPrincipal) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
      "aria-label",
      "Abrir menu de navegação"
    );

    menuPrincipal.classList.remove("menu-visivel");
    document.body.classList.remove("menu-aberto");
  }

  if (menuToggle && menuPrincipal) {
    menuToggle.addEventListener("click", () => {
      const aberto =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(!aberto)
      );

      menuToggle.setAttribute(
        "aria-label",
        aberto
          ? "Abrir menu de navegação"
          : "Fechar menu de navegação"
      );

      menuPrincipal.classList.toggle(
        "menu-visivel",
        !aberto
      );

      document.body.classList.toggle(
        "menu-aberto",
        !aberto
      );
    });

    menuPrincipal.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", fecharMenu);
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

      let secao;

      try {
        secao = document.querySelector(destino);
      } catch {
        return;
      }

      if (!secao) return;

      evento.preventDefault();
      fecharMenu();

      const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      secao.scrollIntoView({
        behavior: movimentoReduzido ? "auto" : "smooth",
        block: "start"
      });
    });
  });


  const listaComunicados = document.querySelector(
    ".comunicados-lista"
  );

  if (
    listaComunicados &&
    !listaComunicados.dataset.cicloCriado
  ) {
    const itensOriginais = Array.from(
      listaComunicados.children
    );

    if (itensOriginais.length > 0) {
      const copia = document.createDocumentFragment();

      itensOriginais.forEach((item) => {
        const duplicado = item.cloneNode(true);

        duplicado.setAttribute("aria-hidden", "true");
        duplicado.removeAttribute("id");

        duplicado.querySelectorAll("[id]").forEach((elemento) => {
          elemento.removeAttribute("id");
        });

        copia.appendChild(duplicado);
      });

      listaComunicados.appendChild(copia);
      listaComunicados.dataset.cicloCriado = "true";
      listaComunicados.classList.add("comunicados-animar");
    }
  }


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

  const galeriaGrelha =
    document.getElementById("galeriaGrelha");

  const galeriaModal =
    document.getElementById("galeriaModal");

  const modalImagem =
    document.getElementById("modalImagem");

  const modalTitulo =
    document.getElementById("modalTitulo");

  const modalDescricao =
    document.getElementById("modalDescricao");

  const modalCategoria =
    document.getElementById("modalCategoria");

  const modalContador =
    document.getElementById("modalContador");

  const modalMiniaturas =
    document.getElementById("modalMiniaturas");

  const modalFechar =
    document.getElementById("modalFechar");

  const modalAnterior =
    document.getElementById("modalAnterior");

  const modalSeguinte =
    document.getElementById("modalSeguinte");

  let fotografiasAtuais = [];
  let indiceFotografiaAtual = 0;
  let cartaoAnterior = null;

  function obterFotografias(cartao) {
    return (cartao.dataset.fotos || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
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

      miniatura.classList.toggle(
        "ativa",
        indice === indiceFotografiaAtual
      );

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

    indiceFotografiaAtual =
      (indice + fotografiasAtuais.length) %
      fotografiasAtuais.length;

    const fotografia =
      fotografiasAtuais[indiceFotografiaAtual];

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
  }

  function abrirGaleria(cartao) {
    if (!galeriaModal) return;

    const fotografias = obterFotografias(cartao);

    if (!fotografias.length) {
      window.alert(
        "Não existem fotografias configuradas neste cartão."
      );
      return;
    }

    fotografiasAtuais = fotografias;
    indiceFotografiaAtual = 0;
    cartaoAnterior = cartao;

    mostrarFotografia(0);

    galeriaModal.classList.add("aberto");
    galeriaModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("galeria-aberta");

    modalFechar?.focus();
  }

  function fecharGaleria() {
    if (!galeriaModal) return;

    galeriaModal.classList.remove("aberto");
    galeriaModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("galeria-aberta");

    modalImagem?.removeAttribute("src");

    cartaoAnterior?.focus();

    fotografiasAtuais = [];
    indiceFotografiaAtual = 0;
  }

  if (galeriaGrelha && galeriaModal) {
    galeriaGrelha
      .querySelectorAll(".galeria-cartao")
      .forEach((cartao) => {
        cartao.addEventListener("click", () => {
          abrirGaleria(cartao);
        });
      });

    modalFechar?.addEventListener(
      "click",
      fecharGaleria
    );

    galeriaModal
      .querySelectorAll("[data-fechar-galeria]")
      .forEach((elemento) => {
        elemento.addEventListener(
          "click",
          fecharGaleria
        );
      });

    modalAnterior?.addEventListener("click", () => {
      mostrarFotografia(indiceFotografiaAtual - 1);
    });

    modalSeguinte?.addEventListener("click", () => {
      mostrarFotografia(indiceFotografiaAtual + 1);
    });
  }


  document.querySelectorAll(".filtro-galeria").forEach((botao) => {
    botao.addEventListener("click", () => {
      const filtro = botao.dataset.filtro;

      document.querySelectorAll(".filtro-galeria").forEach(
        (outroBotao) => {
          const ativo = outroBotao === botao;

          outroBotao.classList.toggle("ativo", ativo);

          outroBotao.setAttribute(
            "aria-pressed",
            String(ativo)
          );
        }
      );

      galeriaGrelha
        ?.querySelectorAll(".galeria-cartao")
        .forEach((cartao) => {
          cartao.hidden =
            filtro !== "todos" &&
            cartao.dataset.categoria !== filtro;
        });
    });
  });


  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      fecharMenu();

      if (galeriaModal?.classList.contains("aberto")) {
        fecharGaleria();
      }

      return;
    }

    if (!galeriaModal?.classList.contains("aberto")) {
      return;
    }

    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      mostrarFotografia(indiceFotografiaAtual - 1);
    }

    if (evento.key === "ArrowRight") {
      evento.preventDefault();
      mostrarFotografia(indiceFotografiaAtual + 1);
    }
  });

  // =====================================================
  // 9. VOTAÇÃO GLOBAL COM SUPABASE
  // =====================================================
  // Os resultados são partilhados entre visitantes.
  // Não existe bloqueio local por navegador.
  //
  // A função RPC registar_voto deve aceitar o parâmetro:
  // { "candidato": "cultura" }, "desporto" ou "solidariedade".

  const formVotacao =
    document.getElementById("formVotacao");

  const resultadosVotacao =
    document.getElementById("resultadosVotacao");

  let envioEmCurso = false;
  let pedidoResultadosEmCurso = false;

  async function pedidoSupabase(caminho, opcoes = {}) {
    if (
      !SUPABASE_URL.startsWith("https://") ||
      !SUPABASE_KEY.trim()
    ) {
      throw new Error(
        "Configura o URL e a chave pública do Supabase."
      );
    }

    const resposta = await fetch(
      `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${caminho}`,
      {
        ...opcoes,
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          ...(opcoes.headers || {})
        }
      }
    );

    if (!resposta.ok) {
      const detalhe = await resposta.text();

      throw new Error(
        `Supabase (${resposta.status}): ${detalhe}`
      );
    }

    if (resposta.status === 204) {
      return null;
    }

    const texto = await resposta.text();

    return texto ? JSON.parse(texto) : null;
  }

  async function lerVotosGlobais() {
    return pedidoSupabase(
      "associacao_votos?select=opcao,total&opcao=in.(cultura,desporto,solidariedade)"
    );
  }

  async function atualizarResultados() {
    if (
      !resultadosVotacao ||
      pedidoResultadosEmCurso
    ) {
      return;
    }

    pedidoResultadosEmCurso = true;

    try {
      const linhas = await lerVotosGlobais();

      const votos = {
        cultura: 0,
        desporto: 0,
        solidariedade: 0
      };

      if (!Array.isArray(linhas)) {
        throw new Error(
          "O Supabase não devolveu uma lista válida de resultados."
        );
      }

      linhas.forEach((linha) => {
        if (OPCOES_VOTO.includes(linha.opcao)) {
          votos[linha.opcao] =
            Number(linha.total) || 0;
        }
      });

      const total = Object.values(votos).reduce(
        (soma, quantidade) => soma + quantidade,
        0
      );

      resultadosVotacao.hidden = false;

      document
        .querySelectorAll(".resultado-item")
        .forEach((item) => {
          const opcao = item.dataset.resultado;

          if (!OPCOES_VOTO.includes(opcao)) return;

          const quantidade = votos[opcao];

          const percentagem =
            total > 0
              ? Math.round((quantidade / total) * 100)
              : 0;

          const elementoPercentagem =
            item.querySelector(".resultado-percentagem");

          const barra =
            item.querySelector(".barra-preenchimento");

          const elementoVotos =
            item.querySelector(".resultado-votos");

          if (elementoPercentagem) {
            elementoPercentagem.textContent =
              `${percentagem}%`;
          }

          if (barra) {
            barra.style.width = `${percentagem}%`;
            barra.setAttribute(
              "aria-valuenow",
              String(percentagem)
            );
          }

          if (elementoVotos) {
            elementoVotos.textContent =
              `${quantidade} ${
                quantidade === 1 ? "voto" : "votos"
              }`;
          }
        });

      const totalElementos = document.querySelectorAll(
        "[data-total-votos]"
      );

      totalElementos.forEach((elemento) => {
        elemento.textContent = String(total);
      });
    } catch (erro) {
      console.error(
        "Erro ao carregar os resultados globais:",
        erro
      );
    } finally {
      pedidoResultadosEmCurso = false;
    }
  }

  if (formVotacao && resultadosVotacao) {
    atualizarResultados();

    // Atualiza os resultados globais a cada 10 segundos.
    window.setInterval(atualizarResultados, 10000);

    formVotacao.addEventListener(
      "submit",
      async (evento) => {
        evento.preventDefault();

        if (envioEmCurso) return;

        const selecionado = formVotacao.querySelector(
          'input[name="voto"]:checked'
        );

        if (
          !selecionado ||
          !OPCOES_VOTO.includes(selecionado.value)
        ) {
          window.alert(
            "Seleciona uma opção antes de votar."
          );
          return;
        }

        envioEmCurso = true;

        const botao = formVotacao.querySelector(
          'button[type="submit"]'
        );

        const textoOriginal =
          botao?.textContent || "Registar meu voto";

        if (botao) {
          botao.disabled = true;
          botao.textContent = "A registar voto...";
        }

        try {
          await pedidoSupabase("rpc/registar_voto", {
            method: "POST",
            body: JSON.stringify({
              candidato: selecionado.value
            })
          });

          await atualizarResultados();

          window.alert(
            "Voto registado com sucesso."
          );
        } catch (erro) {
          console.error(
            "Erro ao registar voto:",
            erro
          );

          window.alert(
            "Não foi possível registar o voto. " +
            "Confirma a função registar_voto, a tabela " +
            "associacao_votos e as permissões do Supabase."
          );
        } finally {
          envioEmCurso = false;

          if (botao) {
            botao.disabled = false;
            botao.textContent = textoOriginal;
          }
        }
      }
    );
  }


  const botaoWhatsApp =
    document.querySelector(".whatsapp-float");

  if (botaoWhatsApp) {
    botaoWhatsApp.setAttribute("target", "_blank");

    botaoWhatsApp.setAttribute(
      "rel",
      "noopener noreferrer"
    );

    botaoWhatsApp.setAttribute(
      "aria-label",
      "Inscrever-se numa atividade da Associação de Estudantes pelo WhatsApp"
    );
  }
});
