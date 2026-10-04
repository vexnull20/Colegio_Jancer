document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formInscricao");

    if (!formulario) {
        return;
    }

    // =====================================================
    // NÚMERO DO WHATSAPP DO COLÉGIO
    // =====================================================

    const numeroWhatsApp = "244974501253";


    // =====================================================
    // CAMPOS
    // =====================================================

    const telefone = document.getElementById("telefone");
    const email = document.getElementById("email");

    const erroTelefone = document.getElementById("erroTelefone");
    const erroEmail = document.getElementById("erroEmail");


    // =====================================================
    // PREFIXOS DOS OPERADORES DE ANGOLA
    // =====================================================

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


    // =====================================================
    // MOSTRAR ERRO
    // =====================================================

    function mostrarErro(campo, mensagem, elementoErro) {

        campo.classList.remove("campo-valido");
        campo.classList.add("campo-invalido");

        if (elementoErro) {
            elementoErro.textContent = mensagem;
            elementoErro.style.display = "block";
        }
    }


    // =====================================================
    // REMOVER ERRO
    // =====================================================

    function removerErro(campo, elementoErro) {

        campo.classList.remove("campo-invalido");
        campo.classList.add("campo-valido");

        if (elementoErro) {
            elementoErro.textContent = "";
            elementoErro.style.display = "none";
        }
    }


    // =====================================================
    // VALIDAR TELEFONE
    // =====================================================

    function validarTelefone() {

        if (!telefone) {
            return false;
        }

        const numero = telefone.value.trim();


        if (numero === "") {

            mostrarErro(
                telefone,
                "Digite o número de telefone.",
                erroTelefone
            );

            return false;
        }


        if (!/^[0-9]+$/.test(numero)) {

            mostrarErro(
                telefone,
                "O telefone deve conter apenas números.",
                erroTelefone
            );

            return false;
        }


        if (numero.length !== 9) {

            mostrarErro(
                telefone,
                "O número deve ter exatamente 9 dígitos.",
                erroTelefone
            );

            return false;
        }


        if (!numero.startsWith("9")) {

            mostrarErro(
                telefone,
                "O número deve começar por 9.",
                erroTelefone
            );

            return false;
        }


        const prefixo = numero.substring(0, 3);

        if (!prefixosValidos.includes(prefixo)) {

            mostrarErro(
                telefone,
                "Digite um número válido de Angola.",
                erroTelefone
            );

            return false;
        }


        removerErro(
            telefone,
            erroTelefone
        );

        return true;
    }


    // =====================================================
    // TELEFONE — APENAS NÚMEROS
    // =====================================================

    if (telefone) {

        telefone.addEventListener("keydown", function (evento) {

            const teclasPermitidas = [
                "Backspace",
                "Delete",
                "Tab",
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
                "Home",
                "End"
            ];

            if (teclasPermitidas.includes(evento.key)) {
                return;
            }

            if (!/^[0-9]$/.test(evento.key)) {
                evento.preventDefault();
            }

        });


        telefone.addEventListener("input", function () {

            this.value = this.value
                .replace(/[^0-9]/g, "")
                .slice(0, 9);

            validarTelefone();

        });


        telefone.addEventListener("paste", function (evento) {

            evento.preventDefault();

            const texto =
                evento.clipboardData.getData("text");

            const apenasNumeros =
                texto.replace(/[^0-9]/g, "");

            this.value =
                apenasNumeros.slice(0, 9);

            validarTelefone();

        });


        telefone.addEventListener("drop", function (evento) {
            evento.preventDefault();
        });


        telefone.addEventListener("blur", function () {
            validarTelefone();
        });

    }


    // =====================================================
    // VALIDAR E-MAIL
    // =====================================================

    function validarEmail() {

        if (!email) {
            return false;
        }

        const valor = email.value.trim();


        if (valor === "") {

            mostrarErro(
                email,
                "Digite o seu e-mail.",
                erroEmail
            );

            return false;
        }


        const formatoEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


        if (!formatoEmail.test(valor)) {

            mostrarErro(
                email,
                "Digite um e-mail válido. Ex.: exemplo@email.com",
                erroEmail
            );

            return false;
        }


        removerErro(
            email,
            erroEmail
        );

        return true;
    }


    // =====================================================
    // VALIDAR E-MAIL ENQUANTO ESCREVE
    // =====================================================

    if (email) {

        email.addEventListener("input", function () {
            validarEmail();
        });

        email.addEventListener("blur", function () {
            validarEmail();
        });

    }


    // =====================================================
    // ENVIO DA INSCRIÇÃO
    // =====================================================

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


        // =================================================
        // RECOLHER DADOS
        // =================================================

        const nomeAluno =
            document.getElementById("nomeAluno").value.trim();

        const dataNascimento =
            document.getElementById("dataNascimento").value;

        const curso =
            document.getElementById("curso").value;

        const nomeResponsavel =
            document.getElementById("nomeResponsavel").value.trim();

        const numeroTelefone =
            telefone.value.trim();

        const enderecoEmail =
            email.value.trim();

        const morada =
            document.getElementById("morada").value.trim();

        const mensagem =
            document.getElementById("mensagem").value.trim();


        const campoSaude =
            document.getElementById("saudeAluno");

        const saudeAluno = campoSaude
            ? campoSaude.value.trim()
            : "Não informado";


        // =================================================
        // TRANSFORMAR O CURSO EM NOME
        // =================================================

        let nomeCurso = curso;

        if (curso === "informatica") {
            nomeCurso = "Informática";
        }

        if (curso === "cfb") {
            nomeCurso = "Ciências Físicas e Biológicas";
        }

        if (curso === "cej") {
            nomeCurso = "Ciências Económicas e Jurídicas";
        }


        // =================================================
        // MENSAGEM PARA O WHATSAPP
        // =================================================

        const textoWhatsApp = `
*NOVA INSCRIÇÃO — COLÉGIO JANCER*

━━━━━━━━━━━━━━━━━━━━

*DADOS DO ALUNO*

Nome completo:
${nomeAluno}

Data de nascimento:
${dataNascimento}

Curso pretendido:
${nomeCurso}

━━━━━━━━━━━━━━━━━━━━

*DADOS DO ENCARREGADO*

Nome:
${nomeResponsavel}

Telefone:
${numeroTelefone}

E-mail:
${enderecoEmail}

Morada:
${morada}

━━━━━━━━━━━━━━━━━━━━

*INFORMAÇÕES DE SAÚDE*

${saudeAluno || "Nenhuma informação fornecida."}

━━━━━━━━━━━━━━━━━━━━

*INFORMAÇÕES ADICIONAIS*

${mensagem || "Nenhuma informação adicional."}

━━━━━━━━━━━━━━━━━━━━

Inscrição enviada através do site do Colégio Jancer.
`;


        // =================================================
        // CODIFICAR A MENSAGEM
        // =================================================

        const mensagemCodificada =
            encodeURIComponent(textoWhatsApp);


        // =================================================
        // CRIAR LINK DO WHATSAPP
        // =================================================

        const linkWhatsApp =
            `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;


        // =================================================
        // ABRIR WHATSAPP
        // =================================================

        window.open(
            linkWhatsApp,
            "_blank"
        );

    });

});
