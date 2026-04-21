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
