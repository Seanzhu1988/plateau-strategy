# -*- coding: utf-8 -*-
"""Destination Book content, translated.

The chrome around this page was translated months ago; the page itself never
was. A Chinese reader opened the Destination Book and found Chinese buttons
wrapped around 85 English paragraphs — every description, every tip. That is
not a translation with problems, it is a page that was never translated, and
it is the flagship free tool.

Keyed by PLACE NAME rather than by the English sentence, and matched against
destinations.json at build time. Retyping 85 English paragraphs to use as
dictionary keys would guarantee a typo somewhere, and a key that is one
character out silently does nothing.

Order is always [zh, es, ko, vi].

Register: a guidebook, not a brochure. Concrete, warm, and short enough to
read standing up. Place names stay in English — they are what the sign says
and what a traveller has to ask for.
"""

PLACES = {
"Times Square": {
 "desc": ["世界的霓虹十字路口——巨幅电子广告牌、百老汇剧院招牌，还有全天不散的街头艺人。",
  "El cruce de neón del mundo: pantallas gigantes, marquesinas de Broadway y artistas callejeros a cualquier hora.",
  "세계의 네온 교차로 — 거대한 전광판, 브로드웨이 극장 간판, 그리고 밤낮없는 거리 공연자들.",
  "Ngã tư neon của thế giới — màn hình quảng cáo khổng lồ, bảng hiệu Broadway và nghệ sĩ đường phố suốt ngày đêm."],
 "tip": ["天黑之后最好看，灯自己会说话。钱包放前口袋。",
  "Mejor de noche, cuando las luces hacen el trabajo. Lleva la cartera en el bolsillo delantero.",
  "해가 진 뒤가 제일 좋습니다. 지갑은 앞주머니에.",
  "Đẹp nhất sau khi trời tối, khi đèn tự lên tiếng. Để ví ở túi trước."]},

"Central Park": {
 "desc": ["曼哈顿正中央 843 英亩的湖泊、草坪与林地。贝塞斯达平台、弓桥和林荫大道连成经典一圈。",
  "343 hectáreas de lagos, praderas y bosque en mitad de Manhattan. Bethesda Terrace, Bow Bridge y el Mall forman el circuito clásico.",
  "맨해튼 한복판의 843에이커 호수와 잔디, 숲. 베데스다 테라스, 보 브리지, 더 몰이 고전적인 코스를 만듭니다.",
  "343 ha hồ, thảm cỏ và rừng giữa lòng Manhattan. Bethesda Terrace, Bow Bridge và The Mall làm nên vòng đi kinh điển."],
 "tip": ["天暖时可以在 Loeb 船屋租一条划艇。",
  "En los meses cálidos alquila una barca en el Loeb Boathouse.",
  "따뜻한 계절에는 로브 보트하우스에서 노 젓는 배를 빌릴 수 있습니다.",
  "Mùa ấm có thể thuê thuyền chèo ở Loeb Boathouse."]},

"The Met Museum": {
 "desc": ["世界顶级博物馆之一——五千年的艺术，包括一座完整搬进玻璃厅的埃及神庙。",
  "Uno de los grandes museos del mundo: 5.000 años de arte, incluido un templo egipcio completo bajo un techo de cristal.",
  "세계 최고의 미술관 중 하나 — 5,000년의 예술, 유리 홀에 통째로 옮겨진 이집트 신전까지.",
  "Một trong những bảo tàng lớn nhất thế giới — 5.000 năm nghệ thuật, có cả một ngôi đền Ai Cập nguyên vẹn trong sảnh kính."],
 "tip": ["周五、周六延长开放；应季时屋顶能看天际线。",
  "Viernes y sábado abre hasta tarde; en temporada la azotea tiene vistas al skyline.",
  "금·토는 늦게까지 엽니다. 시즌에는 옥상에서 스카이라인이 보입니다.",
  "Thứ Sáu và thứ Bảy mở muộn; đúng mùa thì sân thượng nhìn ra toàn cảnh thành phố."]},

"Empire State Building": {
 "desc": ["天际线上的装饰艺术地标。86 层露天观景台，看的是最经典的那个纽约。",
  "El icono art déco del skyline. La terraza al aire libre del piso 86 ofrece la vista clásica de Nueva York.",
  "스카이라인의 아르데코 상징. 86층 야외 전망대에서 보는 풍경이 뉴욕의 정석입니다.",
  "Biểu tượng art-deco của đường chân trời. Đài quan sát lộ thiên tầng 86 cho tầm nhìn New York kinh điển."],
 "tip": ["黄昏时上去，看着这座城市一盏一盏亮起来。",
  "Sube al atardecer y mira cómo la ciudad enciende sus luces.",
  "해 질 무렵에 올라가 도시가 하나씩 불을 켜는 걸 보세요.",
  "Lên lúc hoàng hôn để xem thành phố lần lượt bật đèn."]},

"Brooklyn Bridge": {
 "desc": ["走上这座 1883 年建成的桥的木栈道——看曼哈顿天际线，最好的免费位置。",
  "Camina por el paseo de madera del puente de 1883: la mejor vista gratuita del skyline de Manhattan.",
  "1883년에 놓인 다리의 나무 보행로를 걸어 보세요 — 맨해튼 스카이라인을 보는 가장 좋은 무료 자리입니다.",
  "Đi bộ trên lối gỗ của cây cầu năm 1883 — chỗ ngắm đường chân trời Manhattan đẹp nhất mà không mất tiền."],
 "tip": ["从布鲁克林一侧起步，朝着天际线走。",
  "Empieza por el lado de Brooklyn y camina hacia el skyline.",
  "브루클린 쪽에서 출발해 스카이라인을 향해 걸으세요.",
  "Bắt đầu từ phía Brooklyn và đi về hướng đường chân trời."]},

"9/11 Memorial & Museum": {
 "desc": ["两座反射池落在原塔的地基上；地下的博物馆用遗物和声音把那天讲完。",
  "Dos estanques reflectantes sobre las huellas de las torres; abajo, el museo cuenta la historia con objetos y voces.",
  "쌍둥이 빌딩이 서 있던 자리에 놓인 두 개의 반사 연못. 지하 박물관이 유품과 목소리로 그날을 전합니다.",
  "Hai hồ nước phản chiếu đặt đúng nền hai tòa tháp; bảo tàng bên dưới kể lại bằng hiện vật và giọng nói."],
 "tip": ["室外纪念区免费，开放到很晚；博物馆需要预约分时票。",
  "El memorial exterior es gratuito y abre hasta tarde; el museo requiere entrada con hora.",
  "야외 추모 공간은 무료이고 늦게까지 엽니다. 박물관은 시간 지정 티켓이 필요합니다.",
  "Khu tưởng niệm ngoài trời miễn phí và mở muộn; bảo tàng cần vé theo khung giờ."]},

"The High Line": {
 "desc": ["废弃货运铁路改成的空中花园步道，从 Gansevoort 街一直走到 34 街，沿途是哈德逊河景和公共艺术。",
  "Una vía de carga convertida en paseo-jardín elevado, de Gansevoort a la calle 34, con vistas al Hudson y arte público.",
  "화물 철로가 고가 정원 산책로로 되살아났습니다. 갠스부트가에서 34번가까지, 허드슨강 풍경과 공공미술이 함께합니다.",
  "Tuyến đường sắt chở hàng hồi sinh thành lối đi vườn trên cao, từ phố Gansevoort tới phố 34, có sông Hudson và nghệ thuật công cộng."],
 "tip": ["从南端进，出来正好是 Chelsea Market，午饭就地解决。",
  "Entra por el extremo sur y sal directamente al Chelsea Market para comer.",
  "남쪽 끝으로 들어가 첼시 마켓 쪽으로 나오면 바로 점심입니다.",
  "Vào từ đầu phía nam rồi ra thẳng Chelsea Market ăn trưa."]},

"Grand Central Terminal": {
 "desc": ["一座学院派风格的交通殿堂——青绿色的星空穹顶，问询处上方那只四面蛋白石钟。",
  "Una catedral beaux-arts del transporte: el techo celeste turquesa y el reloj de ópalo de cuatro caras sobre el mostrador de información.",
  "보자르 양식의 교통 대성당 — 청록빛 천체 천장과 안내소 위 네 면 오팔 시계.",
  "Một thánh đường giao thông kiểu beaux-arts — trần sao màu xanh ngọc và chiếc đồng hồ opal bốn mặt trên quầy thông tin."],
 "tip": ["去 Oyster Bar 门外斜坡上试试那个「回声角」。",
  "Prueba la galería de los susurros en la rampa junto al Oyster Bar.",
  "오이스터 바 앞 경사로의 '속삭이는 회랑'을 시험해 보세요.",
  "Thử 'hành lang thì thầm' ở dốc bên ngoài Oyster Bar."]},

"Statue of Liberty ferry": {
 "desc": ["从炮台公园开往自由岛与埃利斯岛的渡轮——近看自由女神，再逛移民博物馆。",
  "Ferris desde Battery Park a las islas Liberty y Ellis: la estatua de cerca y el museo de la inmigración.",
  "배터리 파크에서 리버티섬과 엘리스섬으로 가는 페리 — 자유의 여신상을 가까이서, 그리고 이민 박물관까지.",
  "Phà từ Battery Park ra đảo Liberty và Ellis — nhìn tượng thật gần và ghé bảo tàng nhập cư."],
 "tip": ["订当天第一班；登冠票提前数周就卖光，末班登船在下午。",
  "Reserva el primer barco del día; el acceso a la corona se agota semanas antes y el último embarque es a media tarde.",
  "그날 첫 배로 예약하세요. 왕관 입장은 몇 주 전에 매진되고, 마지막 승선은 오후 중반입니다.",
  "Đặt chuyến đầu tiên trong ngày; vé lên vương miện hết trước hàng tuần, chuyến cuối lên tàu vào giữa chiều."]},

"Chelsea Market": {
 "desc": ["老纳贝斯克饼干厂改成的一整条街的美食大厅——塔可、龙虾卷、甜甜圈，三十五家摊位。",
  "Un mercado de comida de una manzana entera en la antigua fábrica Nabisco: tacos, rolls de langosta, donuts y treinta y cinco puestos.",
  "옛 나비스코 공장을 통째로 쓰는 한 블록짜리 푸드홀 — 타코, 랍스터롤, 도넛, 서른다섯 개 가게.",
  "Khu ẩm thực dài cả dãy phố trong nhà máy Nabisco cũ — taco, bánh mì tôm hùm, bánh donut và ba mươi lăm quầy."],
 "tip": ["工作日上午清静，周末下午挤得动不了。",
  "Las mañanas entre semana están tranquilas; las tardes de fin de semana son un agobio.",
  "평일 오전은 한산하고, 주말 오후는 발 디딜 틈이 없습니다.",
  "Sáng ngày thường thì vắng; chiều cuối tuần thì chen chân không lọt."]},

"Katz's Delicatessen": {
 "desc": ["1888 年开到今天的熟食店，黑麦面包夹手切熏牛肉的标准就是从这儿定下的。",
  "La charcutería de 1888 que definió el pastrami en pan de centeno, cortado a mano en el mostrador.",
  "1888년부터 이어온 델리. 호밀빵 파스트라미의 기준을 만든 집이고, 카운터에서 손으로 썰어 줍니다.",
  "Tiệm deli từ năm 1888 định ra chuẩn mực pastrami kẹp bánh mì lúa mạch, thái tay ngay tại quầy."],
 "tip": ["进门拿的那张单子千万别丢——出门时凭它结账。",
  "Coge el tique en la puerta y no lo pierdas: pagas al salir.",
  "문에서 받은 표를 잃어버리지 마세요 — 나갈 때 그걸로 계산합니다.",
  "Cầm phiếu ở cửa và đừng làm mất — lúc ra mới thanh toán."]},

"Joe's Pizza": {
 "desc": ["1975 年至今的纽约切片标准——薄、烫，站着对折了吃。",
  "La referencia de la porción neoyorquina desde 1975: fina, caliente y comida doblada, de pie.",
  "1975년부터 뉴욕 조각 피자의 기준 — 얇고 뜨겁고, 서서 반 접어 먹습니다.",
  "Chuẩn mực miếng pizza New York từ 1975 — mỏng, nóng, gập đôi và ăn đứng."]},

"Grand Central Oyster Bar": {
 "desc": ["1913 年开业，在中央车站肚子里，瓜斯塔维诺拱砖顶下吃生蚝。",
  "Ostras bajo bóvedas de azulejo Guastavino desde 1913, en las entrañas de Grand Central.",
  "1913년부터 그랜드센트럴 지하, 과스타비노 타일 아치 아래에서 굴을 냅니다.",
  "Hàu dưới vòm gạch Guastavino từ năm 1913, nằm trong lòng ga Grand Central."],
 "tip": ["坐吧台，那才是这里原本的吃法。",
  "Siéntate en la barra: es la experiencia clásica.",
  "카운터에 앉는 것이 정석입니다.",
  "Ngồi quầy mới đúng kiểu."]},

"Levain Bakery": {
 "desc": ["那块六盎司重的核桃巧克力曲奇就出自这里——温热，中间半流心，值得排队。",
  "La cuna de la galleta de 170 g con nueces y chocolate: caliente, medio fundida por dentro, merece la cola.",
  "170그램짜리 초콜릿 호두 쿠키의 본가 — 따뜻하고 가운데가 반쯤 녹아 있어, 줄 설 값을 합니다.",
  "Nơi khai sinh chiếc bánh quy sô-cô-la óc chó 170 g — nóng, giữa còn chảy, đáng để xếp hàng."]},

"Stone Street": {
 "desc": ["金融区里一条铺鹅卵石的小街，两旁是酒馆和露天桌子——曼哈顿最老的街道之一。",
  "Una callejuela adoquinada de pubs y mesas al aire libre en el distrito financiero: de las calles más antiguas de Manhattan.",
  "금융가 한복판의 자갈길. 펍과 야외 테이블이 늘어선, 맨해튼에서 가장 오래된 거리 중 하나입니다.",
  "Con phố lát đá cuội đầy quán bia và bàn ngoài trời trong khu tài chính — một trong những phố cổ nhất Manhattan."],
 "tip": ["夏天的傍晚，整条街就是一个露天餐厅。",
  "En las tardes de verano toda la calle se convierte en un comedor al aire libre.",
  "여름 저녁이면 거리 전체가 하나의 야외 식당이 됩니다.",
  "Chiều hè cả con phố biến thành một phòng ăn ngoài trời."]},

"Lincoln Memorial": {
 "desc": ["倒影池尽头端坐的林肯——北墙上刻着第二次就职演说，值得读完。",
  "El Lincoln sentado sobre el Reflecting Pool: lee el Segundo Discurso Inaugural tallado en el muro norte.",
  "리플렉팅 풀 너머 앉아 있는 링컨 — 북쪽 벽에 새겨진 두 번째 취임 연설을 읽어 보세요.",
  "Tượng Lincoln ngồi phía trên hồ Reflecting Pool — hãy đọc bài diễn văn nhậm chức thứ hai khắc trên tường bắc."],
 "tip": ["全天开放；清晨和入夜后最安静，也最好看。",
  "Abierto las 24 horas; el amanecer y la noche son las horas tranquilas y hermosas.",
  "24시간 개방입니다. 해 뜰 무렵과 밤이 조용하고 아름답습니다.",
  "Mở cửa 24 giờ; lúc bình minh và sau khi trời tối là đẹp và yên nhất."]},

"Washington Monument": {
 "desc": ["国家广场正中那座 555 英尺的方尖碑；坐电梯上去，是全城唯一的 360 度视野。",
  "El obelisco de 169 metros en el centro del Mall; el ascensor a la cima da la única vista de 360° de la ciudad.",
  "내셔널 몰 한가운데 169미터 오벨리스크. 꼭대기 엘리베이터에서만 도시를 360도로 볼 수 있습니다.",
  "Đài tháp cao 169 m giữa National Mall; thang máy lên đỉnh cho tầm nhìn 360° duy nhất của thành phố."],
 "tip": ["当日票很早就没了——能提前一个月在网上订最好。",
  "Las entradas del día vuelan: reserva online con un mes de antelación si puedes.",
  "당일권은 일찍 동납니다 — 가능하면 한 달 전에 온라인으로 예약하세요.",
  "Vé trong ngày hết rất sớm — nếu được thì đặt online trước một tháng."]},

"Air & Space Museum": {
 "desc": ["莱特飞行者号、阿波罗 11 号指令舱，还有一块可以伸手摸的月岩——史密森学会人气最高的一馆。",
  "El Wright Flyer, el módulo de mando del Apolo 11 y una roca lunar que se puede tocar: el museo más popular del Smithsonian.",
  "라이트 플라이어, 아폴로 11호 사령선, 그리고 손으로 만질 수 있는 월석 — 스미스소니언에서 가장 인기 있는 곳입니다.",
  "Máy bay Wright Flyer, khoang chỉ huy Apollo 11 và một mẩu đá mặt trăng bạn được chạm vào — bảo tàng đông khách nhất của Smithsonian."],
 "tip": ["免费，但要分时入场券——出发前就订好。",
  "Gratis, pero hace falta pase con hora: resérvalo antes del viaje.",
  "무료지만 시간 지정 입장권이 필요합니다 — 여행 전에 예약하세요.",
  "Miễn phí, nhưng cần vé theo khung giờ — đặt trước khi đi."]},

"Museum of American History": {
 "desc": ["那面《星条旗》原件、林肯的高礼帽、历任第一夫人的礼服——美国的阁楼，免费进。",
  "La bandera del Star-Spangled Banner, el sombrero de copa de Lincoln y los vestidos de las primeras damas: el desván de América, y la entrada es gratis.",
  "성조기 원본, 링컨의 실크햇, 역대 영부인들의 드레스 — 미국의 다락방이고, 입장은 무료입니다.",
  "Lá cờ Star-Spangled Banner nguyên bản, mũ chóp cao của Lincoln và váy các đệ nhất phu nhân — gác xép của nước Mỹ, vào cửa miễn phí."]},

"National Gallery of Art": {
 "desc": ["美洲唯一一幅达·芬奇真迹在这里，还有维米尔、莫奈，以及一座雕塑花园。",
  "El único cuadro de Leonardo da Vinci en América, más Vermeer, Monet y un jardín de esculturas.",
  "아메리카 대륙에 있는 유일한 다빈치 회화, 그리고 페르메이르와 모네, 조각 정원까지.",
  "Bức tranh Leonardo da Vinci duy nhất ở châu Mỹ, cùng Vermeer, Monet và một vườn điêu khắc."],
 "tip": ["连接两馆的那条灯光通道本身就是一件作品。",
  "El pasillo iluminado entre las dos alas es en sí mismo una obra de arte.",
  "두 관을 잇는 조명 통로 자체가 하나의 작품입니다.",
  "Hành lang ánh sáng nối hai cánh bảo tàng bản thân nó đã là một tác phẩm."]},

"US Capitol Visitor Center": {
 "desc": ["导览从地下游客中心出发，穿过地下室、圆形大厅和雕像厅。",
  "Las visitas salen del centro de visitantes subterráneo y recorren la Cripta, la Rotonda y el Salón de las Estatuas.",
  "지하 방문자 센터에서 출발해 크립트, 로툰다, 조각상 홀을 도는 투어입니다.",
  "Tour khởi hành từ trung tâm khách tham quan dưới lòng đất, qua Hầm mộ, Sảnh tròn và Sảnh Tượng."],
 "tip": ["通过您所在州参议员办公室订免费导览，团更小。",
  "Reserva la visita gratuita por la oficina de tu senador: los grupos son más pequeños.",
  "상원의원 사무실을 통해 무료 투어를 예약하면 인원이 적습니다.",
  "Đặt tour miễn phí qua văn phòng thượng nghị sĩ của bạn để đi nhóm nhỏ hơn."]},

"White House (Lafayette Sq)": {
 "desc": ["从拉法叶广场看过去的经典北立面。公众参观是有的，但要提前数周通过国会议员申请。",
  "La vista clásica de la fachada norte desde Lafayette Square. Hay visitas públicas, pero se solicitan por el Congreso con semanas de antelación.",
  "라파예트 광장에서 보는 북쪽 정면이 정석입니다. 일반 견학도 있지만 몇 주 전 의회를 통해 신청해야 합니다.",
  "Góc nhìn mặt bắc kinh điển từ Quảng trường Lafayette. Có tour cho công chúng nhưng phải xin qua Quốc hội trước nhiều tuần."]},

"Jefferson Memorial": {
 "desc": ["潮汐湖畔的圆顶纪念堂，四周的樱花约在三月底一齐炸开。",
  "La rotonda con cúpula junto al Tidal Basin, rodeada de cerezos que estallan en flor a finales de marzo.",
  "타이들 베이슨 가의 돔 기념관. 3월 말이면 둘러싼 벚나무가 한꺼번에 터집니다.",
  "Nhà tưởng niệm mái vòm bên hồ Tidal Basin, vây quanh là hàng anh đào bung nở cuối tháng Ba."],
 "tip": ["沿潮汐湖走一圈，顺路把马丁·路德·金和罗斯福两处纪念碑一并看了。",
  "Da la vuelta al Tidal Basin y aprovecha para ver los memoriales de MLK y FDR.",
  "타이들 베이슨을 한 바퀴 돌면 MLK와 FDR 기념관까지 함께 볼 수 있습니다.",
  "Đi hết vòng hồ Tidal Basin để ghé luôn đài tưởng niệm MLK và FDR."]},

"Georgetown Waterfront": {
 "desc": ["河岸餐厅与河景，坡上是 M 街的店铺和联邦式排屋。",
  "Restaurantes junto al puerto y vistas al río, con las tiendas de M Street y las casas federales cuesta arriba.",
  "강가 식당과 강 풍경, 언덕 위로는 M 스트리트의 상점과 연방양식 연립주택.",
  "Nhà hàng ven bến và cảnh sông, lên dốc là các cửa hiệu phố M và dãy nhà kiểu Federal."]},

"Arlington National Cemetery": {
 "desc": ["美国最庄严的一片土地——肯尼迪墓与无名战士墓都在这里。",
  "El suelo más sagrado de Estados Unidos: la tumba de Kennedy y la del Soldado Desconocido.",
  "미국에서 가장 엄숙한 땅 — 케네디 묘와 무명용사의 묘가 여기 있습니다.",
  "Mảnh đất trang nghiêm nhất nước Mỹ — mộ Kennedy và mộ Chiến sĩ Vô danh."],
 "tip": ["算好换岗时间去看——整点一次，夏天半小时一次。",
  "Calcula tu visita para el Cambio de Guardia: cada hora en punto, cada media hora en verano.",
  "위병 교대식 시간에 맞춰 가세요 — 매시 정각, 여름에는 30분마다.",
  "Canh giờ đổi gác — mỗi giờ đúng, mùa hè thì nửa tiếng một lần."]},

"Ben's Chili Bowl": {
 "desc": ["U 街上的半烟肠，1958 年到现在没变过——它既是小馆子，也是民权运动的地标。",
  "El half-smoke de U Street, igual desde 1958: tanto un hito de los derechos civiles como una casa de comidas.",
  "U 스트리트의 하프스모크. 1958년 그대로이고, 식당이자 민권운동의 landmark입니다.",
  "Món half-smoke ở phố U, không đổi từ năm 1958 — vừa là quán ăn vừa là di tích phong trào dân quyền."],
 "tip": ["点的时候说「all the way」——芥末、洋葱、辣肉酱全上。",
  "Pídelo 'all the way': mostaza, cebolla y chili.",
  "주문할 때 'all the way'라고 하세요 — 머스터드, 양파, 칠리 전부.",
  "Gọi 'all the way' — đủ mù tạt, hành và sốt chili."]},

"Old Ebbitt Grill": {
 "desc": ["华盛顿最老的酒馆（1856 年），离白宫两个街区——生蚝、汉堡，还有饭桌上的政治。",
  "El salón más antiguo de Washington (1856), a dos manzanas de la Casa Blanca: ostras, hamburguesas y comidas de trabajo.",
  "워싱턴에서 가장 오래된 술집(1856년), 백악관에서 두 블록 — 굴, 버거, 그리고 권력자들의 점심.",
  "Quán rượu lâu đời nhất Washington (1856), cách Nhà Trắng hai dãy phố — hàu, burger và những bữa trưa quyền lực."],
 "tip": ["晚上稍晚，生蚝吧半价。",
  "A última hora de la noche la barra de ostras está a mitad de precio.",
  "밤 늦게는 로바가 반값입니다.",
  "Khuya muộn thì quầy hàu giảm nửa giá."]},

"Founding Farmers": {
 "desc": ["由农场主自己开的美式餐厅——炸鸡华夫、贝奈特饼，早餐做得很认真。",
  "Cocina americana con granjas propias: pollo frito con gofres, beignets y desayunos en serio.",
  "농장주들이 직접 운영하는 미국 음식점 — 프라이드치킨과 와플, 베녜, 그리고 진지한 아침 식사.",
  "Bếp Mỹ do chính các nông trại làm chủ — gà rán với bánh waffle, bánh beignet và bữa sáng nghiêm túc."],
 "tip": ["位子很紧——提前订，或者避开饭点去。",
  "Se llena: reserva con antelación o ve a horas valle.",
  "자리가 금방 찹니다 — 미리 예약하거나 피크 시간을 피하세요.",
  "Rất kín chỗ — đặt trước, hoặc đến vào giờ vắng."]},

"The Wharf": {
 "desc": ["市政鱼市旁一英里长的滨水餐厅和演出场地——那座鱼市是全美连续经营时间最长的。",
  "Un kilómetro y medio de restaurantes y salas de música junto al Municipal Fish Market, el mercado de pescado en funcionamiento continuo más antiguo del país.",
  "시립 수산시장 옆으로 1.6킬로미터 이어지는 물가 식당가와 공연장 — 그 시장은 미국에서 가장 오래 이어져 온 수산시장입니다.",
  "Gần 1,6 km nhà hàng và phòng nhạc ven nước cạnh Chợ Cá Thành phố — chợ cá hoạt động liên tục lâu đời nhất nước Mỹ."]},

"Union Market": {
 "desc": ["东北区一座明亮的市场大厅，四十多家摊位——饺子、韩式塔可、本地生蚝。",
  "Más de cuarenta puestos en un luminoso mercado del noreste: dumplings, tacos coreanos y ostras locales.",
  "밝은 북동부 마켓홀에 마흔 곳 넘는 가게 — 만두, 코리안 타코, 지역 굴.",
  "Hơn bốn mươi quầy trong khu chợ sáng sủa phía đông bắc — sủi cảo, taco kiểu Hàn và hàu địa phương."]},

"Pike Place Market": {
 "desc": ["1907 年至今，西雅图跳动的心脏——抛鱼的鱼贩、花摊、手作摊位和第一家星巴克，层层叠叠挂在艾略特湾上方的坡上。",
  "El corazón de Seattle desde 1907: pescaderos lanzando salmones, puestos de flores, artesanía y el Starbucks original, apilados en la ladera sobre Elliott Bay.",
  "1907년부터 뛰어 온 시애틀의 심장 — 생선을 던지는 상인, 꽃가게, 수공예 좌판, 그리고 최초의 스타벅스가 엘리엇 만 위 언덕에 층층이 얹혀 있습니다.",
  "Trái tim Seattle từ năm 1907 — người bán cá tung cá, quầy hoa, hàng thủ công và cửa hàng Starbucks đầu tiên, xếp tầng trên sườn dốc nhìn ra vịnh Elliott."],
 "tip": ["十点前到，能看鱼贩摆摊；别漏了下面几层——多数人根本没找到。",
  "Ve antes de las 10 para ver a los pescaderos montar el puesto, y no te pierdas los niveles inferiores: casi nadie los encuentra.",
  "오전 10시 전에 가면 상인들이 좌판 차리는 걸 볼 수 있습니다. 아래층들도 놓치지 마세요 — 대부분은 찾지 못합니다.",
  "Đến trước 10 giờ để xem người bán cá dọn hàng, và đừng bỏ qua các tầng dưới — phần lớn khách không tìm ra."]},

"Space Needle": {
 "desc": ["1962 年世博会留下的地标——520 英尺高，旋转玻璃地板，360 度看城市与普吉特海湾；天晴时还能望见雷尼尔山。",
  "El icono de la Expo de 1962: 158 metros de altura, suelo giratorio de cristal y una vuelta de 360° sobre la ciudad, el Sound y, si el día acompaña, el monte Rainier.",
  "1962년 만국박람회가 남긴 상징 — 158미터 높이, 회전하는 유리 바닥, 도시와 퓨젓 사운드를 360도로, 맑은 날엔 레이니어산까지.",
  "Biểu tượng còn lại từ Hội chợ Thế giới 1962 — cao 158 m, sàn kính xoay, tầm nhìn 360° ra thành phố, vịnh Puget và ngày trong thì thấy cả núi Rainier."],
 "tip": ["日落时段最抢手——提前几天在网上订黄金时刻。",
  "Las franjas de atardecer se agotan: reserva la hora dorada online con unos días.",
  "일몰 시간대는 금방 매진됩니다 — 며칠 전에 골든아워를 온라인 예약하세요.",
  "Khung hoàng hôn hết vé nhanh — đặt giờ vàng online trước vài ngày."]},

"Chihuly Garden and Glass": {
 "desc": ["奇胡利的熔融玻璃梦境——八个展厅加一座花园，雕塑就长在真花草中间，位置就在太空针塔脚下。",
  "Los paisajes oníricos de vidrio fundido de Dale Chihuly: ocho galerías y un jardín donde las esculturas crecen entre plantas reales, justo bajo la Space Needle.",
  "데일 치훌리의 녹인 유리로 만든 꿈의 풍경 — 여덟 개 갤러리와, 조각이 진짜 식물 사이에서 자라는 정원. 스페이스 니들 바로 아래입니다.",
  "Những giấc mơ bằng thủy tinh nung chảy của Dale Chihuly — tám phòng trưng bày và một khu vườn nơi tác phẩm mọc lên giữa cây thật, ngay dưới chân Space Needle."],
 "tip": ["和太空针塔买套票；午后偏晚的光线里，玻璃屋最好看。",
  "Combínalo con la Needle en una entrada conjunta; el Glasshouse brilla mejor a última hora de la tarde.",
  "스페이스 니들과 묶음권으로 사세요. 늦은 오후 빛에서 글라스하우스가 가장 아름답습니다.",
  "Mua vé combo với Space Needle; nhà kính đẹp nhất dưới nắng cuối chiều."]},

"Museum of Pop Culture": {
 "desc": ["盖里设计的那栋闪着光的怪建筑，里面塞满了涅槃与亨德里克斯的旧物、科幻道具、恐怖片史，还有一座吉他龙卷风。",
  "El edificio ondulante y reluciente de Frank Gehry, repleto de reliquias de Nirvana y Hendrix, atrezo de ciencia ficción, historia del terror y un tornado de guitarras.",
  "프랭크 게리가 지은 번쩍이는 덩어리 건물. 너바나와 헨드릭스의 유물, SF 소품, 호러 영화사, 그리고 기타로 만든 토네이도가 들어 있습니다.",
  "Khối nhà lấp lánh của Frank Gehry, nhồi đầy kỷ vật Nirvana và Hendrix, đạo cụ khoa học viễn tưởng, lịch sử phim kinh dị và một cơn lốc làm bằng đàn ghi-ta."],
 "tip": ["Sound Lab 可以真上手弹——留给它最后半小时。",
  "El Sound Lab te deja tocar instrumentos de verdad: reserva los últimos 30 minutos.",
  "사운드랩에서는 실제 악기를 연주할 수 있습니다 — 마지막 30분을 남겨 두세요.",
  "Sound Lab cho bạn chơi nhạc cụ thật — để dành 30 phút cuối."]},

"Seattle Aquarium": {
 "desc": ["海獭、太平洋巨型章鱼，还有一座由潜水员投喂的水下穹顶，就开在还在作业的码头上。",
  "Nutrias marinas, pulpo gigante del Pacífico y una cúpula submarina donde los buzos dan de comer, sobre los muelles en activo.",
  "해달, 자이언트 퍼시픽 문어, 그리고 잠수부가 먹이를 주는 수중 돔 — 실제로 일하는 부두 위에 있습니다.",
  "Rái cá biển, bạch tuộc khổng lồ Thái Bình Dương và một mái vòm dưới nước nơi thợ lặn cho ăn, ngay trên bến cảng đang hoạt động."],
 "tip": ["海獭喂食是重头戏——进门看一下当天时间表，围着它安排。",
  "La hora de comer de las nutrias es el espectáculo: mira el horario del día en la entrada y organízate en torno a él.",
  "해달 먹이 주기가 하이라이트입니다 — 입구에서 당일 시간표를 보고 그에 맞춰 도세요.",
  "Giờ cho rái cá ăn là màn hay nhất — xem lịch trong ngày ở cửa rồi sắp xếp quanh giờ đó."]},

"Kerry Park viewpoint": {
 "desc": ["明信片上的那一张：整条天际线，太空针塔正中，雷尼尔山浮在后面——皇后安山上一个很小的公园。",
  "La foto de postal: todo el skyline con la Space Needle en el centro y el Rainier flotando detrás, desde un parque diminuto en la colina de Queen Anne.",
  "엽서 속 그 장면 — 스카이라인 한가운데 스페이스 니들, 그 뒤에 떠 있는 레이니어산. 퀸앤 언덕의 아주 작은 공원입니다.",
  "Đúng tấm bưu thiếp: cả đường chân trời với Space Needle ở giữa và núi Rainier lơ lửng phía sau — một công viên tí hon trên đồi Queen Anne."],
 "tip": ["日落后 30 分钟到，蓝调时刻——西雅图所有海报都是那时候拍的。",
  "Llega 30 minutos después del atardecer, en la hora azul: de ahí sale cada póster de Seattle.",
  "일몰 30분 뒤 블루아워에 가세요 — 시애틀 포스터는 전부 그때 찍은 것입니다.",
  "Đến sau hoàng hôn 30 phút, vào giờ xanh — mọi tấm poster về Seattle đều chụp lúc đó."]},

"Gas Works Park": {
 "desc": ["一座 1900 年代的煤气厂锈在原地，四周变成了湖畔公园——工业遗迹、放风筝的小山，还有水上飞机贴着天际线降落在联合湖上。",
  "Una planta de gasificación de principios del siglo XX oxidada y convertida en parque junto al lago: ruinas industriales, la colina de las cometas e hidroaviones amerizando en el lago Union frente al skyline.",
  "1900년대 가스화 공장이 녹슨 채 호숫가 공원이 되었습니다 — 산업 유적, 연 날리는 언덕, 그리고 스카이라인 앞 유니언 호수에 내려앉는 수상비행기.",
  "Nhà máy khí hóa đầu thế kỷ 20 hoen gỉ hóa thành công viên ven hồ — phế tích công nghiệp, đồi thả diều và thủy phi cơ hạ cánh xuống hồ Union trước đường chân trời."],
 "tip": ["带上打包的吃的，占住那座小山——西雅图人最爱的野餐位。",
  "Lleva comida para llevar y ocupa la colina: es la vista de picnic favorita de Seattle.",
  "먹을 것을 싸 와서 언덕을 차지하세요 — 시애틀 사람들이 가장 좋아하는 소풍 자리입니다.",
  "Mang đồ ăn mang đi và chiếm lấy ngọn đồi — chỗ picnic được dân Seattle yêu nhất."]},

"Starbucks Reserve Roastery": {
 "desc": ["国会山上的母舰——一座真在运转的烘焙厂，豆子顺着头顶的铜管走，菜单远超任何一家普通星巴克。",
  "La nave nodriza en Capitol Hill: un tostadero en funcionamiento donde el grano viaja por tuberías de cobre sobre tu cabeza y la carta va mucho más allá de un Starbucks normal.",
  "캐피톨 힐의 모선 — 실제로 돌아가는 로스터리로, 원두가 머리 위 구리관을 타고 흐르고 메뉴는 보통 스타벅스와 비교가 되지 않습니다.",
  "Con tàu mẹ ở Capitol Hill — một xưởng rang đang hoạt động, hạt cà phê chạy trong ống đồng trên đầu và thực đơn vượt xa mọi Starbucks thường."],
 "tip": ["在体验吧点一组对比品鉴，看着烘焙机运转——普通拿铁哪儿都能喝。",
  "Pide una cata en la barra de experiencia y mira funcionar el tostador: el latte normal lo tienes en cualquier parte.",
  "익스피리언스 바에서 플라이트를 주문하고 로스터가 돌아가는 걸 보세요 — 평범한 라떼는 어디서나 마실 수 있습니다.",
  "Gọi một set nếm thử ở quầy trải nghiệm và xem máy rang chạy — ly latte thường thì đâu cũng có."]},

"Freedom Trail (start)": {
 "desc": ["一条 2.5 英里的红砖线，串起十六处独立战争遗址，从波士顿公园一路走到邦克山纪念碑——整个建国故事被铺成一条步道。",
  "Una línea de ladrillo rojo de 4 km que une dieciséis lugares de la Revolución, desde Boston Common hasta el monumento de Bunker Hill: toda la historia fundacional convertida en paseo.",
  "4킬로미터 붉은 벽돌 선이 독립전쟁 유적 열여섯 곳을 잇습니다. 보스턴 코먼에서 벙커힐 기념비까지, 건국의 이야기 전체가 한 줄의 걷기 코스가 됩니다.",
  "Vạch gạch đỏ dài 4 km nối mười sáu di tích Cách mạng, từ Boston Common tới đài Bunker Hill — toàn bộ câu chuyện lập quốc trải thành một lối đi."],
 "tip": ["下午由北往南走，太阳在背后；标的 90 分钟只是走路时间——进去参观会翻倍。",
  "Recórrelo de norte a sur por la tarde para llevar el sol detrás, y entiende los 90 minutos indicados como tiempo andando: entrar en los sitios lo duplica.",
  "오후에 북에서 남으로 걸으면 해를 등집니다. 안내된 90분은 걷는 시간만이고, 안에 들어가 보면 두 배가 됩니다.",
  "Đi hướng bắc xuống nam vào buổi chiều để nắng ở sau lưng, và hiểu 90 phút ghi trên bảng chỉ là thời gian đi — vào bên trong sẽ gấp đôi."]},

"Faneuil Hall Marketplace": {
 "desc": ["三座花岗岩厅堂的食摊与街头表演，紧挨着 1742 年那座会议厅——当年殖民地居民就是在那里吵着吵着走向了革命。",
  "Tres naves de granito con puestos de comida y artistas callejeros, junto a la casa de reuniones de 1742 donde los colonos discutieron hasta la revolución.",
  "화강암 홀 세 채에 늘어선 먹거리와 거리 공연, 그 옆이 1742년 집회장 — 식민지 주민들이 여기서 논쟁하다 혁명으로 갔습니다.",
  "Ba dãy nhà đá granit đầy quầy ăn và nghệ sĩ đường phố, ngay cạnh hội trường năm 1742 nơi người dân thuộc địa tranh luận cho tới lúc làm cách mạng."],
 "tip": ["Quincy Market 中午挤爆；11 点或 2 点后吃，端到东门外的长椅上。",
  "El mercado de Quincy revienta a mediodía: come a las 11 o después de las 2 y llévatelo a los bancos junto a la puerta este.",
  "퀸시 마켓은 정오에 발 디딜 틈이 없습니다. 11시나 2시 이후에 먹고, 동쪽 문 옆 벤치로 가져가세요.",
  "Quincy Market kín đặc lúc trưa; ăn lúc 11 giờ hoặc sau 2 giờ rồi mang ra ghế cạnh cửa đông."]},

"Fenway Park": {
 "desc": ["大联盟最老的球场，1912 年开场，左外野那面 37 英尺高的「绿色怪物」还立在那里。",
  "El estadio más antiguo de las Grandes Ligas, abierto en 1912, con el Monstruo Verde de 11 metros todavía en pie en el jardín izquierdo.",
  "메이저리그에서 가장 오래된 구장. 1912년에 문을 열었고, 좌익의 11미터 '그린 몬스터'가 아직 서 있습니다.",
  "Sân bóng lâu đời nhất giải nhà nghề, mở cửa năm 1912, với 'Quái vật Xanh' cao 11 m vẫn đứng ở cánh trái."],
 "tip": ["非比赛日有一小时的球场导览，能走上「怪物」看台——会卖光，先订；不买球票的话这是唯一进得去的方式。",
  "Los días sin partido, la visita de una hora te lleva a las gradas del Monstruo: resérvala, se agota, y es la única forma de entrar sin entrada de partido.",
  "경기 없는 날에는 한 시간짜리 투어로 몬스터 좌석까지 올라갑니다 — 매진되니 예약하세요. 티켓 없이 들어가는 유일한 방법입니다.",
  "Ngày không có trận, tour một tiếng đưa bạn lên khán đài Green Monster — hết chỗ nhanh, nên đặt trước; đó là cách duy nhất vào sân mà không cần vé trận."]},

"Museum of Fine Arts": {
 "desc": ["五十万件藏品的百科全书式收藏，其中印象派、埃及艺术与美国绘画最强。",
  "Medio millón de obras en una colección enciclopédica, con fuerza especial en impresionistas, arte egipcio y pintura estadounidense.",
  "50만 점에 이르는 백과사전식 컬렉션. 인상주의, 이집트 미술, 미국 회화가 특히 강합니다.",
  "Nửa triệu hiện vật trong một bộ sưu tập bách khoa, mạnh nhất ở tranh Ấn tượng, nghệ thuật Ai Cập và hội họa Mỹ."],
 "tip": ["周三到周五的傍晚人最少；光「美洲艺术」一翼就值两个小时。",
  "Las tardes de miércoles a viernes son las horas más tranquilas, y solo el ala de Arte de las Américas merece dos horas.",
  "수요일부터 금요일 저녁이 가장 한산합니다. '아메리카 미술' 관 하나만으로도 두 시간 값을 합니다.",
  "Chiều tối thứ Tư đến thứ Sáu là vắng nhất, và riêng cánh Nghệ thuật châu Mỹ đã đáng hai tiếng."]},

"New England Aquarium": {
 "desc": ["四层高的巨型海洋缸，一路盘旋穿过加勒比珊瑚礁，海龟、鲨鱼和鳐鱼就在身边，位置就在港边。",
  "Un tanque oceánico gigante de cuatro pisos que sube en espiral por un arrecife caribeño con tortugas, tiburones y rayas, justo en el puerto.",
  "4층 높이 자이언트 오션 탱크가 카리브 산호초를 감아 오릅니다. 바다거북과 상어, 가오리가 함께이고 위치는 항구 바로 앞입니다.",
  "Bể đại dương khổng lồ cao bốn tầng xoắn ốc qua rạn san hô Caribbean với rùa biển, cá mập và cá đuối, ngay bên cảng."],
 "tip": ["开门时或最后 90 分钟去——中午绕缸的坡道是单排挪不动的。",
  "Ve al abrir o en los últimos 90 minutos: a mediodía la rampa alrededor del tanque es una fila que no avanza.",
  "개장 직후나 마지막 90분에 가세요 — 한낮에는 탱크를 도는 경사로가 한 줄로 꽉 막힙니다.",
  "Đi lúc mở cửa hoặc trong 90 phút cuối — giữa trưa lối dốc quanh bể chật cứng, nhích từng bước."]},

"USS Constitution": {
 "desc": ["「老铁甲」，1797 年下水，至今仍是一艘在役的海军舰艇——全世界还浮在水上的最古老战舰。",
  "'Old Ironsides', botado en 1797 y todavía un buque en activo de la Armada: el barco de guerra a flote más antiguo del mundo.",
  "'올드 아이언사이즈'. 1797년 진수했고 지금도 현역 해군 함정입니다 — 세계에서 물에 떠 있는 가장 오래된 군함.",
  "'Old Ironsides', hạ thủy năm 1797 và vẫn là tàu hải quân đang biên chế — chiến hạm cổ nhất còn nổi trên thế giới."],
 "tip": ["免费，但成年人登船要带带照片的证件。旁边的博物馆是分开的，值得再花半小时。",
  "Gratis, pero los adultos necesitan documento con foto para subir. El museo de al lado es aparte y merece media hora más.",
  "무료지만 성인은 사진이 있는 신분증이 있어야 승선할 수 있습니다. 옆 박물관은 별도이고 30분 더 낼 값을 합니다.",
  "Miễn phí, nhưng người lớn cần giấy tờ có ảnh mới được lên tàu. Bảo tàng bên cạnh tính riêng và đáng thêm nửa tiếng."]},

"Boston Common & Public Garden": {
 "desc": ["美国最老的公共公园，1634 年，一直连到公共花园——那里有天鹅船和垂柳。",
  "El parque público más antiguo de Estados Unidos, de 1634, que desemboca en el Public Garden con sus barcas-cisne y sus sauces llorones.",
  "1634년에 만들어진 미국에서 가장 오래된 공원. 백조 보트와 수양버들이 있는 퍼블릭 가든으로 이어집니다.",
  "Công viên công cộng lâu đời nhất nước Mỹ, năm 1634, nối liền sang Public Garden với những chiếc thuyền thiên nga và hàng liễu rủ."],
 "tip": ["天鹅船只在四月中到劳动节之间开。波士顿的一天从这里开始最顺——地下有三条地铁线交汇。",
  "Las barcas-cisne solo funcionan de mediados de abril al Día del Trabajo. El Common es el punto natural para empezar el día: tres líneas de metro se cruzan debajo.",
  "백조 보트는 4월 중순부터 노동절까지만 운행합니다. 보스턴의 하루는 여기서 시작하는 게 자연스럽습니다 — 지하에서 지하철 세 노선이 만납니다.",
  "Thuyền thiên nga chỉ chạy từ giữa tháng Tư đến Ngày Lao động. Bắt đầu một ngày ở Boston từ đây là hợp lý nhất — ba tuyến tàu điện giao nhau ngay bên dưới."]},

"Harvard Yard, Cambridge": {
 "desc": ["河对岸 1636 年的校园草坪，四周是红砖楼；门口就是哈佛广场的书店和咖啡馆。",
  "El campus de 1636 al otro lado del río, rodeado de edificios de ladrillo rojo, con las librerías y cafés de Harvard Square a la puerta.",
  "강 건너 1636년의 교정. 붉은 벽돌 건물이 둘러싸고, 정문 앞이 하버드 스퀘어의 서점과 카페입니다.",
  "Khuôn viên năm 1636 bên kia sông, vây quanh là các tòa nhà gạch đỏ, ngay cổng là hiệu sách và quán cà phê của Harvard Square."],
 "tip": ["坐红线到 Harvard 站，别开车——剑桥停车是真的难。游客中心有学生带的免费导览。",
  "Ve en la línea roja hasta Harvard en vez de conducir: aparcar en Cambridge es realmente difícil. Las visitas guiadas por estudiantes salen del centro de visitantes y son gratis.",
  "차 대신 레드라인을 타고 하버드역으로 가세요 — 케임브리지 주차는 정말 어렵습니다. 학생이 이끄는 무료 투어가 방문자 센터에서 출발합니다.",
  "Đi tàu Red Line tới ga Harvard thay vì lái xe — đỗ xe ở Cambridge thực sự khó. Tour do sinh viên dẫn khởi hành từ trung tâm khách tham quan và miễn phí."]},
}
