
document.addEventListener("DOMContentLoaded", () => {
  "use strict"

  const numeroWhatsApp = "244974501253"

  const formulario = document.getElementById("formInscricao");
  const nivelEnsino = document.getElementById("nivelEnsino");
  const curso = document.getElementById("curso");
  const mensagemErro = document.getElementById("mensagemErro");
  const mensagemSucesso = document.getElementById("mensagemSucesso");
  const botaoEnviar = document.getElementById("botaoEnviarWhatsApp");

  if (!formulario || !nivelEnsino || !curso || !botaoEnviar) {
    console.error("Não foram encontrados todos os elementos do formulário.");
    return;
  }

  
  const opcoesPorNivel = {
    primario: [
      ["1classe", "1.ª classe"],
      ["2classe", "2.ª classe"],
      ["3classe", "3.ª classe"],
      ["4classe", "4.ª classe"],
      ["5classe", "5.ª classe"],
      ["6classe", "6.ª classe"]
    ],

    ciclo1: [
      ["7classe", "7.ª classe"],
      ["8classe", "8.ª classe"],
      ["9classe", "9.ª classe"]
    ],

    ciclo2: [
      ["10classe", "10.ª classe"],
      ["11classe", "11.ª classe"],
      ["12classe", "12.ª classe"],
      ["informatica", "Informática"],
      ["cfb", "Ciências Físicas e Biológicas (CFB)"],
      ["cej", "Ciências Económicas e Jurídicas (CEJ)"]
    ]
  };

  function limparMensagens() {
    mensagemErro.textContent = "";
    mensagemErro.style.display = "none";
    mensagemSucesso.textContent = "";
    mensagemSucesso.style.display = "none";
  }

  function mostrarErro(texto) {
    mensagemErro.textContent = texto;
    mensagemErro.style.display = "block";
    mensagemSucesso.style.display = "none";

    mensagemErro.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  
  function atualizarOpcoesCurso() {
    const nivel = nivelEnsino.value;
    const opcoes = opcoesPorNivel[nivel] || [];

    curso.replaceChildren();

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = nivel
      ? "Selecione a classe ou o curso"
      : "Selecione primeiro o nível de ensino";

    curso.appendChild(opcaoInicial);

    opcoes.forEach(([valor, texto]) => {
      const opcao = document.createElement("option");
      opcao.value = valor;
      opcao.textContent = texto;
      curso.appendChild(opcao);
    });

    curso.disabled = opcoes.length === 0;
    limparMensagens();
  }

  nivelEnsino.addEventListener("change", atualizarOpcoesCurso);


  const parametros = new URLSearchParams(window.location.search);
  const cursoPreselecionado = parametros.get("curso");

  if (cursoPreselecionado) {
    const nivelDoCurso = Object.entries(opcoesPorNivel).find(
      ([, opcoes]) =>
        opcoes.some(([valor]) => valor === cursoPreselecionado)
    );

    if (nivelDoCurso) {
      nivelEnsino.value = nivelDoCurso[0];
      atualizarOpcoesCurso();
      curso.value = cursoPreselecionado;
    }
  } else {
    atualizarOpcoesCurso();
  }


  botaoEnviar.addEventListener("click", () => {
    if (typeof formulario.requestSubmit === "function") {
      formulario.requestSubmit();
    } else {
      formulario.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limparMensagens();

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    if (!nivelEnsino.value || !curso.value) {
      mostrarErro(
        "Selecione o nível de ensino e a classe ou o curso pretendido."
      );
      curso.focus();
      return;
    }

    const telefoneCampo = document.getElementById("telefone");
    const telefoneDigitado = telefoneCampo.value.trim();
    const telefone = telefoneDigitado.replace(/\D/g, "");

    const telefoneLocal = telefone.startsWith("244")
      ? telefone.slice(3)
      : telefone;

    if (!/^9\d{8}$/.test(telefoneLocal)) {
      mostrarErro(
        "Introduza um número angolano válido com 9 dígitos, por exemplo 974501253."
      );
      telefoneCampo.focus();
      return;
    }

    const email = document.getElementById("email").value.trim();

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      mostrarErro("Verifique o endereço de e-mail introduzido.");
      document.getElementById("email").focus();
      return;
    }

    if (!document.getElementById("confirmacao").checked) {
      mostrarErro(
        "Confirme que as informações são verdadeiras antes de continuar."
      );
      document.getElementById("confirmacao").focus();
      return;
    }

    const nomeNivel =
      nivelEnsino.options[nivelEnsino.selectedIndex].text;

    const nomeCurso =
      curso.options[curso.selectedIndex].text;

    const dados = {
      aluno: document.getElementById("nomeAluno").value.trim(),
      nascimento: document.getElementById("dataNascimento").value,
      encarregado: document.getElementById("nomeEncarregado").value.trim(),
      telefone: telefoneLocal,
      email: email || "Não indicado",
      endereco: document.getElementById("endereco").value.trim(),
      saude:
        document.getElementById("saude").value.trim() || "Não indicado",
      observacoes:
        document.getElementById("observacoes").value.trim() || "Nenhuma"
    };

    let dataFormatada = "Não indicada";

    if (dados.nascimento) {
      const data = new Date(`${dados.nascimento}T00:00:00`);
      dataFormatada = data.toLocaleDateString("pt-PT");
    }

    const textoWhatsApp = [
      "INSCRIÇÃO — COLÉGIO JANCER",
      "",
      `Nome completo do aluno: ${dados.aluno}`,
      `Data de nascimento: ${dataFormatada}`,
      `Nível de ensino: ${nomeNivel}`,
      `Classe/curso pretendido: ${nomeCurso}`,
      "",
      `Encarregado de educação: ${dados.encarregado}`,
      `Telefone do encarregado: ${dados.telefone}`,
      `E-mail: ${dados.email}`,
      `Morada: ${dados.endereco}`,
      `Informações de saúde: ${dados.saude}`,
      `Observações: ${dados.observacoes}`,
      "",
      "Confirmo que as informações fornecidas são verdadeiras."
    ].join("\n");

    const urlWhatsApp =
      `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;

    // Abre o WhatsApp com a mensagem preenchida
    const janela = window.open(urlWhatsApp, "_blank");

    if (!janela) {
      window.location.assign(urlWhatsApp);
      return;
    }

    mensagemSucesso.textContent =
      "O WhatsApp foi aberto com os dados preenchidos. Reveja a mensagem e carregue em Enviar.";

    mensagemSucesso.style.display = "block";
  });

  formulario.addEventListener("input", () => {
    if (mensagemErro.style.display === "block") {
      mensagemErro.textContent = "";
      mensagemErro.style.display = "none";
    }
  });
})