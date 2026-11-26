#!/usr/bin/env python3
"""Arma el guion del largo Haití–República Dominicana (En Números Rojos, 2026-11-26).
   python3 guion.py > /home/santiago/projects/yt/numeros-rojos/contenido/guiones/2026-11-26-tesis-haiti-republica-dominicana.json
   Las fotos exactas (File:…) se leen de fotos.json (ranura -> {archivo, busqueda, pie})."""
import json, os, sys

ID = '2026-11-26-tesis-haiti-republica-dominicana'
AQUI = os.path.dirname(os.path.abspath(__file__))
FOTOS = json.load(open(os.path.join(AQUI, 'fotos.json'))) if os.path.exists(os.path.join(AQUI, 'fotos.json')) else {}

MAD = 'gdp-per-capita-maddison-project-database'
ETQ_MAD = 'Ingreso por persona (Maddison, US$ de 2011)'

def mad(paises, desde=None, hasta=None):
    d = {'fuente': 'owid', 'indicador': MAD, 'paises': paises, 'etiqueta': ETQ_MAD, 'unidad': 'US$'}
    if desde: d['desde'] = desde
    if hasta: d['hasta'] = hasta
    return d

def wdi(ind, paises, etiqueta, unidad, desde=None, hasta=None):
    d = {'fuente': 'wdi', 'indicador': ind, 'paises': paises, 'etiqueta': etiqueta, 'unidad': unidad}
    if desde: d['desde'] = desde
    if hasta: d['hasta'] = hasta
    return d

def cifra(texto, valor, datos, op, pais=None, paisB=None, anio=None, anioB=None, tol=None, umbral=None):
    c = {'datos': datos, 'operacion': op}
    for k, v in (('pais', pais), ('paisB', paisB), ('anio', anio), ('anioB', anioB), ('umbral', umbral)):
        if v is not None: c[k] = v
    out = {'texto': texto, 'valor': valor, 'calculo': c}
    if tol is not None: out['tolerancia'] = tol
    return out

BUSQ = {
    'beisbol-costura': 'baseball closeup stitches', 'frontera-satelite': 'Haiti deforestation border NASA', 'isla-satelite': 'Hispaniola satellite',
    'mapa-colonial': 'Saint-Domingue map 18th century', 'ingenio-azucar': 'sugar plantation engraving 18th century Caribbean', 'revolucion': 'Battle for Palm Tree Hill Suchodolski',
    'buques-1825': 'French ship of the line 1820s painting', 'carlos-x-1825': 'Charles X Haiti 1825', 'boyer': 'Jean-Pierre Boyer president Haiti',
    'marines-1915': 'United States Marines Haiti 1915', 'trujillo': 'Rafael Trujillo', 'duvalier': 'François Duvalier', 'santo-domingo-1965': 'Santo Domingo 1965 United States troops',
    'balaguer': 'Joaquín Balaguer', 'punta-cana': 'Punta Cana beach', 'santo-domingo-hoy': 'Santo Domingo skyline', 'puerto-principe-hoy': 'Port-au-Prince view',
    'carbon': 'charcoal Haiti', 'cerros-pelados': 'Haiti deforested hills', 'cerdo-criollo': 'Creole pig Haiti', 'arroz-artibonite': 'rice Artibonite Haiti',
    'palacio-2010': 'Haitian National Palace earthquake 2010', 'dajabon-mercado': 'Dajabón market', 'pico-duarte': 'Pico Duarte', 'cana-corte': 'sugar cane cutting Dominican Republic',
    'remesas-diaspora': 'Little Haiti Miami', 'clinton-2010': 'Bill Clinton Haiti 2010', 'zona-franca': 'garment factory Dominican Republic', 'citadelle': 'Citadelle Laferrière',
}

def foto(ranura, pie=None, sangrado=True, dice=None, encuadre=None):
    f = FOTOS.get(ranura, {})
    v = {'tipo': 'foto', 'busqueda': f.get('busqueda') or BUSQ[ranura]}
    if f.get('archivo'): v['archivo'] = f['archivo']
    p = pie if pie is not None else f.get('pie')
    if p: v['pie'] = p
    if sangrado: v['sangrado'] = True
    if dice: v['dice'] = dice
    if encuadre: v['encuadre'] = encuadre
    return v

def mapa(destacar, zoom=None, centro=None, etiquetas=None, acercar=False, dice=None, viaje=None):
    v = {'tipo': 'mapa', 'destacar': destacar}
    if zoom: v['zoom'] = zoom
    if centro: v['centro'] = centro
    if etiquetas: v['etiquetas'] = [{'texto': t, 'en': e} for t, e in etiquetas]
    if acercar: v['acercar'] = True
    if dice: v['dice'] = dice
    if viaje: v['viaje'] = viaje
    return v

ISLA = [-71.2, 18.9]
PAP, SDQ = ('Puerto Príncipe', [-72.34, 18.54]), ('Santo Domingo', [-69.93, 18.47])

def esc(tipo, texto, **k):
    e = {'tipo': tipo, 'texto': texto}
    e.update({a: b for a, b in k.items() if b is not None})
    return e

PPA = wdi('NY.GDP.PCAP.PP.KD', ['DOM', 'HTI'], 'Ingreso por persona (a precios comparables, US$ de 2021)', 'US$', 1990, 2024)
POB = wdi('SP.POP.TOTL', ['HTI', 'DOM'], 'Población', 'personas', 1960, 2024)
BOSQUE = wdi('AG.LND.FRST.ZS', ['DOM', 'HTI'], 'Superficie con bosque (% del territorio)', '%', 2022, 2022)
LUZ = wdi('EG.ELC.ACCS.ZS', ['DOM', 'HTI'], 'Población con electricidad en casa', '%', 2023, 2023)
TUR = wdi('ST.INT.ARVL', ['DOM', 'HTI'], 'Llegadas de visitantes internacionales', 'personas', 2019, 2019)
VIDA = wdi('SP.DYN.LE00.IN', ['HTI'], 'Esperanza de vida al nacer', 'años', 2000, 2015)
CREC = wdi('NY.GDP.PCAP.KD.ZG', ['DOM', 'HTI'], 'Años en que el ingreso por persona cayó', '% anual', 1961, 2024)
CREC_HTI = wdi('NY.GDP.PCAP.KD.ZG', ['HTI'], 'Años en que el ingreso por persona cayó', '% anual', 1975, 2000)
REM = wdi('BX.TRF.PWKR.DT.GD.ZS', ['HTI', 'DOM'], 'Remesas recibidas (% de la economía)', '%', 1990, 2024)
FMT_USD = {'prefijo': 'US$ ', 'decimales': 0}

gancho = {
    'texto': 'Hasta fines de los ochenta, las pelotas de las Grandes Ligas se cosían a mano en Haití. Ciento ocho puntadas, una por una. '
             'Al otro lado de la misma isla, en República Dominicana, crecían los que iban a batearlas. '
             'Hoy, un dominicano produce casi nueve veces lo que un haitiano. Y eso no es lo raro. Lo raro es que en 1954 el que iba adelante era Haití.',
    'rotulo': 'UNA ISLA, DOS PAÍSES',
    'visuales': [
        foto('beisbol-costura', pie=''),
        mapa(['HTI'], zoom=6.3, centro=ISLA, etiquetas=[PAP], dice='Haití.'),
        mapa(['DOM', 'HTI'], zoom=6.3, centro=ISLA, etiquetas=[PAP, SDQ], dice='isla,'),
        foto('santo-domingo-hoy', pie='Santo Domingo', dice='Hoy,'),
        foto('puerto-principe-hoy', pie='Puerto Príncipe', dice='haitiano.'),
        foto('frontera-satelite', pie='La frontera desde el espacio · NASA', dice='raro.'),
    ],
    'cifras': [
        cifra('casi nueve veces', 8.7, PPA, 'razon', 'DOM', 'HTI', 2024),
        cifra('en 1954 el que iba adelante era Haití', 1.03, mad(['HTI', 'DOM'], 1950, 2022), 'razon', 'HTI', 'DOM', 1954),
    ],
}

promesa = ('Para esto, todo el mundo tiene una explicación a mano. La deuda con Francia. Los dictadores. El terremoto. Yo también traía la mía. '
           'Pero todas chocan con el mismo dato: hace setenta años, estos dos países eran igual de pobres. '
           'Así que voy a buscar el momento exacto en que se separan. Te aviso que no cae donde yo esperaba.')
promesaVisual = {'tipo': 'iconos', 'titulo': 'Las explicaciones de siempre', 'items': [
    {'icono': '📜', 'texto': 'La deuda con Francia', 'dice': 'deuda'},
    {'icono': '🎖️', 'texto': 'Los dictadores', 'dice': 'dictadores.'},
    {'icono': '🏚️', 'texto': 'El terremoto', 'dice': 'terremoto.'},
]}

M_TODO = mad(['HTI', 'DOM'], 1950, 2022)
cap1 = {'titulo': '1950: dos países empatados', 'escenas': [
    esc('planteamiento', 'Primero, el tamaño. La isla se llama La Española y cabe dos veces dentro de Uruguay. Haití ocupa algo más de un tercio. '
        'República Dominicana, el resto. Y a cada lado viven hoy unos once millones y medio de personas.',
        visual=mapa(['HTI', 'DOM'], zoom=6.3, centro=ISLA, etiquetas=[PAP, SDQ], acercar=True),
        sellos=[{'texto': '11,5 M', 'pais': 'HTI', 'dice': 'once'}],
        cifras=[cifra('unos once millones y medio', 11.77e6, POB, 'valor', 'HTI', anio=2024), cifra('a cada lado', 11.43e6, POB, 'valor', 'DOM', anio=2024)]),
    esc('dato', 'Ahora, la carrera. El Proyecto Maddison, de la Universidad de Groningen, reconstruye cuánto producía por persona cada país, año por año. '
        'La línea dorada es Haití. Mira dónde parten las dos: pegadas. En 1954, Haití todavía va adelante.',
        fuenteEnVoz=True,
        grafico={'tipo': 'lineas', 'titulo': 'La partida: 1950 a 1960', 'datos': mad(['HTI', 'DOM'], 1950, 1960), 'destacar': {'pais': 'HTI'},
                 'anotaciones': [{'anio': 1954, 'texto': 'Haití, adelante', 'dice': '1954,'}], 'formato': FMT_USD, 'dice': 'Maddison,'},
        cifras=[cifra('En 1954, Haití todavía va adelante', 1.03, M_TODO, 'razon', 'HTI', 'DOM', 1954)]),
    esc('dato', 'Ahora suelta el tiempo. Una línea despega y casi no para. La otra se queda en el suelo. '
        'En 2022, un dominicano producía más de once veces lo que un haitiano.',
        grafico={'tipo': 'lineas', 'titulo': 'Haití y República Dominicana, 1950–2022', 'datos': M_TODO, 'destacar': {'pais': 'HTI'}, 'formato': FMT_USD},
        sellos=[{'texto': '11×', 'pais': 'DOM', 'animo': 'feliz', 'dice': 'once'}],
        cifras=[cifra('más de once veces', 11.4, M_TODO, 'razon', 'DOM', 'HTI', 2022)]),
    esc('giro', 'Esto me descolocó cuando armé el gráfico. Yo esperaba ver a Haití perdiendo desde el primer año. Lo que hay, al principio, es un empate.',
        rotulo={'texto': 'EMPATE', 'dice': 'empate.'}),
    esc('relato', 'Eso cambia la pregunta. ¿Qué pasó después del empate? Tengo tres sospechosos: la historia, la geografía y la política. Empiezo por el que todos señalan.',
        visual={'tipo': 'iconos', 'titulo': 'Tres sospechosos', 'items': [
            {'icono': '📜', 'texto': 'La historia', 'dice': 'historia,'}, {'icono': '⛰️', 'texto': 'La geografía', 'dice': 'geografía'}, {'icono': '🏛️', 'texto': 'La política', 'dice': 'política.'}]}),
]}

cap2 = {'titulo': 'Sospechoso uno: la factura de 1825', 'escenas': [
    esc('planteamiento', 'Para entender la factura hay que volver a cuando el lado rico era el otro. Siglo dieciocho. El oeste de la isla es una colonia francesa, '
        'Saint-Domingue, y es probablemente el pedazo de tierra más rentable del planeta.', visual=foto('mapa-colonial', pie='La Española en el siglo XVIII')),
    esc('relato', 'De ahí sale cerca del cuarenta por ciento del azúcar y más de la mitad del café que consume Europa. Lo producen unas quinientas mil personas esclavizadas, '
        'en un régimen tan brutal que la colonia necesita traer decenas de miles más cada año.', visual=foto('ingenio-azucar', pie='Ingenio azucarero del Caribe, grabado de época'),
        rotulo={'texto': '500.000 ESCLAVIZADOS', 'dice': 'quinientas'}),
    esc('relato', '¿Y el lado español? El patio trasero. Vacas, contrabando y poca gente. A España le importaba tan poco que en 1795 se lo cedió a Francia en un tratado.',
        visual=mapa(['DOM'], zoom=6.3, centro=ISLA, etiquetas=[SDQ])),
    esc('relato', 'En agosto de 1791, los esclavizados se levantan. Trece años después, tras derrotar al ejército de Napoleón, declaran la independencia. Primero de enero de 1804. '
        'Haití nace como el primer país salido de una revuelta de esclavizados que triunfó.', visual=foto('revolucion', pie='La Revolución haitiana (óleo de J. Suchodolski, 1845)'),
        rotulo={'texto': '1 DE ENERO DE 1804', 'dice': 'Primero'}),
    esc('relato', 'Y ahora, la factura. Julio de 1825. Frente a Puerto Príncipe aparece una escuadra francesa: catorce barcos de guerra y más de quinientos cañones. '
        'Traen una oferta del rey Carlos Décimo.', visual=foto('buques-1825', pie='Navío de guerra francés, década de 1820'), rotulo={'texto': 'JULIO DE 1825', 'dice': 'Julio'}),
    esc('relato', 'Francia reconoce a Haití, si Haití paga ciento cincuenta millones de francos. ¿Para quién? Para indemnizar a los antiguos colonos por lo que perdieron. '
        'Y en esa cuenta entraban las personas que consideraban suyas.', visual=foto('carlos-x-1825', pie='Carlos X y la ordenanza de 1825'),
        sellos=[{'texto': '150 M', 'animo': 'triste', 'dice': 'ciento'}]),
    esc('relato', 'El presidente Boyer firma. Haití no tiene ese dinero, así que pide prestada la primera cuota… a banqueros franceses. Deuda para pagar deuda. '
        'Los historiadores la llaman la doble deuda.', visual=foto('boyer', pie='Jean-Pierre Boyer, presidente de Haití'), rotulo={'texto': 'LA DOBLE DEUDA', 'dice': 'doble'}),
    esc('relato', 'La suma se rebajó después a noventa millones, y aun así pagarla tomó generaciones. Hubo préstamos nuevos para cubrir los viejos, una ocupación militar '
        'de Estados Unidos de por medio, y el último de esos préstamos se terminó de pagar en 1947.', visual=foto('marines-1915', pie='Marines de Estados Unidos en Haití, 1915'),
        rotulo={'texto': 'PAGADO EN 1947', 'dice': '1947.'}),
    esc('dato', 'Caso cerrado, ¿no? Eso pensaba yo. Hasta que volví a Maddison y busqué 1950, tres años después del último pago. Haití: unos 1.800 dólares por persona al año, '
        'en dólares de 2011 para que la inflación no engañe. República Dominicana, que nunca pagó esa factura: unos 1.600.', fuenteEnVoz=True,
        grafico={'tipo': 'comparacion', 'titulo': '1950: tres años después del último pago', 'datos': mad(['HTI', 'DOM'], 1950, 1950), 'destacar': {'pais': 'HTI'}, 'formato': FMT_USD, 'dice': '1950,'},
        cifras=[cifra('unos 1.800 dólares', 1800, M_TODO, 'valor', 'HTI', anio=1950), cifra('unos 1.600', 1600, M_TODO, 'valor', 'DOM', anio=1950)]),
    esc('giro', 'El vecino sin factura era igual de pobre. Y cargaba lo suyo: veintidós años ocupado por el propio Haití, una vuelta a ser colonia de España, pedida por su propio presidente, '
        'y las aduanas en manos de Estados Unidos durante décadas.',
        visual={'tipo': 'iconos', 'titulo': 'República Dominicana antes de 1950', 'items': [
            {'icono': '🇭🇹', 'texto': 'Ocupada por Haití', 'valor': '1822–1844', 'dice': 'veintidós'},
            {'icono': '🇪🇸', 'texto': 'Otra vez colonia', 'valor': '1861–1865', 'dice': 'colonia'},
            {'icono': '🇺🇸', 'texto': 'Aduanas intervenidas', 'valor': '1905–1940', 'dice': 'aduanas'}]}),
    esc('reenganche', 'La factura explica por qué Haití llegó pobre a 1950. No explica por qué su vecino dejó de serlo. Necesito otro sospechoso. Y el segundo se ve desde el espacio.',
        visual=foto('isla-satelite', pie='La Española desde el espacio')),
]}

cap3 = {'titulo': 'Sospechoso dos: la lluvia', 'escenas': [
    esc('planteamiento', 'Esta foto la tomó la NASA y es real. A la izquierda, Haití. A la derecha, República Dominicana. Pero te debo una aclaración: '
        'muestra un tramo de la frontera, el más fotogénico. No toda la línea se ve así.', visual=foto('frontera-satelite', pie='Frontera Haití–República Dominicana · NASA'),
        rotulo={'texto': 'UN TRAMO, NO TODA', 'dice': 'tramo'}),
    esc('dato', 'El dato completo es menos espectacular y apunta para el mismo lado. Según el Banco Mundial, a Haití le queda bosque en el 13 % de su territorio. '
        'A República Dominicana, en casi la mitad.', fuenteEnVoz=True,
        grafico={'tipo': 'comparacion', 'titulo': '¿Cuánto bosque le queda a cada uno?', 'datos': BOSQUE, 'destacar': {'pais': 'DOM'}, 'formato': {'sufijo': ' %', 'decimales': 0}},
        cifras=[cifra('el 13 %', 13, BOSQUE, 'valor', 'HTI', anio=2022), cifra('casi la mitad', 46.4, BOSQUE, 'valor', 'DOM', anio=2022)]),
    esc('relato', 'Una parte es pura geografía. Te dije misma isla. No te dije misma lluvia. Los vientos llegan cargados desde el este, chocan con la Cordillera Central, '
        'donde está el pico más alto del Caribe, y descargan del lado dominicano.',
        visual=mapa(['DOM', 'HTI'], zoom=6.3, centro=ISLA, etiquetas=[('Pico Duarte · 3.098 m', [-70.99, 19.02]), ('vientos del este →', [-67.6, 19.6])], acercar=True)),
    esc('relato', 'A Haití le llega menos agua y le tocó más cerro que valle. Y en ese terreno vive la misma cantidad de gente, en poco más de la mitad del espacio.',
        visual=foto('cerros-pelados', pie='Laderas en Haití')),
    esc('relato', 'Con poca tierra y sin electricidad, se cocina con lo que hay. Y lo que hay es carbón de leña. Cada saco es un árbol menos y, para quien lo lleva al mercado, la comida de la semana.',
        visual=foto('carbon', pie='Carbón de leña, Haití')),
    esc('dato', 'Hoy, casi la mitad de los haitianos sigue sin luz eléctrica en su casa. Al otro lado de la línea, prácticamente nadie.',
        grafico={'tipo': 'comparacion', 'titulo': 'Hogares con electricidad', 'datos': LUZ, 'destacar': {'pais': 'DOM'}, 'formato': {'sufijo': ' %', 'decimales': 0}},
        cifras=[cifra('casi la mitad de los haitianos sigue sin luz', 51.3, LUZ, 'valor', 'HTI', anio=2023)]),
    esc('giro', 'Pero la geografía tampoco cierra el caso. En los años sesenta, los dominicanos también estaban talando su bosque. En 1967, el gobierno de Joaquín Balaguer '
        'cerró los aserraderos y mandó al ejército a cuidar los árboles. Al bosque dominicano lo salvó un decreto, con soldados detrás.',
        visual=foto('pico-duarte', pie='Cordillera Central, República Dominicana'), rotulo={'texto': 'DECRETO DE 1967', 'dice': '1967,'}),
    esc('reenganche', 'O sea que la diferencia la hizo una decisión de gobierno. Y eso me lleva al sospechoso que menos me gustaba: la política. Porque en dictadores, estos dos países también empatan.'),
]}

M_HTI = mad(['HTI'], 1945, 2022)
cap4 = {'titulo': 'Sospechoso tres: 1961, se rompe el empate', 'escenas': [
    esc('planteamiento', 'Del lado dominicano, Rafael Trujillo. Treinta y un años en el poder, la capital rebautizada con su apellido y, en 1937, una matanza de miles de haitianos en la frontera.',
        visual=foto('trujillo', pie='Rafael Trujillo'), rotulo={'texto': '31 AÑOS', 'dice': 'Treinta'}),
    esc('relato', 'Del lado haitiano, François Duvalier, Papa Doc. Llega en 1957, se nombra presidente vitalicio y le hereda el cargo a su hijo de diecinueve años.',
        visual=foto('duvalier', pie='François Duvalier, «Papa Doc»')),
    esc('relato', 'La noche del 30 de mayo de 1961, a Trujillo lo emboscan en la carretera y lo matan a tiros en su auto. Lo que sigue en Dominicana es feo: un golpe, una guerra civil y, '
        'en 1965, una invasión de Estados Unidos.', visual=foto('santo-domingo-1965', pie='Santo Domingo, 1965'), rotulo={'texto': '30 DE MAYO DE 1961', 'dice': 'mayo'}),
    esc('relato', 'Y después pasa algo que no suena a gran cosa. El país se calma. Gobiernos discutibles, elecciones a veces tramposas, pero las mismas reglas del juego, década tras década.',
        visual=foto('balaguer', pie='Joaquín Balaguer')),
    esc('relato', 'Sobre esa calma se arma lo demás. Las primeras zonas francas, a fines de los sesenta. Los hoteles de Puerto Plata, en los setenta. Y en los ochenta, '
        'un aeropuerto privado en una punta de la isla donde no había casi nada: Punta Cana.',
        visual=mapa(['DOM'], zoom=6.6, centro=[-70.0, 18.9], etiquetas=[('La Romana', [-68.97, 18.43]), ('Puerto Plata', [-70.69, 19.79]), ('Punta Cana', [-68.37, 18.58]), SDQ])),
    esc('dato', 'En 2019, el último año antes de la pandemia, República Dominicana recibió siete millones y medio de visitantes. Haití, menos de un millón. Son cifras del Banco Mundial.',
        fuenteEnVoz=True, visual=foto('punta-cana', pie='Punta Cana'), disposicion='completo',
        grafico={'tipo': 'comparacion', 'titulo': 'Visitantes en 2019', 'datos': TUR, 'destacar': {'pais': 'DOM'}, 'formato': {'decimales': 0}, 'dice': 'siete'},
        cifras=[cifra('siete millones y medio', 7.55e6, TUR, 'valor', 'DOM', anio=2019), cifra('menos de un millón', 0.938e6, TUR, 'valor', 'HTI', anio=2019)]),
    esc('relato', '¿Te acuerdas de las pelotas de béisbol? Eso era Haití en los setenta: un país que se llenaba de fábricas de ensamblaje. También estaba en la carrera.',
        visual=foto('beisbol-costura', pie='', sangrado=False)),
    esc('dato', 'Se ve en la línea. Entre 1970 y 1980, el ingreso por persona de Haití sube casi un tercio. 1980 es su mejor año de toda la serie. No lo ha vuelto a tocar.',
        grafico={'tipo': 'lineas', 'titulo': 'Haití, 1960–1980: la subida', 'datos': mad(['HTI'], 1960, 1980), 'destacar': {'pais': 'HTI'},
                 'anotaciones': [{'anio': 1980, 'texto': 'Su mejor año', 'dice': 'mejor'}], 'formato': FMT_USD},
        cifras=[cifra('casi un tercio', 31.7, M_HTI, 'variacion', 'HTI', anio=1970, anioB=1980), cifra('1980 es su mejor año', 2063, M_HTI, 'maximo', 'HTI', anio=1945, anioB=2022)]),
    esc('giro', 'Después viene una racha que no le deseo a nadie. A comienzos de los ochenta, una peste porcina y la orden de sacrificio que vino detrás terminan con casi todos los cerdos del país, '
        'que eran la libreta de ahorros de cada familia campesina. En 1986 cae Duvalier hijo. En 1991, un golpe de Estado y, detrás, un embargo. '
        'En cuatro años se pierde una quinta parte del ingreso.',
        grafico={'tipo': 'lineas', 'titulo': 'Haití, 1980–1995: la racha', 'datos': mad(['HTI'], 1980, 1995), 'destacar': {'pais': 'HTI'},
                 'anotaciones': [{'anio': 1982, 'texto': 'Peste porcina', 'dice': 'peste'}, {'anio': 1986, 'texto': 'Cae Duvalier', 'dice': '1986'}, {'anio': 1991, 'texto': 'Golpe y embargo', 'dice': '1991,'}],
                 'formato': FMT_USD},
        sellos=[{'texto': '−21 %', 'pais': 'HTI', 'animo': 'triste', 'dice': 'quinta'}],
        cifras=[cifra('una quinta parte', -21.2, M_HTI, 'variacion', 'HTI', anio=1990, anioB=1994)]),
    esc('relato', 'En 1995, Haití baja de golpe el arancel al arroz importado hasta dejarlo en 3 %, presionado por sus prestamistas. Entra arroz subsidiado de Estados Unidos '
        'y el campo haitiano no puede competir. Quince años después, Bill Clinton pidió perdón por esa política. Cito: «Fue un error».',
        visual=foto('arroz-artibonite', pie='Arroz en el valle del Artibonito, Haití'), rotulo={'texto': '«FUE UN ERROR»', 'dice': 'error'}),
    esc('dato', 'Y el 12 de enero de 2010, un terremoto destruye la capital. En los datos del Banco Mundial se ve algo que yo no había visto en ninguna otra serie: '
        'la esperanza de vida de un país entero cae dieciséis años de un año al siguiente.',
        visual=foto('palacio-2010', pie='Palacio Nacional de Haití, enero de 2010'), disposicion='completo',
        grafico={'tipo': 'lineas', 'titulo': 'Esperanza de vida en Haití', 'datos': VIDA, 'destacar': {'pais': 'HTI'},
                 'anotaciones': [{'anio': 2010, 'texto': 'Terremoto', 'dice': 'dieciséis'}], 'formato': {'decimales': 0, 'sufijo': ' años'}, 'dice': 'esperanza'},
        cifras=[cifra('cae dieciséis años', -16.1, VIDA, 'diferencia', 'HTI', anio=2009, anioB=2010)]),
    esc('reenganche', 'Tres sospechosos, y ninguno lo hizo solo. Pero si pones todo en fila, aparece un patrón. Y se puede contar.'),
]}

cap5 = {'titulo': 'El veredicto: los años aburridos', 'escenas': [
    esc('planteamiento', 'Mi veredicto, y discútemelo en los comentarios porque no estoy seguro, sale de un gráfico más simple que los anteriores.'),
    esc('dato', 'Cada cuadro es un año, desde 1961. En rojo, los años en que el país terminó más pobre de lo que empezó. Son datos del Banco Mundial. '
        'República Dominicana: doce cuadros rojos de sesenta y cuatro. Haití: treinta y cinco. Más de la mitad.', fuenteEnVoz=True,
        grafico={'tipo': 'anios', 'titulo': 'Años en que el país terminó más pobre', 'datos': CREC, 'destacar': {'pais': 'HTI'}, 'dice': 'cuadro'},
        cifras=[cifra('doce cuadros rojos', 12, CREC, 'cuenta', 'DOM', anio=1961, anioB=2024), cifra('treinta y cinco', 35, CREC, 'cuenta', 'HTI', anio=1961, anioB=2024)]),
    esc('dato', 'Y mira la fila de Haití entre 1981 y 1994. Catorce rojos seguidos. Catorce años en que cada uno fue peor que el anterior.',
        grafico={'tipo': 'anios', 'titulo': 'Haití: catorce años seguidos de caída', 'datos': CREC_HTI, 'destacar': {'pais': 'HTI'}},
        sellos=[{'texto': '14', 'pais': 'HTI', 'animo': 'triste', 'dice': 'Catorce'}],
        cifras=[cifra('Catorce rojos seguidos', 14, CREC_HTI, 'cuenta', 'HTI', anio=1981, anioB=1994)]),
    esc('relato', 'Ese es mi veredicto. A estos dos países los separó una racha, más que un hecho. República Dominicana lleva sesenta años más o menos aburridos. '
        'Haití, desde 1986, no ha tenido una sola década tranquila.', visual=foto('santo-domingo-hoy', pie='Santo Domingo, hoy'), rotulo={'texto': 'AÑOS ABURRIDOS', 'dice': 'aburridos.'}),
    esc('relato', 'Y lo aburrido rinde. Nadie pone un hotel, una fábrica o una línea de metro donde no sabe quién va a mandar el año que viene. Santo Domingo tiene metro desde 2009.',
        visual=foto('zona-franca', pie='')),
    esc('dato', 'Haití, mientras tanto, exporta lo único que nadie le puede embargar: su gente. Según el Banco Mundial, lo que mandan los que se fueron equivale a uno de cada seis dólares de toda su economía.',
        fuenteEnVoz=True, visual=foto('remesas-diaspora', pie=''), disposicion='completo',
        grafico={'tipo': 'lineas', 'titulo': 'Remesas: lo que mandan los que se fueron', 'datos': REM, 'destacar': {'pais': 'HTI'}, 'formato': {'decimales': 0, 'sufijo': ' %'}, 'dice': 'Banco'},
        cifras=[cifra('uno de cada seis dólares', 16.95, REM, 'valor', 'HTI', anio=2024)]),
    esc('giro', 'Y aquí va el dato incómodo para el lado que ganó. Buena parte de esa gente cruzó la frontera. La caña dominicana, y hoy muchos de sus edificios, '
        'se levantan con manos haitianas. El país rico de la isla también se hizo con trabajo del país pobre.', visual=foto('cana-corte', pie='Corte de caña, República Dominicana')),
    esc('significado', '¿Qué me llevo yo de todo esto? Que en 1950 nadie habría apostado por República Dominicana. Era igual de pobre y le quedaban once años de Trujillo. '
        'Si tu país anda mal hoy, este gráfico dice que el pasado pesa, pero no dicta sentencia. Y si anda bien, dice exactamente lo mismo.',
        visual=foto('dajabon-mercado', pie='Dajabón, en la frontera')),
    esc('reenganche', 'Me queda un número. El que nadie mira.'),
]}

numero = {
    'texto': 'Es 1.546. Eso producía un haitiano en 2022, en los mismos dólares de antes. En 1945, el primer año con datos, producía 1.780. '
             'Setenta y siete años después, un haitiano produce menos que su bisabuelo. Toda la historia de este video cabe en esa resta.',
    'grafico': {'tipo': 'lineas', 'titulo': 'Haití, 1945–2022', 'datos': M_HTI, 'destacar': {'pais': 'HTI'},
                'anotaciones': [{'anio': 1945, 'texto': '1.780', 'dice': '1.780.'}, {'anio': 2022, 'texto': '1.546', 'dice': 'bisabuelo.'}], 'formato': FMT_USD},
    'cifras': [cifra('Es 1.546', 1546, M_HTI, 'valor', 'HTI', anio=2022), cifra('producía 1.780', 1780, M_HTI, 'valor', 'HTI', anio=1945)],
}

props = {
    'id': ID, 'cabecera': 'HAITÍ Y REPÚBLICA DOMINICANA · 1950–2024', 'gancho': gancho, 'promesa': promesa, 'promesaVisual': promesaVisual,
    'indice': ['El empate', 'La factura', 'La lluvia', '1961', 'El veredicto'], 'estructura': 'comparacion',
    'capitulos': [cap1, cap2, cap3, cap4, cap5], 'numeroQueNadieMira': numero,
    'remate': 'Dominicana lleva sesenta años aburridos. A Haití no lo han dejado aburrirse.',
    'siguiente': 'Puerto Rico es más rico que cualquier país de América Latina y aun así se declaró en quiebra. ¿Cómo quiebra el más rico? Eso, en el próximo video.',
    'miniatura': {'texto': '¿QUÉ PASÓ?'},
    'fuentes': [
        {'texto': 'Our World in Data: PIB per cápita (Maddison Project Database 2023, Bolt y van Zanden), CC BY 4.0', 'url': 'https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database'},
        {'texto': 'Banco Mundial, World Development Indicators (PIB per cápita PPA, crecimiento del PIB per cápita, bosque, electricidad, turismo, esperanza de vida, remesas, población), CC BY 4.0', 'url': 'https://data.worldbank.org'},
        {'texto': 'The New York Times, «The Ransom» (2022): la deuda de la independencia de Haití', 'url': 'https://www.nytimes.com/2022/05/20/world/americas/haiti-history-colonized-france.html'},
        {'texto': 'NASA Scientific Visualization Studio: frontera Haití–República Dominicana', 'url': 'https://svs.gsfc.nasa.gov/2640'},
        {'texto': 'Jared Diamond, «Colapso» (2005), cap. 11: una isla, dos pueblos, dos historias', 'url': 'https://es.wikipedia.org/wiki/Colapso_(libro)'},
    ],
}

desc = ('En 1954, Haití todavía era un poco más rico que República Dominicana. Hoy, un dominicano produce casi nueve veces más. Misma isla. ¿Qué pasó?\n\n'
        'Tres sospechosos: la factura que Francia le cobró a Haití en 1825, la lluvia que no cruza la Cordillera Central y lo que cada país hizo después de 1961. '
        'Con los datos del Proyecto Maddison y del Banco Mundial en pantalla, y un gráfico que cuenta los años en que cada país terminó más pobre: 12 de 64 en República Dominicana, 35 de 64 en Haití.\n\n'
        'Fuentes:\n- Maddison Project Database 2023 vía Our World in Data (CC BY 4.0) https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database\n'
        '- Banco Mundial, WDI: NY.GDP.PCAP.PP.KD, NY.GDP.PCAP.KD.ZG, AG.LND.FRST.ZS, EG.ELC.ACCS.ZS, ST.INT.ARVL, SP.DYN.LE00.IN, BX.TRF.PWKR.DT.GD.ZS, SP.POP.TOTL (CC BY 4.0) https://data.worldbank.org\n'
        '- The New York Times, «The Ransom» (2022); J. Diamond, «Colapso» (2005), cap. 11; NASA SVS.\n\n'
        'Voz sintetizada. Guion, gráficos y montaje propios a partir de datos abiertos; fotos de Wikimedia Commons con su crédito abajo.\n'
        'No es asesoría financiera: el video describe lo que muestran los datos.')

print(json.dumps({'plantilla': 'tesis', 'id': ID, 'titulo': 'Haití era más rico que República Dominicana. ¿Qué pasó?', 'descripcion': desc,
                  'hashtags': ['#haiti', '#republicadominicana', '#economia', '#historia', '#datos'], 'props': props}, ensure_ascii=False, indent=1))
