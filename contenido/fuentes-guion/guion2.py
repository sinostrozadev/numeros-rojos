#!/usr/bin/env python3
"""v2 del guion Haití–RD (tras el detector de IA y el revisor). Reusa los ayudantes de guion.py.
   python3 guion2.py > .../contenido/guiones/2026-11-26-tesis-haiti-republica-dominicana.json"""
import json, os
AQUI = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(AQUI, 'guion.py')).read()
exec(src[:src.index('gancho = {')].replace('__file__', repr(os.path.join(AQUI, 'guion.py'))))

M_TODO = mad(['HTI', 'DOM'], 1950, 2022)
M_HTI = mad(['HTI'], 1945, 2022)

gancho = {
    'texto': 'Hasta fines de los ochenta, las pelotas de las Grandes Ligas se cosían a mano en Haití. Ciento ocho puntadas cada una. '
             'Al otro lado de la misma isla, en República Dominicana, crecían los que iban a batearlas. '
             'Hoy, un dominicano produce unas once veces lo que un haitiano. Pero en 1954, el que iba adelante era Haití.',
    'rotulo': 'HAITÍ IBA ADELANTE',
    'visuales': [
        foto('beisbol-costura', pie=''),
        mapa(['HTI'], zoom=6.3, centro=ISLA, etiquetas=[PAP], dice='Haití.'),
        mapa(['HTI', 'DOM'], zoom=6.3, centro=ISLA, etiquetas=[PAP, SDQ], dice='isla,'),
        foto('santo-domingo-hoy', pie='Santo Domingo', dice='Hoy,'),
        foto('puerto-principe-hoy', pie='Puerto Príncipe', dice='haitiano.'),
    ],
    'cifras': [
        cifra('unas once veces', 11.4, M_TODO, 'razon', 'DOM', 'HTI', 2022),
        cifra('en 1954, el que iba adelante era Haití', 1.03, M_TODO, 'razon', 'HTI', 'DOM', 1954),
    ],
}

promesa = ('Todos tienen su teoría: la deuda con Francia, los dictadores, el terremoto. Yo tenía la mía, pero choca con 1954. '
           'Ese año los dos países eran igual de pobres, y cualquier teoría tiene que pasar por ahí. Así que voy a buscar el año en que se separan.')
promesaVisual = foto('frontera-satelite', pie='La frontera desde el espacio · NASA, 2002')

cap1 = {'titulo': '1954: dos países empatados', 'escenas': [
    esc('planteamiento', 'Primero, el tamaño. La isla se llama La Española y cabe dos veces dentro de Uruguay. Haití ocupa algo más de un tercio. '
        'República Dominicana, el resto. A cada lado viven hoy unos once millones y medio de personas.',
        visual=mapa(['HTI', 'DOM'], zoom=6.3, centro=ISLA, etiquetas=[PAP, SDQ], acercar=True),
        sellos=[{'texto': '11,5 M', 'pais': 'HTI', 'dice': 'once'}],
        cifras=[cifra('unos once millones y medio', 11.77e6, POB, 'valor', 'HTI', anio=2024), cifra('A cada lado', 11.43e6, POB, 'valor', 'DOM', anio=2024)]),
    esc('dato', 'El Proyecto Maddison, de la Universidad de Groningen, reconstruye cuánto producía por persona cada país, año por año. '
        'La línea dorada es Haití. Fíjate dónde parten las dos: pegadas. En 1954, Haití todavía va adelante.',
        fuenteEnVoz=True,
        grafico={'tipo': 'lineas', 'titulo': 'La partida: 1950 a 1960', 'datos': mad(['HTI', 'DOM'], 1950, 1960), 'destacar': {'pais': 'HTI'},
                 'anotaciones': [{'anio': 1954, 'texto': 'Haití, adelante', 'dice': '1954,'}], 'formato': FMT_USD, 'dice': 'Maddison,'},
        cifras=[cifra('En 1954, Haití todavía va adelante', 1.03, M_TODO, 'razon', 'HTI', 'DOM', 1954)]),
    esc('dato', 'Y esto es lo que viene después. Una línea despega. La otra se queda en el suelo, hasta donde termina la serie.',
        grafico={'tipo': 'lineas', 'titulo': 'Haití y República Dominicana, 1950–2022', 'datos': M_TODO, 'destacar': {'pais': 'HTI'}, 'formato': FMT_USD},
        sellos=[{'texto': '11×', 'pais': 'DOM', 'animo': 'feliz', 'dice': 'serie.'}]),
    esc('giro', 'Yo pensaba que Haití perdía desde el primer año. No: en 1950 producía cerca de un 9 % más que su vecino. Empezaron parejos. Ojo: tan atrás, estas series son estimaciones, y el año exacto es discutible. Que iban parejos, no.'
        '',
        visual=mapa(['HTI', 'DOM'], zoom=6.3, centro=ISLA, etiquetas=[PAP, SDQ]), sellos=[{'texto': '+9 %', 'pais': 'HTI', 'animo': 'feliz', 'dice': '9'}],
        rotulo={'texto': 'EMPATE', 'dice': 'parejos.'},
        cifras=[cifra('cerca de un 9 % más', 1.09, M_TODO, 'razon', 'HTI', 'DOM', 1950)]),
    esc('relato', '¿Y qué pasó después? Hay tres explicaciones dando vueltas. Voy primero con la más famosa.',
        visual={'tipo': 'iconos', 'titulo': 'Tres explicaciones', 'items': [
            {'icono': '📜', 'texto': 'La factura de 1825'}, {'icono': '🌧️', 'texto': 'La lluvia'}, {'icono': '🏛️', 'texto': 'La política'}]}),
]}

cap2 = {'titulo': 'La factura de 1825', 'escenas': [
    esc('planteamiento', 'La más famosa es una factura, y para entenderla hay que ir al siglo dieciocho, cuando el lado rico era el otro. El oeste de la isla es una colonia francesa, '
        'Saint-Domingue. El este, español, es ganado y contrabando.', visual=foto('mapa-colonial', pie='La Española en el siglo XVIII'),
        rotulo={'texto': 'SAINT-DOMINGUE', 'dice': 'Saint-Domingue.'}),
    esc('relato', 'De Saint-Domingue sale cerca del cuarenta por ciento del azúcar y más de la mitad del café que consume Europa. Lo producen unas quinientas mil personas esclavizadas.',
        visual=foto('ingenio-azucar', pie='Ingenio azucarero del Caribe, grabado de época'), rotulo={'texto': '500.000 ESCLAVIZADOS', 'dice': 'quinientas'}),
    esc('relato', 'En 1791 se levantan. Le ganan al ejército de Napoleón, cosa que en esos años no hacía casi nadie, y el primero de enero de 1804 declaran la independencia.',
        visual=foto('revolucion', pie='La Revolución haitiana (óleo de J. Suchodolski, 1845)'), rotulo={'texto': '1 DE ENERO DE 1804', 'dice': 'primero'}, sellos=[{'texto': '1791', 'pais': 'HTI', 'dice': '1791'}]),
    esc('relato', 'Julio de 1825. Frente a Puerto Príncipe aparecen catorce barcos de guerra franceses, con más de quinientos cañones. Traen una oferta del rey: '
        'Francia reconoce a Haití si Haití paga ciento cincuenta millones de francos.', visual=foto('buques-1825', pie='Navío de guerra francés, década de 1820'),
        rotulo={'texto': 'JULIO DE 1825', 'dice': 'Puerto'}, sellos=[{'texto': '150 M', 'animo': 'triste', 'dice': 'ciento'}]),
    esc('relato', 'El dinero era para indemnizar a los antiguos colonos por lo que habían perdido. Y en lo que habían perdido contaban a las personas. '
        'Me cuesta leerlo sin enojarme: les cobraron por ellos mismos.', visual=foto('carlos-x-1825', pie='Carlos X de Francia'), rotulo={'texto': 'LES COBRARON POR ELLOS', 'dice': 'cobraron'}),
    esc('relato', 'Haití no tenía esa plata. Pidió prestada la primera cuota a banqueros franceses, o sea, deuda para pagar deuda. La suma se rebajó después, '
        'pero entre una cosa y otra, el último préstamo de esa cadena se terminó de pagar en 1947.', visual=foto('boyer', pie='Jean-Pierre Boyer, presidente de Haití'),
        rotulo={'texto': 'DEUDA PARA PAGAR DEUDA', 'dice': 'deuda'}, sellos=[{'texto': '1947', 'pais': 'HTI', 'animo': 'triste', 'dice': '1947.'}]),
    esc('dato', 'Con eso parecería resuelto. Pero mira 1950, tres años después de ese último pago. Maddison pone a Haití en unos 1.800 dólares por persona al año, '
        'en dólares de 2011, ajustados por lo que cuestan las cosas en cada país. Y a República Dominicana, en unos 1.600.', fuenteEnVoz=True,
        grafico={'tipo': 'comparacion', 'titulo': '1950: tres años después del último pago', 'datos': mad(['HTI', 'DOM'], 1950, 1950), 'destacar': {'pais': 'HTI'}, 'formato': FMT_USD, 'dice': '1950,'},
        cifras=[cifra('unos 1.800 dólares', 1800, M_TODO, 'valor', 'HTI', anio=1950), cifra('unos 1.600', 1600, M_TODO, 'valor', 'DOM', anio=1950)]),
    esc('giro', 'El vecino no pagó ninguna factura y era igual de pobre. Tenía lo suyo: veintidós años ocupado por el propio Haití, una vuelta a ser colonia de España '
        'pedida por su propio presidente, y las aduanas en manos de Estados Unidos por décadas.',
        visual={'tipo': 'iconos', 'titulo': 'República Dominicana antes de 1950', 'items': [
            {'icono': '🇭🇹', 'texto': 'Ocupada por Haití', 'valor': '1822–1844', 'dice': 'veintidós'},
            {'icono': '🇪🇸', 'texto': 'Otra vez colonia', 'valor': '1861–1865', 'dice': 'colonia'},
            {'icono': '🇺🇸', 'texto': 'Aduanas intervenidas', 'valor': '1905–1940', 'dice': 'aduanas'}]}),
    esc('reenganche', 'A mí la deuda de 1825 me parece una de las grandes injusticias de la historia. Y aun así no me alcanza para explicar lo que pasa después de 1954.',
        visual=foto('isla-satelite', pie='La Española desde el espacio'), sellos=[{'texto': '1825→1947', 'pais': 'HTI', 'animo': 'triste', 'dice': 'injusticias'}]),
]}

cap3 = {'titulo': 'La lluvia que no cruza la montaña', 'escenas': [
    esc('planteamiento', 'La segunda explicación es la geografía, y tiene una foto famosa. La tomó la NASA. A la izquierda, Haití; a la derecha, República Dominicana. '
        'Ojo: es un tramo de la frontera, el más vistoso. No toda la línea se ve así.', visual=foto('frontera-satelite', pie='Frontera Haití–República Dominicana · NASA'),
        rotulo={'texto': 'UN TRAMO, NO TODA', 'dice': 'tramo'}),
    esc('dato', 'El dato completo es menos espectacular y apunta para el mismo lado. Según el Banco Mundial, a Haití le queda bosque en el 13 % de su territorio. '
        'A República Dominicana, en casi la mitad.', fuenteEnVoz=True,
        grafico={'tipo': 'comparacion', 'titulo': '¿Cuánto bosque le queda a cada uno?', 'datos': BOSQUE, 'destacar': {'pais': 'DOM'}, 'formato': {'sufijo': ' %', 'decimales': 0}},
        cifras=[cifra('el 13 %', 13, BOSQUE, 'valor', 'HTI', anio=2022), cifra('casi la mitad', 46.4, BOSQUE, 'valor', 'DOM', anio=2022)]),
    esc('relato', 'Una parte es geografía pura. Es la misma isla, pero no la misma lluvia: los vientos llegan cargados desde el este, chocan con la Cordillera Central, '
        'donde está el pico más alto del Caribe, y sueltan el agua del lado dominicano.',
        visual=mapa(['HTI', 'DOM'], zoom=6.3, centro=ISLA, etiquetas=[('Pico Duarte · 3.098 m', [-70.99, 19.02]), ('vientos del este →', [-67.6, 19.6])], acercar=True)),
    esc('relato', 'A Haití le llega menos agua y le tocó más cerro que valle. En ese terreno vive la misma cantidad de gente, en poco más de la mitad del espacio.',
        visual=foto('cerros-pelados', pie='Laderas en Haití')),
    esc('relato', 'Con poca tierra y sin electricidad, se cocina con carbón de leña. Cada saco es un árbol menos.', visual=foto('carbon', pie='Carbón de leña, Haití')),
    esc('dato', 'Y lo de sin electricidad es literal: casi la mitad de los haitianos no tiene luz en su casa. Al otro lado de la frontera, casi todos tienen.',
        grafico={'tipo': 'comparacion', 'titulo': 'Hogares con electricidad', 'datos': LUZ, 'destacar': {'pais': 'DOM'}, 'formato': {'sufijo': ' %', 'decimales': 0}},
        cifras=[cifra('casi la mitad de los haitianos no tiene luz', 51.3, LUZ, 'valor', 'HTI', anio=2023), cifra('casi todos tienen', 99.6, LUZ, 'valor', 'DOM', anio=2023)]),
    esc('giro', 'Pero en los sesenta los dominicanos también estaban talando su bosque. En 1967, el gobierno de Joaquín Balaguer cerró los aserraderos '
        'y puso al ejército a cuidar los árboles. Fue la medida de un gobierno autoritario, y ese bosque hoy sigue en pie. No sé muy bien qué hacer con eso.',
        visual=foto('pico-duarte', pie='Cordillera Central, República Dominicana'), rotulo={'texto': 'DECRETO DE 1967', 'dice': '1967,'}, sellos=[{'texto': 'SIGUE AHÍ', 'pais': 'DOM', 'dice': 'pie.'}]),
    esc('reenganche', 'O sea que en el bosque dominicano pesaron la lluvia y también una decisión de gobierno. Me queda la explicación que menos me gusta, porque es la más difícil de medir: la política.',
        visual={'tipo': 'iconos', 'titulo': 'Tres explicaciones', 'items': [{'icono': '📜', 'texto': 'La factura de 1825', 'marca': 'no'}, {'icono': '🌧️', 'texto': 'La lluvia', 'marca': 'no'}, {'icono': '🏛️', 'texto': 'La política', 'dice': 'política.'}]}),
]}

cap4 = {'titulo': '1961: se rompe el empate', 'escenas': [
    esc('planteamiento', 'En dictadores, estos dos países también empatan. Del lado dominicano, Rafael Trujillo: treinta y un años en el poder, la capital rebautizada con su apellido '
        'y, en 1937, una matanza de miles de haitianos en la frontera.', visual=foto('trujillo', pie='Rafael Trujillo'), rotulo={'texto': '31 AÑOS', 'dice': 'treinta'}),
    esc('relato', 'Del lado haitiano, François Duvalier, Papa Doc. Llega en 1957, se nombra presidente vitalicio y le hereda el cargo a su hijo de diecinueve años.',
        visual=mapa(['HTI'], zoom=6.6, centro=[-72.6, 18.9], etiquetas=[PAP]), rotulo={'texto': 'PAPA DOC · 1957', 'dice': '1957,'}),
    esc('relato', 'La noche del 30 de mayo de 1961, a Trujillo lo emboscan en la carretera y lo matan a tiros en su auto. Lo que sigue es feo: un golpe, una guerra civil y, '
        'en 1965, una intervención militar de Estados Unidos.', visual=foto('santo-domingo-1965', pie='Santo Domingo, 1965'), rotulo={'texto': '30 DE MAYO DE 1961', 'dice': 'mayo'}, sellos=[{'texto': '1965', 'pais': 'DOM', 'animo': 'triste', 'dice': '1965,'}]),
    esc('relato', 'Después no llega la paz: los primeros años de Balaguer tienen presos y muertos políticos. Pero las reglas del juego se mantienen, década tras década. Sobre eso aparecen las zonas francas a fines de los sesenta, '
        'los hoteles de Puerto Plata en los setenta y, en los ochenta, un aeropuerto privado en una punta de la isla donde no había casi nada. Punta Cana.',
        visual=mapa(['DOM'], zoom=6.6, centro=[-70.0, 18.9], etiquetas=[('La Romana', [-68.97, 18.43]), ('Puerto Plata', [-70.69, 19.79]), ('Punta Cana', [-68.37, 18.58]), SDQ]),
        rotulo={'texto': 'PUNTA CANA', 'dice': 'Punta'}),
    esc('dato', 'En 2019, el último año antes de la pandemia, República Dominicana recibió siete millones y medio de visitantes. Haití, menos de un millón. Son cifras del Banco Mundial.',
        fuenteEnVoz=True, visual=foto('punta-cana', pie='Punta Cana'), disposicion='completo',
        grafico={'tipo': 'comparacion', 'titulo': 'Visitantes en 2019', 'datos': TUR, 'destacar': {'pais': 'DOM'}, 'formato': {'decimales': 0}, 'dice': 'siete'},
        cifras=[cifra('siete millones y medio', 7.55e6, TUR, 'valor', 'DOM', anio=2019), cifra('menos de un millón', 0.938e6, TUR, 'valor', 'HTI', anio=2019)]),
    esc('relato', 'Haití también estaba en esa carrera. Las pelotas de béisbol del principio son de esa época: en los setenta, el país se llenó de fábricas de ensamblaje.',
        visual=foto('beisbol-costura', pie='', sangrado=False)),
    esc('dato', 'Se ve en la línea. Entre 1970 y 1980, lo que produce cada haitiano sube casi un tercio. 1980 es su mejor año de toda la serie. No lo ha vuelto a tocar.',
        grafico={'tipo': 'lineas', 'titulo': 'Haití, 1960–1980: la subida', 'datos': mad(['HTI'], 1960, 1980), 'destacar': {'pais': 'HTI'},
                 'anotaciones': [{'anio': 1980, 'texto': 'Su mejor año', 'dice': 'mejor'}], 'formato': FMT_USD},
        cifras=[cifra('casi un tercio', 31.7, M_HTI, 'variacion', 'HTI', anio=1970, anioB=1980), cifra('1980 es su mejor año', 2063, M_HTI, 'maximo', 'HTI', anio=1945, anioB=2022)]),
    esc('giro', 'Después viene lo peor. A comienzos de los ochenta, una peste porcina y la orden de sacrificio que vino detrás acaban con casi todos los cerdos del país. '
        'El cerdo era la libreta de ahorros de la familia campesina. En 1986 cae Duvalier hijo. En 1991 hay un golpe de Estado y, detrás, un embargo. '
        'En cuatro años se pierde una quinta parte de lo que producía cada haitiano.',
        grafico={'tipo': 'lineas', 'titulo': 'Haití, 1980–1995', 'datos': mad(['HTI'], 1980, 1995), 'destacar': {'pais': 'HTI'},
                 'anotaciones': [{'anio': 1982, 'texto': 'Peste porcina', 'dice': 'peste'}, {'anio': 1986, 'texto': 'Cae Duvalier', 'dice': '1986'}, {'anio': 1991, 'texto': 'Golpe y embargo', 'dice': '1991'}],
                 'formato': FMT_USD},
        sellos=[{'texto': '−21 %', 'pais': 'HTI', 'animo': 'triste', 'dice': 'quinta'}],
        cifras=[cifra('una quinta parte', -21.2, M_HTI, 'variacion', 'HTI', anio=1990, anioB=1994)]),
    esc('relato', 'A mediados de los noventa, presionado por sus prestamistas, Haití baja el arancel al arroz importado hasta dejarlo en 3 %. Entra arroz subsidiado de Estados Unidos '
        'y el campo haitiano no puede competir. Quince años después, Bill Clinton dijo que esa política «fue un error». Que lo dijera él mismo, que había empujado la medida, tiene su mérito.'
        '',
        visual=foto('arroz-artibonite', pie='Arroz en Haití'), rotulo={'texto': '«FUE UN ERROR»', 'dice': 'error».'}, sellos=[{'texto': '3 %', 'pais': 'HTI', 'animo': 'triste', 'dice': '3'}]),
    esc('dato', 'El 12 de enero de 2010, un terremoto destruye la capital. En los datos del Banco Mundial queda una marca que cuesta mirar: '
        'la esperanza de vida del país cae dieciséis años de un año al siguiente. Al otro año vuelve a subir.',
        visual=foto('palacio-2010', pie='Palacio Nacional de Haití, enero de 2010'), disposicion='completo',
        grafico={'tipo': 'lineas', 'titulo': 'Esperanza de vida en Haití', 'datos': VIDA, 'destacar': {'pais': 'HTI'},
                 'anotaciones': [{'anio': 2010, 'texto': 'Terremoto', 'dice': 'dieciséis'}], 'formato': {'decimales': 0, 'sufijo': ' años'}, 'dice': 'esperanza'},
        cifras=[cifra('cae dieciséis años', -16.1, VIDA, 'diferencia', 'HTI', anio=2009, anioB=2010), cifra('Al otro año vuelve a subir', 16.0, VIDA, 'diferencia', 'HTI', anio=2010, anioB=2011)]),
    esc('reenganche', 'Ninguna de las tres alcanza sola. Así que probé otra cosa: contar los años.'),
]}

cap5 = {'titulo': 'Los años aburridos', 'escenas': [
    esc('planteamiento', 'Es un gráfico más simple que los anteriores. No estoy seguro de que sea la respuesta; dime en los comentarios si te convence.'),
    esc('dato', 'Cada cuadro es un año, desde 1961. En rojo, los años en que cada persona produjo menos que el año anterior. Son datos del Banco Mundial. '
        'República Dominicana: doce cuadros rojos de sesenta y cuatro. Haití: treinta y cinco. Más de la mitad.', fuenteEnVoz=True,
        grafico={'tipo': 'anios', 'titulo': 'Años en que el país terminó más pobre', 'datos': CREC, 'destacar': {'pais': 'HTI'}, 'dice': 'cuadro'},
        cifras=[cifra('doce cuadros rojos', 12, CREC, 'cuenta', 'DOM', anio=1961, anioB=2024), cifra('treinta y cinco', 35, CREC, 'cuenta', 'HTI', anio=1961, anioB=2024)]),
    esc('dato', 'Mira la fila de Haití entre 1981 y 1994. Catorce rojos seguidos. Catorce años en que cada año fue más pobre que el anterior.',
        grafico={'tipo': 'anios', 'titulo': 'Haití: catorce años seguidos de caída', 'datos': CREC_HTI, 'destacar': {'pais': 'HTI'}},
        sellos=[{'texto': '14', 'pais': 'HTI', 'animo': 'triste', 'dice': 'Catorce'}],
        cifras=[cifra('Catorce rojos seguidos', 14, CREC_HTI, 'cuenta', 'HTI', anio=1981, anioB=1994)]),
    esc('relato', 'Mi veredicto va por ahí. Lo que separó a estos dos países fue una racha larga, más que un hecho puntual. República Dominicana lleva sesenta años más o menos aburridos. '
        'Haití, desde 1986, no ha tenido una sola década tranquila.', visual=foto('santo-domingo-hoy', pie='Santo Domingo, hoy'), rotulo={'texto': 'AÑOS ABURRIDOS', 'dice': 'aburridos.'}),
    esc('relato', 'Cuesta poner un hotel, una fábrica o una línea de metro donde no se sabe quién va a mandar el año que viene. Santo Domingo tiene metro desde 2009. Lo aburrido, mal que mal, rinde.',
        visual=foto('zona-franca', pie=''), sellos=[{'texto': 'METRO 2009', 'pais': 'DOM', 'animo': 'feliz', 'dice': '2009.'}]),
    esc('dato', 'A Haití, lo que sí le llega son remesas. Según el Banco Mundial, lo que mandan los que se fueron equivale a uno de cada seis dólares de su economía.',
        fuenteEnVoz=True,
        grafico={'tipo': 'lineas', 'titulo': 'Remesas: lo que mandan los que se fueron', 'datos': REM, 'destacar': {'pais': 'HTI'}, 'formato': {'decimales': 0, 'sufijo': ' %'}},
        cifras=[cifra('uno de cada seis dólares', 16.95, REM, 'valor', 'HTI', anio=2024)]),
    esc('giro', 'Un matiz para el lado dominicano. Muchos de los que se fueron cruzaron la frontera, y hoy cortan la caña dominicana y levantan sus edificios. '
        'Parte de la riqueza de un lado de la isla la trabajó gente del otro.', visual=foto('cana-corte', pie='Corte de caña, República Dominicana'), rotulo={'texto': 'MANOS HAITIANAS', 'dice': 'caña'}),
    esc('significado', 'Lo que me llevo: en 1950 pocos habrían apostado por República Dominicana. Era igual de pobre y le quedaban once años de Trujillo. '
        'Lo que vino después fue, sobre todo, estabilidad. No tengo claro cuánto de eso fue mérito de sus gobiernos y cuánto fue suerte.',
        visual=foto('isla-satelite', pie='La Española desde el espacio'), rotulo={'texto': 'ESTABILIDAD', 'dice': 'estabilidad.'}, sellos=[{'texto': '11 AÑOS', 'pais': 'DOM', 'animo': 'triste', 'dice': 'once'}]),
    esc('reenganche', 'Queda un número.'),
]}

numero = {
    'texto': 'Es 1.546. Eso producía un haitiano en 2022, en los mismos dólares de antes. En 1945, el primer año con datos, producía 1.780. '
             'Setenta y siete años después, un haitiano produce menos que su bisabuelo.',
    'grafico': {'tipo': 'lineas', 'titulo': 'Haití, 1945–2022', 'datos': M_HTI, 'destacar': {'pais': 'HTI'},
                'anotaciones': [{'anio': 1945, 'texto': '1.780', 'dice': '1.780.'}, {'anio': 2022, 'texto': '1.546', 'dice': 'bisabuelo.'}], 'formato': FMT_USD},
    'cifras': [cifra('Es 1.546', 1546, M_HTI, 'valor', 'HTI', anio=2022), cifra('producía 1.780', 1780, M_HTI, 'valor', 'HTI', anio=1945)],
}

ns = {}
exec(src[src.index('props = {'):].replace('34 de 64', '35 de 64').replace('casi nueve veces más', 'unas once veces más'), dict(globals()), ns) if False else None
props = {
    'id': ID, 'cabecera': 'HAITÍ Y REPÚBLICA DOMINICANA · 1950–2024', 'gancho': gancho, 'promesa': promesa, 'promesaVisual': promesaVisual,
    'indice': ['El empate', 'La factura', 'La lluvia', '1961', 'Los años aburridos'], 'estructura': 'comparacion',
    'capitulos': [cap1, cap2, cap3, cap4, cap5], 'numeroQueNadieMira': numero,
    'remate': 'República Dominicana tuvo 12 años malos de 64. Haití tuvo 35.',
    'siguiente': 'Puerto Rico produce por persona más que cualquier país de América Latina y aun así, en 2017, terminó en un tribunal de quiebras. ¿Cómo?',
    'miniatura': {'texto': '¿QUÉ PASÓ?'},
    'fuentes': [
        {'texto': 'Our World in Data: PIB per cápita (Maddison Project Database 2023, Bolt y van Zanden), CC BY 4.0', 'url': 'https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database'},
        {'texto': 'Banco Mundial, World Development Indicators (crecimiento del PIB per cápita, bosque, electricidad, turismo, esperanza de vida, remesas, población), CC BY 4.0', 'url': 'https://data.worldbank.org'},
        {'texto': 'The New York Times, «The Ransom» (2022): la deuda de la independencia de Haití', 'url': 'https://www.nytimes.com/2022/05/20/world/americas/haiti-history-colonized-france.html'},
        {'texto': 'NASA Scientific Visualization Studio: Haitian Deforestation (2002)', 'url': 'https://svs.gsfc.nasa.gov/2640'},
        {'texto': 'Jared Diamond, «Colapso» (2005), cap. 11: una isla, dos pueblos, dos historias', 'url': 'https://es.wikipedia.org/wiki/Colapso_(libro)'},
    ],
}
desc = ('En 1954, Haití todavía era un poco más rico que República Dominicana. Hoy, un dominicano produce unas once veces más. Misma isla. ¿Qué pasó?\n\n'
        'Tres explicaciones puestas a prueba: la factura que Francia le cobró a Haití en 1825, la lluvia que no cruza la Cordillera Central y lo que cada país hizo después de 1961. '
        'Con los datos del Proyecto Maddison y del Banco Mundial en pantalla, y un gráfico que cuenta los años en que cada país terminó más pobre: 12 de 64 en República Dominicana, 35 de 64 en Haití.\n\n'
        'Fuentes:\n- Maddison Project Database 2023 vía Our World in Data (CC BY 4.0) https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database\n'
        '- Banco Mundial, WDI: NY.GDP.PCAP.KD.ZG, AG.LND.FRST.ZS, EG.ELC.ACCS.ZS, ST.INT.ARVL, SP.DYN.LE00.IN, BX.TRF.PWKR.DT.GD.ZS, SP.POP.TOTL (CC BY 4.0) https://data.worldbank.org\n'
        '- The New York Times, «The Ransom» (2022); J. Diamond, «Colapso» (2005), cap. 11; NASA SVS 2640.\n\n'
        'Voz sintetizada. Guion, gráficos y montaje propios a partir de datos abiertos; fotos de Wikimedia Commons con su crédito abajo.\n'
        'No es asesoría financiera: el video describe lo que muestran los datos.')
print(json.dumps({'plantilla': 'tesis', 'id': ID, 'titulo': 'Haití era más rico que República Dominicana. ¿Qué pasó?', 'descripcion': desc,
                  'hashtags': ['#haiti', '#republicadominicana', '#economia', '#historia', '#datos'], 'props': props}, ensure_ascii=False, indent=1))
