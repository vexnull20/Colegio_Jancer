
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Número da Secretaria do Colégio Jancer
  const numeroWhatsApp = "244974501253";

  const formulario = document.getElementById("formInscricao");
  const nivelEnsino = document.getElementById("nivelEnsino");
  const curso = document.getElementById("curso");
  const mensagemErro = document.getElementById("mensagemErro");
  const mensagemSucesso = document.getElementById("mensagemSucesso");
  const botaoEnviar = document.getElementById("botaoEnviarWhatsApp");

  if (!formulario || !nivelEnsino || !curso || !botaoEnviar) {
    console.error(
      "Formulário de inscrição: faltam elementos obrigatórios no HTML."
    );
    return;
  }

  // Classes e cursos disponíveis por nível de ensino
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
      ["informatica", "Informática"],
      ["cfb", "Ciências Físicas e Biológicas (CFB)"],
      ["cej", "Ciências Económicas e Jurídicas (CEJ)"]
    ]
  };

  function mostrarErro(texto) {
    mensagemErro.textContent = texto;
    mensagemErro.style.display = "block";
    mensagemSucesso.style.display = "none";

    mensagemErro.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  function limparMensagens() {
    mensagemErro.textContent = "";
    mensagemErro.style.display = "none";

    mensagemSucesso.textContent = "";
    mensagemSucesso.style.display = "none";
  }

  // Atualiza a lista de classes/cursos ao escolher o nível
  function atualizarOpcoesCurso() {
    const nivel = nivelEnsino.value;

    curso.innerHTML = "";

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = nivel
      ? "Selecione a classe ou o curso"
      : "Selecione primeiro o nível de ensino";

    curso.appendChild(opcaoInicial);

    const opcoes = opcoesPorNivel[nivel] || [];

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

  // Permite selecionar automaticamente um curso vindo de outra página.
  // Exemplo: inscricao.html?curso=informatica
  const parametros = new URLSearchParams(window.location.search);
  const cursoPreselecionado = parametros.get("curso");

  if (cursoPreselecionado) {
    nivelEnsino.value = "ciclo2";
    atualizarOpcoesCurso();

    const existeCurso = [...curso.options].some(
      opcao => opcao.value === cursoPreselecionado
    );

    if (existeCurso) {
      curso.value = cursoPreselecionado;
    }
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limparMensagens();

    // Verifica os campos obrigatórios do formulário
    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    if (!nivelEnsino.value || !curso.value) {
      mostrarErro(
        "Selecione o nível de ensino e a classe ou curso pretendido."
      );
      return;
    }

    // Valida o número de telefone angolano
    const telefoneDigitado = document
      .getElementById("telefone")
      .value.trim();

    const telefone = telefoneDigitado.replace(/[^\d]/g, "");

    const telefoneLocal = telefone.startsWith("244")
      ? telefone.slice(3)
      : telefone;

    if (!/^9\d{8}$/.test(telefoneLocal)) {
      mostrarErro(
        "Introduza um número angolano válido com 9 dígitos, por exemplo 974501253."
      );

      document.getElementById("telefone").focus();
      return;
    }

    // Valida o e-mail, caso tenha sido preenchido
    const email = document.getElementById("email").value.trim();

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
    ) {
      mostrarErro("Verifique o endereço de e-mail introduzido.");

      document.getElementById("email").focus();
      return;
    }

    // Confirmação obrigatória dos dados
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

    // Recolhe todas as informações preenchidas
    const dados = {
      aluno: document.getElementById("nomeAluno").value.trim(),

      nascimento: document.getElementById("dataNascimento").value,

      encarregado: document
        .getElementById("nomeEncarregado")
        .value.trim(),

      telefone: telefoneLocal,

      email: email || "Não indicado",

      endereco: document.getElementById("endereco").value.trim(),

      saude:
        document.getElementById("saude").value.trim() ||
        "Não indicado",

      observacoes:
        document.getElementById("observacoes").value.trim() ||
        "Nenhuma"
    };

    let dataFormatada = "Não indicada";

    if (dados.nascimento) {
      const data = new Date(`${dados.nascimento}T00:00:00`);

      dataFormatada = data.toLocaleDateString("pt-PT");
    }

    // Cria a mensagem completa para a Secretaria
    const textoWhatsApp = [
      "INSCRIÇÃO — COLÉGIO JANCER",
      "",
      "Confirmo que os dados abaixo foram revistos no formulário de inscrição.",
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
      "Declaração: confirmo que as informações fornecidas são verdadeiras."
    ].join("\n");

    // Abre o WhatsApp da Secretaria com a mensagem já preenchida
    const urlWhatsApp =
      `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;

    const janela = window.open(
      urlWhatsApp,
      "_blank",
      "noopener,noreferrer"
    );

    // Se o navegador bloquear a nova janela, abre na mesma página
    if (!janela) {
      window.location.href = urlWhatsApp;
      return;
    }

    mensagemSucesso.textContent =
      "O WhatsApp foi aberto com os dados da inscrição preenchidos. Reveja a mensagem e carregue em Enviar no WhatsApp.";

    mensagemSucesso.style.display = "block";
  });

  // Oculta mensagens de erro quando a pessoa corrige os campos
  formulario.addEventListener("input", () => {
    if (mensagemErro.style.display === "block") {
      mensagemErro.style.display = "none";
      mensagemErro.textContent = "";
    }
  });
});
