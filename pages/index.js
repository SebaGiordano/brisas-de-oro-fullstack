'use client'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    /* ===== TRADUCCIONES ===== */
    const i18n = {
      es: {
        'sticky.btn':'Buscar',
        'topbar.dir':'Av. Ramón J. Cárcano 2590 · Villa Carlos Paz, Córdoba',
        'topbar.mail':'Escribinos','nav.nosotros':'Quiénes somos','nav.alojamientos':'Alojamientos','nav.servicios':'Servicios',
        'nav.testimonios':'Reseñas','nav.ubicacion':'Ubicación','nav.info':'Info importante','nav.clima':'Clima','nav.info':'Info importante','nav.clima':'Clima','nav.cta':'Consultar →',
        'hero.eyebrow':'Bienvenidos a Hotel y Cabañas Brisas de Oro',
        'hero.title':'Viví <em>momentos inolvidables</em>',
        'hero.desc':'Complejo familiar atendido por sus dueños, donde el trato personalizado y el clima hogareño hacen que cada huésped se sienta en casa. Rodeados de las sierras cordobesas y a orillas del río San Antonio, en Villa Carlos Paz.',
        'hero.b1':'Ambiente familiar','hero.b2':'Desayuno buffet','hero.b3':'Pileta','hero.b4':'Pet friendly',
        'widget.title':'Consultar disponibilidad','widget.sub':'Completá los datos y te respondemos por WhatsApp',
        'widget.llegada':'Llegada','widget.salida':'Salida','widget.huespedes':'Huéspedes','widget.tipo':'Tipo',
        'widget.cualquiera':'Cualquiera','widget.cabana':'Cabaña','widget.habitacion':'Habitación','widget.apart':'Apart Hotel',
        'widget.btn':'Consultar por WhatsApp','widget.note':'Sin pagos online · Confirmación directa vía WhatsApp',
        'nosotros.label':'Quiénes somos','nosotros.title':'Un lugar donde cada huésped es parte de la familia',
        'nosotros.badge1':'Atendido por sus dueños','nosotros.badge2':'María Celia, anfitriona',
        'nosotros.p1':'Somos un complejo familiar ubicado en Villa Carlos Paz, atendido directamente por sus dueños. Desde el primer contacto hasta el momento de la despedida, nos ocupamos personalmente de que tu estadía sea cómoda, tranquila y especial.',
        'nosotros.p2':'Cada detalle importa: el desayuno casero preparado con amor, el saludo al llegar, la charla de tarde. Son esas pequeñas cosas las que hacen que nuestros huéspedes se vayan con una sonrisa y quieran volver.',
        'nosotros.quote':'"Más que una estadía, un recuerdo que se lleva en el corazón."',
        'nosotros.c1':'Atención personalizada','nosotros.c2':'Ubicación estratégica','nosotros.c3':'Flexibilidad y comodidad','nosotros.c4':'16 unidades','nosotros.c5':'Atendido por la familia','nosotros.c6':'El Algarrobo','nosotros.p3':'En el corazón del complejo se encuentra El Algarrobo — nuestro espacio compartido bajo la sombra de un algarrobo bicentenario. Parrilleros, mesas y el sonido de la naturaleza, para que cada reunión sea un momento especial.',
        'galeria.vermas':'Ver más<br>fotos','galeria.cta':'Consultanos →',
        'aloj.label':'Nuestros alojamientos','aloj.title':'Encontrá tu espacio ideal','aloj.consultar':'Consultar',
        'aloj.tipo1':'Cabaña chica','aloj.tipo2':'Cabaña mediana','aloj.tipo3':'Cabaña grande','aloj.tipo4':'Hotel','aloj.tipo5':'Apart Hotel',
        'aloj.card1.name':'Cabaña chica','aloj.card1.meta':'👥 Hasta 3 personas · 🛏 1 dormitorio','aloj.card1.meta1':'👥 Hasta 3 personas','aloj.card1.meta2':'🛏 1 dormitorio',
        'aloj.card2.name':'Cabaña mediana','aloj.card2.meta':'👥 Hasta 5/6 personas · 🛏 1 dormitorio','aloj.card2.meta1':'👥 Hasta 5/6 personas','aloj.card2.meta2':'🛏 1 dormitorio',
        'aloj.card3.name':'Cabaña grande','aloj.card3.meta':'👥 Hasta 7/8 personas · 🛏 2 dormitorios','aloj.card3.meta1':'👥 Hasta 7/8 personas','aloj.card3.meta2':'🛏 2 dormitorios',
        'aloj.card4.name':'Habitaciones de hotel','aloj.card4.meta':'👥 1–4 personas · 🍳 Desayuno incluido','aloj.card4.meta1':'👥 1–4 personas','aloj.card4.meta2':'🍳 Desayuno incluido',
        'aloj.card4.v1':'Doble','aloj.card4.v2':'Triple','aloj.card4.v3':'Cuádruple',
        'aloj.card5.name':'Apart Hotel','aloj.card5.meta':'👥 Hasta 4/5 personas · 🏠 2 hab. combinadas','aloj.card5.meta1':'👥 Hasta 4/5 personas','aloj.card5.meta2':'🏠 2 hab. combinadas',
        'feat.cocina':'Cocina equipada','feat.ac':'Aire acondicionado','feat.asador':'Asador','feat.limp3':'Limpieza c/3 días',
        'feat.parque':'Parque','feat.banio':'Baño privado','feat.ac24':'Aire acond. 24hs','feat.calef':'Calefacción','feat.limp1':'Limpieza diaria',
        'serv.label':'Lo que ofrecemos','serv.title':'Nuestros servicios',
        'serv.pileta':'Pileta','serv.pileta.d':'Compartida para todos los huéspedes','serv.parque':'Parque','serv.parque.d':'Amplio y verde',
        'serv.cochera':'Cochera','serv.cochera.d':'Techada y segura','serv.asadores':'Asadores','serv.asadores.d':'Privado en cada cabaña',
        'serv.desayuno':'Desayuno buffet','serv.desayuno.d':'Casero, de Celia','serv.wifi.d':'Todo el complejo',
        'serv.ac':'Aire acond.','serv.ac.d':'Frío y calor','serv.limpieza':'Limpieza','serv.limpieza.d':'Servicio de mucamas','serv.algarrobo':'El Algarrobo','serv.algarrobo.d':'Espacio compartido bicentenario','serv.juegos':'Juegos para niños','serv.juegos.d':'Para jugar y divertirse en familia','serv.seguridad':'Seguridad','serv.seguridad.d':'Rejas, alarma y cámaras','serv.ropa':'Ropa blanca','serv.ropa.d':'Sábanas, toallas y toallones',
        'test.label':'Reseñas','test.title':'Lo que dicen quienes nos visitaron',
        'test.rating':'Reseñas verificadas · Alquiler Argentina',
        'test.r1':'"Las cabañas son cómodas, el predio es grande. Es atendida por sus dueños, super amables."',
        'test.r2':'"Un lugar hermoso, para ir caminando a Playas de Oro. Las cabañas con vista a la pileta, muy cómodas. El desayuno casero de Celia: 10 puntos. Volveríamos sin dudas."',
        'test.r3':'"Excelente atención del personal, siempre dispuesto a ayudar. El complejo está muy bien cuidado y la ubicación es ideal para disfrutar las sierras."',
        'test.r4':'"Fuimos con toda la familia y quedamos encantados. Los chicos disfrutaron muchísimo la pileta y el parque. Sin dudas volvemos el año que viene."',
        'test.r5':'"La cabaña estaba impecable, bien equipada y muy cómoda. El trato de los dueños hace la diferencia — te sentís en casa desde que llegás."',
        'test.r6':'"Hermoso lugar, tranquilo y a pasos del río. El desayuno buffet es lo mejor — casero y abundante. Lo recomiendo a todos los que quieran descansar de verdad."',
        'test.r7':'"Muy buena experiencia. El lugar limpio, ordenado y la atención personalizada. Se nota que los dueños disfrutan recibir a la gente."',
        'test.r8':'"Primera vez que íbamos y ya queremos volver. El río está a dos pasos, la pileta genial y la atención del complejo es increíble. ¡100% recomendable!"',
        'test.r9':'"El desayuno de Celia no tiene comparación. Rico, abundante y con mucho cariño. El resto del complejo está a la misma altura: impecable."',
        'test.r10':'"Lugar tranquilo, verde y bien ubicado. La cabaña tenía todo lo necesario y el trato fue siempre excelente. Volvemos seguro."',
        'ubic.label':'Dónde estamos','ubic.title':'En plena avenida, rodeados de naturaleza',
        'ubic.desc':'Ubicados sobre una de las avenidas principales de Villa Carlos Paz, con las sierras como horizonte y el río a pocos pasos.',
        'ubic.d1a':'1 cuadra','ubic.d1b':'Balneario Playas de Oro','ubic.d2a':'Al lado','ubic.d2b':'Río San Antonio',
        'ubic.d3a':'21–25 cuadras','ubic.d3b':'Centro de Villa Carlos Paz','ubic.d4a':'30 minutos','ubic.d4b':'Aeropuerto Internacional de Córdoba',
        'ubic.mapa':'Google Maps — próximamente',
        'cta.title':'¿Listo para reservar tus vacaciones?','cta.sub':'Escribinos directo por WhatsApp y te respondemos al instante.','cta.btn':'Consultar por WhatsApp',
        'footer.desc':'Complejo familiar atendido por sus dueños, donde el trato personalizado y el clima hogareño hacen que cada huésped se sienta en casa. Rodeados de las sierras cordobesas y a orillas del río San Antonio.',
        'footer.aloj':'Alojamientos','footer.a1':'Cabaña chica (hasta 3 pers.)','footer.a2':'Cabaña mediana (hasta 6 pers.)','footer.a3':'Cabaña grande (hasta 8 pers.)','footer.a4':'Habitaciones de hotel',
        'footer.info':'Información','footer.checkin':'Check-in: 13:00 hs','footer.checkout':'Check-out: 10:00 hs','footer.host':'Brisas de Oro · Villa Carlos Paz',
        'fam.label':'Nuestras familias','fam.title':'Cada despedida es un hasta pronto','fam.desc':'Las familias que nos eligieron son parte de nuestra historia. Cada visita deja una huella que nos hace querer seguir dando lo mejor.',
        'casa.label':'Nuestra casa','casa.title':'También es tu casa',
        'test.plat':'También nos encontrás en',
        'aloj.franja':'¿Te interesa algún alojamiento? Antes de consultar, te recomendamos leer la <span style="color:var(--oro);font-weight:700;">información importante</span>',
        'info.cta.btn':'Consultar por WhatsApp',
        'info.label':'Información importante','info.title':'Antes de reservar, leé esto',
        'info.cta.note':'¿Ya leíste toda la información? Escribinos y te respondemos a la brevedad.',
        'acord.res.title':'Condiciones de reserva',
        'acord.res.l1':'Seña','acord.res.v1':'50% anticipado para confirmar la reserva · El saldo restante se abona al ingreso',
        'acord.res.l2':'Estadía mínima','acord.res.v2':'Variable según temporada — consultanos por disponibilidad',
        'acord.cancel.title':'Política de cancelación',
        'acord.cancel.txt':'<strong>Cancelación flexible — seña reutilizable.</strong> Ante la cancelación del huésped, el importe abonado como seña se asignará como crédito en pesos para utilizar en una futura reserva. Debe realizarse dentro de los 6 meses siguientes y estará sujeta a disponibilidad.',
        'acord.ac.title':'Aire acondicionado — importante',
        'acord.ac.l1':'Cabañas','acord.ac.v1':'Habilitado de 12:00 a 17:00 hs incluido en la tarifa. Fuera de ese horario tiene un costo adicional — consultanos al reservar.',
        'acord.ac.l2':'Habitaciones y Apart Hotel','acord.ac.v2':'Aire acondicionado disponible las 24 hs sin cargo adicional.',
        'acord.hora.title':'Horarios de ingreso y egreso',
        'acord.hora.l1':'Check-in','acord.hora.v1':'A partir de las 13:00 hs',
        'acord.hora.l2':'Check-out','acord.hora.v2':'Hasta las 10:00 hs',
        'acord.hora.note':'Los horarios son flexibles según disponibilidad. Consultanos si necesitás un horario especial.',
        'acord.normas.title':'Normas del alojamiento',
        'acord.normas.si':'✓ Se acepta',
        'acord.normas.si.v':'Familias · Parejas · Grupos de jóvenes · Niños · Bebés · Personas con movilidad reducida · Mascotas <em>(solo en cabañas)</em> · Visitas <em>(con costo adicional en temporada alta)</em>',
        'acord.normas.no':'✗ No se permite',
        'acord.normas.no.v':'Fumar en espacios interiores · Fiestas · Música alta · Ingreso de personas no registradas en la reserva',
        'acord.gar.title':'Política de garantía',
        'acord.gar.intro':'Se solicita al momento del ingreso:',
        'acord.gar.li1':'DNI o Pasaporte del titular de la reserva y de todos los integrantes del grupo',
        'acord.gar.li2':'Completar la planilla de ingreso con datos personales',
        'acord.gar.li3':'Firma de contrato de locación temporal',
        'acord.pago.title':'Formas de pago',
        'acord.pago.l1':'Transferencia','acord.pago.v1':'CBU, CVU o Alias disponible al confirmar la reserva (bancos y billeteras virtuales)',
        'acord.pago.l2':'Tarjeta de crédito / débito','acord.pago.v2':'Aceptamos tarjetas. Las tarjetas de crédito tienen recargo según la cantidad de cuotas. Consultar al reservar.',
        'acord.pago.l3':'Efectivo','acord.pago.v3':'Pesos argentinos y dólares',
        'clima.label':'Villa Carlos Paz · Sierras de Córdoba','clima.title':'Clima para tu viaje',
        'clima.desc':'Consultá el pronóstico antes de preparar tu equipaje. Datos en tiempo real, actualizados automáticamente.',
        'clima.note':'Datos provistos por Tomorrow.io · Actualizado automáticamente',
        'footer.a5':'Apart Hotel',
      },
      en: {
        'sticky.btn':'Search',
        'topbar.dir':'Av. Ramón J. Cárcano 2590 · Villa Carlos Paz, Córdoba',
        'topbar.mail':'Email us','nav.nosotros':'About us','nav.alojamientos':'Accommodations','nav.servicios':'Services',
        'nav.testimonios':'Reviews','nav.ubicacion':'Location','nav.info':'Important info','nav.clima':'Weather','nav.cta':'Inquire →',
        'hero.eyebrow':'Welcome to Hotel y Cabañas Brisas de Oro',
        'hero.title':'Live <em>unforgettable moments</em>',
        'hero.desc':'A family-run resort managed by its owners, where personalized attention and a homely atmosphere make every guest feel at home. Surrounded by the Córdoba mountains and on the banks of the San Antonio River, in Villa Carlos Paz.',
        'hero.b1':'Family atmosphere','hero.b2':'Buffet breakfast','hero.b3':'Pool','hero.b4':'Pet friendly',
        'widget.title':'Check availability','widget.sub':'Fill in the details and we\'ll reply on WhatsApp',
        'widget.llegada':'Check-in','widget.salida':'Check-out','widget.huespedes':'Guests','widget.tipo':'Type',
        'widget.cualquiera':'Any','widget.cabana':'Cabin','widget.habitacion':'Room','widget.apart':'Apart Hotel',
        'widget.btn':'Inquire on WhatsApp','widget.note':'No online payments · Direct confirmation via WhatsApp',
        'nosotros.label':'About us','nosotros.title':'A place where every guest becomes part of the family',
        'nosotros.badge1':'Owner-managed','nosotros.badge2':'María Celia, host',
        'nosotros.p1':'We are a family-run resort in Villa Carlos Paz, managed directly by its owners. From the first contact to the moment of farewell, we personally make sure your stay is comfortable, peaceful and special.',
        'nosotros.p2':'Every detail matters: the homemade breakfast prepared with love, the warm welcome, the afternoon conversations. It\'s those small things that make our guests leave with a smile and want to come back.',
        'nosotros.quote':'"More than a stay, a memory you carry in your heart."',
        'nosotros.c1':'Personalized attention','nosotros.c2':'Strategic location','nosotros.c3':'Flexibility & comfort','nosotros.c4':'16 units','nosotros.c5':'Family-run','nosotros.c6':'El Algarrobo','nosotros.p3':'At the heart of the complex stands El Algarrobo — our shared space beneath the shade of a 200-year-old algarrobo tree. Grills, tables and the sounds of nature, for gatherings that become special moments.',
        'galeria.vermas':'See more<br>photos','galeria.cta':'Contact us →',
        'aloj.label':'Our accommodations','aloj.title':'Find your ideal space','aloj.consultar':'Inquire',
        'aloj.tipo1':'Small cabin','aloj.tipo2':'Medium cabin','aloj.tipo3':'Large cabin','aloj.tipo4':'Hotel','aloj.tipo5':'Apart Hotel',
        'aloj.card1.name':'Small cabin','aloj.card1.meta':'👥 Up to 3 guests · 🛏 1 bedroom','aloj.card1.meta1':'👥 Up to 3 guests','aloj.card1.meta2':'🛏 1 bedroom',
        'aloj.card2.name':'Medium cabin','aloj.card2.meta':'👥 Up to 5/6 guests · 🛏 1 bedroom','aloj.card2.meta1':'👥 Up to 5/6 guests','aloj.card2.meta2':'🛏 1 bedroom',
        'aloj.card3.name':'Large cabin','aloj.card3.meta':'👥 Up to 7/8 guests · 🛏 2 bedrooms','aloj.card3.meta1':'👥 Up to 7/8 guests','aloj.card3.meta2':'🛏 2 bedrooms',
        'aloj.card4.name':'Hotel rooms','aloj.card4.meta':'👥 1–4 guests · 🍳 Breakfast included','aloj.card4.meta1':'👥 1–4 guests','aloj.card4.meta2':'🍳 Breakfast included',
        'aloj.card4.v1':'Double','aloj.card4.v2':'Triple','aloj.card4.v3':'Quadruple',
        'aloj.card5.name':'Apart Hotel','aloj.card5.meta':'👥 Up to 4/5 guests · 🏠 2 combined rooms','aloj.card5.meta1':'👥 Up to 4/5 guests','aloj.card5.meta2':'🏠 2 combined rooms',
        'feat.cocina':'Full kitchen','feat.ac':'Air conditioning','feat.asador':'BBQ grill','feat.limp3':'Cleaning every 3 days',
        'feat.parque':'Garden','feat.banio':'Private bathroom','feat.ac24':'A/C 24hs','feat.calef':'Heating','feat.limp1':'Daily cleaning',
        'serv.label':'What we offer','serv.title':'Our services',
        'serv.pileta':'Pool','serv.pileta.d':'Shared by all guests','serv.parque':'Grounds','serv.parque.d':'Spacious and green',
        'serv.cochera':'Parking','serv.cochera.d':'Covered and secure','serv.asadores':'BBQ grills','serv.asadores.d':'Private BBQ per cabin',
        'serv.desayuno':'Buffet breakfast','serv.desayuno.d':'Homemade, by Celia','serv.wifi.d':'Throughout the resort',
        'serv.ac':'Air cond.','serv.ac.d':'Hot & cold','serv.limpieza':'Housekeeping','serv.limpieza.d':'Daily maid service','serv.algarrobo':'El Algarrobo','serv.algarrobo.d':'Shared bicentennial space','serv.juegos':'Kids playground','serv.juegos.d':'Play and fun for everyone','serv.seguridad':'Security','serv.seguridad.d':'Fences, alarm & cameras','serv.ropa':'Bed & bath linen','serv.ropa.d':'Sheets, towels and bath towels',
        'test.label':'What our guests say','test.title':'Real reviews from the resort',
        'test.rating':'Verified reviews · Alquiler Argentina',
        'test.r1':'"The cabins are comfortable, the grounds are spacious. Owner-run, super friendly."',
        'test.r2':'"A beautiful place, walking distance to the beach. Cabins with pool views, very comfortable. Celia\'s homemade breakfast: 10/10. We\'d definitely come back."',
        'test.r3':'"Excellent service from the staff, always ready to help. The resort is very well kept and the location is perfect for enjoying the mountains."',
        'test.r4':'"We went with the whole family and loved it. The kids had a great time at the pool and the grounds. We will definitely be back next year."',
        'test.r5':'"The cabin was spotless, well-equipped and very comfortable. The owners make all the difference — you feel at home from the moment you arrive."',
        'test.r6':'"Beautiful, peaceful place, steps from the river. The buffet breakfast is the highlight — homemade and generous. I recommend it to anyone looking for a real rest."',
        'test.r7':'"Very good experience. The place is clean, tidy and the service is personal. You can tell the owners love having guests."',
        'test.r8':'"First time visiting and we already want to come back. The river is steps away, the pool is great and the service is wonderful. 100% recommended!"',
        'test.r9':'"Celia\'s breakfast is unmatched. Delicious, generous and made with love. The rest of the resort is at the same level: spotless."',
        'test.r10':'"Peaceful, green and well-located. The cabin had everything we needed and the service was always excellent. We\'ll definitely be back."',
        'ubic.label':'Where we are','ubic.title':'On the main avenue, surrounded by nature',
        'ubic.desc':'Located on one of the main avenues of Villa Carlos Paz, with the mountains on the horizon and the river just steps away.',
        'ubic.d1a':'1 block','ubic.d1b':'Playas de Oro beach','ubic.d2a':'Next door','ubic.d2b':'San Antonio River',
        'ubic.d3a':'21–25 blocks','ubic.d3b':'Villa Carlos Paz city center','ubic.d4a':'30 minutes','ubic.d4b':'Córdoba International Airport',
        'ubic.mapa':'Google Maps — coming soon',
        'cta.title':'Ready to book your vacation?','cta.sub':'Write us directly on WhatsApp and we\'ll reply instantly.','cta.btn':'Contact us on WhatsApp',
        'footer.desc':'Family resort run by its owners, one block from Playas de Oro beach. The warmth you always wanted, in the heart of the Córdoba mountains.',
        'footer.aloj':'Accommodations','footer.a1':'Small cabin (up to 3 guests)','footer.a2':'Medium cabin (up to 6 guests)','footer.a3':'Large cabin (up to 8 guests)','footer.a4':'Hotel rooms',
        'footer.info':'Information','footer.checkin':'Check-in: 1:00 PM','footer.checkout':'Check-out: 10:00 AM','footer.host':'Brisas de Oro · Villa Carlos Paz',
        'info.label':'Important information','info.title':'Before booking, read this',
        'info.cta.note':'Already read everything? Write to us and we will get back to you shortly.',
        'acord.res.title':'Booking conditions',
        'acord.res.l1':'Deposit','acord.res.v1':'50% advance payment to confirm the booking · Remaining balance due at check-in',
        'acord.res.l2':'Minimum stay','acord.res.v2':'Varies by season — contact us for availability',
        'acord.cancel.title':'Cancellation policy',
        'acord.cancel.txt':'<strong>Flexible cancellation — reusable deposit.</strong> If the guest cancels, the deposit paid will be assigned as a credit in pesos to be used for a future booking. Must be made within the following 6 months and is subject to availability.',
        'acord.ac.title':'Air conditioning — important',
        'acord.ac.l1':'Cabins','acord.ac.v1':'Available from 12:00 to 17:00 included in the rate. Outside those hours an additional charge applies — ask us when booking.',
        'acord.ac.l2':'Rooms & Apart Hotel','acord.ac.v2':'Air conditioning available 24 hours at no extra charge.',
        'acord.hora.title':'Check-in and check-out times',
        'acord.hora.l1':'Check-in','acord.hora.v1':'From 13:00 hs',
        'acord.hora.l2':'Check-out','acord.hora.v2':'Until 10:00 hs',
        'acord.hora.note':'Times are flexible depending on availability. Contact us if you need a special schedule.',
        'acord.normas.title':'House rules',
        'acord.normas.si':'✓ Allowed',
        'acord.normas.si.v':'Families · Couples · Groups of young people · Children · Babies · Persons with reduced mobility · Pets <em>(cabins only)</em> · Visitors <em>(extra charge during high season)</em>',
        'acord.normas.no':'✗ Not allowed',
        'acord.normas.no.v':'Smoking indoors · Parties · Loud music · Unregistered guests',
        'acord.gar.title':'Security policy',
        'acord.gar.intro':'Required at check-in:',
        'acord.gar.li1':'National ID or Passport of the booking holder and all group members',
        'acord.gar.li2':'Fill in the check-in form with personal details',
        'acord.gar.li3':'Sign the temporary rental agreement',
        'acord.pago.title':'Payment methods',
        'acord.pago.l1':'Bank transfer','acord.pago.v1':'CBU, CVU or Alias provided upon booking confirmation (banks and digital wallets)',
        'acord.pago.l2':'Credit / debit card','acord.pago.v2':'We accept cards. Credit cards carry a surcharge depending on the number of installments. Ask when booking.',
        'acord.pago.l3':'Cash','acord.pago.v3':'Argentine pesos and US dollars',
        'clima.label':'Villa Carlos Paz · Córdoba Hills','clima.title':'Weather for your trip',
        'clima.desc':'Check the forecast before packing. Real-time data, updated automatically.',
        'clima.note':'Data provided by Tomorrow.io · Updated automatically',
        'fam.label':'Our families','fam.title':'Every goodbye is a see you soon','fam.desc':'The families who chose us are part of our story. Every visit leaves a mark that makes us want to keep giving our best.',
        'casa.label':'Our place','casa.title':'It is your home too',
        'test.plat':'Also find us on',
        'aloj.franja':'Interested in an accommodation? Before inquiring, we recommend reading the <span style="color:var(--oro);font-weight:700;">important information</span>',
        'info.cta.btn':'Contact us on WhatsApp',
        'footer.a5':'Apart Hotel',
      },
      pt: {
        'sticky.btn':'Buscar',
        'topbar.dir':'Av. Ramón J. Cárcano 2590 · Villa Carlos Paz, Córdoba',
        'topbar.mail':'Escreva-nos','nav.nosotros':'Quem somos','nav.alojamientos':'Hospedagem','nav.servicios':'Serviços',
        'nav.testimonios':'Avaliações','nav.ubicacion':'Localização','nav.info':'Info importante','nav.clima':'Clima','nav.info':'Info importante','nav.clima':'Clima','nav.cta':'Consultar →',
        'hero.eyebrow':'Bem-vindos ao Hotel y Cabañas Brisas de Oro',
        'hero.title':'Viva <em>momentos inesquecíveis</em>',
        'hero.desc':'Complexo familiar gerenciado pelos proprietários, onde o atendimento personalizado e o clima acolhedor fazem cada hóspede se sentir em casa. Rodeados pelas serras cordobesas e às margens do Rio San Antonio, em Villa Carlos Paz.',
        'hero.b1':'Ambiente familiar','hero.b2':'Café da manhã buffet','hero.b3':'Piscina','hero.b4':'Pet friendly',
        'widget.title':'Consultar disponibilidade','widget.sub':'Preencha os dados e respondemos pelo WhatsApp',
        'widget.llegada':'Chegada','widget.salida':'Saída','widget.huespedes':'Hóspedes','widget.tipo':'Tipo',
        'widget.cualquiera':'Qualquer','widget.cabana':'Chalé','widget.habitacion':'Quarto','widget.apart':'Apart Hotel',
        'widget.btn':'Consultar pelo WhatsApp','widget.note':'Sem pagamentos online · Confirmação direta via WhatsApp',
        'nosotros.label':'Quem somos','nosotros.title':'Um lugar onde cada hóspede faz parte da família',
        'nosotros.badge1':'Gerenciado pelos proprietários','nosotros.badge2':'María Celia, anfitriã',
        'nosotros.p1':'Somos um complexo familiar localizado em Villa Carlos Paz, gerenciado diretamente pelos proprietários. Desde o primeiro contato até o momento da despedida, cuidamos pessoalmente para que sua estadia seja confortável, tranquila e especial.',
        'nosotros.p2':'Cada detalhe importa: o café da manhã caseiro preparado com amor, a recepção calorosa, as conversas de fim de tarde. São essas pequenas coisas que fazem nossos hóspedes partirem com um sorriso e quererem voltar.',
        'nosotros.quote':'"Mais do que uma estadia, uma lembrança que fica no coração."',
        'nosotros.c1':'Atenção personalizada','nosotros.c2':'Localização estratégica','nosotros.c3':'Flexibilidade e conforto','nosotros.c4':'16 unidades','nosotros.c5':'Atendido pela família','nosotros.c6':'El Algarrobo','nosotros.p3':'No coração do complexo está El Algarrobo — nosso espaço compartilhado sob a sombra de um algarrobo bicentenário. Churrasqueiras, mesas e os sons da natureza, para que cada reunião seja um momento especial.',
        'galeria.vermas':'Ver mais<br>fotos','galeria.cta':'Fale conosco →',
        'aloj.label':'Nossa hospedagem','aloj.title':'Encontre seu espaço ideal','aloj.consultar':'Consultar',
        'aloj.tipo1':'Chalé pequeno','aloj.tipo2':'Chalé médio','aloj.tipo3':'Chalé grande','aloj.tipo4':'Hotel','aloj.tipo5':'Apart Hotel',
        'aloj.card1.name':'Chalé pequeno','aloj.card1.meta':'👥 Até 3 pessoas · 🛏 1 quarto','aloj.card1.meta1':'👥 Até 3 pessoas','aloj.card1.meta2':'🛏 1 quarto',
        'aloj.card2.name':'Chalé médio','aloj.card2.meta':'👥 Até 5/6 pessoas · 🛏 1 quarto','aloj.card2.meta1':'👥 Até 5/6 pessoas','aloj.card2.meta2':'🛏 1 quarto',
        'aloj.card3.name':'Chalé grande','aloj.card3.meta':'👥 Até 7/8 pessoas · 🛏 2 quartos','aloj.card3.meta1':'👥 Até 7/8 pessoas','aloj.card3.meta2':'🛏 2 quartos',
        'aloj.card4.name':'Quartos de hotel','aloj.card4.meta':'👥 1–4 pessoas · 🍳 Café incluído','aloj.card4.meta1':'👥 1–4 pessoas','aloj.card4.meta2':'🍳 Café incluído',
        'aloj.card4.v1':'Duplo','aloj.card4.v2':'Triplo','aloj.card4.v3':'Quádruplo',
        'aloj.card5.name':'Apart Hotel','aloj.card5.meta':'👥 Até 4/5 pessoas · 🏠 2 quartos combinados','aloj.card5.meta1':'👥 Até 4/5 pessoas','aloj.card5.meta2':'🏠 2 quartos combinados',
        'feat.cocina':'Cozinha equipada','feat.ac':'Ar-condicionado','feat.asador':'Churrasqueira','feat.limp3':'Limpeza a cada 3 dias',
        'feat.parque':'Jardim','feat.banio':'Banheiro privativo','feat.ac24':'A/C 24hs','feat.calef':'Aquecimento','feat.limp1':'Limpeza diária',
        'serv.label':'O que oferecemos','serv.title':'Nossos serviços',
        'serv.pileta':'Piscina','serv.pileta.d':'Compartilhada por todos os hóspedes','serv.parque':'Jardim','serv.parque.d':'Amplo e verde',
        'serv.cochera':'Estacionamento','serv.cochera.d':'Coberto e seguro','serv.asadores':'Churrasqueiras','serv.asadores.d':'Privativo em cada chalé',
        'serv.desayuno':'Café buffet','serv.desayuno.d':'Caseiro, da Celia','serv.wifi.d':'Em todo o complexo',
        'serv.ac':'Ar-cond.','serv.ac.d':'Frio e calor','serv.limpieza':'Limpeza','serv.limpieza.d':'Serviço de camareira','serv.algarrobo':'El Algarrobo','serv.algarrobo.d':'Espaço compartilhado bicentenário','serv.juegos':'Brinquedos','serv.juegos.d':'Diversão para toda a família','serv.seguridad':'Segurança','serv.seguridad.d':'Grades, alarme e câmeras','serv.ropa':'Roupa de cama e banho','serv.ropa.d':'Lençóis, toalhas e toalhões',
        'test.label':'O que dizem nossos hóspedes','test.title':'O que dizem os nossos hóspedes',
        'test.rating':'Avaliações verificadas · Alquiler Argentina',
        'test.r1':'"Os chalés são confortáveis, o terreno é grande. É gerenciado pelos proprietários, super simpáticos."',
        'test.r2':'"Um lugar lindo, para ir caminhando até a praia. Chalés com vista para a piscina, muito confortáveis. O café da manhã da Celia: nota 10. Voltaríamos com certeza."',
        'test.r3':'"Atendimento excelente da equipe, sempre disposta a ajudar. O complexo é muito bem cuidado e a localização é ideal para aproveitar as serras."',
        'test.r4':'"Fomos com toda a família e adoramos. As crianças aproveitaram muito a piscina e o jardim. Sem dúvida voltamos no ano que vem."',
        'test.r5':'"O chalé estava impecável, bem equipado e muito confortável. O tratamento dos donos faz toda a diferença — você se sente em casa desde que chega."',
        'test.r6':'"Lugar lindo, tranquilo e a passos do rio. O café buffet é o melhor — caseiro e abundante. Recomendo a todos que queiram descansar de verdade."',
        'test.r7':'"Muito boa experiência. O lugar limpo, organizado e o atendimento personalizado. Dá para ver que os donos adoram receber as pessoas."',
        'test.r8':'"Primeira vez que fomos e já queremos voltar. O rio fica a dois passos, a piscina é ótima e o atendimento é incrível. 100% recomendado!"',
        'test.r9':'"O café da manhã da Celia não tem comparação. Gostoso, abundante e feito com muito carinho. O resto do complexo está na mesma altura: impecável."',
        'test.r10':'"Lugar tranquilo, verde e bem localizado. O chalé tinha tudo o que precisávamos e o atendimento foi sempre excelente. Voltamos com certeza."',
        'ubic.label':'Onde estamos','ubic.title':'Na avenida principal, rodeados de natureza',
        'ubic.desc':'Localizados em uma das avenidas principais de Villa Carlos Paz, com as serras no horizonte e o rio a poucos passos.',
        'ubic.d1a':'1 quarteirão','ubic.d1b':'Praia Playas de Oro','ubic.d2a':'Ao lado','ubic.d2b':'Rio San Antonio',
        'ubic.d3a':'21–25 quarteirões','ubic.d3b':'Centro de Villa Carlos Paz','ubic.d4a':'30 minutos','ubic.d4b':'Aeroporto Internacional de Córdoba',
        'ubic.mapa':'Google Maps — em breve',
        'cta.title':'Pronto para reservar suas férias?','cta.sub':'Escreva para nós pelo WhatsApp e respondemos na hora.','cta.btn':'Consultar pelo WhatsApp',
        'footer.desc':'Complexo familiar gerenciado pelos proprietários, onde o atendimento personalizado e o clima acolhedor fazem cada hóspede se sentir em casa. Rodeados pelas serras cordobesas e às margens do Rio San Antonio.',
        'footer.aloj':'Hospedagem','footer.a1':'Chalé pequeno (até 3 pessoas)','footer.a2':'Chalé médio (até 6 pessoas)','footer.a3':'Chalé grande (até 8 pessoas)','footer.a4':'Quartos de hotel',
        'footer.info':'Informações','footer.checkin':'Check-in: 13:00 hs','footer.checkout':'Check-out: 10:00 hs','footer.host':'Brisas de Oro · Villa Carlos Paz',
        'info.label':'Informações importantes','info.title':'Antes de reservar, leia isto',
        'info.cta.note':'Já leu todas as informações? Escreva para nós e responderemos em breve.',
        'acord.res.title':'Condições de reserva',
        'acord.res.l1':'Sinal','acord.res.v1':'50% antecipado para confirmar a reserva · O saldo restante é pago na chegada',
        'acord.res.l2':'Estadia mínima','acord.res.v2':'Varia conforme a temporada — consulte disponibilidade',
        'acord.cancel.title':'Política de cancelamento',
        'acord.cancel.txt':'<strong>Cancelamento flexível — sinal reutilizável.</strong> Em caso de cancelamento pelo hóspede, o valor pago como sinal será convertido em crédito em pesos para uso em uma futura reserva. Deve ser realizado dentro dos 6 meses seguintes e estará sujeito à disponibilidade.',
        'acord.ac.title':'Ar-condicionado — importante',
        'acord.ac.l1':'Chalés','acord.ac.v1':'Disponível das 12:00 às 17:00 incluído na tarifa. Fora desse horário tem custo adicional — consulte ao reservar.',
        'acord.ac.l2':'Quartos e Apart Hotel','acord.ac.v2':'Ar-condicionado disponível 24 horas sem custo adicional.',
        'acord.hora.title':'Horários de entrada e saída',
        'acord.hora.l1':'Check-in','acord.hora.v1':'A partir das 13:00 hs',
        'acord.hora.l2':'Check-out','acord.hora.v2':'Até as 10:00 hs',
        'acord.hora.note':'Os horários são flexíveis conforme disponibilidade. Consulte-nos se precisar de um horário especial.',
        'acord.normas.title':'Regras do alojamento',
        'acord.normas.si':'✓ Permitido',
        'acord.normas.si.v':'Famílias · Casais · Grupos de jovens · Crianças · Bebês · Pessoas com mobilidade reduzida · Animais de estimação <em>(apenas nos chalés)</em> · Visitas <em>(custo adicional na alta temporada)</em>',
        'acord.normas.no':'✗ Não permitido',
        'acord.normas.no.v':'Fumar em espaços internos · Festas · Música alta · Entrada de pessoas não registradas na reserva',
        'acord.gar.title':'Política de garantia',
        'acord.gar.intro':'Solicitado no momento do check-in:',
        'acord.gar.li1':'RG, CPF ou Passaporte do titular da reserva e de todos os integrantes do grupo',
        'acord.gar.li2':'Preencher a ficha de entrada com dados pessoais',
        'acord.gar.li3':'Assinar o contrato de locação temporária',
        'acord.pago.title':'Formas de pagamento',
        'acord.pago.l1':'Transferência','acord.pago.v1':'CBU, CVU ou Alias disponível ao confirmar a reserva (bancos e carteiras digitais)',
        'acord.pago.l2':'Cartão de crédito / débito','acord.pago.v2':'Aceitamos cartões. Cartões de crédito têm acréscimo conforme o número de parcelas. Consulte ao reservar.',
        'acord.pago.l3':'Dinheiro','acord.pago.v3':'Pesos argentinos e dólares americanos',
        'clima.label':'Villa Carlos Paz · Serras de Córdoba','clima.title':'Clima para a sua viagem',
        'clima.desc':'Confira a previsão antes de fazer as malas. Dados em tempo real, atualizados automaticamente.',
        'clima.note':'Dados fornecidos por Tomorrow.io · Atualizado automaticamente',
        'fam.label':'Nossas famílias','fam.title':'Cada despedida é um até logo','fam.desc':'As famílias que nos escolheram fazem parte da nossa história. Cada visita deixa uma marca que nos faz querer continuar dando o nosso melhor.',
        'casa.label':'Nossa casa','casa.title':'É a sua casa também',
        'test.plat':'Também nos encontre em',
        'aloj.franja':'Tem interesse em alguma acomodação? Antes de consultar, recomendamos ler as <span style="color:var(--oro);font-weight:700;">informações importantes</span>',
        'info.cta.btn':'Consultar pelo WhatsApp',
        'footer.a5':'Apart Hotel',
      }
    };
    
    let currentLang = 'es';
    
    function applyTranslations(lang) {
      const t = i18n[lang];
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.innerHTML = t[key];
      });
      document.getElementById('current-lang').textContent = lang.toUpperCase();
      document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.textContent.trim().toLowerCase().startsWith(lang === 'es' ? 'esp' : lang === 'en' ? 'eng' : 'port') ||
            opt.querySelector('.flag')?.textContent === (lang === 'es' ? 'ES' : lang === 'en' ? 'EN' : 'PT')) {
          opt.classList.add('active');
        }
      });
      currentLang = lang;
    }
    
    function setLang(lang) {
      applyTranslations(lang);
      document.getElementById('langSelector').classList.remove('open');
      // Refrescar clima en el idioma nuevo
      if (window.fetchClima) window.fetchClima();
    }
    
    function toggleLang() {
      document.getElementById('langSelector').classList.toggle('open');
    }
    
    // Cerrar dropdown si se hace clic fuera
    document.addEventListener('click', e => {
      if (!e.target.closest('#langSelector')) {
        document.getElementById('langSelector').classList.remove('open');
      }
    });
    
    /* ===== CARRUSEL TESTIMONIOS ===== */
    (function() {
      let posicion = 0;
      const GAP_REM = 1;
    
      // Columnas visibles según ancho de pantalla
      function getVisibles() {
        const w = window.innerWidth;
        if (w <= 768)  return 1;
        if (w <= 1024) return 2;
        return 4;
      }
    
      function igualAlturas() {
        const track = document.getElementById('testTrack');
        if (!track) return;
        const cols = Array.from(track.querySelectorAll('.test-col'));
        if (!cols.length) return;
        const vis = getVisibles();
        // En mobile solo hay 1 card visible por col, no igualar alturas
        if (vis === 1) {
          cols.forEach(col => col.querySelectorAll('.test-card').forEach(c => c.style.height = ''));
          return;
        }
        cols.forEach(col => col.querySelectorAll('.test-card').forEach(c => c.style.height = ''));
        const filas = 2;
        for (let f = 0; f < filas; f++) {
          const cardsEnFila = cols.map(col => col.querySelectorAll('.test-card')[f]).filter(Boolean);
          const maxH = Math.max(...cardsEnFila.map(c => c.getBoundingClientRect().height));
          cardsEnFila.forEach(c => c.style.height = maxH + 'px');
        }
      }
    
      function initCarrusel() {
        const track    = document.getElementById('testTrack');
        const viewport = document.getElementById('testViewport');
        if (!track || !viewport) return;
    
        const cols  = track.querySelectorAll('.test-col');
        const total = cols.length;
    
        track.style.transition = 'transform 0.52s cubic-bezier(0.4, 0, 0.2, 1)';
    
        function getMaxPos() {
          const vis = getVisibles();
          return Math.max(0, total - vis);
        }
    
        function aplicarTranslate(animado) {
          const maxP = getMaxPos();
          if (posicion > maxP) posicion = maxP;
          if (!animado) track.style.transition = 'none';
          else track.style.transition = 'transform 0.52s cubic-bezier(0.4, 0, 0.2, 1)';
          const colW = cols[0].getBoundingClientRect().width;
          const gap  = parseFloat(getComputedStyle(document.documentElement).fontSize) * GAP_REM;
          track.style.transform = `translateX(-${posicion * (colW + gap)}px)`;
        }
    
        function actualizarBotones() {
          const prev = document.getElementById('test-prev');
          const next = document.getElementById('test-next');
          if (prev) prev.disabled = posicion === 0;
          if (next) next.disabled = posicion >= getMaxPos();
        }
    
        window.moverCarrusel = function(dir) {
          posicion = Math.max(0, Math.min(posicion + dir, getMaxPos()));
          aplicarTranslate(true);
          actualizarBotones();
        };
    
        let resizeTimer;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            posicion = 0; // resetear posición al cambiar tamaño
            igualAlturas();
            aplicarTranslate(false);
            actualizarBotones();
            setTimeout(() => { track.style.transition = 'transform 0.52s cubic-bezier(0.4, 0, 0.2, 1)'; }, 60);
          }, 80);
        });
    
        actualizarBotones();
        igualAlturas();
      }
    
        requestAnimationFrame(() => requestAnimationFrame(initCarrusel));
    })();
    /* ===== ACORDEÓN ===== */
    function toggleAcord(btn) {
      const body = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      btn.classList.toggle('open', !isOpen);
      body.classList.toggle('open', !isOpen);
    }
    
    /* ===== CARRUSEL FAMILIAS ===== */
    (function() {
      const TOTAL = 6;
      let posFam = 0;
    
      function getVisFam() { return window.innerWidth <= 768 ? 1 : 3; }
      function getMaxFam() { return Math.max(0, TOTAL - getVisFam()); }
    
      function initFamilias() {
        const track = document.getElementById('fam-track');
        const dots  = document.getElementById('fam-dots');
        if (!track) return;
        if (dots) {
          dots.innerHTML = '';
          const pags = Math.ceil(TOTAL / getVisFam());
          for (let i = 0; i < pags; i++) {
            const d = document.createElement('div');
            d.className = 'familias-dot' + (i === 0 ? ' active' : '');
            d.onclick = () => { posFam = Math.min(i * getVisFam(), getMaxFam()); aplicarFamilias(); };
            dots.appendChild(d);
          }
        }
        aplicarFamilias();
      }
    
      function aplicarFamilias(animado = true) {
        const track = document.getElementById('fam-track');
        if (!track) return;
        const slides = track.querySelectorAll('.familia-slide');
        if (!slides.length) return;
        let slideW = slides[0].getBoundingClientRect().width;
        if (!slideW) {
          const vp = document.getElementById('fam-viewport') || track.parentElement;
          slideW = (vp.getBoundingClientRect().width - 64) / getVisFam();
        }
        const gap = parseFloat(getComputedStyle(track).gap) || 32;
        track.style.transition = animado ? 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none';
        track.style.transform = `translateX(-${posFam * (slideW + gap)}px)`;
        const prev = document.getElementById('fam-prev');
        const next = document.getElementById('fam-next');
        if (prev) prev.disabled = posFam === 0;
        if (next) next.disabled = posFam >= getMaxFam();
        const pagAct = Math.floor(posFam / getVisFam());
        document.querySelectorAll('#fam-dots .familias-dot').forEach((d, i) => d.classList.toggle('active', i === pagAct));
      }
    
      window.moverFamilias = function(dir) {
        posFam = Math.max(0, Math.min(posFam + dir, getMaxFam()));
        aplicarFamilias();
      };
    
      let rTimer;
      window.addEventListener('resize', () => {
        clearTimeout(rTimer);
        rTimer = setTimeout(() => { posFam = 0; aplicarFamilias(false); }, 80);
      });
    
      requestAnimationFrame(() => requestAnimationFrame(initFamilias));
    })();
    
    /* ===== MENÚ HAMBURGUESA ===== */
    function isMobile() { return window.innerWidth <= 768; }
    
    function toggleMenu() {
      document.getElementById('nav-mobile-menu').classList.toggle('open');
    }
    function cerrarMenu() {
      document.getElementById('nav-mobile-menu').classList.remove('open');
    }
    
    function ajustarNav() {
      const ham   = document.getElementById('nav-hamburger');
      const links = document.querySelector('.nav-links');
      const menu  = document.getElementById('nav-mobile-menu');
      const topH  = document.getElementById('main-topbar');
      if (isMobile()) {
        ham.style.display   = 'flex';
        links.style.display = 'none';
        // Posicionar menú mobile debajo del nav
        const navH = document.getElementById('main-nav').offsetHeight;
        const topbarH = (topH && topH.style.transform !== 'translateY(-100%)') ? 36 : 0;
        menu.style.top = (topbarH + navH) + 'px';
      } else {
        ham.style.display   = 'none';
        links.style.display = 'flex';
        menu.classList.remove('open');
      }
    }
    window.addEventListener('resize', ajustarNav);
    ajustarNav();
    
    /* ===== GALERÍA PRINCIPAL — carrusel circular estilo familias ===== */
    (function() {
      const TOTAL = 12;
      let posGal = 0;
    
      function getVisGal() { return window.innerWidth <= 768 ? 1 : 3; }
      function getMaxGal() { return Math.max(0, TOTAL - getVisGal()); }
    
      function initGaleria() {
        const track = document.getElementById('gal-track');
        const dots  = document.getElementById('gal-dots');
        if (!track) return;
        if (dots) {
          dots.innerHTML = '';
          const pags = Math.ceil(TOTAL / getVisGal());
          for (let i = 0; i < pags; i++) {
            const d = document.createElement('div');
            d.className = 'familias-dot' + (i === 0 ? ' active' : '');
            d.onclick = () => { posGal = Math.min(i * getVisGal(), getMaxGal()); aplicarGaleria(); };
            dots.appendChild(d);
          }
        }
        aplicarGaleria();
      }
    
      function aplicarGaleria(animado = true) {
        const track = document.getElementById('gal-track');
        if (!track) return;
        const slides = track.querySelectorAll('.familia-slide');
        if (!slides.length) return;
        // Si el ancho es 0 (sin fotos cargadas), usar viewport dividido por visibles
        let slideW = slides[0].getBoundingClientRect().width;
        if (!slideW) {
          const vp = document.getElementById('fam-viewport') || track.parentElement;
          slideW = (vp.getBoundingClientRect().width - 64) / getVisGal();
        }
        const gap = 32;
        track.style.transition = animado ? 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none';
        track.style.transform = `translateX(-${posGal * (slideW + gap)}px)`;
        const prev = document.getElementById('gal-prev');
        const next = document.getElementById('gal-next');
        if (prev) prev.disabled = posGal === 0;
        if (next) next.disabled = posGal >= getMaxGal();
        const pagAct = Math.floor(posGal / getVisGal());
        document.querySelectorAll('#gal-dots .familias-dot').forEach((d, i) => d.classList.toggle('active', i === pagAct));
      }
    
      window.moverGaleria = function(dir) {
        posGal = Math.max(0, Math.min(posGal + dir, getMaxGal()));
        aplicarGaleria();
      };
    
      let rTimer;
      window.addEventListener('resize', () => {
        clearTimeout(rTimer);
        rTimer = setTimeout(() => { posGal = 0; aplicarGaleria(false); }, 80);
      });
    
      requestAnimationFrame(() => requestAnimationFrame(initGaleria));
    })();
    (function() {
      // Estado de cada carrusel: { pos, total }
      const estado = {};
    
      function initCard(id) {
        const cont = document.getElementById(id);
        if (!cont) return;
        const imgs = cont.querySelectorAll('.card-carousel-track img');
        const total = imgs.length;
        if (total === 0) return;
        estado[id] = { pos: 0, total };
    
        // Crear puntos
        const dotsEl = document.getElementById('dots-' + id);
        if (dotsEl) {
          dotsEl.innerHTML = '';
          imgs.forEach((_, i) => {
            const d = document.createElement('div');
            d.className = 'card-dot' + (i === 0 ? ' active' : '');
            dotsEl.appendChild(d);
          });
        }
    
        // Estado inicial de flechas
        actualizarCard(id);
      }
    
      function actualizarCard(id) {
        const cont = document.getElementById(id);
        if (!cont) return;
        const { pos, total } = estado[id];
        const track = cont.querySelector('.card-carousel-track');
        const ancho = cont.offsetWidth || cont.getBoundingClientRect().width || 260;
        track.style.transform = `translateX(-${pos * ancho}px)`;
    
        // Puntos
        const dots = cont.querySelectorAll('.card-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === pos));
    
        // Contador
        const counter = document.getElementById('counter-' + id);
        if (counter) counter.textContent = `${pos + 1} / ${total}`;
    
        // Flechas
        const prev = cont.querySelector('.card-arrow.prev');
        const next = cont.querySelector('.card-arrow.next');
        if (prev) prev.disabled = pos === 0;
        if (next) next.disabled = pos >= total - 1;
      }
    
      window.moverCard = function(id, dir, e) {
        if (e) e.stopPropagation(); // no disparar hover panel
        if (!estado[id]) return;
        const { pos, total } = estado[id];
        const nuevo = Math.max(0, Math.min(pos + dir, total - 1));
        estado[id].pos = nuevo;
        actualizarCard(id);
      };
    
      // Recalcular al resize
      window.addEventListener('resize', () => {
        Object.keys(estado).forEach(id => {
          const cont = document.getElementById(id);
          if (!cont) return;
          const track = cont.querySelector('.card-carousel-track');
          track.style.transition = 'none';
          const ancho = cont.offsetWidth;
          const pos = estado[id].pos;
          track.style.transform = `translateX(-${pos * ancho}px)`;
          setTimeout(() => { track.style.transition = ''; }, 50);
        });
      });
    
      // Inicializar todos los carruseles
      function initAll() {
        ['car-cabana-chica','car-cabana-mediana','car-cabana-grande',
         'car-habitaciones','car-apart'].forEach(initCard);
      }
    
      requestAnimationFrame(() => requestAnimationFrame(initAll));
    })();
    (function() {
      const API_KEY  = 'IfltJvQV87vmStKapeMIGw8EVsnR2FIc';
      const LAT      = -31.4285;
      const LON      = -64.4872;
      const CONT     = document.getElementById('clima-container');
    
      const DIAS_ES  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
      const DIAS_EN  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const DIAS_PT  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    
      // Detecta día/noche en Villa Carlos Paz (UTC-3)
      function esDeDia() {
        const h = parseInt(new Date().toLocaleString('en-US', {timeZone:'America/Argentina/Cordoba', hour:'numeric', hour12:false}));
        return h >= 7 && h < 19;
      }
    
      function getIcono(code, size, forzarNoche) {
        const px = size || 48;
        const noche = forzarNoche !== undefined ? forzarNoche : !esDeDia();
        const s = {
          sol_d:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#F5A623"/><g stroke="#F5A623" stroke-width="3" stroke-linecap="round"><line x1="32" y1="4" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="60"/><line x1="4" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="60" y2="32"/><line x1="11" y1="11" x2="17" y2="17"/><line x1="47" y1="47" x2="53" y2="53"/><line x1="53" y1="11" x2="47" y2="17"/><line x1="17" y1="47" x2="11" y2="53"/></g></svg>`,
          sol_n:`<svg viewBox="0 0 64 64"><path d="M40 32a16 16 0 1 1-16-16 12 12 0 0 0 16 16z" fill="#7986CB"/><circle cx="46" cy="14" r="2" fill="#FFD600" opacity="0.9"/><circle cx="52" cy="20" r="1.5" fill="#FFD600" opacity="0.9"/><circle cx="50" cy="10" r="1.2" fill="#FFD600" opacity="0.9"/></svg>`,
          nube:`<svg viewBox="0 0 64 64"><ellipse cx="26" cy="36" rx="18" ry="13" fill="#B0BEC5"/><ellipse cx="26" cy="30" rx="12" ry="10" fill="#CFD8DC"/><ellipse cx="36" cy="28" rx="14" ry="11" fill="#CFD8DC"/><ellipse cx="40" cy="36" rx="12" ry="10" fill="#B0BEC5"/><rect x="16" y="34" width="36" height="12" rx="6" fill="#B0BEC5"/></svg>`,
          sn_d:`<svg viewBox="0 0 64 64"><circle cx="22" cy="20" r="10" fill="#F5A623"/><g stroke="#F5A623" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="6" x2="22" y2="11"/><line x1="22" y1="29" x2="22" y2="34"/><line x1="8" y1="20" x2="13" y2="20"/><line x1="31" y1="20" x2="36" y2="20"/><line x1="12" y1="10" x2="16" y2="14"/><line x1="32" y1="10" x2="28" y2="14"/></g><ellipse cx="36" cy="44" rx="18" ry="12" fill="#90A4AE"/><ellipse cx="30" cy="38" rx="12" ry="9" fill="#B0BEC5"/><ellipse cx="42" cy="36" rx="14" ry="10" fill="#B0BEC5"/><rect x="22" y="42" width="32" height="10" rx="5" fill="#90A4AE"/></svg>`,
          sn_n:`<svg viewBox="0 0 64 64"><path d="M26 18a10 10 0 1 1-10-10 8 8 0 0 0 10 10z" fill="#7986CB"/><circle cx="32" cy="8" r="1.5" fill="#FFD600" opacity="0.85"/><circle cx="36" cy="14" r="1.2" fill="#FFD600" opacity="0.85"/><ellipse cx="38" cy="44" rx="18" ry="12" fill="#90A4AE"/><ellipse cx="32" cy="38" rx="12" ry="9" fill="#B0BEC5"/><ellipse cx="44" cy="36" rx="14" ry="10" fill="#B0BEC5"/><rect x="24" y="42" width="32" height="10" rx="5" fill="#90A4AE"/></svg>`,
          lluvia:`<svg viewBox="0 0 64 64"><ellipse cx="28" cy="26" rx="18" ry="13" fill="#90A4AE"/><ellipse cx="28" cy="20" rx="12" ry="10" fill="#B0BEC5"/><ellipse cx="38" cy="18" rx="14" ry="11" fill="#B0BEC5"/><rect x="18" y="24" width="36" height="12" rx="6" fill="#90A4AE"/><g stroke="#5B9BD5" stroke-width="2.5" stroke-linecap="round"><line x1="24" y1="42" x2="20" y2="54"/><line x1="32" y1="42" x2="28" y2="54"/><line x1="40" y1="42" x2="36" y2="54"/></g></svg>`,
          niebla:`<svg viewBox="0 0 64 64"><g stroke="#B0BEC5" stroke-width="4" stroke-linecap="round"><line x1="10" y1="22" x2="54" y2="22"/><line x1="14" y1="32" x2="50" y2="32"/><line x1="10" y1="42" x2="54" y2="42"/></g></svg>`,
          tormenta:`<svg viewBox="0 0 64 64"><ellipse cx="28" cy="22" rx="18" ry="13" fill="#78909C"/><ellipse cx="28" cy="16" rx="12" ry="10" fill="#90A4AE"/><ellipse cx="38" cy="14" rx="14" ry="11" fill="#90A4AE"/><rect x="18" y="20" width="36" height="12" rx="6" fill="#78909C"/><polygon points="34,36 26,50 33,50 28,62 42,44 34,44" fill="#FFD600"/></svg>`,
          nieve:`<svg viewBox="0 0 64 64"><ellipse cx="28" cy="26" rx="18" ry="13" fill="#90A4AE"/><ellipse cx="28" cy="20" rx="12" ry="10" fill="#B0BEC5"/><ellipse cx="38" cy="18" rx="14" ry="11" fill="#B0BEC5"/><rect x="18" y="24" width="36" height="12" rx="6" fill="#90A4AE"/><circle cx="24" cy="48" r="3" fill="#5B9BD5"/><circle cx="32" cy="54" r="3" fill="#5B9BD5"/><circle cx="40" cy="48" r="3" fill="#5B9BD5"/><circle cx="32" cy="44" r="3" fill="#5B9BD5"/></svg>`,
        };
        let svg;
        if([1000,1100].includes(code))      svg = noche ? s.sol_n : s.sol_d;
        else if(code===1101)                svg = noche ? s.sn_n  : s.sn_d;
        else if([1102,1001].includes(code)) svg = s.nube;
        else if([2000,2100].includes(code)) svg = s.niebla;
        else if([4000,4001,4200,4201].includes(code)) svg = s.lluvia;
        else if([5000,5001,5100,5101,6000,6001,6200,6201,7000,7101,7102].includes(code)) svg = s.nieve;
        else if(code===8000)                svg = s.tormenta;
        else                                svg = s.nube;
        return `<div style="width:${px}px;height:${px}px;margin:0 auto">${svg}</div>`;
      }
    
      // Paragüita — siempre visible al 100%
      function getParaguita(pct) {
        const color = pct > 0 ? '#5b8fbf' : '#9ca3af';
        const svg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/></svg>`;
        return `${svg} <span style="color:${color};font-weight:600">${pct}%</span>`;
      }
    
    
    
      function getDesc(code, lang) {
        const map = {
          1000:{es:'Despejado',en:'Clear',pt:'Céu limpo'},
          1100:{es:'Mayormente sol',en:'Mostly clear',pt:'Maiorm. limpo'},
          1101:{es:'Parcialmente nublado',en:'Partly cloudy',pt:'Parcialm. nublado'},
          1102:{es:'Mayormente nublado',en:'Mostly cloudy',pt:'Maiorm. nublado'},
          1001:{es:'Nublado',en:'Cloudy',pt:'Nublado'},
          2000:{es:'Niebla',en:'Fog',pt:'Neblina'},
          4000:{es:'Llovizna',en:'Drizzle',pt:'Garoa'},
          4001:{es:'Lluvia',en:'Rain',pt:'Chuva'},
          4200:{es:'Lluvia ligera',en:'Light rain',pt:'Chuva leve'},
          4201:{es:'Lluvia intensa',en:'Heavy rain',pt:'Chuva forte'},
          5000:{es:'Nieve',en:'Snow',pt:'Neve'},
          8000:{es:'Tormenta',en:'Thunderstorm',pt:'Tempestade'},
        };
        return (map[code] || {})[lang] || (map[code] || {})['es'] || '—';
      }
    
      function renderClima(current, daily, lang) {
        const c = current.data.values;
        const days = daily.timelines.daily;
        const diasN = lang==='en'?DIAS_EN:lang==='pt'?DIAS_PT:DIAS_ES;
        const hoyL  = lang==='en'?'Today':lang==='pt'?'Hoje':'Hoy';
        const sensL = lang==='en'?'Feels like':lang==='pt'?'Sens. térmica':'Sensación térmica';
        const humL  = lang==='en'?'Humidity':lang==='pt'?'Umidade':'Humedad';
        const vienL = lang==='en'?'Wind':lang==='pt'?'Vento':'Viento';
    
        let html = `
          <div class="clima-actual">
            <div class="clima-icon-wrap" style="flex-shrink:0">
              <div class="clima-tooltip">${getDesc(c.weatherCode, lang)}</div>
              ${getIcono(c.weatherCode, 72)}
            </div>
            <div class="clima-actual-temp">${Math.round(c.temperature)}°</div>
            <div class="clima-actual-info">
              <div class="clima-actual-loc">
                <svg width="10" height="12" viewBox="0 0 11 14" fill="var(--oro)"><path d="M5.5 0C2.46 0 0 2.46 0 5.5C0 9.625 5.5 14 5.5 14C5.5 14 11 9.625 11 5.5C11 2.46 8.54 0 5.5 0ZM5.5 7.5C4.395 7.5 3.5 6.605 3.5 5.5C3.5 4.395 4.395 3.5 5.5 3.5C6.605 3.5 7.5 4.395 7.5 5.5C7.5 6.605 6.605 7.5 5.5 7.5Z"/></svg>
                Villa Carlos Paz, Córdoba, Argentina
              </div>
              <div class="clima-actual-desc">${getDesc(c.weatherCode, lang)}</div>
              <div class="clima-actual-sub">${sensL}: ${Math.round(c.temperatureApparent)}° &nbsp;·&nbsp; ${humL}: ${Math.round(c.humidity)}% &nbsp;·&nbsp; ${vienL}: ${Math.round(c.windSpeed)} km/h</div>
            </div>
          </div>
          <div class="clima-grid">`;
    
        days.slice(0,6).forEach((day,i) => {
          const d = day.values;
          const dt = new Date(day.time);
          const nombre = i===0 ? hoyL : diasN[dt.getDay()];
          const lluvia = Math.round(d.precipitationProbabilityAvg||0);
          html += `
            <div class="clima-dia">
              <div class="clima-dia-nombre">${nombre}</div>
              <div style="font-size:0.75rem;color:var(--texto-medio);margin-bottom:0.4rem;font-weight:600">${dt.getDate()}/${dt.getMonth()+1}</div>
              <div class="clima-icon-wrap">
                <div class="clima-tooltip">${getDesc(d.weatherCodeMax, lang)}</div>
                ${getIcono(d.weatherCodeMax, 44)}
              </div>
              <div class="clima-dia-temps">
                <span style="color:var(--texto)">↑ ${Math.round(d.temperatureMax)}°</span>
                <span style="color:var(--texto-suave);font-weight:400">↓ ${Math.round(d.temperatureMin)}°</span>
              </div>
              <div class="clima-dia-lluvia">${getParaguita(lluvia)}</div>
            </div>`;
        });
        html += '</div>';
        CONT.innerHTML = html;
      }
    
      async function fetchClima() {
        if (!CONT) return;
        const loc  = `${LAT},${LON}`;
        const lang = currentLang;
        try {
          const [rC, rD] = await Promise.all([
            fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${loc}&apikey=${API_KEY}&units=metric`),
            fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${loc}&apikey=${API_KEY}&units=metric&timesteps=1d`)
          ]);
          if (!rC.ok || !rD.ok) throw new Error('error');
          const [curr, daily] = await Promise.all([rC.json(), rD.json()]);
          renderClima(curr, daily, lang);
        } catch(e) {
          CONT.innerHTML = `<div class="clima-error"><span style="font-size:1.5rem;display:block;margin-bottom:0.5rem">🌡️</span>No se pudo cargar el clima. Intentá más tarde.</div>`;
        }
      }
    
      window.fetchClima = fetchClima;
      fetchClima();
      setInterval(fetchClima, 30*60*1000);
    })();
    
    const nav = document.getElementById('main-nav');
    const topbar = document.getElementById('main-topbar');
    const stickyBar = document.getElementById('stickyBar');
    const heroWidget = document.getElementById('hero-widget');
    const TOPBAR_H = 36;
    const NAV_H    = 84;
    
    function onScroll() {
      const scrollY = window.scrollY;
      const topbarVisible = scrollY <= 40;
    
      // Topbar: se oculta después de 40px, nav sube al top
      if (!topbarVisible) {
        topbar.style.transform = 'translateY(-100%)';
        topbar.style.transition = 'transform 0.3s ease';
        nav.classList.add('top-hidden');
        // Sticky bar queda justo debajo del nav (top: 68px)
        stickyBar.style.top = NAV_H + 'px';
      } else {
        topbar.style.transform = 'translateY(0)';
        nav.classList.remove('top-hidden');
        // Sticky bar queda debajo de topbar + nav (top: 104px)
        stickyBar.style.top = (TOPBAR_H + NAV_H) + 'px';
      }
    
      // Nav: se oscurece al bajar
      if (scrollY > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    
      // Sticky bar: aparece cuando el widget del hero sale de la vista
      if (heroWidget) {
        const rect = heroWidget.getBoundingClientRect();
        const limite = topbarVisible ? TOPBAR_H + NAV_H : NAV_H;
        if (rect.bottom < limite) stickyBar.classList.add('visible');
        else stickyBar.classList.remove('visible');
      }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    /* ===== HERO foto ===== */
    const heroImg = document.getElementById('hero-main-img');
    heroImg.style.transition = 'opacity 0.4s ease';
    
    const heroImgSrc = heroImg.src; // guarda la foto actual (base64)
    const heroFotos = [
      heroImgSrc, // foto 0 = la foto principal actual (base64 embebida)
      'fotos/general/2.jpeg',
      'fotos/general/3.jpeg',
      'fotos/general/4.jpeg',
    ];
    
    function cambiarFotoHero(idx) {
      heroImg.style.opacity = '0';
      setTimeout(() => {
        heroImg.src = heroFotos[idx];
        heroImg.style.opacity = '1';
      }, 220);
      document.querySelectorAll('.hero-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    }
    
    // Touch support para los dots en mobile
      document.querySelectorAll('.hero-dot').forEach((dot, idx) => {
        dot.addEventListener('touchend', function(e) {
          e.preventDefault();
          cambiarFotoHero(idx);
        });
      });
    
    /* ===== WhatsApp helpers ===== */
    function fmtFecha(iso) {
      // Convierte YYYY-MM-DD → DD/MM/YYYY
      if (!iso) return '';
      var p = iso.split('-');
      return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
    }
    
    function buildMsg(llegada, salida, huesp, tipo) {
      const t = i18n[currentLang];
      let msg = encodeURIComponent(
        currentLang === 'es' ? '¡Hola! Quisiera consultar disponibilidad en Brisas de Oro.' :
        currentLang === 'en' ? 'Hello! I\'d like to check availability at Brisas de Oro.' :
        'Olá! Gostaria de consultar disponibilidade em Brisas de Oro.'
      );
      if (llegada) msg += '%0A' + encodeURIComponent((t['widget.llegada'] || 'Llegada') + ': ' + fmtFecha(llegada));
      if (salida)  msg += '%0A' + encodeURIComponent((t['widget.salida']  || 'Salida')  + ': ' + fmtFecha(salida));
      if (huesp)   msg += '%0A' + encodeURIComponent((t['widget.huespedes'] || 'Huéspedes') + ': ' + huesp);
      if (tipo && tipo !== (t['widget.cualquiera'] || 'Cualquiera'))
                   msg += '%0A' + encodeURIComponent((t['widget.tipo'] || 'Tipo') + ': ' + tipo);
      return 'https://wa.me/543541548053?text=' + msg;
    }
    
    // Detectar mobile
    function esMobile() {
      return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    
    // Abrir WhatsApp — esquema directo en mobile, wa.me en desktop
    function abrirWsp(texto) {
      const msg = encodeURIComponent(texto);
      const url = esMobile()
        ? `whatsapp://send?phone=543541548053&text=${msg}`
        : `https://wa.me/543541548053?text=${msg}`;
      window.open(url, '_blank');
    }
    
    
    function mostrarErrorHero() {
      document.getElementById('hero-fecha-error').classList.add('visible');
    }
    function ocultarErrorHero() {
      const el = document.getElementById('hero-fecha-error');
      if (el) el.classList.remove('visible');
    }
    function mostrarErrorModal() {
      document.getElementById('date-modal-error').classList.add('visible');
    }
    
    function consultarWhatsApp() {
      const ahora = new Date();
      const hoy = ahora.getFullYear() + '-' +
        String(ahora.getMonth() + 1).padStart(2,'0') + '-' +
        String(ahora.getDate()).padStart(2,'0');
      const llegadaH  = document.getElementById('fecha-llegada').value;
      const salidaH   = document.getElementById('fecha-salida').value;
      const huespedesH = document.getElementById('huespedes').value;
      // Validar campos obligatorios
      if (!llegadaH || !salidaH || !huespedesH || huespedesH === '0') {
        document.getElementById('hero-fecha-error').textContent = getLang() === 'en'
          ? '⚠ Please fill in check-in date, check-out date and number of guests.'
          : getLang() === 'pt'
          ? '⚠ Por favor preencha a data de chegada, saída e número de hóspedes.'
          : '⚠ Por favor completá la fecha de llegada, salida y cantidad de huéspedes.';
        mostrarErrorHero(); return;
      }
      if (llegadaH && llegadaH < hoy) {
        document.getElementById('hero-fecha-error').textContent = getLang() === 'en'
          ? '⚠ Invalid date. Please select a date from today onwards.'
          : getLang() === 'pt'
          ? '⚠ Data inválida. Por favor selecione uma data a partir de hoje.'
          : '⚠ Fecha no válida. Por favor seleccioná una fecha a partir del día de hoy.';
        mostrarErrorHero(); return;
      }
      if (salidaH && salidaH < hoy) {
        document.getElementById('hero-fecha-error').textContent = getLang() === 'en'
          ? '⚠ Invalid date. Please select a date from today onwards.'
          : getLang() === 'pt'
          ? '⚠ Data inválida. Por favor selecione uma data a partir de hoje.'
          : '⚠ Fecha no válida. Por favor seleccioná una fecha a partir del día de hoy.';
        mostrarErrorHero(); return;
      }
      ocultarErrorHero();
      abrirWsp(buildMsgTexto(
        document.getElementById('fecha-llegada').value,
        document.getElementById('fecha-salida').value,
        document.getElementById('huespedes').value,
        document.getElementById('tipo-aloj').value
      ));
      setTimeout(() => {
        document.getElementById('fecha-llegada').value = '';
        document.getElementById('fecha-salida').value = '';
        document.getElementById('huespedes').value = '1';
        document.getElementById('tipo-aloj').selectedIndex = 0;
      }, 500);
    }
    
    function mostrarErrorSticky(msg) {
      const el = document.getElementById('sticky-error');
      if (el) { el.textContent = msg; el.classList.add('visible'); }
    }
    function ocultarErrorSticky() {
      const el = document.getElementById('sticky-error');
      if (el) el.classList.remove('visible');
    }
    function consultarStickyWsp() {
      const ahora = new Date();
      const hoy = ahora.getFullYear() + '-' +
        String(ahora.getMonth() + 1).padStart(2,'0') + '-' +
        String(ahora.getDate()).padStart(2,'0');
      const llegadaS  = document.getElementById('s-llegada').value;
      const salidaS   = document.getElementById('s-salida').value;
      const huespedesS = document.getElementById('s-huespedes').value;
      // Validar campos obligatorios
      if (!llegadaS || !salidaS || !huespedesS || huespedesS === '0') {
        mostrarErrorSticky(getLang() === 'en'
          ? '⚠ Please fill in check-in date, check-out date and number of guests.'
          : getLang() === 'pt'
          ? '⚠ Por favor preencha a data de chegada, saída e número de hóspedes.'
          : '⚠ Por favor completá la fecha de llegada, salida y cantidad de huéspedes.');
        return;
      }
      if (llegadaS && llegadaS < hoy) {
        mostrarErrorSticky(getLang() === 'en'
          ? '⚠ Invalid date. Please select a date from today onwards.'
          : getLang() === 'pt'
          ? '⚠ Data inválida. Por favor selecione uma data a partir de hoje.'
          : '⚠ Fecha no válida. Por favor seleccioná una fecha a partir del día de hoy.');
        return;
      }
      if (salidaS && salidaS < hoy) {
        mostrarErrorSticky(getLang() === 'en'
          ? '⚠ Invalid date. Please select a date from today onwards.'
          : getLang() === 'pt'
          ? '⚠ Data inválida. Por favor selecione uma data a partir de hoje.'
          : '⚠ Fecha no válida. Por favor seleccioná una fecha a partir del día de hoy.');
        return;
      }
      ocultarErrorSticky();
      abrirWsp(buildMsgTexto(
        document.getElementById('s-llegada').value,
        document.getElementById('s-salida').value,
        document.getElementById('s-huespedes').value,
        document.getElementById('s-tipo').value
      ));
      setTimeout(() => {
        document.getElementById('s-llegada').value = '';
        document.getElementById('s-salida').value = '';
        document.getElementById('s-huespedes').value = '1';
        document.getElementById('s-tipo').selectedIndex = 0;
        // Restaurar labels
        document.querySelectorAll('.sticky-field').forEach(function(field) {
          const input = field.querySelector('input');
          const label = field.querySelector('.sticky-label');
          if (!input || !label) return;
          if (input.id === 's-llegada') { label.textContent = 'Llegada'; label.style.color = ''; label.style.fontWeight = ''; }
          if (input.id === 's-salida')  { label.textContent = 'Salida';  label.style.color = ''; label.style.fontWeight = ''; }
        });
      }, 500);
    }
    
    // Construir el texto del mensaje
    
    // ── Mensajes WhatsApp según idioma activo ──
    function getLang() {
      return (document.getElementById('current-lang')?.textContent || 'ES').toLowerCase();
    }
    
    function getMsgWsp(tipo) {
      const msgs = {
        es: {
          general:   'Hola! Quisiera consultar disponibilidad en Brisas de Oro.',
          cabChica:  'Hola, quiero consultar por la cabaña chica.',
          cabMed:    'Hola, quiero consultar por la cabaña mediana.',
          cabGrande: 'Hola, quiero consultar por la cabaña grande.',
          habit:     'Hola, quiero consultar por una habitación.',
          apart:     'Hola, quiero consultar por el apart hotel.',
        },
        en: {
          general:   'Hello! I would like to check availability at Brisas de Oro.',
          cabChica:  'Hello, I would like to inquire about the small cabin.',
          cabMed:    'Hello, I would like to inquire about the medium cabin.',
          cabGrande: 'Hello, I would like to inquire about the large cabin.',
          habit:     'Hello, I would like to inquire about a hotel room.',
          apart:     'Hello, I would like to inquire about the apart hotel.',
        },
        pt: {
          general:   'Olá! Gostaria de consultar disponibilidade no Brisas de Oro.',
          cabChica:  'Olá, gostaria de consultar sobre o chalé pequeno.',
          cabMed:    'Olá, gostaria de consultar sobre o chalé médio.',
          cabGrande: 'Olá, gostaria de consultar sobre o chalé grande.',
          habit:     'Olá, gostaria de consultar sobre um quarto de hotel.',
          apart:     'Olá, gostaria de consultar sobre o apart hotel.',
        }
      };
      const t = msgs[getLang()] || msgs.es;
      return t[tipo] || t.general;
    }
    
    function buildMsgTexto(llegada, salida, huespedes, tipo) {
      const lang = getLang();
      const txt = {
        es: {
          saludo: 'Hola! Quisiera consultar disponibilidad en Brisas de Oro.',
          llegada: 'Llegada', salida: 'Salida', huespedes: 'Huéspedes', tipo: 'Tipo',
          cualquiera: 'Cualquiera'
        },
        en: {
          saludo: 'Hello! I would like to check availability at Brisas de Oro.',
          llegada: 'Check-in', salida: 'Check-out', huespedes: 'Guests', tipo: 'Type',
          cualquiera: 'Any'
        },
        pt: {
          saludo: 'Olá! Gostaria de consultar disponibilidade no Brisas de Oro.',
          llegada: 'Chegada', salida: 'Saída', huespedes: 'Hóspedes', tipo: 'Tipo',
          cualquiera: 'Qualquer'
        }
      };
      const t = txt[lang] || txt.es;
      let msg = t.saludo;
      if (llegada) msg += `%0A${t.llegada}: ${fmtFecha(llegada)}`;
      if (salida)  msg += `%0A${t.salida}: ${fmtFecha(salida)}`;
      if (huespedes) msg += `%0A${t.huespedes}: ${huespedes}`;
      if (tipo && tipo !== 'Cualquiera' && tipo !== 'Any' && tipo !== 'Qualquer')
        msg += `%0A${t.tipo}: ${tipo}`;
      return decodeURIComponent(msg);
    }
    // ===== MODAL FECHA MOBILE =====
    var _modalCampo = null;
    function abrirFechaModal(campo) {
      if (window.innerWidth > 768) return; // solo mobile
      _modalCampo = campo;
      const lang2 = getLang();
      const tituloMap = {
        es: { llegada: 'Fecha de llegada', salida: 'Fecha de salida' },
        en: { llegada: 'Check-in date',    salida: 'Check-out date'  },
        pt: { llegada: 'Data de chegada',  salida: 'Data de saída'   }
      };
      const titulo = (tituloMap[lang2] || tituloMap.es)[campo];
      document.getElementById('date-modal-title').textContent = titulo;
      document.getElementById('date-modal-error').classList.remove('visible');
      const input = document.getElementById('date-modal-input');
      const ahora = new Date();
      const hoy = ahora.getFullYear() + '-' +
        String(ahora.getMonth() + 1).padStart(2,'0') + '-' +
        String(ahora.getDate()).padStart(2,'0');
      input.min = campo === 'salida' && document.getElementById('s-llegada').value
        ? document.getElementById('s-llegada').value : hoy;
      input.value = document.getElementById('s-' + campo).value || '';
      document.getElementById('date-modal-overlay').classList.add('open');
      document.getElementById('date-modal-overlay').style.display = 'flex';
      // Ocultar error al cambiar la fecha
      input.onchange = function() {
        const ahora2 = new Date();
        const hoyCheck = ahora2.getFullYear() + '-' +
          String(ahora2.getMonth() + 1).padStart(2,'0') + '-' +
          String(ahora2.getDate()).padStart(2,'0');
        if (this.value >= hoyCheck) {
          document.getElementById('date-modal-error').classList.remove('visible');
        }
      };
      setTimeout(() => { input.focus(); input.click(); }, 100);
    }
    function confirmarFechaModal() {
      const val = document.getElementById('date-modal-input').value;
      const ahora = new Date();
      const hoy = ahora.getFullYear() + '-' +
        String(ahora.getMonth() + 1).padStart(2,'0') + '-' +
        String(ahora.getDate()).padStart(2,'0');
      if (val && val < hoy) {
        document.getElementById('date-modal-error').classList.add('visible');
        return;
      }
      if (val && _modalCampo) {
        document.getElementById('s-' + _modalCampo).value = val;
        // Mostrar fecha en el label del campo
        const [y,m,d] = val.split('-');
        const fechaLegible = `${d}/${m}`;
        const campo = _modalCampo === 'llegada' ? 'llegada' : 'salida';
        // Buscar el sticky-label del campo y actualizarlo
        const inputs = document.querySelectorAll('.sticky-field');
        inputs.forEach(function(field) {
          const input = field.querySelector('input');
          const label = field.querySelector('.sticky-label');
          if (input && input.id === 's-' + campo && label) {
            label.textContent = fechaLegible;
            label.style.color = 'rgba(245,242,236,0.9)';
            label.style.fontWeight = '700';
          }
        });
      }
      cerrarFechaModal();
    }
    function cerrarFechaModal() {
      document.getElementById('date-modal-error').classList.remove('visible');
      const overlay = document.getElementById('date-modal-overlay');
      overlay.classList.remove('open');
      overlay.style.display = 'none';
      _modalCampo = null;
    }
    // Cerrar al tocar el overlay
      document.getElementById('date-modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) cerrarFechaModal();
      });
      const ahora = new Date();
      const hoy = ahora.getFullYear() + '-' +
        String(ahora.getMonth() + 1).padStart(2,'0') + '-' +
        String(ahora.getDate()).padStart(2,'0');
      ['s-llegada','s-salida','fecha-llegada','fecha-salida'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.min = hoy;
      });
      // Cuando cambia llegada, actualizar mínimo de salida
      ['s-llegada','fecha-llegada'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('change', function() {
          var salidaId = id.replace('llegada','salida');
          var salida = document.getElementById(salidaId);
          if (salida && this.value) salida.min = this.value;
        });
      });
      // Ocultar error sticky al cambiar cualquier campo
      ['s-llegada','s-salida','s-huespedes','s-tipo'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('change', function() { ocultarErrorSticky(); });
      });
      // Ocultar error hero al seleccionar fecha válida
      ['fecha-llegada','fecha-salida'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('change', function() {
          const ahora2 = new Date();
          const hoyCheck = ahora2.getFullYear() + '-' +
            String(ahora2.getMonth() + 1).padStart(2,'0') + '-' +
            String(ahora2.getDate()).padStart(2,'0');
          if (this.value >= hoyCheck) ocultarErrorHero();
        });
      });
    

    // Expose functions to window so HTML inline onclick handlers can call them
    window.toggleLang         = toggleLang
    window.setLang            = setLang
    window.abrirWsp           = abrirWsp
    window.getMsgWsp          = getMsgWsp
    window.toggleMenu         = toggleMenu
    window.cerrarMenu         = cerrarMenu
    window.confirmarFechaModal = confirmarFechaModal
    window.cerrarFechaModal   = cerrarFechaModal
    window.abrirFechaModal    = abrirFechaModal
    window.consultarStickyWsp = consultarStickyWsp
    window.cambiarFotoHero    = cambiarFotoHero
    window.toggleAcord        = toggleAcord
    window.consultarWhatsApp  = consultarWhatsApp
  }, [])

  return (
    <div dangerouslySetInnerHTML={{__html: `

<!-- ============================================================ TOPBAR -->
<div class="topbar" id="main-topbar">
  <div class="topbar-inner">
    <a class="topbar-dir"
       href="https://www.google.com/maps/search/Av.+Ram%C3%B3n+J.+C%C3%A1rcano+2590+Villa+Carlos+Paz+C%C3%B3rdoba+Argentina"
       target="_blank" rel="noopener">
      <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;opacity:0.7">
        <path d="M5.5 0C2.46 0 0 2.46 0 5.5C0 9.625 5.5 14 5.5 14C5.5 14 11 9.625 11 5.5C11 2.46 8.54 0 5.5 0ZM5.5 7.5C4.395 7.5 3.5 6.605 3.5 5.5C3.5 4.395 4.395 3.5 5.5 3.5C6.605 3.5 7.5 4.395 7.5 5.5C7.5 6.605 6.605 7.5 5.5 7.5Z" fill="var(--oro)"/>
      </svg>
      <span data-i18n="topbar.dir">Av. Ramón J. Cárcano 2590 · Villa Carlos Paz, Córdoba</span>
    </a>
  </div>
</div>

<!-- ============================================================ NAV -->
<nav id="main-nav">
  <div class="nav-inner">
    <a onclick="window.scrollTo({top:0,behavior:'smooth'})" class="logo" style="cursor:pointer;">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA9IAAAJdCAYAAADeAk9nAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAEAAElEQVR4nOz9d5RkaXrfd37f9733hklbWb6r2rvp6fEzmBlggIE3BEBCJEVyV6QkUlztStpDmSNpZc7ROTJHq+VqJe6SWu3u2SUoUVwSXAAEQcxAAAZGAMZhvOtp76q7fKXPDHPvfd9n/3hvZGZV2+zuma7u+X365ImuzMjIiMibEff3mudxZoaIiIiIiIiIvDr+zb4DIiIiIiIiIm8lCtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIiIiIih6AgLSIiIiIiInIICtIiIiIi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DQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAAEhDQAAAIG/A/r35ZsHpVqBAAAAAElFTkSuQmCC" alt="Hotel y Cabañas Brisas de Oro">
    </a>
    <ul class="nav-links">
      <li><a href="#nosotros" data-i18n="nav.nosotros">Nosotros</a></li>
      <li><a href="#alojamientos" data-i18n="nav.alojamientos">Alojamientos</a></li>
      <li><a href="#antes-de-reservar" data-i18n="nav.info">Info importante</a></li>
      <li><a href="#servicios" data-i18n="nav.servicios">Servicios</a></li>
      <li><a href="#testimonios" data-i18n="nav.testimonios">Reseñas</a></li>
      <li><a href="#clima" data-i18n="nav.clima">Clima</a></li>
      <li><a href="#ubicacion" data-i18n="nav.ubicacion">Ubicación</a></li>
    </ul>
    <div class="nav-right">
      <!-- Selector de idioma -->
      <div class="lang-selector" id="langSelector">
        <button class="lang-btn" onclick="toggleLang()">
          <span class="globe">🌐</span>
          <span id="current-lang">ES</span>
          <span class="chevron">▼</span>
        </button>
        <div class="lang-dropdown" id="langDropdown">
          <div class="lang-option active" onclick="setLang('es')"><span class="flag">ES</span> Español</div>
          <div class="lang-option" onclick="setLang('en')"><span class="flag">EN</span> English</div>
          <div class="lang-option" onclick="setLang('pt')"><span class="flag">PT</span> Português</div>
        </div>
      </div>
      <a href="javascript:void(0)" onclick="abrirWsp(getMsgWsp('general'))" class="nav-cta" data-i18n="nav.cta">Consultar →</a>
      <!-- Hamburguesa (solo mobile) -->
      <button class="nav-hamburger" id="nav-hamburger" onclick="toggleMenu()" aria-label="Menú" style="display:none">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>

<!-- Menú mobile desplegable -->
<nav class="nav-mobile-menu" id="nav-mobile-menu">
  <a onclick="cerrarMenu();document.getElementById('nosotros').scrollIntoView({behavior:'smooth'})" data-i18n="nav.nosotros">Nosotros</a>
  <a onclick="cerrarMenu();document.getElementById('alojamientos').scrollIntoView({behavior:'smooth'})" data-i18n="nav.alojamientos">Alojamientos</a>
  <a onclick="cerrarMenu();document.getElementById('antes-de-reservar').scrollIntoView({behavior:'smooth'})" data-i18n="nav.info">Info importante</a>
  <a onclick="cerrarMenu();document.getElementById('servicios').scrollIntoView({behavior:'smooth'})" data-i18n="nav.servicios">Servicios</a>
  <a onclick="cerrarMenu();document.getElementById('testimonios').scrollIntoView({behavior:'smooth'})" data-i18n="nav.testimonios">Reseñas</a>
  <a onclick="cerrarMenu();document.getElementById('clima').scrollIntoView({behavior:'smooth'})" data-i18n="nav.clima">Clima</a>
  <a onclick="cerrarMenu();document.getElementById('ubicacion').scrollIntoView({behavior:'smooth'})" data-i18n="nav.ubicacion">Ubicación</a>
</nav>

<!-- Modal fecha mobile -->
<div class="date-modal-overlay" id="date-modal-overlay" style="display:none!important">
  <div class="date-modal">
    <p class="date-modal-title" id="date-modal-title">Llegada</p>
    <input type="date" id="date-modal-input">
    <p id="date-modal-error">La fecha ingresada no es válida.<br>Por favor seleccioná una fecha a partir del día de hoy.</p>
    <button class="date-modal-confirm" onclick="confirmarFechaModal()">Confirmar</button>
    <button class="date-modal-cancel" onclick="cerrarFechaModal()">Cancelar</button>
  </div>
</div>

<!-- ============================================================ STICKY BOOKING BAR -->
<div class="sticky-bar" id="stickyBar">
  <div class="sticky-bar-inner">
    <div class="sticky-field" onclick="if(window.innerWidth<=768)abrirFechaModal('llegada')">
      <span class="sticky-label" data-i18n="widget.llegada">Llegada</span>
      <input type="date" id="s-llegada" onclick="if(window.innerWidth<=768){event.preventDefault();event.stopPropagation();abrirFechaModal('llegada')}">
    </div>
    <div class="sticky-field" onclick="if(window.innerWidth<=768)abrirFechaModal('salida')">
      <span class="sticky-label" data-i18n="widget.salida">Salida</span>
      <input type="date" id="s-salida" onclick="if(window.innerWidth<=768){event.preventDefault();event.stopPropagation();abrirFechaModal('salida')}">
    </div>
    <div class="sticky-field">
      <select id="s-huespedes">
        <option value="" disabled selected data-i18n-opt="widget.huespedes">Huéspedes</option>
        <option>1</option><option>2</option><option>3</option>
        <option>4</option><option>5</option><option>6</option>
        <option>7</option><option>8+</option>
      </select>
    </div>
    <div class="sticky-field">
      <select id="s-tipo">
        <option value="" disabled selected data-i18n-opt="widget.tipo">Tipo</option>
        <option data-i18n-opt="widget.cualquiera">Cualquiera</option>
        <option data-i18n-opt="widget.cabana">Cabaña</option>
        <option data-i18n-opt="widget.habitacion">Habitación</option>
        <option data-i18n-opt="widget.apart">Apart Hotel</option>
      </select>
    </div>
    <button class="sticky-btn" onclick="consultarStickyWsp()" data-i18n="sticky.btn">Buscar</button>
</div>
  <div id="sticky-error"></div>
</div>

<!-- ============================================================ HERO -->
<section class="hero" id="inicio">
  <div class="hero-bg">
    <img id="hero-main-img"
      src="/fotos/general/1.jpeg"
      alt="Hotel y Cabañas Brisas de Oro"
      style="object-position: center 45%;">
  </div>
  <div class="hero-overlay"></div>

  <!-- Texto centrado -->
  <div class="hero-content">
    <div class="hero-text">
      <p class="hero-eyebrow" data-i18n="hero.eyebrow">Bienvenidos a Hotel y Cabañas Brisas de Oro</p>
      <h1 class="hero-title" data-i18n="hero.title">Viví <em>momentos inolvidables</em></h1>
      <p class="hero-desc" data-i18n="hero.desc">Complejo familiar atendido por sus dueños, donde el trato personalizado y el clima hogareño hacen que cada huésped se sienta en casa. Rodeados de las sierras cordobesas y a orillas del río San Antonio, en Villa Carlos Paz.</p>
      <div class="hero-badges">
        <span class="badge" data-i18n="hero.b1">Ambiente familiar</span>
        <span class="badge" data-i18n="hero.b2">Desayuno buffet</span>
        <span class="badge" data-i18n="hero.b3">Pileta</span>
        <span class="badge" data-i18n="hero.b4">Pet friendly</span>
      </div>
    </div>
    <div id="hero-widget">
      <p class="widget-title" data-i18n="widget.title">Consultar disponibilidad</p>
      <p class="widget-sub" data-i18n="widget.sub">Completá los datos y te respondemos por WhatsApp</p>
      <div class="widget-grid">
        <div class="widget-field">
          <label for="fecha-llegada" data-i18n="widget.llegada">Llegada</label>
          <input type="date" id="fecha-llegada">
        </div>
        <div class="widget-field">
          <label for="fecha-salida" data-i18n="widget.salida">Salida</label>
          <input type="date" id="fecha-salida">
        </div>
        <div class="widget-field">
          <label for="huespedes" data-i18n="widget.huespedes">Huéspedes</label>
          <select id="huespedes">
            <option>1</option><option>2</option><option>3</option>
            <option>4</option><option>5</option><option>6</option>
            <option>7</option><option>8+</option>
          </select>
        </div>
        <div class="widget-field">
          <label for="tipo-aloj" data-i18n="widget.tipo">Tipo</label>
          <select id="tipo-aloj">
            <option data-i18n-opt="widget.cualquiera">Cualquiera</option>
            <option data-i18n-opt="widget.cabana">Cabaña</option>
            <option data-i18n-opt="widget.habitacion">Habitación</option>
            <option data-i18n-opt="widget.apart">Apart Hotel</option>
          </select>
        </div>
      </div>
      <p id="hero-fecha-error">⚠ Fecha no válida. Por favor seleccioná una fecha a partir del día de hoy.</p>
      <button class="btn-consultar" onclick="consultarWhatsApp()" data-i18n="widget.btn">Consultar por WhatsApp</button>
      <p class="widget-note" data-i18n="widget.note">Sin pagos online · Confirmación directa vía WhatsApp</p>
    </div>
  </div>

  <!-- Puntos indicadores -->
  <div style="position:absolute;bottom:1.75rem;left:50%;transform:translateX(-50%);z-index:3;display:flex;gap:8px;align-items:center;" id="hero-dots">
    <span class="hero-dot active" onclick="cambiarFotoHero(0)"></span>
    <span class="hero-dot" onclick="cambiarFotoHero(1)"></span>
    <span class="hero-dot" onclick="cambiarFotoHero(2)"></span>
    <span class="hero-dot" onclick="cambiarFotoHero(3)"></span>
  </div>
</section>

<!-- ============================================================ NOSOTROS -->
<section id="nosotros" class="sec-blanco">
  <div class="section-inner">
    <div class="nosotros-grid">
      <div class="nosotros-img-wrap">
        <img src="/fotos/general/5.jpeg" alt="Complejo Brisas de Oro">
        <div class="nosotros-img-badge">
          <p data-i18n="nosotros.badge1">Atendido por sus dueños</p>
          <span data-i18n="nosotros.badge2">María Celia, anfitriona</span>
        </div>
      </div>
      <div class="nosotros-text">
        <p class="section-label" data-i18n="nosotros.label">Quiénes somos</p>
        <h2 class="section-title" data-i18n="nosotros.title">Un lugar donde cada huésped es parte de la familia</h2>
        <div class="divider"></div>
        <p data-i18n="nosotros.p1">Somos un complejo familiar ubicado en Villa Carlos Paz, atendido directamente por sus dueños. Desde el primer contacto hasta el momento de la despedida, nos ocupamos personalmente de que tu estadía sea cómoda, tranquila y especial.</p>
        <p data-i18n="nosotros.p2">Cada detalle importa: el desayuno casero preparado con amor, el saludo al llegar, la charla de tarde. Son esas pequeñas cosas las que hacen que nuestros huéspedes se vayan con una sonrisa y quieran volver.</p>
          <p data-i18n="nosotros.p3">En el corazón del complejo se encuentra El Algarrobo — nuestro espacio compartido bajo la sombra de un algarrobo bicentenario. Parrilleros, mesas y el sonido de la naturaleza, para que cada reunión sea un momento especial.</p>
        <div class="highlight-box">
          <p data-i18n="nosotros.quote">"Más que una estadía, un recuerdo que se lleva en el corazón."</p>
        </div>
        <div class="info-chips">
          <span class="chip" data-i18n="nosotros.c1">Atención personalizada</span>
          <span class="chip" data-i18n="nosotros.c2">Ubicación estratégica</span>
          <span class="chip" data-i18n="nosotros.c3">Flexibilidad y comodidad</span>
          <span class="chip" data-i18n="nosotros.c4">16 unidades</span>
          <span class="chip" data-i18n="nosotros.c5">Atendido por la familia</span>
          <span class="chip" data-i18n="nosotros.c6">El Algarrobo</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================ NUESTRAS FAMILIAS -->
<section class="sec-crema-a" style="padding: 4rem 6%;">
  <div class="section-inner">
    <div style="text-align:center; margin-bottom:2.5rem;">
      <p class="section-label" data-i18n="fam.label">Nuestras familias</p>
      <h2 class="section-title" data-i18n="fam.title">Cada despedida es un hasta pronto</h2>
      <div class="divider" style="margin:0.9rem auto 0;"></div>
      <p style="font-size:0.9rem;color:var(--texto-suave);max-width:520px;margin:1rem auto 0;line-height:1.75;">
        <span data-i18n="fam.desc">Las familias que nos eligieron son parte de nuestra historia. Cada visita deja una huella que nos hace querer seguir dando lo mejor.</span>
      </p>
    </div>

    <div class="familias-wrap" style="position:relative;">
      <button class="familias-arrow left" id="fam-prev" onclick="moverFamilias(-1)" disabled>&#8249;</button>

      <div class="familias-viewport" id="fam-viewport">
        <div class="familias-track" id="fam-track">

          <!-- Foto 1 -->
          <div class="familia-slide">
            <div class="familia-circle">
              <img src="/fotos/familias/1.jpeg" alt="Familia 1"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <div class="familia-circle-placeholder" style="display:none">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>fotos/familias/1.jpeg</span>
              </div>
            </div>
          </div>

          <!-- Foto 2 -->
          <div class="familia-slide">
            <div class="familia-circle">
              <img src="/fotos/familias/2.jpeg" alt="Familia 2"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <div class="familia-circle-placeholder" style="display:none">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>fotos/familias/2.jpeg</span>
              </div>
            </div>
          </div>

          <!-- Foto 3 -->
          <div class="familia-slide">
            <div class="familia-circle">
              <img src="/fotos/familias/3.jpeg" alt="Familia 3"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <div class="familia-circle-placeholder" style="display:none">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>fotos/familias/3.jpeg</span>
              </div>
            </div>
          </div>

          <!-- Foto 4 -->
          <div class="familia-slide">
            <div class="familia-circle">
              <img src="/fotos/familias/4.jpeg" alt="Familia 4"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <div class="familia-circle-placeholder" style="display:none">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>fotos/familias/4.jpeg</span>
              </div>
            </div>
          </div>

          <!-- Foto 5 -->
          <div class="familia-slide">
            <div class="familia-circle">
              <img src="/fotos/familias/5.jpeg" alt="Familia 5"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <div class="familia-circle-placeholder" style="display:none">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>fotos/familias/5.jpeg</span>
              </div>
            </div>
          </div>

          <!-- Foto 6 -->
          <div class="familia-slide">
            <div class="familia-circle">
              <img src="/fotos/familias/6.jpeg" alt="Familia 6"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <div class="familia-circle-placeholder" style="display:none">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>fotos/familias/6.jpeg</span>
              </div>
            </div>
          </div>

        </div><!-- /fam-track -->
      </div><!-- /fam-viewport -->

      <button class="familias-arrow right" id="fam-next" onclick="moverFamilias(1)">&#8250;</button>
    </div>

    <div class="familias-dots" id="fam-dots"></div>
  </div>
</section>

<!-- ============================================================ GALERÍA -->
<section class="sec-blanco" style="padding: 4rem 6%;">
  <div class="section-inner">
    <div style="text-align:center; margin-bottom:2.5rem;">
      <p class="section-label" data-i18n="casa.label">Nuestra casa</p>
      <h2 class="section-title" data-i18n="casa.title">También es tu casa</h2>
      <div class="divider" style="margin:0.9rem auto 0;"></div>
      <p style="font-size:0.9rem;color:var(--texto-suave);max-width:520px;margin:1rem auto 0;line-height:1.75;">
        <!-- Desktop -->
<p class="solo-desktop" style="color:var(--texto-medio);font-size:0.9rem;line-height:1.75;margin:1rem auto 0;max-width:520px;text-align:center;">
  Cada rincón fue pensado para que te sientas cómodo, libre y en familia.<br>Bienvenido a Brisas de Oro.
</p>
<!-- Mobile -->
<p class="solo-mobile" style="color:var(--texto-medio);font-size:0.9rem;line-height:1.75;margin:1rem auto 0;max-width:520px;text-align:center;">
  Cada rincón fue pensado para que te sientas<br>cómodo, libre y en familia.<br>Bienvenido a Brisas de Oro.
</p>
      </p>
    </div>

    <div class="familias-wrap" style="position:relative;" id="gal-wrap">
      <button class="familias-arrow left" id="gal-prev" onclick="moverGaleria(-1)" disabled>&#8249;</button>

      <div class="familias-viewport" id="gal-viewport">
        <div class="familias-track" id="gal-track">
          <div class="familia-slide"><div class="familia-circle"><img src="/fotos/general/1.jpeg" alt="Brisas de Oro" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="familia-circle-placeholder" style="display:none"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>1.jpg</span></div></div></div>
          <div class="familia-slide"><div class="familia-circle"><img src="/fotos/general/2.jpeg" alt="Brisas de Oro" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="familia-circle-placeholder" style="display:none"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>2.jpg</span></div></div></div>
          <div class="familia-slide"><div class="familia-circle"><img src="/fotos/general/3.jpeg" alt="Brisas de Oro" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="familia-circle-placeholder" style="display:none"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>3.jpg</span></div></div></div>
          <div class="familia-slide"><div class="familia-circle"><img src="/fotos/general/4.jpeg" alt="Brisas de Oro" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="familia-circle-placeholder" style="display:none"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>4.jpg</span></div></div></div>
          <div class="familia-slide"><div class="familia-circle"><img src="/fotos/general/5.jpeg" alt="Brisas de Oro" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="familia-circle-placeholder" style="display:none"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>5.jpg</span></div></div></div>
          <div class="familia-slide"><div class="familia-circle"><img src="/fotos/general/6.jpeg" alt="Brisas de Oro" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="familia-circle-placeholder" style="display:none"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>6.jpg</span></div></div></div>
          <div class="familia-slide"><div class="familia-circle"><img src="/fotos/general/7.jpeg" alt="Brisas de Oro" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="familia-circle-placeholder" style="display:none"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>7.jpg</span></div></div></div>
          <div class="familia-slide"><div class="familia-circle"><img src="/fotos/general/8.jpeg" alt="Brisas de Oro" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="familia-circle-placeholder" style="display:none"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>8.jpg</span></div></div></div>
          <div class="familia-slide"><div class="familia-circle"><img src="/fotos/general/9.jpeg" alt="Brisas de Oro" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="familia-circle-placeholder" style="display:none"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>9.jpg</span></div></div></div>
          <div class="familia-slide"><div class="familia-circle"><img src="/fotos/general/10.jpeg" alt="Brisas de Oro" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="familia-circle-placeholder" style="display:none"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>10.jpg</span></div></div></div>
          <div class="familia-slide"><div class="familia-circle"><img src="/fotos/general/11.jpeg" alt="Brisas de Oro" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="familia-circle-placeholder" style="display:none"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>11.jpg</span></div></div></div>
          <div class="familia-slide"><div class="familia-circle"><img src="/fotos/general/12.jpeg" alt="Brisas de Oro" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="familia-circle-placeholder" style="display:none"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>12.jpg</span></div></div></div>
        </div>
      </div>

      <button class="familias-arrow right" id="gal-next" onclick="moverGaleria(1)">&#8250;</button>
    </div>

    <div class="familias-dots" id="gal-dots"></div>
  </div>
</section>

<!-- ============================================================ ALOJAMIENTOS -->
<section id="alojamientos" class="sec-crema-a">
  <div class="section-inner">
    <p class="section-label" data-i18n="aloj.label">Nuestros alojamientos</p>
    <h2 class="section-title" data-i18n="aloj.title">Encontrá tu espacio ideal</h2>
    <div class="divider"></div>
    <div class="aloj-grid">

      <!-- CARD 1 — Cabaña chica -->
      <div class="aloj-card">
        <div class="card-img">
          <div class="card-carousel" id="car-cabana-chica">
            <div class="card-carousel-track">
              <img src="/fotos/cabana-chica/portada.jpeg" alt="Cabaña chica">
              <img src="/fotos/cabana-chica/1.jpeg" alt="">
              <img src="/fotos/cabana-chica/2.jpeg" alt="">
              <img src="/fotos/cabana-chica/3.jpeg" alt="">
              <img src="/fotos/cabana-chica/4.jpeg" alt="">
              <img src="/fotos/cabana-chica/5.jpeg" alt="">
            </div>
            <button class="card-arrow prev" onclick="moverCard('car-cabana-chica',-1,event)">&#8249;</button>
            <button class="card-arrow next" onclick="moverCard('car-cabana-chica',1,event)">&#8250;</button>
            <div class="card-dots" id="dots-car-cabana-chica"></div>
            <span class="card-counter" id="counter-car-cabana-chica">1 / 6</span>
          </div>
          <span class="card-type-badge" data-i18n="aloj.tipo1">Cabaña chica</span>
          <div class="card-hover-panel">
            <p class="card-hover-name" data-i18n="aloj.card1.name">Cabaña chica</p>
            <p class="card-hover-meta" data-i18n="aloj.card1.meta">👥 Hasta 3 personas · 🛏 1 dormitorio</p>
            <a class="btn-consultar-card" href="javascript:void(0)" onclick="abrirWsp(getMsgWsp('cabChica'))" data-i18n="aloj.consultar">Consultar</a>
          </div>
        </div>
        <div class="card-body">
          <p class="card-name" data-i18n="aloj.card1.name">Cabaña chica</p>
          <div class="card-meta"><span>👥 Hasta 3 personas</span><span>🛏 1 dormitorio</span></div>
          <div class="card-features">
            <span class="feature-tag">Aire frío/calor</span>
            <span class="feature-tag">Cocina equipada</span>
            <span class="feature-tag">Asador privado</span>
            <span class="feature-tag">Limpieza c/3 días</span>
          </div>
        </div>
      </div>

      <!-- CARD 2 — Cabaña mediana -->
      <div class="aloj-card">
        <div class="card-img">
          <div class="card-carousel" id="car-cabana-mediana">
            <div class="card-carousel-track">
              <img src="/fotos/cabana-mediana/portada.webp" alt="Cabaña mediana">
              <img src="/fotos/cabana-mediana/1.jpeg" alt="">
              <img src="/fotos/cabana-mediana/2.jpeg" alt="">
              <img src="/fotos/cabana-mediana/3.jpeg" alt="">
              <img src="/fotos/cabana-mediana/4.jpeg" alt="">
              <img src="/fotos/cabana-mediana/5.jpeg" alt="">
              <img src="/fotos/cabana-mediana/6.jpeg" alt="">
            </div>
            <button class="card-arrow prev" onclick="moverCard('car-cabana-mediana',-1,event)">&#8249;</button>
            <button class="card-arrow next" onclick="moverCard('car-cabana-mediana',1,event)">&#8250;</button>
            <div class="card-dots" id="dots-car-cabana-mediana"></div>
            <span class="card-counter" id="counter-car-cabana-mediana">1 / 7</span>
          </div>
          <span class="card-type-badge" data-i18n="aloj.tipo2">Cabaña mediana</span>
          <div class="card-hover-panel">
            <p class="card-hover-name" data-i18n="aloj.card2.name">Cabaña mediana</p>
            <p class="card-hover-meta" data-i18n="aloj.card2.meta">👥 Hasta 5/6 personas · 🛏 2 dormitorios</p>
            <a class="btn-consultar-card" href="javascript:void(0)" onclick="abrirWsp(getMsgWsp('cabMed'))" data-i18n="aloj.consultar">Consultar</a>
          </div>
        </div>
        <div class="card-body">
          <p class="card-name" data-i18n="aloj.card2.name">Cabaña mediana</p>
          <div class="card-meta"><span>👥 Hasta 5/6 personas</span><span>🛏 1 dormitorio</span></div>
          <div class="card-features">
            <span class="feature-tag">Aire acondicionado</span>
            <span class="feature-tag">🔥 Salamandra</span>
            <span class="feature-tag">Cocina equipada</span>
            <span class="feature-tag">Asador privado</span>
            <span class="feature-tag">Limpieza c/3 días</span>
          </div>
        </div>
      </div>

      <!-- CARD 3 — Cabaña grande -->
      <div class="aloj-card">
        <div class="card-img">
          <div class="card-carousel" id="car-cabana-grande">
            <div class="card-carousel-track">
              <img src="/fotos/cabana-grande/portada.jpeg" alt="Cabaña grande">
              <img src="/fotos/cabana-grande/1.jpeg" alt="">
              <img src="/fotos/cabana-grande/2.jpeg" alt="">
              <img src="/fotos/cabana-grande/3.jpeg" alt="">
              <img src="/fotos/cabana-grande/4.jpeg" alt="">
              <img src="/fotos/cabana-grande/5.jpeg" alt="">
              <img src="/fotos/cabana-grande/6.jpeg" alt="">
            </div>
            <button class="card-arrow prev" onclick="moverCard('car-cabana-grande',-1,event)">&#8249;</button>
            <button class="card-arrow next" onclick="moverCard('car-cabana-grande',1,event)">&#8250;</button>
            <div class="card-dots" id="dots-car-cabana-grande"></div>
            <span class="card-counter" id="counter-car-cabana-grande">1 / 7</span>
          </div>
          <span class="card-type-badge" data-i18n="aloj.tipo3">Cabaña grande</span>
          <div class="card-hover-panel">
            <p class="card-hover-name" data-i18n="aloj.card3.name">Cabaña grande</p>
            <p class="card-hover-meta" data-i18n="aloj.card3.meta">👥 Hasta 7/8 personas · 🛏 3 dormitorios</p>
            <a class="btn-consultar-card" href="javascript:void(0)" onclick="abrirWsp(getMsgWsp('cabGrande'))" data-i18n="aloj.consultar">Consultar</a>
          </div>
        </div>
        <div class="card-body">
          <p class="card-name" data-i18n="aloj.card3.name">Cabaña grande</p>
          <div class="card-meta"><span>👥 Hasta 7/8 personas</span><span>🛏 2 dormitorios</span></div>
          <div class="card-features">
            <span class="feature-tag">Aire frío/calor</span>
            <span class="feature-tag">Cocina equipada</span>
            <span class="feature-tag">Asador privado</span>
            <span class="feature-tag">Limpieza c/3 días</span>
          </div>
        </div>
      </div>

      <!-- CARD 4 — Habitaciones de hotel -->
      <div class="aloj-card">
        <div class="card-img">
          <div class="card-carousel" id="car-habitaciones">
            <div class="card-carousel-track">
              <img src="/fotos/habitaciones/portada.jpeg" alt="Habitaciones">
              <img src="/fotos/habitaciones/1.jpeg" alt="">
              <img src="/fotos/habitaciones/2.jpeg" alt="">
              <img src="/fotos/habitaciones/3.jpeg" alt="">
              <img src="/fotos/habitaciones/4.jpeg" alt="">
              <img src="/fotos/habitaciones/5.jpeg" alt="">
              <img src="/fotos/habitaciones/6.jpeg" alt="">
              <img src="/fotos/habitaciones/7.jpeg" alt="">
            </div>
            <button class="card-arrow prev" onclick="moverCard('car-habitaciones',-1,event)">&#8249;</button>
            <button class="card-arrow next" onclick="moverCard('car-habitaciones',1,event)">&#8250;</button>
            <div class="card-dots" id="dots-car-habitaciones"></div>
            <span class="card-counter" id="counter-car-habitaciones">1 / 8</span>
          </div>
          <span class="card-type-badge" data-i18n="aloj.tipo4">Hotel</span>
          <div class="card-hover-panel">
            <p class="card-hover-name" data-i18n="aloj.card4.name">Habitaciones de hotel</p>
            <p class="card-hover-meta" data-i18n="aloj.card4.meta">👥 1–4 personas · 🍳 Desayuno incluido</p>
            <a class="btn-consultar-card" href="javascript:void(0)" onclick="abrirWsp(getMsgWsp('habit'))" data-i18n="aloj.consultar">Consultar</a>
          </div>
        </div>
        <div class="card-body">
          <p class="card-name" data-i18n="aloj.card4.name">Habitaciones de hotel</p>
          <div class="card-meta"><span>👥 1 a 4 personas</span><span>🛏 Baño privado</span></div>
          <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.7rem">
            <span class="variant-chip">Doble</span>
            <span class="variant-chip">Triple</span>
            <span class="variant-chip">Cuádruple</span>
          </div>
          <div class="card-features">
            <span class="feature-tag">Aire frío/calor 24hs</span>
            <span class="feature-tag">Heladera privada</span>
            <span class="feature-tag">Asador compartido</span>
            <span class="feature-tag">Limpieza diaria</span>
          </div>
        </div>
      </div>

      <!-- CARD 5 — Apart Hotel -->
      <div class="aloj-card">
        <div class="card-img">
          <div class="card-carousel" id="car-apart">
            <div class="card-carousel-track">
              <img src="/fotos/apart-hotel/portada.jpeg" alt="Apart Hotel">
              <img src="/fotos/apart-hotel/1.jpeg" alt="">
              <img src="/fotos/apart-hotel/2.jpeg" alt="">
              <img src="/fotos/apart-hotel/3.jpeg" alt="">
              <img src="/fotos/apart-hotel/4.jpeg" alt="">
            </div>
            <button class="card-arrow prev" onclick="moverCard('car-apart',-1,event)">&#8249;</button>
            <button class="card-arrow next" onclick="moverCard('car-apart',1,event)">&#8250;</button>
            <div class="card-dots" id="dots-car-apart"></div>
            <span class="card-counter" id="counter-car-apart">1 / 5</span>
          </div>
          <span class="card-type-badge" data-i18n="aloj.tipo5">Apart Hotel</span>
          <div class="card-hover-panel">
            <p class="card-hover-name" data-i18n="aloj.card5.name">Apart Hotel</p>
            <p class="card-hover-meta" data-i18n="aloj.card5.meta">👥 Hasta 4/5 personas · 🏠 2 hab. combinadas</p>
            <a class="btn-consultar-card" href="javascript:void(0)" onclick="abrirWsp(getMsgWsp('apart'))" data-i18n="aloj.consultar">Consultar</a>
          </div>
        </div>
        <div class="card-body">
          <p class="card-name" data-i18n="aloj.card5.name">Apart Hotel</p>
          <div class="card-meta"><span>👥 Hasta 4/5 personas</span><span>🏠 2 hab. con baño privado</span></div>
          <div class="card-features">
            <span class="feature-tag">Aire frío/calor 24hs</span>
            <span class="feature-tag">Cocina semi equipada</span>
            <span class="feature-tag">Heladera privada</span>
            <span class="feature-tag">Asador compartido</span>
            <span class="feature-tag">Limpieza diaria</span>
          </div>
        </div>
      </div>    </div>
  </div>
</section>

<!-- Franja de transición hacia información importante -->
<div style="background:var(--crema-b);border-top:1px solid var(--borde);border-bottom:1px solid var(--borde);padding:1.25rem 5%;text-align:center;">
  <div onclick="document.getElementById('antes-de-reservar').scrollIntoView({behavior:'smooth'})" style="display:inline-flex;flex-direction:column;align-items:center;gap:0.5rem;text-decoration:none;color:var(--texto-medio);cursor:pointer;">
    <span data-i18n="aloj.franja" style="font-family:'Nunito',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:0.03em;">¿Te interesa algún alojamiento? Antes de consultar, te recomendamos leer la <span style="color:var(--oro);font-weight:700;">información importante</span></span>
    <svg class="bounce-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--oro)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </div>
</div>

<!-- ============================================================ ANTES DE RESERVAR -->
<section id="antes-de-reservar" class="sec-blanco" style="padding: 3rem 5% 4rem;">
  <div class="section-inner" style="max-width:860px;">
    <div style="text-align:center;margin-bottom:2rem;">
      <p class="section-label" data-i18n="info.label">Información importante</p>
      <h2 class="section-title" data-i18n="info.title">Antes de reservar, leé esto</h2>
      <div class="divider" style="margin:0.9rem auto 0;"></div>
    </div>

    <div class="acordeon" id="acordeon">

      <!-- 1. Condiciones de reserva -->
      <div class="acord-item">
        <button class="acord-header" onclick="toggleAcord(this)">
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 2v4M8 2v4M2 10h20"/></svg>
            <span data-i18n="acord.res.title">Condiciones de reserva</span>
          </span>
          <svg class="acord-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="acord-body">
          <div class="acord-grid">
            <div class="acord-dato"><span class="acord-label" data-i18n="acord.res.l1">Seña</span><span data-i18n="acord.res.v1">50% anticipado para confirmar la reserva · El saldo restante se abona al ingreso</span></div>
            <div class="acord-dato"><span class="acord-label" data-i18n="acord.res.l2">Estadía mínima</span><span data-i18n="acord.res.v2">Variable según temporada — consultanos por disponibilidad</span></div>
          </div>
        </div>
      </div>

      <!-- 2. Política de cancelación -->
      <div class="acord-item">
        <button class="acord-header" onclick="toggleAcord(this)">
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span data-i18n="acord.cancel.title">Política de cancelación</span>
          </span>
          <svg class="acord-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="acord-body">
          <p data-i18n="acord.cancel.txt"><strong>Cancelación flexible — seña reutilizable.</strong> Ante la cancelación del huésped, el importe abonado como seña se asignará como crédito en pesos para utilizar en una futura reserva. Debe realizarse dentro de los 6 meses siguientes y estará sujeta a disponibilidad.</p>
        </div>
      </div>

      <!-- 3. Aire acondicionado — destacado -->
      <div class="acord-item acord-destacado">
        <button class="acord-header" onclick="toggleAcord(this)">
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>
            <span data-i18n="acord.ac.title">Aire acondicionado — importante</span>
          </span>
          <svg class="acord-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="acord-body">
          <div class="acord-grid">
            <div class="acord-dato"><span class="acord-label" data-i18n="acord.ac.l1">Cabañas</span><span data-i18n="acord.ac.v1">Habilitado de 12:00 a 17:00 hs incluido en la tarifa. Fuera de ese horario tiene un costo adicional — consultanos al reservar.</span></div>
            <div class="acord-dato"><span class="acord-label" data-i18n="acord.ac.l2">Habitaciones y Apart Hotel</span><span data-i18n="acord.ac.v2">Aire acondicionado disponible las 24 hs sin cargo adicional.</span></div>
          </div>
        </div>
      </div>

      <!-- 4. Horarios -->
      <div class="acord-item">
        <button class="acord-header" onclick="toggleAcord(this)">
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span data-i18n="acord.hora.title">Horarios de ingreso y egreso</span>
          </span>
          <svg class="acord-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="acord-body">
          <div class="acord-grid">
            <div class="acord-dato"><span class="acord-label" data-i18n="acord.hora.l1">Check-in</span><span data-i18n="acord.hora.v1">A partir de las 13:00 hs</span></div>
            <div class="acord-dato"><span class="acord-label" data-i18n="acord.hora.l2">Check-out</span><span data-i18n="acord.hora.v2">Hasta las 10:00 hs</span></div>
          </div>
          <p style="margin-top:0.75rem;font-size:0.85rem;color:var(--texto-suave)" data-i18n="acord.hora.note">Los horarios son flexibles según disponibilidad. Consultanos si necesitás un horario especial.</p>
        </div>
      </div>

      <!-- 5. Normas -->
      <div class="acord-item">
        <button class="acord-header" onclick="toggleAcord(this)">
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            <span data-i18n="acord.normas.title">Normas del alojamiento</span>
          </span>
          <svg class="acord-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="acord-body">
          <div class="acord-grid">
            <div class="acord-dato">
              <span class="acord-label" style="color:#4caf50" data-i18n="acord.normas.si">✓ Se acepta</span>
              <span data-i18n="acord.normas.si.v">Familias · Parejas · Grupos de jóvenes · Niños · Bebés · Personas con movilidad reducida · Mascotas <em>(solo en cabañas)</em> · Visitas <em>(con costo adicional en temporada alta)</em></span>
            </div>
            <div class="acord-dato">
              <span class="acord-label" style="color:#e53935" data-i18n="acord.normas.no">✗ No se permite</span>
              <span data-i18n="acord.normas.no.v">Fumar en espacios interiores · Fiestas · Música alta · Ingreso de personas no registradas en la reserva</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Garantía -->
      <div class="acord-item">
        <button class="acord-header" onclick="toggleAcord(this)">
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></svg>
            <span data-i18n="acord.gar.title">Política de garantía</span>
          </span>
          <svg class="acord-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="acord-body">
          <p data-i18n="acord.gar.intro">Se solicita al momento del ingreso:</p>
          <ul style="margin-top:0.5rem;padding-left:1.2rem;color:var(--texto-medio);font-size:0.88rem;line-height:2">
            <li data-i18n="acord.gar.li1">DNI o Pasaporte del titular de la reserva y de todos los integrantes del grupo</li>
            <li data-i18n="acord.gar.li2">Completar la planilla de ingreso con datos personales</li>
            <li data-i18n="acord.gar.li3">Firma de contrato de locación temporal</li>
          </ul>
        </div>
      </div>

      <!-- 7. Formas de pago -->
      <div class="acord-item">
        <button class="acord-header" onclick="toggleAcord(this)">
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <span data-i18n="acord.pago.title">Formas de pago</span>
          </span>
          <svg class="acord-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="acord-body">
          <div class="acord-grid" style="grid-template-columns: repeat(3, 1fr); --acord-cols: 3;">
            <div class="acord-dato"><span class="acord-label" style="white-space:nowrap;" data-i18n="acord.pago.l1">Transferencia</span><span data-i18n="acord.pago.v1">CBU, CVU o Alias disponible al confirmar la reserva (bancos y billeteras virtuales)</span></div>
            <div class="acord-dato"><span class="acord-label" data-i18n="acord.pago.l2">Tarjeta de crédito / débito</span><span data-i18n="acord.pago.v2">Aceptamos tarjetas. Las tarjetas de crédito tienen recargo según la cantidad de cuotas. Consultar al reservar.</span></div>
            <div class="acord-dato"><span class="acord-label" data-i18n="acord.pago.l3">Efectivo</span><span data-i18n="acord.pago.v3">Pesos argentinos y dólares</span></div>
          </div>
        </div>
      </div>

    </div><!-- /acordeon -->

    <!-- Botón consultar al final -->
    <div style="text-align:center;margin-top:2rem;padding-top:1.75rem;border-top:1px solid var(--borde);">
      <p style="font-size:0.85rem;color:var(--texto-suave);margin-bottom:1rem;" data-i18n="info.cta.note">¿Ya leíste toda la información? Escribinos y te respondemos a la brevedad.</p>
      <a href="javascript:void(0)" onclick="abrirWsp(getMsgWsp('general'))"
         style="display:inline-flex;align-items:center;gap:0.6rem;background:#25D366;color:#fff;text-decoration:none;padding:0.75rem 2rem;border-radius:8px;font-family:'Nunito',sans-serif;font-size:0.85rem;font-weight:700;letter-spacing:0.04em;box-shadow:0 4px 16px rgba(37,211,102,0.3);transition:transform 0.25s,box-shadow 0.25s;"
         onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(37,211,102,0.4)'"
         onmouseout="this.style.transform='';this.style.boxShadow='0 4px 16px rgba(37,211,102,0.3)'">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span data-i18n="info.cta.btn">Consultar por WhatsApp</span>
      </a>
    </div>

  </div>
</section>

<section id="servicios" class="sec-crema-a">
  <div class="section-inner">
    <p class="section-label" data-i18n="serv.label">Lo que ofrecemos</p>
    <h2 class="section-title" data-i18n="serv.title">Nuestros servicios</h2>
    <div class="divider"></div>
    <div class="servicios-grid">
      <!-- Pileta -->
      <div class="servicio-item">
        <div class="servicio-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20M2 16c1.5 1.5 3.5 2 5 2s3.5-.5 5-2 3.5-2 5-2 3.5.5 5 2M7 12V7a5 5 0 0 1 10 0v5"/><circle cx="12" cy="4" r="1"/></svg></div>
        <p class="servicio-nombre" data-i18n="serv.pileta">Pileta</p>
        <p class="servicio-desc" data-i18n="serv.pileta.d">Compartida para todos los huéspedes</p>
      </div>
      <!-- Parque -->
      <div class="servicio-item">
        <div class="servicio-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12M12 12C12 12 8 9 8 5a4 4 0 0 1 8 0c0 4-4 7-4 7z"/><path d="M6 22v-4M6 18c0-2 2-4 2-4M18 22v-4M18 18c0-2-2-4-2-4"/></svg></div>
        <p class="servicio-nombre" data-i18n="serv.parque">Parque</p>
        <p class="servicio-desc" data-i18n="serv.parque.d">Amplio y verde</p>
      </div>
      <!-- Cochera -->
      <div class="servicio-item">
        <div class="servicio-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="22" height="18" rx="2"/><path d="M1 9h22M5 3v6M19 3v6"/><circle cx="8" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/><path d="M5 13h14l-1-4H6l-1 4z"/></svg></div>
        <p class="servicio-nombre" data-i18n="serv.cochera">Cochera</p>
        <p class="servicio-desc" data-i18n="serv.cochera.d">Techada y segura</p>
      </div>
      <!-- Asadores -->
      <div class="servicio-item">
        <div class="servicio-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="7"/><path d="M5.5 6.5 12 13M12 13l6.5-6.5M12 6V2"/><path d="M9 22h6"/><path d="M12 20v2"/></svg></div>
        <p class="servicio-nombre" data-i18n="serv.asadores">Asadores</p>
        <p class="servicio-desc" data-i18n="serv.asadores.d">Privado en cada cabaña</p>
      </div>
      <!-- Desayuno -->
      <div class="servicio-item">
        <div class="servicio-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg></div>
        <p class="servicio-nombre" data-i18n="serv.desayuno">Desayuno buffet</p>
        <p class="servicio-desc" data-i18n="serv.desayuno.d">Casero, de Celia</p>
      </div>
      <!-- WiFi -->
      <div class="servicio-item">
        <div class="servicio-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg></div>
        <p class="servicio-nombre">WiFi</p>
        <p class="servicio-desc" data-i18n="serv.wifi.d">Todo el complejo</p>
      </div>
      <!-- Aire acond. -->
      <div class="servicio-item">
        <div class="servicio-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="8" rx="2"/><path d="M7 11v4M12 11v4M17 11v4M5 19h14M7 15c0 2-1 4-2 4M17 15c0 2 1 4 2 4M12 15v4"/></svg></div>
        <p class="servicio-nombre" data-i18n="serv.ac">Aire acond.</p>
        <p class="servicio-desc" data-i18n="serv.ac.d">Frío y calor</p>
      </div>
      <!-- Limpieza -->
      <div class="servicio-item">
        <div class="servicio-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22v-4l9-9 4 4-9 9H3z"/><path d="m15 5 1.5-1.5a2.121 2.121 0 0 1 3 3L18 8l-3-3z"/><path d="M9.5 14.5 11 16"/></svg></div>
        <p class="servicio-nombre" data-i18n="serv.limpieza">Limpieza</p>
        <p class="servicio-desc" data-i18n="serv.limpieza.d">Servicio de mucamas</p>
      </div>
      <!-- El Algarrobo -->
      <div class="servicio-item">
        <div class="servicio-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12M12 12C12 7 7 4 7 4s1 5 5 8M12 12c0-5 5-8 5-8s-1 5-5 8"/><path d="M8 22h8"/></svg></div>
        <p class="servicio-nombre" data-i18n="serv.algarrobo">El Algarrobo</p>
        <p class="servicio-desc" data-i18n="serv.algarrobo.d">Espacio compartido bicentenario</p>
      </div>
      <!-- Juegos para niños -->
      <div class="servicio-item">
        <div class="servicio-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/><path d="M8 12h8"/></svg></div>
        <p class="servicio-nombre" data-i18n="serv.juegos">Juegos para niños</p>
        <p class="servicio-desc" data-i18n="serv.juegos.d">Para jugar y divertirse en familia</p>
      </div>
      <!-- Seguridad -->
      <div class="servicio-item">
        <div class="servicio-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
        <p class="servicio-nombre" data-i18n="serv.seguridad">Seguridad</p>
        <p class="servicio-desc" data-i18n="serv.seguridad.d">Rejas, alarma y cámaras</p>
      </div>
      <!-- Ropa blanca -->
      <div class="servicio-item">
        <div class="servicio-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6l9 6 9-6M3 6v12l9 6 9-6V6"/></svg></div>
        <p class="servicio-nombre" data-i18n="serv.ropa">Ropa blanca</p>
        <p class="servicio-desc" data-i18n="serv.ropa.d">Sábanas, toallas y toallones</p>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================ TESTIMONIOS -->
<section id="testimonios" class="sec-blanco">
  <div class="section-inner">

    <!-- Header con título izq + rating + flechas der -->
    <div class="test-header">
      <div class="test-header-left">
        <p class="section-label" data-i18n="test.label">Reseñas</p>
        <h2 class="section-title" data-i18n="test.title">Lo que dicen quienes nos visitaron</h2>
        <div class="divider" style="margin-bottom:0"></div>
      </div>
      <div style="display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap">
        <div class="rating-total">
          <div class="rating-num">5.0</div>
          <div>
            <span class="rating-stars">★★★★★</span>
            <span class="rating-label" data-i18n="test.rating">Reseñas verificadas · Alquiler Argentina</span>
          </div>
        </div>
        <div class="test-nav">
          <button class="test-arrow" id="test-prev" onclick="moverCarrusel(-1)" disabled aria-label="Anterior">&#8592;</button>
          <button class="test-arrow" id="test-next" onclick="moverCarrusel(1)" aria-label="Siguiente">&#8594;</button>
        </div>
      </div>
    </div>

    <!-- Carrusel -->
    <div class="test-viewport" id="testViewport">
      <div class="test-track" id="testTrack">

        <!-- Columna 1 -->
        <div class="test-col">
          <div class="test-card">
            <div class="stars">★★★★★</div>
            <p class="test-texto" data-i18n="test.r1">"Las cabañas son cómodas, el predio es grande. Es atendida por sus dueños, super amables."</p>
            <div class="test-autor"><div class="test-avatar">DM</div><div><p class="test-nombre">Dianela Melchiorre</p></div></div>
          </div>
          <div class="test-card">
            <div class="stars">★★★★★</div>
            <p class="test-texto" data-i18n="test.r5">"La cabaña estaba impecable, bien equipada y muy cómoda. El trato de los dueños hace la diferencia — te sentís en casa desde que llegás."</p>
            <div class="test-autor"><div class="test-avatar">LG</div><div><p class="test-nombre">Lucas Giménez</p></div></div>
          </div>
        </div>

        <!-- Columna 2 -->
        <div class="test-col">
          <div class="test-card">
            <div class="stars">★★★★★</div>
            <p class="test-texto" data-i18n="test.r2">"Un lugar hermoso, para ir caminando a Playas de Oro. Las cabañas con vista a la pileta, muy cómodas. El desayuno casero de Celia: 10 puntos. Volveríamos sin dudas."</p>
            <div class="test-autor"><div class="test-avatar">DM</div><div><p class="test-nombre">Daiana Magnago</p></div></div>
          </div>
          <div class="test-card">
            <div class="stars">★★★★★</div>
            <p class="test-texto" data-i18n="test.r6">"Hermoso lugar, tranquilo y a pasos del río. El desayuno buffet es lo mejor — casero y abundante. Lo recomiendo a todos los que quieran descansar de verdad."</p>
            <div class="test-autor"><div class="test-avatar">SC</div><div><p class="test-nombre">Sofía Carreras</p></div></div>
          </div>
        </div>

        <!-- Columna 3 -->
        <div class="test-col">
          <div class="test-card">
            <div class="stars">★★★★★</div>
            <p class="test-texto" data-i18n="test.r3">"Excelente atención del personal, siempre dispuesto a ayudar. El complejo está muy bien cuidado y la ubicación es ideal para disfrutar las sierras."</p>
            <div class="test-autor"><div class="test-avatar">MR</div><div><p class="test-nombre">Marcela Roldán</p></div></div>
          </div>
          <div class="test-card">
            <div class="stars">★★★★★</div>
            <p class="test-texto" data-i18n="test.r7">"Muy buena experiencia. El lugar limpio, ordenado y la atención personalizada. Se nota que los dueños disfrutan recibir a la gente."</p>
            <div class="test-autor"><div class="test-avatar">JV</div><div><p class="test-nombre">Jorge Villalba</p></div></div>
          </div>
        </div>

        <!-- Columna 4 -->
        <div class="test-col">
          <div class="test-card">
            <div class="stars">★★★★★</div>
            <p class="test-texto" data-i18n="test.r4">"Fuimos con toda la familia y quedamos encantados. Los chicos disfrutaron muchísimo la pileta y el parque. Sin dudas volvemos el año que viene."</p>
            <div class="test-autor"><div class="test-avatar">FP</div><div><p class="test-nombre">Familia Peralta</p></div></div>
          </div>
          <div class="test-card">
            <div class="stars">★★★★★</div>
            <p class="test-texto" data-i18n="test.r8">"Primera vez que íbamos y ya queremos volver. El río está a dos pasos, la pileta genial y la atención del complejo es increíble. ¡100% recomendable!"</p>
            <div class="test-autor"><div class="test-avatar">AG</div><div><p class="test-nombre">Andrea Godoy</p></div></div>
          </div>
        </div>

        <!-- Columna 5 — visible al deslizar una vez -->
        <div class="test-col">
          <div class="test-card">
            <div class="stars">★★★★★</div>
            <p class="test-texto" data-i18n="test.r9">"El desayuno de Celia no tiene comparación. Rico, abundante y con mucho cariño. El resto del complejo está a la misma altura: impecable."</p>
            <div class="test-autor"><div class="test-avatar">NB</div><div><p class="test-nombre">Natalia Bustos</p></div></div>
          </div>
          <div class="test-card">
            <div class="stars">★★★★★</div>
            <p class="test-texto" data-i18n="test.r10">"Lugar tranquilo, verde y bien ubicado. La cabaña tenía todo lo necesario y el trato fue siempre excelente. Volvemos seguro."</p>
            <div class="test-autor"><div class="test-avatar">RM</div><div><p class="test-nombre">Rodrigo Medina</p></div></div>
          </div>
        </div>

      </div><!-- /test-track -->
    </div><!-- /test-viewport -->

    <!-- Links a plataformas externas -->
    <div style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--borde);text-align:center;">
      <p style="font-size:0.7rem;color:var(--texto-suave);margin-bottom:0.9rem;letter-spacing:0.08em;text-transform:uppercase;font-weight:700;" data-i18n="test.plat">También nos encontrás en</p>
      <div class="platform-links">
        <a class="platform-link"
           href="https://www.google.com/maps/search/Brisas+de+Oro+Hotel+y+Caba%C3%B1as+Villa+Carlos+Paz"
           target="_blank" rel="noopener">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
          Google Maps
        </a>
        <a class="platform-link"
           href="https://www.alquilerargentina.com/alojamientos/aw75-Caba%C3%B1a-Hotel-y-Caba%C3%B1as-Brisas-de-Oro-Villa-Carlos-Paz.html"
           target="_blank" rel="noopener">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Alquiler Argentina
        </a>
        <a class="platform-link"
           href="https://www.welcomeargentina.com/villacarlospaz/cabanas-brisas-de-oro.html"
           target="_blank" rel="noopener">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Welcome Argentina
        </a>
      </div>
    </div>

  </div>
</section>

<!-- ============================================================ CLIMA -->
<section id="clima" class="clima-seccion" style="padding:5.5rem 5%">
  <div class="section-inner">
    <div class="clima-header">
      <p class="section-label" data-i18n="clima.label">Villa Carlos Paz · Sierras de Córdoba</p>
      <h2 class="section-title" data-i18n="clima.title">Clima para tu viaje</h2>
      <div class="divider" style="margin:0.9rem auto 1.8rem"></div>
      <p style="font-size:0.9rem;color:var(--texto-suave);max-width:700px;margin:0 auto;line-height:1.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
        <span data-i18n="clima.desc">Consultá el pronóstico antes de preparar tu equipaje. Datos en tiempo real, actualizados automáticamente.</span>
      </p>
    </div>

    <!-- Contenedor principal -->
    <div id="clima-container">
      <div class="clima-loading">
        <span style="font-size:1.5rem;display:block;margin-bottom:0.5rem">⛅</span>
        Cargando el clima de Villa Carlos Paz...
      </div>
    </div>

    <p class="clima-footer-note" data-i18n="clima.note">Datos provistos por Tomorrow.io · Actualizado automáticamente</p>
  </div>
</section>

<!-- ============================================================ UBICACIÓN -->
<section id="ubicacion" class="sec-blanco">
  <div class="ubicacion-grid">
    <div>
      <p class="section-label" data-i18n="ubic.label">Dónde estamos</p>
      <h2 class="section-title" data-i18n="ubic.title">En plena avenida,<br>rodeados de naturaleza</h2>
      <div class="divider"></div>
      <p style="color:var(--texto-medio);font-size:0.91rem;line-height:1.85;margin-bottom:1rem;margin-top:-0.6rem;" data-i18n="ubic.desc">Ubicados sobre una de las avenidas principales de Villa Carlos Paz, con las sierras como horizonte y el río a pocos pasos.</p>
      <p style="display:flex;align-items:center;gap:0.5rem;font-size:0.82rem;font-weight:600;margin-bottom:1.4rem;">
        <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
          <path d="M5.5 0C2.46 0 0 2.46 0 5.5C0 9.625 5.5 14 5.5 14C5.5 14 11 9.625 11 5.5C11 2.46 8.54 0 5.5 0ZM5.5 7.5C4.395 7.5 3.5 6.605 3.5 5.5C3.5 4.395 4.395 3.5 5.5 3.5C6.605 3.5 7.5 4.395 7.5 5.5C7.5 6.605 6.605 7.5 5.5 7.5Z" fill="var(--oro)"/>
        </svg>
        <a href="https://www.google.com/maps/search/Av.+Ram%C3%B3n+J.+C%C3%A1rcano+2590+Villa+Carlos+Paz" target="_blank"
           style="color:var(--oro);text-decoration:none;border-bottom:1px solid rgba(184,152,42,0.3);transition:color 0.25s;"
           onmouseover="this.style.color='var(--oro-hover)'" onmouseout="this.style.color='var(--oro)'">
          Av. Ramón J. Cárcano 2590, X5152 Villa Carlos Paz
        </a>
      </p>
      <ul class="dist-list">
        <li>
          <!-- Ícono: sol / playa -->
          <span class="dist-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          </span>
          <div class="dist-text">
            <strong data-i18n="ubic.d1a">1 cuadra</strong>
            <span data-i18n="ubic.d1b">Balneario Playas de Oro</span>
          </div>
        </li>
        <li>
          <!-- Ícono: edificios / ciudad -->
          <span class="dist-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 7l9-4 9 4M4 21V7M20 21V7M9 21v-4h6v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/></svg>
          </span>
          <div class="dist-text">
            <strong data-i18n="ubic.d3a">Aprox. 20–25 cuadras</strong>
            <span data-i18n="ubic.d3b">Centro de Villa Carlos Paz</span>
          </div>
        </li>
        <li>
          <!-- Ícono: avión -->
          <span class="dist-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
          </span>
          <div class="dist-text">
            <strong data-i18n="ubic.d4a">40 minutos</strong>
            <span data-i18n="ubic.d4b">Aeropuerto Internacional de Córdoba</span>
          </div>
        </li>
      </ul>
    </div>
    <!-- Google Maps embed — Av. Ramón J. Cárcano 2590, Villa Carlos Paz -->
    <div style="height:420px;border-radius:10px;overflow:hidden;border:1px solid var(--borde);flex-shrink:0;">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.8!2d-64.4872!3d-31.4285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942d6b4c8b1e2a3d%3A0x0!2sAv.+Ram%C3%B3n+J.+C%C3%A1rcano+2590%2C+X5152+Villa+Carlos+Paz%2C+C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1"
        width="100%" height="100%"
        style="border:0;display:block;"
        allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Hotel y Cabañas Brisas de Oro — Av. Ramón J. Cárcano 2590, Villa Carlos Paz">
      </iframe>
    </div>
  </div>
</section>
<div class="cta-banner">
  <h2 data-i18n="cta.title">¿Listo para reservar tus vacaciones?</h2>
  <p data-i18n="cta.sub">Escribinos directo por WhatsApp <span class="mobile-break">y te respondemos al instante.</span></p>
  <a href="javascript:void(0)" onclick="abrirWsp(getMsgWsp('general'))" class="btn-cta-wsp" data-i18n="cta.btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Consultar por WhatsApp
        </a>
</div>

<!-- ============================================================ FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-grid">
      <div>
        <p class="footer-logo">Hotel y Cabañas Brisas de Oro<span>Villa Carlos Paz · Córdoba · Argentina</span></p>
        <p class="footer-desc" data-i18n="footer.desc">Complejo familiar atendido por sus dueños, donde el trato personalizado y el clima hogareño hacen que cada huésped se sienta en casa. Rodeados de las sierras cordobesas y a orillas del río San Antonio.</p>

      </div>
      <div class="footer-col">
        <h4 data-i18n="footer.aloj">Alojamientos</h4>
        <ul>
          <li data-i18n="footer.a1">Cabaña chica</li>
          <li data-i18n="footer.a2">Cabaña mediana</li>
          <li data-i18n="footer.a3">Cabaña grande</li>
          <li data-i18n="footer.a4">Habitaciones de hotel</li>
          <li data-i18n="footer.a5">Apart Hotel</li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer.info">Información</h4>
        <ul>
          <li data-i18n="footer.checkin">Check-in: 13:00 hs</li>
          <li data-i18n="footer.checkout">Check-out: 10:00 hs</li>
          <li>
            <a href="https://wa.me/543541548053" target="_blank"
               style="color:var(--footer-text);opacity:0.7;text-decoration:none;display:flex;align-items:center;gap:0.4rem;transition:color 0.25s,opacity 0.25s;"
               onmouseover="this.style.color='var(--oro)';this.style.opacity='1'"
               onmouseout="this.style.color='';this.style.opacity='0.7'">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              3541-548053
            </a>
          </li>
          <li>
            <a href="https://www.google.com/maps/search/Av.+Ram%C3%B3n+J.+C%C3%A1rcano+2590+Villa+Carlos+Paz"
               target="_blank"
               style="color:var(--footer-text);opacity:0.7;text-decoration:none;display:flex;align-items:center;gap:0.4rem;transition:color 0.25s,opacity 0.25s;"
               onmouseover="this.style.color='var(--oro)';this.style.opacity='1'"
               onmouseout="this.style.color='';this.style.opacity='0.7'">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
              Av. Ramón J. Cárcano 2590
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/brisasdeoro" target="_blank"
               style="color:var(--footer-text);opacity:0.7;text-decoration:none;display:flex;align-items:center;gap:0.4rem;transition:color 0.25s,opacity 0.25s;"
               onmouseover="this.style.color='var(--oro)';this.style.opacity='1'"
               onmouseout="this.style.color='';this.style.opacity='0.7'">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              @brisasdeoro
            </a>
          </li>
          <li>
            <a href="mailto:brisasdeoro@gmail.com"
               style="color:var(--footer-text);opacity:0.7;text-decoration:none;display:flex;align-items:center;gap:0.4rem;transition:color 0.25s,opacity 0.25s;"
               onmouseover="this.style.color='var(--oro)';this.style.opacity='1'"
               onmouseout="this.style.color='';this.style.opacity='0.7'">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
              brisasdeoro@gmail.com
            </a>
          </li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>También en</h4>
        <div style="display:flex;flex-direction:column;gap:0.45rem;">
          <a class="platform-link dark"
             href="https://www.google.com/maps/search/Brisas+de+Oro+Hotel+y+Caba%C3%B1as+Villa+Carlos+Paz"
             target="_blank" rel="noopener">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
            Google Maps
          </a>
          <a class="platform-link dark"
             href="https://www.alquilerargentina.com/alojamientos/aw75-Caba%C3%B1a-Hotel-y-Caba%C3%B1as-Brisas-de-Oro-Villa-Carlos-Paz.html"
             target="_blank" rel="noopener">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Alquiler Argentina
          </a>
          <a class="platform-link dark"
             href="https://www.welcomeargentina.com/villacarlospaz/cabanas-brisas-de-oro.html"
             target="_blank" rel="noopener">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Welcome Argentina
          </a>
        </div>
      </div>
    </div>
    <hr class="footer-divider">
    <div class="footer-bottom" style="justify-content:center;text-align:center;">
      <p>© 2025 Hotel y Cabañas Brisas de Oro · Villa Carlos Paz, Córdoba, Argentina</p>
    </div>
  </div>
</footer>

<!-- ============================================================ JS -->
<a class="wsp-float"
   href="javascript:void(0)"
   onclick="abrirWsp(getMsgWsp('general'))"
   aria-label="Contactar por WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>

<div id="fecha-toast">La fecha ingresada no es válida.<br>Seleccioná una fecha a partir del día de hoy.</div>
    `}} />
  )
}
