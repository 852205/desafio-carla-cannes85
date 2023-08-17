
class CaixaDaLanchonete {
    calcularValorDaCompra(metodoDePagamento, itens) {
        const metodoPagamento = validaFormaPgto(metodoDePagamento);

        if (!metodoPagamento) {
            return "Forma de pagamento inválida!";
        }

        let total = 0;
        const pedido = {};

        for (const item of itens) {
            const [codigo, quantidade] = item.split(",");

            if (!cardapio.find((item) => item.codigo === codigo)) {
                return "Item inválido!";
            }

            if (parseInt(quantidade) <= 0) {
                return "Quantidade inválida!";
            }

            if (!pedido[codigo]) {
                pedido[codigo] = { quantidade: 0 };
            }

            pedido[codigo].quantidade += parseInt(quantidade);
            total +=
                cardapio.find((item) => item.codigo === codigo).valor *
                parseInt(quantidade);
        }

        if (validaItensExtras(pedido, cardapio)) {
            return "Item extra não pode ser pedido sem o principal";
        }

        if (Number(total) === 0) {
            return "Não há itens no carrinho de compra!";
        }

        total = calculaTaxasDescontos(metodoPagamento, total);
        
        return formataMoeda(total);
    }
}

export { CaixaDaLanchonete };


function calculaTaxasDescontos(metodoPagamento, total) {
    if (metodoPagamento.desconto > 0) {
        total -= total * metodoPagamento.desconto;
    }

    if (metodoPagamento.taxa > 0) {
        total += total * metodoPagamento.taxa;
    }

    return total;
}

function formataMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

function validaFormaPgto(metodoDePagamento) {
    return formasDePagamento.find(
        (formaPgto) =>
            formaPgto.nome.toLowerCase() === metodoDePagamento.toLowerCase()
    );
}

function validaItensExtras(pedido, cardapio) {
    const resultado = Object.keys(pedido).find((codigo) => {
        const item = cardapio.find((item) => item.codigo === codigo);
        return (
            item.extra &&
            (!pedido[item.principal] || pedido[item.principal].quantidade === 0)
        );
    });

    return resultado || null;
}


const cardapio = [
    {
        codigo: "cafe",
        nome: "Café",
        valor: 3.0,
        extra: false,
        principal: "",
    },
    {
        codigo: "chantily",
        nome: "Chantily (extra do Café)",
        valor: 1.5,
        extra: true,
        principal: "cafe",
    },
    {
        codigo: "suco",
        nome: "Suco Natural",
        valor: 6.2,
        extra: false,
        principal: "",
    },
    {
        codigo: "sanduiche",
        nome: "Sanduíche",
        valor: 6.5,
        extra: false,
        principal: "",
    },
    {
        codigo: "queijo",
        nome: "Queijo (extra do Sanduíche)",
        valor: 2.0,
        extra: true,
        principal: "sanduiche",
    },
    {
        codigo: "salgado",
        nome: "Salgado",
        valor: 7.25,
        extra: false,
        principal: "",
    },
    {
        codigo: "combo1",
        nome: "1 Suco e 1 Sanduíche",
        valor: 9.5,
        extra: false,
        principal: "",
    },
    {
        codigo: "combo2",
        nome: "1 Café e 1 Sanduíche",
        valor: 7.5,
        extra: false,
        principal: "",
    },
];

const formasDePagamento = [
    { nome: "Dinheiro", desconto: 0.05, taxa: 0 },
    { nome: "Credito", desconto: 0, taxa: 0.03 },
    { nome: "Debito", desconto: 0, taxa: 0 },
];
