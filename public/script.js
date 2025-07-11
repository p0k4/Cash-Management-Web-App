let contadorOperacao = 1;
let contadorDoc = null;
function setarDataAtual() {
  const dataInput = document.getElementById("data");
  const hoje = new Date().toISOString().split("T")[0];
  dataInput.value = hoje;
}

function registar() {
  const valor = parseFloat(document.getElementById("valor").value);
  const pagamento = document.getElementById("pagamento").value;

  if (!pagamento) {
    alert("Por favor, selecione um método de pagamento.");
    return;
  }

  let pagamentoFinal = pagamento;
  if (pagamento === "Multibanco") {
    const opTPA = document.getElementById("op-tpa").value.trim();
    if (!opTPA) {
      alert("Por favor, insira o código OP TPA.");
      return;
    }
    pagamentoFinal += ` (OP TPA: ${opTPA})`;
  }

  // Verifica se o método de pagamento foi selecionado
  if (!pagamento) {
    alert("Por favor, selecione um método de pagamento.");
    return;
  }

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

    const tabela = document
      .getElementById("tabelaRegistos")
      .querySelector("tbody");
    const novaLinha = tabela.insertRow();
    novaLinha.insertCell(0).textContent = operacao;
    novaLinha.insertCell(1).textContent = data;
    novaLinha.insertCell(2).textContent = numDoc;
    novaLinha.insertCell(3).textContent = pagamentoFinal;
    novaLinha.insertCell(4).textContent = valor.toFixed(2) + " €";

    criarBotoesOpcoes(novaLinha);

    contadorOperacao++;
    salvarDadosLocal();
    apagar(); // Esta função vai limpar os campos
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
  document.getElementById("pagamento").value = "";
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
    atualizarTotalTabela();
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
      let pagamento = linha.cells[3].textContent.trim();

      // Remove a parte do OP TPA, se existir
      const metodoBase = pagamento.split(" (OP TPA")[0].trim();

      const valor = parseFloat(valorTexto.replace(",", "."));
      if (!isNaN(valor)) {
        total += valor;
        if (totaisPorPagamento[metodoBase] !== undefined) {
          totaisPorPagamento[metodoBase] += valor;
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
      <strong></strong>
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
              if (valorOriginal.startsWith(opcao)) opt.selected = true;
              select.appendChild(opt);
            }
          );

          const opTPAInput = document.createElement("input");
          opTPAInput.type = "text";
          opTPAInput.placeholder = "OP TPA";
          opTPAInput.style.marginLeft = "0px";
          opTPAInput.style.width = "180px"; // 👈 ajusta aqui o tamanho como quiseres
          opTPAInput.style.display = valorOriginal.startsWith("Multibanco")
            ? "inline-block"
            : "none";
          opTPAInput.value = valorOriginal.includes("OP TPA")
            ? valorOriginal.split("OP TPA:")[1]?.replace(")", "").trim()
            : "";
          select.addEventListener("change", () => {
            opTPAInput.style.display =
              select.value === "Multibanco" ? "inline-block" : "none";
            if (select.value !== "Multibanco") opTPAInput.value = "";
          });

          cell.appendChild(select);
          cell.appendChild(opTPAInput);
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
        if (i === 3) {
          const select = linha.cells[i].querySelector("select");
          const opTPA = linha.cells[i].querySelector("input");
          const pagamentoFinal =
            select.value === "Multibanco" && opTPA.value.trim()
              ? `${select.value} (OP TPA: ${opTPA.value.trim()})`
              : select.value;
          linha.cells[i].textContent = pagamentoFinal;
        } else {
          const input = linha.cells[i].querySelector("input");
          const valor =
            i === 4 ? parseFloat(input.value).toFixed(2) + " €" : input.value;
          linha.cells[i].textContent = valor;
        }
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
        if (index === 5) return; // Ignora "Opções"
        let texto = celula.textContent.replace(/\n/g, "").trim();
        texto = texto.replace(/;/g, ","); // Garante que não há conflitos com separador
        linhaCSV.push(`"${texto}"`); // Envolve em aspas por segurança
        if (idx > 0 && index === 4) {
          let valor = parseFloat(texto.replace("€", "").replace(",", "."));
          if (!isNaN(valor)) total += valor;
        }
      });
      csv += linhaCSV.join(";") + "\n";
    }
  });

  csv += "\n;;;;Total: " + total.toFixed(2) + " €";

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio_caixa_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
}

function exportarPDF() {
  if (!window.jspdf || !window.jspdf.jsPDF || typeof window.jspdf.jsPDF !== "function") {
    alert("jsPDF ou AutoTable não está carregado corretamente.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const data = [];
  let total = 0;

  const linhas = document.querySelectorAll("#tabelaRegistos tbody tr");

  linhas.forEach((linha) => {
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

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Relatório de Caixa", 105, 15, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const dataHora = new Date().toLocaleString("pt-PT");
  doc.text(`Exportado em: ${dataHora}`, 105, 22, { align: "center" });

  doc.autoTable({
    head: [["Operação", "Data", "Nº Documento", "Pagamento", "Valor"]],
    body: data,
    startY: 35,
    styles: {
      halign: "center",
      fontSize: 10,
    },
    headStyles: {
      fillColor: [13, 74, 99],
      textColor: 255,
      fontStyle: "bold",
    },
  });

  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${total.toFixed(2)} €`, 200, doc.lastAutoTable.finalY + 10, {
    align: "right",
  });

  doc.save(`relatorio_caixa_${new Date().toISOString().split("T")[0]}.pdf`);
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
document.getElementById("pagamento").addEventListener("change", function () {
  const campoTPA = document.getElementById("campo-tpa");
  if (this.value === "Multibanco") {
    campoTPA.style.display = "block";
  } else {
    campoTPA.style.display = "none";
    document.getElementById("op-tpa").value = ""; // limpa o campo se mudar
  }
});
