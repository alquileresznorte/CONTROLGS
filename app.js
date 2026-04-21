let datos = JSON.parse(localStorage.getItem("gastos")) || [];

function guardar() {
  const nuevo = {
    fecha: document.getElementById("fecha").value,
    tipo: document.getElementById("tipo").value,
    categoria: document.getElementById("categoria").value,
    persona: document.getElementById("persona").value,
    moneda: document.getElementById("moneda").value,
    monto: document.getElementById("monto").value,
    detalle: document.getElementById("detalle").value
  };

  datos.push(nuevo);
  localStorage.setItem("gastos", JSON.stringify(datos));

  mostrar();
}

function mostrar() {
  const tabla = document.querySelector("#tabla tbody");
  tabla.innerHTML = "";

  datos.forEach(d => {
    tabla.innerHTML += `
      <tr>
        <td>${d.fecha}</td>
        <td>${d.tipo}</td>
        <td>${d.categoria}</td>
        <td>${d.persona}</td>
        <td>${d.moneda}</td>
        <td>${d.monto}</td>
        <td>${d.detalle}</td>
      </tr>
    `;
  });
}

mostrar();
