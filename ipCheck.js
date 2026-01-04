// ipCheck.js
(function () {

  const APP_ID = "278E597E-6BC5-4CB8-B649-636DE156563B";
  const REST_KEY = "4930CFD6-E6EB-4F95-8D96-16B2E5208391";

  document.documentElement.style.visibility = "hidden";

  function mostrarPopup(mensaje) {
    alert(mensaje || "El sistema está desactivado temporalmente.");
  }

  async function logAcceso(ip, permitido, motivo) {
    try {
      await fetch(
        `https://api.backendless.com/${APP_ID}/${REST_KEY}/data/ip_logs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ip,
            permitido,
            motivo,
            userAgent: navigator.userAgent,
            fecha: new Date()
          })
        }
      );
    } catch (e) {
      console.warn("No se pudo registrar log");
    }
  }

  async function obtenerEncendido() {
    const resp = await fetch(
      `https://api.backendless.com/${APP_ID}/${REST_KEY}/data/encendido?pageSize=1`
    );

    if (!resp.ok) throw new Error("Error consultando encendido");

    const data = await resp.json();
    if (!data.length) {
      // valores por defecto si no existe registro
      return { activo: true, filtro_ip: true };
    }

    return data[0];
  }

  async function verificarIP() {
    let ip = "desconocida";

    try {
      // 1️⃣ Comprobar ENCENDIDO y FILTRO IP
      const encendido = await obtenerEncendido();

      if (encendido.activo === false) {
        await logAcceso(ip, false, "sistema_apagado");
        mostrarPopup(encendido.mensaje);
        location.replace("https://google.com");
        return;
      }

      // 🔥 Si el filtro de IP está desactivado, se permite el acceso directamente
      if (encendido.filtro_ip === false) {
        await logAcceso("sin_verificar", true, "filtro_ip_desactivado");
        document.documentElement.style.visibility = "visible";
        return;
      }

      // 2️⃣ Obtener IP pública
      const ipResp = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
      const ipData = await ipResp.json();
      ip = ipData.ip;

      // 3️⃣ Obtener IPs permitidas
      const dbResp = await fetch(
        `https://api.backendless.com/${APP_ID}/${REST_KEY}/data/ips_permitidas?where=activa=true`
      );
      if (!dbResp.ok) throw new Error("Error Backendless IPs");

      const ipsPermitidas = (await dbResp.json()).map(row => row.ip);

      // 4️⃣ Validar IP
      if (!ipsPermitidas.includes(ip)) {
        await logAcceso(ip, false, "no_autorizada");
        location.replace("https://google.com");
        return;
      }

      // ✅ Todo correcto
      await logAcceso(ip, true, "ok");
      document.documentElement.style.visibility = "visible";

    } catch (err) {
      console.error("Error IP Check:", err);
      await logAcceso(ip, false, "error");
      document.documentElement.style.visibility = "none";
    }
  }

  verificarIP();
})();
