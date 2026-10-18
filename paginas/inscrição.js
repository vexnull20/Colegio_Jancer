
document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formInscricao");

    if (!formulario) {
        return;
    }

    // Número oficial do WhatsApp utilizado no formulário.
    const numeroWhatsApp = "244974501253";

    // Campos do formulário.
    const nivelEnsino = document.getElementById("nivelEnsino");
    const curso = document.getElementById("curso");
    const telefone = document.getElementById("telefone");
    const email = document.getElementById("email");

    const erroTelefone = document.getElementById("erroTelefone");
    const erroEmail = document.getElementById("erroEmail");
    const mensagemSucesso = document.getElementById("mensagemSucesso");

    // Classes e cursos disponíveis por nível de ensino.
    const opcoesEnsino = {

        "Ensino Primário": [
            { value: "1.ª classe", text: "1.ª classe" },
            { value: "2.ª classe", text: "2.ª classe" },
            { value: "3.ª classe", text: "3.ª classe" },
            { value: "4.ª classe", text: "4.ª classe" },
            { value: "5.ª classe", text: "5.ª classe" },
            { value: "6.ª classe", text: "6.ª classe" }
        ],

        "I Ciclo do Ensino Secundário": [
            { value: "7.ª classe", text: "7.ª classe" },
            { value: "8.ª classe", text: "8.ª classe" },
            { value: "9.ª classe", text: "9.ª classe" }
        ],

        "II Ciclo do Ensino Secundário - Ensino Médio": [
            { value: "informatica", text: "Informática" },
            {
                value: "cfb",
                text: "Ciências Físicas e Biológicas (CFB)"
            },
            {
                value: "cej",
                text: "Ciências Económicas e Jurídicas (CEJ)"
            }
        ]

    };

    // Atualizar as opções quando o nível de ensino mudar.
    function atualizarOpcoesCurso() {

        const nivel = nivelEnsino.value;
        const opcoes = opcoesEnsino[nivel] || [];

        curso.replaceChildren();

        const opcaoInicial = document.createElement("option");
        opcaoInicial.value = "";

        opcaoInicial.textContent = opcoes.length
            ? "Selecione a classe ou o curso"
            : "Selecione primeiro o nível de ensino";

        curso.appendChild(opcaoInicial);

        opcoes.forEach(function (item) {

            const opcao = document.createElement("option");

            opcao.value = item.value;
            opcao.textContent = item.text;

            curso.appendChild(opcao);

        });

        curso.disabled = opcoes.length === 0;
        curso.value = "";

        curso.classList.remove("campo-valido", "campo-invalido");
    }

    nivelEnsino.addEventListener("change", atualizarOpcoesCurso);

    // Prefixos telefónicos aceites para os números angolanos.
    const prefixosValidos = [
        "911", "912", "913", "914", "915",
        "916", "917", "918", "919",

        "921", "922", "923", "924", "925",
        "926", "927", "928", "929",

        "931", "932", "933", "934", "935",
        "936", "937", "938", "939",

        "951", "952", "953", "954", "955",
        "956", "957", "958", "959"
    ];

    // Mostrar erros de validação.
    function mostrarErro(campo, mensagem, elementoErro) {

        campo.classList.remove("campo-valido");
        campo.classList.add("campo-invalido");

        if (elementoErro) {
            elementoErro.textContent = mensagem;
            elementoErro.style.display = "block";
        }

    }

    // Remover erros de validação.
    function removerErro(campo, elementoErro) {

        campo.classList.remove("campo-invalido");
        campo.classList.add("campo-valido");

        if (elementoErro) {
            elementoErro.textContent = "";
            elementoErro.style.display = "none";
        }

    }

    // Validar telefone.
    function validarTelefone() {

        const numero = telefone.value.trim();

        if (numero === "") {

            mostrarErro(
                telefone,
                "Digite o número de telefone.",
                erroTelefone
            );

            return false;
        }

        if (!/^[0-9]{9}$/.test(numero)) {

            mostrarErro(
                telefone,
                "O telefone deve conter exatamente 9 dígitos.",
                erroTelefone
            );

            return false;
        }

        const prefixo = numero.substring(0, 3);

        if (!numero.startsWith("9") ||
            !prefixosValidos.includes(prefixo)) {

            mostrarErro(
                telefone,
                "Digite um número válido de Angola.",
                erroTelefone
            );

            return false;
        }

        removerErro(telefone, erroTelefone);

        return true;
    }

    // Permitir apenas números no campo de telefone.
    telefone.addEventListener("input", function () {

        this.value = this.value
            .replace(/[^0-9]/g, "")
            .slice(0, 9);

        validarTelefone();

    });

    telefone.addEventListener("paste", function (evento) {

        evento.preventDefault();

        const texto = evento.clipboardData.getData("text");

        telefone.value = texto
            .replace(/[^0-9]/g, "")
            .slice(0, 9);

        validarTelefone();

    });

    telefone.addEventListener("drop", function (evento) {
        evento.preventDefault();
    });

    telefone.addEventListener("blur", validarTelefone);

    // Validar e-mail.
    function validarEmail() {

        const valor = email.value.trim();
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (valor === "") {

            mostrarErro(
                email,
                "Digite o seu e-mail.",
                erroEmail
            );

            return false;
        }

        if (!formatoEmail.test(valor)) {

            mostrarErro(
                email,
                "Digite um e-mail válido. Ex.: exemplo@email.com",
                erroEmail
            );

            return false;
        }

        removerErro(email, erroEmail);

        return true;
    }

    email.addEventListener("input", validarEmail);
    email.addEventListener("blur", validarEmail);

    // Obter o valor de um campo.
    function valor(id) {

        const elemento = document.getElementById(id);

        return elemento ? elemento.value.trim() : "";

    }

    // Transformar os códigos dos cursos em nomes legíveis.
    function nomeDoCurso(codigo) {

        const nomes = {
            informatica: "Informática",
            cfb: "Ciências Físicas e Biológicas (CFB)",
            cej: "Ciências Económicas e Jurídicas (CEJ)"
        };

        return nomes[codigo] || codigo;

    }

    // Preparar e abrir a inscrição no WhatsApp.
    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const telefoneValido = validarTelefone();
        const emailValido = validarEmail();

        if (!telefoneValido) {
            telefone.focus();
            return;
        }

        if (!emailValido) {
            email.focus();
            return;
        }

        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
        }

        const nomeAluno = valor("nomeAluno");
        const dataNascimento = valor("dataNascimento");
        const nivel = valor("nivelEnsino");
        const cursoEscolhido = valor("curso");

        const nomeResponsavel = valor("nomeResponsavel");
        const numeroTelefone = telefone.value.trim();
        const enderecoEmail = email.value.trim();
        const morada = valor("morada");

        const saudeAluno =
            valor("saudeAluno") || "Não informado";

        const mensagem =
            valor("mensagem") || "Nenhuma informação adicional.";

        const nomeCurso = nomeDoCurso(cursoEscolhido);

        // A mensagem inclui os dados do aluno e do encarregado.
        const textoWhatsApp = [
            "*NOVA INSCRIÇÃO — COLÉGIO JANCER*",
            "",
            "━━━━━━━━━━━━━━━━━━━━",
            "*DADOS DO ALUNO*",
            `Nome completo: ${nomeAluno}`,
            `Data de nascimento: ${dataNascimento}`,
            `Nível de ensino: ${nivel}`,
            `Classe/curso pretendido: ${nomeCurso}`,
            "",
            "━━━━━━━━━━━━━━━━━━━━",
            "*DADOS DO ENCARREGADO*",
            `Nome: ${nomeResponsavel}`,
            `Telefone: ${numeroTelefone}`,
            `E-mail: ${enderecoEmail}`,
            `Morada: ${morada}`,
            "",
            "━━━━━━━━━━━━━━━━━━━━",
            "*INFORMAÇÕES DE SAÚDE*",
            saudeAluno,
            "",
            "━━━━━━━━━━━━━━━━━━━━",
            "*INFORMAÇÕES ADICIONAIS*",
            mensagem,
            "",
            "━━━━━━━━━━━━━━━━━━━━",
            "Inscrição enviada através do site do Colégio Jancer."
        ].join("\n");

        const linkWhatsApp =
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;

        mensagemSucesso.style.display = "block";

        // Abre o WhatsApp com a mensagem preenchida.
        // O utilizador deve confirmar e tocar em Enviar no WhatsApp.
        const janelaWhatsApp = window.open(
            linkWhatsApp,
            "_blank"
        );

        // Alternativa caso o navegador bloqueie a nova janela.
        if (!janelaWhatsApp) {
            window.location.href = linkWhatsApp;
        }

    });

});
