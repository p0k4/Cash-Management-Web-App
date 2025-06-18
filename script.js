let contadorOperacao = 1;

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
    const numDoc = document.getElementById("num-doc").value;
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

    const cellOpcoes = novaLinha.insertCell(5);

    // Botão Apagar
    const btn = document.createElement("button");
    btn.innerHTML = '<i class="fas fa-trash"></i> Apagar';
    btn.className = "btn-apagar-linha";
    btn.onclick = function () {
      novaLinha.remove();
      atualizarTotalTabela();
    };
    cellOpcoes.appendChild(btn);

    // Botão Editar
    const btnEditar = document.createElement("button");
    btnEditar.innerHTML = '<i class="fas fa-edit"></i> Editar';
    btnEditar.className = "btn-editar-linha";

    let valoresOriginais = [];

    btnEditar.onclick = function () {
      const emEdicao = btnEditar.textContent.includes("Guardar");

      if (emEdicao) {
        // Guardar alterações
        for (let i = 0; i <= 4; i++) {
          const input = novaLinha.cells[i].querySelector("input, select");
          let valor = input.tagName === "SELECT" ? input.value : input.value;
          novaLinha.cells[i].textContent =
            i === 4 ? parseFloat(valor).toFixed(2) + " €" : valor;
        }
        btnEditar.innerHTML = '<i class="fas fa-edit"></i> Editar';
        const btnCancelar = cellOpcoes.querySelector(".btn-cancelar-linha");
        if (btnCancelar) btnCancelar.remove();
        atualizarTotalTabela();
        return;
      }

      // Forçar saída de outras edições
      document.querySelectorAll("#tabelaRegistos tbody tr").forEach((linha) => {
        const outroEditar = linha.querySelector(".btn-editar-linha");
        if (
          outroEditar &&
          outroEditar !== btnEditar &&
          outroEditar.textContent.includes("Guardar")
        ) {
          outroEditar.click();
        }
      });

      // Entrar em modo de edição
      valoresOriginais = [];
      for (let i = 0; i <= 4; i++) {
        const cell = novaLinha.cells[i];
        const valorOriginal = cell.textContent.replace(" €", "").trim();
        valoresOriginais.push(valorOriginal);

        let input;
        if (i === 3) {
          input = document.createElement("select");
          ["Dinheiro", "Multibanco", "Transferência Bancária"].forEach(
            (opcao) => {
              const opt = document.createElement("option");
              opt.value = opt.textContent = opcao;
              if (opcao === valorOriginal) opt.selected = true;
              input.appendChild(opt);
            }
          );
        } else {
          input = document.createElement("input");
          input.value = valorOriginal;
        }

        input.style.width = "100%";
        cell.textContent = "";
        cell.appendChild(input);
      }

      btnEditar.innerHTML = '<i class="fas fa-check"></i> Guardar';

      // Botão Cancelar
      let btnCancelar = cellOpcoes.querySelector(".btn-cancelar-linha");
      if (btnCancelar) btnCancelar.remove();

      btnCancelar = document.createElement("button");
      btnCancelar.innerHTML = '<i class="fas fa-times"></i> Cancelar';
      btnCancelar.className = "btn-cancelar-linha";
      btnCancelar.onclick = function () {
        for (let i = 0; i <= 4; i++) {
          novaLinha.cells[i].textContent =
            i === 4
              ? parseFloat(valoresOriginais[i]).toFixed(2) + " €"
              : valoresOriginais[i];
        }
        btnEditar.innerHTML = '<i class="fas fa-edit"></i> Editar';
        btnCancelar.remove();
        atualizarTotalTabela();
      };

      cellOpcoes.appendChild(btnCancelar);
    };

    cellOpcoes.appendChild(btnEditar);

    apagar();
    contadorOperacao++;
    atualizarTotalTabela();
  } else {
    alert("Insira um valor válido!");
  }
}

function apagar() {
  document.getElementById("operacao").value = "Operação " + contadorOperacao;
  setarDataAtual();
  document.getElementById("num-doc").value = "";
  document.getElementById("pagamento").value = "Dinheiro";
  document.getElementById("valor").value = "";
}

function filtrarTabela() {
  const input = document.getElementById("filtroTabela");
  const filtro = input.value.toLowerCase();
  const tabela = document.getElementById("tabelaRegistos");
  const linhas = tabela.getElementsByTagName("tr");

  for (let i = 1; i < linhas.length; i++) {
    const celulas = linhas[i].getElementsByTagName("td");
    let corresponde = false;

    for (let j = 0; j < celulas.length; j++) {
      const texto = celulas[j].textContent || celulas[j].innerText;
      if (texto.toLowerCase().indexOf(filtro) > -1) {
        corresponde = true;
        break;
      }
    }

    linhas[i].style.display = corresponde ? "" : "none";
  }
  contadorOperacao++;
  atualizarTotalTabela();
}

function atualizarTotalTabela() {
  const tabela = document.getElementById("tabelaRegistos");
  const linhas = tabela.querySelectorAll("tbody tr");
  let total = 0;

  linhas.forEach((linha) => {
    if (linha.style.display !== "none") {
      const valorTexto = linha.cells[4].textContent.replace("€", "").trim();
      const valor = parseFloat(valorTexto.replace(",", "."));
      if (!isNaN(valor)) {
        total += valor;
      }
    }
  });

  document.getElementById("totalTabela").textContent =
    "Total: " + total.toFixed(2) + " €";
  document.getElementById("total").textContent = total.toFixed(2) + " €";
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
        if (index === 5) return; // Ignora a coluna de Opções
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

  const blobFinal = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const urlFinal = URL.createObjectURL(blobFinal);
  const link = document.createElement("a");
  link.setAttribute("href", urlFinal);
  link.setAttribute("download", "relatorio_caixa.csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

  document.getElementById("btnRegistar").disabled = !valido;
}

// Adicionar escutadores aos campos
["data", "num-doc", "pagamento", "valor"].forEach((id) => {
  document.getElementById(id).addEventListener("input", validarFormulario);
});

// ...outras funções...

async function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const tabela = document.getElementById("tabelaRegistos");
  const linhas = tabela.querySelectorAll("tbody tr");

  const headers = ["Operação", "Data", "Nº Documento", "Pagamento", "Valor"];
  const dados = [];
  let total = 0;

  linhas.forEach((linha) => {
    if (linha.style.display !== "none") {
      const celulas = linha.querySelectorAll("td");
      const linhaDados = [];
      for (let i = 0; i < 5; i++) {
        let texto = celulas[i].textContent.replace("€", "").trim();
        linhaDados.push(texto);
        if (i === 4) {
          const valor = parseFloat(texto.replace(",", "."));
          if (!isNaN(valor)) total += valor;
        }
      }
      dados.push(linhaDados);
    }
  });

  doc.text("Relatório de Caixa", 14, 15);
  doc.autoTable({
    startY: 20,
    head: [headers],
    body: dados,
  });

  doc.text(`Total: ${total.toFixed(2)} €`, 14, doc.lastAutoTable.finalY + 10);

  const hoje = new Date().toISOString().split("T")[0];
  doc.save(`relatorio_caixa_${hoje}.pdf`);
}
