// ==========================================
// COLÉGIO JANCER - JAVASCRIPT PRINCIPAL
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Site do Colégio Jancer carregado.");


    // ==========================================
    // SISTEMA DE VAGAS
    // ==========================================

    let vagas = JSON.parse(
        localStorage.getItem("vagasJancer")
    );


    // Vagas iniciais

    if (!vagas) {

        vagas = {
            informatica: 25,
            cfb: 20,
            cej: 20,
            desenhador: 15
        };

        localStorage.setItem(
            "vagasJancer",
            JSON.stringify(vagas)
        );

    }


    // ==========================================
    // MOSTRAR VAGAS
    // ==========================================

    const elementosVagas =
        document.querySelectorAll(".numero-vagas");


    elementosVagas.forEach(function (elemento) {

        const curso =
            elemento.dataset.curso;


        if (
            curso &&
            vagas[curso] !== undefined
        ) {

            elemento.textContent =
                vagas[curso];


            const caixa =
                elemento.closest(".curso");


            if (!caixa) {
                return;
            }


            const status =
                caixa.querySelector(".status-vaga");


            if (!status) {
                return;
            }


            if (vagas[curso] <= 0) {

                status.textContent =
                    "Vagas esgotadas";

                status.classList.add("esgotado");

            }

            else if (vagas[curso] <= 5) {

                status.textContent =
                    "Últimas vagas";

                status.classList.remove("esgotado");

            }

            else {

                status.textContent =
                    "Vagas disponíveis";

                status.classList.remove("esgotado");

            }

        }

    });


    // ==========================================
    // FORMULÁRIO DE INSCRIÇÃO
    // ==========================================

    const formulario =
        document.getElementById("formInscricao");


    if (formulario) {

        const campoCurso =
            document.getElementById("curso");


        // ------------------------------------------
        // SELECIONAR CURSO ATRAVÉS DA URL
        // Exemplo:
        // inscricao.html?curso=informatica
        // ------------------------------------------

        const parametros =
            new URLSearchParams(
                window.location.search
            );


        const cursoURL =
            parametros.get("curso");


        if (
            cursoURL &&
            vagas[cursoURL] !== undefined &&
            campoCurso
        ) {

            campoCurso.value =
                cursoURL;

        }


        // ------------------------------------------
        // ENVIAR INSCRIÇÃO
        // ------------------------------------------

        formulario.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                if (!campoCurso) {

                    alert(
                        "Não foi possível identificar o curso."
                    );

                    return;

                }


                const curso =
                    campoCurso.value;


                // Verificar curso

                if (!curso) {

                    alert(
                        "Selecione um curso."
                    );

                    campoCurso.focus();

                    return;

                }


                // Verificar se o curso existe

                if (
                    vagas[curso] === undefined
                ) {

                    alert(
                        "Curso selecionado inválido."
                    );

                    return;

                }


                // Verificar vagas

                if (vagas[curso] <= 0) {

                    alert(
                        "Desculpe. Este curso está sem vagas."
                    );

                    return;

                }


                // Retirar uma vaga

                vagas[curso]--;


                // Guardar novas vagas

                localStorage.setItem(
                    "vagasJancer",
                    JSON.stringify(vagas)
                );


                // Mensagem de sucesso

                alert(
                    "Inscrição recebida com sucesso!"
                );


                // Limpar formulário

                formulario.reset();


                // Atualizar campo de curso

                if (cursoURL) {

                    campoCurso.value =
                        cursoURL;

                }

            }
        );

    }


    // ==========================================
    // MENU MOBILE
    // ==========================================

    const botaoMenu =
        document.querySelector(".menu-mobile");

    const navegacao =
        document.querySelector(".nav-principal");


    if (
        botaoMenu &&
        navegacao
    ) {

        botaoMenu.addEventListener(
            "click",
            function () {

                navegacao.classList.toggle(
                    "menu-aberto"
                );

            }
        );

    }


    // ==========================================
    // FECHAR MENU AO CLICAR NUM LINK
    // ==========================================

    if (navegacao) {

        const links =
            navegacao.querySelectorAll("a");


        links.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    navegacao.classList.remove(
                        "menu-aberto"
                    );

                }
            );

        });

    }


    // ==========================================
    // ANO AUTOMÁTICO NO RODAPÉ
    // ==========================================

    const ano =
        document.getElementById("anoAtual");


    if (ano) {

        ano.textContent =
            new Date().getFullYear();

    }


    // ==========================================
    // BOTÕES COM SCROLL PARA SECÇÕES
    // ==========================================

    const botoesScroll =
        document.querySelectorAll(
            "[data-scroll]"
        );


    botoesScroll.forEach(function (botao) {

        botao.addEventListener(
            "click",
            function (evento) {

                const destino =
                    botao.dataset.scroll;


                const elemento =
                    document.getElementById(
                        destino
                    );


                if (elemento) {

                    evento.preventDefault();

                    elemento.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    });


    // ==========================================
    // FORMULÁRIOS DE CONTACTO / SUGESTÕES
    // ==========================================

    const formularios =
        document.querySelectorAll(
            "form[data-mensagem]"
        );


    formularios.forEach(function (form) {

        form.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                const mensagem =
                    form.dataset.mensagem ||
                    "Mensagem enviada com sucesso!";


                alert(mensagem);

                form.reset();

            }
        );

    });


    // ==========================================
    // ANIMAÇÃO SIMPLES AO ENTRAR NA PÁGINA
    // ==========================================

    const elementosAnimados =
        document.querySelectorAll(
            ".animar"
        );


    if (
        elementosAnimados.length > 0 &&
        "IntersectionObserver" in window
    ) {

        const observador =
            new IntersectionObserver(
                function (entradas) {

                    entradas.forEach(
                        function (entrada) {

                            if (
                                entrada.isIntersecting
                            ) {

                                entrada.target.classList.add(
                                    "visivel"
                                );

                                observador.unobserve(
                                    entrada.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.15
                }
            );


        elementosAnimados.forEach(
            function (elemento) {

                observador.observe(elemento);

            }
        );

    }

});