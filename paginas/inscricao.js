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
    // PREFIXOS TELEFÓNICOS DE ANGOLA
    // =====================================================

    const prefixosUnitel = [
        "921", "922", "923", "924", "925",
        "926", "927", "928", "929"
    ];

    const prefixosAfricell = [
        "931", "932", "933", "934", "935",
        "936", "937", "938", "939",
        "951", "952", "953", "954", "955",
        "956", "957", "958", "959"
    ];

    const prefixosMovicel = [
        "911", "912", "913", "914", "915",
        "916", "917", "918", "919"
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
    // TELEFONE
    // =====================================================

    if (telefone) {

        // Permitir somente números
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


        // Limpar qualquer coisa que não seja número
        telefone.addEventListener("input", function () {

            this.value = this.value
                .replace(/[^0-9]/g, "")
                .slice(0, 9);

            validarTelefone();
        });


        // Bloquear colagem de letras/símbolos
        telefone.addEventListener("paste", function (evento) {

            evento.preventDefault();

            const textoColado =
                evento.clipboardData.getData("text");

            const somenteNumeros =
                textoColado.replace(/[^0-9]/g, "");

            this.value =
                somenteNumeros.slice(0, 9);

            validarTelefone();
        });


        // Impedir arrastar texto para o campo
        telefone.addEventListener("drop", function (evento) {

            evento.preventDefault();
        });


        // Validar ao sair do campo
        telefone.addEventListener("blur", function () {

            validarTelefone();
        });
    }


    // =====================================================
    // VALIDAR TELEFONE
    // =====================================================

    function validarTelefone() {

        if (!telefone) {
            return false;
        }

        const numero =
            telefone.value.trim();


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


        const prefixo =
            numero.substring(0, 3);


        const prefixoValido =
            prefixosUnitel.includes(prefixo) ||
            prefixosAfricell.includes(prefixo) ||
            prefixosMovicel.includes(prefixo);


        if (!prefixoValido) {

            mostrarErro(
                telefone,
                "Digite um número válido da Unitel, Africell ou Movicel.",
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
    // VALIDAR EMAIL
    // =====================================================

    function validarEmail() {

        if (!email) {
            return false;
        }

        const valor =
            email.value.trim();


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
    // VALIDAR EMAIL ENQUANTO ESCREVE
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
    // ENVIO DO FORMULÁRIO
    // =====================================================

    formulario.addEventListener("submit", function (evento) {

        // Impede a página de resetar/recarregar
        evento.preventDefault();


        // Validar telefone
        const telefoneValido =
            validarTelefone();


        // Validar email
        const emailValido =
            validarEmail();


        // Validar restantes campos obrigatórios
        const formularioValido =
            formulario.checkValidity();


        if (!telefoneValido) {

            telefone.focus();

            return;
        }


        if (!emailValido) {

            email.focus();

            return;
        }


        if (!formularioValido) {

            formulario.reportValidity();

            return;
        }


        // =================================================
        // PEGAR DADOS DO FORMULÁRIO
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


        const saudeAlunoElement =
            document.getElementById("saudeAluno");


        const saudeAluno =
            saudeAlunoElement
                ? saudeAlunoElement.value.trim()
                : "Não informado";


        // =================================================
        // CRIAR MENSAGEM
        // =================================================

        const textoWhatsApp =
`*NOVA INSCRIÇÃO — COLÉGIO JANCER*

*DADOS DO ALUNO*

Nome completo:
${nomeAluno}

Data de nascimento:
${dataNascimento}

Curso pretendido:
${curso}


*DADOS DO ENCARREGADO*

Nome:
${nomeResponsavel}

Telefone:
${numeroTelefone}

E-mail:
${enderecoEmail}

Morada:
${morada}


*INFORMAÇÕES DE SAÚDE*

Doenças, alergias ou outros problemas de saúde:
${saudeAluno || "Nenhuma informação fornecida."}


*INFORMAÇÕES ADICIONAIS*

${mensagem || "Nenhuma informação adicional."}


A pessoa confirma que as informações preenchidas são verdadeiras.`;


        // =================================================
        // CODIFICAR MENSAGEM
        // =================================================

        const mensagemCodificada =
            encodeURIComponent(textoWhatsApp);


        // =================================================
        // LINK CORRETO DO WHATSAPP
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