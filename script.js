let contadorOperacao = 1;
let contadorDoc = null;
function setarDataAtual() {
  const dataInput = document.getElementById("data");
  const hoje = new Date().toISOString().split("T")[0];
  dataInput.value = hoje;
}

function registar() {
  const valor = parseFloat(document.getElementById("valor").value);
  if (!isNaN(valor)) {
    const operacao = "Operação " + contadorOperacao;
    const data = document.getElementById("data").value;
    let numDocInput = document.getElementById("num-doc");

    if (contadorDoc === null) {
      contadorDoc = parseInt(numDocInput.value);
      if (isNaN(contadorDoc)) {
        alert("Insira um número de documento válido para iniciar.");
        return;
      }
      numDocInput.readOnly = true;
    }

    const numDoc = contadorDoc;
    contadorDoc++;
    numDocInput.value = contadorDoc;
    localStorage.setItem("contadorDoc", contadorDoc);
    atualizarHintProximoDoc();
    const pagamento = document.getElementById("pagamento").value;

    const tabela = document
      .getElementById("tabelaRegistos")
      .querySelector("tbody");
    const novaLinha = tabela.insertRow();
    novaLinha.insertCell(0).textContent = operacao;
    novaLinha.insertCell(1).textContent = data;
    novaLinha.insertCell(2).textContent = numDoc;
    novaLinha.insertCell(3).textContent = pagamento;
    novaLinha.insertCell(4).textContent = valor.toFixed(2) + " €";

    criarBotoesOpcoes(novaLinha);

    contadorOperacao++;
    salvarDadosLocal();
    apagar();
    atualizarTotalTabela();
  } else {
    alert("Insira um valor válido!");
  }
}

function apagar() {
  // Only set "operacao" if the element exists
  const operacaoInput = document.getElementById("operacao");
  if (operacaoInput) {
    operacaoInput.value = "Operação " + contadorOperacao;
  }
  setarDataAtual();
  document.getElementById("num-doc").value = "";
  document.getElementById("pagamento").value = "Dinheiro";
  document.getElementById("valor").value = "";
}

function filtrarTabela() {
  const input = document.getElementById("filtroTabela");
  const filtro = input.value.toLowerCase();
  const tabela = document
    .getElementById("tabelaRegistos")
    .getElementsByTagName("tbody")[0];
  const linhas = tabela.getElementsByTagName("tr");
  for (let i = 0; i < linhas.length; i++) {
    let mostrar = false;
    const celulas = linhas[i].getElementsByTagName("td");
    for (let j = 0; j < celulas.length - 1; j++) {
      if (celulas[j].textContent.toLowerCase().indexOf(filtro) > -1) {
        mostrar = true;
        break;
      }
    }
    linhas[i].style.display = mostrar ? "" : "none";
  }
}

function atualizarTotalTabela() {
  const tabela = document.getElementById("tabelaRegistos");
  const linhas = tabela.querySelectorAll("tbody tr");
  let total = 0;

  const totaisPorPagamento = {
    Dinheiro: 0,
    Multibanco: 0,
    "Transferência Bancária": 0,
  };

  linhas.forEach((linha) => {
    if (linha.style.display !== "none") {
      const valorTexto = linha.cells[4].textContent.replace("€", "").trim();
      const pagamento = linha.cells[3].textContent.trim();
      const valor = parseFloat(valorTexto.replace(",", "."));
      if (!isNaN(valor)) {
        total += valor;
        if (totaisPorPagamento[pagamento] !== undefined) {
          totaisPorPagamento[pagamento] += valor;
        }
      }
    }
  });

  document.getElementById("totalTabela").textContent =
    "Total: " + total.toFixed(2) + " €";
  const totalEl = document.getElementById("total");
  if (totalEl) {
    totalEl.textContent = total.toFixed(2) + " €";
  }

  // Atualiza os totais por método de pagamento
  const divTotaisPorPagamento = document.getElementById("totaisPagamento");
  if (divTotaisPorPagamento) {
    divTotaisPorPagamento.innerHTML = `
      <strong></strong><br/>
      - Dinheiro: ${totaisPorPagamento["Dinheiro"].toFixed(2)} €<br/>
      - Multibanco: ${totaisPorPagamento["Multibanco"].toFixed(2)} €<br/>
      - Transferência Bancária: ${totaisPorPagamento[
        "Transferência Bancária"
      ].toFixed(2)} €
    `;
  }
}

function salvarDadosLocal() {
  const tabela = document
    .getElementById("tabelaRegistos")
    .querySelector("tbody");
  const dados = [];
  if (!tabela) {
    localStorage.setItem("caixaPiscinaDados", JSON.stringify(dados));
    localStorage.setItem("contadorOperacao", contadorOperacao.toString());
    return;
  }
  const linhas = tabela.querySelectorAll("tr");

  linhas.forEach((linha) => {
    const celulas = linha.querySelectorAll("td");
    if (celulas.length >= 5) {
      dados.push({
        operacao: celulas[0].textContent,
        data: celulas[1].textContent,
        numDoc: celulas[2].textContent,
        pagamento: celulas[3].textContent,
        valor: celulas[4].textContent.replace(" €", ""),
      });
    }
  });

  localStorage.setItem("caixaPiscinaDados", JSON.stringify(dados));
  localStorage.setItem("contadorOperacao", contadorOperacao.toString());
}

function carregarDadosLocal() {
  const docSalvo = parseInt(localStorage.getItem("contadorDoc"));
  if (!isNaN(docSalvo)) {
    contadorDoc = docSalvo;
    const input = document.getElementById("num-doc");
    if (input) {
      input.value = contadorDoc;
      input.readOnly = true;
      atualizarHintProximoDoc();
    }
  }
  const dados = JSON.parse(localStorage.getItem("caixaPiscinaDados"));
  const contadorSalvo = parseInt(localStorage.getItem("contadorOperacao"));

  if (dados && Array.isArray(dados)) {
    dados.forEach((reg) => {
      const tabela = document
        .getElementById("tabelaRegistos")
        .querySelector("tbody");
      const novaLinha = tabela.insertRow();
      novaLinha.insertCell(0).textContent = reg.operacao;
      novaLinha.insertCell(1).textContent = reg.data;
      novaLinha.insertCell(2).textContent = reg.numDoc;
      novaLinha.insertCell(3).textContent = reg.pagamento;
      novaLinha.insertCell(4).textContent =
        parseFloat(reg.valor).toFixed(2) + " €";
      criarBotoesOpcoes(novaLinha);
    });
  }

  if (!isNaN(contadorSalvo)) {
    contadorOperacao = contadorSalvo;
  }

  atualizarTotalTabela();
}

function validarFormulario() {
  const campos = {
    data: document.getElementById("data"),
    numDoc: document.getElementById("num-doc"),
    pagamento: document.getElementById("pagamento"),
    valor: document.getElementById("valor"),
  };

  let valido = true;

  Object.values(campos).forEach((campo) => {
    if (!campo.value.trim()) {
      campo.classList.add("campo-invalido");
      valido = false;
    } else {
      campo.classList.remove("campo-invalido");
    }
  });
  return valido;
}

// Adiciona listeners de input aos campos do formulário
["data", "num-doc", "pagamento", "valor"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", validarFormulario);
  }
});

// Inicialização ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  carregarDadosLocal();
  setarDataAtual();
  validarFormulario();
  // Set initial value for "operacao" if the input exists
  const operacaoInput = document.getElementById("operacao");
  if (operacaoInput) {
    operacaoInput.value = "Operação " + contadorOperacao;
  }
  document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Evita submissão ou recarregamento padrão
    const btnRegistar = document.getElementById("btnRegistar");
    if (btnRegistar) btnRegistar.click();
  }
});
});

function criarBotoesOpcoes(linha) {
  const cellOpcoes = linha.insertCell(5);
  cellOpcoes.classList.add("col-opcoes");

  const btnApagar = document.createElement("button");
  btnApagar.innerHTML = '<i class="fas fa-trash"></i> Apagar';
  btnApagar.className = "btn-apagar-linha";
  btnApagar.onclick = function () {
    const confirmar = confirm("Tem certeza que deseja apagar esta linha?");
    if (confirmar) {
      linha.remove();
      salvarDadosLocal();
      atualizarTotalTabela();
    }
  };

  const btnEditar = document.createElement("button");
  btnEditar.innerHTML = '<i class="fas fa-edit"></i> Editar';
  btnEditar.className = "btn-editar-linha";

  let valoresOriginais = [];

  btnEditar.onclick = function () {
    const estaEditando = btnEditar.textContent.includes("Guardar");

    if (!estaEditando) {
      valoresOriginais = [];

      for (let i = 0; i <= 4; i++) {
        const cell = linha.cells[i];
        const valorOriginal = cell.textContent.replace(" €", "");
        valoresOriginais.push(valorOriginal);

        cell.textContent = "";

        if (i === 3) {
          const select = document.createElement("select");
          ["Dinheiro", "Multibanco", "Transferência Bancária"].forEach(
            (opcao) => {
              const opt = document.createElement("option");
              opt.value = opcao;
              opt.textContent = opcao;
              if (opcao === valorOriginal) opt.selected = true;
              select.appendChild(opt);
            }
          );
          cell.appendChild(select);
        } else {
          const input = document.createElement("input");
          input.value = valorOriginal;
          input.style.width = "100%";
          cell.appendChild(input);
        }
      }

      btnEditar.innerHTML = '<i class="fas fa-check"></i> Guardar';

      const btnCancelar = document.createElement("button");
      btnCancelar.innerHTML = '<i class="fas fa-times"></i> Cancelar';
      btnCancelar.className = "btn-cancelar-linha";
      btnCancelar.onclick = function () {
        for (let i = 0; i <= 4; i++) {
          linha.cells[i].textContent =
            i === 4
              ? parseFloat(valoresOriginais[i]).toFixed(2) + " €"
              : valoresOriginais[i];
        }
        btnEditar.innerHTML = '<i class="fas fa-edit"></i> Editar';
        btnCancelar.remove();
        salvarDadosLocal();
        atualizarTotalTabela();
      };

      cellOpcoes.appendChild(btnCancelar);
    } else {
      for (let i = 0; i <= 4; i++) {
        const input = linha.cells[i].querySelector("input, select");
        const valor =
          i === 4 ? parseFloat(input.value).toFixed(2) + " €" : input.value;
        linha.cells[i].textContent = valor;
      }
      btnEditar.innerHTML = '<i class="fas fa-edit"></i> Editar';
      const cancelarBtn = cellOpcoes.querySelector(".btn-cancelar-linha");
      if (cancelarBtn) cancelarBtn.remove();
      salvarDadosLocal();
      atualizarTotalTabela();
    }
  };
  btnEditar.style.marginRight = "5px";
  cellOpcoes.appendChild(btnEditar);
  cellOpcoes.appendChild(btnApagar);
}

function exportarRelatorio() {
  const tabela = document.getElementById("tabelaRegistos");
  let csv = "";
  let total = 0;
  const linhas = tabela.querySelectorAll("tr");

  linhas.forEach((linha, idx) => {
    if (linha.style.display !== "none") {
      const celulas = linha.querySelectorAll("th, td");
      let linhaCSV = [];
      celulas.forEach((celula, index) => {
        if (index === 5) return; // Ignora a coluna Opções
        let texto = celula.textContent.replace(/\n/g, "").trim();
        linhaCSV.push(texto);
        if (idx > 0 && index === 4) {
          let valor = parseFloat(texto.replace("€", "").replace(",", "."));
          if (!isNaN(valor)) total += valor;
        }
      });
      csv += linhaCSV.join(";") + "\n";
    }
  });

  csv += "\n------------------------------";
  csv += "\nTotal;;;;" + total.toFixed(2) + " €";

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio_caixa_${
    new Date().toISOString().split("T")[0]
  }.csv`;
  link.click();
}

document.getElementById("btnApagarTudo").addEventListener("click", function () {
  const confirmar = confirm("Tem certeza que deseja apagar TODOS os dados?");
  if (!confirmar) return;

  const tabela = document
    .getElementById("tabelaRegistos")
    .querySelector("tbody");
  tabela.innerHTML = ""; // remove todas as linhas

  localStorage.removeItem("caixaPiscinaDados");
  localStorage.removeItem("contadorOperacao");
  localStorage.removeItem("contadorDoc");
  contadorDoc = null;

  const inputDoc = document.getElementById("num-doc");
  inputDoc.readOnly = false;
  inputDoc.value = "";
  atualizarHintProximoDoc();

  contadorOperacao = 1;
  apagar(); // redefine os campos
  atualizarTotalTabela();
});
function atualizarHintProximoDoc() {
  const input = document.getElementById("num-doc");
  if (contadorDoc !== null) {
    input.placeholder = `Próximo Nº DOC: ${contadorDoc}`;
  } else {
    input.placeholder = "Insire o Nº DOC";
  }
}

function exportarRelatorio() {
  const tabela = document.getElementById("tabelaRegistos");
  let csv = "";
  let total = 0;
  const linhas = tabela.querySelectorAll("tr");

  linhas.forEach((linha, idx) => {
    if (linha.style.display !== "none") {
      const celulas = linha.querySelectorAll("th, td");
      let linhaCSV = [];
      celulas.forEach((celula, index) => {
        if (index === 5) return; // Ignora a coluna Opções
        let texto = celula.textContent.replace(/\n/g, "").trim();
        linhaCSV.push(texto);
        if (idx > 0 && index === 4) {
          let valor = parseFloat(texto.replace("€", "").replace(",", "."));
          if (!isNaN(valor)) total += valor;
        }
      });
      csv += linhaCSV.join(";") + "\n";
    }
  });

  csv += "\n------------------------------";
  csv += "\nTotal;;;;" + total.toFixed(2) + " €";

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio_caixa_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
}
function exportarPDF() {
  const doc = new jspdf.jsPDF();
  const data = [];
  let total = 0;

  const linhas = document.querySelectorAll("#tabelaRegistos tbody tr");

  linhas.forEach(linha => {
    if (linha.style.display !== "none") {
      const tds = linha.querySelectorAll("td");
      const row = [];
      for (let i = 0; i < 5; i++) {
        let texto = tds[i].textContent.trim().replace(" €", "");
        if (i === 4) {
          const num = parseFloat(texto.replace(",", "."));
          if (!isNaN(num)) total += num;
          row.push(num.toFixed(2) + " €");
        } else {
          row.push(texto);
        }
      }
      data.push(row);
    }
  });

  doc.text("Relatório de Caixa", 14, 15);
  doc.autoTable({
    head: [["Operação", "Data", "Nº Documento", "Pagamento", "Valor"]],
    body: data,
    startY: 20
  });

  doc.text(`Total: ${total.toFixed(2)} €`, 14, doc.autoTable.previous.finalY + 10);

  doc.save(`relatorio_caixa_${new Date().toISOString().split("T")[0]}.pdf`);
}

document.getElementById("btnApagarTudo").addEventListener("click", function () {
  const confirmar = confirm("Tem certeza que deseja apagar TODOS os dados?");
  if (!confirmar) return;

  const tabela = document.getElementById("tabelaRegistos").querySelector("tbody");
  tabela.innerHTML = ""; // remove todas as linhas

  localStorage.removeItem("caixaPiscinaDados");
  localStorage.removeItem("contadorOperacao");
  localStorage.removeItem("contadorDoc");
contadorDoc = null;

const inputDoc = document.getElementById("num-doc");
inputDoc.readOnly = false;
inputDoc.value = "";
atualizarHintProximoDoc();

  contadorOperacao = 1;
  apagar(); // redefine os campos
  atualizarTotalTabela();
})
function atualizarHintProximoDoc() {
  const input = document.getElementById("num-doc");
  if (contadorDoc !== null) {
    input.placeholder = `Próximo Nº DOC: ${contadorDoc}`;
  } else {
    input.placeholder = "Insire o Nº DOC";
  }
}

// Adiciona listeners para exportação se existirem os botões
const btnExportarRelatorio = document.getElementById("btnExportarRelatorio");
if (btnExportarRelatorio) {
  btnExportarRelatorio.addEventListener("click", exportarRelatorio);
}
const btnExportarPDF = document.getElementById("btnExportarPDF");
if (btnExportarPDF) {
  btnExportarPDF.addEventListener("click", exportarPDF);
}

  function fecharJanela() {
    const confirmar = confirm("Tem certeza que deseja fechar esta janela?");
    if (confirmar) {
      window.close();
    }
  }
