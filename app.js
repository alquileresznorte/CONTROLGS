let datos = JSON.parse(localStorage.getItem("gastos")) || [];

const usuarios = {
  admin: "admin123",
  hugo: "hugo123",
  loli: "loli123"
};

function iniciarSesion() {
  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;
  const errorLogin = document.getElementById("errorLogin");

  if (usuarios[usuario] === clave) {
    localStorage.setItem("usuarioActivo", usuario);
    errorLogin.textContent = "";
    mostrarApp();
  } else {
    errorLogin.textContent = "Usuario o contraseña incorrectos";
  }
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  document.getElementById("appBox").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
  document.getElementById("clave").value = "";
}

function mostrarApp() {
  const usuarioActivo = localStorage.getItem("usuarioActivo");

  if (!usuarioActivo) {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("appBox").style.display = "none";
    return;
  }

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("appBox").style.display = "block";

  const nombreVisible =
    usuarioActivo === "admin"
      ? "Admin"
      : usuarioActivo === "hugo"
      ? "Hugo"
      : "Loli";

  document.getElementById("usuarioActivo").textContent =
    "Usuario activo: " + nombreVisible;

  mostrar();
  actualizarResumen();
}

function guardar() {
  const fecha = document.getElementById("fecha").value;
  const tipo = document.getElementById("tipo").value;
  const categoria = document.getElementById("categoria").value;
  const persona = document.getElementById("persona").value;
  const moneda = document.getElementById("moneda").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const detalle = document.getElementById("detalle").value;

  if (!fecha || !tipo || !categoria || !persona || !moneda || isNaN(monto)) {
    alert("Completá fecha, tipo, categoría, persona, moneda y monto.");
    return;
  }

  const nuevo = {
    fecha,
    tipo,
    categoria,
    persona,
    moneda,
    monto,
    detalle
  };

  datos.push(nuevo);
  localStorage.setItem("gastos", JSON.stringify(datos));

  limpiarFormulario();
  mostrar();
  actualizarResumen();
}

function limpiarFormulario() {
  document.getElementById("fecha").value = "";
  document.getElementById("tipo").value = "Ingreso";
  document.getElementById("categoria").value = "Ingreso";
  document.getElementById("persona").value = "Hugo";
  document.getElementById("moneda").value = "ARS";
  document.getElementById("monto").value = "";
  document.getElementById("detalle").value = "";
}

function mostrar() {
  const tabla = document.querySelector("#tabla tbody");
  const usuarioActivo = localStorage.getItem("usuarioActivo");

  tabla.innerHTML = "";

  let datosFiltrados = datos;

  if (usuarioActivo === "hugo") {
    datosFiltrados = datos.filter(
      d => d.persona === "Hugo" || d.persona === "Familiar"
    );
  } else if (usuarioActivo === "loli") {
    datosFiltrados = datos.filter(
      d => d.persona === "Lorena" || d.persona === "Familiar"
    );
  }

  datosFiltrados.forEach(d => {
    tabla.innerHTML += `
      <tr>
        <td>${d.fecha}</td>
        <td>${d.tipo}</td>
        <td>${d.categoria}</td>
        <td>${d.persona}</td>
        <td>${d.moneda}</td>
        <td>${formatearMonto(d.monto, d.moneda)}</td>
        <td>${d.detalle || ""}</td>
      </tr>
    `;
  });
}

function actualizarResumen() {
  const usuarioActivo = localStorage.getItem("usuarioActivo");

  let datosFiltrados = datos;

  if (usuarioActivo === "hugo") {
    datosFiltrados = datos.filter(
      d => d.persona === "Hugo" || d.persona === "Familiar"
    );
  } else if (usuarioActivo === "loli") {
    datosFiltrados = datos.filter(
      d => d.persona === "Lorena" || d.persona === "Familiar"
    );
  }

  const ingresosARS = datosFiltrados
    .filter(d => d.tipo === "Ingreso" && d.moneda === "ARS")
    .reduce((acc, d) => acc + d.monto, 0);

  const gastosARS = datosFiltrados
    .filter(d => d.tipo === "Gasto" && d.moneda === "ARS")
    .reduce((acc, d) => acc + d.monto, 0);

  const ahorroUSD = datosFiltrados
    .filter(d => d.moneda === "USD")
    .reduce((acc, d) => {
      if (d.tipo === "Ingreso") return acc + d.monto;
      if (d.tipo === "Gasto") return acc - d.monto;
      return acc;
    }, 0);

  document.getElementById("totalIngresos").textContent =
    "$ " + ingresosARS.toLocaleString("es-AR");

  document.getElementById("totalGastos").textContent =
    "$ " + gastosARS.toLocaleString("es-AR");

  document.getElementById("totalUsd").textContent =
    "USD " + ahorroUSD.toLocaleString("es-AR");
}

function formatearMonto(monto, moneda) {
  if (moneda === "USD") {
    return "USD " + Number(monto).toLocaleString("es-AR");
  }
  return "$ " + Number(monto).toLocaleString("es-AR");
}

mostrarApp();
