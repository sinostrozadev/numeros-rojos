# Videos listos para subir a mano (YouTube Studio)

Generado: 2026-11-06 09:02 (America/Santiago) · 0 Short(s) + 1 video(s) largo(s), en orden de calendario.

Cómo: YouTube Studio → **Crear → Subir videos** → elige el archivo indicado. Copia el título y la
descripción **tal cual** (la descripción ya trae los hashtags al final). En "Público": **No, no es
contenido para niños**. En "Más opciones": idioma Español, categoría indicada, etiquetas. En
"Visibilidad": **Programar** con la fecha y hora indicadas (hora de Chile).

Al terminar, marca cada video como subido para que no vuelva a aparecer: en `salida/bandeja/<id>.json`
cambia `"estado": "listo"` por `"estado": "subido"` y agrega `"publicarEn": "<fecha ISO>"`
(así el calendario sabe que esa ranura ya está ocupada). Si no lo haces, solo se volverá a listar.

---

# Videos largos (tesis 16:9: miniatura propia, capítulos en la descripción, pausas publicitarias manuales en Studio)

## 1. Irlanda creció un 25 % en un año. Su gente, un 2 %

- **Archivo:** `/home/santiago/projects/yt/numeros-rojos/salida/bandeja/2026-11-06-tesis-irlanda-pib.mp4`
- **Programar para:** 2026-11-06 19:00 (America/Santiago)
- **Id:** `2026-11-06-tesis-irlanda-pib` · **Tipo:** LARGO 16:9 (sin #Shorts) · **Plantilla:** tesis · **Duración:** 09:46 · **Categoría:** Educación
- **Subir con el piloto:** `NR_CANAL_ID=… node herramientas/navegador/subir-studio.mjs 2026-11-06-tesis-irlanda-pib 2026-11-06 19:00`
- **Miniatura:** `/home/santiago/projects/yt/numeros-rojos/salida/bandeja/2026-11-06-tesis-irlanda-pib-mini.png`

**Título:**
```
Irlanda creció un 25 % en un año. Su gente, un 2 %
```

**Descripción:**
```
¿Cómo creció la economía de Irlanda un 25 % en 2015 si el consumo de su gente subió apenas un 2 %?

Capítulos:
0:00 Introducción
0:25 El salto de 2015 en el PIB de Irlanda
2:12 Quién llegó a Irlanda y por qué
4:16 PIB contra ingreso nacional
6:22 El bolsillo irlandés y el latinoamericano
8:41 El número que nadie mira

Hacemos la autopsia de un número: el PIB irlandés. Seguimos la inversión extranjera, las patentes y las exportaciones registradas en Dublín, y comparamos lo que se produce en Irlanda con lo que se queda en Irlanda.
Después aplicamos la misma lupa a Chile y Panamá: en América Latina la brecha entre PIB e ingreso existe, pero es mucho más chica.
El dato final: un irlandés consume prácticamente lo mismo que un alemán.

Fuentes:
- Banco Mundial, WDI: NY.GDP.MKTP.KD.ZG, NY.GDP.PCAP.PP.CD, NY.GNP.PCAP.PP.CD, BX.KLT.DINV.WD.GD.ZS, NE.EXP.GNFS.ZS, NE.CON.PRVT.PC.KD (CC BY 4.0) https://data.worldbank.org
- Comisión Europea, IP/16/2923 https://ec.europa.eu/commission/presscorner/detail/en/ip_16_2923
- CSO Irlanda, Modified GNI https://www.cso.ie/en/interactivezone/statisticsexplained/nationalaccountsexplained/modifiedgni/

Voz sintetizada. Gráficos generados a partir de datos abiertos.
No es asesoría financiera: el video describe lo que muestran los datos.

#economia #irlanda #pib #latinoamerica #datos
```

**Hashtags:**
```
#economia #irlanda #pib #latinoamerica #datos
```

**Etiquetas** (campo "Etiquetas" de Studio):
```
economia, irlanda, pib, latinoamerica, datos
```
