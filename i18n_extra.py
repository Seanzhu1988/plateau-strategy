# -*- coding: utf-8 -*-
"""Translations for the pages the first pass never reached.

Order is always [zh, es, ko, vi]. Keys must match the page text exactly as a
reader sees it, whitespace collapsed, i18n.js looks the line up by its English.

Kept in its own file so build_i18n.py stays readable; it merges this on top.
"""

# Brand names, example values and codes a reader should still see in English.
EXTRA_SKIP = {
    "Plateau Strategy Solution Lab", "Plateau Strategy", "Plateau Deflator",
    "OpenStreetMap", "Nominatim", "OSRM", "Overpass", "Atlas",
    "Ana Silva", "Harvard Yard in depth, a student's walk", "Boston",
    "English, Mandarin", "Johnston Gate, Massachusetts Ave side",
    "AS 1234", "Pier 91 Cruise Terminal, Seattle", "Princess",
    "Discovery Princess", "Woodinville wine tour", "Back to the hotel",
    "e.g. AGT-XXXX", "AGT-XXXX, proves you're a listed guide",
    "ana@email.com", "you@paypal-email.com", "example.com",
    "Bureau of the Fiscal Service",
    "Attn Dept G · Bureau of the Fiscal Service · P.O. Box 2188 · Parkersburg, WV 26106-2188",
    "Gifts to Reduce the Public Debt",
    "The Walks",
    "🇺🇸 Give at the U.S. Treasury (Pay.gov) →",
    "FIG 1, MIXED-USE HUB · FRONT ELEVATION (NTS)",
    "PROJECT · PLATEAU STRATEGY", "SHEET · RE-01", "SCALE · NTS", "REV · A",
    "Mixed-use development · Sheet RE-01",
    "© 2026 Plateau Strategy Solution Lab",
    '"Connect to Square"',

    "C",
    "D",
    "E",
    "30 000 OVERALL",
    "10 m",
    "SCALE · 1:200 @ A3",
}

EXTRA = {

    # ---- Freedom Trail: Yiki's stop notes ----
    "Stand across the street and look straight up. In the Second World War they painted the dome grey so it would not shine for bombers off the coast. It is gold again now, and on a clear morning you have to squint.": ["站到街对面，抬头直直往上看。第二次世界大战期间，人们把这圆顶漆成了灰色，免得它在海面外的轰炸机眼里发亮。如今它又是金色的了，天气晴朗的早晨，你得眯起眼睛才看得清。", "Ponte al otro lado de la calle y mira directamente hacia arriba. Durante la Segunda Guerra Mundial pintaron la cúpula de gris para que no brillara ante los bombarderos frente a la costa. Ahora vuelve a ser dorada, y en una mañana despejada tienes que entrecerrar los ojos.", "길 건너편에 서서 곧장 위를 올려다보세요. 제2차 세계 대전 때는 해안의 폭격기 눈에 반짝이지 않도록 이 돔을 회색으로 칠했습니다. 지금은 다시 금빛이라, 맑은 아침이면 눈이 부셔 실눈을 뜨게 됩니다.", "Hãy đứng bên kia đường và nhìn thẳng lên. Trong Thế chiến thứ hai, người ta sơn mái vòm màu xám để nó không lấp lánh cho máy bay ném bom ngoài khơi thấy. Giờ mái vòm lại vàng óng, và vào một buổi sáng trời trong, bạn phải nheo mắt mới nhìn được."],
    "Pick out the tall white steeple from a few streets away. For years it was the first thing a traveler saw riding into Boston, so you can arrive at it the way they did.": ["从几条街外就把那座高高的白色尖塔认出来。有很多年，它是旅人骑马进波士顿时看到的第一样东西，所以你也可以像他们当年那样，朝着它走过去。", "Distingue el alto campanario blanco desde unas calles atrás. Durante años fue lo primero que veía un viajero al entrar a Boston, así que puedes llegar a él como ellos lo hacían.", "몇 블록 떨어진 곳에서 높고 하얀 첨탑을 찾아보세요. 오랫동안 이 첨탑은 보스턴으로 들어오는 여행자가 가장 먼저 보던 것이었으니, 옛사람들이 그랬던 것처럼 이곳에 다다를 수 있습니다.", "Hãy tìm tháp chuông trắng cao từ cách đó vài con phố. Trong nhiều năm, đó là thứ đầu tiên du khách trông thấy khi tiến vào Boston, nên bạn có thể đến với nó theo đúng cách mà họ đã từng."],
    "Find the tall obelisk in the centre. It marks Benjamin Franklin's mother and father, though Franklin himself lies in Philadelphia. Read a few of the winged skulls while you are here, the carving softens as the century turns.": ["找中央那座高高的方尖碑。它标记着本杰明·富兰克林父母的墓，尽管富兰克林本人葬在费城。趁在这里，读一读那几个带翼的骷髅头，你会发现随着世纪流转，碑上的雕刻渐渐柔和了下来。", "Busca el alto obelisco en el centro. Señala a la madre y al padre de Benjamin Franklin, aunque el propio Franklin descansa en Filadelfia. Lee algunas de las calaveras aladas mientras estás aquí, el tallado se suaviza a medida que avanza el siglo.", "가운데에 있는 높은 오벨리스크를 찾아보세요. 이것은 벤저민 프랭클린의 어머니와 아버지를 기리는 것이지만, 프랭클린 본인은 필라델피아에 잠들어 있습니다. 이곳에 있는 동안 날개 달린 해골 조각을 몇 개 살펴보세요. 세기가 바뀌면서 조각이 점점 부드러워집니다.", "Hãy tìm cây tháp bút cao ở chính giữa. Nó đánh dấu nơi an nghỉ của cha mẹ Benjamin Franklin, dù bản thân Franklin lại nằm ở Philadelphia. Nhân lúc ở đây, hãy đọc thử vài chiếc đầu lâu có cánh, nét chạm khắc dần mềm mại hơn khi thế kỷ trôi qua."],
    "Notice the tower stops square and plain. The steeple it was drawn for was never built, the money ran out, and Bostonians rather grew to like it unfinished. Inside, the high box pews were rented by the family.": ["留意那座塔到顶就方方正正、朴朴素素地断了。图纸上为它画的尖顶始终没建起来，钱用光了，波士顿人反倒渐渐喜欢上它这副没盖完的样子。堂里那些高高的包厢式座席，当年是各家各户租下的。", "Fíjate en que la torre termina cuadrada y sencilla. El campanario para el que fue diseñada nunca se construyó, se acabó el dinero, y a los bostonianos terminó por gustarles así, sin terminar. Adentro, las familias alquilaban los altos bancos cerrados.", "탑이 네모나고 밋밋하게 끝나는 모습을 눈여겨보세요. 원래 설계된 첨탑은 끝내 지어지지 않았습니다. 돈이 떨어졌고, 보스턴 사람들은 오히려 미완성인 이 모습을 좋아하게 되었습니다. 안쪽의 높은 칸막이 예배석은 가족 단위로 임대되었습니다.", "Hãy để ý tòa tháp dừng lại vuông vắn và giản dị. Tháp chuông mà nó được vẽ để đỡ đã không bao giờ được xây, vì hết tiền, và người dân Boston lại dần thích nó khi còn dang dở. Bên trong, những hàng ghế cao có vách được các gia đình thuê riêng."],
    "Look down, not up. The schoolhouse is long gone, and the spot is a mosaic set into the pavement. Several signers of the Declaration learned their Latin here before Franklin did, and left better credentialed than he managed to.": ["往下看，别往上看。校舍早就没了，这个地点如今是嵌在人行道里的一幅马赛克。好几位《独立宣言》的签署者，都比富兰克林更早在这里学过拉丁文，而且拿到的文凭也比他体面。", "Mira hacia abajo, no hacia arriba. La escuela desapareció hace mucho, y el lugar es un mosaico incrustado en el pavimento. Varios firmantes de la Declaración aprendieron aquí su latín antes que Franklin, y salieron con mejores credenciales de las que él llegó a tener.", "위가 아니라 아래를 보세요. 학교 건물은 오래전에 사라졌고, 그 자리에는 보도에 새겨진 모자이크가 있습니다. 독립 선언서에 서명한 여러 인물이 프랭클린보다 앞서 이곳에서 라틴어를 배웠고, 프랭클린이 얻은 것보다 더 나은 자격을 갖추고 이곳을 떠났습니다.", "Hãy nhìn xuống, đừng nhìn lên. Ngôi trường xưa đã biến mất từ lâu, và vị trí đó nay là một bức tranh khảm gắn trên vỉa hè. Nhiều người ký Tuyên ngôn Độc lập đã học tiếng Latinh ở đây trước cả Franklin, và rời khỏi đây với bằng cấp còn danh giá hơn những gì ông từng có được."],
    "It was nearly a parking lot. A handful of Bostonians bought the building in nineteen sixty to stop the wreckers, and that one fight started the group that has since saved a good deal of what you will walk past today.": ["它差点成了一片停车场。一九六〇年，一小撮波士顿人买下这栋楼，才拦住了拆迁的人。就是那一仗，催生了一个团体，你今天一路会走过的许多地方，后来都是他们保下来的。", "Estuvo a punto de ser un estacionamiento. Un puñado de bostonianos compró el edificio en mil novecientos sesenta para detener a los demoledores, y esa sola pelea dio origen al grupo que desde entonces ha salvado buena parte de lo que verás al pasar hoy.", "이곳은 하마터면 주차장이 될 뻔했습니다. 1960년에 몇몇 보스턴 사람들이 철거를 막으려고 이 건물을 사들였고, 그 한 번의 싸움에서 시작된 단체가 그 뒤로 오늘 여러분이 지나칠 많은 것들을 지켜냈습니다.", "Nơi này suýt trở thành một bãi đỗ xe. Một nhóm nhỏ người dân Boston đã mua lại tòa nhà vào năm 1960 để ngăn đội phá dỡ, và cuộc đấu tranh ấy đã khai sinh ra tổ chức mà từ đó đến nay đã gìn giữ được khá nhiều những gì bạn sẽ đi ngang qua hôm nay."],
    "When the British held the town they tore out the pews and rode horses inside, to insult the very room where it had started. Stand in the middle and picture it packed to the walls, because on that December night it was.": ["英国人占着这座城的时候，把座椅全拆了，牵着马在里面走，专为羞辱这个点燃了一切的房间。站到正中央，想象它挤得连墙根都站满了人，因为那个十二月的夜里，它就是这样。", "Cuando los británicos ocuparon la ciudad arrancaron los bancos y metieron caballos adentro, para insultar la misma sala donde todo había empezado. Ponte en el centro e imagínala repleta hasta las paredes, porque en aquella noche de diciembre así estuvo.", "영국군이 이 도시를 점령했을 때, 그들은 예배석을 뜯어내고 안에서 말을 타며 모든 일이 시작된 바로 그 공간을 모욕했습니다. 가운데에 서서 이곳이 벽까지 사람들로 꽉 찬 모습을 그려 보세요. 그 12월의 밤에는 정말 그랬으니까요.", "Khi quân Anh chiếm giữ thị trấn, họ dỡ bỏ hết các hàng ghế và cưỡi ngựa vào bên trong, để làm nhục chính căn phòng nơi mọi chuyện đã bắt đầu. Hãy đứng ở giữa và hình dung cảnh nơi này chật kín đến tận tường, bởi vào cái đêm tháng Mười Hai ấy, nó đã đúng là như vậy."],
    "The lion and the unicorn are the crown's own animals, and in seventeen seventy six the crowd pulled the first pair down and burned them in the street. These are later copies, put back once the anger had cooled. A subway runs directly under the floor now.": ["狮子和独角兽是王室自己的兽。一七七六年，人群把最早那一对扯了下来，在街上烧掉。你现在看到的是后来的复制品，等火气消了才放回去。如今，一条地铁就从这地板的正下方跑过。", "El león y el unicornio son los animales propios de la corona, y en mil setecientos setenta y seis la multitud derribó el primer par y los quemó en la calle. Estos son copias posteriores, colocadas de nuevo una vez que la ira se había calmado. Ahora un metro pasa justo debajo del piso.", "사자와 유니콘은 왕실을 상징하는 동물이며, 1776년에 군중이 처음의 한 쌍을 끌어내려 거리에서 불태웠습니다. 지금 있는 것은 분노가 가라앉은 뒤에 다시 세운 후대의 복제품입니다. 이제는 바로 이 바닥 밑으로 지하철이 지나갑니다.", "Con sư tử và con kỳ lân là biểu tượng riêng của hoàng gia, và vào năm 1776 đám đông đã kéo cặp tượng đầu tiên xuống rồi đốt chúng ngay giữa phố. Đây là những bản sao về sau, được đặt lại khi cơn giận đã nguôi ngoai. Giờ đây có một tuyến tàu điện ngầm chạy ngay bên dưới sàn nhà."],
    "Mind the traffic to reach it, then look back up at the balcony above you, because the two places are one story. The first of the five to fall was Crispus Attucks, a sailor of African and Wampanoag descent.": ["过去的时候当心车，到了那儿，再抬头看看你上方那道阳台，因为这两处地方是同一个故事。五个人里最先倒下的，是克里斯普斯·阿塔克斯，一个兼有非洲和万帕诺亚格血统的水手。", "Cuida el tráfico para llegar, y luego vuelve a mirar hacia el balcón que tienes encima, porque los dos lugares son una sola historia. El primero de los cinco en caer fue Crispus Attucks, un marinero de ascendencia africana y wampanoag.", "차를 조심하며 이곳에 다다른 다음, 머리 위 발코니를 다시 올려다보세요. 두 장소가 하나의 이야기이기 때문입니다. 목숨을 잃은 다섯 명 중 첫 번째는 아프리카와 왐파노아그 혈통의 선원 크리스퍼스 애턱스였습니다.", "Hãy để ý xe cộ khi băng qua để đến đó, rồi ngước nhìn lại ban công phía trên bạn, bởi hai nơi này cùng chung một câu chuyện. Người đầu tiên trong năm người ngã xuống là Crispus Attucks, một thủy thủ mang dòng máu Phi và Wampanoag."],
    "Duck your head, the doorways were built for smaller people. He raised a large family in these few rooms across two marriages, and the tightness of the place tells you more about the man than any label on the wall.": ["低下头，这些门框是为个子更小的人造的。他在这几间小屋里，跨着两段婚姻养大了一大家子人。这地方的逼仄，比墙上任何一块说明牌都更能告诉你他是个什么样的人。", "Agacha la cabeza, las puertas se hicieron para gente más baja. Él crió a una familia numerosa en estos pocos cuartos a lo largo de dos matrimonios, y lo estrecho del lugar te dice más sobre el hombre que cualquier letrero en la pared.", "머리를 숙이세요. 문은 지금보다 몸집이 작은 사람들에 맞춰 지어졌습니다. 그는 두 번의 결혼을 거치며 이 몇 안 되는 방에서 대가족을 키웠고, 벽에 붙은 어떤 설명보다도 이 비좁은 공간이 그 사람에 대해 더 많은 것을 말해 줍니다.", "Hãy cúi đầu xuống, những khung cửa được làm cho người có tầm vóc nhỏ hơn. Ông đã nuôi một gia đình đông đúc trong vài căn phòng này qua hai đời vợ, và sự chật chội của nơi đây cho bạn biết về con người ông nhiều hơn bất kỳ tấm biển nào trên tường."],
    "Revere did not hang the lanterns himself. That was Robert Newman, the sexton, who climbed the steeple and then slipped out a back window to get home unseen. Look up into the dark where he stood.": ["灯笼不是里维尔亲手挂的。挂灯的是教堂司事罗伯特·纽曼，他爬上尖塔，事后又从一扇后窗溜出去，不被人看见地回了家。抬头望望那片黑暗，他当年就站在那里。", "Revere no colgó las linternas él mismo. Fue Robert Newman, el sacristán, quien subió al campanario y luego se escabulló por una ventana trasera para llegar a casa sin ser visto. Mira hacia arriba, a la oscuridad donde él estuvo.", "리비어가 직접 등불을 내건 것은 아닙니다. 그것은 관리인 로버트 뉴먼이 한 일로, 그는 첨탑에 올라간 뒤 뒤쪽 창문으로 빠져나가 들키지 않고 집으로 돌아갔습니다. 그가 서 있던 어둠 속을 올려다보세요.", "Revere không tự mình treo những chiếc đèn lồng. Người làm việc đó là Robert Newman, người coi sóc nhà thờ, ông đã trèo lên tháp chuông rồi lẻn ra qua một ô cửa sổ phía sau để về nhà mà không ai trông thấy. Hãy ngước nhìn vào khoảng tối nơi ông đã đứng."],
    "Walk to the far corner and look across the water. That rise is Charlestown and the monument you are heading for, so you can see the end of the walk from here. Many of Boston's free Black residents are buried in this ground.": ["走到最远那个角落，望向水对岸。那道隆起就是查尔斯顿，还有你正朝它走去的那座纪念碑，所以站在这里，你就能望见这趟步行的终点。波士顿许多自由的黑人居民，都葬在这片土地上。", "Camina hasta la esquina más lejana y mira al otro lado del agua. Esa loma es Charlestown y el monumento hacia el que te diriges, así que puedes ver el final del recorrido desde aquí. Muchos de los residentes negros libres de Boston están enterrados en este suelo.", "저 멀리 구석까지 걸어가 물 건너편을 바라보세요. 저 언덕이 찰스타운이며 여러분이 향하고 있는 기념비가 있는 곳이니, 이곳에서 걷기의 끝을 볼 수 있습니다. 보스턴의 자유민이었던 흑인 주민 다수가 이 땅에 묻혀 있습니다.", "Hãy đi đến góc xa và nhìn qua mặt nước. Gò đất nhô lên kia là Charlestown cùng đài tưởng niệm mà bạn đang hướng tới, nên từ đây bạn có thể thấy được điểm cuối của hành trình. Nhiều cư dân da Đen tự do của Boston được an táng trên mảnh đất này."],
    "Two hundred and ninety four steps, and a small triumph at the top, since most people stop counting near two hundred. This is where they were told to hold their fire until they could see the whites of the enemy's eyes, because powder was too scarce to waste a shot.": ["两百九十四级台阶，登顶时会有一点小小的得意，因为大多数人数到两百上下就数不下去了。就是在这里，士兵们被告知，不到看清敌人的眼白，绝不许开枪，因为火药太紧缺，一发也浪费不起。", "Doscientos noventa y cuatro escalones, y un pequeño triunfo al llegar arriba, ya que la mayoría deja de contar cerca de los doscientos. Aquí es donde les dijeron que no dispararan hasta poder ver el blanco de los ojos del enemigo, porque la pólvora era demasiado escasa para desperdiciar un tiro.", "294개의 계단, 그리고 정상에서 맛보는 작은 성취감. 대부분의 사람들은 200개쯤에서 세기를 멈추기 때문입니다. 바로 이곳이 적의 눈 흰자위가 보일 때까지 사격을 참으라는 명령을 받은 곳입니다. 화약이 너무 귀해서 한 발도 헛되이 쓸 수 없었기 때문입니다.", "Hai trăm chín mươi tư bậc thang, và một chiến thắng nho nhỏ khi lên đến đỉnh, bởi hầu hết mọi người đều thôi đếm khi gần đến hai trăm. Đây là nơi họ được lệnh nín nhịn chưa bắn cho tới khi nhìn thấy được lòng trắng trong mắt kẻ thù, bởi thuốc súng quá khan hiếm để phí phạm một phát đạn."],


    # ---- Freedom Trail (freedom-trail.html + stop names & descriptions) ----
    "NEW · THE OUTDOOR GUIDE": ["新 · 户外向导", "NUEVO · LA GUÍA AL AIRE LIBRE", "신규 · 야외 가이드", "MỚI · HƯỚNG DẪN NGOÀI TRỜI"],
    "The Freedom Trail": ["自由之路", "El Freedom Trail", "프리덤 트레일", "Con Đường Tự Do"],
    "All sixteen Revolutionary sites in walking order, with the time each one really takes. Forty four minutes of walking, five and a half hours inside. Take all sixteen or the downtown half, and drop either onto your map in one tap.": ["十六处革命遗址，按步行顺序排列，还标出每一处真正要花的时间。步行四十四分钟，室内五个半小时。这十六处全走，或只走市中心那一半，都能一键放进你的地图。", "Los dieciséis sitios de la Revolución en orden de recorrido, con el tiempo que de verdad toma cada uno. Cuarenta y cuatro minutos de caminata, cinco horas y media de visita en interiores. Recorre los dieciséis o la mitad del centro, y coloca cualquiera de las dos en tu mapa con un solo toque.", "독립혁명과 관련된 16곳을 걷는 순서대로, 각 장소에 실제로 걸리는 시간과 함께 담았습니다. 걷는 시간 44분, 실내 관람 5시간 30분. 16곳 전체를 택하거나 다운타운 절반만 골라, 한 번의 탭으로 지도에 바로 담으세요.", "Toàn bộ mười sáu địa điểm thời Cách mạng theo thứ tự đi bộ, kèm thời gian thực tế cho từng điểm. Bốn mươi bốn phút đi bộ, năm tiếng rưỡi tham quan bên trong. Chọn cả mười sáu điểm hoặc nửa lộ trình trung tâm, rồi thả tuyến bạn muốn lên bản đồ chỉ với một chạm."],
    "Walk the trail →": ["走这条路 →", "Recorre el sendero →", "트레일 걷기 →", "Đi bộ trên con đường →"],
    "Universal Gallery": ["环球画廊", "Galería Universal", "유니버설 갤러리", "Phòng Trưng Bày Cho Mọi Người"],
    "For everyone standing in front of something": ["献给每一个站在作品前的人", "Para todos los que están parados frente a algo", "무언가 앞에 서 있는 모든 이를 위해", "Dành cho tất cả những ai đang đứng trước một tác phẩm"],
    "The Destination Book, but for exhibitions. Search any artwork by name, or by the number printed on its label when you cannot spell it or even read the language. It tells you where the piece hangs and what to notice while you are there.": ["就像目的地手册，只不过是为展览而做。按名字搜任何一件作品，或者当你拼不出、甚至看不懂那门语言时，就按标签上印的编号搜。它会告诉你作品挂在哪里，以及在现场该留意些什么。", "El Libro de Destinos, pero para exposiciones. Busca cualquier obra por su nombre, o por el número impreso en su ficha cuando no sabes cómo escribirlo o ni siquiera puedes leer el idioma. Te dice dónde está colgada la pieza y en qué fijarte mientras estás ahí.", "전시를 위한 데스티네이션 북입니다. 어떤 작품이든 이름으로 찾거나, 철자를 모르거나 언어조차 읽을 수 없을 때는 라벨에 적힌 번호로 찾으세요. 작품이 어디에 걸려 있는지, 그리고 그 앞에서 무엇을 눈여겨봐야 하는지 알려 줍니다.", "Giống Cuốn Sách Điểm Đến, nhưng dành cho các cuộc triển lãm. Tìm bất kỳ tác phẩm nào theo tên, hoặc theo con số in trên nhãn khi bạn không biết đánh vần, thậm chí không đọc được ngôn ngữ đó. Nó cho bạn biết tác phẩm được treo ở đâu và điều gì đáng chú ý khi bạn ở đó."],
    "Open the Gallery →": ["打开画廊 →", "Abre la Galería →", "갤러리 열기 →", "Mở Phòng Trưng Bày →"],
    "Your name, split in two": ["你的名字，一分为二", "Tu nombre, dividido en dos", "둘로 나뉜 당신의 이름", "Tên của bạn, tách làm hai"],
    "Your first name and your family name are locked in separate vaults with separate keys. Somebody who steals one is holding a surname that points at nobody. Looking up a whole name takes a signed-in owner, a written reason, and leaves a record that cannot be rubbed out.": ["你的名和你的姓，被锁在两个不同的保险库里，各配一把不同的钥匙。偷走其中一个的人，手里攥着的只是一个指不向任何人的姓。要查出完整的名字，得由登录的所有者本人、写明理由，还会留下一条抹不掉的记录。", "Tu nombre y tu apellido quedan guardados en bóvedas separadas con llaves separadas. Quien roba uno se queda con un apellido que no señala a nadie. Consultar un nombre completo requiere un titular con sesión iniciada, un motivo por escrito, y deja un registro que no se puede borrar.", "당신의 이름과 성은 서로 다른 열쇠로 각각 다른 금고에 잠겨 있습니다. 그중 하나를 훔친 사람은 아무도 가리키지 않는 성 하나만을 쥐게 됩니다. 이름 전체를 조회하려면 로그인한 소유자와 서면 사유가 필요하며, 지울 수 없는 기록이 남습니다.", "Tên gọi và họ của bạn được khóa trong hai két riêng biệt với hai chìa khóa riêng. Kẻ đánh cắp một phần chỉ nắm được một cái họ chẳng chỉ đến ai. Việc tra cứu một cái tên đầy đủ đòi hỏi chủ nhân đã đăng nhập, một lý do bằng văn bản, và để lại một dấu vết không thể xóa bỏ."],
    "How it works": ["运作方式", "Cómo funciona", "작동 방식", "Cách hoạt động"],
    "Narrow this list…": ["筛选这个列表……", "Filtra esta lista…", "이 목록 좁히기…", "Thu hẹp danh sách này…"],
    "The Freedom Trail, Plateau Strategy Solution Lab": ["自由之路，Plateau Strategy Solution Lab", "El Freedom Trail, Plateau Strategy Solution Lab", "프리덤 트레일, Plateau Strategy Solution Lab", "Con Đường Tự Do, Plateau Strategy Solution Lab"],
    "Measuring the walk…": ["正在测算这段路……", "Midiendo el recorrido…", "걷는 거리 측정 중…", "Đang đo quãng đường đi bộ…"],
    "In English": ["英文", "En inglés", "영어로", "Bằng tiếng Anh"],
    "All sixteen": ["全部十六处", "Los dieciséis", "전체 16곳", "Cả mười sáu điểm"],
    "Downtown half": ["市中心一半", "Mitad del centro", "다운타운 절반", "Nửa trung tâm"],
    "Lock these stops and walk": ["锁定这些站点，开始步行", "Fija estas paradas y camina", "이 코스를 고정하고 걷기", "Khóa các điểm dừng này và bắt đầu đi"],
    "Your route is locked. Share your location and the page itself becomes the map, moving with you, while you read and play each stop over it.": ["你的路线已锁定。分享你的位置，这个页面本身就会变成地图，随你一起移动，你可以在它上面一边读、一边播放每一站。", "Tu ruta está fijada. Comparte tu ubicación y la página misma se convierte en el mapa, moviéndose contigo, mientras lees y reproduces cada parada sobre ella.", "경로가 고정되었습니다. 위치를 공유하면 페이지 자체가 지도가 되어 당신과 함께 움직이고, 그 위에서 각 장소를 읽고 즐길 수 있습니다.", "Lộ trình của bạn đã được khóa. Chia sẻ vị trí và chính trang này sẽ trở thành bản đồ, di chuyển theo bạn, trong khi bạn đọc và trải nghiệm từng điểm dừng ngay trên đó."],
    "Before the map follows you": ["在地图开始跟随你之前", "Antes de que el mapa te siga", "지도가 당신을 따라오기 전에", "Trước khi bản đồ đi theo bạn"],
    "Your position is read by your own browser and drawn on the map in front of you.": ["你的位置由你自己的浏览器读取，并画在你眼前的地图上。", "Tu posición la lee tu propio navegador y se dibuja en el mapa que tienes enfrente.", "당신의 위치는 당신의 브라우저가 직접 읽어, 눈앞의 지도 위에 그려집니다.", "Vị trí của bạn được chính trình duyệt của bạn đọc và vẽ lên bản đồ ngay trước mặt bạn."],
    "It is": ["它", "Nunca", "이 정보는", "Nó"],
    "never sent to us": ["绝不会发送给我们", "se nos envía", "절대 저희에게 전송되지 않습니다", "không bao giờ được gửi cho chúng tôi"],
    ". No position leaves this phone.": ["。任何位置都不会离开这部手机。", ". Ninguna posición sale de este teléfono.", ". 어떤 위치도 이 휴대전화를 벗어나지 않습니다.", ". Không vị trí nào rời khỏi chiếc điện thoại này."],
    "Your footprints are kept in this browser so you can see the walk you did, and you can erase them at any time.": ["你的足迹保存在这个浏览器里，方便你回看自己走过的路，你也可以随时把它们抹掉。", "Tus huellas se guardan en este navegador para que puedas ver el recorrido que hiciste, y puedes borrarlas en cualquier momento.", "당신의 발자취는 이 브라우저에 저장되어 걸었던 길을 다시 볼 수 있고, 언제든지 지울 수 있습니다.", "Dấu chân của bạn được lưu trong trình duyệt này để bạn có thể xem lại quãng đường đã đi, và bạn có thể xóa chúng bất cứ lúc nào."],
    "The page counts steps for the trail's public total, as a plain number. Where you are is never part of it.": ["这个页面会为这条路的公开总数计步，只是一个简单的数字。你在哪里，从来不在其中。", "La página cuenta los pasos para el total público del sendero, como un simple número. Dónde estás nunca forma parte de eso.", "이 페이지는 트레일의 공개 합계를 위해 걸음 수를 단순한 숫자로만 집계합니다. 당신이 어디에 있는지는 여기에 절대 포함되지 않습니다.", "Trang này đếm số bước cho tổng số công khai của con đường, chỉ dưới dạng một con số đơn thuần. Vị trí của bạn không bao giờ nằm trong đó."],
    "Close the page and the following stops.": ["关闭页面，跟随就会停止。", "Cierra la página y el seguimiento se detiene.", "페이지를 닫으면 따라오기도 함께 멈춥니다.", "Đóng trang thì việc bám theo các điểm dừng cũng dừng lại."],
    "I agree, follow me": ["我同意，跟随我", "Acepto, sígueme", "동의합니다, 따라오세요", "Tôi đồng ý, hãy đi theo tôi"],
    "No thanks": ["不用了，谢谢", "No, gracias", "괜찮습니다", "Không, cảm ơn"],
    "Follow me with the map": ["用地图跟随我", "Sígueme con el mapa", "지도로 나를 따라오기", "Bám theo tôi bằng bản đồ"],
    "Edit the stops": ["编辑站点", "Editar las paradas", "코스 편집", "Chỉnh sửa các điểm dừng"],
    "Erase my footprints": ["抹去我的足迹", "Borrar mis huellas", "내 발자취 지우기", "Xóa dấu chân của tôi"],
    "More in Boston": ["波士顿更多去处", "Más en Boston", "보스턴 더 보기", "Khám phá thêm ở Boston"],
    "Distances measured between the sites themselves, so the walk on the ground is a little longer than the straight line. Times inside are what a visitor who reads the room actually spends, not the minimum. Hours change by season, check before you go.": ["距离是按各遗址之间本身测量的，所以实际走在路上会比直线略长一点。室内的时间，是一个愿意细看的游客真正会花的时间，不是最低限度。开放时间随季节变化，出发前请先查一下。", "Las distancias se miden entre los sitios mismos, así que la caminata real es un poco más larga que la línea recta. Los tiempos en interiores son lo que de verdad pasa un visitante que se toma su tiempo para observar, no el mínimo. Los horarios cambian según la temporada, revísalos antes de ir.", "거리는 각 장소 사이를 직접 잰 값이므로, 실제로 걷는 길은 직선거리보다 조금 더 깁니다. 실내 시간은 전시를 찬찬히 살펴보는 방문객이 실제로 보내는 시간이지, 최소 시간이 아닙니다. 운영 시간은 계절에 따라 달라지니, 가기 전에 확인하세요.", "Khoảng cách được đo giữa chính các địa điểm với nhau, nên quãng đường đi bộ thực tế dài hơn một chút so với đường thẳng. Thời gian bên trong là mức mà một du khách chịu khó tìm hiểu thực sự bỏ ra, chứ không phải mức tối thiểu. Giờ mở cửa thay đổi theo mùa, hãy kiểm tra trước khi đi."],
    "Boston Common": ["波士顿公园", "Boston Common", "보스턴 코먼", "Boston Common"],
    "Massachusetts State House": ["马萨诸塞州议会大厦", "Massachusetts State House", "매사추세츠 주 의사당", "Massachusetts State House"],
    "Park Street Church": ["帕克街教堂", "Park Street Church", "파크 스트리트 교회", "Park Street Church"],
    "Granary Burying Ground": ["谷仓公墓", "Granary Burying Ground", "그래너리 묘지", "Granary Burying Ground"],
    "King's Chapel": ["金斯教堂", "King's Chapel", "킹스 채플", "King's Chapel"],
    "Boston Latin School site": ["波士顿拉丁学校旧址", "Boston Latin School site", "보스턴 라틴 스쿨 터", "Di tích trường Boston Latin School"],
    "Old Corner Bookstore": ["老角落书店", "Old Corner Bookstore", "올드 코너 서점", "Old Corner Bookstore"],
    "Old South Meeting House": ["老南会议堂", "Old South Meeting House", "올드 사우스 집회소", "Old South Meeting House"],
    "Old State House": ["老州议会大厦", "Old State House", "올드 스테이트 하우스", "Old State House"],
    "Boston Massacre Site": ["波士顿大屠杀遗址", "Boston Massacre Site", "보스턴 학살 현장", "Địa điểm Thảm sát Boston"],
    "Faneuil Hall": ["法尼尔厅", "Faneuil Hall", "패네일 홀", "Faneuil Hall"],
    "Paul Revere House": ["保罗·里维尔故居", "Paul Revere House", "폴 리비어 하우스", "Paul Revere House"],
    "Old North Church": ["老北教堂", "Old North Church", "올드 노스 교회", "Old North Church"],
    "Copp's Hill Burying Ground": ["科普斯山公墓", "Copp's Hill Burying Ground", "콥스 힐 묘지", "Copp's Hill Burying Ground"],
    "USS Constitution": ["宪法号", "USS Constitution", "USS 컨스티튜션", "USS Constitution"],
    "Bunker Hill Monument": ["邦克山纪念碑", "Bunker Hill Monument", "벙커 힐 기념탑", "Bunker Hill Monument"],
    "Where the trail starts, and America's oldest public park. Militia drilled here, cows grazed here until 1830, and the redcoats camped here before Lexington.": ["这条路的起点，也是全美最古老的公共公园。民兵曾在这里操练，牛群一直在这里吃草到一八三〇年，红衫军进军列克星敦前也在这里扎过营。", "Donde empieza el sendero, y el parque público más antiguo de Estados Unidos. Aquí entrenaba la milicia, aquí pastaban las vacas hasta 1830, y aquí acamparon los casacas rojas antes de Lexington.", "트레일이 시작되는 곳이자 미국에서 가장 오래된 공원입니다. 이곳에서 민병대가 훈련했고, 1830년까지 소가 풀을 뜯었으며, 영국군은 렉싱턴 전투에 앞서 이곳에 진을 쳤습니다.", "Nơi con đường bắt đầu, và là công viên công cộng lâu đời nhất nước Mỹ. Dân quân từng luyện tập ở đây, bò gặm cỏ ở đây cho đến năm 1830, và quân áo đỏ đóng trại ở đây trước trận Lexington."],
    "The gold dome above the Common, finished 1798 on John Hancock's cow pasture. The dome was wood, then copper rolled by Paul Revere, and it is gold leaf now.": ["公园上方那座金色圆顶，一七九八年建成，就盖在约翰·汉考克的牧牛地上。圆顶最初是木头的，后来换成保罗·里维尔轧制的铜板，如今贴的是金箔。", "La cúpula dorada sobre el Common, terminada en 1798 en el pastizal de vacas de John Hancock. La cúpula fue de madera, luego de cobre laminado por Paul Revere, y ahora es de pan de oro.", "코먼 위로 솟은 금빛 돔으로, 존 핸콕의 소 목장 자리에 1798년 완공되었습니다. 돔은 처음엔 나무였다가 폴 리비어가 압연한 구리로 바뀌었고, 지금은 금박을 입혔습니다.", "Mái vòm vàng phía trên Boston Common, hoàn thành năm 1798 trên bãi chăn bò của John Hancock. Mái vòm ban đầu bằng gỗ, sau đó là đồng do Paul Revere cán, và giờ đây được dát vàng."],
    "The corner was once the town granary, then a powder store in 1812, which is why locals called it Brimstone Corner. America Is My Country was first sung here in 1831.": ["这个街角曾是小镇的谷仓，一八一二年又成了火药库，本地人因此叫它硫磺角。《我的祖国》一八三一年头一回就在这里唱响。", "La esquina fue en su momento el granero del pueblo, luego un depósito de pólvora en 1812, por lo que los lugareños la llamaban Brimstone Corner. America Is My Country se cantó por primera vez aquí en 1831.", "이 모퉁이는 한때 마을 곡물창고였다가 1812년에는 화약고가 되었고, 그래서 주민들은 이곳을 브림스톤 코너(유황 모퉁이)라 불렀습니다. 'America Is My Country'가 1831년 이곳에서 처음 불렸습니다.", "Góc phố này từng là kho lúa của thị trấn, rồi thành kho thuốc súng vào năm 1812, đó là lý do người địa phương gọi nó là Brimstone Corner. Bài America Is My Country lần đầu tiên được hát ở đây vào năm 1831."],
    "Samuel Adams, John Hancock, Paul Revere and the five who died in the Boston Massacre are all in this one small yard. The headstones were rearranged for lawnmowers, so the stones and the graves no longer match.": ["塞缪尔·亚当斯、约翰·汉考克、保罗·里维尔，还有在波士顿大屠杀中丧生的五个人，都葬在这一座小小的院子里。墓碑曾为了方便割草而重新排列，所以石碑和坟墓的位置已经对不上了。", "Samuel Adams, John Hancock, Paul Revere y los cinco que murieron en la Masacre de Boston están todos en este pequeño camposanto. Las lápidas se reacomodaron para las podadoras de césped, así que las piedras y las tumbas ya no coinciden.", "새뮤얼 애덤스, 존 핸콕, 폴 리비어, 그리고 보스턴 학살로 목숨을 잃은 다섯 사람이 모두 이 작은 묘지 한 곳에 잠들어 있습니다. 잔디 깎는 기계를 위해 묘비를 다시 배치한 탓에, 이제 비석과 실제 무덤은 서로 맞지 않습니다.", "Samuel Adams, John Hancock, Paul Revere và năm người thiệt mạng trong vụ Thảm sát Boston đều nằm trong khoảnh sân nhỏ này. Các bia mộ đã bị sắp xếp lại cho vừa với máy cắt cỏ, nên bia và mộ không còn khớp với nhau nữa."],
    "The first Anglican church in Puritan Boston, deeply unwelcome, so it was built around the old wooden one and the timber was thrown out the windows. The bell is Revere's largest.": ["清教徒波士顿里第一座圣公会教堂，极不受欢迎，于是新堂绕着旧木堂盖起来，木料再从窗户里扔出去。堂里那口钟是里维尔铸过的最大一口。", "La primera iglesia anglicana en el Boston puritano, muy mal recibida, así que se construyó alrededor de la vieja iglesia de madera y los tablones se arrojaron por las ventanas. La campana es la más grande de Revere.", "청교도의 도시 보스턴에 세워진 최초의 성공회 교회로, 몹시 환영받지 못했습니다. 그래서 기존의 낡은 목조 교회를 감싸듯 새로 지은 뒤 안쪽의 목재를 창밖으로 내던졌습니다. 종은 리비어가 만든 것 중 가장 큽니다.", "Nhà thờ Anh giáo đầu tiên giữa Boston của những người Thanh giáo, bị ghẻ lạnh sâu sắc, nên nó được xây bao quanh nhà thờ gỗ cũ và số gỗ được ném ra ngoài cửa sổ. Quả chuông là chiếc lớn nhất mà Revere từng đúc."],
    "The first public school in America, 1635. Benjamin Franklin went here and did not graduate. His statue stands on the spot.": ["美国第一所公立学校，一六三五年创办。本杰明·富兰克林在这里念过书，却没毕业。他的雕像就立在原址上。", "La primera escuela pública de Estados Unidos, 1635. Benjamin Franklin estudió aquí y no se graduó. Su estatua está en el lugar.", "1635년에 세워진 미국 최초의 공립학교입니다. 벤저민 프랭클린이 이곳을 다녔지만 졸업하지는 못했습니다. 그 자리에 그의 동상이 서 있습니다.", "Ngôi trường công đầu tiên ở nước Mỹ, năm 1635. Benjamin Franklin từng học ở đây và không tốt nghiệp. Bức tượng của ông đứng ngay tại vị trí này."],
    "The oldest commercial building downtown, 1718, and the publishing house that printed Hawthorne, Emerson, Longfellow and Stowe. It is a Chipotle now, which locals will tell you about at length.": ["市中心最古老的商用建筑，一七一八年所建，也是那家出版了霍桑、爱默生、朗费罗和斯托的出版社所在地。如今是一家墨西哥快餐店，本地人会跟你念叨个没完。", "El edificio comercial más antiguo del centro, 1718, y la editorial que imprimió a Hawthorne, Emerson, Longfellow y Stowe. Ahora es un Chipotle, algo que los lugareños te contarán con lujo de detalles.", "1718년에 지어진 다운타운에서 가장 오래된 상업용 건물로, 호손, 에머슨, 롱펠로, 스토를 펴낸 출판사가 있던 곳입니다. 지금은 치폴레 매장이 되었는데, 주민들이 이 이야기를 길게 늘어놓곤 합니다.", "Tòa nhà thương mại lâu đời nhất khu trung tâm, năm 1718, và là nhà xuất bản từng in tác phẩm của Hawthorne, Emerson, Longfellow và Stowe. Giờ nó là một tiệm Chipotle, điều mà người địa phương sẽ kể cho bạn nghe rất dài dòng."],
    "Five thousand colonists packed in here on 16 December 1773, could not get the tea sent back, and walked out to the harbour. The Tea Party started in this room.": ["一七七三年十二月十六日，五千名殖民地居民挤在这里，没能把茶叶退回去，便集体走向海港。茶党运动就从这个房间开始。", "Cinco mil colonos se apiñaron aquí el 16 de diciembre de 1773, no lograron que devolvieran el té, y salieron hacia el puerto. El Motín del Té empezó en esta sala.", "1773년 12월 16일, 5천 명의 식민지 주민이 이곳을 가득 메웠지만 차를 돌려보내지 못하자 항구로 걸어 나갔습니다. 보스턴 차 사건은 바로 이 방에서 시작되었습니다.", "Năm nghìn người thuộc địa chen chúc ở đây vào ngày 16 tháng 12 năm 1773, không thể buộc trả lại số trà, và kéo nhau ra bến cảng. Tiệc Trà Boston bắt đầu từ căn phòng này."],
    "The oldest surviving public building in Boston, 1713, with the lion and unicorn still on the gable. The Declaration of Independence was read from that balcony in 1776 and is read from it every Fourth of July.": ["波士顿现存最古老的公共建筑，一七一三年所建，山墙上至今立着狮子和独角兽。一七七六年，《独立宣言》从那道阳台上宣读，此后每年七月四日都会在那里再读一遍。", "El edificio público más antiguo que se conserva en Boston, 1713, con el león y el unicornio todavía en el frontón. La Declaración de Independencia se leyó desde ese balcón en 1776 y se lee desde ahí cada Cuatro de Julio.", "1713년에 지어진, 보스턴에 현존하는 가장 오래된 공공건물로, 박공에는 사자와 유니콘이 여전히 남아 있습니다. 1776년 저 발코니에서 독립선언서가 낭독되었고, 지금도 매년 7월 4일마다 그곳에서 낭독됩니다.", "Tòa nhà công cộng cổ nhất còn tồn tại ở Boston, năm 1713, với hình sư tử và kỳ lân vẫn còn trên đầu hồi. Bản Tuyên ngôn Độc lập đã được đọc từ ban công đó vào năm 1776 và vẫn được đọc từ đó vào mỗi dịp Quốc khánh mùng 4 tháng 7."],
    "A ring of cobblestones in a traffic island. Five men died here on 5 March 1770, and John Adams defended the soldiers in court because he thought the trial mattered more than the verdict.": ["交通岛上一圈鹅卵石。一七七〇年三月五日，五个人死在这里。约翰·亚当斯出庭为那些士兵辩护，因为在他看来，审判本身比判决结果更要紧。", "Un círculo de adoquines en una isleta de tráfico. Cinco hombres murieron aquí el 5 de marzo de 1770, y John Adams defendió a los soldados en el tribunal porque pensaba que el juicio importaba más que el veredicto.", "교통섬 위에 놓인 자갈돌 원형 표식입니다. 1770년 3월 5일 이곳에서 다섯 사람이 목숨을 잃었고, 존 애덤스는 판결보다 재판 자체가 더 중요하다고 여겨 법정에서 그 군인들을 변호했습니다.", "Một vòng đá cuội trên một đảo giao thông. Năm người đàn ông đã chết ở đây vào ngày 5 tháng 3 năm 1770, và John Adams đã bào chữa cho những người lính tại tòa vì ông cho rằng phiên xử quan trọng hơn phán quyết."],
    "The meeting hall where the argument for revolution was made out loud, 1742, with the grasshopper weather vane still on top. Food stalls downstairs, the hall itself upstairs and free.": ["革命的道理就是在这座会议厅里被大声讲出来的，一七四二年所建，顶上那只蚱蜢风向标至今还在。楼下是食摊，楼上就是那座大厅，免费开放。", "El salón de reuniones donde se defendió en voz alta la causa de la revolución, 1742, con la veleta en forma de saltamontes todavía en lo alto. Puestos de comida en la planta baja, el salón en sí arriba y gratis.", "혁명을 향한 주장이 공공연히 울려 퍼진 집회장으로, 1742년에 세워졌고 꼭대기에는 메뚜기 모양 풍향계가 지금도 달려 있습니다. 아래층에는 먹거리 가판대가, 위층에는 집회장이 있으며 입장은 무료입니다.", "Hội trường nơi lời kêu gọi cách mạng được nói lên thành tiếng, năm 1742, với chiếc chong chóng gió hình châu chấu vẫn còn trên đỉnh. Các quầy ăn ở tầng dưới, còn hội trường thì ở tầng trên và vào cửa miễn phí."],
    "The oldest house in downtown Boston, about 1680, and he owned it on the night of the ride. Small, dark, low ceilings, and the most convincing room on the whole trail.": ["波士顿市中心最古老的房子，约一六八〇年所建，骑行那一夜它正是里维尔的家。小、暗、天花板低矮，却是整条路上最令人信服的一处。", "La casa más antigua del centro de Boston, hacia 1680, y él era su dueño la noche de la cabalgata. Pequeña, oscura, de techos bajos, y la habitación más convincente de todo el sendero.", "1680년경에 지어진 보스턴 다운타운에서 가장 오래된 집으로, 그가 그 유명한 야간 질주가 있던 밤에 살던 집입니다. 작고 어둡고 천장이 낮지만, 트레일 전체에서 가장 생생하게 그 시대를 느끼게 하는 방입니다.", "Ngôi nhà cổ nhất ở khu trung tâm Boston, khoảng năm 1680, và ông sở hữu nó vào đêm diễn ra cuộc phi ngựa. Nhỏ, tối, trần thấp, và là căn phòng chân thực nhất trên cả con đường."],
    "One if by land, two if by sea. The two lanterns were hung in this steeple for about a minute on 18 April 1775, long enough to be seen across the water and not long enough to be caught.": ["陆路来一盏，水路来两盏。一七七五年四月十八日，两盏灯笼在这座尖塔里挂了大约一分钟，刚够对岸看清，又短到不会被抓住。", "Una si vienen por tierra, dos si vienen por mar. Los dos faroles se colgaron en este campanario durante cerca de un minuto el 18 de abril de 1775, el tiempo suficiente para verse al otro lado del agua y no lo bastante para que los atraparan.", "육로로 오면 하나, 바닷길로 오면 둘. 1775년 4월 18일, 이 첨탑에 두 개의 등불이 약 1분간 내걸렸는데, 물 건너에서 보이기에는 충분했지만 발각되기에는 짧은 시간이었습니다.", "Một nếu bằng đường bộ, hai nếu bằng đường biển. Hai chiếc đèn lồng được treo trên gác chuông này trong khoảng một phút vào ngày 18 tháng 4 năm 1775, đủ lâu để được nhìn thấy bên kia mặt nước và không đủ lâu để bị bắt."],
    "The high ground the British used to shell Charlestown during Bunker Hill. Headstones here still carry musket damage from redcoats using them as targets.": ["邦克山之战时，英国人就是从这处高地炮击查尔斯顿的。这里的墓碑至今还留着红衫军拿它们当靶子时打出的火枪弹痕。", "La zona alta que los británicos usaron para bombardear Charlestown durante Bunker Hill. Las lápidas de aquí todavía tienen daños de mosquete de cuando los casacas rojas las usaban como blanco.", "벙커 힐 전투 당시 영국군이 찰스타운을 포격하는 데 이용한 고지대입니다. 이곳 묘비에는 영국군이 표적으로 삼아 생긴 총탄 자국이 지금도 남아 있습니다.", "Khu đất cao mà quân Anh dùng để nã pháo vào Charlestown trong trận Bunker Hill. Những tấm bia mộ ở đây vẫn còn dấu vết đạn súng hỏa mai, do quân áo đỏ dùng chúng làm bia tập bắn."],
    "Old Ironsides, launched 1797, still a commissioned Navy ship and the oldest warship afloat anywhere. Active duty sailors give the tours. Bring photo identification.": ["老铁甲舰，一七九七年下水，至今仍是一艘美国海军现役军舰，也是全世界仍在漂浮的最古老战舰。带你参观的是现役水兵。请携带带照片的证件。", "Old Ironsides, botado en 1797, todavía un buque en servicio de la Marina y el buque de guerra a flote más antiguo del mundo. Marineros en servicio activo dan los recorridos. Lleva una identificación con foto.", "1797년 진수된 올드 아이언사이즈로, 지금도 미 해군의 현역 함정이자 세계에서 가장 오래된 현역 군함입니다. 현역 수병들이 직접 안내해 줍니다. 사진이 있는 신분증을 지참하세요.", "Old Ironsides, hạ thủy năm 1797, vẫn là một tàu chiến đang biên chế của Hải quân và là chiến hạm còn nổi cổ nhất trên thế giới. Các thủy thủ tại ngũ sẽ hướng dẫn tham quan. Hãy mang theo giấy tờ tùy thân có ảnh."],
    "The end of the trail, and 294 steps with no lift. The battle was actually fought on Breed's Hill, the colonists lost, and it still convinced everyone the war was winnable.": ["这条路的终点，两百九十四级台阶，没有电梯。那场仗其实是在布里德山上打的，殖民地一方输了，却仍让所有人相信这场战争打得赢。", "El final del sendero, y 294 escalones sin ascensor. La batalla en realidad se libró en Breed's Hill, los colonos perdieron, y aun así convenció a todos de que la guerra se podía ganar.", "트레일의 종점이자, 엘리베이터 없이 올라야 하는 294개의 계단입니다. 실제 전투는 브리즈 힐에서 벌어졌고 식민지군은 패했지만, 그럼에도 모두에게 이 전쟁에서 이길 수 있다는 확신을 심어 주었습니다.", "Điểm cuối của con đường, và 294 bậc thang không có thang máy. Trận đánh thực ra diễn ra trên đồi Breed's Hill, phe thuộc địa thua trận, nhưng nó vẫn khiến mọi người tin rằng cuộc chiến có thể thắng được."],

    # ---- Atlas scout + the demand board (2026-08-17) ----
    "Guide demand →": ["指南需求 →", "Demanda de la guía →", "가이드 수요 →", "Nhu cầu từ hướng dẫn →"],
    "What the free guide is proving · the page to show an affiliate programme": [
        "免费指南正在证明什么 · 拿给联盟计划看的页面",
        "Lo que la guía gratuita está demostrando · la página para enseñar a un programa de afiliados",
        "무료 가이드가 증명하고 있는 것 · 제휴 프로그램에 보여줄 페이지",
        "Điều hướng dẫn miễn phí đang chứng minh · trang để trình bày với một chương trình liên kết"],
    "What the free guide is proving": ["免费指南正在证明什么", "Lo que la guía gratuita está demostrando",
        "무료 가이드가 증명하고 있는 것", "Điều hướng dẫn miễn phí đang chứng minh"],
    "Scout: find organizations worth calling, from the map, each with a way to reach them. Everything found lands as": [
        "探路：从地图上找出值得致电的机构，每一家都有联系方式。找到的都会先列为",
        "Explorador: encuentra en el mapa organizaciones que merece la pena llamar, cada una con una forma de contacto. Todo lo encontrado queda como",
        "스카우트: 지도에서 전화할 가치가 있는 조직을 찾습니다. 모두 연락할 방법이 있으며, 찾은 것은 모두 다음 상태로 들어갑니다",
        "Trinh sát: tìm trên bản đồ những tổ chức đáng gọi, mỗi nơi đều có cách liên hệ. Tất cả tìm được sẽ nằm ở trạng thái"],
    "to contact": ["待联系", "por contactar", "연락 예정", "cần liên hệ"],
    ", nobody is contacted here.": ["，这里不会替您联系任何人。", ", aquí no se contacta a nadie.",
        ", 여기서는 아무에게도 연락하지 않습니다.", ", ở đây không ai bị liên hệ cả."],
    "Area": ["区域", "Zona", "지역", "Khu vực"],
    "Radius": ["范围", "Radio", "반경", "Bán kính"],
    "3 km": ["3 公里", "3 km", "3 km", "3 km"],
    "8 km": ["8 公里", "8 km", "8 km", "8 km"],
    "15 km": ["15 公里", "15 km", "15 km", "15 km"],
    "25 km": ["25 公里", "25 km", "25 km", "25 km"],
    "Looking for": ["寻找对象", "Qué buscar", "찾는 대상", "Tìm loại nào"],
    "\U0001F52D Send the scout": ["\U0001F52D 派出探路", "\U0001F52D Enviar el explorador",
        "\U0001F52D 스카우트 보내기", "\U0001F52D Cử trinh sát đi"],
    # ---- Inside the Met, the footprint map ----
    'Inside the Met': ['走进大都会博物馆', 'Dentro del Met', '메트로폴리탄 미술관 내부', 'Bên trong bảo tàng Met'],
    'For museum days in New York': ['适合在纽约逛博物馆的日子', 'Para días de museo en Nueva York', '뉴욕에서 미술관을 즐기는 날을 위해', 'Cho những ngày đi bảo tàng ở New York'],
    'A schematic indoor map of the Metropolitan Museum. Tap the rooms you want, and footprints walk the route between them with honest times.': ['一张大都会博物馆的室内示意图。点选您想去的展厅，脚印会沿着展厅之间的路线走出来，并给出诚实的时间。', 'Un plano interior esquemático del Museo Metropolitano. Toque las salas que quiera, y unas huellas recorren la ruta entre ellas con tiempos honestos.', '메트로폴리탄 미술관의 실내 개념도입니다. 가고 싶은 전시실을 누르면 발자국이 그 사이 경로를 걸어가며 정직한 소요 시간을 보여 줍니다.', 'Sơ đồ trong nhà của bảo tàng Metropolitan. Chạm vào các phòng bạn muốn, và những dấu chân sẽ đi theo lộ trình giữa chúng với thời gian trung thực.'],
    'Walk the Met →': ['漫步大都会 →', 'Recorrer el Met →', '메트 걷기 →', 'Đi bộ trong Met →'],

    # ---- the Bot Lab debt, the shared-article chrome, the trade pages ----
    'Bot Lab': ['机器人实验室', 'Laboratorio de bots', '봇 연구실', 'Phòng thí nghiệm bot'],
    'Automated trading research, on paper trades only. Nothing here connects to an exchange, holds a key, or touches a balance. Access is issued directly and nothing is for sale.': ['自动化交易研究，仅使用模拟交易。这里不连接任何交易所，不保存任何密钥，也不触碰任何余额。访问权限由我们直接发放，且不出售任何东西。', 'Investigación de trading automatizado, solo con operaciones simuladas. Nada aquí se conecta a un mercado, guarda una clave ni toca un saldo. El acceso se concede directamente y nada está a la venta.', '자동 매매 연구이며, 모의 거래만 사용합니다. 이곳의 어떤 것도 거래소에 연결되지 않고, 키를 보관하지 않으며, 잔고를 건드리지 않습니다. 접근 권한은 직접 발급되며 판매되는 것은 없습니다.', 'Nghiên cứu giao dịch tự động, chỉ trên giao dịch giả lập. Không có gì ở đây kết nối với sàn, giữ khóa hay chạm vào số dư. Quyền truy cập được cấp trực tiếp và không có gì được rao bán.'],
    'Sign in →': ['登录 →', 'Iniciar sesión →', '로그인 →', 'Đăng nhập →'],
    'An idea we are testing with our own money: trading rules that run on their own, with anything they earn going against expensive debt instead of back into the market. It is not finished and it is not for sale.': ['我们正在用自己的钱验证的一个想法：让交易规则自动运行，赚到的钱用于偿还高息债务，而不是再投回市场。它尚未完成，也不出售。', 'Una idea que estamos probando con nuestro propio dinero: reglas de trading que funcionan solas, y lo que ganan se destina a pagar deuda cara en lugar de volver al mercado. No está terminada y no está a la venta.', '우리 돈으로 직접 검증 중인 아이디어입니다: 스스로 돌아가는 매매 규칙이 번 돈을 시장에 재투자하는 대신 비싼 빚을 갚는 데 씁니다. 아직 완성되지 않았고 판매하지도 않습니다.', 'Một ý tưởng chúng tôi đang thử nghiệm bằng tiền của chính mình: các quy tắc giao dịch tự vận hành, số tiền kiếm được dùng để trả nợ lãi cao thay vì quay lại thị trường. Nó chưa hoàn thiện và không được rao bán.'],
    'A set of trading rules runs for a fixed window': ['一组交易规则在固定时间窗内运行', 'Un conjunto de reglas de trading funciona durante una ventana fija', '매매 규칙 한 세트가 정해진 기간 동안 실행됩니다', 'Một bộ quy tắc giao dịch chạy trong một khoảng thời gian cố định'],
    'Anything earned is set aside rather than traded again': ['赚到的钱被留存，而不是再次投入交易', 'Lo ganado se aparta en lugar de volver a operarse', '번 돈은 다시 거래에 쓰지 않고 따로 떼어 둡니다', 'Số tiền kiếm được được để riêng thay vì đem giao dịch tiếp'],
    'What was earned goes against the debt': ['赚到的钱用于偿还债务', 'Lo ganado se destina a la deuda', '번 돈은 빚을 갚는 데 쓰입니다', 'Số tiền kiếm được dùng để trả nợ'],
    'The balance comes back, and it can come back smaller, because trading loses as well as wins': ['本金会回来，但也可能变少，因为交易有赚也有亏', 'El saldo vuelve, y puede volver más pequeño, porque en el trading se pierde además de ganarse', '잔고는 돌아오지만 더 적게 돌아올 수도 있습니다. 매매는 이기기도 하고 지기도 하기 때문입니다', 'Số dư sẽ quay về, và có thể quay về ít hơn, vì giao dịch có thắng thì cũng có thua'],
    'Where this actually stands': ['目前的真实进展', 'En qué punto está realmente', '현재 실제 진행 상황', 'Hiện trạng thực sự'],
    'Not for sale.': ['不出售。', 'No está a la venta.', '판매하지 않습니다.', 'Không rao bán.'],
    'No price, no trial, no enrolment. Nothing on this page can take a payment, and the billing behind it is closed.': ['没有价格，没有试用，没有报名。此页面无法收取任何付款，其背后的计费通道已关闭。', 'Sin precio, sin prueba, sin inscripción. Nada en esta página puede cobrar un pago, y la facturación detrás está cerrada.', '가격도, 체험판도, 등록도 없습니다. 이 페이지에서는 어떤 결제도 이루어질 수 없으며, 뒤의 결제 시스템은 닫혀 있습니다.', 'Không giá bán, không dùng thử, không ghi danh. Không có gì trên trang này có thể nhận thanh toán, và hệ thống thu phí phía sau đã đóng.'],
    'No track record yet.': ['尚无业绩记录。', 'Aún sin historial.', '아직 실적 기록이 없습니다.', 'Chưa có thành tích.'],
    'We are not showing a return figure, because none has been earned. A number written down before it is earned is a promise.': ['我们不展示任何收益数字，因为还没有赚到。没赚到就写下的数字，只是一个承诺。', 'No mostramos una cifra de rentabilidad porque todavía no se ha ganado ninguna. Un número escrito antes de ganarse es una promesa.', '수익 숫자를 보여 드리지 않습니다. 아직 번 것이 없기 때문입니다. 벌기 전에 적어 둔 숫자는 약속일 뿐입니다.', 'Chúng tôi không đưa ra con số lợi nhuận, vì chưa kiếm được đồng nào. Con số viết ra trước khi kiếm được chỉ là một lời hứa.'],
    'Our own money only.': ['只用我们自己的钱。', 'Solo nuestro propio dinero.', '오직 우리 돈만 씁니다.', 'Chỉ dùng tiền của chính chúng tôi.'],
    "It runs on ours, not anyone else's, until it is proven and the legal structure is right.": ['在得到验证并且法律架构完善之前，它只用我们的钱运行，不用任何其他人的钱。', 'Funciona con el nuestro, no con el de nadie más, hasta que esté probado y la estructura legal sea la correcta.', '검증이 끝나고 법적 구조가 갖춰질 때까지, 이것은 다른 누구의 돈도 아닌 우리 돈으로만 돌아갑니다.', 'Nó chạy bằng tiền của chúng tôi, không phải của ai khác, cho đến khi được chứng minh và cấu trúc pháp lý hoàn chỉnh.'],
    'Automated trading can and does lose money, and a balance that has been traded can come back smaller than it went in. Nothing here is an offer to sell or a solicitation to buy any security or investment product, and nothing here is investment, legal or tax advice.': ['自动化交易可能亏钱，而且确实会亏钱；参与交易的本金回来时可能比投入时更少。此处内容不构成任何证券或投资产品的出售要约或购买邀约，也不构成投资、法律或税务建议。', 'El trading automatizado puede perder dinero, y lo pierde; un saldo que se ha operado puede volver más pequeño de lo que entró. Nada aquí es una oferta de venta ni una solicitud de compra de ningún valor o producto de inversión, y nada aquí es asesoramiento de inversión, legal o fiscal.', '자동 매매는 돈을 잃을 수 있고 실제로 잃기도 하며, 거래에 쓰인 잔고는 들어갈 때보다 적게 돌아올 수 있습니다. 이곳의 어떤 내용도 증권이나 투자 상품의 매도 제안 또는 매수 권유가 아니며, 투자, 법률, 세무 자문도 아닙니다.', 'Giao dịch tự động có thể và thực sự làm mất tiền, và số dư đã đem giao dịch có thể quay về ít hơn lúc bỏ vào. Không có gì ở đây là lời chào bán hay mời mua bất kỳ chứng khoán hoặc sản phẩm đầu tư nào, và không có gì ở đây là tư vấn đầu tư, pháp lý hay thuế.'],
    'Want this to exist? Leave your email and we will tell you if it ever becomes real.': ['希望它成真吗？留下您的邮箱，一旦它真正落地我们会告诉您。', '¿Quiere que esto exista? Deje su correo y le avisaremos si algún día se hace realidad.', '이것이 실현되길 바라시나요? 이메일을 남겨 주시면 실제로 이루어질 때 알려 드리겠습니다.', 'Muốn điều này thành hiện thực? Hãy để lại email và chúng tôi sẽ báo cho bạn nếu nó trở thành thật.'],
    'Fills your name and email. Nothing is stored.': ['自动填入您的姓名和邮箱。不存储任何信息。', 'Rellena su nombre y su correo. No se guarda nada.', '이름과 이메일을 채워 줍니다. 아무것도 저장되지 않습니다.', 'Điền sẵn tên và email của bạn. Không lưu gì cả.'],
    'or fill it in yourself': ['或自行填写', 'o rellénelo usted mismo', '또는 직접 입력하세요', 'hoặc tự điền'],
    '👣 Who counts as a visitor': ['👣 谁会被计为访客', '👣 Quién cuenta como visitante', '👣 방문자로 집계되는 사람', '👣 Ai được tính là khách truy cập'],
    'Keep the team out of the visitor numbers. Signing in here already stops this browser being counted, the rest is for your other devices, and for anyone on the team without a dispatch login.': ['把团队成员从访客数字中排除。在此登录后，这个浏览器就不再被计入，其余选项用于您的其他设备，以及团队中没有调度登录账号的人。', 'Mantenga al equipo fuera de las cifras de visitantes. Iniciar sesión aquí ya evita que este navegador se cuente; el resto es para sus otros dispositivos y para quien no tenga acceso al panel.', '팀원은 방문자 수에서 제외하세요. 여기 로그인하면 이 브라우저는 더 이상 집계되지 않습니다. 나머지는 다른 기기, 그리고 대시보드 로그인이 없는 팀원을 위한 것입니다.', 'Giữ đội ngũ ngoài số liệu khách truy cập. Đăng nhập ở đây đã ngăn trình duyệt này bị đếm; phần còn lại dành cho các thiết bị khác của bạn và những người trong đội không có tài khoản điều phối.'],
    'Anyone else on the team': ['团队中的其他人', 'Cualquier otra persona del equipo', '팀의 다른 사람', 'Bất kỳ ai khác trong đội'],
    "Send them this. One tap on the phone, no login, nothing installed. It works for drivers, agents, family, anyone whose visits should not read as a customer's.": ['把这个发给他们。手机上点一下即可，无需登录，无需安装。适用于司机、代理和家人，任何不应被当作客户访问的人。', 'Envíeles esto. Un toque en el teléfono, sin iniciar sesión, sin instalar nada. Sirve para conductores, agentes y familia: cualquiera cuyas visitas no deban contarse como las de un cliente.', '이것을 보내 주세요. 휴대폰에서 한 번 누르면 되고, 로그인도 설치도 필요 없습니다. 기사, 에이전트, 가족 등 고객 방문으로 집계되면 안 되는 모든 사람에게 적용됩니다.', 'Gửi cho họ cái này. Chạm một lần trên điện thoại, không cần đăng nhập, không cài gì. Dùng được cho tài xế, đại lý, người nhà: bất kỳ ai mà lượt truy cập không nên được tính như của khách hàng.'],
    'Copy link': ['复制链接', 'Copiar enlace', '링크 복사', 'Sao chép liên kết'],
    'Share this idea': ['分享这个创意', 'Compartir esta idea', '이 아이디어 공유', 'Chia sẻ ý tưởng này'],
    'See every idea': ['查看全部创意', 'Ver todas las ideas', '모든 아이디어 보기', 'Xem tất cả ý tưởng'],
    'Home': ['首页', 'Inicio', '홈', 'Trang chủ'],
    'Touches it, less certain': ['有所涉及，不太确定', 'Lo roza, menos seguro', '관련은 있으나 확실성 낮음', 'Có liên quan, ít chắc chắn hơn'],
    'Register as a professional': ['注册成为专业人士', 'Registrarse como profesional', '전문가로 등록', 'Đăng ký làm chuyên gia'],
    'See every trade being asked for': ['查看所有被需要的工种', 'Ver todos los oficios solicitados', '요청되는 모든 직종 보기', 'Xem tất cả ngành nghề đang được cần'],
    'If this is your licence, any idea above is work you can answer once and sell to everyone who needs the same answer. You set the price and keep most of it.': ['如果这正是您的执照，上面的每个创意都是您只需回答一次、就能卖给所有需要同一答案的人的工作。价格由您定，大部分收入归您。', 'Si esta es su licencia, cualquier idea de arriba es trabajo que puede responder una vez y vender a todos los que necesiten la misma respuesta. Usted fija el precio y se queda con la mayor parte.', '해당 면허를 보유하고 계시다면, 위의 모든 아이디어는 한 번만 답하고 같은 답이 필요한 모든 사람에게 판매할 수 있는 일입니다. 가격은 직접 정하시고 대부분을 가져가십니다.', 'Nếu đây là giấy phép của bạn, mỗi ý tưởng ở trên là công việc bạn có thể trả lời một lần và bán cho mọi người cần cùng câu trả lời. Bạn đặt giá và giữ phần lớn.'],
    'Likely needs': ['很可能需要', 'Probablemente necesita', '필요할 가능성 높음', 'Nhiều khả năng cần'],
    'Maybe': ['或许需要', 'Quizá', '아마도', 'Có thể'],
    'Every business': ['每家企业都需要', 'Todo negocio', '모든 사업', 'Mọi doanh nghiệp'],
    'No trades yet. The first idea posted will name some.': ['还没有工种。第一个发布的创意会带来一些。', 'Aún no hay oficios. La primera idea publicada nombrará algunos.', '아직 직종이 없습니다. 처음 게시되는 아이디어가 직종을 만듭니다.', 'Chưa có ngành nghề nào. Ý tưởng đầu tiên được đăng sẽ nêu ra.'],

    # ---- Reinvestment USA (the launchpad section) ----
    'A launchpad for someone with an idea and no company yet. You post what you want to build; the board works out which professionals it will take; those professionals publish an opinion you can buy.': ['为有想法但尚未成立公司的人而设的起点。您发布想做的项目，平台据此判断需要哪些专业人士，这些专业人士再发布可供购买的专业意见。', 'Un punto de partida para quien tiene una idea y todavía no tiene empresa. Usted publica lo que quiere construir; el tablero determina qué profesionales harán falta; esos profesionales publican una opinión que usted puede comprar.', '아이디어는 있지만 아직 회사가 없는 분을 위한 출발점입니다. 만들고 싶은 것을 올리면 게시판이 어떤 전문가가 필요한지 파악하고, 그 전문가들이 구매할 수 있는 의견을 게시합니다.', 'Bệ phóng cho người có ý tưởng nhưng chưa có công ty. Bạn đăng điều mình muốn xây dựng; bảng tin xác định cần những chuyên gia nào; các chuyên gia đó đăng ý kiến mà bạn có thể mua.'],
    'You post what you want to build': ['您发布想做的项目', 'Usted publica lo que quiere construir', '만들고 싶은 것을 올립니다', 'Bạn đăng điều mình muốn xây dựng'],
    'Free, and no account. You decide how much of it is public.': ['免费，无需注册账户。公开多少由您决定。', 'Gratis y sin cuenta. Usted decide qué parte es pública.', '무료이며 계정도 필요 없습니다. 어디까지 공개할지는 직접 정하십시오.', 'Miễn phí, không cần tài khoản. Bạn quyết định công khai đến đâu.'],
    'The board reads it for the trades it needs': ['平台从中识别所需的专业工种', 'El tablero lo lee para identificar los oficios que harán falta', '게시판이 필요한 직종을 읽어냅니다', 'Bảng tin đọc để nhận ra những ngành nghề cần đến'],
    'The attorney, the accountant, the contractor, the licence nobody mentioned. Each suggestion shows the words that prompted it, so you can see when it has guessed wrong.': ['律师、会计师、承包商，以及没有人提到的那张执照。每条建议都会显示触发它的词句，因此您能看出它何时判断有误。', 'El abogado, el contable, el contratista, la licencia que nadie mencionó. Cada sugerencia muestra las palabras que la provocaron, para que usted vea cuándo se ha equivocado.', '변호사, 회계사, 시공업체, 그리고 아무도 언급하지 않은 인허가까지. 각 제안은 그것을 촉발한 단어를 함께 보여 주므로 잘못 짚었을 때 바로 알 수 있습니다.', 'Luật sư, kế toán, nhà thầu, và giấy phép không ai nhắc đến. Mỗi gợi ý đều hiển thị những từ đã kích hoạt nó, để bạn thấy khi nào nó đoán sai.'],
    'A professional publishes an opinion, at their own price': ['专业人士发布意见，并自行定价', 'Un profesional publica una opinión, al precio que él mismo fija', '전문가가 직접 정한 가격으로 의견을 게시합니다', 'Chuyên gia đăng ý kiến, với mức giá do chính họ đặt'],
    'Written once and sold as many times as it is worth buying. The professional sets the price and keeps most of what it earns.': ['只需撰写一次，只要有人愿意购买便可反复售出。价格由专业人士自行决定，所得的大部分归其所有。', 'Se escribe una vez y se vende tantas veces como merezca comprarse. El profesional fija el precio y se queda con la mayor parte de lo que gana.', '한 번만 작성하고, 살 만한 가치가 있는 한 몇 번이든 판매됩니다. 가격은 전문가가 정하며 수익의 대부분을 가져갑니다.', 'Viết một lần và bán được bao nhiêu lần tùy vào giá trị của nó. Chuyên gia tự đặt giá và giữ phần lớn khoản thu.'],
    'Reading the board…': ['正在读取板块内容…', 'Leyendo el tablero…', '게시판을 읽는 중…', 'Đang đọc bảng tin…'],
    'Trades being asked for': ['正在被需要的工种', 'Oficios que se están pidiendo', '요청되고 있는 직종', 'Những ngành nghề đang được cần đến'],
    'Built from what people actually post here, not from a list somebody wrote in advance.': ['来自人们在此实际发布的内容，而非事先拟好的名单。', 'Se construye con lo que la gente publica realmente aquí, no con una lista escrita de antemano.', '미리 작성해 둔 목록이 아니라, 사람들이 실제로 여기에 올린 내용에서 만들어집니다.', 'Được dựng từ những gì mọi người thực sự đăng ở đây, không phải từ một danh sách viết sẵn.'],
    'See every trade →': ['查看全部工种 →', 'Ver todos los oficios →', '모든 직종 보기 →', 'Xem tất cả ngành nghề →'],
    'Opinions on offer': ['可供购买的专业意见', 'Opiniones a la venta', '판매 중인 의견', 'Các ý kiến đang được bán'],
    'Are you a licensed professional?': ['您是持照专业人士吗？', '¿Es usted un profesional con licencia?', '면허를 보유한 전문가이십니까?', 'Bạn có phải là chuyên gia có giấy phép hành nghề?'],
    'Publish once, and be paid every time it sells. Your licence is checked by hand before anything you write goes public.': ['只需发布一次，此后每售出一次即可获得报酬。在您所写的内容公开之前，我们会人工核验您的执照。', 'Publique una vez y cobre cada vez que se venda. Su licencia se verifica manualmente antes de que se publique nada de lo que escriba.', '한 번 게시하면 판매될 때마다 보수를 받습니다. 작성하신 내용이 공개되기 전에 면허를 직접 확인합니다.', 'Đăng một lần và được trả tiền mỗi khi bán được. Giấy phép của bạn được kiểm tra thủ công trước khi nội dung bạn viết được công bố.'],

    "At your service. Add any place, search above or tap a pin, and I’ll build your day sheet: miles, drive time, arrival, stay and closing time.": ["随时为您服务。您可在上方搜索或点击地图上的图钉添加任意地点，我会为您生成当日行程表：里程、车程、到达时间、停留时长与关门时间。", "A su servicio. Añada cualquier lugar, busque arriba o toque un pin en el mapa, y le prepararé la hoja del día: millas, tiempo de conducción, llegada, estancia y hora de cierre.", "무엇이든 도와드리겠습니다. 위에서 검색하거나 지도의 핀을 눌러 장소를 추가하시면 하루 일정표를 만들어 드립니다, 거리, 주행 시간, 도착 시각, 체류 시간, 폐장 시간.", "Sẵn sàng hỗ trợ bạn. Hãy thêm bất kỳ địa điểm nào, tìm ở trên hoặc chạm vào ghim trên bản đồ, và tôi sẽ lập bảng hành trình trong ngày: quãng đường, thời gian lái, giờ đến, thời gian dừng và giờ đóng cửa."],
    "I’m <b>Jarvis</b>. Add any place, search above or tap a pin, and I’ll build your day sheet.": ["我是 <b>Jarvis</b>。您可在上方搜索或点击地图上的图钉添加地点，我会为您生成当日行程表。", "Soy <b>Jarvis</b>. Añada cualquier lugar, busque arriba o toque un pin, y le prepararé la hoja del día.", "저는 <b>Jarvis</b>입니다. 위에서 검색하거나 핀을 눌러 장소를 추가하시면 하루 일정표를 만들어 드립니다.", "Tôi là <b>Jarvis</b>. Hãy thêm địa điểm, tìm ở trên hoặc chạm vào ghim, và tôi sẽ lập bảng hành trình trong ngày."],
    "Newest discovery:": ["最新发现：", "Descubrimiento más reciente:", "최근 발견:", "Địa điểm mới nhất:"],
    "One traveler planned a trip here this week": ["本周有一位旅客在此规划了行程", "Un viajero planificó un viaje aquí esta semana", "이번 주에 한 명이 이곳에서 여행을 계획했습니다", "Tuần này có một du khách lên kế hoạch tại đây"],
    "{n} travelers planned a trip here this week": ["本周有 {n} 位旅客在此规划了行程", "{n} viajeros planificaron un viaje aquí esta semana", "이번 주에 {n}명이 이곳에서 여행을 계획했습니다", "Tuần này có {n} du khách lên kế hoạch tại đây"],
    # ------- labels the pages assemble in JS, invisible to the text walker -------
    "{shown} of {total} destinations": ["共 {total} 处，显示 {shown} 处", "{shown} de {total} destinos", "전체 {total}곳 중 {shown}곳", "{shown} trong {total} địa điểm"],
    "Your route builds here: D1 → D2 → D3 …": ["您的行程将显示在这里：D1 → D2 → D3 …", "Su ruta se construye aquí: D1 → D2 → D3 …", "여기에 경로가 만들어집니다: D1 → D2 → D3 …", "Lộ trình của bạn sẽ hiện ở đây: D1 → D2 → D3 …"],
    "All categories": ["全部类别", "Todas las categorías", "전체 분류", "Tất cả danh mục"],
    "Other": ["其他", "Otros", "기타", "Khác"],
    # ------- flat-rate radius, and the booking fare estimate -------
    "$75 to Sea, Tac from anywhere within 30 miles, quoted before you book. Drivers rent our cars and keep the fare, hotels and agents earn commission for sending riders, and the trip-planning tools are free to anyone. Below: the three businesses that income is building, and where each one stands today.": ["30 英里范围内至西雅图-塔科马国际机场固定价 75 美元，预订前即告知。司机租用我们的车辆并保留全部车费，酒店与代理商推荐乘客可获得佣金，行程规划工具向所有人免费开放。以下为这笔收入正在建设的三项业务，以及各自目前的进展。", "75 $ al Sea, Tac desde cualquier punto en 30 millas, con el precio cerrado antes de reservar. Los conductores alquilan nuestros coches y se quedan con la tarifa, los hoteles y agentes cobran comisión por enviarnos pasajeros, y las herramientas de planificación son gratuitas para cualquiera. Debajo: los tres negocios que ese ingreso está construyendo, y en qué punto está cada uno hoy.", "30마일 이내 어디서든 시택 공항까지 75달러, 예약 전에 요금이 확정됩니다. 기사는 저희 차량을 임차해 요금 전액을 가져가고, 호텔과 에이전트는 승객을 연결하면 수수료를 받으며, 여행 계획 도구는 누구나 무료로 사용할 수 있습니다. 아래는 그 수익으로 만들어 가는 세 가지 사업과 각각의 현재 단계입니다.", "75 USD tới sân bay Sea, Tac từ bất kỳ đâu trong bán kính 30 dặm, báo giá trước khi đặt. Tài xế thuê xe của chúng tôi và giữ trọn tiền cước, khách sạn và đại lý nhận hoa hồng khi giới thiệu khách, còn các công cụ lập kế hoạch chuyến đi miễn phí cho tất cả mọi người. Dưới đây là ba mảng kinh doanh mà nguồn thu này đang xây dựng, cùng tiến độ hiện tại của từng mảng."],
    "Fixed-price Tesla rides at $75 to Sea, Tac from within 30 miles, cars rented to drivers who keep the fare, and commission for hotels and agents who send us riders. This is where the money comes from.": ["30 英里范围内至机场固定价 75 美元的特斯拉专车服务；向司机出租车辆，车费全额归司机所有；酒店与代理商推荐乘客可获得佣金。公司收入来源于此。", "Trayectos en Tesla a precio fijo, 75 $ al Sea, Tac desde 30 millas a la redonda; coches alquilados a conductores que se quedan con la tarifa; y comisión para hoteles y agentes que nos envían pasajeros. De aquí sale el dinero.", "30마일 이내에서 시택 공항까지 정액 75달러의 테슬라 차량 서비스, 요금 전액을 가져가는 기사 대상 차량 임대, 그리고 승객을 연결한 호텔과 에이전트에 지급하는 수수료. 수익은 여기에서 나옵니다.", "Dịch vụ xe Tesla giá cố định 75 USD tới sân bay Sea, Tac trong bán kính 30 dặm, cho tài xế thuê xe và giữ trọn tiền cước, cùng hoa hồng cho khách sạn và đại lý giới thiệu khách. Nguồn thu đến từ đây."],
    "Book a ride, $75 flat to Sea, Tac within 30 mi": ["预约用车, 30 英里内至机场固定价 75 美元", "Reservar, 75 $ fijos al Sea, Tac en 30 mi", "차량 예약, 30마일 이내 시택 공항 정액 75달러", "Đặt xe, 75 USD cố định tới Sea, Tac trong 30 dặm"],
    "flat to Sea, Tac, from anywhere within 30 miles": ["30 英里内至机场，均为固定价", "fijos al Sea, Tac, desde cualquier punto en 30 millas", "30마일 이내 어디서든 시택 공항 정액", "cố định tới Sea, Tac, từ bất kỳ đâu trong 30 dặm"],
    "Start from where I am now": ["以我当前位置为起点", "Empezar desde donde estoy", "현재 위치에서 출발", "Bắt đầu từ vị trí hiện tại"],
    "Working out the distance…": ["正在计算距离…", "Calculando la distancia…", "거리를 계산하는 중…", "Đang tính khoảng cách…"],
    "Flat airport fare, {miles} miles, inside the {radius}-mile flat-rate area. This is the price; it does not move.": ["机场固定价, {miles} 英里，位于 {radius} 英里固定价范围内。此即最终价格，不会变动。", "Tarifa fija de aeropuerto, {miles} millas, dentro del área de {radius} millas. Este es el precio y no cambia.", "공항 정액 요금, {miles}마일, {radius}마일 정액 구간 이내입니다. 이 금액이 최종 요금이며 변동되지 않습니다.", "Giá cố định sân bay, {miles} dặm, nằm trong vùng bán kính {radius} dặm. Đây là giá cuối, không thay đổi."],
    "About {miles} miles. Estimated from the road distance, we confirm the exact fare before you pay, and it does not change after that.": ["约 {miles} 英里。此为按路程估算，付款前我们会确认准确金额，确认后不再变动。", "Unas {miles} millas. Estimado según la distancia por carretera, confirmamos la tarifa exacta antes de pagar, y después no cambia.", "약 {miles}마일입니다. 도로 거리 기준 추정치이며, 결제 전에 정확한 요금을 확정하고 이후에는 변경되지 않습니다.", "Khoảng {miles} dặm. Ước tính theo quãng đường, chúng tôi xác nhận mức giá chính xác trước khi bạn thanh toán và sau đó không thay đổi."],
    "Could not measure that route automatically, send the request and we will quote it before you pay.": ["无法自动测算该路线, 请提交预约，我们会在付款前提供报价。", "No pudimos medir esa ruta automáticamente, envíe la solicitud y le daremos precio antes de pagar.", "해당 경로를 자동으로 계산하지 못했습니다, 요청을 보내주시면 결제 전에 요금을 안내해 드립니다.", "Không đo được tuyến đường này tự động, hãy gửi yêu cầu và chúng tôi sẽ báo giá trước khi bạn thanh toán."],
    # ------- Real Estate: the drawing sheet -------
    "WORK IN PROGRESS · REV A": ["编制中 · 修订 A", "EN CURSO · REV A", "작업 중 · REV A", "ĐANG THỰC HIỆN · REV A"],
    "PARAPET": ["女儿墙", "PRETIL", "파라펫", "TƯỜNG CHẮN MÁI"],
    "LEVEL 5": ["五层", "NIVEL 5", "5층", "TẦNG 5"],
    "LEVEL 4": ["四层", "NIVEL 4", "4층", "TẦNG 4"],
    "LEVEL 3": ["三层", "NIVEL 3", "3층", "TẦNG 3"],
    "LEVEL 2": ["二层", "NIVEL 2", "2층", "TẦNG 2"],
    "LEVEL 1": ["一层", "NIVEL 1", "1층", "TẦNG 1"],
    "GROUND": ["首层", "PLANTA BAJA", "지상층", "TẦNG TRỆT"],
    "PRELIMINARY": ["初步方案", "PRELIMINAR", "예비안", "SƠ BỘ"],
    "FRONT ELEVATION · 1:200 @ A3 · NOT FOR CONSTRUCTION": ["正立面 · 1:200 @ A3 · 不作施工依据", "ALZADO FRONTAL · 1:200 @ A3 · NO APTO PARA CONSTRUCCIÓN", "정면도 · 1:200 @ A3 · 시공용 아님", "MẶT ĐỨNG CHÍNH · 1:200 @ A3 · KHÔNG DÙNG ĐỂ THI CÔNG"],
    "FIG 1, MIXED-USE HUB · FRONT ELEVATION": ["图 1, 综合用途建筑 · 正立面", "FIG 1, CENTRO DE USO MIXTO · ALZADO FRONTAL", "그림 1, 복합용도 건물 · 정면도", "HÌNH 1, TÒA NHÀ ĐA CHỨC NĂNG · MẶT ĐỨNG CHÍNH"],
    "One stretch with nowhere to pull in": ["一段路程无可停靠地点", "Un tramo sin dónde parar", "정차할 곳이 없는 구간 한 곳", "Một đoạn không có chỗ dừng"],
    "From the start to {to} in, {len} with no mapped stop": ["自出发至 {to}，{len} 路程内无已知停靠点", "desde la salida hasta {to} de trayecto, {len} sin ninguna parada registrada", "출발부터 {to} 지점까지, {len} 동안 등록된 정차 지점 없음", "từ lúc khởi hành đến {to}, {len} không có điểm dừng nào được ghi nhận"],
    # ------- road trip: stretches with nowhere to stop -------
    "{n} stretches with nowhere to pull in": ["{n} 段路程无可停靠地点", "{n} tramos sin dónde parar", "정차할 곳이 없는 구간 {n}곳", "{n} đoạn không có chỗ dừng"],
    "{from} to {to} in, {len} with no mapped stop": ["出发后 {from} 至 {to} 之间，{len} 路程内无已知停靠点", "de {from} a {to} de trayecto, {len} sin ninguna parada registrada", "{from}부터 {to} 지점까지, {len} 동안 등록된 정차 지점 없음", "từ {from} đến {to}, {len} không có điểm dừng nào được ghi nhận"],
    "Searched again wider and found nothing. Fill up and stop before these.": ["已扩大范围再次搜索，仍无结果。请在进入这些路段前加油并休息。", "Se buscó de nuevo en un radio mayor sin resultados. Reposte y descanse antes de estos tramos.", "범위를 넓혀 다시 검색했으나 결과가 없습니다. 해당 구간에 진입하기 전에 주유하고 휴식하십시오.", "Đã tìm lại với phạm vi rộng hơn nhưng không có kết quả. Hãy đổ xăng và nghỉ trước các đoạn này."],
    # ------- booking: use my location -------
    "Finding you…": ["正在定位…", "Localizándole…", "위치를 확인하는 중…", "Đang xác định vị trí…"],
    "Located to about {n} m. Edit it if the door is round the back.": ["定位精度约 {n} 米。若入口在建筑背面，请修改地址。", "Localizado con unos {n} m de precisión. Corríjalo si la entrada está detrás.", "약 {n} m 정확도로 확인되었습니다. 출입구가 뒤편이라면 수정해 주십시오.", "Đã xác định trong khoảng {n} m. Vui lòng sửa nếu lối vào ở phía sau."],
    "Located. Edit it if the door is round the back.": ["已定位。若入口在建筑背面，请修改地址。", "Localizado. Corríjalo si la entrada está detrás.", "위치가 확인되었습니다. 출입구가 뒤편이라면 수정해 주십시오.", "Đã xác định vị trí. Vui lòng sửa nếu lối vào ở phía sau."],
    "Got your position but not a street address, the coordinates are in the box, and your driver can navigate to them.": ["已获取您的位置，但未能解析出街道地址。坐标已填入，司机可据此导航。", "Tenemos su posición pero no una dirección, las coordenadas están en el campo y su conductor puede navegar hasta ellas.", "위치는 확인했으나 도로명 주소를 찾지 못했습니다. 좌표가 입력되었으며 기사가 해당 좌표로 이동할 수 있습니다.", "Đã có vị trí của bạn nhưng chưa có địa chỉ đường phố, tọa độ đã được điền và tài xế có thể dẫn đường tới đó."],
    "Location permission was declined. Please type the pickup address.": ["定位权限被拒绝，请手动输入上车地址。", "Se denegó el permiso de ubicación. Escriba la dirección de recogida.", "위치 권한이 거부되었습니다. 픽업 주소를 입력해 주십시오.", "Quyền truy cập vị trí đã bị từ chối. Vui lòng nhập địa chỉ đón."],
    "Could not get a location right now. Please type the pickup address.": ["暂时无法获取位置，请手动输入上车地址。", "No se pudo obtener la ubicación ahora. Escriba la dirección de recogida.", "지금은 위치를 가져올 수 없습니다. 픽업 주소를 입력해 주십시오.", "Hiện chưa lấy được vị trí. Vui lòng nhập địa chỉ đón."],
    "This browser cannot share a location. Please type the address.": ["此浏览器不支持共享位置，请手动输入地址。", "Este navegador no puede compartir la ubicación. Escriba la dirección.", "이 브라우저는 위치를 공유할 수 없습니다. 주소를 입력해 주십시오.", "Trình duyệt này không chia sẻ được vị trí. Vui lòng nhập địa chỉ."],
    "📍 Use my location": ["📍 使用我的位置", "📍 Usar mi ubicación", "📍 현재 위치 사용", "📍 Dùng vị trí của tôi"],
    # ------- road trip: what to look for along the road -------
    "Look for": ["查找", "Buscar", "찾기", "Tìm"],
    "EV charging": ["充电桩", "Carga eléctrica", "전기차 충전", "Trạm sạc điện"],
    "Coffee": ["咖啡", "Café", "커피", "Cà phê"],
    "Toilets": ["洗手间", "Aseos", "화장실", "Nhà vệ sinh"],
    "Shops": ["商店", "Tiendas", "상점", "Cửa hàng"],
    "Somewhere to sleep": ["住宿", "Dónde dormir", "숙박", "Chỗ nghỉ"],
    "Pharmacy & urgent care": ["药房与急诊", "Farmacia y urgencias", "약국 및 응급진료", "Nhà thuốc & cấp cứu"],
    "Car repair & tyres": ["汽车维修与轮胎", "Taller y neumáticos", "자동차 정비 및 타이어", "Sửa xe & lốp"],
    "ATM & bank": ["取款机与银行", "Cajero y banco", "ATM 및 은행", "ATM & ngân hàng"],
    "Dog walk": ["遛狗区", "Zona para perros", "반려견 산책", "Chỗ dắt chó"],
    "Playground": ["儿童游乐场", "Parque infantil", "놀이터", "Sân chơi trẻ em"],
    "Picnic area": ["野餐区", "Área de picnic", "피크닉 구역", "Khu dã ngoại"],
    "Drinking water": ["饮用水", "Agua potable", "식수", "Nước uống"],
    # ------- EV charging on the road trip planner -------
    "Finding charging stations along the route…": ["正在沿途查找充电站…", "Buscando estaciones de carga en la ruta…", "경로를 따라 충전소를 찾는 중…", "Đang tìm trạm sạc dọc tuyến đường…"],
    "Charging along the route": ["沿途充电", "Carga en la ruta", "경로상 충전", "Trạm sạc dọc tuyến"],
    "{n} stations · {w} have food, coffee or a toilet within a 5-minute walk": ["共 {n} 处充电站，其中 {w} 处步行 5 分钟内有餐饮、咖啡或洗手间", "{n} estaciones · {w} tienen comida, café o aseo a menos de 5 minutos a pie", "충전소 {n}곳 · 그중 {w}곳은 도보 5분 이내에 식사, 커피 또는 화장실이 있습니다", "{n} trạm · {w} trạm có đồ ăn, cà phê hoặc nhà vệ sinh trong 5 phút đi bộ"],
    "Charging station": ["充电站", "Estación de carga", "충전소", "Trạm sạc"],
    "lines up with a break": ["与休息点重合", "coincide con una pausa", "휴식 지점과 겹침", "trùng với chặng nghỉ"],
    "nothing within a walk": ["步行范围内无配套设施", "nada a poca distancia a pie", "도보 거리에 편의시설 없음", "không có tiện ích trong tầm đi bộ"],
    "{n} stalls": ["{n} 个车位", "{n} plazas", "{n}대", "{n} chỗ"],
    "free": ["免费", "gratis", "무료", "miễn phí"],
    "toilets": ["洗手间", "aseos", "화장실", "nhà vệ sinh"],
    "coffee": ["咖啡", "café", "커피", "cà phê"],
    "shop": ["便利店", "tienda", "상점", "cửa hàng"],
    # ------- durations assembled from numbers -------
    "{h} hr {m} min": ["{h} 小时 {m} 分", "{h} h {m} min", "{h}시간 {m}분", "{h} giờ {m} phút"],
    "{h} hr": ["{h} 小时", "{h} h", "{h}시간", "{h} giờ"],
    "{m} min": ["{m} 分", "{m} min", "{m}분", "{m} phút"],
    "{time} in": ["行驶 {time} 处", "a {time} de trayecto", "{time} 지점", "{time} kể từ điểm xuất phát"],
    # ------- front page rewrite + Destination Book lede -------
    "A Seattle car service that funds what comes next": ["西雅图用车服务，为后续业务提供资金", "Un servicio de coches de Seattle que financia lo que viene después", "다음 사업을 뒷받침하는 시애틀 차량 서비스", "Dịch vụ xe tại Seattle, tài trợ cho những gì tiếp theo"],
    "$75 to Sea, Tac, quoted before you book. Drivers rent our cars and keep the fare, hotels and agents earn commission for sending riders, and the trip-planning tools are free to anyone. Below: the three businesses that income is building, and where each one stands today.": ["至西雅图-塔科马国际机场固定价 75 美元，预订前即告知。司机租用我们的车辆并保留全部车费，酒店与代理商推荐乘客可获得佣金，行程规划工具向所有人免费开放。以下为这笔收入正在建设的三项业务，以及各自目前的进展。", "75 $ al Sea, Tac, con el precio cerrado antes de reservar. Los conductores alquilan nuestros coches y se quedan con la tarifa, los hoteles y agentes cobran comisión por enviarnos pasajeros, y las herramientas de planificación son gratuitas para cualquiera. Debajo: los tres negocios que ese ingreso está construyendo, y en qué punto está cada uno hoy.", "시택 공항까지 75달러, 예약 전에 요금이 확정됩니다. 기사는 저희 차량을 임차해 요금 전액을 가져가고, 호텔과 에이전트는 승객을 연결하면 수수료를 받으며, 여행 계획 도구는 누구나 무료로 사용할 수 있습니다. 아래는 그 수익으로 만들어 가는 세 가지 사업과 각각의 현재 단계입니다.", "75 USD tới sân bay Sea, Tac, báo giá trước khi đặt. Tài xế thuê xe của chúng tôi và giữ trọn tiền cước, khách sạn và đại lý nhận hoa hồng khi giới thiệu khách, còn các công cụ lập kế hoạch chuyến đi miễn phí cho tất cả mọi người. Dưới đây là ba mảng kinh doanh mà nguồn thu này đang xây dựng, cùng tiến độ hiện tại của từng mảng."],
    "Four businesses, four stages": ["四项业务，四个阶段", "Cuatro negocios, cuatro etapas", "네 개의 사업, 네 개의 단계", "Bốn mảng kinh doanh, bốn giai đoạn"],
    "One pays for the next. Here is where each one stands today.": ["一项业务为下一项提供资金。以下为各项业务目前的进展。", "Uno paga el siguiente. Aquí está en qué punto se encuentra cada uno hoy.", "하나가 다음을 뒷받침합니다. 각 사업의 현재 단계는 아래와 같습니다.", "Mảng này tài trợ cho mảng kế tiếp. Dưới đây là tiến độ hiện tại của từng mảng."],
    "Fixed-price Tesla rides at $75 to Sea, Tac, cars rented to drivers who keep the fare, and commission for hotels and agents who send us riders. This is where the money comes from.": ["固定价格的特斯拉专车服务，至机场 75 美元；向司机出租车辆，车费全额归司机所有；酒店与代理商推荐乘客可获得佣金。公司收入来源于此。", "Trayectos en Tesla a precio fijo, 75 $ al Sea, Tac; coches alquilados a conductores que se quedan con la tarifa; y comisión para hoteles y agentes que nos envían pasajeros. De aquí sale el dinero.", "시택 공항까지 정액 75달러의 테슬라 차량 서비스, 요금 전액을 가져가는 기사 대상 차량 임대, 그리고 승객을 연결한 호텔과 에이전트에 지급하는 수수료. 수익은 여기에서 나옵니다.", "Dịch vụ xe Tesla giá cố định 75 USD tới sân bay Sea, Tac, cho tài xế thuê xe và giữ trọn tiền cước, cùng hoa hồng cho khách sạn và đại lý giới thiệu khách. Nguồn thu đến từ đây."],
    "Dispatch, invoicing, driver paperwork, and the trip-planning tools. We built them instead of renting them, so the customer and the data stay here.": ["调度、开票、司机文件与行程规划工具。均为自建而非租用，客户关系与数据因此留在公司内部。", "Despacho, facturación, documentación de conductores y las herramientas de planificación. Los construimos en lugar de alquilarlos, así que el cliente y los datos se quedan aquí.", "배차, 청구, 기사 서류, 그리고 여행 계획 도구. 임대하지 않고 직접 만들었기에 고객 관계와 데이터가 회사 안에 남습니다.", "Điều phối, lập hóa đơn, hồ sơ tài xế và các công cụ lập kế hoạch chuyến đi. Chúng tôi tự xây dựng thay vì đi thuê, nhờ đó quan hệ khách hàng và dữ liệu đều được giữ lại."],
    "A mixed-use building, still on paper. The drawings are published as they stand.": ["一栋综合用途建筑，目前仍处于图纸阶段。设计图按现状公开。", "Un edificio de uso mixto, todavía sobre plano. Los planos se publican tal como están.", "복합 용도 건물로, 아직 도면 단계입니다. 도면은 현재 상태 그대로 공개합니다.", "Một tòa nhà đa chức năng, hiện vẫn ở giai đoạn bản vẽ. Các bản vẽ được công bố đúng như hiện trạng."],
    "An automated trading project in private testing, building a record you can follow. It is not open to outside money.": ["一项自动化交易项目，正在内部验证中，逐步建立可供查阅的记录。不接受外部资金。", "Un proyecto de trading automatizado en pruebas privadas, construyendo un registro que puede seguir. No está abierto a capital externo.", "비공개 검증 단계의 자동 트레이딩 프로젝트로, 확인 가능한 기록을 쌓고 있습니다. 외부 자금은 받지 않습니다.", "Một dự án giao dịch tự động đang trong giai đoạn kiểm chứng nội bộ, từng bước xây dựng hồ sơ có thể theo dõi. Dự án không nhận vốn từ bên ngoài."],
    "agent program": ["代理商计划", "programa de agentes", "에이전트 프로그램", "chương trình đại lý"],
    "A guidebook of attractions and restaurants, city by city, with descriptions and local tips from a licensed tour guide. One tap sends any place into the": ["一份按城市编排的景点与餐厅指南，附有说明与持证导游提供的本地建议。点击即可将任一地点加入", "Una guía de atracciones y restaurantes, ciudad por ciudad, con descripciones y consejos locales de un guía turístico titulado. Un toque envía cualquier lugar al", "도시별로 정리한 명소와 음식점 안내서로, 공인 가이드의 설명과 현지 조언이 담겨 있습니다. 한 번 누르면 어떤 장소든", "Cẩm nang các điểm tham quan và nhà hàng, sắp xếp theo từng thành phố, kèm mô tả và lời khuyên địa phương từ hướng dẫn viên có chứng chỉ. Chỉ cần một lần chạm để đưa bất kỳ địa điểm nào vào"],
    # ---------------- Road Trip Planner (assembled in JS) ----------------
    "Finding those two places…": ["正在查找这两个地点…", "Buscando esos dos lugares…", "두 장소를 찾는 중…", "Đang tìm hai địa điểm đó…"],
    "Working out the drive…": ["正在计算行车路线…", "Calculando el trayecto…", "주행 경로를 계산하는 중…", "Đang tính toán lộ trình…"],
    "Sweeping the whole route for rest stops…": ["正在沿全程搜索休息区…", "Recorriendo toda la ruta en busca de áreas de descanso…", "전 구간에서 휴게소를 찾는 중…", "Đang rà soát toàn tuyến để tìm trạm dừng nghỉ…"],
    "That drive is shorter than one break, no stops needed.": ["此段车程较短，无需中途停靠。", "Ese trayecto es más corto que una pausa: no hacen falta paradas.", "이 구간은 휴식이 필요 없을 만큼 짧습니다.", "Chặng này ngắn hơn một lần nghỉ, không cần dừng."],
    "Something went wrong, try again.": ["出现问题，请重试。", "Algo salió mal; inténtelo de nuevo.", "문제가 발생했습니다. 다시 시도해 주십시오.", "Đã xảy ra lỗi, vui lòng thử lại."],
    "Rest stops along the whole route": ["全程休息区", "Áreas de descanso en toda la ruta", "전 구간 휴게소", "Trạm dừng nghỉ trên toàn tuyến"],
    "{n} found within 2½ miles of the road, in the order you’ll pass them": ["沿途 4 公里内共 {n} 处，按经过先后排列", "{n} encontradas a menos de 4 km de la carretera, en el orden en que las pasará", "도로에서 4km 이내에 {n}곳을 찾았으며, 지나가는 순서대로 표시됩니다", "Tìm thấy {n} trạm trong phạm vi 4 km từ đường, xếp theo thứ tự bạn sẽ đi qua"],
    "Looking for stops around break {i} of {n}…": ["正在查找第 {i} 个休息点附近的地点，共 {n} 个…", "Buscando paradas cerca de la pausa {i} de {n}…", "{n}개 중 {i}번째 휴식 지점 주변을 검색하는 중…", "Đang tìm điểm dừng quanh chặng nghỉ {i} trong {n}…"],
    "Break {i}": ["休息点 {i}", "Pausa {i}", "휴식 지점 {i}", "Chặng nghỉ {i}"],
    "Found the route, but the places service did not answer. It is free and rate-limited, wait a minute and try again.": ["已找到路线，但地点服务未响应。该服务为免费服务，有调用频率限制，请稍后重试。", "Se encontró la ruta, pero el servicio de lugares no respondió. Es gratuito y limita las consultas: espere un minuto e inténtelo de nuevo.", "경로는 찾았으나 장소 서비스가 응답하지 않았습니다. 무료 서비스로 요청 제한이 있으니 잠시 후 다시 시도해 주십시오.", "Đã tìm được lộ trình, nhưng dịch vụ địa điểm không phản hồi. Dịch vụ này miễn phí và giới hạn truy vấn, vui lòng đợi một phút rồi thử lại."],
    "Planned. {failed} of {n} breaks came back empty from the places service, try again for those.": ["已规划。{n} 个休息点中有 {failed} 个未返回结果，请稍后重试这些地点。", "Planificado. {failed} de {n} pausas no devolvieron resultados del servicio de lugares; vuelva a intentarlo para esas.", "계획 완료. 휴식 지점 {n}곳 중 {failed}곳에서 결과를 받지 못했습니다. 해당 지점은 다시 시도해 주십시오.", "Đã lên kế hoạch. {failed} trong {n} chặng nghỉ không có kết quả từ dịch vụ địa điểm, vui lòng thử lại với những chặng đó."],
    "Planned: {miles} miles, {time} driving, {rests} rest stops on the road, {breaks} suggested breaks.": ["已规划：{miles} 英里，行车 {time}，沿途 {rests} 处休息区，建议休息 {breaks} 次。", "Planificado: {miles} millas, {time} de conducción, {rests} áreas de descanso en la ruta, {breaks} pausas sugeridas.", "계획 완료: {miles}마일, 주행 {time}, 도로 위 휴게소 {rests}곳, 권장 휴식 {breaks}회.", "Đã lên kế hoạch: {miles} dặm, lái xe {time}, {rests} trạm dừng nghỉ trên đường, {breaks} chặng nghỉ được đề xuất."],
    "fastest": ["最快", "más rápida", "가장 빠름", "nhanh nhất"],
    "shortest": ["最短", "más corta", "가장 짧음", "ngắn nhất"],
    "+{n} min": ["多 {n} 分钟", "+{n} min", "+{n}분", "+{n} phút"],
    "{n} mi": ["{n} 英里", "{n} mi", "{n}마일", "{n} dặm"],
    "About {time} in": ["约行驶 {time}", "Unas {time} de trayecto", "약 {time} 지점", "Khoảng {time} kể từ điểm xuất phát"],
    "Service area": ["服务区", "Área de servicio", "종합휴게소", "Trạm dịch vụ"],
    "Rest area": ["休息区", "Área de descanso", "휴게소", "Trạm dừng nghỉ"],
    "Rest & services": ["休息与服务区", "Descanso y servicios", "휴게 및 편의시설", "Nghỉ ngơi & dịch vụ"],
    # ---------------- Trip Planner ----------------
    "🗺️ Trip Planner": ["🗺️ 行程规划", "🗺️ Planificador de viaje", "🗺️ 여행 플래너", "🗺️ Lập kế hoạch chuyến đi"],
    "Free for everyone, drivers, tour guides, tourists. Tap where you are, and every attraction lights up or dims based on drive time, traffic and closing hours. Your taps build the plan, day by day.": [
        "对所有人免费，司机、导游、游客都能用。点一下您的位置，每个景点会根据车程、路况和关门时间自动变亮或变暗。您点到哪里，行程就排到哪里，一天一天成形。",
        "Gratis para todos: conductores, guías y turistas. Toca dónde estás y cada atracción se ilumina o se atenúa según el tiempo de viaje, el tráfico y la hora de cierre. Tus toques arman el plan, día a día.",
        "누구나 무료입니다, 기사, 가이드, 여행자 모두. 현재 위치를 누르면 이동 시간·교통·마감 시간에 따라 각 명소가 밝아지거나 흐려집니다. 누르는 대로 하루하루 일정이 만들어집니다.",
        "Miễn phí cho tất cả, tài xế, hướng dẫn viên, khách du lịch. Chạm vào nơi bạn đang ở, mỗi điểm tham quan sẽ sáng lên hoặc mờ đi theo thời gian lái xe, giao thông và giờ đóng cửa. Bạn chạm tới đâu, lịch trình thành hình tới đó."],
    "State": ["州", "Estado", "주", "Bang"],
    "County": ["县", "Condado", "카운티", "Hạt"],
    "City": ["城市", "Ciudad", "도시", "Thành phố"],
    "Date of departure": ["出发日期", "Fecha de salida", "출발 날짜", "Ngày khởi hành"],
    "Leave by": ["出发时间", "Salir a las", "출발 시각", "Khởi hành lúc"],
    "Traffic": ["路况", "Tráfico", "교통", "Giao thông"],
    "Auto (by time of day)": ["自动（按时段）", "Automático (según la hora)", "자동 (시간대별)", "Tự động (theo giờ trong ngày)"],
    "Light": ["畅通", "Ligero", "원활", "Thông thoáng"],
    "Normal": ["正常", "Normal", "보통", "Bình thường"],
    "Heavy": ["拥堵", "Denso", "정체", "Đông đúc"],
    "Starting point": ["出发地", "Punto de partida", "출발 지점", "Điểm xuất phát"],
    "＋ Add": ["＋ 添加", "＋ Añadir", "＋ 추가", "＋ Thêm"],
    "Set start": ["设为起点", "Fijar inicio", "출발지 설정", "Đặt điểm xuất phát"],
    "or drag the ⌂ pin on the map": ["或拖动地图上的 ⌂ 标记", "o arrastra el marcador ⌂ en el mapa", "또는 지도의 ⌂ 핀을 끌어 옮기세요", "hoặc kéo ghim ⌂ trên bản đồ"],
    "Tap once to type a starting address · tap twice to use your current location": [
        "点一下输入出发地址 · 点两下使用当前位置",
        "Toca una vez para escribir la dirección de partida · toca dos veces para usar tu ubicación actual",
        "한 번 누르면 출발 주소 입력 · 두 번 누르면 현재 위치 사용",
        "Chạm một lần để nhập địa chỉ xuất phát · chạm hai lần để dùng vị trí hiện tại"],
    "🚗 I need a ride": ["🚗 我需要用车", "🚗 Necesito un viaje", "🚗 차량이 필요해요", "🚗 Tôi cần xe"],
    "🤖 Robotaxi": ["🤖 无人驾驶车", "🤖 Robotaxi", "🤖 로보택시", "🤖 Xe tự lái"],
    "🙋 Drop to a guide": ["🙋 交给导游", "🙋 Pasárselo a un guía", "🙋 가이드에게 넘기기", "🙋 Chuyển cho hướng dẫn viên"],
    "🚕 Hire a driver-guide": ["🚕 雇一位司机兼导游", "🚕 Contratar un chófer-guía", "🚕 기사 겸 가이드 고용", "🚕 Thuê tài xế kiêm hướng dẫn"],
    "🏷️ Guide? Offer this route for sale →": ["🏷️ 您是导游？把这条路线挂出来出售 →", "🏷️ ¿Eres guía? Pon esta ruta a la venta →", "🏷️ 가이드이신가요? 이 코스를 판매해 보세요 →", "🏷️ Bạn là hướng dẫn viên? Rao bán tuyến này →"],
    "🎫 Or write your own in-depth trip and sell it →": ["🎫 或者自己写一条深度行程来出售 →", "🎫 O escribe tu propio viaje a fondo y véndelo →", "🎫 또는 나만의 심층 여행을 직접 써서 판매하기 →", "🎫 Hoặc tự viết một hành trình chuyên sâu và bán nó →"],
    "🤵 Jarvis, your trip organizer": ["🤵 Jarvis，您的行程管家", "🤵 Jarvis, tu organizador de viaje", "🤵 자비스, 여행 도우미", "🤵 Jarvis, người sắp xếp chuyến đi của bạn"],
    "🧭 Itinerary": ["🧭 行程表", "🧭 Itinerario", "🧭 일정표", "🧭 Lịch trình"],
    "⧉ Copy": ["⧉ 复制", "⧉ Copiar", "⧉ 복사", "⧉ Sao chép"],
    "📤 Share": ["📤 分享", "📤 Compartir", "📤 공유", "📤 Chia sẻ"],
    "🖨 Print": ["🖨 打印", "🖨 Imprimir", "🖨 인쇄", "🖨 In"],
    "↩ Undo": ["↩ 撤销", "↩ Deshacer", "↩ 되돌리기", "↩ Hoàn tác"],
    "🚗 Get a ride": ["🚗 叫车", "🚗 Pedir un viaje", "🚗 차량 부르기", "🚗 Gọi xe"],
    "🚕 Driver-guide": ["🚕 司机兼导游", "🚕 Chófer-guía", "🚕 기사 겸 가이드", "🚕 Tài xế kiêm hướng dẫn"],
    "✨ Jarvis suggests": ["✨ Jarvis 的建议", "✨ Jarvis sugiere", "✨ 자비스 추천", "✨ Jarvis gợi ý"],
    "Calculating…": ["计算中…", "Calculando…", "계산 중…", "Đang tính…"],
    "🧭 Show my day sheet": ["🧭 查看当天行程单", "🧭 Ver mi hoja del día", "🧭 오늘 일정표 보기", "🧭 Xem bảng lịch trong ngày"],
    "▴ Smaller, just keep me posted": ["▴ 收起，有事再告诉我", "▴ Más pequeño, solo mantenme al tanto", "▴ 작게, 소식만 알려주세요", "▴ Thu nhỏ, chỉ cần báo tôi biết"],
    "Enough time": ["时间充足", "Tiempo de sobra", "시간 여유 있음", "Đủ thời gian"],
    "Tight": ["时间紧", "Justo", "빠듯함", "Sát giờ"],
    "Can't make it": ["赶不上", "No llegas", "도착 불가", "Không kịp"],
    "In your trip": ["已加入行程", "En tu viaje", "일정에 포함됨", "Đã trong chuyến đi"],
    "Start point (drag it)": ["起点（可拖动）", "Punto de partida (arrástralo)", "출발 지점 (끌어 옮기기)", "Điểm xuất phát (kéo được)"],
    "Loading drive times…": ["正在计算车程…", "Calculando tiempos de viaje…", "이동 시간 불러오는 중…", "Đang tải thời gian lái xe…"],
    "Destination Book,": ["目的地手册, ", "Libro de destinos, ", "여행지 북, ", "Sổ điểm đến, "],
    "this city": ["本城市", "esta ciudad", "이 도시", "thành phố này"],
    "places here · tap to browse, search, and add to your route": [
        "个地点 · 点击浏览、搜索并加入行程",
        "lugares aquí · toca para explorar, buscar y añadir a tu ruta",
        "곳 · 눌러서 둘러보고 검색해 경로에 추가하세요",
        "địa điểm · chạm để xem, tìm và thêm vào lộ trình"],
    "Place": ["地点", "Lugar", "장소", "Địa điểm"],
    "Closes": ["关门时间", "Cierra", "마감", "Đóng cửa"],
    "Visit min": ["建议停留（分钟）", "Visita min", "관람 시간(분)", "Thời gian ghé (phút)"],
    "Category": ["类别", "Categoría", "분류", "Danh mục"],
    "Search": ["搜索", "Buscar", "검색", "Tìm kiếm"],
    "Written by us": ["我们亲手写的", "Escrito por nosotros", "우리가 직접 쓴 것", "Do chúng tôi viết"],
    "Type a name, or the number on the label, to search.": [
        "输入名称，或标签上的编号即可搜索。",
        "Escribe un nombre, o el número de la etiqueta, para buscar.",
        "이름이나 라벨에 적힌 번호를 입력해 검색하세요.",
        "Nhập tên, hoặc số trên nhãn, để tìm kiếm."],
    "This work is still under copyright, so we cannot show it here.": [
        "这件作品仍受版权保护，因此我们无法在此展示。",
        "Esta obra sigue con derechos de autor, así que no podemos mostrarla aquí.",
        "이 작품은 아직 저작권이 있어 여기에 보여드릴 수 없습니다.",
        "Tác phẩm này vẫn còn bản quyền, nên chúng tôi không thể hiển thị ở đây."],
    "See the original →": [
        "查看原作 →", "Ver el original →", "원본 보기 →", "Xem bản gốc →"],
    "travellers are exploring right now": [
        "位旅客正在探索", "viajeros están explorando ahora mismo",
        "명의 여행자가 지금 둘러보는 중", "khách đang khám phá ngay bây giờ"],
    "🗽 New York sample": ["🗽 纽约示例", "🗽 Ejemplo de Nueva York", "🗽 뉴욕 예시", "🗽 Mẫu New York"],
    "🏛️ Washington DC sample": ["🏛️ 华盛顿特区示例", "🏛️ Ejemplo de Washington DC", "🏛️ 워싱턴 DC 예시", "🏛️ Mẫu Washington DC"],
    "🌲 Seattle sample": ["🌲 西雅图示例", "🌲 Ejemplo de Seattle", "🌲 시애틀 예시", "🌲 Mẫu Seattle"],
    "⚓ Boston sample": ["⚓ 波士顿示例", "⚓ Ejemplo de Boston", "⚓ 보스턴 예시", "⚓ Mẫu Boston"],
    "Map data ©": ["地图数据 ©", "Datos del mapa ©", "지도 데이터 ©", "Dữ liệu bản đồ ©"],
    "contributors · routing by": ["贡献者 · 路径规划", "colaboradores · rutas por", "기여자 · 경로 제공", "cộng tác viên · định tuyến bởi"],
    "· search by Nominatim · a free tool by Plateau Strategy Solution Lab": [
        "· 搜索由 Nominatim 提供 · Plateau Strategy Solution Lab 出品的免费工具",
        "· búsqueda por Nominatim · una herramienta gratuita de Plateau Strategy Solution Lab",
        "· 검색은 Nominatim · Plateau Strategy Solution Lab의 무료 도구",
        "· tìm kiếm bởi Nominatim · công cụ miễn phí của Plateau Strategy Solution Lab"],
    "Night after Day": ["第", "Noche después del día", "다음 날 밤", "Đêm sau ngày"],
    "Day": ["天", "Día", "일차", "Ngày"],
    "should start from wherever you sleep, otherwise it plans your morning from your original start point. Have you already got somewhere?": [
        "天应该从您过夜的地方出发，否则系统会按最初的起点安排早上的行程。您订好住处了吗？",
        "debería empezar donde duermas, si no, planificará tu mañana desde el punto de partida original. ¿Ya tienes dónde quedarte?",
        "은 잠자는 곳에서 시작해야 합니다, 그렇지 않으면 아침 일정이 원래 출발지 기준으로 짜입니다. 숙소를 정하셨나요?",
        "nên bắt đầu từ nơi bạn ngủ, nếu không, buổi sáng sẽ được xếp từ điểm xuất phát ban đầu. Bạn đã có chỗ nghỉ chưa?"],
    "Yes, I've booked somewhere": ["订好了", "Sí, ya reservé", "네, 예약했습니다", "Rồi, tôi đã đặt chỗ"],
    "Use this": ["就用这个", "Usar esto", "이걸로 설정", "Dùng chỗ này"],
    "Not yet, near where Day": ["还没订，就在第", "Todavía no, cerca de donde el día", "아직요, ", "Chưa, gần nơi ngày"],
    "ends": ["天结束的地方附近", "termina", "일차가 끝나는 곳 근처", "kết thúc"],
    "🏨 Find places to stay near": ["🏨 在附近找住宿", "🏨 Buscar alojamiento cerca de", "🏨 근처 숙소 찾기", "🏨 Tìm chỗ nghỉ gần"],
    "my last stop": ["我的最后一站", "mi última parada", "마지막 방문지", "điểm dừng cuối của tôi"],
    "I'm heading back to my start point →": ["我要回到起点 →", "Vuelvo a mi punto de partida →", "출발 지점으로 돌아갑니다 →", "Tôi quay lại điểm xuất phát →"],
    "Hand your trip to a guide": ["把行程交给导游", "Entrega tu viaje a un guía", "여행을 가이드에게 맡기기", "Giao chuyến đi cho hướng dẫn viên"],
    "Email or phone": ["邮箱或电话", "Correo o teléfono", "이메일 또는 전화", "Email hoặc điện thoại"],
    "Email or phone (optional)": ["邮箱或电话（选填）", "Correo o teléfono (opcional)", "이메일 또는 전화 (선택)", "Email hoặc điện thoại (tùy chọn)"],
    "Your guide code": ["您的导游编号", "Tu código de guía", "가이드 코드", "Mã hướng dẫn viên của bạn"],
    "No code yet?": ["还没有编号？", "¿Aún no tienes código?", "아직 코드가 없나요?", "Chưa có mã?"],
    "Register as a guide, takes a minute": ["注册成为导游，一分钟搞定", "Regístrate como guía, toma un minuto", "가이드로 등록, 1분이면 됩니다", "Đăng ký làm hướng dẫn viên, chỉ một phút"],
    "Organization (optional)": ["机构名称（选填）", "Organización (opcional)", "소속 (선택)", "Tổ chức (tùy chọn)"],
    "Get my guide code": ["获取我的导游编号", "Obtener mi código de guía", "가이드 코드 받기", "Nhận mã hướng dẫn viên"],
    "Price for this guided trip (USD)": ["这条导览行程的价格（美元）", "Precio de este viaje guiado (USD)", "이 가이드 투어 가격 (USD)", "Giá cho chuyến có hướng dẫn (USD)"],
    "Anything to tell the guide? (optional)": ["有什么要告诉导游的吗？（选填）", "¿Algo que decirle al guía? (opcional)", "가이드에게 전할 말이 있나요? (선택)", "Có điều gì muốn nhắn hướng dẫn viên? (tùy chọn)"],
    "Send": ["发送", "Enviar", "보내기", "Gửi"],
    "🤖 Robotaxi ride": ["🤖 无人驾驶接送", "🤖 Viaje en robotaxi", "🤖 로보택시 이용", "🤖 Chuyến xe tự lái"],
    "UNDER RESEARCH": ["研究中", "EN INVESTIGACIÓN", "연구 중", "ĐANG NGHIÊN CỨU"],
    "Self-driving pickups are under research, we're studying how to hail an autonomous car straight from your planned route, safely and privately. It isn't bookable today, and no ride is being requested.": [
        "无人驾驶接送仍在研究中，我们正在研究如何安全、私密地从您已排好的行程直接叫一辆自动驾驶车。目前还不能预约，也不会发出任何叫车请求。",
        "Los viajes autónomos están en investigación: estudiamos cómo llamar un coche autónomo directamente desde tu ruta, de forma segura y privada. Hoy no se puede reservar y no se está solicitando ningún viaje.",
        "자율주행 픽업은 아직 연구 단계입니다, 계획한 경로에서 바로, 안전하고 사적으로 자율주행차를 부르는 방법을 연구 중입니다. 현재는 예약할 수 없으며 어떤 호출도 이루어지지 않습니다.",
        "Đón khách bằng xe tự lái vẫn đang nghiên cứu, chúng tôi đang tìm cách gọi xe tự hành ngay từ lộ trình bạn đã lên, an toàn và riêng tư. Hiện chưa thể đặt và không có chuyến nào được yêu cầu."],
    "Want us to tell you when it's ready?": ["想在开放时收到通知吗？", "¿Quieres que te avisemos cuando esté listo?", "준비되면 알려드릴까요?", "Bạn muốn được báo khi sẵn sàng chứ?"],
    "🔔 Notify me when robotaxi launches": ["🔔 上线时通知我", "🔔 Avísame cuando lance el robotaxi", "🔔 로보택시 출시되면 알려주세요", "🔔 Báo tôi khi xe tự lái ra mắt"],
    "In the meantime, tap": ["在此期间，点击", "Mientras tanto, toca", "그동안에는", "Trong lúc chờ, hãy chạm"],
    "to book a real driver to the same stop.": ["即可预约真人司机送您到同一地点。", "para reservar un conductor real al mismo destino.", "를 눌러 같은 장소로 실제 기사를 예약하세요.", "để đặt tài xế thật đến cùng điểm đó."],
    "Type a destination and press Add, or tap a pin on the map": [
        "输入目的地并点“添加”，或直接点地图上的标记",
        "Escribe un destino y pulsa Añadir, o toca un marcador en el mapa",
        "목적지를 입력하고 추가를 누르세요, 또는 지도의 핀을 누르세요",
        "Nhập điểm đến rồi nhấn Thêm, hoặc chạm một ghim trên bản đồ"],
    "Type your starting address, hotel or airport…": ["输入出发地址、酒店或机场…", "Escribe tu dirección de partida, hotel o aeropuerto…", "출발 주소, 호텔 또는 공항을 입력하세요…", "Nhập địa chỉ xuất phát, khách sạn hoặc sân bay…"],
    "Book a ride to your stop": ["预约用车前往您的目的地", "Reserva un viaje a tu parada", "목적지까지 차량 예약", "Đặt xe đến điểm dừng của bạn"],
    "Self-driving pickup, under research": ["无人驾驶接送，研究中", "Recogida autónoma, en investigación", "자율주행 픽업, 연구 중", "Đón bằng xe tự lái, đang nghiên cứu"],
    "Hand it off, a local guide reaches out": ["交给当地导游，他们会联系您", "Pásalo, un guía local te contactará", "넘기기, 현지 가이드가 연락드립니다", "Chuyển đi, hướng dẫn viên bản địa sẽ liên hệ"],
    "One person drives and guides you": ["一个人既开车又讲解", "Una persona conduce y te guía", "한 사람이 운전과 안내를 함께", "Một người vừa lái xe vừa hướng dẫn"],
    "Copy the itinerary as text, send it to anyone": ["复制文字版行程，发给任何人", "Copia el itinerario como texto, envíaselo a quien quieras", "일정을 텍스트로 복사, 누구에게나 전송", "Sao chép lịch trình dạng văn bản, gửi cho bất kỳ ai"],
    "Share the itinerary": ["分享行程", "Compartir el itinerario", "일정 공유", "Chia sẻ lịch trình"],
    "Print the day sheet (or save as PDF)": ["打印行程单（或存为 PDF）", "Imprime la hoja del día (o guárdala en PDF)", "일정표 인쇄 (또는 PDF로 저장)", "In bảng lịch trong ngày (hoặc lưu PDF)"],
    "Remove the last stop": ["删除最后一站", "Quitar la última parada", "마지막 방문지 삭제", "Xóa điểm dừng cuối"],
    "Open the Destination Book": ["打开目的地手册", "Abrir el Libro de destinos", "여행지 북 열기", "Mở Sổ điểm đến"],
    "Search any address or attraction, it joins the book…": [
        "搜索任意地址或景点，它会自动收录进手册…",
        "Busca cualquier dirección o atracción, se añade al libro…",
        "주소나 명소를 검색하세요, 자동으로 북에 등록됩니다…",
        "Tìm bất kỳ địa chỉ hay điểm tham quan nào, nó sẽ được thêm vào sổ…"],
    "Hotel name or address…": ["酒店名称或地址…", "Nombre del hotel o dirección…", "호텔 이름 또는 주소…", "Tên khách sạn hoặc địa chỉ…"],
    "Who should the guide ask for?": ["导游到时找谁？", "¿Por quién debe preguntar el guía?", "가이드가 누구를 찾으면 될까요?", "Hướng dẫn viên nên hỏi tìm ai?"],
    "How the guide reaches you": ["导游如何联系您", "Cómo te contactará el guía", "가이드가 연락할 방법", "Cách hướng dẫn viên liên hệ bạn"],
    "Leave blank if it's just you": ["个人报名请留空", "Déjalo en blanco si eres solo tú", "혼자라면 비워 두세요", "Để trống nếu chỉ có bạn"],
}

EXTRA.update({
    # ---------------- Guided Trips / Guide Studio ----------------
    "Guided Trips, in-depth walks from local guides": ["导览行程，当地导游的深度徒步", "Viajes guiados, paseos a fondo con guías locales", "가이드 투어, 현지 가이드의 심층 도보", "Chuyến có hướng dẫn, những buổi đi bộ chuyên sâu cùng hướng dẫn viên bản địa"],
    "Trip Planner": ["行程规划", "Planificador de viaje", "여행 플래너", "Lập kế hoạch chuyến đi"],
    "Guides: list a trip": ["导游：发布行程", "Guías: publica un viaje", "가이드: 여행 등록", "Hướng dẫn viên: đăng một chuyến"],
    "🎫 Guided Trips": ["🎫 导览行程", "🎫 Viajes guiados", "🎫 가이드 투어", "🎫 Chuyến có hướng dẫn"],
    "Not sightseeing loops, these are written by the guides who run them, stop by stop, with how long you actually stand at each one. A student's hour in Harvard Yard is a different thing from a bus past the gate.": [
        "这不是走马观花的观光环线，每条行程都由带团的导游亲手写下，一站一站，连在每处站多久都写清楚。哈佛学生带您在校园里走一小时，和坐大巴从校门口开过去，完全是两回事。",
        "No son circuitos turísticos: los escriben los propios guías que los realizan, parada por parada, con cuánto tiempo se está en cada una. La hora de un estudiante en Harvard Yard no es lo mismo que un autobús pasando por la verja.",
        "관광버스 코스가 아닙니다, 직접 진행하는 가이드가 한 곳씩, 각 지점에 실제로 얼마나 머무는지까지 적어 만든 일정입니다. 하버드 야드에서 학생과 보내는 한 시간은 정문을 지나치는 버스와 전혀 다릅니다.",
        "Không phải vòng tham quan chớp nhoáng, mỗi hành trình do chính hướng dẫn viên dẫn tour viết ra, từng điểm một, kèm thời gian thực sự dừng lại ở mỗi nơi. Một giờ trong khuôn viên Harvard cùng sinh viên khác hẳn chuyến xe buýt chạy ngang cổng trường."],
    "Guides can list their own →": ["导游可发布自己的行程 →", "Los guías pueden publicar los suyos →", "가이드는 직접 등록할 수 있습니다 →", "Hướng dẫn viên có thể tự đăng →"],
    "Part of the": ["隶属于", "Parte del", "다음의 일부입니다:", "Thuộc"],
    "agent programme": ["代理人计划", "programa de agentes", "에이전트 프로그램", "chương trình đại lý"],
    "Guide Studio, build a trip to sell": ["导游工作室，打造一条可出售的行程", "Estudio de guías, crea un viaje para vender", "가이드 스튜디오, 판매할 여행 만들기", "Xưởng hướng dẫn viên, tạo một chuyến để bán"],
    "Browse trips": ["浏览行程", "Ver viajes", "여행 둘러보기", "Xem các chuyến"],
    "🎫 Guide Studio": ["🎫 导游工作室", "🎫 Estudio de guías", "🎫 가이드 스튜디오", "🎫 Xưởng hướng dẫn viên"],
    "The trip planner draws a sightseeing loop. This is for the other kind, the walk you know by heart, where the point is what you say at each stop. Write it out yourself: your stops, your timings, your price. Travellers browse it on the": [
        "行程规划工具画的是一条观光环线。这里是另一种，您烂熟于心的那条路，重点在于您在每一站讲些什么。自己把它写出来：您的站点、您的时间、您的价格。旅客可在",
        "El planificador dibuja un circuito turístico. Esto es para el otro tipo: el paseo que te sabes de memoria, donde lo importante es lo que cuentas en cada parada. Escríbelo tú: tus paradas, tus tiempos, tu precio. Los viajeros lo verán en la",
        "여행 플래너는 관광 코스를 그립니다. 이곳은 다른 종류를 위한 곳입니다, 훤히 아는 그 길, 각 지점에서 무엇을 이야기하느냐가 핵심인 코스. 직접 써 보세요: 직접 고른 지점, 직접 정한 시간, 직접 매긴 가격. 여행자는",
        "Công cụ lập kế hoạch vẽ ra một vòng tham quan. Đây dành cho loại khác, con đường bạn thuộc nằm lòng, nơi điều quan trọng là những gì bạn kể ở mỗi điểm dừng. Hãy tự viết ra: điểm dừng của bạn, thời gian của bạn, giá của bạn. Du khách xem nó tại"],
    "trips page": ["行程页面", "página de viajes", "여행 페이지", "trang các chuyến"],
    ". Guiding is part of the": ["查看。带团导览隶属于", ". Guiar forma parte del", "에서 봅니다. 가이드 활동은", ". Việc hướng dẫn thuộc"],
    ", one code refers rides and sells trips.": ["，同一个编号既能推荐用车，也能出售行程。", ", un mismo código refiere viajes y vende itinerarios.", ", 하나의 코드로 차량을 추천하고 여행도 판매합니다.", ", một mã vừa giới thiệu chuyến xe vừa bán hành trình."],
    "You need a code to list a trip, it is how we know a real guide wrote it. It is the same code the": [
        "发布行程需要一个编号，我们凭它确认行程出自真正的导游之手。它和",
        "Necesitas un código para publicar un viaje: así sabemos que lo escribió un guía real. Es el mismo código que emite el",
        "여행을 등록하려면 코드가 필요합니다, 실제 가이드가 작성했음을 확인하는 방법입니다. 이는",
        "Bạn cần một mã để đăng hành trình, đó là cách chúng tôi biết một hướng dẫn viên thật đã viết nó. Đây chính là mã do"],
    "Agent & Guide Portal": ["代理人与导游平台", "Portal de agentes y guías", "에이전트 · 가이드 포털", "Cổng Đại lý & Hướng dẫn viên"],
    "issues, so if you already refer rides you have one. If not, registering there takes a minute.": [
        "发放的编号是同一个，所以如果您已经在推荐用车，就已经有了。若还没有，去那里注册只要一分钟。",
        "así que si ya refieres viajes, ya lo tienes. Si no, registrarte allí toma un minuto.",
        "에서 발급하는 코드와 같으므로, 이미 차량을 추천하고 계신다면 이미 갖고 계십니다. 없다면 등록에 1분이면 됩니다.",
        "cấp, nên nếu bạn đã giới thiệu chuyến xe thì bạn đã có. Nếu chưa, đăng ký ở đó chỉ mất một phút."],
    "Who is running it": ["由谁带团", "Quién lo dirige", "누가 진행하나요", "Ai là người dẫn"],
    "Your code identifies you. Travellers see your name, never your contact details, interest comes to you through us, so your listing cannot be harvested for emails.": [
        "编号用于识别您的身份。旅客只看到您的名字，绝不会看到您的联系方式，有人感兴趣时由我们转达，所以您的行程页不会被用来抓取邮箱。",
        "Tu código te identifica. Los viajeros ven tu nombre, nunca tus datos de contacto: el interés te llega a través de nosotros, así que tu anuncio no puede usarse para recolectar correos.",
        "코드가 본인임을 확인해 줍니다. 여행자에게는 이름만 보이고 연락처는 절대 보이지 않습니다, 문의는 저희를 통해 전달되므로, 등록 정보가 이메일 수집에 쓰일 수 없습니다.",
        "Mã nhận diện bạn. Du khách thấy tên bạn, không bao giờ thấy thông tin liên hệ, mọi quan tâm đến với bạn qua chúng tôi, nên tin đăng của bạn không thể bị thu thập email."],
    "Where we reach you": ["我们如何联系您", "Cómo te contactamos", "연락받을 곳", "Nơi chúng tôi liên hệ bạn"],
    "What the trip is": ["这是什么样的行程", "En qué consiste el viaje", "어떤 여행인가요", "Chuyến đi là gì"],
    'Be specific. "Harvard Yard in depth, a student\'s walk" sells; "Boston tour" does not.': [
        "写具体一点。“哈佛校园深度游，学生带路”卖得动；“波士顿一日游”卖不动。",
        'Sé concreto. "Harvard Yard a fondo, el paseo de un estudiante" vende; "Tour de Boston" no.',
        '구체적으로 쓰세요. "하버드 야드 심층, 학생과 걷기"는 팔리지만 "보스턴 투어"는 팔리지 않습니다.',
        'Hãy cụ thể. "Khuôn viên Harvard chuyên sâu, buổi đi bộ cùng sinh viên" thì bán được; "Tour Boston" thì không.'],
    "Title": ["标题", "Título", "제목", "Tiêu đề"],
    "Type of trip": ["行程类型", "Tipo de viaje", "여행 유형", "Loại hành trình"],
    "In-depth / deep dive": ["深度游", "A fondo / inmersión", "심층 탐방", "Chuyên sâu"],
    "Campus / university": ["校园 / 大学", "Campus / universidad", "캠퍼스 / 대학", "Khuôn viên / đại học"],
    "History": ["历史", "Historia", "역사", "Lịch sử"],
    "Food & drink": ["美食与饮品", "Comida y bebida", "음식과 음료", "Ẩm thực & đồ uống"],
    "Architecture": ["建筑", "Arquitectura", "건축", "Kiến trúc"],
    "Art & museums": ["艺术与博物馆", "Arte y museos", "예술과 박물관", "Nghệ thuật & bảo tàng"],
    "Nature & outdoors": ["自然与户外", "Naturaleza y aire libre", "자연과 야외", "Thiên nhiên & ngoài trời"],
    "Photography": ["摄影", "Fotografía", "사진", "Nhiếp ảnh"],
    "Neighborhood walk": ["街区漫步", "Paseo por el barrio", "동네 산책", "Dạo quanh khu phố"],
    "Family friendly": ["适合亲子", "Para toda la familia", "가족 동반 가능", "Phù hợp gia đình"],
    "Nightlife": ["夜生活", "Vida nocturna", "야간 명소", "Về đêm"],
    "Something else": ["其他", "Otra cosa", "기타", "Loại khác"],
    "Languages you run it in": ["您用哪些语言带团", "Idiomas en los que lo haces", "진행 가능 언어", "Ngôn ngữ bạn dẫn tour"],
    "What travellers will get out of it": ["旅客能收获什么", "Qué se llevarán los viajeros", "여행자가 얻게 될 것", "Du khách sẽ nhận được gì"],
    "Your stops, in order": ["您的站点（按顺序）", "Tus paradas, en orden", "방문지 순서", "Các điểm dừng, theo thứ tự"],
    "This is what makes it an in-depth trip rather than a drive-past: name each stop and say how long you actually stand there. The note is for you to say why it matters.": [
        "这正是深度游与走马观花的区别：写下每一站的名字，以及您实际会在那里停留多久。备注用来说明这一站为什么重要。",
        "Esto es lo que lo convierte en un viaje a fondo y no en un paseo de coche: nombra cada parada y di cuánto tiempo estás realmente allí. La nota es para explicar por qué importa.",
        "이것이 스쳐 지나가는 투어와 심층 투어를 가르는 지점입니다: 각 방문지의 이름과 실제로 머무는 시간을 적으세요. 메모에는 왜 중요한지를 쓰면 됩니다.",
        "Đây là điều biến nó thành hành trình chuyên sâu thay vì chạy ngang qua: đặt tên từng điểm dừng và ghi bạn thực sự đứng đó bao lâu. Phần ghi chú để bạn nói vì sao nó đáng giá."],
    "＋ Add a stop": ["＋ 添加一站", "＋ Añadir una parada", "＋ 방문지 추가", "＋ Thêm điểm dừng"],
    "No stops yet.": ["还没有站点。", "Aún no hay paradas.", "아직 방문지가 없습니다.", "Chưa có điểm dừng nào."],
    "Practical details": ["实用信息", "Detalles prácticos", "실용 정보", "Thông tin thực tế"],
    "The questions every traveller asks before they book.": ["每位旅客下单前都会问的问题。", "Las preguntas que todo viajero hace antes de reservar.", "여행자가 예약 전에 꼭 묻는 것들.", "Những câu mọi du khách hỏi trước khi đặt."],
    "Price (USD)": ["价格（美元）", "Precio (USD)", "가격 (USD)", "Giá (USD)"],
    "Priced": ["计价方式", "Cobrado", "가격 기준", "Tính giá"],
    "per person": ["每人", "por persona", "1인당", "mỗi người"],
    "per group": ["每团", "por grupo", "그룹당", "mỗi nhóm"],
    "Most people you will take": ["最多接待人数", "Máximo de personas que aceptas", "최대 인원", "Số người tối đa bạn nhận"],
    "Where you meet them": ["集合地点", "Dónde os encontráis", "만나는 장소", "Nơi bạn gặp khách"],
    "What is included": ["费用包含", "Qué incluye", "포함 사항", "Bao gồm những gì"],
    "List this trip": ["发布这条行程", "Publicar este viaje", "이 여행 등록하기", "Đăng hành trình này"],
    "Listing is free. When a traveller asks for your trip we introduce you directly. You can list as many trips as you like, most guides run several versions of the same walk at different lengths.": [
        "发布免费。有旅客想订您的行程时，我们会直接为双方牵线。您想发布多少条都可以，多数导游会把同一条路线做成长短不同的几个版本。",
        "Publicar es gratis. Cuando un viajero pide tu viaje, os presentamos directamente. Puedes publicar tantos como quieras: la mayoría de los guías ofrecen varias versiones del mismo paseo con distintas duraciones.",
        "등록은 무료입니다. 여행자가 문의하면 저희가 직접 연결해 드립니다. 원하는 만큼 등록할 수 있습니다, 대부분의 가이드는 같은 코스를 길이만 달리해 여러 버전으로 운영합니다.",
        "Đăng tin miễn phí. Khi có du khách hỏi, chúng tôi kết nối trực tiếp hai bên. Bạn có thể đăng bao nhiêu tùy thích, phần lớn hướng dẫn viên có vài phiên bản dài ngắn khác nhau của cùng một lộ trình."],
    "Your listings": ["您已发布的行程", "Tus publicaciones", "내 등록 목록", "Tin đăng của bạn"],
    "Live on the trips page right now.": ["此刻已在行程页面展示。", "Ahora mismo en la página de viajes.", "지금 여행 페이지에 게시 중입니다.", "Đang hiển thị trên trang các chuyến ngay lúc này."],
    "email or phone": ["邮箱或电话", "correo o teléfono", "이메일 또는 전화", "email hoặc điện thoại"],
    "Guiding only, museum entry not included": ["仅含导览，不含博物馆门票", "Solo guía, no incluye entrada al museo", "안내만 포함, 박물관 입장료 불포함", "Chỉ hướng dẫn, không gồm vé vào bảo tàng"],
})

EXTRA.update({
    # ---------------- Destination Book ----------------
    "Destination Book, Plateau Strategy Solution Lab": ["目的地手册, Plateau Strategy Solution Lab", "Libro de destinos, Plateau Strategy Solution Lab", "여행지 북, Plateau Strategy Solution Lab", "Sổ điểm đến, Plateau Strategy Solution Lab"],
    "📖 Destination Book": ["📖 目的地手册", "📖 Libro de destinos", "📖 여행지 북", "📖 Sổ điểm đến"],
    "Destination Book": ["目的地手册", "Libro de destinos", "여행지 북", "Sổ điểm đến"],
    "A curated guidebook of attractions and restaurants, every type of destination, organized by category, with descriptions and local tips from a professionally licensed tour guide. One tap sends any place into the": [
        "一本精选的景点与餐厅指南，各类目的地按类别整理，附有描述和持证导游的本地贴士。一键即可把任意地点加入",
        "Una guía curada de atracciones y restaurantes: todo tipo de destinos, organizados por categoría, con descripciones y consejos locales de un guía con licencia profesional. Con un toque envías cualquier lugar al",
        "엄선한 명소·식당 안내서, 모든 유형의 여행지를 분류별로 정리하고, 전문 자격을 가진 가이드의 설명과 현지 팁을 담았습니다. 한 번만 누르면 어떤 장소든",
        "Cuốn cẩm nang tuyển chọn các điểm tham quan và nhà hàng, mọi loại điểm đến, sắp theo danh mục, kèm mô tả và mẹo bản địa từ hướng dẫn viên có giấy phép. Chỉ một chạm để đưa bất kỳ nơi nào vào"],
    ". Hours shown are typical, check before you go.": ["。所列营业时间为一般情况，出发前请再确认。", ". Los horarios son orientativos: confírmalos antes de ir.", ". 표시된 시간은 통상적인 값입니다, 방문 전 확인하세요.", ". Giờ hiển thị chỉ là thông thường, hãy kiểm tra trước khi đi."],
    "Stars": ["评分", "Estrellas", "별점", "Sao"],
    "tap to cycle 5★ → 1★": ["点击在 5★ → 1★ 之间切换", "toca para cambiar de 5★ a 1★", "누를 때마다 5★ → 1★ 로 바뀝니다", "chạm để chuyển 5★ → 1★"],
    "🌟 What do you wish was in this book?": ["🌟 您希望这本手册里出现什么？", "🌟 ¿Qué te gustaría ver en este libro?", "🌟 이 북에 무엇이 있으면 좋겠나요?", "🌟 Bạn mong có gì trong cuốn sổ này?"],
    "Tell us the place you want to see, or the kind of thing you're looking for. Every wish tells us what to add next, and where travelers want a guide. No account, no email needed.": [
        "告诉我们您想去的地方，或您在找哪一类体验。每条心愿都会告诉我们下一步该补什么，以及旅客在哪里需要导游。无需注册，也不用留邮箱。",
        "Dinos el lugar que quieres ver, o el tipo de cosa que buscas. Cada deseo nos indica qué añadir y dónde los viajeros quieren un guía. Sin cuenta ni correo.",
        "가고 싶은 장소나 찾고 있는 유형을 알려주세요. 모든 요청이 다음에 무엇을 추가할지, 여행자가 어디서 가이드를 원하는지 알려줍니다. 계정도 이메일도 필요 없습니다.",
        "Hãy cho chúng tôi biết nơi bạn muốn đến, hoặc loại trải nghiệm bạn tìm. Mỗi mong muốn cho chúng tôi biết nên bổ sung gì tiếp theo và du khách cần hướng dẫn viên ở đâu. Không cần tài khoản hay email."],
    "A place": ["一个地方", "Un lugar", "장소", "Một địa điểm"],
    "Food": ["美食", "Comida", "음식", "Ẩm thực"],
    "An experience": ["一种体验", "Una experiencia", "체험", "Một trải nghiệm"],
    "Add my wish": ["提交我的心愿", "Añadir mi deseo", "내 요청 보내기", "Gửi mong muốn của tôi"],
    "Nothing matches these filters, loosen one and the book fills back up.": ["没有符合这些筛选条件的结果，放宽一项，内容就会重新出现。", "Nada coincide con estos filtros: relaja uno y el libro se llena de nuevo.", "이 조건에 맞는 항목이 없습니다, 하나만 완화하면 다시 채워집니다.", "Không có kết quả khớp bộ lọc, nới một điều kiện là sổ đầy trở lại."],
    "A free tool by Plateau Strategy Solution Lab · descriptions curated with a professionally licensed tour guide": [
        "Plateau Strategy Solution Lab 出品的免费工具 · 描述内容由持证导游共同编写",
        "Una herramienta gratuita de Plateau Strategy Solution Lab · descripciones elaboradas con un guía con licencia profesional",
        "Plateau Strategy Solution Lab의 무료 도구 · 설명은 전문 자격 가이드와 함께 작성",
        "Công cụ miễn phí của Plateau Strategy Solution Lab · mô tả được biên soạn cùng hướng dẫn viên có giấy phép"],
    "Search the book, or type a new place to suggest & add…": ["搜索手册，或输入一个新地点来推荐并添加…", "Busca en el libro, o escribe un lugar nuevo para sugerirlo y añadirlo…", "북에서 검색, 또는 새 장소를 입력해 제안·추가하세요…", "Tìm trong sổ, hoặc nhập một nơi mới để đề xuất và thêm…"],

    # ---------------- Road Trip ----------------
    "Road Trip Planner, Plateau Strategy Solution Lab": ["长途自驾规划, Plateau Strategy Solution Lab", "Planificador de viajes por carretera, Plateau Strategy Solution Lab", "로드트립 플래너, Plateau Strategy Solution Lab", "Lập kế hoạch đường dài, Plateau Strategy Solution Lab"],
    "Road Trip Planner": ["长途自驾规划", "Planificador de viajes por carretera", "로드트립 플래너", "Lập kế hoạch đường dài"],
    "City day planner": ["城市一日规划", "Planificador de día en la ciudad", "도시 하루 플래너", "Lập lịch một ngày trong thành phố"],
    "← Back to Lab": ["← 返回实验室", "← Volver al Lab", "← 랩으로 돌아가기", "← Về lại Lab"],
    "What's along the way?": ["路上有什么？", "¿Qué hay por el camino?", "가는 길에 무엇이 있나요?", "Trên đường có gì?"],
    "For the long hauls. Give it two points and it finds the fuel, food, rest areas and viewpoints near your actual road, grouped by how many hours in you'll be, so you can plan real breaks instead of scrolling a map.": [
        "专为长途设计。给它两个地点，它会沿着您实际要走的那条路，找出加油站、餐饮、休息区和观景点，并按您开到第几小时分组，让您能真正安排休息，而不是一直划地图。",
        "Para los trayectos largos. Dale dos puntos y encuentra gasolineras, comida, áreas de descanso y miradores junto a tu carretera real, agrupados por las horas que llevarás conduciendo, para que planifiques descansos de verdad en lugar de arrastrar un mapa.",
        "장거리 운전을 위한 기능입니다. 두 지점을 입력하면 실제 주행 경로 근처의 주유소·식당·휴게소·전망대를 찾아, 몇 시간째 지점인지에 따라 묶어 보여줍니다. 지도를 계속 넘기는 대신 진짜 휴식을 계획할 수 있습니다.",
        "Dành cho những chặng dài. Cho hai điểm, công cụ sẽ tìm trạm xăng, đồ ăn, trạm dừng nghỉ và điểm ngắm cảnh gần đúng tuyến đường bạn đi, nhóm theo số giờ đã lái, để bạn lên kế hoạch nghỉ thật sự thay vì kéo bản đồ."],
    "From": ["起点", "Desde", "출발", "Từ"],
    "Plan the drive": ["规划这段路", "Planear el trayecto", "주행 계획 세우기", "Lên kế hoạch lái xe"],
    "Stop every": ["每隔多久停一次", "Parar cada", "휴식 간격", "Dừng mỗi"],
    "Enter two places and press “Plan the drive”.": ["输入两个地点，然后点“规划这段路”。", "Introduce dos lugares y pulsa «Planear el trayecto».", "두 장소를 입력하고 “주행 계획 세우기”를 누르세요.", "Nhập hai địa điểm rồi nhấn “Lên kế hoạch lái xe”."],
    "Distance": ["距离", "Distancia", "거리", "Quãng đường"],
    "Driving time": ["行车时间", "Tiempo de conducción", "주행 시간", "Thời gian lái"],
    "Suggested breaks": ["建议休息次数", "Descansos sugeridos", "권장 휴식", "Số lần nghỉ đề xuất"],
    "Places found": ["找到的地点", "Lugares encontrados", "찾은 장소", "Địa điểm tìm thấy"],
    "Start": ["起点", "Inicio", "출발", "Bắt đầu"],
    "Destination": ["目的地", "Destino", "목적지", "Điểm đến"],
    "Suggested break": ["建议休息", "Descanso sugerido", "권장 휴식", "Nghỉ đề xuất"],
    "Fuel": ["加油", "Combustible", "주유", "Nhiên liệu"],
    "Scenic": ["观景", "Paisaje", "경치", "Ngắm cảnh"],
    "Routing by": ["路径规划", "Rutas por", "경로 제공", "Định tuyến bởi"],
    "· places from": ["· 地点来自", "· lugares de", "· 장소 출처", "· địa điểm từ"],
    "via": ["经由", "vía", "경유", "qua"],
    "· search by": ["· 搜索由", "· búsqueda por", "· 검색 제공", "· tìm kiếm bởi"],

    # ---------------- Favorite Places ----------------
    "Favorite Places, Plateau Strategy Solution Lab": ["最爱的地方, Plateau Strategy Solution Lab", "Lugares favoritos, Plateau Strategy Solution Lab", "즐겨찾는 장소, Plateau Strategy Solution Lab", "Địa điểm yêu thích, Plateau Strategy Solution Lab"],
    "❤️ Favorite Places": ["❤️ 最爱的地方", "❤️ Lugares favoritos", "❤️ 즐겨찾는 장소", "❤️ Địa điểm yêu thích"],
    "Search anywhere and tell us your favorite place, it joins the free Destination Book for the next traveler. The more you share, the smarter our map gets.": [
        "搜索世界任何角落，告诉我们您最喜欢的地方，它会被收进免费的目的地手册，留给下一位旅客。您分享得越多，我们的地图就越聪明。",
        "Busca en cualquier parte y cuéntanos tu lugar favorito: se suma al Libro de destinos gratuito para el próximo viajero. Cuanto más compartes, más inteligente se vuelve nuestro mapa.",
        "어디든 검색해 가장 좋아하는 장소를 알려주세요, 다음 여행자를 위해 무료 여행지 북에 등록됩니다. 많이 나눌수록 지도가 똑똑해집니다.",
        "Tìm bất cứ đâu và cho chúng tôi biết nơi bạn thích nhất, nó sẽ vào Sổ điểm đến miễn phí cho du khách tiếp theo. Bạn chia sẻ càng nhiều, bản đồ càng thông minh."],
    "What's your favorite place?": ["您最喜欢的地方是哪里？", "¿Cuál es tu lugar favorito?", "가장 좋아하는 장소는 어디인가요?", "Nơi bạn thích nhất là ở đâu?"],
    "If you've been there, how long did you stay?": ["如果您去过，待了多久？", "Si has estado allí, ¿cuánto tiempo te quedaste?", "가보셨다면 얼마나 머무셨나요?", "Nếu bạn từng đến, bạn ở lại bao lâu?"],
    "15 min": ["15 分钟", "15 min", "15분", "15 phút"],
    "30 min": ["30 分钟", "30 min", "30분", "30 phút"],
    "1 hour": ["1 小时", "1 hora", "1시간", "1 giờ"],
    "2 hours": ["2 小时", "2 horas", "2시간", "2 giờ"],
    "Half day": ["半天", "Medio día", "반나절", "Nửa ngày"],
    "Full day": ["一整天", "Día completo", "하루 종일", "Cả ngày"],
    "Haven't been yet": ["还没去过", "Todavía no he ido", "아직 안 가봤어요", "Chưa từng đến"],
    "Add to the map →": ["加入地图 →", "Añadir al mapa →", "지도에 추가 →", "Thêm vào bản đồ →"],
    "Every place you share is checked against the map for a real location, then written into the Destination Book. No account needed, this takes about 15 seconds.": [
        "您分享的每个地点都会先在地图上核对真实位置，然后写入目的地手册。无需注册，大约 15 秒就好。",
        "Cada lugar que compartes se comprueba en el mapa para confirmar que existe y luego se escribe en el Libro de destinos. Sin cuenta, tarda unos 15 segundos.",
        "공유하신 모든 장소는 지도에서 실제 위치를 확인한 뒤 여행지 북에 기록됩니다. 계정은 필요 없고 약 15초면 됩니다.",
        "Mỗi địa điểm bạn chia sẻ đều được đối chiếu trên bản đồ để xác nhận có thật, rồi ghi vào Sổ điểm đến. Không cần tài khoản, chỉ mất khoảng 15 giây."],
    "Search a place, anywhere in the world…": ["搜索一个地点，世界任何角落…", "Busca un lugar, en cualquier parte del mundo…", "장소 검색, 전 세계 어디든…", "Tìm một địa điểm, bất cứ đâu trên thế giới…"],
})

EXTRA.update({
    # ---------------- Board of Directors ----------------
    "Board of Directors, Plateau Strategy Solution Lab": ["董事会, Plateau Strategy Solution Lab", "Junta directiva, Plateau Strategy Solution Lab", "이사회, Plateau Strategy Solution Lab", "Hội đồng quản trị, Plateau Strategy Solution Lab"],
    "Board of Directors": ["董事会", "Junta directiva", "이사회", "Hội đồng quản trị"],
    "Archive": ["档案库", "Archivo", "아카이브", "Kho lưu trữ"],
    "Private governance vault, for the managing members only. The company's corporate documents and ownership record, kept in one secure place.": [
        "私密治理文件库，仅限管理成员查阅。公司的法人文件与股权记录，统一存放在一个安全之处。",
        "Bóveda de gobernanza privada, solo para los socios gestores. Los documentos corporativos y el registro de propiedad de la empresa, guardados en un único lugar seguro.",
        "비공개 거버넌스 금고, 운영 구성원 전용. 회사의 법인 문서와 지분 기록을 한 곳에 안전하게 보관합니다.",
        "Kho quản trị riêng tư, chỉ dành cho các thành viên điều hành. Tài liệu pháp nhân và hồ sơ sở hữu của công ty, được giữ ở một nơi an toàn duy nhất."],
    "Managing members only.": ["仅限管理成员。", "Solo socios gestores.", "운영 구성원 전용입니다.", "Chỉ dành cho thành viên điều hành."],
    "Everything here is private corporate governance material, bylaws, agreements, resolutions and contracts. Uploads are archived permanently and never overwritten.": [
        "此处的一切都属于私密的公司治理材料，章程、协议、决议与合同。上传的文件会被永久归档，绝不覆盖。",
        "Todo lo que hay aquí es material privado de gobierno corporativo: estatutos, acuerdos, resoluciones y contratos. Lo que se sube se archiva de forma permanente y nunca se sobrescribe.",
        "이곳의 모든 자료는 비공개 기업 거버넌스 문서입니다, 정관, 계약, 결의서, 계약서. 업로드된 파일은 영구 보관되며 덮어쓰지 않습니다.",
        "Mọi thứ ở đây là tài liệu quản trị doanh nghiệp riêng tư, điều lệ, thỏa thuận, nghị quyết và hợp đồng. Tệp tải lên được lưu vĩnh viễn và không bao giờ bị ghi đè."],
    "👔 Managing Members": ["👔 管理成员", "👔 Socios gestores", "👔 운영 구성원", "👔 Thành viên điều hành"],
    "Name": ["姓名", "Nombre", "이름", "Tên"],
    "Role": ["职务", "Cargo", "역할", "Vai trò"],
    "Ownership": ["持股", "Participación", "지분", "Sở hữu"],
    "Since": ["加入时间", "Desde", "시작일", "Từ"],
    "No members added yet.": ["尚未添加成员。", "Aún no se han añadido miembros.", "아직 등록된 구성원이 없습니다.", "Chưa thêm thành viên nào."],
    "+ Add member": ["+ 添加成员", "+ Añadir miembro", "+ 구성원 추가", "+ Thêm thành viên"],
    "📁 Governance Vault": ["📁 治理文件库", "📁 Bóveda de gobernanza", "📁 거버넌스 금고", "📁 Kho quản trị"],
    "Bylaws · operating & shareholder agreements · articles of formation · board resolutions · contracts · cap table · tax/EIN. Append-only, every version is kept.": [
        "章程 · 经营与股东协议 · 设立文件 · 董事会决议 · 合同 · 股权结构表 · 税务/EIN。只增不改，每个版本都会保留。",
        "Estatutos · acuerdos operativos y de accionistas · actas de constitución · resoluciones del consejo · contratos · tabla de capitalización · impuestos/EIN. Solo se añade: se conservan todas las versiones.",
        "정관 · 운영 및 주주 계약 · 설립 서류 · 이사회 결의 · 계약서 · 지분표 · 세무/EIN. 추가만 가능, 모든 버전이 보존됩니다.",
        "Điều lệ · thỏa thuận vận hành và cổ đông · giấy tờ thành lập · nghị quyết hội đồng · hợp đồng · bảng vốn · thuế/EIN. Chỉ thêm mới, mọi phiên bản đều được giữ lại."],
    "⬆ Upload": ["⬆ 上传", "⬆ Subir", "⬆ 업로드", "⬆ Tải lên"],
    "No documents yet, upload your first governance record above.": ["还没有文件，请在上方上传第一份治理记录。", "Aún no hay documentos: sube arriba tu primer registro de gobernanza.", "아직 문서가 없습니다, 위에서 첫 거버넌스 기록을 올리세요.", "Chưa có tài liệu, hãy tải hồ sơ quản trị đầu tiên ở trên."],
    "Role, e.g. Managing Member": ["职务，例如：管理成员", "Cargo, p. ej. Socio gestor", "역할, 예: 운영 구성원", "Vai trò, ví dụ: Thành viên điều hành"],
    "Ownership %, e.g. 50": ["持股比例 %，例如：50", "Participación %, p. ej. 50", "지분 %, 예: 50", "Tỷ lệ sở hữu %, ví dụ: 50"],
    "Document title, e.g. Operating Agreement v2": ["文件标题，例如：经营协议 v2", "Título del documento, p. ej. Acuerdo operativo v2", "문서 제목, 예: 운영 계약 v2", "Tên tài liệu, ví dụ: Thỏa thuận vận hành v2"],
    "Notes (optional)": ["备注（选填）", "Notas (opcional)", "메모 (선택)", "Ghi chú (tùy chọn)"],

    # ---------------- Archive ----------------
    "Archive, Plateau Strategy Solution Lab": ["档案库, Plateau Strategy Solution Lab", "Archivo, Plateau Strategy Solution Lab", "아카이브, Plateau Strategy Solution Lab", "Kho lưu trữ, Plateau Strategy Solution Lab"],
    "Books": ["账目", "Contabilidad", "장부", "Sổ sách"],
    "One place that keeps every paper trail the site produces, bookings, your customer contact list, signed agreements, uploaded paperwork, leads, partners and more. Private, owner only.": [
        "一个地方保存网站产生的全部纸面记录，订单、客户联系名单、已签协议、上传的文件、潜在客户、合作方等等。私密，仅限所有者查看。",
        "Un solo lugar que guarda todo el rastro documental del sitio: reservas, tu lista de contactos de clientes, acuerdos firmados, documentación subida, prospectos, socios y más. Privado, solo para el propietario.",
        "사이트가 만들어내는 모든 서류 기록을 한곳에 보관합니다, 예약, 고객 연락처 목록, 서명된 계약, 업로드된 문서, 잠재 고객, 파트너 등. 비공개이며 소유자만 볼 수 있습니다.",
        "Một nơi lưu mọi dấu vết giấy tờ mà trang tạo ra, đặt chỗ, danh sách liên hệ khách hàng, thỏa thuận đã ký, hồ sơ tải lên, khách tiềm năng, đối tác và hơn thế. Riêng tư, chỉ chủ sở hữu."],
    "← All archives": ["← 全部档案", "← Todos los archivos", "← 전체 아카이브", "← Tất cả kho lưu trữ"],
    "This is your advertising list.": ["这是您的广告投放名单。", "Esta es tu lista de publicidad.", "이것이 광고용 명단입니다.", "Đây là danh sách quảng cáo của bạn."],
    "Every email and phone your site has ever captured, booking customers, account holders, finance leads, waitlists and partner contacts, de-duplicated. Export it to CSV and load it straight into your ad platform (Google/Meta customer match, Mailchimp, etc.). Only market to people per your privacy policy & applicable law.": [
        "网站收集过的所有邮箱和电话，下单客户、账户持有人、金融意向客户、候补名单和合作方联系人，已去重。可导出 CSV，直接导入广告平台（Google/Meta 客户匹配、Mailchimp 等）。请务必在隐私政策和适用法律允许的范围内进行营销。",
        "Todos los correos y teléfonos que tu sitio ha captado, clientes con reserva, titulares de cuenta, prospectos de finanzas, listas de espera y contactos de socios, sin duplicados. Expórtalo a CSV y cárgalo directamente en tu plataforma publicitaria (customer match de Google/Meta, Mailchimp, etc.). Haz marketing solo conforme a tu política de privacidad y la ley aplicable.",
        "사이트가 수집한 모든 이메일과 전화번호, 예약 고객, 계정 보유자, 금융 잠재 고객, 대기자 명단, 파트너 연락처, 를 중복 없이 모았습니다. CSV로 내보내 광고 플랫폼(Google/Meta 고객 매칭, Mailchimp 등)에 바로 올릴 수 있습니다. 개인정보 처리방침과 관련 법률이 허용하는 범위에서만 마케팅하세요.",
        "Mọi email và số điện thoại trang đã thu thập, khách đặt chỗ, chủ tài khoản, khách tiềm năng tài chính, danh sách chờ và liên hệ đối tác, đã loại trùng. Xuất ra CSV và nạp thẳng vào nền tảng quảng cáo (customer match của Google/Meta, Mailchimp, v.v.). Chỉ tiếp thị theo đúng chính sách bảo mật và luật hiện hành."],
    "⬇️ Export CSV": ["⬇️ 导出 CSV", "⬇️ Exportar CSV", "⬇️ CSV 내보내기", "⬇️ Xuất CSV"],
    "Nothing here yet, records appear automatically as they happen.": ["这里还没有内容，有记录产生时会自动出现。", "Aún no hay nada: los registros aparecen automáticamente a medida que ocurren.", "아직 아무것도 없습니다, 기록이 발생하면 자동으로 표시됩니다.", "Chưa có gì ở đây, bản ghi sẽ tự xuất hiện khi phát sinh."],
    "Search…": ["搜索…", "Buscar…", "검색…", "Tìm kiếm…"],
})

EXTRA.update({
    # ---------------- Landing page ----------------
    "Skip to content": ["跳到正文", "Saltar al contenido", "본문으로 건너뛰기", "Bỏ qua tới nội dung"],
    "Business Ideas": ["商业点子", "Ideas de negocio", "사업 아이디어", "Ý tưởng kinh doanh"],
    "Free Tools": ["免费工具", "Herramientas gratuitas", "무료 도구", "Công cụ miễn phí"],
    "Security Parameter": ["安全边界", "Parámetros de seguridad", "보안 기준", "Thông số an toàn"],
    "INTEGRATED BUSINESS ECOSYSTEM": ["一体化商业生态", "ECOSISTEMA EMPRESARIAL INTEGRADO", "통합 비즈니스 생태계", "HỆ SINH THÁI KINH DOANH TÍCH HỢP"],
    "Integrated wealth, built through": ["一体化的财富，源自", "Riqueza integrada, construida mediante", "통합된 부, 그 출발점은", "Của cải tích hợp, xây từ"],
    "connected ecosystems": ["彼此相连的生态", "ecosistemas conectados", "서로 연결된 생태계", "hệ sinh thái kết nối"],
    "Affordable Tesla rentals turn everyday drivers into earners and riders into owners, the first loop in a closed system where revenue compounds instead of leaking away.": [
        "平价特斯拉租赁让普通司机开始赚钱，也让乘客变成车主，这是闭环系统的第一环，收入在其中不断复利，而不是白白流走。",
        "El alquiler asequible de Teslas convierte a conductores corrientes en generadores de ingresos y a los pasajeros en propietarios: el primer bucle de un sistema cerrado donde los ingresos se componen en lugar de escaparse.",
        "합리적인 가격의 테슬라 렌털은 평범한 운전자를 수익자로, 승객을 소유자로 만듭니다, 수익이 새어 나가지 않고 복리로 쌓이는 닫힌 시스템의 첫 번째 고리입니다.",
        "Cho thuê Tesla với giá phải chăng biến tài xế bình thường thành người kiếm tiền và hành khách thành chủ sở hữu, vòng đầu tiên trong một hệ thống khép kín nơi doanh thu tích lũy thay vì rò rỉ."],
    "Explore the model": ["了解这套模式", "Explora el modelo", "모델 살펴보기", "Khám phá mô hình"],
    "Business verticals": ["业务板块", "Verticales de negocio", "사업 부문", "Mảng kinh doanh"],
    "Value chain owned": ["自有价值链占比", "Cadena de valor propia", "자체 보유 가치사슬", "Chuỗi giá trị tự sở hữu"],
    "Ride availability": ["用车可用度", "Disponibilidad de viajes", "차량 이용 가능성", "Khả năng có xe"],
    "THE MODEL": ["这套模式", "EL MODELO", "모델", "MÔ HÌNH"],
    "One ecosystem. Every part funds the next.": ["一个生态。每一环都为下一环提供资金。", "Un ecosistema. Cada parte financia la siguiente.", "하나의 생태계. 각 부분이 다음을 뒷받침합니다.", "Một hệ sinh thái. Mỗi phần nuôi phần kế tiếp."],
    "We control the full value chain and share the upside with drivers and partners, so revenue compounds across transportation, real estate, and finance instead of leaking away.": [
        "我们掌握完整的价值链，并把收益与司机和合作方共享，因此收入在交通、房地产和金融之间不断复利，而不是白白流走。",
        "Controlamos toda la cadena de valor y compartimos las ganancias con conductores y socios, de modo que los ingresos se componen entre transporte, inmobiliaria y finanzas en lugar de escaparse.",
        "저희는 가치사슬 전체를 직접 운영하고 그 이익을 기사·파트너와 나눕니다, 그래서 수익이 교통·부동산·금융을 오가며 새어 나가지 않고 복리로 쌓입니다.",
        "Chúng tôi kiểm soát trọn chuỗi giá trị và chia lợi ích với tài xế cùng đối tác, nhờ vậy doanh thu tích lũy qua vận tải, bất động sản và tài chính thay vì rò rỉ ra ngoài."],
    "Capital Efficient": ["资本高效", "Eficiente en capital", "자본 효율", "Hiệu quả vốn"],
    "Each part funds the next through shared cash flow and operational leverage, capital works harder across the whole system.": [
        "各环节通过共享现金流和运营杠杆为下一环提供资金，资本在整个系统里被用得更充分。",
        "Cada parte financia la siguiente mediante flujo de caja compartido y apalancamiento operativo: el capital rinde más en todo el sistema.",
        "각 부분이 공유 현금흐름과 운영 레버리지로 다음 부분을 뒷받침합니다, 자본이 시스템 전체에서 더 열심히 일합니다.",
        "Mỗi phần nuôi phần kế tiếp nhờ dòng tiền chung và đòn bẩy vận hành, vốn làm việc hiệu quả hơn trên toàn hệ thống."],
    "Vertically Integrated": ["垂直整合", "Integración vertical", "수직 통합", "Tích hợp dọc"],
    "Full control over the supply chain, client experience, and margin capture, end to end, no middlemen skimming value.": [
        "从头到尾完全掌控供应链、客户体验和利润留存，没有中间商抽成。",
        "Control total de la cadena de suministro, la experiencia del cliente y el margen, de principio a fin: sin intermediarios que se lleven valor.",
        "공급망, 고객 경험, 마진 확보를 처음부터 끝까지 직접 관리합니다, 중간에서 가치를 떼어가는 사람이 없습니다.",
        "Kiểm soát trọn vẹn chuỗi cung ứng, trải nghiệm khách hàng và biên lợi nhuận, từ đầu đến cuối, không có trung gian ăn bớt giá trị."],
    "Compounding Growth": ["复利式增长", "Crecimiento compuesto", "복리 성장", "Tăng trưởng kép"],
    "Revenue synergies accelerate expansion across every business line, so growth continuously reinvests into more growth.": [
        "各业务线之间的收入协同加速扩张，让增长不断再投资于下一轮增长。",
        "Las sinergias de ingresos aceleran la expansión en todas las líneas de negocio, de modo que el crecimiento se reinvierte continuamente en más crecimiento.",
        "매출 시너지가 모든 사업 부문의 확장을 가속하여, 성장이 계속 다음 성장에 재투자됩니다.",
        "Cộng hưởng doanh thu thúc đẩy mở rộng ở mọi mảng, để tăng trưởng liên tục tái đầu tư cho tăng trưởng tiếp theo."],
    "HOW IT CONNECTS": ["它们如何相连", "CÓMO SE CONECTA", "어떻게 연결되나", "CÁCH KẾT NỐI"],
    "A closed loop, not a funnel": ["这是一个闭环，不是漏斗", "Un circuito cerrado, no un embudo", "깔때기가 아니라 닫힌 순환", "Một vòng khép kín, không phải cái phễu"],
    "Join us in building the future": ["与我们一起建设未来", "Únete a construir el futuro", "함께 미래를 만들어요", "Cùng chúng tôi xây dựng tương lai"],
    "We're validating the market and preparing to launch. Early partners, investors, and team members are critical to our success.": [
        "我们正在验证市场、准备启动。早期的合作方、投资人和团队成员对我们的成败至关重要。",
        "Estamos validando el mercado y preparando el lanzamiento. Los primeros socios, inversores y miembros del equipo son decisivos para nuestro éxito.",
        "저희는 시장을 검증하며 출시를 준비하고 있습니다. 초기 파트너, 투자자, 팀원이 성공의 핵심입니다.",
        "Chúng tôi đang kiểm chứng thị trường và chuẩn bị ra mắt. Các đối tác, nhà đầu tư và thành viên đầu tiên là yếu tố quyết định."],
    "For travelers & tour guides, free map planning": ["为旅客和导游打造，免费地图规划", "Para viajeros y guías, planificación gratuita en el mapa", "여행자와 가이드를 위한 무료 지도 플래닝", "Dành cho du khách & hướng dẫn viên, lập kế hoạch trên bản đồ miễn phí"],
    "Plan a real day on the map: every stop lights up or dims by drive time, traffic and closing hours. Guides build and name their own routes here, no website needed, and travelers who'd rather not drive it themselves can hand the route to a guide.": [
        "在地图上规划真实的一天：每一站都会依据车程、路况和关门时间自动变亮或变暗。导游可以在这里搭建并命名自己的路线，不需要自建网站，不想自己开车的旅客，也可以把路线直接交给导游。",
        "Planifica un día real sobre el mapa: cada parada se ilumina o se atenúa según el tiempo de viaje, el tráfico y la hora de cierre. Los guías crean y nombran aquí sus propias rutas, sin necesidad de web, y los viajeros que prefieren no conducir pueden entregar la ruta a un guía.",
        "지도 위에서 진짜 하루를 계획하세요: 각 방문지가 이동 시간·교통·마감 시간에 따라 밝아지거나 흐려집니다. 가이드는 별도 웹사이트 없이 이곳에서 자신의 코스를 만들고 이름 붙일 수 있고, 직접 운전하고 싶지 않은 여행자는 그 코스를 가이드에게 맡길 수 있습니다.",
        "Lên kế hoạch cho một ngày thật trên bản đồ: mỗi điểm dừng sáng lên hoặc mờ đi theo thời gian lái, giao thông và giờ đóng cửa. Hướng dẫn viên tạo và đặt tên lộ trình riêng ngay tại đây, không cần website, còn du khách không muốn tự lái có thể giao lộ trình cho hướng dẫn viên."],
    "Open Trip Planner →": ["打开行程规划 →", "Abrir el planificador →", "여행 플래너 열기 →", "Mở công cụ lập kế hoạch →"],
    "For everyone, free, and growing": ["人人可用，免费，且在不断丰富", "Para todos, gratis y en crecimiento", "누구나, 무료이며 계속 늘어납니다", "Cho mọi người, miễn phí và ngày càng lớn"],
    "Every attraction and restaurant we know, city by city, with local tips from a licensed guide. It grows on its own: search a place in the planner and it's written into the book for the next traveler. One tap sends anything straight into your trip.": [
        "我们知道的每一处景点和餐厅，按城市整理，附持证导游的本地贴士。它会自己长大：在规划工具里搜索一个地点，它就会被写进手册，留给下一位旅客。一键即可把任何地点加进您的行程。",
        "Cada atracción y restaurante que conocemos, ciudad por ciudad, con consejos locales de un guía con licencia. Crece solo: busca un lugar en el planificador y queda escrito en el libro para el próximo viajero. Con un toque lo envías directo a tu viaje.",
        "저희가 아는 모든 명소와 식당을 도시별로, 자격을 갖춘 가이드의 현지 팁과 함께 정리했습니다. 스스로 자랍니다: 플래너에서 장소를 검색하면 다음 여행자를 위해 북에 기록됩니다. 한 번만 누르면 바로 일정에 들어갑니다.",
        "Mọi điểm tham quan và nhà hàng chúng tôi biết, theo từng thành phố, kèm mẹo bản địa từ hướng dẫn viên có giấy phép. Nó tự mở rộng: tìm một địa điểm trong công cụ lập kế hoạch là nó được ghi vào sổ cho du khách kế tiếp. Một chạm là đưa thẳng vào chuyến đi của bạn."],
    "Open the Book →": ["打开手册 →", "Abrir el libro →", "북 열기 →", "Mở sổ →"],
    "🚧 Under Development": ["🚧 开发中", "🚧 En desarrollo", "🚧 개발 중", "🚧 Đang phát triển"],
    "● WORK IN PROGRESS": ["● 建设中", "● TRABAJO EN CURSO", "● 진행 중", "● ĐANG THỰC HIỆN"],
    "★ ★ ★ DO YOUR PART ★ ★ ★": ["★ ★ ★ 尽一份力 ★ ★ ★", "★ ★ ★ PON DE TU PARTE ★ ★ ★", "★ ★ ★ 여러분의 몫을 ★ ★ ★", "★ ★ ★ GÓP PHẦN CỦA BẠN ★ ★ ★"],
    "When you make it, give a little back.": ["等您做起来了，回馈一点点。", "Cuando te vaya bien, devuelve un poco.", "잘되셨을 때, 조금만 돌려주세요.", "Khi bạn thành công, hãy cho lại một chút."],
    "give something to your country.": ["为您的国家做点什么。", "da algo a tu país.", "여러분의 나라에 무언가를 나누세요.", "hãy cho đất nước bạn một điều gì đó."],
    "You give directly to the U.S. Treasury.": ["您的钱直接交给美国财政部。", "Donas directamente al Tesoro de EE. UU.", "미국 재무부에 직접 기부하게 됩니다.", "Bạn tặng trực tiếp cho Bộ Tài chính Hoa Kỳ."],
    "The federal government runs a real program for this,": ["联邦政府为此设有一个正式项目，", "El gobierno federal tiene un programa real para esto:", "연방 정부가 이를 위한 공식 프로그램을 운영합니다, ", "Chính phủ liên bang có một chương trình chính thức cho việc này, "],
    ", at the Bureau of the Fiscal Service. Card, bank, or PayPal on Pay.gov.": ["，由财政服务局负责。可在 Pay.gov 使用银行卡、银行账户或 PayPal。", ", en el Bureau of the Fiscal Service. Tarjeta, banco o PayPal en Pay.gov.", ", 재무서비스국이 담당합니다. Pay.gov에서 카드·계좌·PayPal로 가능합니다.", ", tại Bureau of the Fiscal Service. Thẻ, ngân hàng hoặc PayPal trên Pay.gov."],
    "We never touch the money.": ["这笔钱我们碰都不碰。", "Nosotros nunca tocamos el dinero.", "저희는 그 돈에 손대지 않습니다.", "Chúng tôi không bao giờ chạm vào khoản tiền đó."],
    "No account of ours is involved, no cut, no processing, nothing held. The button below leaves this site and lands on the government's own payment page.": [
        "不经过我们的任何账户，不抽成，不代收，不留存。点下面的按钮会离开本站，直接进入政府自己的支付页面。",
        "No interviene ninguna cuenta nuestra, sin comisión, sin procesamiento, sin retener nada. El botón de abajo sale de este sitio y llega a la página de pago del propio gobierno.",
        "저희 계좌는 전혀 관여하지 않으며, 수수료도 처리도 보관도 없습니다. 아래 버튼을 누르면 이 사이트를 떠나 정부의 결제 페이지로 이동합니다.",
        "Không tài khoản nào của chúng tôi tham gia, không hoa hồng, không xử lý, không giữ lại gì. Nút bên dưới sẽ rời khỏi trang này và tới thẳng trang thanh toán của chính phủ."],
    "Then come back and tell us.": ["然后回来告诉我们一声。", "Luego vuelve y cuéntanoslo.", "그런 다음 돌아와 알려주세요.", "Rồi quay lại và cho chúng tôi biết."],
    "That's what moves the green zero at the top of this page, the number that counts what this community has given back.": [
        "这才会让页面顶部那个绿色的零动起来，它记录着这个社区一共回馈了多少。",
        "Eso es lo que mueve el cero verde en la parte superior de esta página: el número que cuenta lo que esta comunidad ha devuelto.",
        "그래야 이 페이지 맨 위의 초록색 0이 움직입니다, 이 커뮤니티가 돌려준 총액을 세는 숫자입니다.",
        "Đó là điều làm con số 0 màu xanh ở đầu trang này nhúc nhích, con số đếm những gì cộng đồng này đã cho lại."],
    "Prefer a check? Make it payable to the": ["更想寄支票？收款人写", "¿Prefieres un cheque? Hazlo a nombre de", "수표를 원하시나요? 수취인은", "Thích gửi séc? Ghi người nhận là"],
    ", write": ["，在备注栏写上", ", escribe", ", 메모란에는", ", ghi"],
    "“gift to reduce the debt held by the public”": ["“gift to reduce the debt held by the public”", "«gift to reduce the debt held by the public»", "“gift to reduce the debt held by the public”", "“gift to reduce the debt held by the public”"],
    "in the memo, and mail to:": ["然后寄往：", "en el concepto, y envíalo a:", "라고 적어 아래 주소로 보내세요:", "vào phần ghi chú, và gửi tới:"],
    "I gave, count it": ["我捐了，请计入", "He donado, cuéntalo", "기부했어요, 반영해 주세요", "Tôi đã tặng, hãy tính vào"],
    "Self-reported, on your honor. We can't verify a payment we deliberately never see, and we'd rather be honest about that than fake a number.": [
        "全凭自觉申报。我们刻意不去看这笔付款，因此无法核实，与其编一个数字，不如把话说清楚。",
        "Es autodeclarado, por tu palabra. No podemos verificar un pago que deliberadamente nunca vemos, y preferimos decirlo con franqueza antes que inventar una cifra.",
        "본인 신고 방식입니다. 저희는 의도적으로 결제를 보지 않으므로 확인할 수 없습니다, 숫자를 꾸미기보다 솔직히 밝히는 편을 택했습니다.",
        "Tự khai báo, dựa trên sự trung thực của bạn. Chúng tôi cố ý không nhìn thấy khoản thanh toán nên không thể xác minh, và thà nói thẳng còn hơn bịa ra một con số."],
    "Move the zero →": ["让这个零动起来 →", "Mueve el cero →", "0을 움직이기 →", "Làm con số 0 nhúc nhích →"],
    "💡 Business Ideas": ["💡 商业点子", "💡 Ideas de negocio", "💡 사업 아이디어", "💡 Ý tưởng kinh doanh"],
    "✍️ Pitch a business idea": ["✍️ 提出一个商业点子", "✍️ Propón una idea de negocio", "✍️ 사업 아이디어 제안하기", "✍️ Đề xuất một ý tưởng kinh doanh"],
    "Publish idea": ["发布点子", "Publicar idea", "아이디어 게시", "Đăng ý tưởng"],
    "No ideas posted yet, be the first to pitch one.": ["还没有人提出点子，来当第一个。", "Aún no hay ideas: sé el primero en proponer una.", "아직 등록된 아이디어가 없습니다, 첫 번째가 되어 보세요.", "Chưa có ý tưởng nào, hãy là người đầu tiên."],
    "invest": ["投资", "invertir", "투자", "đầu tư"],
    "launch and run it": ["启动并经营它", "lanzarla y dirigirla", "직접 시작해 운영", "khởi động và điều hành"],
    "Anyone can pitch a business idea here, free, no account needed. Readers back an idea one of two ways: register to": [
        "任何人都可以在这里提出商业点子，免费，无需注册。读者可以用两种方式支持一个点子：登记",
        "Cualquiera puede proponer aquí una idea de negocio: gratis y sin cuenta. Los lectores la respaldan de dos maneras: registrarse para",
        "누구나 여기에 사업 아이디어를 제안할 수 있습니다, 무료이고 계정도 필요 없습니다. 독자는 두 가지 방법으로 아이디어를 지지합니다:",
        "Ai cũng có thể đề xuất ý tưởng kinh doanh tại đây, miễn phí, không cần tài khoản. Người đọc ủng hộ một ý tưởng theo hai cách: đăng ký để"],
    ", or register to": ["，或登记", ", o registrarse para", " 하거나", ", hoặc đăng ký để"],
    ". This is a connections board, not a transaction, no money or equity changes hands on this page; Plateau Strategy follows up directly with anyone who registers interest.": [
        "。这是一个牵线的板块，不是交易平台，本页面不涉及任何资金或股权转手；Plateau Strategy 会直接联系每一位登记意向的人。",
        ". Este es un tablón de conexiones, no una transacción: en esta página no cambia de manos dinero ni participación; Plateau Strategy contacta directamente con quien registre su interés.",
        ". 이곳은 연결을 위한 게시판이지 거래 장소가 아닙니다, 이 페이지에서 돈이나 지분이 오가지 않으며, 관심을 등록한 분께는 Plateau Strategy가 직접 연락드립니다.",
        ". Đây là bảng kết nối, không phải giao dịch, không có tiền hay cổ phần đổi chủ trên trang này; Plateau Strategy sẽ liên hệ trực tiếp với người đăng ký quan tâm."],
    "Practical tools for everyday life, built by our lab, free for everyone. No account, no cost.": [
        "面向日常生活的实用工具，由我们实验室打造，对所有人免费。无需注册，也不收费。",
        "Herramientas prácticas para el día a día, creadas por nuestro laboratorio y gratuitas para todos. Sin cuenta y sin coste.",
        "일상에 쓰는 실용 도구, 저희 랩이 만들었고 누구에게나 무료입니다. 계정도 비용도 필요 없습니다.",
        "Công cụ thiết thực cho cuộc sống hằng ngày, do lab của chúng tôi làm, miễn phí cho tất cả. Không tài khoản, không chi phí."],
    "● LIVE": ["● 实时", "● EN VIVO", "● 실시간", "● TRỰC TIẾP"],
    "Newest discoveries": ["最新发现", "Descubrimientos más recientes", "최신 발견", "Khám phá mới nhất"],
    "Search any place, if the map does not know it yet, you discover it →": [
        "搜索任何地点，如果地图还不认识它，那就是您发现的 →",
        "Busca cualquier lugar: si el mapa aún no lo conoce, lo descubres tú →",
        "어떤 장소든 검색해 보세요, 지도가 아직 모른다면 발견하신 것입니다 →",
        "Tìm bất kỳ nơi nào, nếu bản đồ chưa biết, chính bạn là người khám phá ra →"],
    "Guided Trips": ["导览行程", "Viajes guiados", "가이드 투어", "Chuyến có hướng dẫn"],
    "For travellers & the guides who run them": ["为旅客和带团导游打造", "Para viajeros y los guías que los realizan", "여행자와 이를 진행하는 가이드를 위해", "Dành cho du khách & những hướng dẫn viên dẫn tour"],
    "In-depth trips written by the guides themselves, a student's hour in Harvard Yard, a food route through one neighborhood, with every stop and how long you stand there, before you book. Guides list their own for free.": [
        "由导游亲手写下的深度行程，哈佛校园里的学生一小时，一个街区里的美食路线，每一站以及在那里停留多久，下单前都看得清清楚楚。导游可免费发布自己的行程。",
        "Viajes a fondo escritos por los propios guías: la hora de un estudiante en Harvard Yard, una ruta gastronómica por un barrio, con cada parada y cuánto tiempo estarás allí, antes de reservar. Los guías publican los suyos gratis.",
        "가이드가 직접 쓴 심층 일정, 하버드 야드에서 학생과 보내는 한 시간, 한 동네를 훑는 음식 코스, 예약 전에 모든 방문지와 머무는 시간을 볼 수 있습니다. 가이드는 무료로 등록합니다.",
        "Những hành trình chuyên sâu do chính hướng dẫn viên viết, một giờ cùng sinh viên trong khuôn viên Harvard, một tuyến ẩm thực qua một khu phố, với từng điểm dừng và thời gian ở đó, trước khi bạn đặt. Hướng dẫn viên đăng miễn phí."],
    "Browse Guided Trips →": ["浏览导览行程 →", "Ver viajes guiados →", "가이드 투어 둘러보기 →", "Xem các chuyến có hướng dẫn →"],
    "For drivers, tour guides & tourists": ["为司机、导游和游客打造", "Para conductores, guías y turistas", "기사·가이드·여행자를 위해", "Dành cho tài xế, hướng dẫn viên & du khách"],
    "Pick your attractions and see which ones you can still reach in time, drive time, traffic and closing hours all checked. Every tap builds your day-one, day-two plan. Designed with a professionally licensed tour guide.": [
        "挑好景点，立刻看出哪些还赶得及，车程、路况和关门时间全都算进去了。您每点一下，第一天、第二天的计划就成形一分。由持证导游共同设计。",
        "Elige tus atracciones y ve cuáles te da tiempo a alcanzar: se comprueban el tiempo de viaje, el tráfico y los horarios de cierre. Cada toque construye tu plan del primer y segundo día. Diseñado junto a un guía con licencia profesional.",
        "명소를 고르면 아직 시간 안에 갈 수 있는 곳이 바로 보입니다, 이동 시간, 교통, 마감 시간까지 모두 확인합니다. 누를 때마다 첫날·둘째 날 일정이 만들어집니다. 전문 자격 가이드와 함께 설계했습니다.",
        "Chọn các điểm tham quan và thấy ngay nơi nào còn kịp đến, thời gian lái, giao thông và giờ đóng cửa đều được kiểm tra. Mỗi lần chạm là kế hoạch ngày một, ngày hai thành hình. Được thiết kế cùng hướng dẫn viên có giấy phép."],
    "For the long hauls, free": ["为长途而生，免费", "Para los trayectos largos, gratis", "장거리 운전을 위해, 무료", "Dành cho chặng dài, miễn phí"],
    "Staten Island to Niagara Falls, or any long drive. Give it two points and it finds the fuel, food, rest areas and viewpoints near your actual road, grouped by how many hours in you'll be, so you can plan real breaks instead of scrolling a map.": [
        "从斯塔滕岛到尼亚加拉大瀑布，或任何一段长途。给它两个点，它就会沿着您真正要走的路找出加油站、餐饮、休息区和观景点，并按开到第几小时分组，让您能真正安排休息，而不是一直划地图。",
        "De Staten Island a las cataratas del Niágara, o cualquier trayecto largo. Dale dos puntos y encontrará gasolineras, comida, áreas de descanso y miradores junto a tu carretera real, agrupados por las horas que llevarás conduciendo, para planificar descansos de verdad en vez de arrastrar un mapa.",
        "스태튼아일랜드에서 나이아가라 폭포까지, 또는 어떤 장거리 주행이든. 두 지점을 주면 실제 경로 근처의 주유소·식당·휴게소·전망대를 찾아 몇 시간째인지에 따라 묶어 줍니다. 지도를 넘기는 대신 진짜 휴식을 계획하세요.",
        "Từ Staten Island tới thác Niagara, hay bất kỳ chặng dài nào. Cho hai điểm, nó sẽ tìm trạm xăng, đồ ăn, trạm nghỉ và điểm ngắm cảnh gần đúng tuyến đường bạn đi, nhóm theo số giờ đã lái, để bạn lên kế hoạch nghỉ thật sự thay vì kéo bản đồ."],
    "Plan a road trip →": ["规划一次长途自驾 →", "Planea un viaje por carretera →", "로드트립 계획하기 →", "Lên kế hoạch chuyến đường dài →"],
    "For tourists & trip planning": ["为游客和行程规划打造", "Para turistas y planificación de viajes", "여행자와 일정 계획을 위해", "Dành cho du khách & lập kế hoạch chuyến đi"],
    "A curated guidebook of attractions and restaurants, every type of destination, organized by category, with descriptions and local tips. One tap sends any place into the Trip Planner.": [
        "一本精选的景点与餐厅指南，各类目的地按类别整理，附描述与本地贴士。一键即可把任意地点送入行程规划。",
        "Una guía curada de atracciones y restaurantes: todo tipo de destinos, organizados por categoría, con descripciones y consejos locales. Con un toque envías cualquier lugar al planificador.",
        "엄선한 명소·식당 안내서, 모든 유형의 여행지를 분류별로 정리하고 설명과 현지 팁을 담았습니다. 한 번만 누르면 여행 플래너로 들어갑니다.",
        "Cẩm nang tuyển chọn điểm tham quan và nhà hàng, mọi loại điểm đến, sắp theo danh mục, kèm mô tả và mẹo bản địa. Một chạm là đưa vào công cụ lập kế hoạch."],
    "The Factor Clock": ["因子时钟", "El Reloj de Factores", "팩터 클록", "Đồng hồ Nhân tố"],
    "For anyone who wants an honest forecast": ["献给想要一个诚实预测的人", "Para quien quiera un pronóstico honesto", "정직한 예측을 원하는 모든 이에게", "Dành cho ai muốn một dự báo trung thực"],
    "A prediction clock that never lies to you, weather, markets, your own patterns, every forecast scored against what actually happened. It tells you when it doesn't know. Free while it earns its record ($10/year value).": [
        "一个从不骗您的预测时钟，天气、市场、您自己的规律，每一次预测都拿真实结果来打分。不知道的时候，它会直说。在它积累战绩期间免费（价值每年 10 美元）。",
        "Un reloj de predicción que nunca te miente: clima, mercados, tus propios patrones, y cada pronóstico puntuado contra lo que realmente ocurrió. Te dice cuándo no lo sabe. Gratis mientras se gana su historial (valor de 10 $/año).",
        "결코 거짓말하지 않는 예측 시계, 날씨, 시장, 생활 속 패턴까지, 모든 예측을 실제 결과와 대조해 채점합니다. 모를 때는 모른다고 말합니다. 실적을 쌓는 동안 무료입니다(연 10달러 상당).",
        "Một chiếc đồng hồ dự báo không bao giờ nói dối bạn, thời tiết, thị trường, thói quen của chính bạn, mọi dự báo đều được chấm điểm dựa trên điều đã thực sự xảy ra. Nó nói thẳng khi không biết. Miễn phí trong lúc tạo dựng thành tích (trị giá 10 $/năm)."],
    "Open the Factor Clock →": ["打开因子时钟 →", "Abrir el Reloj de Factores →", "팩터 클록 열기 →", "Mở Đồng hồ Nhân tố →"],
    "More on the way": ["还有更多在路上", "Vienen más", "더 준비 중입니다", "Còn nhiều nữa đang tới"],
    "The lab keeps building": ["实验室还在继续造", "El laboratorio sigue construyendo", "랩은 계속 만듭니다", "Lab vẫn đang tiếp tục xây"],
    "We're adding more free daily-life tools here. Have an idea for a tool you'd use every day? Pitch it on the Business Ideas board.": [
        "我们会在这里持续添加更多免费的生活工具。有什么您每天都会用的工具点子？去商业点子板块提出来。",
        "Seguimos añadiendo aquí más herramientas gratuitas para el día a día. ¿Se te ocurre una que usarías a diario? Propónla en el tablón de Ideas de negocio.",
        "여기에 일상용 무료 도구를 계속 추가하고 있습니다. 매일 쓸 만한 도구 아이디어가 있으신가요? 사업 아이디어 게시판에 제안해 주세요.",
        "Chúng tôi tiếp tục bổ sung công cụ miễn phí cho đời sống hằng ngày tại đây. Bạn có ý tưởng về một công cụ dùng mỗi ngày? Hãy đề xuất trên bảng Ý tưởng kinh doanh."],
    "Suggest a Tool →": ["提议一个工具 →", "Sugerir una herramienta →", "도구 제안하기 →", "Đề xuất một công cụ →"],
})

EXTRA.update({
    # ---------------- Security Parameter + footer ----------------
    "🔒 Security Parameter": ["🔒 安全边界", "🔒 Parámetros de seguridad", "🔒 보안 기준", "🔒 Thông số an toàn"],
    "The rules that protect you when you use this site, your data, your money, and your bookings. These are the safeguards that are already in place, in plain language.": [
        "您使用本站时保护您的规则，您的数据、您的钱、您的订单。以下是已经就位的保障措施，用大白话写清楚。",
        "Las reglas que te protegen al usar este sitio: tus datos, tu dinero y tus reservas. Estas son las salvaguardas que ya están en marcha, en lenguaje claro.",
        "이 사이트를 이용할 때 당신을 보호하는 규칙, 당신의 데이터, 돈, 예약. 이미 적용 중인 안전장치를 쉬운 말로 적었습니다.",
        "Những quy tắc bảo vệ bạn khi dùng trang này, dữ liệu, tiền và các đặt chỗ của bạn. Đây là những biện pháp đã có sẵn, viết bằng ngôn ngữ dễ hiểu."],
    "Owner-only vaults": ["仅所有者可进的保险库", "Bóvedas solo para el propietario", "소유자 전용 금고", "Kho chỉ chủ sở hữu vào được"],
    "Financials · customer records · board documents": ["财务 · 客户记录 · 董事会文件", "Finanzas · registros de clientes · documentos del consejo", "재무 · 고객 기록 · 이사회 문서", "Tài chính · hồ sơ khách hàng · tài liệu hội đồng"],
    "The money records, customer information and governance documents are locked behind a private owner login. No one reaches them without those credentials.": [
        "资金记录、客户信息和治理文件都锁在所有者的私人登录之后。没有这套凭证，谁也进不去。",
        "Los registros de dinero, la información de clientes y los documentos de gobernanza están tras un acceso privado del propietario. Nadie llega a ellos sin esas credenciales.",
        "자금 기록, 고객 정보, 거버넌스 문서는 소유자 전용 로그인 뒤에 잠겨 있습니다. 해당 자격 증명 없이는 누구도 접근할 수 없습니다.",
        "Hồ sơ tiền bạc, thông tin khách hàng và tài liệu quản trị đều nằm sau đăng nhập riêng của chủ sở hữu. Không ai chạm tới được nếu không có thông tin đăng nhập đó."],
    "Secrets stay secret": ["密钥始终保密", "Los secretos siguen siendo secretos", "비밀은 비밀로", "Bí mật vẫn là bí mật"],
    "Keys, tokens & passwords": ["密钥、令牌与密码", "Claves, tokens y contraseñas", "키, 토큰, 비밀번호", "Khóa, token & mật khẩu"],
    "API keys, tokens and passwords live in encrypted server configuration, never in your browser, never shown on a page, never committed to our code.": [
        "API 密钥、令牌和密码都存放在加密的服务器配置中，绝不进入您的浏览器，绝不显示在页面上，也绝不写进我们的代码。",
        "Las claves de API, los tokens y las contraseñas viven en la configuración cifrada del servidor: nunca en tu navegador, nunca visibles en una página, nunca en nuestro código.",
        "API 키, 토큰, 비밀번호는 암호화된 서버 설정에 저장됩니다, 브라우저에 들어가지 않고, 페이지에 표시되지 않으며, 코드에 커밋되지도 않습니다.",
        "Khóa API, token và mật khẩu nằm trong cấu hình máy chủ được mã hóa, không bao giờ vào trình duyệt, không hiển thị trên trang, không được đưa vào mã nguồn."],
    "Payment safety": ["支付安全", "Seguridad en los pagos", "결제 안전", "An toàn thanh toán"],
    "Every checkout": ["每一次结账", "Cada pago", "모든 결제", "Mọi lần thanh toán"],
    "Payments run through Square's PCI-compliant system. We never see or store your full card number, the sensitive part never touches our servers.": [
        "支付通过 Square 符合 PCI 标准的系统完成。我们从不查看也不保存您的完整卡号，敏感部分从不经过我们的服务器。",
        "Los pagos se procesan mediante el sistema de Square, conforme a PCI. Nunca vemos ni guardamos tu número completo de tarjeta: la parte sensible jamás toca nuestros servidores.",
        "결제는 Square의 PCI 준수 시스템을 통해 처리됩니다. 저희는 전체 카드번호를 보거나 저장하지 않으며, 민감한 부분은 서버에 닿지 않습니다.",
        "Thanh toán chạy qua hệ thống đạt chuẩn PCI của Square. Chúng tôi không bao giờ thấy hay lưu số thẻ đầy đủ của bạn, phần nhạy cảm không chạm tới máy chủ của chúng tôi."],
    "We never hold your money": ["我们从不代管您的钱", "Nunca retenemos tu dinero", "저희는 고객님의 돈을 보관하지 않습니다", "Chúng tôi không bao giờ giữ tiền của bạn"],
    "Bookings · guide & driver payouts": ["订单 · 导游与司机结算", "Reservas · pagos a guías y conductores", "예약 · 가이드 및 기사 정산", "Đặt chỗ · chi trả cho hướng dẫn viên & tài xế"],
    "We invoice for our own service and never hold a customer's funds in escrow. Every payout to a driver or guide takes an explicit owner approval, money never moves on its own.": [
        "我们只为自己的服务开具账单，绝不代管客户的资金。每一笔付给司机或导游的款项都需要所有者明确批准，钱不会自己动。",
        "Facturamos por nuestro propio servicio y nunca retenemos fondos del cliente en depósito. Cada pago a un conductor o guía requiere la aprobación explícita del propietario: el dinero nunca se mueve solo.",
        "저희는 자사 서비스에 대해서만 청구하며 고객 자금을 예치하지 않습니다. 기사나 가이드에게 나가는 모든 정산은 소유자의 명시적 승인이 필요합니다, 돈이 저절로 움직이지 않습니다.",
        "Chúng tôi chỉ xuất hóa đơn cho dịch vụ của mình và không bao giờ giữ tiền khách trong ký quỹ. Mỗi khoản chi cho tài xế hay hướng dẫn viên đều cần chủ sở hữu phê duyệt rõ ràng, tiền không tự chuyển đi."],
    "Your data stays yours": ["您的数据仍属于您", "Tus datos siguen siendo tuyos", "고객님의 데이터는 고객님의 것", "Dữ liệu của bạn vẫn là của bạn"],
    "The free tools": ["这些免费工具", "Las herramientas gratuitas", "무료 도구", "Các công cụ miễn phí"],
    "The Trip Planner and Destination Book store only place names and typical visit times, no personal tracking. Your planned trip stays on your own device until you choose to book.": [
        "行程规划和目的地手册只保存地点名称和常见停留时间，不做个人追踪。在您决定下单之前，您排好的行程只留在自己的设备上。",
        "El planificador y el Libro de destinos solo guardan nombres de lugares y tiempos típicos de visita: sin seguimiento personal. Tu viaje planificado permanece en tu dispositivo hasta que decidas reservar.",
        "여행 플래너와 여행지 북은 장소 이름과 통상 관람 시간만 저장합니다, 개인 추적은 없습니다. 예약을 선택하기 전까지 계획한 일정은 본인 기기에만 남습니다.",
        "Công cụ lập kế hoạch và Sổ điểm đến chỉ lưu tên địa điểm và thời gian ghé thăm thông thường, không theo dõi cá nhân. Hành trình bạn lên vẫn nằm trên thiết bị của bạn cho tới khi bạn quyết định đặt."],
    "Give-back goes straight to Treasury": ["回馈直接进入财政部", "La devolución va directa al Tesoro", "환원은 재무부로 바로", "Khoản cho lại đi thẳng tới Bộ Tài chính"],
    "The national-debt donation": ["国债捐赠", "La donación a la deuda nacional", "국가 부채 기부", "Khoản quyên góp giảm nợ công"],
    "Any gift to reduce the national debt goes directly to the U.S. Treasury's own program. We never touch a cent, the button leaves our site for the government's payment page.": [
        "任何用于减少国债的捐赠都直接进入美国财政部自己的项目。我们一分钱也碰不到，按钮会带您离开本站，前往政府的支付页面。",
        "Cualquier donación para reducir la deuda nacional va directamente al programa del propio Tesoro de EE. UU. No tocamos ni un centavo: el botón sale de nuestro sitio hacia la página de pago del gobierno.",
        "국가 부채를 줄이기 위한 기부는 미국 재무부의 자체 프로그램으로 곧바로 갑니다. 저희는 단 한 푼도 만지지 않으며, 버튼은 사이트를 떠나 정부 결제 페이지로 이동합니다.",
        "Mọi khoản tặng để giảm nợ công đều đi thẳng tới chương trình của chính Bộ Tài chính Hoa Kỳ. Chúng tôi không chạm một xu, nút bấm rời khỏi trang của chúng tôi tới trang thanh toán của chính phủ."],
    "This list grows as the site adds features. If a new part of the site handles your data or your money, its safeguard is added here.": [
        "网站每增加一项功能，这份清单就会随之增加。只要有新的部分会处理您的数据或您的钱，它的保障措施就会写进这里。",
        "Esta lista crece a medida que el sitio añade funciones. Si una parte nueva maneja tus datos o tu dinero, su salvaguarda se añade aquí.",
        "사이트에 기능이 늘어나면 이 목록도 함께 늘어납니다. 새로운 부분이 고객님의 데이터나 돈을 다룬다면 그 안전장치가 여기에 추가됩니다.",
        "Danh sách này lớn lên khi trang bổ sung tính năng. Nếu một phần mới xử lý dữ liệu hay tiền của bạn, biện pháp bảo vệ của nó sẽ được thêm vào đây."],
    "An integrated business ecosystem, transportation, real estate and finance in one closed loop, built so revenue compounds instead of leaking away.": [
        "一个一体化的商业生态，交通、房地产与金融构成一个闭环，让收入不断复利，而不是白白流走。",
        "Un ecosistema empresarial integrado: transporte, inmobiliaria y finanzas en un circuito cerrado, construido para que los ingresos se compongan en lugar de escaparse.",
        "통합 비즈니스 생태계, 교통·부동산·금융이 하나의 닫힌 순환을 이루어, 수익이 새지 않고 복리로 쌓이도록 설계했습니다.",
        "Một hệ sinh thái kinh doanh tích hợp, vận tải, bất động sản và tài chính trong một vòng khép kín, xây để doanh thu tích lũy thay vì rò rỉ."],
    "Ride & Drive": ["乘车与驾驶", "Viajar y conducir", "탑승 & 운행", "Đi xe & Lái xe"],
    "Partners": ["合作伙伴", "Socios", "파트너", "Đối tác"],
    "Company": ["公司", "Empresa", "회사", "Công ty"],
    "Security": ["安全", "Seguridad", "보안", "Bảo mật"],
    "Privacy": ["隐私", "Privacidad", "개인정보", "Quyền riêng tư"],

    # ---- Freedom Trail: strings the PAGE composes from numbers -------------
    # These are psxFmt patterns, not sentences. The placeholders are named, so
    # a language may reorder them freely; what a translation must not do is
    # rename one or drop it. They were the whole of the "Chinese is not
    # working" bug: the page built them by concatenation, so they could never
    # be looked up, and the summary under the title stayed in English while
    # the rest of the page translated around it.
    "{m} min": ["{m} 分钟", "{m} min", "{m}분", "{m} phút"],
    "{h} hr {m} min": ["{h} 小时 {m} 分钟", "{h} h {m} min", "{h}시간 {m}분", "{h} giờ {m} phút"],
    "{h} hr": ["{h} 小时", "{h} h", "{h}시간", "{h} giờ"],
    "{count} stops · {walk} walking · {inside} inside · about {total} altogether": [
        "{count} 站 · 步行 {walk} · 参观 {inside} · 合计约 {total}",
        "{count} paradas · {walk} caminando · {inside} dentro · unas {total} en total",
        "{count}개 지점 · 도보 {walk} · 내부 관람 {inside} · 총 약 {total}",
        "{count} điểm · đi bộ {walk} · tham quan {inside} · tổng cộng khoảng {total}"],
    "start · {inside} min here": [
        "起点 · 此处 {inside} 分钟", "inicio · {inside} min aquí",
        "출발 · 이곳에서 {inside}분", "điểm đầu · {inside} phút ở đây"],
    "{leg} min walk · {inside} min here": [
        "步行 {leg} 分钟 · 此处 {inside} 分钟", "{leg} min a pie · {inside} min aquí",
        "도보 {leg}분 · 이곳에서 {inside}분", "đi bộ {leg} phút · {inside} phút ở đây"],
    "{inside} min here": [
        "此处 {inside} 分钟", "{inside} min aquí",
        "이곳에서 {inside}분", "{inside} phút ở đây"],
    "{walk} of walking, {inside} inside.": [
        "步行 {walk}，馆内 {inside}。", "{walk} caminando, {inside} dentro.",
        "도보 {walk}, 내부 관람 {inside}.", "đi bộ {walk}, tham quan {inside}."],
    "The sixteen sites are {mi} miles apart. All sixteen is about {total} altogether, so pick your version below.": [
        "十六处景点相距 {mi} 英里。全程合计约 {total}，请在下方选择你的版本。",
        "Los dieciséis lugares se reparten a lo largo de {mi} millas. Los dieciséis juntos son unas {total}, así que elige tu versión abajo.",
        "열여섯 곳은 {mi}마일에 걸쳐 있습니다. 열여섯 곳 전체는 약 {total} 걸리니 아래에서 원하는 버전을 고르세요.",
        "Mười sáu địa điểm trải dài {mi} dặm. Cả mười sáu điểm mất khoảng {total}, hãy chọn phiên bản của bạn bên dưới."],
    "{n} traveller on the trail right now": [
        "现在有 {n} 位旅人走在这条路上", "{n} viajero en la ruta ahora mismo",
        "지금 {n}명이 트레일을 걷고 있습니다", "{n} khách đang đi trên tuyến ngay lúc này"],
    "{n} travellers on the trail right now": [
        "现在有 {n} 位旅人走在这条路上", "{n} viajeros en la ruta ahora mismo",
        "지금 {n}명이 트레일을 걷고 있습니다", "{n} khách đang đi trên tuyến ngay lúc này"],
    "about {n} steps walked here so far": [
        "至今已在此走过约 {n} 步", "unos {n} pasos caminados aquí hasta ahora",
        "지금까지 이곳에서 약 {n}걸음", "khoảng {n} bước đã đi ở đây cho đến nay"],
    "Building integrated wealth through connected ecosystems.": ["以彼此相连的生态，构筑一体化的财富。", "Construyendo riqueza integrada a través de ecosistemas conectados.", "연결된 생태계를 통해 통합된 부를 만듭니다.", "Xây dựng của cải tích hợp qua các hệ sinh thái kết nối."],
    "Name or initials (optional)": ["姓名或缩写（选填）", "Nombre o iniciales (opcional)", "이름 또는 이니셜 (선택)", "Tên hoặc chữ viết tắt (tùy chọn)"],
    "Amount you gave ($)": ["您捐了多少（美元）", "Cantidad que donaste ($)", "기부하신 금액 ($)", "Số tiền bạn đã tặng ($)"],
    "Business idea, e.g. Mobile EV-detailing fleet for gig drivers": ["商业点子，例如：面向零工司机的移动电动车美容车队", "Idea de negocio, p. ej. flota móvil de detallado de coches eléctricos para conductores gig", "사업 아이디어, 예: 긱 기사 대상 이동형 전기차 디테일링 서비스", "Ý tưởng kinh doanh, ví dụ: đội xe chăm sóc xe điện lưu động cho tài xế tự do"],

    # ---------------- Agent portal ----------------
    "One code, two ways to earn.": ["一个编号，两种赚钱方式。", "Un código, dos formas de ganar.", "코드 하나, 두 가지 수익 방법.", "Một mã, hai cách kiếm tiền."],
    "Refer": ["推荐", "Refiere", "추천", "Giới thiệu"],
    "customers and take a commission on every completed ride, or": ["客户，每完成一趟就拿一次佣金，或者", "clientes y llévate una comisión por cada viaje completado, o", "고객을 소개하고 완료된 모든 운행에 대해 수수료를 받으세요, 또는", "khách hàng và nhận hoa hồng cho mỗi chuyến hoàn thành, hoặc"],
    "guide": ["当导游", "guía", "가이드로서", "hướng dẫn"],
    ": write your own in-depth trip and sell it on our": ["：写一条自己的深度行程，放到我们的",": escribe tu propio viaje a fondo y véndelo en nuestra",": 나만의 심층 여행을 써서 저희",": viết hành trình chuyên sâu của riêng bạn và bán trên"],
    ". The same agent code does both. Anyone can join, as an individual or an organization.": [
        "上出售。同一个代理编号两件事都能办。任何人都可以加入，个人或机构均可。",
        ". El mismo código de agente sirve para ambas cosas. Cualquiera puede unirse, como particular o como organización.",
        "에서 판매하세요. 같은 에이전트 코드로 둘 다 가능합니다. 개인이든 단체든 누구나 참여할 수 있습니다.",
        ". Cùng một mã đại lý làm được cả hai. Ai cũng có thể tham gia, với tư cách cá nhân hoặc tổ chức."],
    "Guides register here too, a student running a campus walk, a driver who knows one neighborhood properly. Your code is what proves the trip was written by a real guide.": [
        "导游也在这里注册，带校园徒步的学生、把某个街区摸得门儿清的司机，都算。您的编号就是这条行程出自真正导游之手的凭证。",
        "Los guías también se registran aquí: un estudiante que hace un paseo por el campus, un conductor que conoce bien un barrio. Tu código es lo que demuestra que el viaje lo escribió un guía real.",
        "가이드도 여기서 등록합니다, 캠퍼스 도보를 진행하는 학생, 한 동네를 제대로 아는 기사 모두요. 당신의 코드가 그 일정을 실제 가이드가 썼다는 증거입니다.",
        "Hướng dẫn viên cũng đăng ký tại đây, một sinh viên dẫn tour trong trường, một tài xế thuộc lòng một khu phố. Mã của bạn là bằng chứng hành trình do hướng dẫn viên thật viết ra."],
    "Register & Get My Code": ["注册并获取我的编号", "Registrarme y obtener mi código", "등록하고 코드 받기", "Đăng ký & nhận mã của tôi"],
    "Book a Trip": ["预订行程", "Reservar un viaje", "여행 예약", "Đặt một chuyến"],
    "Sell My Own Trips": ["出售我自己的行程", "Vender mis propios viajes", "내 여행 판매하기", "Bán hành trình của tôi"],
    "Book any trip for your client, airport, cruise, tour, or a custom day out. It comes straight to our dispatch and your commission is tracked automatically.": [
        "为您的客户预订任何行程，机场、邮轮、观光或定制一日游。订单会直接进入我们的调度中心，您的佣金自动记账。",
        "Reserva cualquier viaje para tu cliente: aeropuerto, crucero, tour o un día a medida. Llega directamente a nuestra central y tu comisión se registra automáticamente.",
        "고객을 위해 어떤 일정이든 예약하세요, 공항, 크루즈, 투어, 맞춤 하루 코스. 저희 배차로 바로 접수되고 수수료는 자동으로 집계됩니다.",
        "Đặt bất kỳ chuyến nào cho khách của bạn, sân bay, du thuyền, tour hoặc một ngày theo yêu cầu. Nó tới thẳng bộ phận điều phối và hoa hồng của bạn được ghi nhận tự động."],
    "Trip type": ["行程类型", "Tipo de viaje", "여행 유형", "Loại chuyến"],
    "✈️ Airport": ["✈️ 机场", "✈️ Aeropuerto", "✈️ 공항", "✈️ Sân bay"],
    "🛳️ Cruise": ["🛳️ 邮轮", "🛳️ Crucero", "🛳️ 크루즈", "🛳️ Du thuyền"],
    "🗺️ Tour": ["🗺️ 观光", "🗺️ Tour", "🗺️ 투어", "🗺️ Tour"],
    "✨ Custom": ["✨ 定制", "✨ Personalizado", "✨ 맞춤", "✨ Tùy chỉnh"],
    "Drop-off (airport)": ["送达地点（机场）", "Destino (aeropuerto)", "하차 장소 (공항)", "Điểm trả khách (sân bay)"],
    "Flight # (optional)": ["航班号（选填）", "N.º de vuelo (opcional)", "항공편 번호 (선택)", "Số hiệu chuyến bay (tùy chọn)"],
    "Cruise terminal / port": ["邮轮码头 / 港口", "Terminal de cruceros / puerto", "크루즈 터미널 / 항구", "Bến du thuyền / cảng"],
    "Cruise line": ["邮轮公司", "Naviera", "크루즈 선사", "Hãng du thuyền"],
    "Ship": ["船名", "Barco", "선박", "Tàu"],
    "Sailing date": ["起航日期", "Fecha de zarpe", "출항일", "Ngày khởi hành tàu"],
    "Trip": ["行程", "Viaje", "여정", "Chuyến"],
    "One way (to the port)": ["单程（送到港口）", "Solo ida (al puerto)", "편도 (항구까지)", "Một chiều (tới cảng)"],
    "Round trip (return pickup too)": ["往返（含返程接送）", "Ida y vuelta (con recogida de regreso)", "왕복 (귀로 픽업 포함)", "Khứ hồi (đón cả lượt về)"],
    "Itinerary / stops": ["行程 / 停靠点", "Itinerario / paradas", "일정 / 방문지", "Lịch trình / điểm dừng"],
    "Duration (hours)": ["时长（小时）", "Duración (horas)", "소요 시간 (시간)", "Thời lượng (giờ)"],
    "Duration (hours, optional)": ["时长（小时，选填）", "Duración (horas, opcional)", "소요 시간 (시간, 선택)", "Thời lượng (giờ, tùy chọn)"],
    "End location (optional)": ["结束地点（选填）", "Lugar final (opcional)", "종료 장소 (선택)", "Địa điểm kết thúc (tùy chọn)"],
    "Trip title": ["行程标题", "Título del viaje", "여정 제목", "Tiêu đề chuyến"],
    "What does the client want?": ["客户想要什么？", "¿Qué quiere el cliente?", "고객이 원하는 것은?", "Khách hàng muốn gì?"],
    "Special requests / notes": ["特殊要求 / 备注", "Peticiones especiales / notas", "특별 요청 / 메모", "Yêu cầu đặc biệt / ghi chú"],
    "Request a quote instead, we'll price it and confirm back": ["改为索取报价，我们会定价并回复确认", "Pedir presupuesto en su lugar: lo valoramos y te confirmamos", "대신 견적 요청, 가격을 산정해 다시 알려드립니다", "Yêu cầu báo giá thay thế, chúng tôi sẽ định giá và xác nhận lại"],
    "You earn a flat commission on every trip you book that's completed.": ["您预订的每一趟行程只要完成，就能拿到一笔固定佣金。", "Ganas una comisión fija por cada viaje que reserves y se complete.", "예약하신 여정이 완료될 때마다 정액 수수료를 받습니다.", "Bạn nhận hoa hồng cố định cho mỗi chuyến bạn đặt và hoàn thành."],
    "Send Booking": ["提交预订", "Enviar reserva", "예약 보내기", "Gửi đặt chỗ"],
    "💸 Get Paid": ["💸 领取收入", "💸 Cobrar", "💸 정산 받기", "💸 Nhận tiền"],
    "Available to pay out": ["可提现金额", "Disponible para cobrar", "출금 가능 금액", "Có thể chi trả"],
    "Requested (awaiting)": ["已申请（待处理）", "Solicitado (pendiente)", "신청됨 (대기 중)", "Đã yêu cầu (đang chờ)"],
    "Paid out so far": ["累计已支付", "Pagado hasta ahora", "지금까지 지급됨", "Đã chi trả đến nay"],
    "PayPal email, get paid directly": ["PayPal 邮箱，直接收款", "Correo de PayPal, cobra directamente", "PayPal 이메일, 바로 입금받기", "Email PayPal, nhận tiền trực tiếp"],
    "Save": ["保存", "Guardar", "저장", "Lưu"],
    "Other way to be paid? (optional)": ["其他收款方式？（选填）", "¿Otra forma de cobro? (opcional)", "다른 수령 방법? (선택)", "Cách nhận tiền khác? (tùy chọn)"],
    "Request Payout": ["申请提现", "Solicitar pago", "정산 신청", "Yêu cầu chi trả"],
    "Request": ["申请单", "Solicitud", "신청", "Yêu cầu"],
    "Requested": ["申请时间", "Solicitado", "신청일", "Đã yêu cầu"],
    "Paid": ["支付时间", "Pagado", "지급일", "Đã trả"],
    "No payout requests yet, when rides complete, your money shows as available here.": ["还没有提现申请，行程完成后，您的钱会在这里显示为可提现。", "Aún no hay solicitudes de pago: cuando los viajes se completen, tu dinero aparecerá disponible aquí.", "아직 정산 신청이 없습니다, 운행이 완료되면 이곳에 출금 가능 금액이 표시됩니다.", "Chưa có yêu cầu chi trả nào, khi các chuyến hoàn tất, tiền của bạn sẽ hiện ở đây."],
    "Referring rides earns a commission. Guiding earns the whole fare, you set it. Write the trip you already know by heart: your stops, how long you actually stand at each one, what you say there, and what it costs. It goes on the public": [
        "推荐用车赚的是佣金。带团导览赚的是整笔团费，价格由您定。把您早已烂熟于心的那条行程写下来：您的站点、每站实际停留多久、您在那里讲什么、以及收费多少。它会出现在公开的",
        "Referir viajes da comisión. Guiar da la tarifa entera, que tú fijas. Escribe el viaje que ya te sabes de memoria: tus paradas, cuánto tiempo estás realmente en cada una, qué cuentas allí y cuánto cuesta. Aparecerá en la",
        "차량을 추천하면 수수료를 받고, 가이드를 하면 요금 전액을 받습니다, 가격은 직접 정하십니다. 이미 훤히 아는 그 일정을 적어 보세요: 방문지, 각 지점에서 실제로 머무는 시간, 그곳에서 하는 이야기, 그리고 비용. 공개된",
        "Giới thiệu chuyến xe thì nhận hoa hồng. Dẫn tour thì nhận trọn tiền tour, do bạn định giá. Hãy viết ra hành trình bạn đã thuộc nằm lòng: các điểm dừng, thời gian thực sự ở mỗi nơi, điều bạn kể ở đó, và chi phí. Nó sẽ lên"],
    "the moment you list it, and travellers reach you through us, your contact details are never published.": [
        "上，发布即刻可见；旅客通过我们联系您，您的联系方式绝不会被公开。",
        "en cuanto lo publiques, y los viajeros te contactarán a través de nosotros: tus datos de contacto nunca se publican.",
        "여행 페이지에 등록 즉시 올라가며, 여행자는 저희를 통해 연락합니다, 회원님의 연락처는 절대 공개되지 않습니다.",
        "ngay khi bạn đăng, và du khách liên hệ bạn qua chúng tôi, thông tin liên hệ của bạn không bao giờ được công khai."],
    "Your code doubles as your guide credential": ["您的编号同时也是导游身份凭证", "Tu código sirve además como credencial de guía", "회원님의 코드는 가이드 자격 증명도 겸합니다", "Mã của bạn đồng thời là chứng nhận hướng dẫn viên"],
    "This is what proves a real guide wrote the trip.": ["这就是证明行程出自真正导游之手的凭证。", "Esto es lo que demuestra que un guía real escribió el viaje.", "이것이 실제 가이드가 일정을 작성했다는 증거입니다.", "Đây là bằng chứng một hướng dẫn viên thật đã viết hành trình."],
    "Open Guide Studio →": ["打开导游工作室 →", "Abrir el Estudio de guías →", "가이드 스튜디오 열기 →", "Mở Xưởng hướng dẫn viên →"],
    "Zelle / cash / check, and where": ["Zelle / 现金 / 支票，以及收款地点", "Zelle / efectivo / cheque, y dónde", "Zelle / 현금 / 수표, 그리고 어디로", "Zelle / tiền mặt / séc, và ở đâu"],

    # ---------------- Dispatch + driver ----------------
    "Atlas →": ["Atlas →", "Atlas →", "Atlas →", "Atlas →"],
    "Archive →": ["档案库 →", "Archivo →", "아카이브 →", "Kho lưu trữ →"],
    "Every paper trail, bookings, contacts, agreements & paperwork": ["全部纸面记录，订单、联系人、协议与文件", "Todo el rastro documental: reservas, contactos, acuerdos y papeleo", "모든 서류 기록, 예약, 연락처, 계약, 문서", "Mọi dấu vết giấy tờ, đặt chỗ, liên hệ, thỏa thuận & hồ sơ"],
    "💸 Payouts": ["💸 结算", "💸 Pagos", "💸 정산", "💸 Chi trả"],
    "Agents & driver-agents request their earned money here. Send it your way (Zelle / cash / check), then mark it paid, the ledger stays honest. Balances show what each agent can still request.": [
        "代理人和司机代理在这里申请自己赚到的钱。您用自己的方式付款（Zelle / 现金 / 支票），然后标记为已支付，账目就始终准确。余额显示每位代理还能申请多少。",
        "Los agentes y conductores-agentes solicitan aquí el dinero que han ganado. Págalo a tu manera (Zelle / efectivo / cheque) y márcalo como pagado: el libro se mantiene fiel. Los saldos muestran cuánto puede pedir todavía cada agente.",
        "에이전트와 기사 겸 에이전트가 이곳에서 번 돈을 신청합니다. 원하는 방식(Zelle / 현금 / 수표)으로 지급한 뒤 지급 완료로 표시하면 장부가 정확하게 유지됩니다. 잔액은 각 에이전트가 아직 신청할 수 있는 금액입니다.",
        "Đại lý và tài xế kiêm đại lý yêu cầu khoản đã kiếm được tại đây. Bạn chi trả theo cách của mình (Zelle / tiền mặt / séc) rồi đánh dấu đã trả, sổ sách luôn khớp. Số dư cho biết mỗi đại lý còn có thể yêu cầu bao nhiêu."],
    "Preferred method": ["首选方式", "Método preferido", "선호 방식", "Cách ưa dùng"],
    "No payout requests yet.": ["还没有提现申请。", "Aún no hay solicitudes de pago.", "아직 정산 신청이 없습니다.", "Chưa có yêu cầu chi trả nào."],
    "Driver Dashboard, Plateau Strategy": ["司机面板, Plateau Strategy", "Panel del conductor, Plateau Strategy", "기사 대시보드, Plateau Strategy", "Bảng điều khiển tài xế, Plateau Strategy"],
    "🚗 Driver Dashboard": ["🚗 司机面板", "🚗 Panel del conductor", "🚗 기사 대시보드", "🚗 Bảng điều khiển tài xế"],
    "live": ["实时", "en vivo", "실시간", "trực tiếp"],
    "Booking page": ["预订页面", "Página de reservas", "예약 페이지", "Trang đặt chỗ"],
    "booking page": ["预订页面", "página de reservas", "예약 페이지", "trang đặt chỗ"],
    "No reservations yet. New bookings from the": ["还没有预订。来自", "Aún no hay reservas. Las nuevas reservas de la", "아직 예약이 없습니다. ", "Chưa có đặt chỗ nào. Đơn mới từ"],
    "appear here automatically.": ["的新订单会自动出现在这里。", "aparecen aquí automáticamente.", "에서 들어온 새 예약이 여기에 자동으로 표시됩니다.", "sẽ tự động hiện ở đây."],
})

EXTRA.update({
    "Everything on this site is here to get people out of a hole and into a fortune, the free tools, the work, the trading research. If it works for you, we ask one thing, and only if you want to:": [
        "这个网站上的一切，免费工具、我们做的事、交易研究，都是为了帮人从坑里爬出来，走向富足。如果它对您管用，我们只有一个请求，而且完全自愿：",
        "Todo lo que hay en este sitio existe para sacar a la gente de un agujero y llevarla a la prosperidad: las herramientas gratuitas, el trabajo, la investigación de trading. Si te funciona, te pedimos una sola cosa, y solo si quieres:",
        "이 사이트의 모든 것, 무료 도구, 저희가 하는 일, 트레이딩 연구, 은 사람들을 구덩이에서 꺼내 풍요로 이끌기 위해 있습니다. 도움이 되셨다면 딱 한 가지만 부탁드립니다. 원하실 때만요:",
        "Mọi thứ trên trang này tồn tại để đưa người ta ra khỏi hố sâu và tới chỗ khá giả, các công cụ miễn phí, công việc, nghiên cứu giao dịch. Nếu nó có ích cho bạn, chúng tôi chỉ xin một điều, và chỉ khi bạn muốn:"],
    "The national debt is measured in trillions; no single gift changes that arithmetic. That isn't the point, the point is the act, and that it's real, voluntary, and goes where we say it goes. Gifts to the United States for exclusively public purposes are generally tax-deductible, but we're not tax advisors, ask yours. Plateau Strategy Solution Lab is not affiliated with, and does not represent, the U.S. Treasury or any government agency.": [
        "国债以万亿计；任何一笔捐赠都改变不了这个算术。但这不是重点，重点在于这个举动本身，在于它真实、自愿，并且确实流向我们所说的地方。为纯公共用途向美国政府所作的捐赠通常可以抵税，但我们不是税务顾问，请咨询您自己的顾问。Plateau Strategy Solution Lab 与美国财政部或任何政府机构均无隶属关系，也不代表它们。",
        "La deuda nacional se mide en billones; ninguna donación cambia esa aritmética. No se trata de eso: se trata del acto, y de que sea real, voluntario y vaya adonde decimos que va. Las donaciones a Estados Unidos con fines exclusivamente públicos suelen ser deducibles, pero no somos asesores fiscales: consulta al tuyo. Plateau Strategy Solution Lab no está afiliado al Tesoro de EE. UU. ni a ninguna agencia gubernamental, ni los representa.",
        "국가 부채는 조 단위입니다. 한 번의 기부가 그 산술을 바꾸지는 못합니다. 요점은 그것이 아니라 행위 자체이며, 그것이 실제이고 자발적이며 저희가 말씀드린 곳으로 간다는 사실입니다. 오로지 공공 목적으로 미국에 하는 기부는 대체로 세금 공제 대상이지만, 저희는 세무 자문가가 아니니 담당자에게 문의하세요. Plateau Strategy Solution Lab은 미국 재무부나 어떤 정부 기관과도 제휴하지 않으며 이를 대표하지 않습니다.",
        "Nợ công được tính bằng nghìn tỷ; không khoản tặng đơn lẻ nào thay đổi phép tính đó. Vấn đề không nằm ở đó, mà ở chính hành động, và rằng nó có thật, tự nguyện, và đi đúng nơi chúng tôi nói. Các khoản tặng cho Hoa Kỳ vì mục đích thuần công cộng thường được khấu trừ thuế, nhưng chúng tôi không phải cố vấn thuế, hãy hỏi cố vấn của bạn. Plateau Strategy Solution Lab không liên kết với và không đại diện cho Bộ Tài chính Hoa Kỳ hay bất kỳ cơ quan chính phủ nào."],
    "The problem, the business model, how it makes money, and what it needs to launch…": [
        "要解决的问题、商业模式、怎么赚钱，以及启动需要什么…",
        "El problema, el modelo de negocio, cómo gana dinero y qué necesita para lanzarse…",
        "해결하려는 문제, 사업 모델, 수익 방식, 그리고 시작에 필요한 것…",
        "Vấn đề, mô hình kinh doanh, cách kiếm tiền, và cần gì để khởi động…"],
    "The blueprint (optional): the working detail you do not want public. It stays sealed; a reader must sign in to open it, and every reader is recorded by name.": [
        "蓝图（可选）：你不想公开的完整方案细节。它会被封存；读者必须登录才能打开，每位读者都会记录姓名。",
        "El plano (opcional): el detalle de trabajo que no quieres hacer público. Queda sellado; el lector debe iniciar sesión para abrirlo, y cada lector queda registrado con su nombre.",
        "블루프린트(선택): 공개하고 싶지 않은 실무 세부 내용. 봉인된 상태로 유지되며, 독자는 로그인해야 열 수 있고 열람한 독자의 이름이 기록됩니다.",
        "Bản thiết kế (tùy chọn): phần chi tiết bạn không muốn công khai. Nó được niêm phong; người đọc phải đăng nhập để mở, và mỗi người đọc đều được ghi lại kèm tên."],
    "For every city we have walked": [
        "为我们走过的每一座城市",
        "Para cada ciudad que hemos caminado",
        "저희가 걸어 본 모든 도시를 위해",
        "Cho mỗi thành phố chúng tôi đã đi bộ qua"],
    "Every map on this site, drawn on foot, in one index: measured corridors, honest estimates, and the walks you save under your own sign-in.": [
        "本站所有地图都用脚步绘成，汇于一页索引：实测的通道、诚实的估算，以及你在自己的登录名下保存的路线。",
        "Todos los mapas de este sitio, dibujados a pie, en un solo índice: pasillos medidos, estimaciones honestas y los recorridos que guardas con tu propio inicio de sesión.",
        "이 사이트의 모든 지도를 걸어서 그려 하나의 색인에 모았습니다. 실측된 통로, 정직한 추정치, 그리고 자신의 로그인으로 저장한 산책 경로까지.",
        "Mọi bản đồ trên trang này, vẽ bằng đôi chân, trong một mục lục: các hành lang đã đo, ước tính trung thực, và những chuyến đi bạn lưu dưới đăng nhập của mình."],
    "Open The Walks →": [
        "打开 The Walks →",
        "Abrir The Walks →",
        "The Walks 열기 →",
        "Mở The Walks →"],
    "Attach your drawing (optional). A photo of a sketch counts. It stays sealed with the blueprint.": [
        "附上你的图纸（可选）。手绘草图的照片也可以。它会与蓝图一起封存。",
        "Adjunta tu dibujo (opcional). Una foto de un boceto cuenta. Queda sellado junto con el plano.",
        "도면을 첨부하세요(선택). 스케치를 찍은 사진도 됩니다. 블루프린트와 함께 봉인됩니다.",
        "Đính kèm bản vẽ của bạn (tùy chọn). Ảnh chụp bản phác thảo cũng được. Nó được niêm phong cùng bản thiết kế."],
    "What you publish here is a public disclosure. In the US that starts a twelve-month clock to file for a patent; in most other countries there is no grace period at all. If your idea is genuinely patentable, see a patent attorney before posting, not after. The sealed blueprint keeps detail off the public page and names everyone who reads it; it is not a patent filing.": [
        "在这里发布即构成公开披露。在美国，公开后你有十二个月的时间申请专利；在其他大多数国家则完全没有宽限期。如果你的点子确实可以申请专利，请在发布之前先咨询专利律师，而不是之后。封存的蓝图能让细节不出现在公开页面上，并记录每一位读者的实名；但它不是专利申请。",
        "Lo que publicas aquí es una divulgación pública. En EE. UU. eso inicia un plazo de doce meses para solicitar una patente; en la mayoría de los demás países no hay período de gracia alguno. Si tu idea es realmente patentable, consulta a un abogado de patentes antes de publicar, no después. El plano sellado mantiene el detalle fuera de la página pública y registra el nombre de cada lector; no es una solicitud de patente.",
        "여기에 게시하는 것은 공개 공표에 해당합니다. 미국에서는 공개 후 특허 출원까지 12개월의 기한이 시작되고, 대부분의 다른 나라에는 유예 기간이 전혀 없습니다. 아이디어가 정말 특허 가능성이 있다면 게시 전에 특허 변호사와 상담하세요, 게시 후가 아니라. 봉인된 블루프린트는 세부 내용을 공개 페이지에서 제외하고 모든 열람자의 이름을 기록하지만, 특허 출원을 대신하지는 않습니다.",
        "Những gì bạn đăng ở đây là một công bố công khai. Tại Mỹ, điều đó khởi động thời hạn mười hai tháng để nộp đơn xin cấp bằng sáng chế; ở hầu hết các nước khác thì không có thời gian ân hạn nào cả. Nếu ý tưởng của bạn thực sự có thể được cấp bằng sáng chế, hãy gặp luật sư sáng chế trước khi đăng, không phải sau. Bản thiết kế niêm phong giữ chi tiết ngoài trang công khai và ghi tên mọi người đọc; nó không phải là đơn xin cấp bằng sáng chế."],
    "A sealed blueprint travels with this idea. Open it from the idea page; sign-in required, every reader recorded by name.": [
        "这个点子附带一份封存的蓝图。请在点子页面打开；需要登录，每位读者都会记录姓名。",
        "Un plano sellado acompaña esta idea. Ábrelo desde la página de la idea; requiere iniciar sesión, y cada lector queda registrado con su nombre.",
        "이 아이디어에는 봉인된 블루프린트가 함께합니다. 아이디어 페이지에서 여세요. 로그인이 필요하며 열람한 독자의 이름이 기록됩니다.",
        "Một bản thiết kế niêm phong đi kèm ý tưởng này. Mở nó từ trang ý tưởng; cần đăng nhập, và mỗi người đọc đều được ghi lại kèm tên."],
    "Car seat, extra luggage, meet & greet, accessibility…": ["儿童座椅、额外行李、接机举牌、无障碍需求…", "Silla infantil, equipaje extra, recepción con cartel, accesibilidad…", "카시트, 추가 수하물, 미팅 서비스, 이동 편의…", "Ghế trẻ em, hành lý thêm, đón có bảng tên, hỗ trợ tiếp cận…"],
    "Trip Planner, Plateau Strategy Solution Lab": ["行程规划, Plateau Strategy Solution Lab", "Planificador de viaje, Plateau Strategy Solution Lab", "여행 플래너, Plateau Strategy Solution Lab", "Lập kế hoạch chuyến đi, Plateau Strategy Solution Lab"],
    "Dates, group size, must-sees…": ["日期、人数、必去的地方…", "Fechas, tamaño del grupo, imprescindibles…", "날짜, 인원, 꼭 가고 싶은 곳…", "Ngày, số người, những nơi nhất định phải tới…"],
    "Two hours inside the Yard with someone who studies here, the statue that lies three times, why the gates are numbered, what the freshman dorms are actually like, and the reading room most tours never enter.": [
        "和在这里念书的人一起，在哈佛园里待上两小时，那尊“说了三个谎”的雕像、校门为什么要编号、新生宿舍到底什么样，还有多数旅行团从没进过的那间阅览室。",
        "Dos horas dentro del Yard con alguien que estudia aquí: la estatua que miente tres veces, por qué las verjas están numeradas, cómo son de verdad las residencias de primer año y la sala de lectura en la que casi ningún tour entra.",
        "이곳에서 공부하는 사람과 함께 하버드 야드에서 보내는 두 시간, 세 번 거짓말하는 동상, 문에 번호가 붙은 이유, 신입생 기숙사의 실제 모습, 그리고 대부분의 투어가 들어가지 않는 열람실까지.",
        "Hai giờ trong khuôn viên Harvard cùng một người đang học ở đây, bức tượng nói dối ba lần, vì sao các cổng được đánh số, ký túc xá năm nhất thực sự ra sao, và phòng đọc mà hầu hết các tour không bao giờ bước vào."],
    "1½ h": ["1.5 小时", "1½ h", "1시간 30분", "1½ giờ"],
    "2 h": ["2 小时", "2 h", "2시간", "2 giờ"],
    "3 h": ["3 小时", "3 h", "3시간", "3 giờ"],
})

# Single letters, code-like placeholders and route labels a reader does not need
# translated, and the sample text inside example inputs, which stays in English
# so the format it demonstrates is still legible.
EXTRA_SKIP |= {
    "Plateau Strategy Solution Lab, Integrated Business Ecosystem",
    "N", "A", "B", "To",
    "Pike Place → Chihuly Garden → Kerry Park → dinner in Ballard",
    "Pick up 4 guests, visit 3 wineries, lunch stop, ~5 hours, back by 5pm",
    "e.g. 120", "e.g. rooftop bar with a skyline view, or Space Needle",
}

EXTRA.update({
    # ---------------- Deflator (research page) ----------------
    # The disclaimers here are legal text. They are translated faithfully rather
    # than loosely, because a reader who understands the pitch but not the
    # warning is worse off than one who reads neither.
    "Plateau Strategy Deflator, Automated Trading Research": ["Plateau Strategy Deflator，自动化交易研究", "Plateau Strategy Deflator, Investigación de trading automatizado", "Plateau Strategy Deflator, 자동 매매 연구", "Plateau Strategy Deflator, Nghiên cứu giao dịch tự động"],
    "An automated crypto-trading": ["一个自动化加密货币交易", "Un proyecto de investigación de trading", "자동 암호화폐 매매", "Một dự án nghiên cứu giao dịch"],
    "research project": ["研究项目", "de criptomonedas automatizado", "연구 프로젝트", "tiền mã hóa tự động"],
    ", fighting inflation with disciplined, self-learning automation.": ["，用有纪律、会自我学习的自动化对抗通胀。", ", luchando contra la inflación con automatización disciplinada que aprende sola.", ", 규율 있고 스스로 학습하는 자동화로 인플레이션에 맞섭니다.", ", chống lạm phát bằng tự động hóa kỷ luật, tự học."],
    "Status: private verification phase.": ["状态：私下验证阶段。", "Estado: fase de verificación privada.", "상태: 비공개 검증 단계.", "Trạng thái: giai đoạn xác minh riêng tư."],
    "The system is currently trading only its founder's own capital while it builds an audited, honest track record.": [
        "目前系统只用创始人自己的资金交易，同时积累一份可审计、诚实的业绩记录。",
        "Por ahora el sistema opera únicamente con el capital propio del fundador mientras construye un historial auditado y honesto.",
        "현재 이 시스템은 감사 가능한 정직한 실적을 쌓는 동안 창업자 본인의 자본만으로 매매합니다.",
        "Hiện hệ thống chỉ giao dịch bằng vốn của chính người sáng lập trong lúc xây dựng một hồ sơ thành tích trung thực, có thể kiểm toán."],
    "🎯 Disciplined accumulation": ["🎯 有纪律地积累", "🎯 Acumulación disciplinada", "🎯 규율 있는 축적", "🎯 Tích lũy có kỷ luật"],
        "🧠 Self-learning execution": ["🧠 会自我学习的执行", "🧠 Ejecución que aprende sola", "🧠 스스로 학습하는 집행", "🧠 Thực thi tự học"],
        "📊 One honest scoreboard": ["📊 一块诚实的记分牌", "📊 Un marcador honesto", "📊 정직한 하나의 성적표", "📊 Một bảng điểm trung thực"],
    "Performance is measured as": ["业绩以", "El rendimiento se mide como", "성과는", "Hiệu suất được đo bằng"],
    "True Net": ["真实净值", "Neto Real", "실질 순손익", "Lãi ròng thật"],
    ", realized plus unrealized, fees included. No vanity win-rates. When results are published, they will be the real number.": [
        "衡量，已实现加未实现，含手续费。不做好看的胜率。等到公布结果时，那就是真实的数字。",
        ", realizado más no realizado, con comisiones incluidas. Sin tasas de acierto de escaparate. Cuando se publiquen los resultados, será la cifra real.",
        "로 측정합니다, 실현 손익에 미실현 손익을 더하고 수수료까지 포함합니다. 보기 좋은 승률은 없습니다. 결과를 공개할 때 그것이 진짜 숫자입니다.",
        ", đã hiện thực hóa cộng chưa hiện thực hóa, đã tính phí. Không có tỷ lệ thắng làm màu. Khi công bố, đó sẽ là con số thật."],
    "Founder's conviction": ["创始人的信念", "Convicción del fundador", "창업자의 확신", "Niềm tin của người sáng lập"],
        "Public data collection record": ["公开数据采集记录", "Registro público de recopilación de datos", "공개 데이터 수집 기록", "Hồ sơ thu thập dữ liệu công khai"],
    "Nothing published yet. This moves only when verified results go public.": ["尚未发布任何内容。只有当经过验证的结果公开时，这里才会变动。", "Aún no se ha publicado nada. Esto solo se mueve cuando se hacen públicos resultados verificados.", "아직 공개된 것이 없습니다. 검증된 결과가 공개될 때만 갱신됩니다.", "Chưa công bố gì. Mục này chỉ thay đổi khi có kết quả đã kiểm chứng được công khai."],
    "Follow the research": ["关注这项研究", "Sigue la investigación", "연구를 지켜보기", "Theo dõi nghiên cứu"],
    "Leave your email and you'll be notified when the verified track record is published. No spam, no sales pitch, one update when the numbers are real.": [
        "留下邮箱，等经过验证的业绩记录发布时我们会通知您。不发垃圾邮件，不做推销，数字为真时，只发一封更新。",
        "Deja tu correo y te avisaremos cuando se publique el historial verificado. Sin spam ni discurso de venta: una sola actualización cuando las cifras sean reales.",
        "이메일을 남겨 주시면 검증된 실적이 공개될 때 알려드립니다. 스팸도 영업도 없습니다, 숫자가 진짜가 되었을 때 딱 한 번 안내드립니다.",
        "Để lại email và bạn sẽ được báo khi hồ sơ thành tích đã kiểm chứng được công bố. Không spam, không chào mời, chỉ một thông báo khi các con số là thật."],
    "Notify me": ["通知我", "Avísame", "알림 받기", "Báo cho tôi"],
    "Important:": ["重要提示：", "Importante:", "중요:", "Quan trọng:"],
    "This page describes an internal research project of Plateau Strategy Solution Lab. It is": [
        "本页介绍的是 Plateau Strategy Solution Lab 的一个内部研究项目。它",
        "Esta página describe un proyecto de investigación interno de Plateau Strategy Solution Lab. No es",
        "이 페이지는 Plateau Strategy Solution Lab의 내부 연구 프로젝트를 설명합니다. 이는",
        "Trang này mô tả một dự án nghiên cứu nội bộ của Plateau Strategy Solution Lab. Đây"],
    "not an offer to sell, or a solicitation to buy, any security, investment product, or advisory service": [
        "不是出售任何证券、投资产品或顾问服务的要约，也不是购买邀请",
        "una oferta de venta, ni una solicitud de compra, de ningún valor, producto de inversión o servicio de asesoría",
        "어떤 증권·투자상품·자문 서비스의 매도 제안이나 매수 권유가 아닙니다",
        "không phải lời chào bán, hay mời mua, bất kỳ chứng khoán, sản phẩm đầu tư hoặc dịch vụ tư vấn nào"],
    "Nothing is offered or sold today": ["今天不提供也不出售任何东西", "Hoy no se ofrece ni se vende nada", "오늘은 어떤 것도 제공되거나 판매되지 않습니다", "Hôm nay không có gì được chào bán"],
    "not investment advice": ["不构成投资建议", "no es asesoramiento de inversión", "투자 자문이 아닙니다", "không phải lời khuyên đầu tư"],
        "and": ["以及", "y", "그리고", "và"],
    ", this page exists so you can follow the research.": ["，这个页面的存在，只是为了让您能跟进这项研究。", ", esta página existe para que puedas seguir la investigación.", ", 이 페이지는 연구를 지켜보실 수 있도록 존재합니다.", ", trang này tồn tại để bạn có thể theo dõi nghiên cứu."],
})

EXTRA.update({
    # ---------------- Factor Clock ----------------
    "The Factor Clock, Plateau Strategy": ["因子时钟, Plateau Strategy", "El Reloj de Factores, Plateau Strategy", "팩터 클록, Plateau Strategy", "Đồng hồ Nhân tố, Plateau Strategy"],
    "← Plateau Strategy": ["← Plateau Strategy", "← Plateau Strategy", "← Plateau Strategy", "← Plateau Strategy"],
    "🕐 The Factor Clock · for anyone who wants an honest forecast": ["🕐 因子时钟 · 献给想要诚实预测的人", "🕐 El Reloj de Factores · para quien quiera un pronóstico honesto", "🕐 팩터 클록 · 정직한 예측을 원하는 모든 이에게", "🕐 Đồng hồ Nhân tố · dành cho ai muốn một dự báo trung thực"],
    "◆ founding beta · free access": ["◆ 创始内测 · 免费使用", "◆ beta fundacional · acceso gratuito", "◆ 파운딩 베타 · 무료 이용", "◆ beta sáng lập · truy cập miễn phí"],
    "A prediction clock that never lies to you.": ["一个从不骗您的预测时钟。", "Un reloj de predicción que nunca te miente.", "결코 거짓말하지 않는 예측 시계.", "Một chiếc đồng hồ dự báo không bao giờ nói dối bạn."],
    "Weather, markets, your own patterns, every forecast scored against what actually happened. It tells you when it": [
        "天气、市场、您自己的规律，每一次预测都拿真实结果打分。当它",
        "Clima, mercados, tus propios patrones: cada pronóstico puntuado contra lo que realmente pasó. Te dice cuándo",
        "날씨, 시장, 생활 속 패턴, 모든 예측을 실제 결과와 대조해 채점합니다. 모를 때는",
        "Thời tiết, thị trường, thói quen của bạn, mọi dự báo đều chấm điểm dựa trên điều đã thực sự xảy ra. Nó nói cho bạn biết khi nào nó"],
    "doesn't": ["不知道时", "no", "모른다고", "không"],
    "know, and it's evolving with everyone who uses it.": ["，它会直说；而且它会随着每一位使用者一起进化。", "lo sabe, y evoluciona con todos los que lo usan.", " 말해 주며, 사용하는 모든 사람과 함께 발전합니다.", "biết, và nó tiến hóa cùng mọi người dùng."],
    "Join free beta →": ["加入免费内测 →", "Únete a la beta gratuita →", "무료 베타 참여 →", "Tham gia beta miễn phí →"],
    "What it does": ["它能做什么", "Qué hace", "무엇을 하나요", "Nó làm gì"],
    "A brief that's honest": ["一份诚实的简报", "Un resumen honesto", "정직한 브리핑", "Bản tóm tắt trung thực"],
    "Every morning, one plain-language read of your day, and it clearly labels a guess a guess, and an earned answer earned.": [
        "每天早上，用大白话把您这一天读一遍，猜的就明说是猜的，站得住脚的答案也明说是挣来的。",
        "Cada mañana, una lectura de tu día en lenguaje llano, que marca con claridad lo que es una conjetura y lo que es una respuesta ganada.",
        "매일 아침, 당신의 하루를 쉬운 말로 한 번 읽어 줍니다, 추측은 추측이라고, 근거 있는 답은 근거 있다고 분명히 밝힙니다.",
        "Mỗi sáng, một bản đọc hiểu về ngày của bạn bằng ngôn ngữ dễ hiểu, nói rõ đâu là phỏng đoán và đâu là câu trả lời đã được chứng minh."],
    "A library that's earned it": ["一座凭实绩说话的资料库", "Una biblioteca que se lo ha ganado", "실적으로 증명된 라이브러리", "Một thư viện đã tự chứng minh"],
        "Learns you, privately": ["私密地了解您", "Te aprende, en privado", "사용자를 사적으로 학습합니다", "Học về bạn, một cách riêng tư"],
    "Log your own life, a shift, a drive, a habit, and it finds your patterns. Your data stays on your device. It gets sharper the longer you own it.": [
        "记录您自己的生活，一个班次、一趟车、一个习惯，它就能找出您的规律。数据留在您自己的设备上。您用得越久，它就越准。",
        "Registra tu propia vida, un turno, un trayecto, un hábito, y encuentra tus patrones. Tus datos se quedan en tu dispositivo. Cuanto más tiempo lo tengas, más afinado será.",
        "일상을 기록해 보세요, 근무, 운전, 습관, 그러면 패턴을 찾아냅니다. 데이터는 본인 기기에 남습니다. 오래 쓸수록 더 정확해집니다.",
        "Ghi lại đời sống của bạn, một ca làm, một chuyến lái, một thói quen, và nó tìm ra quy luật của bạn. Dữ liệu ở lại trên thiết bị của bạn. Càng dùng lâu càng sắc bén."],
    "The one thing nobody else ships: honest uncertainty": ["别人都不肯给的那样东西：诚实的不确定性", "Lo único que nadie más entrega: incertidumbre honesta", "다른 곳은 내놓지 않는 단 하나: 정직한 불확실성", "Điều duy nhất không ai khác cung cấp: sự bất định trung thực"],
        "Straight talk, because that's the whole point.": ["有话直说，因为这正是重点所在。", "Hablar claro, porque de eso se trata.", "솔직하게 말합니다. 그게 핵심이니까요.", "Nói thẳng, vì đó chính là điểm mấu chốt."],
    "The Factor Clock is early. Its world library is real and proven; its power to read": [
        "因子时钟还处在早期。它的世界资料库是真实且经过验证的；而它读懂",
        "El Reloj de Factores está en fase inicial. Su biblioteca del mundo es real y está probada; su capacidad de leer",
        "팩터 클록은 아직 초기 단계입니다. 세계 라이브러리는 실재하며 검증되었지만,",
        "Đồng hồ Nhân tố còn ở giai đoạn sớm. Thư viện thế giới của nó là thật và đã được kiểm chứng; khả năng đọc"],
    # The emphasised "your" on the Factor Clock, its power to read YOUR life.
    # 당신의 is the literal rendering and the one a Korean reader hears as
    # translated-from-English; 본인의 carries the same emphasis natively.
    "your": ["您", "tu", "본인의", "của bạn"],
    "life grows as you use it. That's exactly why it's": ["的生活的能力，要靠您使用才会成长。这正是它现在", "vida crece a medida que lo usas. Precisamente por eso es", "삶을 읽는 능력은 쓰실수록 자랍니다. 그래서 지금은", "cuộc sống của bạn lớn lên khi bạn dùng. Chính vì thế nó"],
    "free right now": ["免费的原因", "gratis ahora mismo", "무료입니다", "miễn phí ngay lúc này"],
        "Free while it earns its record": ["在它积累战绩期间免费", "Gratis mientras se gana su historial", "실적을 쌓는 동안 무료", "Miễn phí trong lúc tạo dựng thành tích"],
    "FREE": ["免费", "GRATIS", "무료", "MIỄN PHÍ"],
    "$10 / year": ["10 美元 / 年", "10 $ / año", "연 10달러", "10 $ / năm"],
    "· free while it proves itself": ["· 在它自证期间免费", "· gratis mientras se demuestra", "· 스스로 증명하는 동안 무료", "· miễn phí trong lúc tự chứng minh"],
    "The daily brief + the growing library of proven sources": ["每日简报 + 不断增长的可信来源库", "El resumen diario + la biblioteca creciente de fuentes probadas", "일일 브리핑 + 검증된 출처의 확장되는 라이브러리", "Bản tóm tắt hằng ngày + thư viện nguồn đã kiểm chứng ngày một lớn"],
    "Your own private life-tracking & personal predictions": ["您自己的私密生活记录与个人预测", "Tu seguimiento de vida privado y predicciones personales", "나만의 비공개 생활 기록과 개인 예측", "Theo dõi đời sống riêng tư & dự báo cá nhân của bạn"],
    "Every new domain we prove, added free": ["我们每验证一个新领域，都免费加进来", "Cada nuevo dominio que probamos, añadido gratis", "새로 검증한 모든 영역을 무료로 추가", "Mỗi lĩnh vực mới được chứng minh đều thêm miễn phí"],
    "Full access as each piece ships, no card required": ["每上线一块功能即可全量使用，无需绑卡", "Acceso completo a cada pieza que lanzamos, sin tarjeta", "각 기능이 출시될 때마다 전체 이용, 카드 불필요", "Toàn quyền truy cập mỗi phần khi ra mắt, không cần thẻ"],
    "Founding members lock in, you'll never pay more than $10": ["创始会员锁定价格，您永远不会付超过 10 美元", "Los miembros fundadores fijan el precio: nunca pagarás más de 10 $", "파운딩 멤버는 가격이 고정됩니다, 10달러를 넘게 내는 일은 없습니다", "Thành viên sáng lập được khóa giá, bạn sẽ không bao giờ trả quá 10 $"],
    ", $10/year value, founding members lock it in free.": ["，价值每年 10 美元，创始会员免费锁定。", ", valor de 10 $/año, los miembros fundadores lo fijan gratis.", ", 연 10달러 상당, 파운딩 멤버는 무료로 고정합니다.", ", trị giá 10 $/năm, thành viên sáng lập khóa miễn phí."],
    "Get early access, free →": ["抢先体验，免费 →", "Consigue acceso anticipado, gratis →", "얼리 액세스 받기, 무료 →", "Nhận quyền truy cập sớm, miễn phí →"],
    "Get it free": ["免费获取", "Consíguelo gratis", "무료로 받기", "Nhận miễn phí"],
    "your email": ["您的邮箱", "tu correo", "이메일 주소", "email của bạn"],
    "No payment now · we'll email you when it's ready": ["现在不收费 · 准备好时我们会发邮件通知您", "Sin pago ahora · te escribiremos cuando esté listo", "지금은 결제 없음 · 준비되면 이메일로 알려드립니다", "Chưa thanh toán · chúng tôi sẽ gửi email khi sẵn sàng"],
    "The Factor Clock provides probabilistic forecasts and personal decision-support for informational purposes only. It is": [
        "因子时钟提供的是概率性预测和个人决策辅助，仅供参考。它",
        "El Reloj de Factores ofrece pronósticos probabilísticos y apoyo a decisiones personales solo con fines informativos. No constituye",
        "팩터 클록은 확률적 예측과 개인 의사결정 보조를 정보 제공 목적으로만 제공합니다. 이는",
        "Đồng hồ Nhân tố cung cấp dự báo xác suất và hỗ trợ quyết định cá nhân chỉ nhằm mục đích thông tin. Đây"],
    "not financial, investment, medical, legal, or professional advice": [
        "不构成金融、投资、医疗、法律或任何专业建议",
        "asesoramiento financiero, de inversión, médico, legal ni profesional",
        "재무·투자·의료·법률 또는 전문 자문이 아닙니다",
        "không phải lời khuyên tài chính, đầu tư, y tế, pháp lý hay chuyên môn"],
    })

# The keys below are the FULL sentences as they appear on the page. i18n.js
# matches a line by its exact English, so a shortened key never fires.
EXTRA.update({
    "Plateau Strategy Deflator": ["Plateau Strategy Deflator", "Plateau Strategy Deflator", "Plateau Strategy Deflator", "Plateau Strategy Deflator"],
    "Conviction is how strongly the founder believes in this system, not a return, a win rate, or a projection. The record beneath it is the honest counterweight: until results are published and measured as True Net, it stays at zero.": [
        "信念指的是创始人对这套系统有多信，它不是收益率、胜率或预测。下面那份记录是诚实的对照：在结果公开并以“真实净值”衡量之前，它一直是零。",
        "La convicción es cuánto cree el fundador en este sistema, no una rentabilidad, una tasa de acierto ni una proyección. El registro que aparece debajo es el contrapeso honesto: hasta que se publiquen resultados medidos como Neto Real, se queda en cero.",
        "확신이란 창업자가 이 시스템을 얼마나 믿는지를 뜻합니다, 수익률도, 승률도, 전망도 아닙니다. 그 아래의 기록이 정직한 균형추입니다: 결과가 공개되고 실질 순손익으로 측정되기 전까지는 0으로 유지됩니다.",
        "Niềm tin là mức độ người sáng lập tin vào hệ thống này, không phải lợi nhuận, tỷ lệ thắng hay dự phóng. Hồ sơ bên dưới là đối trọng trung thực: cho tới khi kết quả được công bố và đo bằng Lãi ròng thật, nó vẫn ở mức không."],
    "Buys Chainlink dips only inside a data-defined value zone (90-day market structure), with hard rules a human can't hold at 2am: depth gates, cooldowns, position caps.": [
        "只在由数据划定的价值区间内（90 天市场结构）买入 Chainlink 的回调，并执行人在凌晨两点守不住的硬规则：深度闸门、冷却期、仓位上限。",
        "Compra caídas de Chainlink solo dentro de una zona de valor definida por datos (estructura de mercado de 90 días), con reglas duras que un humano no sostiene a las 2 de la mañana: filtros de profundidad, tiempos de espera y topes de posición.",
        "데이터로 정한 가치 구간(90일 시장 구조) 안에서만 체인링크 하락을 매수하며, 새벽 2시에 사람이 지키기 힘든 엄격한 규칙을 따릅니다: 깊이 게이트, 쿨다운, 포지션 상한.",
        "Chỉ mua các nhịp giảm của Chainlink trong vùng giá trị do dữ liệu xác định (cấu trúc thị trường 90 ngày), với các quy tắc cứng mà con người khó giữ lúc 2 giờ sáng: ngưỡng độ sâu, thời gian chờ, giới hạn vị thế."],
    "The order engine calibrates itself from every single trade outcome, tightening or deepening its bids automatically, and every layer of the system is audited against real exchange fees.": [
        "下单引擎会从每一笔交易的结果自我校准，自动收紧或压低报价，系统的每一层都要按交易所的真实手续费接受核查。",
        "El motor de órdenes se calibra con el resultado de cada operación, ajustando o profundizando sus pujas automáticamente, y cada capa del sistema se audita contra las comisiones reales del exchange.",
        "주문 엔진은 모든 거래 결과로부터 스스로 보정하여 호가를 자동으로 좁히거나 낮추며, 시스템의 모든 계층은 거래소의 실제 수수료 기준으로 감사됩니다.",
        "Bộ máy đặt lệnh tự hiệu chỉnh từ kết quả của từng giao dịch, tự động thắt chặt hoặc hạ sâu giá đặt, và mọi lớp của hệ thống đều được kiểm toán theo phí sàn thực tế."],
    ". No customer funds are accepted or managed. Cryptocurrency is highly volatile and you can lose the entire amount you put at risk. Past performance, once published, will not guarantee future results.": [
        "。我们不接受也不管理客户资金。加密货币波动极大，您投入的资金可能全部亏光。过往业绩即便日后公开，也不保证未来结果。",
        ". No se aceptan ni se gestionan fondos de clientes. Las criptomonedas son muy volátiles y puedes perder todo el importe que arriesgues. El rendimiento pasado, una vez publicado, no garantizará resultados futuros.",
        ". 고객 자금을 받거나 운용하지 않습니다. 암호화폐는 변동성이 매우 크며 투입한 금액 전부를 잃을 수 있습니다. 과거 성과는 공개되더라도 미래 결과를 보장하지 않습니다.",
        ". Không nhận hay quản lý tiền của khách hàng. Tiền mã hóa biến động rất mạnh và bạn có thể mất toàn bộ số tiền đã bỏ ra. Hiệu suất quá khứ, dù được công bố, cũng không bảo đảm kết quả tương lai."],
    "Proven forecasters, two independent weather oracles, a real-money crowd, and more, each trusted only after it beats chance on thousands of real outcomes.": [
        "经过检验的预测源，两个各自独立的天气预言机、一个真金白银的群体，还有更多，每一个都要在成千上万条真实结果上跑赢随机，才会被采信。",
        "Pronosticadores probados, dos oráculos meteorológicos independientes, una multitud con dinero real y más, , cada uno aceptado solo tras superar al azar en miles de resultados reales.",
        "검증된 예측원, 서로 독립적인 두 개의 날씨 오라클, 실제 돈이 걸린 군중, 그리고 그 외, 각각 수천 건의 실제 결과에서 우연을 이긴 뒤에야 신뢰합니다.",
        "Những nguồn dự báo đã được kiểm chứng, hai oracle thời tiết độc lập, một đám đông đặt tiền thật, và hơn nữa, mỗi nguồn chỉ được tin sau khi vượt qua ngẫu nhiên trên hàng nghìn kết quả thực."],
    "Every prediction app fakes confidence. This one refuses to. It says “87%, and here's my track record”, or “I don't know, and here's the proof nobody does.” It even keeps a quantum random number generator on the bench under identical rules: if pure randomness ever scores as skilled, it flags itself as broken. That's a tool you can actually trust.": [
        "每一款预测应用都在假装有把握。这一款不肯。它会说“87%，这是我的历史战绩”，或者“我不知道，而且这是没人能确定的证据”。它甚至让一个量子随机数发生器在同样的规则下一起上场：如果纯粹的随机居然被评为“有本事”，它就把自己标记为出了问题。这才是一个您真能信得过的工具。",
        "Todas las apps de predicción fingen seguridad. Esta se niega. Dice «87 %, y aquí está mi historial», o «no lo sé, y aquí está la prueba de que nadie lo sabe». Incluso mantiene en el banquillo un generador cuántico de números aleatorios con las mismas reglas: si el puro azar llega a puntuar como habilidad, se marca a sí misma como defectuosa. Eso sí es una herramienta en la que puedes confiar.",
        "모든 예측 앱은 자신감을 꾸며냅니다. 이 앱은 그러지 않습니다. “87%, 그리고 이것이 제 실적입니다”라고 말하거나, “모릅니다, 그리고 아무도 모른다는 증거가 여기 있습니다”라고 말합니다. 심지어 동일한 규칙으로 양자 난수 생성기를 함께 돌립니다: 순수한 무작위가 실력 있는 것으로 채점된다면, 스스로 고장 났다고 표시합니다. 그래야 진짜로 믿을 수 있는 도구입니다.",
        "Mọi ứng dụng dự báo đều giả vờ tự tin. Ứng dụng này thì không. Nó nói “87%, và đây là thành tích của tôi”, hoặc “tôi không biết, và đây là bằng chứng không ai biết”. Nó thậm chí đặt một bộ sinh số ngẫu nhiên lượng tử lên băng ghế với cùng luật chơi: nếu sự ngẫu nhiên thuần túy lại được chấm là có kỹ năng, nó tự đánh dấu mình hỏng. Đó mới là công cụ bạn thực sự tin được."],
    ", we'd rather you use it, feed it your own patterns, and watch it earn your trust than pay for a promise. When it's proven it'll be $10 a year; get in now and you lock that in.": [
        "，比起让您为一个承诺付费，我们更希望您先用起来，把自己的规律喂给它，看着它一点点赢得您的信任。等它证明了自己，价格是每年 10 美元；现在加入就能锁定这个价。",
        ", preferimos que lo uses, le des tus propios patrones y veas cómo se gana tu confianza, en lugar de que pagues por una promesa. Cuando esté probado costará 10 $ al año; entra ahora y lo fijas.",
        ", 약속에 돈을 내기보다, 직접 써 보고 생활 속 패턴을 알려주며 신뢰를 얻어가는 모습을 지켜보시길 바랍니다. 검증되면 연 10달러가 되며, 지금 합류하시면 그 가격이 고정됩니다.",
        ", chúng tôi muốn bạn dùng nó, cho nó biết thói quen của bạn, và xem nó dần chiếm được lòng tin, hơn là trả tiền cho một lời hứa. Khi đã chứng minh được, giá sẽ là 10 $/năm; tham gia bây giờ là bạn khóa được mức đó."],
    ", and no outcome is guaranteed, predictions can be wrong. You are responsible for your own decisions. Your personal data stays on your own device. © Plateau Strategy Solution Lab.": [
        "，也不保证任何结果，预测可能出错。您的决定由您自己负责。您的个人数据留在您自己的设备上。© Plateau Strategy Solution Lab。",
        ", y no se garantiza ningún resultado: las predicciones pueden fallar. Tú eres responsable de tus decisiones. Tus datos personales permanecen en tu dispositivo. © Plateau Strategy Solution Lab.",
        ", 어떤 결과도 보장하지 않습니다, 예측은 틀릴 수 있습니다. 결정에 대한 책임은 본인에게 있습니다. 개인 데이터는 본인 기기에 남습니다. © Plateau Strategy Solution Lab.",
        ", và không kết quả nào được bảo đảm, dự báo có thể sai. Bạn tự chịu trách nhiệm cho quyết định của mình. Dữ liệu cá nhân của bạn ở lại trên thiết bị của bạn. © Plateau Strategy Solution Lab."],
})

# ---------------- text JavaScript writes at runtime ----------------
# A static reader of the HTML never sees these, so the coverage audit cannot
# catch them, but the translator's MutationObserver does translate them once
# the key exists. Only complete, fixed sentences are listed: a message assembled
# from fragments at runtime can never equal a fixed key, so those stay English.
EXTRA.update({
    "Culture": ["文化", "Cultura", "문화", "Văn hóa"],
    "Nature": ["自然", "Naturaleza", "자연", "Thiên nhiên"],
    "Views": ["观景", "Miradores", "전망", "Ngắm cảnh"],
    "Back": ["返回", "Atrás", "뒤로", "Quay lại"],
    "Book": ["预订", "Reservar", "예약", "Đặt chỗ"],
    "Agents": ["代理人", "Agentes", "에이전트", "Đại lý"],
    "Drivers": ["司机", "Conductores", "기사", "Tài xế"],
    "Address lookup unavailable right now, drag the black pin instead.": ["地址查询暂时不可用，请改为拖动黑色标记。", "La búsqueda de direcciones no está disponible ahora: arrastra el marcador negro.", "지금은 주소 검색을 할 수 없습니다, 대신 검은 핀을 끌어 옮기세요.", "Hiện không tra cứu được địa chỉ, hãy kéo ghim đen thay thế."],
    "Build a route first, then offer it for sale.": ["请先排好一条路线，再挂出来出售。", "Crea primero una ruta y luego ponla a la venta.", "먼저 경로를 만든 다음 판매로 올리세요.", "Hãy tạo lộ trình trước, rồi mới rao bán."],
    "Could not record that just now, please try again in a moment.": ["刚才没能记录下来，请稍后再试。", "No se pudo registrar ahora mismo: inténtalo de nuevo en un momento.", "방금은 기록하지 못했습니다, 잠시 후 다시 시도해 주세요.", "Chưa ghi nhận được lúc này, vui lòng thử lại sau giây lát."],
    "Enter a location first, type where you want to go, then choose.": ["请先输入地点，打上您想去的地方，再做选择。", "Primero introduce un lugar: escribe adónde quieres ir y luego elige.", "먼저 장소를 입력하세요, 가고 싶은 곳을 입력한 뒤 선택하세요.", "Hãy nhập địa điểm trước, gõ nơi bạn muốn đến rồi chọn."],
    "Enter a location first, then choose.": ["请先输入地点，再做选择。", "Introduce primero un lugar y luego elige.", "먼저 장소를 입력한 뒤 선택하세요.", "Hãy nhập địa điểm trước, rồi chọn."],
    "Finding your current location…": ["正在获取您的当前位置…", "Buscando tu ubicación actual…", "현재 위치를 찾는 중…", "Đang tìm vị trí hiện tại của bạn…"],
    "Getting your exact location…": ["正在获取您的精确位置…", "Obteniendo tu ubicación exacta…", "정확한 위치를 가져오는 중…", "Đang lấy vị trí chính xác của bạn…"],
    "Getting your exact pickup location…": ["正在获取您的精确上车地点…", "Obteniendo tu punto exacto de recogida…", "정확한 픽업 위치를 가져오는 중…", "Đang lấy điểm đón chính xác của bạn…"],
    "Itinerary copied, paste it anywhere.": ["行程已复制，可以粘贴到任何地方。", "Itinerario copiado: pégalo donde quieras.", "일정을 복사했습니다, 어디든 붙여넣으세요.", "Đã sao chép lịch trình, dán vào bất cứ đâu."],
    "Nothing to copy yet, add a stop first.": ["还没有可复制的内容，请先加一站。", "Aún no hay nada que copiar: añade primero una parada.", "복사할 내용이 없습니다, 먼저 방문지를 추가하세요.", "Chưa có gì để sao chép, hãy thêm một điểm dừng trước."],
    "Nothing to print yet, add a stop first.": ["还没有可打印的内容，请先加一站。", "Aún no hay nada que imprimir: añade primero una parada.", "인쇄할 내용이 없습니다, 먼저 방문지를 추가하세요.", "Chưa có gì để in, hãy thêm một điểm dừng trước."],
    "Nothing to share yet, add a stop first.": ["还没有可分享的内容，请先加一站。", "Aún no hay nada que compartir: añade primero una parada.", "공유할 내용이 없습니다, 먼저 방문지를 추가하세요.", "Chưa có gì để chia sẻ, hãy thêm một điểm dừng trước."],
    "Nothing to undo.": ["没有可撤销的操作。", "No hay nada que deshacer.", "되돌릴 작업이 없습니다.", "Không có gì để hoàn tác."],
    "Preparing your ride…": ["正在为您准备用车…", "Preparando tu viaje…", "차량을 준비하는 중…", "Đang chuẩn bị chuyến xe của bạn…"],
    "Remove it from the trip first (Undo).": ["请先把它从行程中移除（撤销）。", "Quítalo primero del viaje (Deshacer).", "먼저 일정에서 제거하세요 (되돌리기).", "Hãy xóa khỏi chuyến đi trước (Hoàn tác)."],
    "Search unavailable right now, try again.": ["搜索暂时不可用，请重试。", "La búsqueda no está disponible ahora: inténtalo de nuevo.", "지금은 검색할 수 없습니다, 다시 시도해 주세요.", "Hiện không tìm kiếm được, hãy thử lại."],
    "Start moved to where you are, the far-distance options are below the map.": ["起点已移到您所在的位置，远距离的选项在地图下方。", "El punto de partida se ha movido a donde estás; las opciones de larga distancia están debajo del mapa.", "출발 지점을 현재 위치로 옮겼습니다, 장거리 옵션은 지도 아래에 있습니다.", "Điểm xuất phát đã chuyển tới nơi bạn đang ở, các lựa chọn đường dài nằm dưới bản đồ."],
    "This browser can’t share location, drag the black pin or type your pickup on the booking form.": [
        "此浏览器无法共享位置，请拖动黑色标记，或在预订表单里填写上车地点。",
        "Este navegador no puede compartir la ubicación: arrastra el marcador negro o escribe tu punto de recogida en el formulario de reserva.",
        "이 브라우저는 위치를 공유할 수 없습니다, 검은 핀을 끌거나 예약 양식에 픽업 위치를 입력하세요.",
        "Trình duyệt này không chia sẻ được vị trí, hãy kéo ghim đen hoặc nhập điểm đón vào biểu mẫu đặt chỗ."],
    "could not reach the attraction lists just now": ["暂时连不上景点资料库", "no se pudo acceder a las listas de atracciones ahora mismo", "지금은 명소 목록에 연결할 수 없습니다", "hiện chưa kết nối được tới danh sách điểm tham quan"],
    "finding the places people travel here to see…": ["正在寻找人们专程来看的地方…", "buscando los lugares por los que la gente viaja hasta aquí…", "사람들이 이곳까지 찾아와 보는 장소를 찾는 중…", "đang tìm những nơi người ta lặn lội tới đây để xem…"],
})

EXTRA.update({
    "3 hours": ["3 小时", "3 horas", "3시간", "3 giờ"],
    "12 hours": ["12 小时", "12 horas", "12시간", "12 giờ"],
    "A full 24 hours": ["整整 24 小时", "24 horas completas", "꼬박 24시간", "Trọn 24 giờ"],
    "Two days": ["两天", "Dos días", "이틀", "Hai ngày"],
    "Three days or more": ["三天或更久", "Tres días o más", "사흘 이상", "Ba ngày trở lên"],
})

EXTRA.update({
    "Serving Seattle & Seattle, Tacoma International (SEA)": [
        "服务西雅图及西雅图-塔科马国际机场（SEA）",
        "Damos servicio a Seattle y al aeropuerto Seattle, Tacoma (SEA)",
        "시애틀 및 시애틀, 타코마 국제공항(SEA) 운행",
        "Phục vụ Seattle & sân bay quốc tế Seattle, Tacoma (SEA)"],
    "Rides available 24/7, by reservation": ["全天 24 小时可预约用车", "Viajes disponibles 24/7, con reserva", "예약제로 24시간 이용 가능", "Có xe 24/7, theo đặt trước"],
    "Book a ride, $75 flat to SeaTac": ["预约用车，到西雅图机场统一 75 美元", "Reserva un viaje, 75 $ fijos a SeaTac", "차량 예약, 시택 공항까지 정액 75달러", "Đặt xe, 75 $ trọn gói tới SeaTac"],
    "Service-area business, we come to you, there's no counter to visit.": [
        "我们是上门服务的商家，我们到您那里去，没有门店柜台可供到访。",
        "Negocio con zona de servicio: vamos a donde estés, no hay mostrador que visitar.",
        "출장 서비스 업체입니다, 저희가 찾아가며, 방문할 카운터는 없습니다.",
        "Doanh nghiệp phục vụ tận nơi, chúng tôi đến chỗ bạn, không có quầy để ghé."],
})

# ---------------- the front page, rewritten as ink-on-paper ----------------
EXTRA.update({
    "Plateau Strategy Solution Lab · Seattle": ["Plateau Strategy Solution Lab · 西雅图", "Plateau Strategy Solution Lab · Seattle", "Plateau Strategy Solution Lab · 시애틀", "Plateau Strategy Solution Lab · Seattle"],
    "We build one business at a time": ["我们一次只做一门生意", "Construimos un negocio a la vez", "한 번에 하나의 사업을 세웁니다", "Chúng tôi xây từng doanh nghiệp một"],
    "Transportation is the one that runs today: flat-rate Tesla rides across Seattle, cars rented to drivers who earn with them, and trip-planning tools anyone can use free. It pays for what comes next. Every other arm is listed below with the stage it is honestly at, including the ones not finished.": [
        "今天真正在运转的是出行：西雅图全城的特斯拉一口价接送、租给司机让他们靠车挣钱，以及任何人都能免费使用的行程规划工具。它养着接下来要做的事。下面列出的每一块业务都如实标明所处阶段，包括那些还没做完的。",
        "El transporte es el que funciona hoy: viajes en Tesla a tarifa fija por Seattle, coches alquilados a conductores que ganan con ellos, y herramientas de planificación de viajes que cualquiera puede usar gratis. Paga lo que viene después. Cada una de las demás ramas aparece abajo con la etapa en la que honestamente está, incluidas las que no están terminadas.",
        "오늘 실제로 돌아가는 것은 교통입니다: 시애틀 전역의 정액 테슬라 운행, 그것으로 수입을 올리는 기사들에게 빌려주는 차량, 그리고 누구나 무료로 쓰는 여행 계획 도구. 이것이 다음에 올 것들을 먹여 살립니다. 나머지 각 부문은 아래에 지금 있는 단계 그대로, 아직 끝나지 않은 것까지 포함해, 적어 두었습니다.",
        "Vận tải là mảng đang thực sự chạy hôm nay: những chuyến Tesla giá trọn gói khắp Seattle, xe cho tài xế thuê để họ kiếm sống, và các công cụ lập kế hoạch chuyến đi ai cũng dùng miễn phí. Nó nuôi những gì đến sau. Mọi nhánh khác đều được liệt kê bên dưới kèm đúng giai đoạn thật của nó, kể cả những nhánh chưa xong."],
    "Book a ride": ["预约用车", "Reservar un viaje", "차량 예약", "Đặt xe"],
    "Partner with us": ["与我们合作", "Colabora con nosotros", "함께 협력하기", "Hợp tác với chúng tôi"],
    "Flat fare to Sea, Tac": ["到西雅图机场一口价", "Tarifa fija a Sea, Tac", "시택 공항까지 정액 요금", "Giá trọn gói tới Sea, Tac"],
    "Book any hour": ["任何时段都能预约", "Reserva a cualquier hora", "언제든 예약 가능", "Đặt bất kỳ giờ nào"],
    "Every vehicle": ["每一辆车", "Todos los vehículos", "모든 차량", "Mọi xe"],
    "THE COMPANY": ["公司", "LA EMPRESA", "회사", "CÔNG TY"],
    "Flat-rate Tesla service across Seattle, a vehicle rental programme for drivers, and trip-planning tools that are free to anyone, with no account and nothing to install.": [
        "覆盖西雅图全城的特斯拉固定价格接送服务、面向司机的车辆租赁计划，以及任何人都能免费使用的行程规划工具，无需注册账号，无需安装任何软件。",
        "Servicio Tesla con tarifa fija en todo Seattle, un programa de alquiler de vehículos para conductores y herramientas de planificación de viajes gratuitas para cualquiera, sin cuenta y sin nada que instalar.",
        "시애틀 전역의 테슬라 정액 운송 서비스, 기사를 위한 차량 렌탈 프로그램, 그리고 누구나 무료로 쓸 수 있는 여행 계획 도구입니다. 계정도 설치도 필요 없습니다.",
        "Dịch vụ Tesla giá cố định trên khắp Seattle, chương trình cho tài xế thuê xe, và các công cụ lập kế hoạch chuyến đi miễn phí cho tất cả mọi người, không cần tài khoản và không phải cài đặt gì.",
    ],
    "Four arms, at four different stages": ["四块业务，四个不同阶段", "Cuatro ramas, en cuatro etapas distintas", "네 개의 부문, 네 개의 서로 다른 단계", "Bốn nhánh, ở bốn giai đoạn khác nhau"],
    "One business pays for the next. That only means something if we say plainly which ones are earning today and which are still being built, so we do.": [
        "一门生意养下一门。但这句话只有在我们如实说出哪些今天在赚钱、哪些还在搭建时才有意义，所以我们照实说。",
        "Un negocio paga el siguiente. Eso solo significa algo si decimos con claridad cuáles ganan hoy y cuáles se están construyendo todavía, así que lo decimos.",
        "하나의 사업이 다음 사업을 먹여 살립니다. 그 말은 어느 것이 오늘 벌고 있고 어느 것이 아직 만들어지는 중인지 분명히 말할 때에만 의미가 있습니다, 그래서 그렇게 합니다.",
        "Doanh nghiệp này nuôi doanh nghiệp kia. Điều đó chỉ có ý nghĩa nếu chúng tôi nói rõ mảng nào đang kiếm được tiền hôm nay và mảng nào còn đang xây, nên chúng tôi nói thẳng."],
    "Operating": ["运营中", "En operación", "운영 중", "Đang vận hành"],
    "Flat-rate Tesla rides in Seattle at $75 to Sea, Tac, cars rented to drivers who keep the fare, and a commission programme for hotels and agents. This is the business that earns.": [
        "西雅图的特斯拉一口价接送，到机场 75 美元；把车租给司机，车费归他们；另有面向酒店和代理人的佣金计划。这是真正在赚钱的那门生意。",
        "Viajes en Tesla a tarifa fija en Seattle, 75 $ a Sea, Tac, coches alquilados a conductores que se quedan la tarifa, y un programa de comisiones para hoteles y agentes. Este es el negocio que gana dinero.",
        "시애틀에서 시택 공항까지 75달러 정액 테슬라 운행, 요금을 그대로 가져가는 기사에게 빌려주는 차량, 그리고 호텔·에이전트를 위한 수수료 프로그램. 실제로 돈을 버는 사업입니다.",
        "Những chuyến Tesla giá trọn gói ở Seattle, 75 $ tới Sea, Tac, xe cho tài xế thuê và họ giữ trọn tiền cước, cùng chương trình hoa hồng cho khách sạn và đại lý. Đây là mảng đang thực sự kiếm ra tiền."],
    "See how it works →": ["看它如何运作 →", "Ver cómo funciona →", "작동 방식 보기 →", "Xem cách hoạt động →"],
    "Running": ["已上线", "En marcha", "가동 중", "Đang chạy"],
    "Operations platform": ["运营平台", "Plataforma de operaciones", "운영 플랫폼", "Nền tảng vận hành"],
    "Dispatch, invoicing, driver paperwork and the trip-planning tools, built in-house rather than rented, so the customer relationship and the data stay with us.": [
        "调度、开票、司机文件和行程规划工具，都是自己做的，不是租来的，所以客户关系和数据都留在我们手里。",
        "Central, facturación, papeleo de conductores y las herramientas de planificación, construidos en casa en vez de alquilados, de modo que la relación con el cliente y los datos se quedan con nosotros.",
        "배차, 청구, 기사 서류, 여행 계획 도구, 빌려 쓰지 않고 직접 만들었기에 고객 관계와 데이터가 저희에게 남습니다.",
        "Điều phối, xuất hóa đơn, giấy tờ tài xế và các công cụ lập kế hoạch, tự làm chứ không đi thuê, nên quan hệ khách hàng và dữ liệu ở lại với chúng tôi."],
    "See the platform →": ["查看平台 →", "Ver la plataforma →", "플랫폼 보기 →", "Xem nền tảng →"],
    "In development": ["开发中", "En desarrollo", "개발 중", "Đang phát triển"],
    "Real estate": ["房地产", "Bienes raíces", "부동산", "Bất động sản"],
    "Mixed-use development, at drawing stage. Nothing built, nothing leased, nothing offered, the plans are published as they stand.": [
        "综合开发项目，目前处于图纸阶段。没有建成，没有出租，也没有对外发售，图纸就按现状公开。",
        "Desarrollo de uso mixto, en fase de planos. Nada construido, nada arrendado, nada ofrecido: los planos se publican tal como están.",
        "복합 용도 개발, 아직 도면 단계입니다. 지은 것도, 임대한 것도, 내놓은 것도 없습니다, 계획은 있는 그대로 공개합니다.",
        "Dự án phức hợp, đang ở giai đoạn bản vẽ. Chưa xây, chưa cho thuê, chưa chào bán, bản vẽ được công bố đúng như hiện trạng."],
    "See the drawings →": ["查看图纸 →", "Ver los planos →", "도면 보기 →", "Xem bản vẽ →"],
    "Research": ["研究", "Investigación", "연구", "Nghiên cứu"],
    "An automated trading research project in private verification, building an audited record. Nothing is for sale and no money is accepted, you can follow the results.": [
        "一个处于私下验证阶段的自动化交易研究项目，正在积累可审计的记录。不出售任何东西，也不接受任何资金，您可以关注结果。",
        "Un proyecto de investigación de trading automatizado en verificación privada, construyendo un historial auditado. No se vende nada y no se acepta dinero: puedes seguir los resultados.",
        "비공개 검증 단계에 있는 자동 매매 연구 프로젝트로, 감사 가능한 기록을 쌓고 있습니다. 판매하는 것도, 받는 돈도 없습니다, 결과를 지켜보실 수 있습니다.",
        "Một dự án nghiên cứu giao dịch tự động đang trong giai đoạn xác minh riêng tư, xây dựng hồ sơ có thể kiểm toán. Không bán gì và không nhận tiền, bạn có thể theo dõi kết quả."],
    "More financial products coming soon.": ["更多金融产品即将推出。", "Próximamente más productos financieros.", "더 많은 금융 상품이 곧 나옵니다.", "Sắp có thêm các sản phẩm tài chính."],
    "A Seattle car service: flat-rate Tesla rides to Sea, Tac and around the city, plus trip-planning tools that are free to use.": [
        "西雅图的一家用车服务：到机场及市内各处的特斯拉一口价接送，外加可免费使用的行程规划工具。",
        "Un servicio de coches en Seattle: viajes en Tesla a tarifa fija a Sea, Tac y por la ciudad, más herramientas de planificación gratuitas.",
        "시애틀의 차량 서비스입니다: 시택 공항과 시내를 오가는 정액 테슬라 운행, 그리고 무료로 쓰는 여행 계획 도구.",
        "Một dịch vụ xe tại Seattle: những chuyến Tesla giá trọn gói tới Sea, Tac và quanh thành phố, cùng các công cụ lập kế hoạch miễn phí."],
    "Flat-rate Tesla rides, Seattle and Sea, Tac.": ["特斯拉一口价接送，西雅图市内及机场。", "Viajes en Tesla a tarifa fija, Seattle y Sea, Tac.", "정액 테슬라 운행, 시애틀과 시택 공항.", "Chuyến Tesla giá trọn gói, Seattle và Sea, Tac."],
    "Optional, fills your name and email. You can just type them instead.": [
        "可选，会自动填入您的姓名和邮箱。您也可以直接手动输入。",
        "Opcional: rellena tu nombre y correo. También puedes escribirlos tú.",
        "선택 사항, 이름과 이메일이 자동으로 채워집니다. 직접 입력하셔도 됩니다.",
        "Tùy chọn, tự điền tên và email của bạn. Bạn cũng có thể tự gõ."],
    "or enter your details": ["或手动填写您的信息", "o introduce tus datos", "또는 직접 정보 입력", "hoặc tự nhập thông tin của bạn"],
    "Seattle, Tacoma International Airport (SEA)": ["西雅图-塔科马国际机场（SEA）", "Aeropuerto Internacional Seattle, Tacoma (SEA)", "시애틀, 타코마 국제공항(SEA)", "Sân bay quốc tế Seattle, Tacoma (SEA)"],
})
EXTRA_SKIP |= {"1200 Pine St, Seattle", "e.g. AS 1234 (optional)"}


# ---------------------------------------------------------------------------
# Coverage pass: strings a visitor navigates by that were still English.
# Found by rendering every page, collecting visible text, and subtracting what
# the dictionary already held, 73% covered, so roughly one line in four came
# back in English mid-sentence. That is what makes a translated page feel
# broken: not bad wording, but wording that stops.
#
# Place names are deliberately NOT here. "Katz's Delicatessen" and "Pike Place
# Market" are what the signs outside say, and a traveller looking for them
# needs the name on the sign.
# ---------------------------------------------------------------------------
EXTRA.update({
    # --- trip planner / destination book chrome ---
    "+ Add to Trip Planner": ["+ 加入行程规划", "+ Añadir al planificador", "+ 여행 플래너에 추가", "+ Thêm vào lịch trình"],
    "✓ In your planner": ["✓ 已在您的行程中", "✓ En tu planificador", "✓ 플래너에 있음", "✓ Đã có trong lịch trình"],
    "All cities": ["所有城市", "Todas las ciudades", "모든 도시", "Tất cả thành phố"],
    "All types": ["所有类型", "Todos los tipos", "모든 유형", "Tất cả loại"],
    "Any rating ⟳": ["不限评分 ⟳", "Cualquier valoración ⟳", "모든 평점 ⟳", "Mọi đánh giá ⟳"],
    "Attraction": ["景点", "Atracción", "명소", "Điểm tham quan"],
    "Attractions": ["景点", "Atracciones", "명소", "Điểm tham quan"],
    "Restaurant": ["餐厅", "Restaurante", "식당", "Nhà hàng"],
    "Restaurants & food": ["餐饮美食", "Restaurantes y comida", "식당 및 음식", "Nhà hàng & ẩm thực"],
    "tap to rate": ["点击评分", "toca para valorar", "탭하여 평가", "chạm để đánh giá"],
    "💬 Add the first note": ["💬 写下第一条留言", "💬 Escribe la primera nota", "💬 첫 메모 남기기", "💬 Viết ghi chú đầu tiên"],
    "⏱ Been here? Tell us how long you stayed →": [
        "⏱ 来过这里？告诉我们您待了多久 →",
        "⏱ ¿Has estado aquí? Cuéntanos cuánto tiempo te quedaste →",
        "⏱ 가보셨나요? 얼마나 머무셨는지 알려주세요 →",
        "⏱ Bạn từng đến đây? Cho chúng tôi biết bạn ở lại bao lâu →"],
    "46 of 46 destinations": ["46 个目的地，共 46 个", "46 de 46 destinos", "목적지 46개 중 46개", "46 trên 46 điểm đến"],

    # --- durations offered when logging a visit ---
    "4 hours": ["4 小时", "4 horas", "4시간", "4 giờ"],
    "8 hours": ["8 小时", "8 horas", "8시간", "8 giờ"],
    "1 day": ["1 天", "1 día", "1일", "1 ngày"],
    "2 days": ["2 天", "2 días", "2일", "2 ngày"],

    # --- fares, as the booking form lists them ---
    "Airport Pickup (flat), $75": ["机场接送（一口价）, $75", "Recogida en aeropuerto (fija), $75", "공항 픽업(정액), $75", "Đón sân bay (giá cố định), 75 $"],
    "Downtown Transfer, $45": ["市区接送, $45", "Traslado al centro, $45", "다운타운 이동, $45", "Đưa đón trung tâm, 45 $"],
    "Hourly (per hour), $65": ["按小时计（每小时）, $65", "Por hora, $65", "시간제(시간당), $65", "Theo giờ, 65 $"],

    # --- reinvestment / proposals ---
    "Back it by running it": ["以运营方式支持", "Apóyalo operándolo", "직접 운영하며 지원", "Ủng hộ bằng cách vận hành"],
    "Back it with capital": ["以资金方式支持", "Apóyalo con capital", "자본으로 지원", "Ủng hộ bằng vốn"],
    "Follow this proposal:": ["关注这个提案：", "Sigue esta propuesta:", "이 제안 팔로우:", "Theo dõi đề xuất này:"],
    "💰 I want to invest": ["💰 我想投资", "💰 Quiero invertir", "💰 투자하고 싶습니다", "💰 Tôi muốn đầu tư"],
    "🚀 I want to launch this": ["🚀 我想把它做起来", "🚀 Quiero lanzarlo", "🚀 제가 실행하고 싶습니다", "🚀 Tôi muốn triển khai"],
    "0 investor(s) interested": ["0 位投资人关注", "0 inversor(es) interesados", "관심 투자자 0명", "0 nhà đầu tư quan tâm"],
    "0 operator(s) interested": ["0 位运营者关注", "0 operador(es) interesados", "관심 운영자 0명", "0 nhà vận hành quan tâm"],
    "· 0 following": ["· 0 人关注", "· 0 siguiendo", "· 팔로워 0", "· 0 người theo dõi"],

    # --- treasury give-back ---
    "Nobody has reported a gift yet, the zero is honest.": [
        "目前还没有人报告捐赠，这个零是真实的。",
        "Nadie ha reportado una donación todavía; el cero es honesto.",
        "아직 기부를 알려온 분이 없습니다, 이 0은 정직한 숫자입니다.",
        "Chưa có ai báo về khoản đóng góp nào, số 0 này là thật."],
    "🇺🇸 Give at the U.S. Treasury (Pay.gov) →": [
        "🇺🇸 通过美国财政部捐赠（Pay.gov）→",
        "🇺🇸 Donar en el Tesoro de EE. UU. (Pay.gov) →",
        "🇺🇸 미국 재무부에 기부하기 (Pay.gov) →",
        "🇺🇸 Đóng góp tại Kho bạc Hoa Kỳ (Pay.gov) →"],

    # --- real-estate blueprint sheet ---
    "PROJECT · PLATEAU STRATEGY": ["项目 · PLATEAU STRATEGY", "PROYECTO · PLATEAU STRATEGY", "프로젝트 · PLATEAU STRATEGY", "DỰ ÁN · PLATEAU STRATEGY"],
    "Mixed-use development · Sheet RE-01": ["综合开发项目 · 图纸 RE-01", "Desarrollo de uso mixto · Plano RE-01", "복합 개발 · 도면 RE-01", "Phát triển đa chức năng · Bản vẽ RE-01"],
    "FIG 1, MIXED-USE HUB · FRONT ELEVATION (NTS)": [
        "图 1, 综合体 · 正立面（无比例）",
        "FIG 1, CENTRO DE USO MIXTO · ALZADO FRONTAL (SIN ESCALA)",
        "그림 1, 복합 허브 · 정면도 (축척 없음)",
        "HÌNH 1, TỔ HỢP ĐA CHỨC NĂNG · MẶT ĐỨNG (KHÔNG TỶ LỆ)"],
    "SCALE · NTS": ["比例 · 无比例", "ESCALA · SIN ESCALA", "축척 · 없음", "TỶ LỆ · KHÔNG"],
    "SHEET · RE-01": ["图纸 · RE-01", "PLANO · RE-01", "도면 · RE-01", "BẢN VẼ · RE-01"],
    "REV · A": ["版本 · A", "REV · A", "개정 · A", "PHIÊN BẢN · A"],

    # --- cities: these are translated, unlike venue names ---
    "New York": ["纽约", "Nueva York", "뉴욕", "New York"],
    "Boston": ["波士顿", "Boston", "보스턴", "Boston"],
    "Seattle": ["西雅图", "Seattle", "시애틀", "Seattle"],
    "Washington DC": ["华盛顿特区", "Washington D. C.", "워싱턴 D.C.", "Washington D.C."],
})

# Venue names stay in English: a traveller looking for the place needs the name
# that is written on the door.
EXTRA_SKIP |= {
    "9/11 Memorial & Museum", "Air & Space Museum", "Arlington National Cemetery",
    "Ben's Chili Bowl", "Boston Common & Public Garden", "Brooklyn Bridge",
    "Central Park", "Chelsea Market", "Chihuly Garden and Glass",
    "Empire State Building", "Faneuil Hall Marketplace", "Fenway Park",
    "Founding Farmers", "Freedom Trail (start)", "Gas Works Park",
    "Georgetown Waterfront", "Grand Central Oyster Bar", "Grand Central Terminal",
    "Harvard Yard, Cambridge", "Jefferson Memorial", "Joe's Pizza",
    "Katz's Delicatessen", "Kerry Park viewpoint", "Levain Bakery",
    "Lincoln Memorial", "Museum of American History", "Museum of Fine Arts",
    "Museum of Pop Culture", "National Gallery of Art", "New England Aquarium",
    "Old Ebbitt Grill", "Pike Place Market", "Seattle Aquarium", "Space Needle",
    "Starbucks Reserve Roastery", "Statue of Liberty ferry", "Stone Street",
    "The High Line", "The Met Museum", "The Wharf", "Times Square",
    "US Capitol Visitor Center", "USS Constitution", "Union Market",
    "Washington Monument", "White House (Lafayette Sq)", "Tesla", "Sean Zhu",
    "English", "Español", "Tiếng Việt",
}


# ---------------------------------------------------------------------------
# REGISTER PASS, corrections, not new strings.
#
# The first translations were fluent but wrong in tone. The English here is
# deliberately plain, and plain English was rendered as colloquial Chinese, 
# 一门生意 (market-stall talk for a line of trade), 一口价 (haggling vocabulary),
# 靠车挣钱 ("make money off the car"), 它养着 (feeds, as one feeds an animal),
# 四块业务 (a colloquial measure word). In Chinese business writing that register
# reads as unserious, which is precisely the opposite of what the English was
# rewritten to achieve.
#
# Plain and colloquial are not the same thing. Chinese reaches "plain and
# honest" by being concise and measured, not by being chatty. These are rewritten
# as a company would write about itself: 业务 not 生意, 固定价格 not 一口价,
# 为…提供资金 not 养着.
# ---------------------------------------------------------------------------
EXTRA.update({
    "We build one business at a time": [
        "我们一次只做一项业务",
        "Construimos un negocio a la vez",
        "한 번에 하나의 사업만 만듭니다",
        "Chúng tôi xây dựng từng mảng kinh doanh một"],

    "Transportation is the one that runs today: flat-rate Tesla rides across Seattle, cars rented to drivers who earn with them, and trip-planning tools anyone can use free. It pays for what comes next. Every other arm is listed below with the stage it is honestly at, including the ones not finished.": [
        "目前真正在运营的是出行业务：覆盖西雅图全城的特斯拉固定价格接送、面向司机的车辆租赁，以及所有人都可免费使用的行程规划工具。它为后续业务提供资金。下方列出的每一项业务都如实标注了所处阶段，包括尚未完成的部分。",
        "El transporte es lo que está en marcha hoy: traslados en Tesla con tarifa fija por todo Seattle, vehículos alquilados a conductores que ganan con ellos y herramientas de planificación de viajes que cualquiera puede usar gratis. Financia lo que viene después. Cada una de las demás áreas aparece abajo con la etapa en la que realmente está, incluidas las que no están terminadas.",
        "지금 실제로 운영 중인 것은 교통 사업입니다. 시애틀 전역의 정액 요금 테슬라 이동, 기사에게 대여하는 차량, 그리고 누구나 무료로 쓸 수 있는 여행 계획 도구입니다. 이 사업이 다음 단계의 자금을 댑니다. 나머지 사업은 아래에 각자 실제로 놓인 단계와 함께 정리해 두었습니다, 아직 끝나지 않은 것들까지 포함해서.",
        "Mảng thực sự đang vận hành hôm nay là vận tải: các chuyến Tesla giá cố định khắp Seattle, xe cho tài xế thuê để kiếm thu nhập, và công cụ lập kế hoạch chuyến đi ai cũng dùng được miễn phí. Nó cấp vốn cho những gì đến sau. Mỗi mảng còn lại được liệt kê bên dưới kèm giai đoạn thực tế của nó, kể cả những mảng chưa hoàn thành."],

    "Flat-rate Tesla service across Seattle, a vehicle rental programme for drivers, and trip-planning tools that are free to anyone, with no account and nothing to install.": [
        "覆盖西雅图全城的特斯拉固定价格接送服务、面向司机的车辆租赁计划，以及任何人都能免费使用的行程规划工具，无需注册账号，无需安装任何软件。",
        "Servicio Tesla con tarifa fija en todo Seattle, un programa de alquiler de vehículos para conductores y herramientas de planificación de viajes gratuitas para cualquiera, sin cuenta y sin nada que instalar.",
        "시애틀 전역의 테슬라 정액 운송 서비스, 기사를 위한 차량 렌탈 프로그램, 그리고 누구나 무료로 쓸 수 있는 여행 계획 도구입니다. 계정도 설치도 필요 없습니다.",
        "Dịch vụ Tesla giá cố định trên khắp Seattle, chương trình cho tài xế thuê xe, và các công cụ lập kế hoạch chuyến đi miễn phí cho tất cả mọi người, không cần tài khoản và không phải cài đặt gì.",
    ],
    "Four arms, at four different stages": [
        "四项业务，四个不同阶段",
        "Cuatro áreas, en cuatro etapas distintas",
        "네 개의 사업, 각기 다른 네 단계",
        "Bốn mảng, ở bốn giai đoạn khác nhau"],

    "One business pays for the next. That only means something if we say plainly which ones are earning today and which are still being built, so we do.": [
        "一项业务为下一项提供资金。但这句话只有在我们如实说明哪些业务今天已在盈利、哪些仍在建设，才有意义，所以我们如实说明。",
        "Un negocio financia al siguiente. Eso solo significa algo si decimos con claridad cuáles generan ingresos hoy y cuáles siguen en construcción, así que lo decimos.",
        "하나의 사업이 다음 사업의 자금을 댑니다. 그 말은 오늘 수익을 내는 사업과 아직 만드는 중인 사업을 분명히 밝혀야만 의미가 있습니다, 그래서 밝힙니다.",
        "Mảng này cấp vốn cho mảng kế tiếp. Điều đó chỉ có ý nghĩa nếu chúng tôi nói rõ mảng nào đang tạo doanh thu hôm nay và mảng nào vẫn đang xây dựng, nên chúng tôi nói rõ."],

    "Flat-rate Tesla rides in Seattle at $75 to Sea, Tac, cars rented to drivers who keep the fare, and a commission programme for hotels and agents. This is the business that earns.": [
        "西雅图的特斯拉固定价格接送，至机场 75 美元；车辆租赁给司机，车费归司机所有；并设有面向酒店与代理商的佣金计划。这是目前真正产生收入的业务。",
        "Traslados en Tesla con tarifa fija en Seattle, 75 $ al aeropuerto; vehículos alquilados a conductores que se quedan con la tarifa; y un programa de comisiones para hoteles y agentes. Este es el negocio que genera ingresos.",
        "시애틀에서 공항까지 75달러 정액 요금의 테슬라 이동, 요금을 기사가 갖는 차량 대여, 그리고 호텔·에이전트를 위한 수수료 프로그램. 실제로 수익을 내는 사업입니다.",
        "Các chuyến Tesla giá cố định tại Seattle, 75 $ tới sân bay; xe cho tài xế thuê và tài xế giữ toàn bộ cước; cùng chương trình hoa hồng cho khách sạn và đại lý. Đây là mảng thực sự tạo doanh thu."],

    # --- status labels: 已上线 was software-launch jargon and did not match
    #     the others; 研究 alone is a noun, not a stage.
    "Running":  ["运行中", "En marcha", "가동 중", "Đang chạy"],
    "Research": ["研究阶段", "En investigación", "연구 단계", "Giai đoạn nghiên cứu"],

    # --- 一口价 is what a market trader says. A car service quotes 固定价格.
    "Flat fare to Sea, Tac": ["至西雅图机场固定价格", "Tarifa fija al aeropuerto", "공항까지 정액 요금", "Giá cố định tới sân bay"],
    "Book any hour": ["全天候可预约", "Reserva a cualquier hora", "언제든 예약 가능", "Đặt xe bất kỳ giờ nào"],
    # --- sits under the word "Tesla"; 每一辆车 on its own says nothing.
    "Every vehicle": ["全部车辆", "Toda la flota", "전 차량", "Toàn bộ xe"],

    "Operations platform": ["运营平台", "Plataforma de operaciones", "운영 플랫폼", "Nền tảng vận hành"],
    "Dispatch, invoicing, driver paperwork and the trip-planning tools, built in-house rather than rented, so the customer relationship and the data stay with us.": [
        "调度、开票、司机资料与行程规划工具，均为自研而非外购，因此客户关系与数据都留在我们自己手中。",
        "Despacho, facturación, documentación de conductores y las herramientas de planificación, desarrollados en casa y no alquilados, así la relación con el cliente y los datos se quedan con nosotros.",
        "배차, 청구, 기사 서류, 여행 계획 도구까지 임대가 아니라 자체 개발했습니다. 그래서 고객 관계와 데이터가 저희에게 남습니다.",
        "Điều phối, xuất hóa đơn, hồ sơ tài xế và công cụ lập kế hoạch, tự xây dựng thay vì đi thuê, nên quan hệ khách hàng và dữ liệu vẫn thuộc về chúng tôi."],

    "Mixed-use development, at drawing stage. Nothing built, nothing leased, nothing offered, the plans are published as they stand.": [
        "综合开发项目，目前处于图纸阶段。尚未动工、尚未招租、尚未对外发售，图纸按现状公开。",
        "Desarrollo de uso mixto, en fase de planos. Nada construido, nada arrendado, nada ofrecido, los planos se publican tal como están.",
        "복합 개발 사업으로, 현재 도면 단계입니다. 지은 것도, 임대한 것도, 판매하는 것도 없습니다, 도면은 있는 그대로 공개합니다.",
        "Dự án phát triển đa chức năng, đang ở giai đoạn bản vẽ. Chưa xây, chưa cho thuê, chưa chào bán, bản vẽ được công bố đúng hiện trạng."],

    "An automated trading research project in private verification, building an audited record. Nothing is for sale and no money is accepted, you can follow the results.": [
        "一个自动交易研究项目，目前处于内部验证阶段，正在积累可审计的记录。不对外销售，也不接受任何资金，您可以关注结果。",
        "Un proyecto de investigación de trading automatizado en verificación privada, construyendo un historial auditado. No hay nada a la venta ni se acepta dinero, puedes seguir los resultados.",
        "비공개 검증 단계의 자동 매매 연구 프로젝트로, 감사 가능한 기록을 쌓는 중입니다. 판매하는 것도 없고 자금도 받지 않습니다, 결과만 지켜보실 수 있습니다.",
        "Một dự án nghiên cứu giao dịch tự động đang trong giai đoạn kiểm chứng nội bộ, tích lũy hồ sơ có thể kiểm toán. Không bán gì và không nhận tiền, bạn có thể theo dõi kết quả."],

    "A Seattle car service: flat-rate Tesla rides to Sea, Tac and around the city, plus trip-planning tools that are free to use.": [
        "西雅图的用车服务：特斯拉固定价格接送，往返机场及市区，另有免费使用的行程规划工具。",
        "Un servicio de coche en Seattle: traslados en Tesla con tarifa fija al aeropuerto y por la ciudad, más herramientas de planificación de viajes gratuitas.",
        "시애틀의 차량 서비스입니다. 공항과 시내를 오가는 정액 요금 테슬라 이동, 그리고 무료로 쓰는 여행 계획 도구.",
        "Dịch vụ xe tại Seattle: các chuyến Tesla giá cố định tới sân bay và quanh thành phố, cùng công cụ lập kế hoạch chuyến đi miễn phí."],

    "Flat-rate Tesla rides, Seattle and Sea, Tac.": [
        "特斯拉固定价格接送，覆盖西雅图与机场。",
        "Traslados en Tesla con tarifa fija, Seattle y el aeropuerto.",
        "정액 요금 테슬라 이동, 시애틀과 공항.",
        "Chuyến Tesla giá cố định, Seattle và sân bay."],
})

# Two the register pass missed on the first sweep.
EXTRA.update({
    "Airport Pickup (flat), $75": [
        "机场接送（固定价格）, $75", "Recogida en aeropuerto (tarifa fija), $75",
        "공항 픽업(정액), $75", "Đón sân bay (giá cố định), 75 $"],

    # 输血/加力/滚雪球 is three metaphors in one sentence, and 每一块业务 again.
    # The English is a plain claim; the Chinese was written like ad copy.
    "We started with transportation: affordable Tesla rentals that turn everyday drivers into earners and everyday riders into loyal clients. From there, each part of our business funds and strengthens the next, operations, real estate, finance, and reinvestment, a closed loop where revenue compounds instead of leaking away.": [
        "我们从出行业务起步：以可负担的特斯拉租赁，让普通司机获得收入，也让乘客愿意再次乘坐。在此基础上，每一项业务为下一项提供资金，出行、房地产、金融、再投资，形成一个闭环，收入在其中不断累积，而不是外流。",
        "Empezamos por el transporte: alquileres de Tesla asequibles que convierten a conductores corrientes en personas que ganan y a cada pasajero en cliente recurrente. A partir de ahí, cada negocio financia al siguiente, transporte, inmobiliario, finanzas, reinversión, formando un circuito cerrado donde los ingresos se acumulan en lugar de escaparse.",
        "저희는 교통에서 시작했습니다. 합리적인 가격의 테슬라 대여로 평범한 기사가 수입을 얻고, 승객은 다시 찾게 됩니다. 그 위에서 각 사업이 다음 사업의 자금을 댑니다, 교통, 부동산, 금융, 재투자, 수익이 빠져나가지 않고 쌓이는 닫힌 순환을 이룹니다.",
        "Chúng tôi khởi đầu từ vận tải: cho thuê Tesla với giá hợp lý để tài xế bình thường có thu nhập và hành khách quay lại. Từ đó, mỗi mảng cấp vốn cho mảng kế tiếp, vận tải, bất động sản, tài chính, tái đầu tư, tạo thành vòng khép kín nơi doanh thu tích lũy thay vì thất thoát."],
})


# ---------------------------------------------------------------------------
# VOICE PASS.
#
# The register pass fixed the wrong words and left the wrong shape. Every
# sentence still had English bones, subject, verb, object, in English order,
# with Chinese vocabulary laid over the top. Accurate, professional, and with
# nothing alive in it. A reader can feel that even when nothing is wrong.
#
# Chinese carries voice in rhythm and balance rather than in word choice: short
# clauses that answer each other, a comma placed to make a beat, a sentence that
# lands on its weight instead of trailing off in qualifiers. The English here is
# calm, concrete and slightly dry, confident enough not to sell. That voice
# exists in Chinese; it just cannot be reached by translating in order.
#
# So these are rewritten from the meaning, not from the sentence.
#   一次只做好一项业务, 好 is the whole point: not one at a time, one done properly
#   眼下真正在运转的    , 眼下 is how a person says "right now" with dignity
#   都是自己写的，不是租来的, plain, proud, and unmistakably not a translation
#   图纸是什么样，就公开什么样, the parallel is the promise
#   不收一分钱          , "a single cent", which 不接受任何资金 was too polite to say
#
# Spanish redone on the same principle. Korean and Vietnamese are improved but
# NOT verified, I can reason about their register, not hear their voice, and
# they need a reader who can.
# ---------------------------------------------------------------------------
EXTRA.update({
    "We build one business at a time": [
        "一次只做好一项业务",
        "Un negocio a la vez, hecho bien",
        "한 번에 하나의 사업을, 제대로",
        "Mỗi lần chỉ làm tốt một mảng"],

    "Transportation is the one that runs today: flat-rate Tesla rides across Seattle, cars rented to drivers who earn with them, and trip-planning tools anyone can use free. It pays for what comes next. Every other arm is listed below with the stage it is honestly at, including the ones not finished.": [
        "眼下真正在运转的只有出行一项：西雅图全城的特斯拉固定价格接送、租给司机的车，以及一套谁都能免费用的行程规划工具。它挣来的钱，投向后面几项。下面每一项业务都写明了所处的阶段，没做完的，也一并写明。",
        "Hoy solo hay una parte en marcha: el transporte. Traslados en Tesla con tarifa fija por todo Seattle, coches alquilados a conductores que viven de ellos, y herramientas de planificación que cualquiera usa gratis. Lo que gana paga lo que viene después. Cada una de las demás aparece abajo con la etapa en la que está de verdad, también las que no están terminadas.",
        "지금 실제로 돌아가는 건 교통 하나입니다. 시애틀 전역을 다니는 정액 요금 테슬라, 기사에게 빌려주는 차, 그리고 누구나 공짜로 쓰는 여행 계획 도구. 여기서 번 돈이 다음 사업으로 갑니다. 나머지는 아래에 지금 서 있는 자리를 그대로 적어 두었습니다, 아직 끝나지 않은 것까지.",
        "Hiện chỉ có một mảng thực sự chạy: vận tải. Những chuyến Tesla giá cố định khắp Seattle, xe cho tài xế thuê để sống bằng nghề, và bộ công cụ lập kế hoạch ai cũng dùng miễn phí. Tiền nó kiếm được đổ vào những mảng sau. Mỗi mảng còn lại đều ghi rõ đang ở đâu, kể cả mảng chưa xong."],

    "Flat-rate Tesla service across Seattle, a vehicle rental programme for drivers, and trip-planning tools that are free to anyone, with no account and nothing to install.": [
        "覆盖西雅图全城的特斯拉固定价格接送服务、面向司机的车辆租赁计划，以及任何人都能免费使用的行程规划工具，无需注册账号，无需安装任何软件。",
        "Servicio Tesla con tarifa fija en todo Seattle, un programa de alquiler de vehículos para conductores y herramientas de planificación de viajes gratuitas para cualquiera, sin cuenta y sin nada que instalar.",
        "시애틀 전역의 테슬라 정액 운송 서비스, 기사를 위한 차량 렌탈 프로그램, 그리고 누구나 무료로 쓸 수 있는 여행 계획 도구입니다. 계정도 설치도 필요 없습니다.",
        "Dịch vụ Tesla giá cố định trên khắp Seattle, chương trình cho tài xế thuê xe, và các công cụ lập kế hoạch chuyến đi miễn phí cho tất cả mọi người, không cần tài khoản và không phải cài đặt gì.",
    ],
    "Four arms, at four different stages": [
        "四项业务，四个阶段",
        "Cuatro áreas, cuatro etapas",
        "네 개의 사업, 네 개의 단계",
        "Bốn mảng, bốn giai đoạn"],

    "One business pays for the next. That only means something if we say plainly which ones are earning today and which are still being built, so we do.": [
        "一项撑起下一项。这话要站得住，就得说明白：哪几项今天在挣钱，哪几项还在建。所以我们说明白。",
        "Un negocio sostiene al siguiente. Para que eso signifique algo hay que decir cuál gana hoy y cuál sigue en obras. Así que lo decimos.",
        "하나가 다음 하나를 받칩니다. 그 말이 서려면 어느 것이 오늘 벌고 어느 것이 아직 짓는 중인지 밝혀야 합니다. 그래서 밝힙니다.",
        "Mảng này đỡ mảng kia. Muốn câu đó đứng vững thì phải nói rõ: mảng nào hôm nay kiếm ra tiền, mảng nào còn đang dựng. Nên chúng tôi nói rõ."],

    "Flat-rate Tesla rides in Seattle at $75 to Sea, Tac, cars rented to drivers who keep the fare, and a commission programme for hotels and agents. This is the business that earns.": [
        "西雅图的特斯拉接送，到机场固定 75 美元；车租给司机，车费全归他们；酒店和代理商荐客，按单拿佣金。这一项，是眼下真正在挣钱的。",
        "Traslados en Tesla en Seattle, 75 $ fijos al aeropuerto; coches alquilados a conductores que se quedan la tarifa; hoteles y agentes cobran comisión por cada cliente. Esta es la parte que gana dinero.",
        "시애틀의 테슬라 이동, 공항까지 75달러 정액. 차는 기사에게 빌려주고 요금은 기사가 다 가집니다. 호텔과 에이전트는 손님을 보내고 건당 수수료를 받습니다. 지금 돈을 버는 건 이 사업입니다.",
        "Chuyến Tesla ở Seattle, cố định 75 $ tới sân bay; xe cho tài xế thuê, cước tài xế giữ hết; khách sạn và đại lý giới thiệu khách, ăn hoa hồng theo chuyến. Đây là mảng đang thực sự kiếm ra tiền."],

    "Dispatch, invoicing, driver paperwork and the trip-planning tools, built in-house rather than rented, so the customer relationship and the data stay with us.": [
        "调度、开票、司机资料、行程规划工具，都是自己写的，不是租来的。所以客户和数据，都留在自己手里。",
        "Despacho, facturación, papeleo de conductores, herramientas de planificación: escritos por nosotros, no alquilados. Por eso el cliente y los datos se quedan aquí.",
        "배차, 청구, 기사 서류, 여행 계획 도구, 빌린 게 아니라 직접 만들었습니다. 그래서 고객도 데이터도 저희에게 남습니다.",
        "Điều phối, hóa đơn, giấy tờ tài xế, công cụ lập kế hoạch, tự viết, không đi thuê. Nhờ vậy khách hàng và dữ liệu vẫn ở lại với chúng tôi."],

    "Mixed-use development, at drawing stage. Nothing built, nothing leased, nothing offered, the plans are published as they stand.": [
        "综合开发项目，还在图纸上。没有动工，没有招租，没有对外发售，图纸是什么样，就公开什么样。",
        "Desarrollo de uso mixto, todavía sobre el plano. Nada construido, nada arrendado, nada a la venta, los planos se publican tal cual están.",
        "복합 개발 사업, 아직 도면 위에 있습니다. 지은 것 없고, 임대한 것 없고, 파는 것 없습니다, 도면은 있는 그대로 공개합니다.",
        "Dự án đa chức năng, còn nằm trên bản vẽ. Chưa xây, chưa cho thuê, chưa bán, bản vẽ thế nào thì công bố thế ấy."],

    "An automated trading research project in private verification, building an audited record. Nothing is for sale and no money is accepted, you can follow the results.": [
        "一个自动交易的研究项目，还在内部验证，正把成绩记成一本可审计的账。不卖任何东西，也不收一分钱，结果公开，您看着就是。",
        "Un proyecto de investigación en trading automatizado, aún en verificación privada, levantando un historial auditable. No se vende nada y no se acepta dinero, los resultados están a la vista.",
        "자동 매매 연구 프로젝트입니다. 아직 내부 검증 중이고, 감사받을 수 있는 기록을 쌓는 중입니다. 파는 것도 없고 돈도 받지 않습니다, 결과만 공개합니다.",
        "Một dự án nghiên cứu giao dịch tự động, còn trong kiểm chứng nội bộ, đang ghi thành tích thành một sổ có thể kiểm toán. Không bán gì, không nhận một đồng nào, kết quả công khai, bạn cứ nhìn."],

    "A Seattle car service: flat-rate Tesla rides to Sea, Tac and around the city, plus trip-planning tools that are free to use.": [
        "西雅图的用车服务：特斯拉接送，往返机场与市区，价格固定；另有一套免费的行程规划工具。",
        "Un servicio de coche en Seattle: traslados en Tesla al aeropuerto y por la ciudad, con tarifa fija, más herramientas de planificación gratuitas.",
        "시애틀의 차량 서비스입니다. 공항과 시내를 오가는 정액 요금 테슬라, 그리고 무료로 쓰는 여행 계획 도구.",
        "Dịch vụ xe tại Seattle: chuyến Tesla giá cố định tới sân bay và quanh thành phố, kèm bộ công cụ lập kế hoạch miễn phí."],

    "The quote is the fare, no surge": [
        "报价就是车费，不加价",
        "El precio que ves es el que pagas, sin recargos",
        "견적이 곧 요금, 할증 없음",
        "Báo giá là giá đi, không phụ thu"],
    "flat to Sea, Tac": ["到机场，固定价", "fijos al aeropuerto", "공항까지 정액", "cố định tới sân bay"],
    "Driver arrives 15 min early": [
        "司机提前 15 分钟到",
        "El conductor llega 15 min antes",
        "기사가 15분 일찍 도착합니다",
        "Tài xế đến sớm 15 phút"],
    "No charge until the ride is confirmed.": [
        "确认之前，不收费。",
        "No se cobra nada hasta confirmar el viaje.",
        "예약이 확정되기 전에는 청구되지 않습니다.",
        "Chưa xác nhận thì chưa thu tiền."],
    "Who's travelling": ["乘车人", "Quién viaja", "탑승자", "Ai đi"],
    "The trip": ["行程", "El trayecto", "여정", "Chuyến đi"],
    "Anything else": ["其他", "Algo más", "그 밖에", "Còn gì nữa"],
    "Book a ride": ["预约用车", "Reservar un viaje", "차량 예약", "Đặt xe"],
    "Request this ride": ["提交这次预约", "Solicitar este viaje", "이 예약 요청하기", "Gửi yêu cầu chuyến này"],
})


# ---------------------------------------------------------------------------
# Destination Book content. The page was Chinese chrome around 85 English
# paragraphs, every description, every tip. Translations live in
# i18n_places.py keyed by PLACE NAME, and the English keys are read straight
# out of destinations.json here, so a retyped paragraph can never drift out of
# match and silently do nothing.
# ---------------------------------------------------------------------------
def _load_place_translations():
    import json as _json, os as _os
    try:
        from i18n_places import PLACES
    except Exception:
        return {}, []
    here = _os.path.dirname(_os.path.abspath(__file__))
    try:
        with open(_os.path.join(here, "destinations.json"), encoding="utf-8") as f:
            book = _json.load(f)
    except Exception:
        return {}, []
    out, unmatched = {}, []
    for e in book.get("entries", []):
        tr = PLACES.get(e.get("name"))
        if not tr:
            if e.get("desc"):
                unmatched.append(e.get("name"))
            continue
        if e.get("desc") and tr.get("desc"):
            out[e["desc"]] = tr["desc"]
        if e.get("tip") and tr.get("tip"):
            out[e["tip"]] = tr["tip"]
    return out, unmatched


_PLACE_TR, _PLACE_MISSING = _load_place_translations()
EXTRA.update(_PLACE_TR)
if _PLACE_MISSING:
    print(f"  i18n_places: no translation for {len(_PLACE_MISSING)} place(s): "
          f"{', '.join(_PLACE_MISSING[:6])}")


# ---------------------------------------------------------------------------
# PATTERNS. Strings a page builds itself, translated as a shape rather than as
# a finished sentence. "Open till 17:00 · ~60 min visit" could never be looked
# up whole, the dictionary would need one entry per time-and-duration pair,
# which is thousands. The placeholders are named, not positional, because word
# order moves: Chinese puts the duration before the noun, English after.
# ---------------------------------------------------------------------------
EXTRA.update({
    "Open till {time} · ~{mins} min visit": [
        "开放至 {time} · 建议游览约 {mins} 分钟",
        "Abierto hasta las {time} · visita de ~{mins} min",
        "{time}까지 · 관람 약 {mins}분",
        "Mở tới {time} · tham quan khoảng {mins} phút"],
    "Open till {time} · ": [
        "开放至 {time} · ", "Abierto hasta las {time} · ",
        "{time}까지 · ", "Mở tới {time} · "],
    "👥 travelers stay ~{stay}": [
        "👥 旅客平均待约 {stay}",
        "👥 los viajeros se quedan ~{stay}",
        "👥 여행자 평균 체류 {stay}",
        "👥 khách thường ở lại ~{stay}"],
})


# ---------------------------------------------------------------------------
# DeepL, for the two languages I could not check.
#
# I said plainly that the Korean and Vietnamese here were written on principle
# and not verified, I can reason about a language's register without being
# able to hear whether a sentence lands. Rather than leave that standing, these
# went through DeepL and its output is what ships.
#
# Chinese and Spanish keep the hand-tuned versions: those were shaped against
# the owner's own reading, twice, and DeepL's are accurate but flatter, which
# is the exact fault ("no soul") that took two passes to fix.
#
# So this is not "machine translation is better". It is: use the professional
# engine where nobody here can judge the result, and keep the human pass where
# somebody could.
# ---------------------------------------------------------------------------
EXTRA.update({
    "We build one business at a time": [
        "一次只做好一项业务",
        "Un negocio a la vez, hecho bien",
        "저희는 한 번에 하나씩 사업을 키웁니다.",
        "Chúng tôi phát triển từng mảng kinh doanh một"
    ],
    "Transportation is the one that runs today: flat-rate Tesla rides across Seattle, cars rented to drivers who earn with them, and trip-planning tools anyone can use free. It pays for what comes next. Every other arm is listed below with the stage it is honestly at, including the ones not finished.": [
        "眼下真正在运转的只有出行一项：西雅图全城的特斯拉固定价格接送、租给司机的车，以及一套谁都能免费用的行程规划工具。它挣来的钱，投向后面几项。下面每一项业务都写明了所处的阶段，没做完的，也一并写明。",
        "Hoy solo hay una parte en marcha: el transporte. Traslados en Tesla con tarifa fija por todo Seattle, coches alquilados a conductores que viven de ellos, y herramientas de planificación que cualquiera usa gratis. Lo que gana paga lo que viene después. Cada una de las demás aparece abajo con la etapa en la que está de verdad, también las que no están terminadas.",
        "현재 운영 중인 사업은 '교통' 부문입니다. 시애틀 전역에서 정액제로 운영되는 테슬라 차량, 이를 통해 수익을 창출하는 운전자들에게 대여되는 차량, 그리고 누구나 무료로 이용할 수 있는 경로 계획 도구 등이 이에 해당합니다. 이 사업에서 창출된 수익은 향후 사업을 위한 자금으로 사용됩니다. 그 외의 모든 사업 부문은 아래에 현재 단계와 함께 솔직하게 나열되어 있습니다. 아직 완성되지 않은 사업도 포함됩니다.",
        "Mảng vận tải là mảng đang hoạt động hiện nay: dịch vụ đi xe Tesla với giá cố định trên khắp Seattle, cho thuê xe cho các tài xế để họ kiếm thu nhập từ đó, và các công cụ lập kế hoạch hành trình mà ai cũng có thể sử dụng miễn phí. Mảng này tạo ra nguồn thu để tài trợ cho những dự án tiếp theo. Tất cả các mảng kinh doanh khác được liệt kê dưới đây kèm theo giai đoạn phát triển thực tế của từng mảng, bao gồm cả những mảng chưa hoàn thiện."
    ],
    "Flat-rate Tesla service across Seattle, a vehicle rental programme for drivers, and trip-planning tools that are free to anyone, with no account and nothing to install.": [
        "覆盖西雅图全城的特斯拉固定价格接送服务、面向司机的车辆租赁计划，以及任何人都能免费使用的行程规划工具，无需注册账号，无需安装任何软件。",
        "Servicio Tesla con tarifa fija en todo Seattle, un programa de alquiler de vehículos para conductores y herramientas de planificación de viajes gratuitas para cualquiera, sin cuenta y sin nada que instalar.",
        "시애틀 전역의 테슬라 정액 운송 서비스, 기사를 위한 차량 렌탈 프로그램, 그리고 누구나 무료로 쓸 수 있는 여행 계획 도구입니다. 계정도 설치도 필요 없습니다.",
        "Dịch vụ Tesla giá cố định trên khắp Seattle, chương trình cho tài xế thuê xe, và các công cụ lập kế hoạch chuyến đi miễn phí cho tất cả mọi người, không cần tài khoản và không phải cài đặt gì.",
    ],
    "Four arms, at four different stages": [
        "四项业务，四个阶段",
        "Cuatro áreas, cuatro etapas",
        "네 가지 사업 분야, 네 가지 서로 다른 단계",
        "Bốn mảng kinh doanh, ở bốn giai đoạn khác nhau"
    ],
    "One business pays for the next. That only means something if we say plainly which ones are earning today and which are still being built, so we do.": [
        "一项撑起下一项。这话要站得住，就得说明白：哪几项今天在挣钱，哪几项还在建。所以我们说明白。",
        "Un negocio sostiene al siguiente. Para que eso signifique algo hay que decir cuál gana hoy y cuál sigue en obras. Así que lo decimos.",
        "한 사업이 다음 사업을 뒷받침합니다. 이는 현재 수익을 창출하는 사업과 아직 구축 중인 사업을 명확히 밝힐 때만 의미가 있으므로, 우리는 그렇게 합니다.",
        "Một mảng kinh doanh tài trợ cho mảng tiếp theo. Điều này chỉ có ý nghĩa nếu chúng tôi nêu rõ mảng nào đang sinh lời ngay hôm nay và mảng nào vẫn đang được phát triển, vì vậy chúng tôi làm như vậy."
    ],
    "Flat-rate Tesla rides in Seattle at $75 to Sea, Tac, cars rented to drivers who keep the fare, and a commission programme for hotels and agents. This is the business that earns.": [
        "西雅图的特斯拉接送，到机场固定 75 美元；车租给司机，车费全归他们；酒店和代理商荐客，按单拿佣金。这一项，是眼下真正在挣钱的。",
        "Traslados en Tesla en Seattle, 75 $ fijos al aeropuerto; coches alquilados a conductores que se quedan la tarifa; hoteles y agentes cobran comisión por cada cliente. Esta es la parte que gana dinero.",
        "시애틀에서 시애틀-타코마(Sea-Tac) 공항까지 75달러의 정액 요금으로 운행되는 테슬라 차량, 운임 전액을 가져가는 운전자에게 대여되는 차량, 그리고 호텔 및 여행사를 위한 수수료 프로그램. 이것이 수익을 창출하는 사업입니다.",
        "Dịch vụ đi xe Tesla với giá cố định tại Seattle (75 USD đến sân bay Sea-Tac), cho thuê xe cho các tài xế được giữ toàn bộ tiền cước, và chương trình hoa hồng dành cho khách sạn và đại lý. Đây là mảng kinh doanh đang sinh lời."
    ],
    "Dispatch, invoicing, driver paperwork and the trip-planning tools, built in-house rather than rented, so the customer relationship and the data stay with us.": [
        "调度、开票、司机资料、行程规划工具，都是自己写的，不是租来的。所以客户和数据，都留在自己手里。",
        "Despacho, facturación, papeleo de conductores, herramientas de planificación: escritos por nosotros, no alquilados. Por eso el cliente y los datos se quedan aquí.",
        "배차, 청구서 발행, 운전자 서류 처리 및 경로 계획 도구, 외부에서 임대하는 대신 자체적으로 개발하여 고객 관계와 데이터는 우리 손에 남아 있습니다.",
        "Hệ thống điều phối, lập hóa đơn, thủ tục giấy tờ cho tài xế và các công cụ lập kế hoạch hành trình, được phát triển nội bộ thay vì thuê ngoài, do đó mối quan hệ với khách hàng và dữ liệu vẫn thuộc về chúng tôi."
    ],
    "Mixed-use development, at drawing stage. Nothing built, nothing leased, nothing offered, the plans are published as they stand.": [
        "综合开发项目，还在图纸上。没有动工，没有招租，没有对外发售，图纸是什么样，就公开什么样。",
        "Desarrollo de uso mixto, todavía sobre el plano. Nada construido, nada arrendado, nada a la venta, los planos se publican tal cual están.",
        "복합 용도 개발 프로젝트는 설계 단계에 있습니다. 아직 건설된 것도, 임대된 것도, 제공된 것도 없습니다, 계획은 현재 상태 그대로 공개됩니다.",
        "Dự án phát triển đa chức năng, đang ở giai đoạn thiết kế. Chưa có công trình nào được xây dựng, chưa có tài sản nào được cho thuê, chưa có sản phẩm nào được chào bán, các bản thiết kế được công bố theo hiện trạng."
    ],
    "An automated trading research project in private verification, building an audited record. Nothing is for sale and no money is accepted, you can follow the results.": [
        "一个自动交易的研究项目，还在内部验证，正把成绩记成一本可审计的账。不卖任何东西，也不收一分钱，结果公开，您看着就是。",
        "Un proyecto de investigación en trading automatizado, aún en verificación privada, levantando un historial auditable. No se vende nada y no se acepta dinero, los resultados están a la vista.",
        "비공개 검증 단계에 있는 자동화된 거래 연구 프로젝트로, 감사된 기록을 구축 중입니다. 판매되는 것은 없으며 자금도 받지 않습니다, 결과를 지켜보실 수 있습니다.",
        "Dự án nghiên cứu giao dịch tự động đang trong giai đoạn kiểm chứng nội bộ, xây dựng hồ sơ đã được kiểm toán. Không có sản phẩm nào được bán và không nhận tiền, bạn có thể theo dõi kết quả."
    ]
})


# ---------------------------------------------------------------------------
# REGISTER, CORRECTED AT THE ROOT.
#
# Two faults, and the first was mine before any translation happened.
#
# 1. "We build one business at a time" reads in English as discipline. In
#    Chinese, 一次只做好一项业务 says we can only manage one thing at once, a
#    small operator with limited capacity. It made a company with four arms
#    sound like a stall. The English headline is now "One company, four
#    businesses": plural, and it claims no limit.
#
# 2. Chasing "voice" I pushed the Chinese toward 口语, 眼下, 挣来的钱,
#    没做完的, 谁都能免费用. In English, plain speech reads as confident.
#    In Chinese business writing colloquial reads as UNEDUCATED, which is the
#    opposite of what plain English achieves. That is why it was irritating to
#    read: not wrong, but beneath the company.
#
#    The educated Chinese register here is 书面语, formal, concise, measured.
#    Not bureaucratic, not chatty. 目前 not 眼下. 收入 not 挣来的钱. 尚未完成
#    not 没做完的. 任何人均可免费使用 not 谁都能免费用.
#
# Korean and Vietnamese follow the same correction, from DeepL.
# ---------------------------------------------------------------------------
EXTRA.update({
    # The hero headline, replaced 2026-08-05. DeepL for all four; the Chinese
    # keeps the 书面语 register the note above insists on, 您 rather than 你,
    # 商务伙伴 rather than anything conversational.
    "Your professional business companion": [
        "您专业的商务伙伴",
        "Tu compañero profesional en los negocios",
        "여러분의 전문적인 비즈니스 파트너",
        "Người đồng hành chuyên nghiệp trong công việc của bạn"],

    "One company, four businesses": [
        "一家公司，四项业务",
        "Una empresa, cuatro negocios",
        "하나의 회사, 네 개의 사업",
        "Một công ty, bốn mảng kinh doanh"],

    "Transportation operates today and funds what follows: flat-rate Tesla service across Seattle, a vehicle rental programme for drivers, and trip-planning tools available free to anyone. The property development is at drawing stage and the trading research is in private verification. Each business is set out below with the stage it has actually reached.": [
        "出行业务目前已投入运营，并为后续业务提供资金：覆盖西雅图全城的特斯拉固定价格接送服务、面向司机的车辆租赁计划，以及任何人均可免费使用的行程规划工具。地产开发尚处图纸阶段，交易研究仍在内部验证之中。以下逐项列明各业务实际所处的阶段。",
        "El transporte ya opera y financia lo que viene después: servicio Tesla con tarifa fija en todo Seattle, un programa de alquiler de vehículos para conductores y herramientas de planificación de viajes gratuitas para cualquiera. El desarrollo inmobiliario está en fase de proyecto y la investigación en trading, en verificación privada. Cada negocio figura debajo con la etapa que ha alcanzado realmente.",
        "교통 사업은 현재 운영 중이며 이후 사업의 자금을 조달합니다. 시애틀 전역의 테슬라 정액 운송 서비스, 운전자를 위한 차량 대여 프로그램, 그리고 누구나 무료로 이용할 수 있는 여행 플래너가 이에 해당합니다. 부동산 개발은 설계 단계에 있으며, 거래 연구는 비공개 검증 단계에 있습니다. 각 사업이 실제로 도달한 단계를 아래에 정리하였습니다.",
        "Mảng vận tải hiện đã đi vào hoạt động và cấp vốn cho các mảng tiếp theo: dịch vụ Tesla giá cố định trên toàn Seattle, chương trình cho tài xế thuê xe, và các công cụ lập kế hoạch hành trình miễn phí cho mọi người. Dự án bất động sản đang ở giai đoạn thiết kế, còn nghiên cứu giao dịch đang trong quá trình kiểm chứng nội bộ. Từng mảng được trình bày dưới đây kèm giai đoạn thực tế đã đạt được."],

    "Flat-rate Tesla service across Seattle, a vehicle rental programme for drivers, and trip-planning tools that are free to anyone, with no account and nothing to install.": [
        "覆盖西雅图全城的特斯拉固定价格接送服务、面向司机的车辆租赁计划，以及任何人都能免费使用的行程规划工具，无需注册账号，无需安装任何软件。",
        "Servicio Tesla con tarifa fija en todo Seattle, un programa de alquiler de vehículos para conductores y herramientas de planificación de viajes gratuitas para cualquiera, sin cuenta y sin nada que instalar.",
        "시애틀 전역의 테슬라 정액 운송 서비스, 기사를 위한 차량 렌탈 프로그램, 그리고 누구나 무료로 쓸 수 있는 여행 계획 도구입니다. 계정도 설치도 필요 없습니다.",
        "Dịch vụ Tesla giá cố định trên khắp Seattle, chương trình cho tài xế thuê xe, và các công cụ lập kế hoạch chuyến đi miễn phí cho tất cả mọi người, không cần tài khoản và không phải cài đặt gì.",
    ],
    "Four arms, at four different stages": [
        "四项业务，各处不同阶段",
        "Cuatro negocios, en cuatro etapas distintas",
        "네 개의 사업, 각기 다른 단계",
        "Bốn mảng kinh doanh, ở bốn giai đoạn khác nhau"],

    "One business pays for the next. That only means something if we say plainly which ones are earning today and which are still being built, so we do.": [
        "一项业务为下一项提供资金。此话唯有在明确说明哪些业务已在盈利、哪些仍在建设之后方才成立，故一并列明。",
        "Un negocio financia al siguiente. Esa afirmación solo se sostiene si indicamos con claridad cuáles generan ingresos hoy y cuáles siguen en construcción; por eso lo indicamos.",
        "한 사업이 다음 사업의 자금을 댑니다. 이는 어느 사업이 현재 수익을 내고 어느 사업이 아직 구축 중인지 분명히 밝힐 때에만 성립하므로, 아래에 함께 밝힙니다.",
        "Mảng này cấp vốn cho mảng kế tiếp. Điều đó chỉ đứng vững khi nêu rõ mảng nào đang sinh lời và mảng nào còn đang xây dựng, nên chúng tôi nêu rõ."],

    "Flat-rate Tesla rides in Seattle at $75 to Sea, Tac, cars rented to drivers who keep the fare, and a commission programme for hotels and agents. This is the business that earns.": [
        "西雅图的特斯拉固定价格接送服务，至机场统一收费 75 美元；车辆租赁予司机，车费全额归司机所有；并设有面向酒店与代理机构的佣金计划。此为目前产生收入的业务。",
        "Servicio Tesla con tarifa fija en Seattle, 75 $ al aeropuerto; vehículos alquilados a conductores que conservan íntegra la tarifa; y un programa de comisiones para hoteles y agencias. Este es el negocio que genera ingresos.",
        "시애틀에서 공항까지 75달러 정액 요금의 테슬라 운송 서비스, 운임 전액을 운전자가 갖는 차량 대여, 그리고 호텔 및 여행사를 위한 수수료 프로그램. 현재 수익을 내는 사업입니다.",
        "Dịch vụ Tesla giá cố định tại Seattle, 75 USD tới sân bay; cho tài xế thuê xe và giữ trọn tiền cước; cùng chương trình hoa hồng dành cho khách sạn và đại lý. Đây là mảng đang tạo ra doanh thu."],

    "Dispatch, invoicing, driver paperwork and the trip-planning tools, built in-house rather than rented, so the customer relationship and the data stay with us.": [
        "调度、开票、司机资料管理与行程规划工具，均为自主开发而非外部租用，客户关系与数据因此留存于内部。",
        "Despacho, facturación, documentación de conductores y herramientas de planificación: desarrollados internamente en lugar de alquilados, de modo que la relación con el cliente y los datos permanecen con nosotros.",
        "배차, 청구, 운전자 서류 관리, 여행 플래너를 외부 임대가 아닌 자체 개발로 구축하였으며, 그 결과 고객 관계와 데이터가 내부에 남습니다.",
        "Điều phối, lập hóa đơn, hồ sơ tài xế và công cụ lập kế hoạch hành trình đều do nội bộ phát triển thay vì thuê ngoài, nhờ đó quan hệ khách hàng và dữ liệu được giữ lại."],

    "Mixed-use development, at drawing stage. Nothing built, nothing leased, nothing offered, the plans are published as they stand.": [
        "综合体开发项目，目前处于图纸阶段。尚未动工，尚未招租，亦未对外发售；图纸按现状公开。",
        "Desarrollo de uso mixto, en fase de proyecto. Nada construido, nada arrendado, nada ofrecido; los planos se publican en su estado actual.",
        "복합 용도 개발 사업으로 현재 설계 단계에 있습니다. 착공, 임대, 분양 모두 이루어지지 않았으며, 도면은 현재 상태 그대로 공개합니다.",
        "Dự án phát triển đa chức năng, hiện ở giai đoạn thiết kế. Chưa khởi công, chưa cho thuê, chưa chào bán; bản vẽ được công bố theo hiện trạng."],

    "An automated trading research project in private verification, building an audited record. Nothing is for sale and no money is accepted, you can follow the results.": [
        "自动化交易研究项目，目前处于内部验证阶段，正在建立可审计的业绩记录。不对外销售任何产品，亦不接受任何资金；结果公开，可持续关注。",
        "Proyecto de investigación en trading automatizado, en verificación privada, construyendo un historial auditable. No se vende nada ni se acepta dinero; los resultados son públicos.",
        "비공개 검증 단계의 자동화 거래 연구 프로젝트로, 감사 가능한 기록을 축적하고 있습니다. 판매하는 상품은 없으며 자금도 받지 않습니다. 결과는 공개됩니다.",
        "Dự án nghiên cứu giao dịch tự động đang trong giai đoạn kiểm chứng nội bộ, xây dựng hồ sơ có thể kiểm toán. Không bán sản phẩm nào và không nhận tiền; kết quả được công bố."],

    "A Seattle car service: flat-rate Tesla rides to Sea, Tac and around the city, plus trip-planning tools that are free to use.": [
        "西雅图的用车服务：特斯拉固定价格接送，往返机场及市区；另提供免费使用的行程规划工具。",
        "Servicio de vehículos en Seattle: traslados Tesla con tarifa fija al aeropuerto y por la ciudad, y herramientas de planificación de viajes de uso gratuito.",
        "시애틀의 차량 서비스입니다. 공항과 시내를 오가는 테슬라 정액 운송, 그리고 무료로 이용하는 여행 플래너를 제공합니다.",
        "Dịch vụ xe tại Seattle: đưa đón bằng Tesla với giá cố định tới sân bay và trong thành phố, kèm công cụ lập kế hoạch hành trình miễn phí."],

    "Flat-rate Tesla rides, Seattle and Sea, Tac.": [
        "特斯拉固定价格接送服务，覆盖西雅图市区与机场。",
        "Traslados Tesla con tarifa fija, Seattle y el aeropuerto.",
        "테슬라 정액 운송 서비스, 시애틀 시내와 공항.",
        "Dịch vụ Tesla giá cố định, Seattle và sân bay."],
})


# The same fault, found on the pages the front-page fix did not reach.
# 摸得门儿清 is Beijing street slang, sitting on a business sign-up page.
# 两件事都能办 and 大白话 are spoken register. 把那天讲完 is loose for a
# memorial. All rewritten as 书面语.
EXTRA.update({
    ". The same agent code does both. Anyone can join, as an individual or an organization.": [
        "上出售。同一代理编号即可兼顾两者。个人与机构均可加入。",
        ". El mismo código de agente sirve para ambas cosas. Puede unirse cualquiera, como particular o como organización.",
        ". 동일한 에이전트 코드로 두 가지 모두 가능합니다. 개인이든 기관이든 누구나 참여할 수 있습니다.",
        ". Cùng một mã đại lý dùng được cho cả hai. Cá nhân hay tổ chức đều có thể tham gia."],

    "Guides register here too, a student running a campus walk, a driver who knows one neighborhood properly. Your code is what proves the trip was written by a real guide.": [
        "导游亦在此注册，带领校园徒步的学生、熟悉某一街区的司机均可。您的编号即为该行程出自真实导游之手的凭证。",
        "Los guías también se registran aquí: un estudiante que lleva un paseo por el campus, un conductor que conoce a fondo un barrio. Su código acredita que el itinerario lo escribió un guía real.",
        "가이드도 이곳에서 등록합니다. 캠퍼스 투어를 이끄는 학생, 특정 동네를 잘 아는 기사 모두 해당합니다. 발급된 코드가 해당 일정이 실제 가이드의 손에서 나왔음을 증명합니다.",
        "Hướng dẫn viên cũng đăng ký tại đây, sinh viên dẫn tour trong khuôn viên, tài xế thông thuộc một khu phố. Mã của bạn là bằng chứng hành trình do một hướng dẫn viên thật soạn ra."],

    "Every morning, one plain-language read of your day, and it clearly labels a guess a guess, and an earned answer earned.": [
        "每日清晨，以平实的语言为您通读当日情况；属于推测的明确标注为推测，经验证得出的结论亦如实标明。",
        "Cada mañana, una lectura de su día en lenguaje llano, que señala con claridad lo que es una conjetura y lo que es una respuesta ganada.",
        "매일 아침, 하루를 평이한 언어로 정리해 드립니다. 추측은 추측이라고, 검증을 거친 답은 그렇다고 분명히 표시합니다.",
        "Mỗi sáng, một bản đọc ngắn về ngày của bạn bằng ngôn ngữ giản dị, phần nào là phỏng đoán thì ghi rõ là phỏng đoán, phần nào đã được kiểm chứng thì ghi rõ như vậy."],

    "Twin reflecting pools in the footprints of the towers; the museum below tells the story with artifacts and voices.": [
        "两座反射池坐落于原双塔基址之上；地下博物馆以遗物与幸存者的声音记述那一天。",
        "Dos estanques reflectantes sobre las huellas de las torres; el museo subterráneo narra aquel día con objetos y voces.",
        "쌍둥이 빌딩이 서 있던 자리에 놓인 두 개의 반사 연못. 지하 박물관이 유품과 증언으로 그날을 기록합니다.",
        "Hai hồ nước phản chiếu nằm đúng nền hai tòa tháp; bảo tàng bên dưới kể lại ngày hôm ấy bằng hiện vật và tiếng nói người trong cuộc."],
})

# 大白话 is 'plain speech' said colloquially, the sentence was about
# clarity and undercut itself by being casual. 平实语言 says the same
# thing in the register the claim requires.
EXTRA.update({
    "The rules that protect you when you use this site, your data, your money, and your bookings. These are the safeguards that are already in place, in plain language.": [
        "您使用本站时受到保护的各项规则，数据、款项与订单。以下为已经落实的保障措施，以平实语言逐条说明。",
        "Las normas que le protegen al usar este sitio: sus datos, su dinero y sus reservas. Estas son las salvaguardas ya implantadas, explicadas en lenguaje llano.",
        "이 사이트를 이용하실 때 적용되는 보호 규칙, 데이터, 금전, 예약에 관한 것입니다. 이미 시행 중인 보호 조치를 평이한 언어로 정리하였습니다.",
        "Các quy tắc bảo vệ bạn khi dùng trang này, dữ liệu, tiền và đơn đặt của bạn. Dưới đây là những biện pháp đã được áp dụng, trình bày bằng ngôn ngữ giản dị."
    ]
})


# Found by check_i18n.py, not by anyone complaining, which is the point of
# having it. Two live strings still in spoken register, plus the superseded
# front-page paragraph, brought into 书面语 so nothing in the dictionary
# contradicts the standard.
EXTRA.update({
    "Our model is simple: control the full value chain, share the upside with our drivers and partners, and reinvest profits back into the community. Whether you need a ride, want to earn behind the wheel, or want to refer clients and earn commission, there's a place for you here.": [
        "我们的思路很简单：自主掌握完整价值链，与司机及合作伙伴共享收益，并将利润再投入社区。无论您是需要用车、希望以驾驶获得收入，还是有意推荐客户并获取佣金，这里都有适合您的位置。",
        "Nuestro modelo es sencillo: controlar toda la cadena de valor, compartir los beneficios con conductores y socios, y reinvertir en la comunidad. Tanto si necesita un trayecto, como si desea obtener ingresos al volante o recomendar clientes y cobrar comisión, aquí tiene un lugar.",
        "저희 모델은 단순합니다. 가치사슬 전체를 직접 운영하고, 그 성과를 기사 및 파트너와 나누며, 이익을 지역사회에 재투자합니다. 차량이 필요하시든, 운전으로 수익을 얻고자 하시든, 고객을 소개하고 수수료를 받고자 하시든 이곳에 자리가 있습니다.",
        "Mô hình của chúng tôi rất đơn giản: tự vận hành toàn bộ chuỗi giá trị, chia sẻ lợi ích với tài xế và đối tác, và tái đầu tư lợi nhuận vào cộng đồng. Dù bạn cần một chuyến xe, muốn có thu nhập từ việc lái xe, hay muốn giới thiệu khách và nhận hoa hồng, ở đây đều có chỗ cho bạn."],

    "Register as a guide, takes a minute": [
        "注册成为导游，约需一分钟",
        "Regístrese como guía: le llevará un minuto",
        "가이드로 등록하기, 1분이면 됩니다",
        "Đăng ký làm hướng dẫn viên, chỉ mất một phút"],

    "Transportation is the one that runs today: flat-rate Tesla rides across Seattle, cars rented to drivers who earn with them, and trip-planning tools anyone can use free. It pays for what comes next. Every other arm is listed below with the stage it is honestly at, including the ones not finished.": [
        "出行业务目前已投入运营，并为后续业务提供资金：覆盖西雅图全城的特斯拉固定价格接送、面向司机的车辆租赁，以及任何人均可免费使用的行程规划工具。以下逐项列明各业务实际所处的阶段，包括尚未完成的部分。",
        "El transporte es lo que ya opera y financia lo que viene después: traslados en Tesla con tarifa fija por todo Seattle, vehículos alquilados a conductores y herramientas de planificación gratuitas para cualquiera. Cada uno de los demás negocios figura debajo con la etapa que ha alcanzado realmente, incluidos los que no están terminados.",
        "현재 운영 중인 사업은 교통 부문입니다. 시애틀 전역의 테슬라 정액 운송, 운전자를 위한 차량 대여, 그리고 누구나 무료로 이용할 수 있는 여행 플래너가 이에 해당하며, 이 사업이 이후 사업의 자금을 조달합니다. 나머지 사업은 아직 완료되지 않은 것을 포함하여 실제 도달한 단계와 함께 아래에 정리하였습니다.",
        "Mảng đang vận hành hiện nay là vận tải: dịch vụ Tesla giá cố định trên toàn Seattle, cho tài xế thuê xe, và công cụ lập kế hoạch hành trình miễn phí cho mọi người. Mảng này cấp vốn cho các mảng tiếp theo. Từng mảng còn lại được liệt kê bên dưới kèm giai đoạn thực tế đã đạt được, kể cả những mảng chưa hoàn thiện."],
})

# Three strings are meant to read identically in every language: a quoted US
# Treasury phrase, a product name, and a back-link carrying the company name.
EXTRA_SKIP |= {
    "“gift to reduce the debt held by the public”",
    "← Plateau Strategy",
    "Plateau Strategy Deflator",
}

# The company name plus its city reads the same in Spanish and Vietnamese,
# identical output there is correct, not a missed translation.
EXTRA_SKIP |= {"Plateau Strategy Solution Lab · Seattle"}

# The contact address in the footer. An email is the same in every language.
EXTRA_SKIP |= {"plateaustrategy@gmail.com"}

# The Pollock companion's new option.
EXTRA.update({
    "Stay": ["留住", "Quédate", "머무르기", "Ở lại"],
    "Let go": ["放开", "Suéltalo", "놓아주기", "Thả ra"],
})

# ---------------- location: the strings the new flow speaks ----------------
# Register note: Korean uses no second-person pronoun here, per the correction
# pass, 고객님 where the person must be named, otherwise nothing.
EXTRA.update({
    "Follow my position as I move": [
        "移动时持续跟随我的位置", "Seguir mi posición mientras me muevo",
        "이동하는 동안 위치 따라가기", "Theo dõi vị trí khi tôi di chuyển"],
    "Stop following your position": [
        "停止跟随位置", "Dejar de seguir tu posición",
        "위치 따라가기 중지", "Dừng theo dõi vị trí"],
    "Getting your location…": ["正在获取您的位置…", "Obteniendo tu ubicación…", "위치를 가져오는 중…", "Đang lấy vị trí của bạn…"],
    "This browser cannot share location.": [
        "此浏览器无法共享位置。", "Este navegador no puede compartir la ubicación.",
        "이 브라우저는 위치를 공유할 수 없습니다.", "Trình duyệt này không chia sẻ được vị trí."],
    "Following your position. Drive times update from where you are.": [
        "正在跟随您的位置，车程将按您所在的地方实时更新。",
        "Siguiendo tu posición. Los tiempos de viaje se calculan desde donde estás.",
        "위치를 따라갑니다. 이동 시간은 현재 계신 곳을 기준으로 갱신됩니다.",
        "Đang theo vị trí của bạn. Thời gian di chuyển được tính lại từ nơi bạn đang đứng."],
    "Click the lock or ⓘ icon beside the address bar → Location → Allow.": [
        "点击地址栏旁的锁形或 ⓘ 图标 → 位置 → 允许。",
        "Haz clic en el candado o el icono ⓘ junto a la barra de direcciones → Ubicación → Permitir.",
        "주소창 옆의 자물쇠 또는 ⓘ 아이콘 → 위치 → 허용을 선택하세요.",
        "Nhấn vào biểu tượng ổ khóa hoặc ⓘ cạnh thanh địa chỉ → Vị trí → Cho phép."],
    "Settings → Safari → Location, or the ⓘ in the address bar.": [
        "设置 → Safari → 位置，或点击地址栏中的 ⓘ。",
        "Ajustes → Safari → Ubicación, o el ⓘ de la barra de direcciones.",
        "설정 → Safari → 위치, 또는 주소창의 ⓘ를 누르세요.",
        "Cài đặt → Safari → Vị trí, hoặc biểu tượng ⓘ trên thanh địa chỉ."],
    "Tap the lock icon beside the address bar → Permissions → Location.": [
        "点击地址栏旁的锁形图标 → 权限 → 位置。",
        "Toca el candado junto a la barra de direcciones → Permisos → Ubicación.",
        "주소창 옆 자물쇠 아이콘 → 권한 → 위치를 누르세요.",
        "Chạm biểu tượng ổ khóa cạnh thanh địa chỉ → Quyền → Vị trí."],
})

# ---- the drawing sheet's own lettering ----
# Level markers and sheet notes are drafting shorthand; they are translated
# because a reader of the drawing should be able to read the drawing.
EXTRA.update({
    "L4 · RESIDENTIAL": ["4层 · 住宅", "N4 · RESIDENCIAL", "4층 · 주거", "T4 · NHÀ Ở"],
    "L3 · RESIDENTIAL": ["3层 · 住宅", "N3 · RESIDENCIAL", "3층 · 주거", "T3 · NHÀ Ở"],
    "L2 · RESIDENTIAL": ["2层 · 住宅", "N2 · RESIDENCIAL", "2층 · 주거", "T2 · NHÀ Ở"],
    "L1 · OFFICE": ["1层 · 办公", "N1 · OFICINAS", "1층 · 사무", "T1 · VĂN PHÒNG"],
    "GF · RETAIL": ["首层 · 商铺", "PB · COMERCIO", "1층 · 상가", "TT · BÁN LẺ"],
    "SITE PLAN · 1:500": ["总平面图 · 1:500", "PLANO DE SITIO · 1:500", "배치도 · 1:500", "MẶT BẰNG · 1:500"],
    "FOOTPRINT": ["建筑占地", "HUELLA", "건물 외곽", "DIỆN TÍCH XÂY DỰNG"],

    # The start control: one box that takes a typed address OR fills itself
    # from where you are. The placeholder keeps the ◎ glyph in every language
    # because it names the button sitting inside the same box, translating a
    # symbol away would leave the sentence pointing at nothing.
    "Starting address or ◎": [
        "起点地址，或点 ◎", "Dirección de inicio, o pulsa ◎",
        "출발지 주소, 또는 ◎", "Địa chỉ xuất phát, hoặc bấm ◎"],
    # From main's visitor-cities map on the Archive page.
    "Where your viewers are": [
        "访客来自哪里", "De dónde son tus visitantes",
        "방문자가 어디에서 오는지", "Người xem của bạn ở đâu"],
    "Use my current location": [
        "使用我的当前位置", "Usar mi ubicación actual",
        "현재 위치 사용", "Dùng vị trí hiện tại của tôi"],
})
EXTRA_SKIP |= {"ST., 40′ R.O.W.", "62′-0″", "78′-0″", "N"}


# Front page + blueprint deck, idea board, add-city and charter strings,
# warmed to a friendlier, conversational register. Order [zh, es, ko, vi].
EXTRA.update({
    "Everything here": ["这里的每一样东西", "Todo lo que hay aquí", "여기 있는 모든 것", "Mọi thứ ở đây nè"],
    "A financial institution built to grow businesses and ideas.": ["一家专门帮企业和点子长大的金融机构。", "Una institución financiera hecha para hacer crecer negocios e ideas.", "사업과 아이디어를 키우려고 만든 금융 기관이에요.", "Một tổ chức tài chính sinh ra để giúp doanh nghiệp và ý tưởng lớn lên."],
    "We built this from scratch, out of our own ideas: rides, rentals, and free trip tools that people use. Now we use what we have built to back other people's businesses and ideas. What is the economic moat you want to build? Let's sink it.": ["这些都是我们从零一点点做出来的，全凭自己的点子：叫车、租车，还有大家都在用的免费行程工具。现在，我们想拿做出来的这些，去帮别人的生意和点子也滋养起来。你想给自己挖一条什么样的护城河？我们一起把它挖深。", "Lo hicimos todo desde cero, con nuestras propias ideas: viajes, alquileres y herramientas de viaje gratis que la gente usa. Ahora usamos lo que hemos creado para apoyar los negocios e ideas de otros. ¿Qué foso económico quieres construir? Vamos a cavarlo bien hondo.", "저희만의 아이디어로 이걸 처음부터 하나하나 만들었어요. 사람들이 실제로 쓰는 차량 서비스, 렌탈, 무료 여행 도구요. 이제 그렇게 쌓아온 걸로 다른 분들의 사업과 아이디어를 받쳐드려요. 어떤 경제적 해자를 쌓고 싶으세요? 저희랑 같이 깊게 파 봐요.", "Chúng mình dựng nên tất cả từ con số không, bằng chính ý tưởng của mình: dịch vụ đi xe, cho thuê xe và mấy công cụ lên lịch trình miễn phí mà mọi người đang dùng. Giờ thì chúng mình lấy những gì đã dựng được để tiếp sức cho doanh nghiệp và ý tưởng của người khác. Bạn muốn xây hào kinh tế kiểu nào? Cùng nhau đào cho thật sâu nhé."],
    "Share your idea": ["说说你的想法", "Comparte tu idea", "아이디어를 들려주세요", "Chia sẻ ý tưởng của bạn nhé"],
    "Try our services": ["来试试我们的服务", "Prueba nuestros servicios", "서비스를 한번 써 보세요", "Dùng thử dịch vụ của chúng mình nhé"],
    "TRY OUR SERVICES": ["来试试我们的服务", "PRUEBA NUESTROS SERVICIOS", "서비스를 한번 써 보세요", "DÙNG THỬ DỊCH VỤ CỦA CHÚNG MÌNH"],
    "Real tools, free to start": ["实打实的工具，免费就能上手", "Herramientas de verdad, gratis para empezar", "정말 쓸모 있는 도구들, 무료로 시작해요", "Công cụ thật, dùng miễn phí ngay"],
    "Use any of these right now. Free, and no account needed.": ["这些你现在就能用。免费，也不用注册账号。", "Usa cualquiera de estas ahora mismo. Gratis y sin crear cuenta.", "지금 바로 아무거나 써 보세요. 무료이고 계정도 필요 없어요.", "Bạn cứ dùng ngay bất kỳ công cụ nào nhé. Miễn phí, chẳng cần tài khoản gì đâu."],
    "Free trip mapping": ["免费帮你画行程地图", "Planea tu viaje gratis", "무료 여행 지도", "Lên lịch trình miễn phí"],
    "Map your next trip on a real map: every stop lights up or dims by drive time, traffic and closing hours. Free to anyone, no sign-in.": ["在真实地图上帮你安排下一趟行程：每个景点会跟着车程、路况和关门时间自动变亮或变暗。人人都能用，免费，也不用登录。", "Planea tu próximo viaje en un mapa de verdad: cada parada se enciende o se apaga según el tiempo de manejo, el tráfico y los horarios de cierre. Gratis para todos, sin registrarte.", "실제 지도 위에서 다음 여행을 계획해 보세요. 각 장소가 이동 시간, 교통, 마감 시간에 따라 밝아지기도 하고 어두워지기도 해요. 누구나 무료, 로그인도 필요 없어요.", "Lên kế hoạch cho chuyến đi tiếp theo của bạn trên bản đồ thật nhé: mỗi điểm dừng sẽ sáng lên hoặc mờ đi theo thời gian lái xe, tình hình giao thông và giờ đóng cửa. Miễn phí cho tất cả mọi người, chẳng cần đăng nhập gì đâu."],
    "Map your trip →": ["来规划行程 →", "Planea tu viaje →", "여행 계획하기 →", "Lên lịch trình cho chuyến đi →"],
    "Flat-rate Tesla service across Seattle, booked online in seconds, with your invoice sent automatically. No app, no surge games.": ["整个西雅图都能坐的 Tesla 专车，价格固定，在线几秒就约好，账单也会自动开给你。不用下 App，也不会在高峰期乱加价。", "Servicio Tesla de tarifa fija por todo Seattle, lo reservas online en segundos y te mandamos la factura automáticamente. Sin app ni subidas de precio sorpresa.", "시애틀 어디든 이용할 수 있는 Tesla 정액 서비스예요. 온라인에서 몇 초면 예약되고 영수증도 자동으로 가요. 앱도, 피크 요금도 없어요.", "Dịch vụ Tesla giá cố định khắp Seattle, đặt online chỉ trong vài giây, hóa đơn tự động gửi tới bạn luôn. Không cần app, cũng chẳng có mấy trò tăng giá giờ cao điểm đâu."],
    "Book a ride →": ["来约辆车 →", "Reserva tu viaje →", "차량 예약하기 →", "Đặt xe →"],
    "Rental car": ["租车", "Alquiler de auto", "차량 렌탈", "Thuê xe"],
    "Rent a Tesla from us and earn from a shared pool of rides, with a path to owning the car you drive.": ["在我们这儿租一辆 Tesla，靠平台给你派来的客户订单赚钱，还能一步步把这辆车开成你自己的。", "Alquila un Tesla con nosotros y gana con los viajes que compartimos, con un camino para que llegues a ser dueño del auto que manejas.", "저희에게 Tesla를 빌려서, 함께 배정되는 운행으로 수입을 올려 보세요. 직접 모는 차를 내 것으로 만드는 길도 있어요.", "Thuê một chiếc Tesla từ chúng mình, rồi kiếm thêm từ nguồn khách được chia sẻ chung, lại còn có cả lộ trình để sở hữu luôn chính chiếc xe bạn đang lái nữa."],
    "See the rental →": ["来看看租车 →", "Ver el alquiler →", "렌탈 살펴보기 →", "Xem gói thuê xe →"],
    "TELL JARVIS": ["跟 JARVIS 说说", "DÍSELO A JARVIS", "자비스에게 알려주세요", "NÓI VỚI JARVIS"],
    "What is not working?": ["哪里用着不顺手？", "¿Qué no te funciona?", "어떤 게 불편하세요?", "Có gì chưa ổn không bạn?"],
    "Tell us what is not working, or anything else on your mind. Literally anything helps us grow, and we read all of it.": ["跟我们说说哪里用着不顺手，或者任何你想说的都行。真的，哪怕一句话都能帮我们变得更好，每一条我们都会认真看。", "Cuéntanos qué no te funciona, o lo que sea que tengas en mente. En serio, cualquier cosa nos ayuda a crecer, y lo leemos todo.", "어떤 게 불편한지, 아니면 그냥 떠오르는 무엇이든 편하게 들려주세요. 정말 어떤 얘기든 저희가 성장하는 데 큰 도움이 되고, 하나도 빠짐없이 다 읽어요.", "Bạn cứ nói cho chúng mình biết có gì chưa ổn, hay bất cứ điều gì đang trong đầu bạn nhé. Thật đấy, điều gì cũng giúp tụi mình tốt lên hơn, và chúng mình đọc hết tất cả luôn."],
    "What is not working, or what would you want? Anything at all.": ["哪里用着不顺手，或者你希望有点什么？什么都可以说。", "¿Qué no te funciona, o qué te gustaría? Lo que sea.", "어떤 게 불편하세요? 아니면 뭐가 있었으면 좋겠어요? 무엇이든 좋아요.", "Có gì chưa ổn, hay bạn đang mong muốn điều gì? Gì cũng được nhé."],
    "Email or phone, only if you want a reply (optional)": ["邮箱或电话，想让我们回复你再填就行（选填）", "Correo o teléfono, solo si quieres que te respondamos (opcional)", "이메일이나 전화번호, 답장을 받고 싶을 때만요 (선택)", "Email hoặc số điện thoại, chỉ cần điền nếu bạn muốn được trả lời thôi nhé (không bắt buộc)"],
    "Send to Jarvis": ["发给 Jarvis", "Envíaselo a Jarvis", "자비스에게 보내기", "Gửi cho Jarvis nhé"],
    "The business that earns today: Teslas we rent to drivers, rides for customers, and the partners who refer them. Here is each part, and where you fit.": ["今天真正在赚钱的，是这几块：租给司机的 Tesla、载客的专车，还有帮我们把客人介绍过来的伙伴。下面每一环都摆给你看，看看你能加入哪一块。", "El negocio que hoy da dinero: los Tesla que alquilamos a conductores, los viajes para clientes y los socios que los recomiendan. Aquí tienes cada parte, y dónde encajas tú.", "오늘 실제로 수익을 내고 있는 사업이에요. 운전자분들께 빌려드리는 Tesla, 손님을 태우는 운행, 그리고 그 손님을 소개해 주시는 파트너요. 각 부분이 어떻게 돌아가는지, 또 여러분이 설 자리는 어디인지 하나씩 소개해 드릴게요.", "Mảng kinh doanh đang sinh lời hôm nay: những chiếc Tesla cho tài xế thuê, các chuyến xe cho khách, và những đối tác giới thiệu khách tới. Đây là từng phần một, và cả chỗ đứng của bạn trong đó nữa."],
    "The software we run the business on": ["我们用来打理生意的软件", "El software con el que llevamos el negocio", "저희가 사업을 꾸려가는 소프트웨어", "Phần mềm mà chúng mình dùng để vận hành mọi thứ"],
    "We built our own tools instead of renting someone else's: dispatch, invoicing, the driver and agent paperwork, and the trip-planning tools. Because it is ours, the customer and the data stay with us, and we fix it ourselves the day something breaks.": ["我们没有去租别人的系统，而是自己动手做工具：调度、开账单、司机和代理的各种手续，还有行程规划工具。因为都是自己的，客户和数据全都留在我们手里，哪天出了问题，当天就能自己修好。", "Hicimos nuestras propias herramientas en vez de alquilar las de otros: despacho, facturación, el papeleo de conductores y agentes, y las herramientas para planear viajes. Como son nuestras, el cliente y los datos se quedan con nosotros, y el día que algo se rompe lo arreglamos nosotros mismos.", "남의 시스템을 빌려 쓰는 대신 저희 도구를 직접 만들었어요. 배차, 청구, 운전자·에이전트 서류, 그리고 여행 계획 도구까지요. 저희 거라서 고객도 데이터도 저희 곁에 남고, 문제가 생기면 그날 바로 저희가 고쳐요.", "Chúng mình tự làm công cụ riêng thay vì đi thuê của người khác: điều phối, xuất hóa đơn, giấy tờ cho tài xế và đại lý, rồi cả mấy công cụ lên lịch trình nữa. Vì là của mình nên khách hàng và dữ liệu đều ở lại với chúng mình, và hễ có gì trục trặc là tụi mình tự tay sửa ngay trong ngày luôn."],
    "Dispatch, which driver has which ride": ["调度，哪位司机接哪一单", "Despacho: qué conductor lleva cada viaje", "배차, 어느 운전자가 어느 운행을 맡을지", "Điều phối: xem tài xế nào nhận chuyến nào"],
    "Invoices, sent and paid": ["账单，开出去、收回来", "Facturas, enviadas y pagadas", "청구서, 보내고 결제까지", "Hóa đơn: đã gửi và đã thanh toán"],
    "Driver and agent sign-up and payouts": ["司机和代理的注册和结算", "Alta y pagos de conductores y agentes", "운전자·에이전트 가입부터 정산까지", "Đăng ký và chi trả cho tài xế và đại lý"],
    "The trip planner and the destination book": ["行程规划器，还有目的地手册", "El planificador de viajes y la guía de destinos", "여행 플래너와 목적지 안내서", "Công cụ lên lịch trình và cẩm nang điểm đến"],
    "What we are building in finance.": ["我们在金融这块正在做的事。", "Lo que estamos creando en finanzas.", "저희가 금융에서 만들어 가고 있는 것들이에요.", "Những gì chúng mình đang xây dựng trong mảng tài chính."],
    "📐 Blueprint Deck": ["📐 蓝图专区", "📐 Colección de planos", "📐 블루프린트 덱", "📐 Bộ bản thiết kế"],
    "Read the lab's blueprints in full. Log in, pay once, and the sheet is yours. A purchase, not an investment.": ["把实验室的蓝图整份看个够。登录、付一次钱，这份蓝图就是你的了。就是买下来，不是投资。", "Lee los planos del laboratorio completos. Inicia sesión, paga una sola vez y el documento es tuyo. Es una compra, no una inversión.", "연구소의 블루프린트를 처음부터 끝까지 읽어 보세요. 로그인하고 한 번만 결제하면 그 문서는 온전히 소유하게 돼요. 투자가 아니라 구매예요.", "Đọc trọn bộ bản thiết kế của lab nhé. Bạn đăng nhập, trả tiền một lần thôi, là bản đó thuộc về bạn. Đây là một lần mua đứt, không phải khoản đầu tư đâu."],
    "Open the deck →": ["去翻翻专区 →", "Abre la colección →", "덱 열기 →", "Mở bộ bản thiết kế →"],
    "Anyone can pitch a business idea here, free, no account needed. You back a project by getting its": ["谁都可以在这儿免费提个生意想法，不用注册账号。你支持一个项目的方式，就是拿到它的", "Cualquiera puede proponer aquí una idea de negocio, gratis y sin crear cuenta. Apoyas un proyecto consiguiendo su", "누구나 여기에서 무료로 사업 아이디어를 낼 수 있어요, 계정도 필요 없고요. 프로젝트를 후원하는 방법은 바로 그", "Ai cũng có thể nêu ý tưởng kinh doanh ở đây, miễn phí, chẳng cần tài khoản. Bạn tiếp sức cho một dự án bằng cách nhận lấy"],
    "blueprint": ["蓝图", "plano", "블루프린트", "bản thiết kế"],
    ": log in and buy the sheet on the Blueprint Deck. That purchase is how you back the build. It buys the document, not a stake and not a share of any profit.": ["：登录，在蓝图专区把这份文件买下来。这一买，就是你对这个项目的支持。你买到的是这份文件，不是股份，也不是以后利润的分成。", ": inicia sesión y compra el documento en la Colección de planos. Con esa compra apoyas el proyecto. Estás comprando el documento, no una participación ni una parte de las ganancias.", ": 로그인해서 블루프린트 덱에서 그 문서를 구매하시면 돼요. 그 구매가 곧 프로젝트를 응원하는 방법이에요. 사시는 건 문서이지, 지분이나 이익 배당이 아니에요.", ": bạn đăng nhập rồi mua bản đó trên Bộ bản thiết kế. Chính lần mua đó là cách bạn tiếp sức cho dự án. Bạn mua tài liệu thôi, chứ không phải cổ phần, cũng không phải phần chia lợi nhuận nào đâu."],
    "🎤 Speak your idea": ["🎤 说说你的想法", "🎤 Di tu idea", "🎤 아이디어를 말해 보세요", "🎤 Nói ý tưởng của bạn nào"],
    "Dictate instead of typing. Tap, talk, tap again.": ["直接说，不用打字。点一下，说，再点一下。", "Dicta en vez de escribir. Toca, habla y vuelve a tocar.", "타이핑 대신 말로 하면 돼요. 누르고, 말하고, 다시 누르면 끝이에요.", "Bạn cứ nói thay vì gõ nhé. Chạm, nói, rồi chạm lại lần nữa là xong."],
    "Are you travelling right now?": ["你这会儿正在旅行吗？", "¿Andas de viaje ahora mismo?", "지금 여행 중이세요?", "Bạn đang đi du lịch đúng không?"],
    "Add the city you are in to the map, so the traveller after you finds it. We keep the city, never your exact spot, your address, or your name.": ["把你现在所在的城市加到地图上，让后面来的旅行者也能找到这儿。我们只留下城市，绝不会记你的确切位置、住址或名字。", "Agrega al mapa la ciudad en la que estás, para que la encuentre quien viaje después de ti. Guardamos la ciudad, nunca tu ubicación exacta, tu dirección ni tu nombre.", "지금 계신 도시를 지도에 추가해서, 다음에 오는 여행자도 쉽게 찾을 수 있게 해 주세요. 저희는 도시만 저장하고, 정확한 위치나 주소, 이름은 절대 저장하지 않아요.", "Thêm thành phố bạn đang ở vào bản đồ nhé, để người đi sau bạn còn tìm thấy. Chúng mình chỉ giữ tên thành phố thôi, không bao giờ lưu vị trí chính xác, địa chỉ hay tên của bạn đâu."],
    "Add my city": ["把我的城市加上", "Agregar mi ciudad", "내 도시 추가", "Thêm thành phố của mình"],
    "Share my city": ["分享我的城市", "Compartir mi ciudad", "내 도시 공유", "Chia sẻ thành phố của mình"],
    "Not now": ["先不用了", "Ahora no", "나중에", "Để sau nhé"],
    "Remove my city from the map": ["把我的城市从地图上拿掉", "Quitar mi ciudad del mapa", "지도에서 내 도시 빼기", "Xóa thành phố của mình khỏi bản đồ"],
    "The places we know, attractions and restaurants, with local tips from a licensed guide. One tap sends any of them into the Trip Planner.": ["都是我们熟门熟路的地方，景点也好餐厅也好，还配上持牌导游的本地小建议。点一下，就能把其中任何一个加进行程规划器。", "Los lugares que conocemos, atracciones y restaurantes, con consejos locales de un guía autorizado. Con un toque mandas cualquiera al planificador de viajes.", "저희가 잘 아는 장소들, 명소와 식당에 면허 있는 가이드의 현지 팁까지 더했어요. 한 번만 누르면 그중 무엇이든 여행 플래너로 쏙 보내드려요.", "Những nơi chúng mình rành, từ điểm tham quan tới nhà hàng, kèm mấy mẹo địa phương từ một hướng dẫn viên có giấy phép hẳn hoi. Chỉ một chạm là gửi được bất kỳ nơi nào vào công cụ lên lịch trình luôn."],
    "This is a private car held for your day.": ["这是专门为你这一天留出来的私人用车。", "Es un auto privado reservado para tu día.", "이 차는 그날 하루를 위해 통째로 잡아 둔 전용 차량이에요.", "Đây là chiếc xe riêng được giữ trọn cả ngày cho bạn đó."],
    "Want it for less? Drop a stop or shorten the day, the price follows the hours. Or ask for a": ["想再省一点？少去一个地方，或者把当天的时间缩短一些，价格是跟着小时数走的。或者呢，你也可以改成", "¿Lo quieres por menos? Quita una parada o acorta el día, el precio va según las horas. O pide un", "조금 더 저렴하게 하고 싶으세요? 들르는 곳을 하나 빼거나 하루를 줄이면 가격도 시간 따라 내려가요. 아니면", "Muốn rẻ hơn chút không? Bỏ bớt một điểm dừng hoặc rút ngắn thời gian trong ngày, giá sẽ đi theo số giờ thôi. Hoặc bạn cứ chọn một"],
    "guided tour": ["有导游带的行程", "tour guiado", "가이드 투어", "tour có hướng dẫn"],
    "of the same places instead, driven and guided, priced by the guide.": ["去逛同样这些地方，有人开车也有人给你讲，价格由导游来定。", "por los mismos lugares, con conductor y guía, y con el precio que ponga el guía.", "로 같은 곳들을 운전이랑 안내까지 함께 받으면서 돌아보셔도 좋아요. 가격은 가이드가 정해요.", "cũng tới đúng những nơi đó, có người lái và hướng dẫn luôn, giá thì do hướng dẫn viên đưa ra."],
    "Reorder today's stops for less driving, same places": ["把今天的顺序重新排一下，少开点车，还是那几个地方", "Reordena las paradas de hoy para manejar menos, mismos lugares", "오늘 들르는 순서만 바꿔서 운전은 줄이고, 갈 곳은 그대로", "Sắp xếp lại các điểm dừng hôm nay để đỡ phải lái nhiều, mà vẫn ghé đúng những nơi đó"],
    "⚡ Tidy the order": ["⚡ 把顺序理一理", "⚡ Ordena la ruta", "⚡ 순서 정리하기", "⚡ Sắp xếp lại thứ tự cho gọn"],
})

# ---- Homepage hero tagline the owner asked for (2026-08-19) ----
# "Your professional business companion", the warm line above the big
# statement. Order is [zh, es, ko, vi]; ja lives in i18n_ja.json.
EXTRA.update({
    "Your professional business companion": ["你身边的专业创业伙伴", "Tu compañero profesional en los negocios", "곁에서 함께하는 전문 비즈니스 파트너", "Người bạn đồng hành chuyên nghiệp cho việc kinh doanh của bạn"],
})

# ---- Warmed the rest of the site: natural, human tone (2026-08-19) ----
# Sentences and descriptions across every page, rewritten out of the
# formal register a reader flagged. Order is [zh, es, ko, vi]. Overrides
# the first-pass wording via EXTRA below.
EXTRA.update({
    "An integrated business ecosystem creating opportunity for the people who ride, drive, and grow with us.": ["一个彼此相连的商业生态，为每一位乘车、开车、和我们一起成长的伙伴创造机会。", "Un ecosistema de negocio conectado que crea oportunidades para todos los que viajan, conducen y crecen con nosotros.", "저희 차를 타는 분, 운전하는 분, 그리고 함께 성장하는 모든 분께 기회를 열어 드리는, 하나로 연결된 비즈니스 생태계예요.", "Một hệ sinh thái kinh doanh gắn kết, mở ra cơ hội cho những ai đi xe, cầm lái và cùng lớn mạnh với chúng mình."],
    "Plateau Strategy Solution Lab is an integrated business ecosystem built to create opportunity at every level, for the people who": ["Plateau Strategy Solution Lab 是一个彼此相连的商业生态，努力在每一个环节为大家创造机会，献给那些和我们一起", "Plateau Strategy Solution Lab es un ecosistema de negocio conectado, pensado para crear oportunidades en cada nivel, para quienes", "Plateau Strategy Solution Lab는 모든 단계에서 기회를 만들려고 하나로 이어진 비즈니스 생태계예요, 저희와 함께", "Plateau Strategy Solution Lab là một hệ sinh thái kinh doanh gắn kết, được tạo ra để mở cơ hội ở mọi cấp độ, cho những người"],
    "We started with transportation: affordable Tesla rentals that turn everyday drivers into earners and everyday riders into loyal clients. From there, each part of our business funds and strengthens the next, operations, real estate, finance, and reinvestment, a closed loop where revenue compounds instead of leaking away.": ["我们从出行业务起步：用价格实惠的特斯拉租赁，让普通司机也能有收入，让乘客愿意一次次回来。在这个基础上，每一项业务都为下一项提供资金，出行、房地产、金融、再投资，环环相扣，收入在其中不断累积，而不是慢慢流走。", "Empezamos por el transporte: alquileres de Tesla asequibles que ayudan a los conductores de todos los días a ganar dinero y convierten a cada pasajero en un cliente que vuelve. A partir de ahí, cada negocio financia y refuerza al siguiente, transporte, inmobiliario, finanzas y reinversión, un circuito cerrado donde los ingresos se acumulan en vez de escaparse.", "저희는 교통에서 시작했어요. 합리적인 가격의 테슬라 대여로 평범한 기사님도 수입을 얻고, 승객은 다시 찾게 돼요. 그 위에서 사업 하나하나가 다음 사업의 자금이 되어 줘요. 교통, 부동산, 금융, 재투자로 이어지면서 수익이 빠져나가지 않고 차곡차곡 쌓이는 순환을 만들어요.", "Chúng mình khởi đầu từ vận tải: cho thuê Tesla với giá hợp lý để tài xế bình thường cũng có thu nhập, còn hành khách thì quay lại đều đặn. Từ đó, mỗi mảng vừa cấp vốn vừa tiếp sức cho mảng kế tiếp, vận tải, bất động sản, tài chính rồi tái đầu tư, tạo thành một vòng khép kín nơi doanh thu tích lũy dần thay vì thất thoát."],
    "Our model is simple: control the full value chain, share the upside with our drivers and partners, and reinvest profits back into the community. Whether you need a ride, want to earn behind the wheel, or want to refer clients and earn commission, there's a place for you here.": ["我们的思路很简单：把完整的价值链握在自己手里，和司机、合作伙伴一起分享收益，再把利润投回社区。无论您是想用车、想开车赚一份收入，还是想推荐客户拿佣金，这里都有属于您的位置。", "Nuestro modelo es sencillo: controlamos toda la cadena de valor, compartimos las ganancias con conductores y socios, y reinvertimos en la comunidad. Ya sea que necesites un viaje, quieras ganar dinero al volante o prefieras recomendar clientes y cobrar comisión, aquí hay un lugar para ti.", "저희 방식은 간단해요. 가치사슬 전체를 직접 운영하고, 거기서 나온 성과를 기사님·파트너와 함께 나누고, 이익은 지역사회에 다시 투자해요. 차가 필요하시든, 운전으로 수입을 얻고 싶으시든, 고객을 소개하고 수수료를 받고 싶으시든, 이곳엔 여러분 자리가 있어요.", "Mô hình của chúng mình rất đơn giản: tự vận hành toàn bộ chuỗi giá trị, chia sẻ lợi ích với tài xế và đối tác, rồi tái đầu tư lợi nhuận vào cộng đồng. Dù bạn cần một chuyến xe, muốn kiếm thu nhập từ việc cầm lái, hay muốn giới thiệu khách và nhận hoa hồng, ở đây luôn có chỗ cho bạn."],
    "Each part funds the next through shared cash flow and operational leverage.": ["每个环节都靠共享的现金流和运营杠杆，为下一个环节提供资金。", "Cada parte financia a la siguiente gracias a un flujo de caja compartido y al apalancamiento operativo.", "각 부분이 함께 나누는 현금 흐름과 운영 레버리지로 다음 부분에 자금을 대 줘요.", "Mỗi phần cấp vốn cho phần tiếp theo nhờ dòng tiền dùng chung và đòn bẩy vận hành."],
    "Full control over supply chain, client experience, and margin capture.": ["从供应链、客户体验到利润，全都握在自己手里。", "Control total de la cadena de suministro, la experiencia del cliente y el margen que capturamos.", "공급망부터 고객 경험, 마진까지 저희가 온전히 챙겨요.", "Chủ động hoàn toàn từ chuỗi cung ứng, trải nghiệm khách hàng đến biên lợi nhuận."],
    "Revenue synergies accelerate expansion across all business lines.": ["各业务之间的收入协同，让所有业务线都扩张得更快。", "Las sinergias de ingresos hacen que todas las líneas de negocio crezcan más rápido.", "수익 시너지가 모든 사업 부문의 성장에 속도를 더해 줘요.", "Sự cộng hưởng doanh thu giúp mọi mảng kinh doanh mở rộng nhanh hơn."],
    "Each part creates value that feeds the next, a self-reinforcing cycle that compounds growth and margin as it scales.": ["每一个环节都在创造价值，再反哺下一个环节，形成一个自我强化的循环，规模越大，增长和利润就越是复利叠加。", "Cada parte genera valor que alimenta a la siguiente: un ciclo que se refuerza solo y multiplica el crecimiento y el margen a medida que crece.", "각 부분이 다음 부분을 살찌우는 가치를 만들어요. 규모가 커질수록 성장과 마진이 복리처럼 불어나는, 스스로 힘을 키우는 순환이에요.", "Mỗi phần tạo ra giá trị nuôi phần tiếp theo, một vòng lặp tự củng cố, càng mở rộng thì tăng trưởng và lợi nhuận càng nhân lên."],
    "We're currently validating the market and preparing to launch. Early partners, investors, and team members are critical to our success.": ["我们目前正在验证市场，准备正式启动。早期加入的合作伙伴、投资者和团队成员，对我们能不能成功都非常关键。", "Ahora mismo estamos validando el mercado y preparando el lanzamiento. Los primeros socios, inversionistas y miembros del equipo son clave para que esto salga bien.", "지금은 시장을 검증하면서 출시를 준비하고 있어요. 초기에 함께해 주시는 파트너, 투자자, 팀원 한 분 한 분이 저희 성공에 정말 큰 힘이 돼요.", "Chúng mình đang kiểm chứng thị trường và chuẩn bị ra mắt. Những đối tác, nhà đầu tư và thành viên nhóm đến sớm chính là chỗ dựa then chốt cho thành công của chúng mình."],
    "We're building something ambitious. Join our community of early believers.": ["我们正在做一件很有野心的事。欢迎加入我们，成为最早相信我们的一群人。", "Estamos construyendo algo ambicioso. Únete a la comunidad de quienes creyeron en nosotros desde el principio.", "저희는 꽤 야심 찬 일을 만들어 가고 있어요. 가장 먼저 저희를 믿어 주는 분들의 커뮤니티에 함께해 보세요.", "Chúng mình đang xây một điều gì đó rất tham vọng. Tham gia cùng cộng đồng những người tin tưởng từ sớm nhé."],
    "Our flagship business, affordable Tesla rentals powering rides, drivers, and referral partners. Here's what we do, and where you fit in.": ["我们的招牌业务，是价格实惠的 Tesla 租赁，同时撑起用车、司机和推荐伙伴三方。来看看我们做的事，以及您可以在哪一环加入。", "Nuestro negocio estrella son los alquileres de Tesla asequibles, que dan vida a los viajes, a los conductores y a los socios de referidos. Esto es lo que hacemos, y este es tu lugar.", "저희 대표 사업은 합리적인 가격의 Tesla 렌탈이에요. 승차, 운전자, 추천 파트너를 하나로 이어 주죠. 저희가 하는 일과, 여러분이 함께할 자리를 소개해 드릴게요.", "Hoạt động chủ lực của chúng mình là cho thuê Tesla giá tốt, tiếp sức cho chuyến đi, tài xế và cả đối tác giới thiệu. Đây là những gì chúng mình làm, và chỗ dành cho bạn."],
    "Affordable, reliable Tesla rides, booked online in seconds, with your invoice sent automatically. No app to download, no surge-pricing games.": ["实惠又靠谱的 Tesla 专车，在线几秒钟就能约，账单还会自动开好。不用下载 App，也没有高峰期乱涨价的套路。", "Viajes en Tesla económicos y de confianza: los reservas en línea en segundos y la factura te llega sola. Sin apps que descargar y sin subidas de tarifa en hora punta.", "합리적이고 믿을 수 있는 Tesla 차량이에요. 온라인에서 몇 초면 예약되고, 영수증도 알아서 날아와요. 앱을 깔 필요도, 피크타임 요금 폭탄도 없어요.", "Xe Tesla giá tốt, đáng tin cậy, đặt online chỉ vài giây, hóa đơn tự động gửi tới bạn. Khỏi cần tải app, cũng không có chuyện tăng giá giờ cao điểm."],
    "Rent a Tesla from us and earn from a shared pool of client rides. Low-cost entry, steady income, and a path to owning the car you drive.": ["从我们这里租一辆 Tesla，用平台分配给您的客户订单赚取收入。入门成本低、收入稳定，还能一步步把手里这辆车变成自己的。", "Alquila un Tesla con nosotros y gana con los viajes de clientes que repartimos entre todos. Poca inversión para empezar, ingresos estables y un camino para llegar a ser dueño del auto que conduces.", "저희에게서 Tesla를 빌리고, 다 같이 나눠 받는 손님 운행으로 수입을 올려 보세요. 부담 없는 초기 비용, 꾸준한 수입, 그리고 직접 모는 차를 내 것으로 만드는 길까지 함께해요.", "Thuê một chiếc Tesla từ chúng mình và kiếm thu nhập từ những chuyến khách được chia đều. Chi phí ban đầu nhẹ nhàng, thu nhập ổn định, và cả lộ trình để sở hữu chính chiếc xe bạn đang lái."],
    "For partners, organizations or individuals": ["面向合作伙伴，机构或个人都欢迎", "Para socios, ya sean empresas o particulares", "파트너를 위한 자리예요, 기관이든 개인이든", "Dành cho đối tác, dù là tổ chức hay cá nhân"],
    "Refer clients and earn commission on every ride they take. Ideal for hotels, travel agencies, or any individual with a network to tap.": ["把客户推荐给我们，他们每坐一次车，您就有一笔佣金。特别适合酒店、旅行社，或任何手上有人脉的人。", "Recomienda clientes y cobra comisión por cada viaje que hagan. Perfecto para hoteles, agencias de viajes o cualquier persona con buenos contactos.", "고객을 소개해 주시면, 그분들이 차를 이용할 때마다 커미션을 받아요. 호텔, 여행사, 또는 인맥이 있는 분이라면 누구에게나 딱 맞아요.", "Giới thiệu khách cho chúng mình và nhận hoa hồng cho mỗi chuyến họ đi. Rất hợp với khách sạn, đại lý du lịch, hay bất kỳ ai có sẵn mối quan hệ."],
    "Unified software infrastructure powering fleet management, client interactions, and data analytics across all business lines. AI-driven optimization and decision support.": ["一套统一的软件底层，为所有业务线的车队管理、客户互动和数据分析提供支撑。由 AI 驱动的优化和决策支持，让每一步都更有把握。", "Una infraestructura de software unificada que hace funcionar la gestión de flotas, el trato con los clientes y el análisis de datos en todas las líneas de negocio. Con optimización y apoyo a las decisiones impulsados por IA.", "모든 사업 부문의 차량 관리, 고객 응대, 데이터 분석을 하나로 받쳐 주는 통합 소프트웨어 인프라예요. AI가 최적화와 의사결정까지 곁에서 도와드려요.", "Một hạ tầng phần mềm hợp nhất, lo liệu việc quản lý đội xe, tương tác với khách và phân tích dữ liệu trên mọi mảng kinh doanh. AI giúp tối ưu và hỗ trợ ra quyết định."],
    "Acquire and develop properties supporting our transportation operations plus generate rental income. Transform land into mixed-use hubs with residential, commercial, and operational space.": ["我们收购并开发能支持交通运营的物业，同时带来租金收入。把土地打造成集住宅、商业和运营空间于一体的综合枢纽。", "Compramos y desarrollamos propiedades que apoyan nuestras operaciones de transporte y, de paso, generan ingresos por alquiler. Convertimos terrenos en centros de uso mixto, con espacio residencial, comercial y operativo.", "교통 운영을 뒷받침하는 부동산을 사들이고 개발하면서 임대 수익까지 함께 만들어요. 땅을 주거·상업·운영 공간이 어우러진 복합 허브로 바꿔 나가요.", "Chúng mình mua lại và phát triển bất động sản để hỗ trợ hoạt động vận tải, đồng thời tạo thêm thu nhập cho thuê. Biến những khu đất thành trung tâm đa chức năng, có chỗ ở, chỗ kinh doanh và chỗ vận hành."],
    "Our financial products, choose one to explore.": ["这是我们的金融产品，选一个了解一下吧。", "Nuestros productos financieros: elige uno y échale un vistazo.", "저희 금융 상품이에요. 하나 골라서 살펴보세요.", "Các sản phẩm tài chính của chúng mình đây, chọn một cái để tìm hiểu nhé."],
    "Your paycheck's profits automatically pay down your debt, principal never at risk. From $14.17/mo.": ["您薪水产生的利润会自动帮您还债，本金完全不会有风险。每月低至 $14.17。", "Las ganancias de tu sueldo van pagando tu deuda solas, y tu capital nunca corre riesgo. Desde $14.17 al mes.", "급여에서 나온 수익이 알아서 빚을 갚아 줘요. 원금은 절대 위험에 놓이지 않고요. 월 $14.17부터 시작해요.", "Lợi nhuận từ lương của bạn tự động trả bớt nợ, còn tiền gốc thì không bao giờ gặp rủi ro. Chỉ từ $14.17 mỗi tháng."],
    "Our automated crypto-trading research project, in private verification, building an audited track record. Nothing for sale yet; follow the results.": ["这是我们的自动化加密交易研究项目，目前还在私密验证阶段，正在积累一份经过审计的业绩记录。现在还没有任何东西出售，欢迎持续关注结果。", "Nuestro proyecto de investigación de trading automatizado de cripto sigue en verificación privada, construyendo un historial auditado. Todavía no hay nada a la venta; sigue de cerca los resultados.", "저희 자동화 암호화폐 트레이딩 연구 프로젝트예요. 지금은 비공개로 검증하면서 감사받은 실적을 차곡차곡 쌓고 있어요. 아직 파는 건 없으니, 결과를 함께 지켜봐 주세요.", "Đây là dự án nghiên cứu giao dịch tiền mã hóa tự động của chúng mình, hiện đang trong giai đoạn xác minh riêng tư và dần xây dựng một hồ sơ thành tích được kiểm toán. Chưa có gì để bán đâu, bạn cứ theo dõi kết quả nhé."],
    "Your paycheck works while you sleep, profits go straight to your debt, and your principal is never at risk.": ["您睡觉的时候，薪水也在替您工作，赚到的利润直接拿去还债，而您的本金完全不会有风险。", "Tu sueldo trabaja mientras duermes: las ganancias van directas a tu deuda y tu capital nunca corre riesgo.", "잠든 사이에도 급여가 대신 일해요. 수익은 곧바로 빚 갚는 데 쓰이고, 원금은 절대 위험에 놓이지 않아요.", "Ngay cả lúc bạn ngủ, tiền lương vẫn làm việc giúp bạn, lợi nhuận đi thẳng vào khoản nợ, còn tiền gốc thì không bao giờ gặp rủi ro."],
    "Our AI trades the balance during a 1, 2 week window": ["我们的 AI 会在 1, 2 周的窗口期里操作这笔余额", "Nuestra IA opera con ese saldo durante una ventana de 1, 2 semanas", "저희 AI가 1, 2주 동안 그 잔액으로 거래해요", "AI của chúng mình giao dịch số dư đó trong khoảng 1, 2 tuần"],
    "Profits lock in a protected vault (5, 15%/mo target)": ["赚到的利润会锁进一个受保护的金库里（每月目标 5, 15%）", "Las ganancias quedan a salvo en una bóveda protegida (objetivo del 5, 15% al mes)", "수익은 안전하게 보호되는 금고에 잠겨요 (목표는 월 5, 15%)", "Lợi nhuận được khóa an toàn trong két bảo vệ (mục tiêu 5, 15% mỗi tháng)"],
    "Just $14.17/mo, billed once a year": ["每月只要 $14.17，一年结算一次", "Solo $14.17 al mes, con un único cobro al año", "한 달에 $14.17, 일 년에 한 번만 청구돼요", "Chỉ $14.17 mỗi tháng, thanh toán gọn một lần trong năm"],
    "Less than one month's minimum credit-card payment. Only profits go toward debt, your principal is never spent. Trading involves risk; results are not guaranteed.": ["比一个月的信用卡最低还款还少。只有利润会拿去还债，您的本金一分都不会动用。交易本身存在风险，结果无法保证。", "Menos que el pago mínimo mensual de una tarjeta de crédito. Solo las ganancias se destinan a la deuda; tu capital nunca se toca. Operar conlleva riesgo y los resultados no están garantizados.", "신용카드 한 달 최소 결제액보다도 적어요. 빚 갚는 데는 수익만 쓰이고, 원금은 절대 손대지 않아요. 트레이딩에는 위험이 따르고, 결과가 보장되지는 않아요.", "Còn ít hơn khoản trả tối thiểu một tháng của thẻ tín dụng. Chỉ có lợi nhuận được dùng để trả nợ, tiền gốc của bạn không bao giờ bị đụng tới. Giao dịch luôn có rủi ro và kết quả thì không thể đảm bảo."],
    "Not ready to enroll, but want this to exist?": ["还没打算注册，但希望它能真的做成？", "¿Aún no quieres inscribirte, pero te gustaría que esto existiera?", "아직 가입할 마음은 아니지만, 이런 게 있으면 좋겠다 싶으세요?", "Chưa muốn đăng ký ngay, nhưng bạn mong điều này thành hiện thực?"],
    "Deploy accumulated capital back into American infrastructure, communities, and businesses. Create a virtuous cycle of economic value creation and reinvestment.": ["把积累下来的资本重新投入美国的基础设施、社区和企业。让经济价值的创造和再投资形成一个良性循环。", "Devolvemos el capital acumulado a la infraestructura, las comunidades y las empresas de Estados Unidos. Así creamos un círculo virtuoso de valor económico y reinversión.", "쌓아 온 자본을 미국의 인프라와 지역사회, 기업으로 다시 흘려보내요. 그렇게 경제적 가치를 만들고 다시 투자하는 선순환을 만들어 가요.", "Chúng mình đưa nguồn vốn tích lũy quay lại hạ tầng, cộng đồng và doanh nghiệp Hoa Kỳ. Từ đó tạo nên một vòng tuần hoàn tích cực giữa việc tạo giá trị kinh tế và tái đầu tư."],
    "© 2026 Plateau Strategy Solution Lab. Building integrated wealth through connected ecosystems.": ["© 2026 Plateau Strategy Solution Lab。用彼此相连的生态，一起把财富做大。", "© 2026 Plateau Strategy Solution Lab. Creando riqueza integrada a través de ecosistemas conectados.", "© 2026 Plateau Strategy Solution Lab. 서로 이어진 생태계로 하나 된 부를 함께 만들어 가요.", "© 2026 Plateau Strategy Solution Lab. Cùng nhau xây dựng của cải gắn kết qua những hệ sinh thái kết nối."],
    "Enter your details and a password, then book your ride.": ["填好您的信息，设一个密码，就能预约用车啦。", "Pon tus datos y una contraseña, y ya puedes reservar tu viaje.", "정보랑 비밀번호만 입력하시면 바로 차량을 예약하실 수 있어요.", "Điền thông tin và một mật khẩu, rồi đặt xe thôi nhé."],
    "New here? Just fill this in, we'll create your account.": ["第一次来？把这些填一下，我们就帮您把账户建好。", "¿Es tu primera vez? Solo completa esto y te creamos la cuenta.", "처음이세요? 여기만 채워 주시면 저희가 계정을 만들어 드려요.", "Lần đầu ghé qua? Chỉ cần điền vào đây, chúng mình sẽ tạo tài khoản cho bạn."],
    "Log in with your renting VIN and birthday.": ["用您的租车 VIN 和生日登录就可以了。", "Entra con el VIN de tu alquiler y tu fecha de nacimiento.", "빌린 차량의 VIN과 생일로 로그인해 보세요.", "Đăng nhập bằng số VIN xe bạn thuê và ngày sinh nhé."],
    "Log in with your last name and agent code.": ["用您的姓氏和代理代码登录就行了。", "Entra con tu apellido y tu código de agente.", "성함과 에이전트 코드로 로그인해 보세요.", "Đăng nhập bằng họ và mã đại lý của bạn nhé."],
    "Tell us where you're going, we'll take care of the rest.": ["告诉我们您要去哪儿，剩下的就交给我们吧。", "Dinos a dónde vas y del resto nos encargamos nosotros.", "어디로 가시는지만 알려 주세요. 나머지는 저희가 다 챙겨 드릴게요.", "Cho chúng mình biết bạn muốn đi đâu, phần còn lại cứ để chúng mình lo nhé."],
    "If this is a trip to the airport, what is the flight number?": ["如果这趟是去机场，麻烦填一下航班号。", "Si vas al aeropuerto, ¿cuál es tu número de vuelo?", "공항에 가시는 거라면 항공편 번호도 알려 주세요.", "Nếu chuyến này ra sân bay, cho chúng mình biết số hiệu chuyến bay nhé."],
    "Need to cancel a reservation?": ["想取消预约吗？", "¿Tienes que cancelar una reserva?", "예약을 취소하고 싶으세요?", "Bạn cần hủy một chuyến đã đặt à?"],
    "For drivers operating vehicles with Plateau Strategy Solution Lab. Register your vehicle to view and claim client reservations.": ["这是给在 Plateau Strategy Solution Lab 开车的司机准备的。登记好您的车，就能查看并接下客户订单。", "Para conductores que trabajan con Plateau Strategy Solution Lab. Registra tu vehículo y así podrás ver y aceptar las reservas de clientes.", "Plateau Strategy Solution Lab에서 운행하시는 기사님을 위한 공간이에요. 차량을 등록하시면 손님 예약을 확인하고 바로 잡으실 수 있어요.", "Dành cho các tài xế chạy xe cùng Plateau Strategy Solution Lab. Đăng ký xe của bạn để xem và nhận các chuyến của khách nhé."],
    "Action Required, Sign Your Driver Agreement": ["需要处理一下，请签署您的司机协议", "Necesitamos algo de ti, firma tu acuerdo de conductor", "확인이 필요해요, 운전자 계약서에 서명해 주세요", "Cần bạn xử lý, hãy ký thỏa thuận tài xế của bạn"],
    "You must sign your agreement before you can accept any rides.": ["在接单之前，请先把协议签好。", "Antes de aceptar viajes, primero firma tu acuerdo.", "운행을 잡으시려면 먼저 계약서에 서명해 주세요.", "Trước khi nhận chuyến nào, bạn hãy ký thỏa thuận trước nhé."],
    "Visible to all drivers. The first to claim secures the ride.": ["所有司机都能看到，谁先接下就归谁。", "Visible para todos los conductores. El primero en aceptarlo se queda el viaje.", "모든 기사님께 보여요. 먼저 잡으시는 분이 운행을 가져가요.", "Mọi tài xế đều nhìn thấy. Ai nhận trước thì được chuyến đó."],
    "No open reservations at this time. New client bookings appear here automatically.": ["目前还没有可以接的订单。有新客户预约时，会自动出现在这里。", "Ahora mismo no hay viajes disponibles. Las nuevas reservas de clientes aparecerán aquí solas.", "지금은 잡을 수 있는 예약이 없어요. 새 손님 예약이 들어오면 여기에 알아서 나타나요.", "Hiện chưa có chuyến nào để nhận. Khi có khách đặt mới, chuyến sẽ tự hiện ở đây."],
    "You have not claimed any rides yet.": ["您还没有接过任何订单呢。", "Todavía no has aceptado ningún viaje.", "아직 잡으신 운행이 없어요.", "Bạn vẫn chưa nhận chuyến nào cả."],
    "I have read and agree to the terms of this Driver Agreement, and this is my legal electronic signature.": ["我已经阅读并同意本司机协议的条款，这就是我的合法电子签名。", "He leído y acepto los términos de este Acuerdo del conductor, y esta es mi firma electrónica con validez legal.", "본 운전자 계약서의 내용을 읽고 동의하며, 이것은 저의 법적 전자 서명이에요.", "Tôi đã đọc và đồng ý với các điều khoản của Thỏa thuận tài xế này, và đây chính là chữ ký điện tử hợp pháp của tôi."],
    "Another driver claimed this ride first. It has been removed from your list.": ["这一单被别的司机先接走了，已经从您的列表里移除了。", "Otro conductor lo aceptó primero. Ya no está en tu lista.", "다른 기사님이 한발 먼저 잡으셨어요. 그래서 목록에서 사라졌어요.", "Một tài xế khác đã nhận trước mất rồi. Chuyến này đã được gỡ khỏi danh sách của bạn."],
    "Refer customers and earn a commission on every completed ride. Anyone can be an agent, as an individual or an organization.": ["把客户推荐给我们，每完成一单您就有一笔佣金。任何人都可以成为代理，个人或机构都欢迎。", "Recomienda clientes y cobra comisión por cada viaje completado. Cualquiera puede ser agente, como particular o como empresa.", "고객을 소개해 주시고, 운행이 완료될 때마다 커미션을 받아 보세요. 개인이든 기관이든 누구나 에이전트가 될 수 있어요.", "Giới thiệu khách và nhận hoa hồng cho mỗi chuyến hoàn thành. Ai cũng có thể làm đại lý, dù là cá nhân hay tổ chức."],
    ", already an agent? sign in,": ["，已经是代理了？点这里登录，", ", ¿ya eres agente? inicia sesión, ", ", 이미 에이전트세요? 로그인, ", ", đã là đại lý rồi? đăng nhập, "],
    "You earn a flat commission on every customer you refer whose ride is completed.": ["您推荐的每一位客户，只要完成用车，您就能拿到一笔固定佣金。", "Ganas una comisión fija por cada cliente que recomiendes y complete su viaje.", "소개해 주신 고객의 운행이 완료될 때마다, 정해진 커미션을 받으실 수 있어요.", "Cứ mỗi khách bạn giới thiệu hoàn thành chuyến đi, bạn lại nhận một khoản hoa hồng cố định."],
    "No referrals yet. Submit your first one under “Refer a Client.”": ["还没有推荐记录。在“推荐客户”里提交您的第一个推荐吧。", "Aún no hay referidos. Envía tu primero desde “Referir un cliente”.", "아직 추천이 없어요. “고객 추천”에서 첫 추천을 남겨 보세요.", "Chưa có giới thiệu nào. Gửi giới thiệu đầu tiên của bạn ở mục “Giới thiệu khách” nhé."],
    "Here's what you earn for referring each service. Your commission depends on the service, pick it on the “Refer a Client” tab and the price fills in automatically.": ["这是您推荐每项服务能拿到的收益。佣金会随您选的服务而不同，在“推荐客户”标签里选一下，价格就会自动填好。", "Esto es lo que ganas por recomendar cada servicio. Tu comisión depende del servicio: elígelo en la pestaña “Referir un cliente” y el precio se completa solo.", "각 서비스를 추천하실 때 받으시는 금액이에요. 커미션은 서비스마다 달라요. “고객 추천” 탭에서 골라 주시면 가격이 자동으로 채워져요.", "Đây là số tiền bạn nhận khi giới thiệu mỗi dịch vụ. Hoa hồng tùy theo từng dịch vụ, bạn chọn ở tab “Giới thiệu khách” là giá sẽ tự điền vào."],
    "Keep this safe. You'll use your organization, last name, and this code to sign in.": ["请把它妥善保管好。以后您会用组织名称、姓氏和这个代码来登录。", "Guárdalo bien. Usarás tu organización, tu apellido y este código para iniciar sesión.", "잘 보관해 두세요. 앞으로 조직명과 성, 그리고 이 코드로 로그인하시게 돼요.", "Hãy giữ kỹ mã này nhé. Bạn sẽ dùng tên tổ chức, họ và mã này để đăng nhập."],
    ". You'll use it, with your last name, to sign in.": ["。以后您就用它和您的姓氏一起登录。", ". Lo usarás, junto con tu apellido, para iniciar sesión.", ". 앞으로 성함과 함께 이 코드로 로그인하시면 돼요.", ". Bạn sẽ dùng nó cùng với họ của mình để đăng nhập nhé."],
    "Sign in to your control center.": ["登录进入您的控制中心。", "Inicia sesión en tu centro de control.", "관제 센터에 로그인해 보세요.", "Đăng nhập vào trung tâm điều khiển của bạn nhé."],
    "Your control center, every reservation, from every source, in one place. Assign drivers, complete rides, and keep the whole operation organized.": ["这是您的控制中心，把来自各个来源的每一笔预订都集中在一个地方。分配司机、完成行程，让整个运营都井井有条。", "Tu centro de control, cada reserva, de cada fuente, en un solo lugar. Asigna conductores, completa viajes y mantén toda la operación organizada.", "여러분의 관제 센터예요. 어디서 들어온 예약이든 한곳에 모아 드려요. 운전자를 배정하고, 운행을 마무리하고, 전체 운영을 깔끔하게 관리해 보세요.", "Trung tâm điều khiển của bạn, gom mọi đặt chỗ từ mọi nguồn về một chỗ. Phân công tài xế, hoàn tất chuyến đi và giữ cho mọi hoạt động luôn gọn gàng."],
    "Partner pipeline · organizations to recruit as agents": ["合作伙伴储备 · 可以招募成代理的组织", "Cartera de socios · organizaciones para sumar como agentes", "파트너 후보 · 에이전트로 모실 조직들", "Danh sách đối tác tiềm năng · các tổ chức có thể mời làm đại lý"],
    "No reservations yet. Bookings from customers and agents appear here automatically.": ["目前还没有预订。客户和代理的预订会自动显示在这里。", "Aún no hay reservas. Las reservas de clientes y agentes aparecen aquí automáticamente.", "아직 예약이 없어요. 고객과 에이전트의 예약이 들어오면 여기에 자동으로 표시돼요.", "Chưa có đặt chỗ nào. Đặt chỗ từ khách hàng và đại lý sẽ tự động hiện ở đây."],
    "Price presets, fill the price on the booking & agent forms (still editable per ride).": ["价格预设，会自动帮您填好预订和代理表单里的价格（每一趟行程仍然可以自己改）。", "Precios predefinidos, completan el precio en los formularios de reserva y de agente (aún editable por viaje).", "가격 프리셋이에요. 예약과 에이전트 양식에 가격을 알아서 채워 줘요 (운행마다 수정도 가능해요).", "Giá định sẵn, tự động điền vào biểu mẫu đặt chỗ và đại lý (vẫn chỉnh được cho từng chuyến)."],
    "Per-agent rates, an agent's referrals pre-fill to their negotiated rate (blank = your default).": ["为每位代理单独设定费率，他们推荐的订单会自动带入约定好的价格（留空就用您的默认值）。", "Tarifas por agente: los referidos de cada agente se rellenan solos con la tarifa que acordaron (déjalo en blanco y usamos tu tarifa por defecto).", "에이전트마다 요금을 따로 정할 수 있어요. 에이전트가 추천하면 서로 정한 요금이 자동으로 채워져요 (비워두시면 기본 요금으로 적용돼요).", "Mức phí riêng cho từng đại lý nhé. Khi đại lý giới thiệu khách, hệ thống tự điền đúng mức đã thỏa thuận (để trống thì dùng mức mặc định của bạn)."],
    "Partner pipeline · Greater Seattle.": ["合作伙伴洽谈进展 · 大西雅图地区。", "Tus socios en marcha · Gran Seattle.", "파트너 진행 현황 · 그레이터 시애틀.", "Đối tác đang kết nối · Khu vực Seattle."],
    "Organizations to recruit as referral agents, hotels, travel agencies, and offices whose people need airport rides. Reach out personally (they earn $15 per completed referral), track each one here, and when they say yes, sign them up in the Agent portal.": ["这些是可以邀请来当推荐代理的机构，比如酒店、旅行社，还有员工经常需要往返机场的公司。亲自联系他们（每完成一次推荐能拿到 $15），在这里记录每一家的进展，等他们答应了，就到代理门户帮他们注册。", "Organizaciones que puedes invitar a ser agentes de referidos: hoteles, agencias de viajes y oficinas cuya gente suele necesitar viajes al aeropuerto. Escríbeles tú mismo (ganan $15 por cada referido completado), lleva el seguimiento de cada una aquí y, en cuanto digan que sí, dalos de alta en el portal de agentes.", "추천 에이전트로 모실 만한 곳들이에요. 공항을 자주 오가야 하는 분들이 있는 호텔, 여행사, 사무실 같은 곳이요. 직접 연락해 보세요(추천이 한 건 성사될 때마다 $15를 받아요). 여기서 한 곳 한 곳 진행 상황을 챙기시고, 상대가 좋다고 하면 에이전트 포털에서 등록해 드리면 돼요.", "Đây là những nơi bạn có thể mời làm đại lý giới thiệu: khách sạn, đại lý du lịch và các văn phòng có nhân viên hay phải ra sân bay. Bạn cứ nhắn trực tiếp cho họ nhé (mỗi lượt giới thiệu thành công họ nhận $15), theo dõi từng nơi ngay tại đây, và khi họ đồng ý thì đăng ký giúp họ trong cổng đại lý."],
    "Partnership pitch (personalize the [brackets])": ["合作邀请话术（记得把[方括号]里的内容换成自己的）", "Mensaje para proponer colaboración (personaliza lo que va entre [corchetes])", "파트너십 제안 문구예요 ([대괄호] 안은 상황에 맞게 바꿔 주세요)", "Lời mời hợp tác (nhớ chỉnh lại phần trong [ngoặc] cho hợp nhé)"],
    "No prospects yet. Add one above.": ["还没有潜在客户，在上方添加一个吧。", "Todavía no tienes prospectos. Añade uno arriba.", "아직 잠재 고객이 없어요. 위에서 하나 추가해 보세요.", "Chưa có khách tiềm năng nào. Thêm một khách ở phía trên nhé."],
    "Live revenue from your Square account, the numbers your taxes are built on.": ["这是从您的 Square 账户实时同步的收入，也是您报税时依据的数字。", "Ingresos en tiempo real de tu cuenta de Square: las cifras sobre las que se calculan tus impuestos.", "Square 계정에서 실시간으로 들어오는 매출이에요. 세금을 계산하는 기준이 되는 숫자예요.", "Doanh thu cập nhật trực tiếp từ tài khoản Square của bạn, cũng chính là những con số dùng để tính thuế."],
    "No transactions yet, they appear here as bookings come in.": ["还没有交易，等预订进来后，交易就会显示在这里。", "Todavía no hay transacciones. Irán apareciendo aquí a medida que lleguen las reservas.", "아직 거래가 없어요. 예약이 들어오면 여기에 하나씩 나타나요.", "Chưa có giao dịch nào. Khi có đặt chỗ, chúng sẽ hiện dần ở đây."],
    "⬇️ Export CSV (for QuickBooks / accountant)": ["⬇️ 导出 CSV（给 QuickBooks 或会计用）", "⬇️ Exportar CSV (para QuickBooks o tu contador)", "⬇️ CSV 내보내기 (QuickBooks나 회계사에게 전달용)", "⬇️ Xuất CSV (cho QuickBooks hoặc kế toán)"],
    "QuickBooks, automatic sync (recommended):": ["QuickBooks 自动同步（推荐这样做）：", "QuickBooks, sincronización automática (lo recomendamos):", "QuickBooks 자동 동기화 (이 방법을 추천드려요):", "QuickBooks, đồng bộ tự động (chúng mình khuyên dùng cách này):"],
    "since every payment runs through Square, connect Square inside QuickBooks once and all revenue flows into your books automatically: QuickBooks →": ["因为每一笔付款都是走 Square 的，所以只要在 QuickBooks 里把 Square 连接一次，之后所有收入就会自动进到您的账簿里：QuickBooks →", "como cada pago pasa por Square, basta con conectar Square dentro de QuickBooks una sola vez y todos tus ingresos entran solos en tu contabilidad: QuickBooks →", "결제가 전부 Square로 이루어지니까, QuickBooks에서 Square를 한 번만 연결해 두면 매출이 알아서 장부에 쌓여요: QuickBooks →", "vì mọi khoản thanh toán đều đi qua Square, bạn chỉ cần kết nối Square trong QuickBooks một lần là toàn bộ doanh thu tự chảy vào sổ sách: QuickBooks →"],
    "→ sign in to Square → done. After that, this page is your quick view and the CSV is your backup/manual import.": ["→ 登录 Square → 就完成了。之后这个页面方便您随时查看，CSV 则留作备份或手动导入。", "→ inicia sesión en Square → y listo. A partir de ahí, esta página es tu vistazo rápido y el CSV te queda como respaldo o para importar a mano.", "→ Square에 로그인 → 끝이에요. 그다음부터 이 페이지는 얼른 확인하는 용도로, CSV는 백업이나 직접 가져오기용으로 쓰시면 돼요.", "→ đăng nhập Square → là xong. Từ đó, trang này để bạn xem nhanh, còn CSV để dành sao lưu hoặc nhập tay khi cần."],
    "Statuses come live from your Square account (refreshed every minute). \"Collected revenue\" counts only invoices Square marks PAID, the number that matters for taxes.": ["这些状态都是从您的 Square 账户实时同步的（每分钟刷新一次）。“已收款收入”只统计 Square 标记为已付的账单，也就是报税时真正要看的那个数字。", "Los estados llegan en tiempo real desde tu cuenta de Square (se actualizan cada minuto). «Ingresos cobrados» cuenta solo las facturas que Square marca como PAGADAS, que es justo la cifra que cuenta para los impuestos.", "상태는 Square 계정에서 실시간으로 올라와요 (1분마다 새로 고쳐져요). ‘수금된 매출’은 Square가 결제됨으로 표시한 청구서만 세는데, 세금에서 진짜 중요한 숫자가 바로 이거예요.", "Trạng thái được cập nhật trực tiếp từ tài khoản Square của bạn (cứ mỗi phút làm mới một lần). “Doanh thu đã thu” chỉ tính những hóa đơn được Square đánh dấu ĐÃ TRẢ, và đây chính là con số quan trọng khi tính thuế."],
    "Ideas and proposals from Plateau Strategy Solution Lab. Like what resonates, and leave your email to follow a proposal you want to see happen.": ["这里是 Plateau Strategy Solution Lab 的一些想法和提案。看到有共鸣的就点个赞，如果哪个提案您特别希望它成真，留下邮箱就能一直关注它的进展。", "Ideas y propuestas de Plateau Strategy Solution Lab. Dale me gusta a lo que te llegue, y deja tu correo para seguir de cerca la propuesta que te gustaría ver hecha realidad.", "Plateau Strategy Solution Lab이 모아 둔 아이디어와 제안이에요. 마음에 와닿는 것에는 좋아요를 눌러 주시고, 꼭 실현됐으면 하는 제안이 있으면 이메일을 남겨 계속 따라가 보세요.", "Những ý tưởng và đề xuất từ Plateau Strategy Solution Lab. Thấy điều nào tâm đắc thì bấm thích nhé, và để lại email để theo dõi đề xuất mà bạn mong thành hiện thực."],
    "Title, e.g. Proposal: Rent-to-own Tesla program": ["标题，比如：提案：以租代购 Tesla 计划", "Título, por ejemplo: Propuesta: Programa Tesla de alquiler con opción a compra", "제목, 예를 들어: 제안: 임대 후 소유 Tesla 프로그램", "Tiêu đề, ví dụ như: Đề xuất: Chương trình Tesla thuê-mua"],
    "No articles yet. Write your first proposal above.": ["还没有文章，在上方写下您的第一个提案吧。", "Todavía no hay artículos. Escribe tu primera propuesta ahí arriba.", "아직 글이 없어요. 위에서 첫 제안을 한번 써 보세요.", "Chưa có bài viết nào. Viết đề xuất đầu tiên của bạn ở phía trên nhé."],
    "Met a customer who needs a ride? Refer them here and drive them yourself, you keep the full fare.": ["遇到需要用车的客户了？在这里推荐一下，自己开车送，整笔车费都是您的。", "¿Te cruzaste con un cliente que necesita un viaje? Recomiéndalo aquí y llévalo tú mismo: te quedas con toda la tarifa.", "차가 필요한 손님을 만나셨어요? 여기서 소개하고 직접 태워 드리면 요금을 전부 가져가실 수 있어요.", "Gặp khách đang cần đi xe? Giới thiệu ngay tại đây rồi tự mình chở, bạn giữ trọn tiền cước nhé."],
    "You're both the agent and the driver on this trip.": ["这一趟，您既是推荐人，也是开车的司机。", "En este viaje eres el agente y el conductor a la vez.", "이번 운행에서는 소개하신 분도, 운전하시는 분도 모두 회원님이에요.", "Chuyến này thì bạn vừa là người giới thiệu, vừa là tài xế luôn."],
    "Normally about $15 of a $75 fare goes to a separate referring agent, but since you referred and drove it, that stays with you. You keep the full fare.": ["一般来说，$75 的车费里大约有 $15 会作为佣金付给推荐人，但这一单是您自己推荐、又自己开的，所以这笔钱也归您。整笔车费都是您的。", "Normalmente, unos $15 de una tarifa de $75 se los lleva el agente que recomendó, pero como esta vez lo recomendaste y lo condujiste tú, ese dinero se queda contigo. Te llevas toda la tarifa.", "보통은 $75 요금 중에서 $15 정도가 소개해 준 에이전트에게 돌아가요. 그런데 이번엔 회원님이 소개도 하고 운전도 직접 하셨으니 그 몫까지 회원님 거예요. 요금을 전부 가져가세요.", "Bình thường, khoảng $15 trong cước $75 sẽ trả cho đại lý giới thiệu, nhưng lần này chính bạn vừa giới thiệu vừa cầm lái, nên khoản đó cũng là của bạn. Bạn giữ trọn tiền cước."],
    "Tax note: the full fare is your income (referral + trip) and is reportable on your 1099. The customer is charged once.": ["税务小提示：整笔车费都算作您的收入（推荐费加上车程），报税时要计入 1099。客户那边只会付一次款。", "Nota sobre impuestos: la tarifa completa cuenta como ingreso tuyo (comisión más viaje) y va en tu 1099. Al cliente solo se le cobra una vez.", "세금 관련 안내예요: 요금 전액이 회원님 소득(소개비 + 운행)으로 잡히고, 1099에 신고하시면 돼요. 손님한테는 딱 한 번만 청구돼요.", "Lưu ý nhỏ về thuế: toàn bộ cước được tính là thu nhập của bạn (hoa hồng cộng chuyến đi) và cần khai vào mẫu 1099. Khách chỉ bị tính tiền đúng một lần thôi."],
    "Upload valid proof of insurance before you can accept rides.": ["接单之前，先上传一份有效的保险证明就好。", "Sube un comprobante de seguro vigente antes de poder aceptar viajes.", "운행을 받으시려면 먼저 유효한 보험 증명을 올려 주세요.", "Bạn tải lên giấy tờ bảo hiểm còn hiệu lực trước khi nhận chuyến nhé."],
    "Valid proof of insurance is required to accept rides. We track your expiry date so your coverage never lapses.": ["接单需要一份有效的保险证明。我们会帮您记着到期日，这样您的保障就不会断掉。", "Para aceptar viajes necesitas un comprobante de seguro vigente. Nosotros llevamos la cuenta de la fecha de vencimiento para que tu cobertura nunca se te venza.", "운행을 받으시려면 유효한 보험 증명이 필요해요. 만료일은 저희가 챙겨서 보장이 끊기지 않도록 해 드려요.", "Để nhận chuyến, bạn cần có giấy tờ bảo hiểm còn hiệu lực. Chúng mình sẽ theo dõi ngày hết hạn giúp bạn để bảo hiểm không bao giờ bị gián đoạn."],
    "Upload your documents, each one is archived and kept on file permanently (nothing is ever overwritten). This is your paper trail.": ["把您的文件上传上来，每一份我们都会归档、永久保存（绝不会覆盖旧的）。这就是属于您的完整记录。", "Sube tus documentos: guardamos cada uno de forma permanente y nunca sobreescribimos nada. Este es tu historial completo.", "서류를 올려 주세요. 파일 하나하나를 보관해서 계속 남겨 두고, 예전 것을 덮어쓰는 일은 없어요. 이게 바로 회원님의 서류 기록이에요.", "Bạn tải giấy tờ lên nhé, mỗi tệp đều được lưu lại và giữ mãi (không bao giờ ghi đè lên bản cũ). Đây là bộ hồ sơ giấy tờ của riêng bạn."],
    "Every driver's archived documents and compliance standing. Click a driver to open their paper trail, then open any document to review it.": ["这里是每位司机的归档文件和合规状况。点开某位司机就能看到他的完整记录，再点开任意一份文件就能查看。", "Aquí tienes los documentos archivados y el estado de cumplimiento de cada conductor. Haz clic en un conductor para abrir su historial y luego abre cualquier documento para revisarlo.", "운전자마다 보관된 서류와 규정 준수 상태를 볼 수 있어요. 운전자를 눌러 서류 기록을 열고, 문서를 하나씩 눌러 확인해 보세요.", "Đây là tài liệu lưu trữ và tình trạng tuân thủ của từng tài xế. Nhấp vào một tài xế để mở hồ sơ của họ, rồi mở bất kỳ tài liệu nào để xem."],
    "Your standing against the Driver Agreement. The system flags issues automatically, and anything logged by dispatch appears here too. Clear all issues to keep accepting rides.": ["这是您对照《司机协议》的合规状况。系统会自动标出问题，调度中心记录的任何情况也会显示在这里。把所有问题处理好，就能继续接单啦。", "Cómo estás respecto al Acuerdo del conductor. El sistema detecta los problemas solo, y todo lo que anote la central también aparece aquí. Resuelve todos los pendientes para seguir aceptando viajes.", "운전자 계약서에 견줘 지금 어떤 상태인지 보여 드려요. 시스템이 문제를 알아서 표시하고, 배차팀이 기록한 내용도 여기에 함께 떠요. 계속 운행을 받으시려면 문제를 모두 해결해 주세요.", "Đây là tình trạng của bạn so với Thỏa thuận tài xế. Hệ thống tự gắn cờ những vấn đề, và mọi ghi nhận từ bên điều phối cũng hiện ở đây. Bạn xử lý xong hết các vấn đề là lại nhận chuyến bình thường nhé."],
    "What the free guide is proving · the page to show an affiliate programme": ["免费指南正在证明什么 · 可以拿给联盟计划看的页面", "Lo que demuestra la guía gratuita · la página para mostrarle a un programa de afiliados", "무료 가이드가 보여 주고 있는 것 · 제휴 프로그램에 내밀 수 있는 페이지", "Điều mà cẩm nang miễn phí đang chứng minh · trang để đưa cho một chương trình liên kết xem"],
    "Scout: find organizations worth calling, from the map, each with a way to reach them. Everything found lands as": ["探路：在地图上帮您找出值得打电话的机构，每一家都附上联系方式。找到的都会先归到", "Explorador: te encuentra en el mapa las organizaciones que vale la pena llamar, cada una con su forma de contacto. Todo lo que aparece queda como", "스카우트: 지도에서 전화해 볼 만한 곳을 찾아 드려요. 다들 연락할 방법이 있고, 찾은 곳은 전부 다음 상태로 들어가요", "Trinh sát: giúp bạn tìm trên bản đồ những tổ chức đáng gọi, nơi nào cũng có cách liên hệ. Tất cả tìm được sẽ nằm ở trạng thái"],
    ", nobody is contacted here.": ["，在这里我们不会替您联系任何人。", ", aquí no contactamos a nadie.", ", 여기서는 아무에게도 연락하지 않아요.", ", ở đây chưa liên hệ với ai cả."],
    "A schematic indoor map of the Metropolitan Museum. Tap the rooms you want, and footprints walk the route between them with honest times.": ["这是一张大都会博物馆的室内示意图。点一下您想去的展厅，脚印就会沿着展厅之间的路线走一遍，还会老老实实告诉您要花多少时间。", "Un plano esquemático del interior del Museo Metropolitano. Toca las salas que quieras y unas huellas recorren la ruta entre ellas, con tiempos honestos.", "메트로폴리탄 미술관의 실내 지도예요. 가 보고 싶은 전시실을 누르면 발자국이 그 사이를 따라 걸으면서 실제 걸리는 시간을 솔직하게 알려 줘요.", "Đây là sơ đồ bên trong bảo tàng Metropolitan. Bạn chạm vào những phòng mình muốn xem, rồi những dấu chân sẽ đi theo lộ trình giữa các phòng, kèm thời gian thật lòng."],
    "Automated trading research, on paper trades only. Nothing here connects to an exchange, holds a key, or touches a balance. Access is issued directly and nothing is for sale.": ["这是自动化交易的研究，全程只做模拟交易。这里不会连接任何交易所，不会保存任何密钥，也不会碰到任何余额。访问权限由我们直接发放，什么都不出售。", "Investigación de trading automatizado, solo con operaciones simuladas. Aquí nada se conecta a un mercado, ni guarda una clave, ni toca un saldo. El acceso lo damos nosotros directamente y no hay nada a la venta.", "자동 매매를 연구하는 곳이고, 전부 모의 거래로만 돌아가요. 여기 있는 어떤 것도 거래소에 연결되지 않고, 키를 보관하지도, 잔고를 건드리지도 않아요. 접근 권한은 저희가 직접 드리고, 파는 건 아무것도 없어요.", "Đây là nghiên cứu giao dịch tự động, hoàn toàn chỉ trên giao dịch giả lập. Không có gì ở đây kết nối với sàn, giữ khóa hay đụng vào số dư cả. Quyền truy cập do chúng mình cấp trực tiếp, và không bán thứ gì hết."],
    "An idea we are testing with our own money: trading rules that run on their own, with anything they earn going against expensive debt instead of back into the market. It is not finished and it is not for sale.": ["这是我们正在用自己的钱验证的一个想法：让一套交易规则自动运行，赚到的钱拿去偿还高息债务，而不是再投回市场。它还没完成，也不对外出售。", "Una idea que estamos probando con nuestro propio dinero: reglas de trading que funcionan solas, y lo que ganan va a pagar deuda cara en vez de volver al mercado. Todavía no está terminada y no está a la venta.", "저희 돈으로 직접 시험해 보는 아이디어예요. 스스로 돌아가는 매매 규칙이 번 돈을 시장에 다시 넣는 대신 비싼 빚을 갚는 데 써요. 아직 완성된 건 아니고, 판매하지도 않아요.", "Một ý tưởng chúng mình đang thử bằng chính tiền của mình: các quy tắc giao dịch tự chạy, tiền kiếm được đem trả khoản nợ lãi cao thay vì quay lại thị trường. Nó vẫn chưa hoàn thiện và không rao bán."],
    "A set of trading rules runs for a fixed window": ["一组交易规则在固定的一段时间里运行", "Un conjunto de reglas de trading funciona durante un periodo fijo", "매매 규칙 한 세트가 정해진 기간 동안 돌아가요", "Một bộ quy tắc giao dịch chạy trong một quãng thời gian cố định"],
    "Anything earned is set aside rather than traded again": ["赚到的钱会被留存下来，而不是再拿去交易", "Lo que se gana se aparta, en vez de volver a operarlo", "번 돈은 다시 거래에 넣지 않고 따로 떼어 둬요", "Tiền kiếm được sẽ để riêng ra, chứ không đem giao dịch tiếp"],
    "The balance comes back, and it can come back smaller, because trading loses as well as wins": ["本金会回来，不过也可能变少，因为交易有赚也有亏", "El saldo vuelve, y puede volver más chico, porque en el trading tanto se gana como se pierde", "잔고는 돌아오지만, 더 적게 돌아올 수도 있어요. 매매는 이길 때도 있고 질 때도 있으니까요", "Số dư sẽ quay về, mà cũng có thể ít hơn lúc đầu, vì giao dịch có lúc thắng thì cũng có lúc thua"],
    "No price, no trial, no enrolment. Nothing on this page can take a payment, and the billing behind it is closed.": ["没有价格，没有试用，也不用报名。这个页面收不了任何款项，背后的计费通道也是关着的。", "Sin precio, sin prueba, sin inscripción. En esta página nada puede cobrarte, y la parte de facturación que hay detrás está cerrada.", "가격도, 체험판도, 가입 절차도 없어요. 이 페이지에서는 어떤 결제도 일어날 수 없고, 뒤에 있는 결제 시스템도 닫혀 있어요.", "Không giá bán, không dùng thử, không ghi danh. Trên trang này chẳng có gì thu tiền của bạn được, và hệ thống thanh toán phía sau cũng đã đóng."],
    "We are not showing a return figure, because none has been earned. A number written down before it is earned is a promise.": ["我们没有列出任何收益数字，因为还没真的赚到。钱还没到手就先写下的数字，充其量只是一句承诺。", "No mostramos ninguna cifra de rentabilidad, porque todavía no se ha ganado nada. Un número que se escribe antes de ganarlo es solo una promesa.", "수익 숫자는 보여 드리지 않아요. 아직 실제로 번 게 없거든요. 벌기도 전에 적어 둔 숫자는 그저 약속일 뿐이니까요.", "Chúng mình không đưa ra con số lợi nhuận nào, vì thật sự chưa kiếm được đồng nào cả. Con số viết ra trước khi kiếm được thì cũng chỉ là một lời hứa thôi."],
    "It runs on ours, not anyone else's, until it is proven and the legal structure is right.": ["在它得到验证、法律架构也理顺之前，它只用我们自己的钱运行，不动用别人的一分钱。", "Funciona con nuestro dinero, no con el de nadie más, hasta que esté probado y la estructura legal sea la adecuada.", "검증이 끝나고 법적 구조가 제대로 갖춰질 때까지는, 다른 누구의 돈도 아닌 저희 돈으로만 돌려요.", "Nó chạy bằng tiền của chúng mình, không phải của bất kỳ ai khác, cho tới khi được chứng minh và khung pháp lý thật chỉn chu."],
    "Automated trading can and does lose money, and a balance that has been traded can come back smaller than it went in. Nothing here is an offer to sell or a solicitation to buy any security or investment product, and nothing here is investment, legal or tax advice.": ["自动化交易可能亏钱，事实上也确实会亏；参与过交易的本金，回来时可能比投进去时更少。这里的内容并不构成任何证券或投资产品的出售要约或购买邀约，也不构成投资、法律或税务方面的建议。", "El trading automatizado puede perder dinero, y de hecho lo pierde; un saldo con el que se ha operado puede volver más pequeño de lo que entró. Nada de lo que ves aquí es una oferta de venta ni una invitación a comprar ningún valor o producto de inversión, y nada de esto es asesoramiento de inversión, legal ni fiscal.", "자동 매매는 돈을 잃을 수 있고, 실제로 잃기도 해요. 거래에 들어간 잔고가 처음보다 적게 돌아올 수도 있고요. 여기 있는 어떤 내용도 증권이나 투자 상품을 팔겠다는 제안이나 사라는 권유가 아니고, 투자, 법률, 세무 조언도 아니에요.", "Giao dịch tự động có thể làm mất tiền, và thực tế là có mất; số dư đã đem đi giao dịch có thể quay về ít hơn lúc bỏ vào. Không có gì ở đây là lời chào bán hay mời mua bất kỳ chứng khoán hay sản phẩm đầu tư nào, và cũng không có gì là tư vấn đầu tư, pháp lý hay thuế cả."],
    "Want this to exist? Leave your email and we will tell you if it ever becomes real.": ["希望它成真吗？留个邮箱给我们，等它真的落地了，第一时间通知您。", "¿Te gustaría que esto existiera? Déjanos tu correo y te avisamos si algún día se hace realidad.", "이게 실현되면 좋겠다 싶으세요? 이메일을 남겨 주시면 진짜로 이루어졌을 때 바로 알려 드릴게요.", "Muốn điều này thành hiện thực chứ? Để lại email nhé, khi nào nó thành thật chúng mình sẽ báo cho bạn ngay."],
    "Fills your name and email. Nothing is stored.": ["帮您自动填好姓名和邮箱，什么都不会保存。", "Rellena tu nombre y tu correo. No guardamos nada.", "이름과 이메일을 대신 채워 드려요. 아무것도 저장하지 않아요.", "Tự điền sẵn tên và email cho bạn. Không lưu lại gì cả nhé."],
    "Keep the team out of the visitor numbers. Signing in here already stops this browser being counted, the rest is for your other devices, and for anyone on the team without a dispatch login.": ["把团队成员从访客数字里排除掉。您在这里登录后，这个浏览器就不会再被计入了；其余选项是留给您的其他设备，以及团队里没有调度登录账号的人用的。", "Deja a tu equipo fuera de las cifras de visitantes. Con solo iniciar sesión aquí, este navegador ya deja de contarse; el resto es para tus otros dispositivos y para quien en el equipo no tenga acceso al panel.", "팀원은 방문자 수에서 빼 두세요. 여기서 로그인만 하셔도 이 브라우저는 더 이상 집계되지 않아요. 나머지는 다른 기기용, 그리고 대시보드 로그인이 없는 팀원을 위한 거예요.", "Giữ cả đội ra ngoài số liệu khách truy cập nhé. Chỉ cần đăng nhập ở đây là trình duyệt này đã không bị đếm nữa; phần còn lại dành cho các thiết bị khác của bạn và những ai trong đội chưa có tài khoản điều phối."],
    "Send them this. One tap on the phone, no login, nothing installed. It works for drivers, agents, family, anyone whose visits should not read as a customer's.": ["把这个发给他们就行。在手机上点一下即可，不用登录，也不用安装。司机、代理、家人都能用，任何不应该被算作客户访问的人都适用。", "Mándales esto. Un toque en el teléfono, sin iniciar sesión y sin instalar nada. Sirve para conductores, agentes y familia: cualquiera cuyas visitas no deberían contar como las de un cliente.", "이걸 보내 주시면 돼요. 휴대폰에서 한 번만 누르면 되고, 로그인도 설치도 필요 없어요. 기사님, 에이전트, 가족처럼 고객 방문으로 잡히면 안 되는 분이라면 누구나 쓸 수 있어요.", "Gửi cho họ đường dẫn này nhé. Chỉ cần chạm một lần trên điện thoại, không phải đăng nhập, không cài đặt gì. Dùng được cho tài xế, đại lý, người nhà, bất kỳ ai mà lượt truy cập không nên bị tính như của khách hàng."],
    "If this is your licence, any idea above is work you can answer once and sell to everyone who needs the same answer. You set the price and keep most of it.": ["如果这正好是您持有的执照，那上面的每一个想法对您来说，都是只要回答一次、就能卖给所有需要同一个答案的人的活儿。价格由您来定，大部分收入都归您。", "Si esta es tu licencia, cualquiera de las ideas de arriba es trabajo que respondes una sola vez y le vendes a todo el que necesite esa misma respuesta. Tú pones el precio y te quedas con la mayor parte.", "이 면허를 갖고 계시다면, 위에 있는 아이디어들은 한 번만 답을 만들어 두고 같은 답이 필요한 모든 분께 팔 수 있는 일이에요. 가격은 직접 정하시고, 수익의 대부분을 가져가세요.", "Nếu đây đúng là giấy phép của bạn thì mỗi ý tưởng ở trên là một công việc bạn chỉ cần trả lời một lần rồi bán cho tất cả những ai cần cùng câu trả lời đó. Bạn tự đặt giá và giữ lại phần lớn."],
    "No trades yet. The first idea posted will name some.": ["还没有工种。等第一个想法发布出来，就会带出一些了。", "Todavía no hay oficios. La primera idea que se publique irá nombrando algunos.", "아직 직종이 없어요. 첫 아이디어가 올라오면 몇 가지가 나올 거예요.", "Chưa có ngành nghề nào cả. Ý tưởng đầu tiên được đăng lên sẽ gọi tên vài ngành."],
    "A launchpad for someone with an idea and no company yet. You post what you want to build; the board works out which professionals it will take; those professionals publish an opinion you can buy.": ["这是给那些有想法、但公司还没成立的人准备的起点。您把想做的事发上来，平台会帮您理出需要哪些专业人士，这些专业人士再发布可以购买的专业意见。", "Un punto de partida para quien tiene una idea pero todavía no tiene empresa. Publicas lo que quieres construir; el tablero descubre qué profesionales harán falta; y esos profesionales publican una opinión que puedes comprar.", "아이디어는 있는데 아직 회사는 없는 분을 위한 출발점이에요. 만들고 싶은 걸 올리시면 게시판이 어떤 전문가가 필요할지 짚어 주고, 그 전문가들이 사실 수 있는 의견을 올려 줘요.", "Một bệ phóng cho người đã có ý tưởng nhưng chưa có công ty. Bạn đăng điều mình muốn xây dựng, bảng tin sẽ tìm ra cần những chuyên gia nào, rồi các chuyên gia đó đăng ý kiến để bạn có thể mua."],
    "Free, and no account. You decide how much of it is public.": ["免费，也不用注册账户。要公开多少，由您自己决定。", "Gratis y sin cuenta. Tú decides qué parte se hace pública.", "무료이고 계정도 필요 없어요. 어디까지 공개할지는 직접 정하시면 돼요.", "Miễn phí, không cần tài khoản. Công khai đến đâu là do bạn quyết định."],
    "The board reads it for the trades it needs": ["平台会从中读出需要哪些专业工种", "El tablero lo lee para ver qué oficios harán falta", "게시판이 필요한 직종을 읽어 내요", "Bảng tin đọc qua để nhận ra những ngành nghề cần đến"],
    "The attorney, the accountant, the contractor, the licence nobody mentioned. Each suggestion shows the words that prompted it, so you can see when it has guessed wrong.": ["律师、会计师、承包商，还有那张谁都没提起过的执照。每条建议都会把触发它的原话标出来，所以它要是猜错了，您一眼就能看出来。", "El abogado, el contador, el contratista, la licencia que nadie mencionó. Cada sugerencia te muestra las palabras que la dispararon, así ves enseguida cuándo se equivocó.", "변호사, 회계사, 시공업체, 그리고 아무도 얘기하지 않았던 인허가까지요. 제안마다 그걸 불러온 문구를 같이 보여 주니까, 잘못 짚은 경우엔 바로 눈에 띄어요.", "Luật sư, kế toán, nhà thầu, và cả cái giấy phép chẳng ai nhắc tới. Mỗi gợi ý đều cho thấy những từ đã làm nó bật lên, nên khi nó đoán sai là bạn nhận ra ngay."],
    "A professional publishes an opinion, at their own price": ["专业人士发布意见，价格由自己定", "Un profesional publica una opinión, al precio que él mismo pone", "전문가가 직접 정한 가격으로 의견을 올려요", "Chuyên gia đăng ý kiến, với mức giá do chính họ đặt ra"],
    "Written once and sold as many times as it is worth buying. The professional sets the price and keeps most of what it earns.": ["只需写一次，只要还有人愿意买，就能一次次卖出去。价格由专业人士自己定，赚到的大部分都归他们。", "Se escribe una vez y se vende tantas veces como valga la pena comprarlo. El profesional pone el precio y se queda con la mayor parte de lo que gana.", "한 번만 써 두면, 살 만한 가치가 있는 한 몇 번이든 팔려요. 가격은 전문가가 정하고, 번 돈의 대부분을 가져가요.", "Viết một lần rồi bán được bao nhiêu lần là tùy vào giá trị của nó. Chuyên gia tự đặt giá và giữ phần lớn khoản thu về."],
    "Built from what people actually post here, not from a list somebody wrote in advance.": ["这些是从大家在这里真正发布的内容里生成的，而不是照着一份事先拟好的名单来的。", "Se arma con lo que la gente publica de verdad aquí, no con una lista escrita de antemano.", "미리 만들어 둔 목록이 아니라, 사람들이 여기에 실제로 올린 내용에서 만들어져요.", "Được dựng từ những gì mọi người thật sự đăng ở đây, chứ không phải từ một danh sách viết sẵn."],
    "Are you a licensed professional?": ["您是持证的专业人士吗？", "¿Eres un profesional con licencia?", "면허를 가진 전문가이신가요?", "Bạn là chuyên gia có giấy phép hành nghề đúng không?"],
    "Publish once, and be paid every time it sells. Your licence is checked by hand before anything you write goes public.": ["只需发布一次，之后每卖出一次都能拿到报酬。在您写的内容公开之前，我们会人工帮您核验执照。", "Publica una vez y cobra cada vez que se venda. Revisamos tu licencia a mano antes de que salga a la luz nada de lo que escribas.", "한 번만 올리면 팔릴 때마다 보수를 받아요. 작성하신 내용이 공개되기 전에, 저희가 면허를 직접 하나하나 확인해 드려요.", "Đăng một lần rồi cứ mỗi lần bán được là bạn lại được trả tiền. Giấy phép của bạn sẽ được kiểm tra thủ công trước khi bất cứ điều gì bạn viết được công khai."],
    "At your service. Add any place, search above or tap a pin, and I’ll build your day sheet: miles, drive time, arrival, stay and closing time.": ["随时为您效劳。您可以在上方搜索，或点一下地图上的图钉，来添加任意地点，我就会帮您排好一天的行程表：里程、车程、到达时间、停留时长，还有关门时间。", "Estoy para ayudarte. Añade cualquier lugar, búscalo arriba o toca un pin en el mapa, y te armo la hoja del día: millas, tiempo de conducción, hora de llegada, cuánto te quedas y a qué hora cierra.", "무엇이든 도와드릴게요. 위에서 검색하시거나 지도의 핀을 눌러 장소를 추가하시면, 하루 일정표를 뚝딱 만들어 드려요. 거리, 주행 시간, 도착 시각, 머무는 시간, 문 닫는 시간까지요.", "Mình luôn sẵn sàng giúp bạn. Cứ thêm bất kỳ địa điểm nào, tìm ở trên hoặc chạm vào ghim trên bản đồ, là mình sẽ lập cho bạn bảng hành trình trong ngày: quãng đường, thời gian lái, giờ đến, thời gian dừng chân và giờ đóng cửa."],
    "I’m <b>Jarvis</b>. Add any place, search above or tap a pin, and I’ll build your day sheet.": ["我是 <b>Jarvis</b>。在上方搜索一下，或点一下地图上的图钉，就能添加地点，我会帮您排好一天的行程表。", "Soy <b>Jarvis</b>. Añade cualquier lugar, búscalo arriba o toca un pin, y te preparo la hoja del día.", "저는 <b>Jarvis</b>예요. 위에서 검색하시거나 핀을 눌러 장소를 추가하시면, 하루 일정표를 만들어 드릴게요.", "Mình là <b>Jarvis</b>. Bạn thêm địa điểm, tìm ở trên hoặc chạm vào ghim, là mình sẽ lập bảng hành trình trong ngày cho bạn."],
    "One traveler planned a trip here this week": ["本周有一位旅客在这里规划了行程", "Esta semana, un viajero planeó un viaje aquí", "이번 주에 여행자 한 분이 여기서 여행을 계획했어요", "Tuần này có một du khách lên kế hoạch chuyến đi ở đây"],
    "{n} travelers planned a trip here this week": ["本周已经有 {n} 位旅客在这里规划了自己的行程", "Esta semana, {n} viajeros ya armaron su viaje aquí", "이번 주에 {n}명이 여기서 여행을 계획했어요", "Tuần này đã có {n} du khách lên kế hoạch chuyến đi ngay tại đây"],
    "$75 to Sea, Tac from anywhere within 30 miles, quoted before you book. Drivers rent our cars and keep the fare, hotels and agents earn commission for sending riders, and the trip-planning tools are free to anyone. Below: the three businesses that income is building, and where each one stands today.": ["30 英里内到西雅图-塔科马国际机场，固定价 75 美元，预订前就把价格告诉您。司机租用我们的车，车费全归自己；酒店和代理商帮我们带来乘客，就能拿到佣金；行程规划工具则对所有人免费开放。这笔收入正在支持三项业务，往下看看它们各自现在走到了哪一步。", "75 $ al Sea, Tac desde cualquier punto dentro de 30 millas, y te decimos el precio antes de que reserves. Los conductores alquilan nuestros coches y se quedan con toda la tarifa, los hoteles y agentes ganan comisión por mandarnos pasajeros, y las herramientas para planear el viaje son gratis para cualquiera. Aquí abajo tienes los tres negocios que ese ingreso está levantando, y en qué punto está cada uno hoy.", "30마일 안이라면 어디서든 시택 공항까지 75달러, 예약하기 전에 요금을 미리 알려드려요. 기사님은 저희 차를 빌려 요금을 전부 가져가시고, 호텔과 에이전트는 손님을 연결해 주시면 수수료를 받으세요. 여행 계획 도구는 누구나 무료로 쓸 수 있고요. 이 수익으로 키워 가는 세 가지 사업과 각각 지금 어디쯤 와 있는지, 아래에서 확인해 보세요.", "75 USD tới sân bay Sea, Tac từ bất kỳ đâu trong bán kính 30 dặm, và chúng mình báo giá trước khi bạn đặt. Tài xế thuê xe của chúng mình rồi giữ trọn tiền cước, khách sạn và đại lý giới thiệu khách thì nhận hoa hồng, còn các công cụ lên kế hoạch chuyến đi thì miễn phí cho mọi người. Bên dưới là ba mảng kinh doanh mà nguồn thu này đang gây dựng, cùng chỗ đứng hiện tại của từng mảng."],
    "Fixed-price Tesla rides at $75 to Sea, Tac from within 30 miles, cars rented to drivers who keep the fare, and commission for hotels and agents who send us riders. This is where the money comes from.": ["特斯拉专车固定价，30 英里内到机场 75 美元；车子租给司机，车费全归他们；酒店和代理商帮我们带来乘客，就有佣金可拿。我们的收入就来自这里。", "Viajes en Tesla a precio fijo, 75 $ al Sea, Tac desde 30 millas a la redonda; alquilamos los coches a los conductores y ellos se quedan con la tarifa; y damos comisión a hoteles y agentes que nos mandan pasajeros. De aquí viene el dinero.", "테슬라 정액 요금, 30마일 안에서 시택 공항까지 75달러예요. 차는 기사님께 빌려드리고 요금은 그대로 기사님 몫이고요, 손님을 연결해 주는 호텔과 에이전트에는 수수료를 드려요. 저희 수익은 바로 여기서 나와요.", "Xe Tesla giá cố định, 75 USD tới sân bay Sea, Tac trong bán kính 30 dặm; xe cho tài xế thuê và họ giữ trọn tiền cước; còn khách sạn với đại lý giới thiệu khách thì có hoa hồng. Nguồn thu của chúng mình đến từ đây."],
    "Book a ride, $75 flat to Sea, Tac within 30 mi": ["预约用车，30 英里内到机场固定价 75 美元", "Reserva tu viaje, 75 $ fijos al Sea, Tac en 30 mi", "차량 예약하기, 30마일 이내 시택 공항 75달러 정액", "Đặt xe, 75 USD cố định tới Sea, Tac trong 30 dặm"],
    "flat to Sea, Tac, from anywhere within 30 miles": ["30 英里内到机场，一律固定价", "fijos al Sea, Tac, desde donde estés dentro de 30 millas", "30마일 안이라면 어디서든 시택 공항까지 정액", "cố định tới Sea, Tac, từ bất cứ đâu trong 30 dặm"],
    "Flat airport fare, {miles} miles, inside the {radius}-mile flat-rate area. This is the price; it does not move.": ["机场固定价，{miles} 英里，就在 {radius} 英里固定价范围内。价格就是这个，不会再变。", "Tarifa fija al aeropuerto, {miles} millas, dentro de la zona de {radius} millas. Este es el precio y no se mueve.", "공항 정액 요금, {miles}마일, {radius}마일 정액 구간 안이에요. 이 금액 그대로이고 바뀌지 않아요.", "Giá cố định tới sân bay, {miles} dặm, nằm trong vùng {radius} dặm. Đây là giá cuối, không đổi đâu nhé."],
    "About {miles} miles. Estimated from the road distance, we confirm the exact fare before you pay, and it does not change after that.": ["大约 {miles} 英里。这是按路程估算的，付款前我们会跟您确认准确金额，确认之后就不会再变。", "Unas {miles} millas. Es un cálculo según la distancia por carretera; confirmamos la tarifa exacta antes de que pagues, y después ya no cambia.", "약 {miles}마일이에요. 도로 거리로 어림한 값이고, 결제 전에 정확한 요금을 확인해 드려요. 그 뒤로는 바뀌지 않아요.", "Khoảng {miles} dặm. Đây là ước tính theo quãng đường, chúng mình sẽ xác nhận giá chính xác trước khi bạn thanh toán, và sau đó không thay đổi nữa."],
    "Could not measure that route automatically, send the request and we will quote it before you pay.": ["这条路线没法自动测算，先把预约提交过来，我们会在付款前给您报价。", "No pudimos medir esa ruta automáticamente; envíanos la solicitud y te damos el precio antes de que pagues.", "이 경로는 자동으로 계산하지 못했어요. 요청을 보내 주시면 결제 전에 요금을 알려드릴게요.", "Tuyến này chưa đo tự động được, bạn gửi yêu cầu nhé, chúng mình sẽ báo giá trước khi bạn thanh toán."],
    "FRONT ELEVATION · 1:200 @ A3 · NOT FOR CONSTRUCTION": ["正立面图 · 1:200 @ A3 · 非施工用图", "ALZADO FRONTAL · 1:200 @ A3 · NO ES PARA CONSTRUCCIÓN", "정면도 · 1:200 @ A3 · 시공용 아님", "MẶT ĐỨNG CHÍNH · 1:200 @ A3 · KHÔNG DÙNG ĐỂ THI CÔNG"],
    "From the start to {to} in, {len} with no mapped stop": ["从出发到 {to} 这一段，有 {len} 的路程都没有已知的停靠点", "Desde la salida hasta {to}, hay {len} sin ninguna parada en el mapa", "출발부터 {to} 지점까지, {len} 구간에는 표시된 정차 지점이 없어요", "Từ lúc khởi hành đến {to}, có {len} không có điểm dừng nào trên bản đồ"],
    "{from} to {to} in, {len} with no mapped stop": ["从 {from} 到 {to} 这一段，有 {len} 的路程都没有已知的停靠点", "De {from} a {to}, hay {len} sin ninguna parada en el mapa", "{from}부터 {to} 지점까지, {len} 구간에는 표시된 정차 지점이 없어요", "Từ {from} đến {to}, có {len} không có điểm dừng nào trên bản đồ"],
    "Searched again wider and found nothing. Fill up and stop before these.": ["我们把范围扩大又找了一遍，还是什么都没有。进入这几段之前，记得先加满油、歇一歇。", "Buscamos otra vez en un radio más amplio y no encontramos nada. Llena el tanque y descansa antes de estos tramos.", "범위를 더 넓혀 다시 찾아봤지만 아무것도 없었어요. 이 구간에 들어서기 전에 미리 기름 채우고 한숨 돌리세요.", "Chúng mình đã tìm lại với phạm vi rộng hơn nhưng không thấy gì. Bạn nhớ đổ đầy bình và nghỉ một chút trước các đoạn này nhé."],
    "Located to about {n} m. Edit it if the door is round the back.": ["已经定位到大约 {n} 米范围内。如果入口在后面，改一下地址就好。", "Te ubicamos con unos {n} m de precisión. Corrígelo si la entrada está por detrás.", "약 {n} m 정도까지 위치를 잡았어요. 출입구가 뒤쪽이라면 주소를 살짝 고쳐 주세요.", "Đã định vị trong khoảng {n} m. Nếu cửa ở phía sau thì bạn sửa lại chút nhé."],
    "Located. Edit it if the door is round the back.": ["定位好了。如果入口在后面，改一下地址就好。", "Listo, ya te ubicamos. Corrígelo si la entrada está por detrás.", "위치를 찾았어요. 출입구가 뒤쪽이라면 주소를 살짝 고쳐 주세요.", "Đã tìm được vị trí. Nếu cửa ở phía sau thì bạn sửa lại chút nhé."],
    "Got your position but not a street address, the coordinates are in the box, and your driver can navigate to them.": ["找到您的位置了，只是没解析出具体街道地址。坐标已经填好，司机照着导航就能找到您。", "Tenemos tu ubicación pero no una dirección con calle; las coordenadas ya están en el campo y tu conductor puede llegar guiándose por ellas.", "위치는 찾았는데 도로명 주소까지는 나오지 않았어요. 좌표를 입력해 뒀으니 기사님이 그대로 찾아갈 수 있어요.", "Đã có vị trí của bạn nhưng chưa ra địa chỉ đường phố. Tọa độ đã điền sẵn rồi, tài xế cứ theo đó là tới nơi."],
    "Location permission was declined. Please type the pickup address.": ["定位权限被拒绝了，麻烦您手动输入上车地址。", "No se dio permiso de ubicación. Escribe la dirección de recogida, por favor.", "위치 권한이 거부됐어요. 타실 곳 주소를 직접 입력해 주세요.", "Quyền vị trí đã bị từ chối. Bạn nhập giúp địa chỉ đón nhé."],
    "Could not get a location right now. Please type the pickup address.": ["现在暂时定位不了，麻烦您手动输入上车地址。", "Ahora mismo no pudimos obtener la ubicación. Escribe la dirección de recogida, por favor.", "지금은 위치를 가져오지 못했어요. 타실 곳 주소를 직접 입력해 주세요.", "Hiện chưa lấy được vị trí. Bạn nhập giúp địa chỉ đón nhé."],
    "This browser cannot share a location. Please type the address.": ["这个浏览器没法共享位置，麻烦您手动输入地址。", "Este navegador no puede compartir la ubicación. Escribe la dirección, por favor.", "이 브라우저에서는 위치를 공유할 수 없어요. 주소를 직접 입력해 주세요.", "Trình duyệt này không chia sẻ được vị trí. Bạn nhập giúp địa chỉ nhé."],
    "Finding charging stations along the route…": ["正在沿途帮您找充电站…", "Buscando estaciones de carga en tu ruta…", "경로를 따라 충전소를 찾고 있어요…", "Đang tìm trạm sạc dọc đường cho bạn…"],
    "{n} stations · {w} have food, coffee or a toilet within a 5-minute walk": ["共 {n} 处充电站 · 其中 {w} 处步行 5 分钟就能找到吃的、咖啡或洗手间", "{n} estaciones · en {w} tienes comida, café o baño a menos de 5 minutos a pie", "충전소 {n}곳 · 그중 {w}곳은 걸어서 5분 안에 먹을거리나 커피, 화장실이 있어요", "{n} trạm · {w} trạm có đồ ăn, cà phê hay nhà vệ sinh chỉ cách 5 phút đi bộ"],
    "A Seattle car service that funds what comes next": ["一家西雅图用车服务，用它的收入去支持接下来要做的事", "Un servicio de coches en Seattle que financia lo que viene después", "다음에 할 일을 뒷받침하는 시애틀 차량 서비스", "Một dịch vụ xe ở Seattle, dùng nguồn thu để nuôi những việc tiếp theo"],
    "$75 to Sea, Tac, quoted before you book. Drivers rent our cars and keep the fare, hotels and agents earn commission for sending riders, and the trip-planning tools are free to anyone. Below: the three businesses that income is building, and where each one stands today.": ["到西雅图-塔科马国际机场，固定价 75 美元，预订前就把价格告诉您。司机租我们的车，车费全归自己；酒店和代理商帮我们带来乘客，就能拿到佣金；行程规划工具则对所有人免费开放。这笔收入正在支持三项业务，往下看看它们各自现在走到了哪一步。", "75 $ al Sea, Tac, y te decimos el precio antes de que reserves. Los conductores alquilan nuestros coches y se quedan con toda la tarifa, los hoteles y agentes ganan comisión por mandarnos pasajeros, y las herramientas para planear el viaje son gratis para cualquiera. Aquí abajo tienes los tres negocios que ese ingreso está levantando, y en qué punto está cada uno hoy.", "시택 공항까지 75달러, 예약하기 전에 요금을 미리 알려드려요. 기사님은 저희 차를 빌려 요금을 전부 가져가시고, 호텔과 에이전트는 손님을 연결해 주시면 수수료를 받으세요. 여행 계획 도구는 누구나 무료로 쓸 수 있고요. 이 수익으로 키워 가는 세 가지 사업과 각각 지금 어디쯤 와 있는지, 아래에서 확인해 보세요.", "75 USD tới sân bay Sea, Tac, và chúng mình báo giá trước khi bạn đặt. Tài xế thuê xe của chúng mình rồi giữ trọn tiền cước, khách sạn và đại lý giới thiệu khách thì nhận hoa hồng, còn các công cụ lên kế hoạch chuyến đi thì miễn phí cho mọi người. Bên dưới là ba mảng kinh doanh mà nguồn thu này đang gây dựng, cùng chỗ đứng hiện tại của từng mảng."],
    "One pays for the next. Here is where each one stands today.": ["前一项的收入支持下一项。下面就是每项业务现在的进展。", "Uno paga al siguiente. Aquí tienes en qué punto está cada uno hoy.", "하나가 다음을 뒷받침해요. 각 사업이 지금 어디까지 왔는지 아래에 정리했어요.", "Mảng này nuôi mảng kế tiếp. Dưới đây là chỗ đứng hiện tại của từng mảng."],
    "Fixed-price Tesla rides at $75 to Sea, Tac, cars rented to drivers who keep the fare, and commission for hotels and agents who send us riders. This is where the money comes from.": ["特斯拉专车固定价，到机场 75 美元；车子租给司机，车费全归他们；酒店和代理商帮我们带来乘客，就有佣金可拿。我们的收入就来自这里。", "Viajes en Tesla a precio fijo, 75 $ al Sea, Tac; alquilamos los coches a los conductores y ellos se quedan con la tarifa; y damos comisión a hoteles y agentes que nos mandan pasajeros. De aquí viene el dinero.", "테슬라 정액 요금, 시택 공항까지 75달러예요. 차는 기사님께 빌려드리고 요금은 그대로 기사님 몫이고요, 손님을 연결해 주는 호텔과 에이전트에는 수수료를 드려요. 저희 수익은 바로 여기서 나와요.", "Xe Tesla giá cố định, 75 USD tới sân bay Sea, Tac; xe cho tài xế thuê và họ giữ trọn tiền cước; còn khách sạn với đại lý giới thiệu khách thì có hoa hồng. Nguồn thu của chúng mình đến từ đây."],
    "Dispatch, invoicing, driver paperwork, and the trip-planning tools. We built them instead of renting them, so the customer and the data stay here.": ["调度、开票、司机文件，还有行程规划工具，这些都是我们自己做的，没有去租现成的。这样一来，客户和数据都留在我们自己手里。", "El despacho, la facturación, el papeleo de los conductores y las herramientas para planear el viaje. Los hicimos nosotros en vez de alquilarlos, así el cliente y los datos se quedan con nosotros.", "배차, 청구, 기사 서류, 그리고 여행 계획 도구까지, 빌려 쓰지 않고 저희가 직접 만들었어요. 그래서 고객도 데이터도 저희 안에 그대로 남아요.", "Điều phối, xuất hóa đơn, giấy tờ tài xế và cả công cụ lên kế hoạch chuyến đi. Chúng mình tự làm thay vì đi thuê, nhờ vậy khách hàng và dữ liệu đều ở lại với chúng mình."],
    "A mixed-use building, still on paper. The drawings are published as they stand.": ["一栋综合用途的建筑，目前还停留在图纸上。设计图是什么样，我们就照原样公开。", "Un edificio de uso mixto, todavía sobre el papel. Publicamos los planos tal como están.", "복합 용도 건물인데, 아직 도면 단계예요. 도면은 지금 모습 그대로 공개하고 있어요.", "Một tòa nhà đa chức năng, hiện vẫn còn nằm trên giấy. Các bản vẽ được công bố đúng như hiện tại."],
    "An automated trading project in private testing, building a record you can follow. It is not open to outside money.": ["一个自动化交易项目，正在内部测试，一点点积累起可以查看的记录。目前不接受外部资金。", "Un proyecto de trading automatizado en pruebas privadas, que va creando un historial que puedes seguir. No está abierto a dinero de fuera.", "자동 트레이딩 프로젝트로, 지금은 비공개로 시험 중이고 따라가며 볼 수 있는 기록을 쌓고 있어요. 외부 자금은 받지 않아요.", "Một dự án giao dịch tự động đang thử nghiệm nội bộ, dần dần xây dựng một hồ sơ mà bạn có thể theo dõi. Dự án không nhận vốn từ bên ngoài."],
    "A guidebook of attractions and restaurants, city by city, with descriptions and local tips from a licensed tour guide. One tap sends any place into the": ["一本按城市编排的景点和餐厅指南，每个地方都有介绍，还有持证导游给的本地小建议。点一下，就能把任何一个地点加进", "Una guía de atracciones y restaurantes, ciudad por ciudad, con descripciones y consejos de un guía turístico titulado. Con un toque envías cualquier lugar a", "도시별로 정리한 명소와 맛집 안내서예요. 공인 가이드가 쓴 설명과 현지 팁이 담겨 있고, 한 번만 누르면 어떤 장소든", "Một cuốn cẩm nang điểm tham quan và nhà hàng, theo từng thành phố, kèm mô tả và mẹo địa phương từ hướng dẫn viên có chứng chỉ. Chỉ một lần chạm là đưa được bất kỳ nơi nào vào"],
    "That drive is shorter than one break, no stops needed.": ["这段路比一次休息的时间还短，不用停靠。", "Ese trayecto es más corto que una sola pausa, no hace falta parar.", "이 구간은 한 번 쉴 시간보다도 짧아서, 따로 멈출 필요 없어요.", "Chặng này còn ngắn hơn một lần nghỉ, không cần dừng đâu."],
    "Something went wrong, try again.": ["出了点问题，再试一次吧。", "Algo salió mal, inténtalo de nuevo.", "문제가 좀 생겼어요, 다시 한 번 시도해 주세요.", "Có gì đó trục trặc rồi, bạn thử lại nhé."],
    "{n} found within 2½ miles of the road, in the order you’ll pass them": ["在离道路 4 公里内找到 {n} 处，按您经过的先后顺序排列", "{n} encontradas a menos de 4 km de la carretera, en el orden en que las irás pasando", "도로에서 4km 안쪽으로 {n}곳을 찾았어요, 지나가는 순서대로 보여드려요", "Tìm được {n} trạm trong vòng 4 km từ đường, xếp theo đúng thứ tự bạn sẽ đi qua"],
    "Looking for stops around break {i} of {n}…": ["正在查找第 {i} 个休息点附近的地方，共 {n} 个…", "Buscando paradas cerca de la pausa {i} de {n}…", "{n}개 중 {i}번째 휴식 지점 주변을 찾고 있어요…", "Đang tìm điểm dừng quanh chặng nghỉ {i} trên {n}…"],
    "Found the route, but the places service did not answer. It is free and rate-limited, wait a minute and try again.": ["路线找到了，不过地点服务没有响应。它是免费的，有调用次数限制，稍等一分钟再试一次吧。", "Encontramos la ruta, pero el servicio de lugares no respondió. Es gratuito y tiene un límite de consultas, espera un minuto e inténtalo de nuevo.", "경로는 찾았는데 장소 서비스가 응답을 안 했어요. 무료라서 사용 횟수 제한이 있으니, 1분쯤 기다렸다가 다시 시도해 주세요.", "Đã tìm được lộ trình, nhưng dịch vụ địa điểm chưa phản hồi. Dịch vụ này miễn phí và có giới hạn lượt gọi, bạn đợi một phút rồi thử lại nhé."],
    "Planned. {failed} of {n} breaks came back empty from the places service, try again for those.": ["已经排好了。{n} 个休息点里有 {failed} 个从地点服务那儿没拿到结果，这几个可以再试一次。", "Listo, ya está planificado. {failed} de {n} pausas volvieron vacías del servicio de lugares, vuelve a intentarlo con esas.", "일정이 짜였어요. 휴식 지점 {n}곳 중 {failed}곳은 장소 서비스에서 결과가 안 왔어요, 그 지점들은 다시 시도해 주세요.", "Đã lên kế hoạch xong. {failed} trong {n} chặng nghỉ chưa có kết quả từ dịch vụ địa điểm, bạn thử lại với mấy chặng đó nhé."],
    "Planned: {miles} miles, {time} driving, {rests} rest stops on the road, {breaks} suggested breaks.": ["已经排好啦：{miles} 英里，开车 {time}，沿途 {rests} 处休息区，建议休息 {breaks} 次。", "Listo: {miles} millas, {time} de conducción, {rests} áreas de descanso en el camino, {breaks} pausas sugeridas.", "다 짜였어요: {miles}마일, 운전 {time}, 길 위 휴게소 {rests}곳, 추천 휴식 {breaks}회.", "Đã lên xong: {miles} dặm, lái {time}, {rests} trạm dừng nghỉ trên đường, {breaks} chặng nghỉ gợi ý."],
    "Free for everyone, drivers, tour guides, tourists. Tap where you are, and every attraction lights up or dims based on drive time, traffic and closing hours. Your taps build the plan, day by day.": ["对所有人都免费，司机、导游、游客都能用。点一下您所在的位置，每个景点就会根据车程、路况和关门时间亮起来或暗下去。您点到哪里，行程就排到哪里，一天一天慢慢成形。", "Gratis para todos: conductores, guías y turistas. Toca dónde estás y cada atracción se ilumina o se apaga según el tiempo de viaje, el tráfico y la hora de cierre. Con tus toques el plan se va armando, día a día.", "누구나 무료예요, 기사님도, 가이드도, 여행자도요. 지금 계신 곳을 누르면 이동 시간과 교통, 마감 시간에 따라 각 명소가 밝아지거나 흐려져요. 누르는 대로 하루하루 일정이 만들어져요.", "Miễn phí cho tất cả mọi người, tài xế, hướng dẫn viên, khách du lịch. Chạm vào chỗ bạn đang đứng, mỗi điểm tham quan sẽ sáng lên hay mờ đi tùy theo thời gian lái xe, giao thông và giờ đóng cửa. Bạn chạm tới đâu, lịch trình thành hình tới đó, từng ngày một."],
    "Tap once to type a starting address · tap twice to use your current location": ["点一下输入出发地址 · 点两下用当前位置", "Toca una vez para escribir la dirección de partida · toca dos veces para usar tu ubicación actual", "한 번 누르면 출발 주소 입력 · 두 번 누르면 지금 위치 사용", "Chạm một lần để nhập địa chỉ xuất phát · chạm hai lần để dùng vị trí hiện tại"],
    "🏷️ Guide? Offer this route for sale →": ["🏷️ 您是导游吗？把这条路线放上来出售 →", "🏷️ ¿Eres guía? Pon esta ruta a la venta →", "🏷️ 가이드세요? 이 코스를 판매해 보세요 →", "🏷️ Bạn là hướng dẫn viên? Rao bán tuyến này nhé →"],
    "🎫 Or write your own in-depth trip and sell it →": ["🎫 或者，写一条自己的深度行程拿来出售 →", "🎫 O escribe tu propio viaje a fondo y véndelo →", "🎫 아니면 나만의 깊이 있는 여행을 직접 써서 팔아 보세요 →", "🎫 Hoặc tự viết một hành trình chuyên sâu của riêng bạn rồi bán →"],
    "places here · tap to browse, search, and add to your route": ["个地点 · 点一下就能浏览、搜索，加进您的行程", "lugares aquí · toca para explorar, buscar y añadir a tu ruta", "곳 · 눌러서 둘러보고 검색해서 경로에 담아 보세요", "địa điểm ở đây · chạm để xem, tìm và thêm vào lộ trình của bạn"],
    "· search by Nominatim · a free tool by Plateau Strategy Solution Lab": ["· 搜索由 Nominatim 提供 · Plateau Strategy Solution Lab 做的一款免费工具", "· búsqueda con Nominatim · una herramienta gratuita de Plateau Strategy Solution Lab", "· 검색은 Nominatim · Plateau Strategy Solution Lab이 만든 무료 도구예요", "· tìm kiếm bằng Nominatim · một công cụ miễn phí của Plateau Strategy Solution Lab"],
    "should start from wherever you sleep, otherwise it plans your morning from your original start point. Have you already got somewhere?": ["天最好从您过夜的地方开始，不然系统会按最初的起点来安排您的早上。您已经订好住的地方了吗？", "debería empezar desde donde duermas, si no, te planificará la mañana desde el punto de partida original. ¿Ya tienes dónde quedarte?", "은 주무시는 곳에서 시작하는 게 좋아요, 안 그러면 원래 출발지 기준으로 아침 일정이 짜여요. 머무실 곳은 정하셨어요?", "nên bắt đầu từ nơi bạn ngủ, không thì buổi sáng sẽ được xếp từ điểm xuất phát ban đầu. Bạn đã có chỗ nghỉ chưa?"],
    "Anything to tell the guide? (optional)": ["有什么想跟导游说的吗？（选填）", "¿Algo que quieras decirle al guía? (opcional)", "가이드에게 남기고 싶은 말 있으세요? (선택)", "Bạn có điều gì muốn nhắn với hướng dẫn viên không? (không bắt buộc)"],
    "Self-driving pickups are under research, we're studying how to hail an autonomous car straight from your planned route, safely and privately. It isn't bookable today, and no ride is being requested.": ["无人驾驶接送还在研究阶段，我们正在琢磨怎么从您排好的行程里，安全又私密地直接叫一辆自动驾驶车。目前还不能预约，也不会替您发出任何叫车请求。", "Los viajes autónomos todavía están en investigación; estamos viendo cómo llamar un coche autónomo directamente desde tu ruta, de forma segura y privada. Hoy por hoy no se puede reservar y no se está pidiendo ningún viaje.", "자율주행 픽업은 아직 연구 중이에요. 계획한 경로에서 바로, 안전하고 사적으로 자율주행차를 부르는 방법을 살펴보고 있어요. 지금은 예약이 안 되고, 어떤 호출도 나가지 않아요.", "Đón khách bằng xe tự lái vẫn còn đang nghiên cứu, chúng mình đang tìm cách gọi một chiếc xe tự hành ngay từ lộ trình bạn đã lên, vừa an toàn vừa riêng tư. Hiện chưa đặt được và cũng chưa có chuyến nào được yêu cầu đâu."],
    "Want us to tell you when it's ready?": ["开放的时候想让我们通知您一声吗？", "¿Quieres que te avisemos cuando esté listo?", "준비되면 알려드릴까요?", "Bạn muốn chúng mình báo cho biết khi sẵn sàng không?"],
    "to book a real driver to the same stop.": ["就能预约一位真人司机，送您到同一个地点。", "para reservar un conductor de verdad hasta ese mismo destino.", "를 누르면 같은 장소로 실제 기사님을 예약할 수 있어요.", "để đặt một tài xế thật đưa bạn tới đúng điểm đó."],
    "Type a destination and press Add, or tap a pin on the map": ["输入一个目的地点“添加”，或者直接点地图上的标记", "Escribe un destino y pulsa Añadir, o toca un marcador en el mapa", "목적지를 입력하고 추가를 누르거나, 지도에서 핀을 톡 눌러 보세요", "Nhập một điểm đến rồi nhấn Thêm, hoặc chạm vào một ghim trên bản đồ"],
    "Type your starting address, hotel or airport…": ["输入您的出发地址、酒店或机场…", "Escribe tu dirección de partida, hotel o aeropuerto…", "출발 주소나 호텔, 공항을 입력해 보세요…", "Nhập địa chỉ xuất phát, khách sạn hoặc sân bay của bạn…"],
    "Copy the itinerary as text, send it to anyone": ["把行程复制成文字，想发给谁都行", "Copia el itinerario como texto y mándaselo a quien quieras", "일정을 텍스트로 복사해서 누구에게나 보내 보세요", "Sao chép lịch trình thành văn bản, gửi cho ai cũng được"],
    "Search any address or attraction, it joins the book…": ["搜索任意地址或景点，它就会自动收进手册里…", "Busca cualquier dirección o atracción y se suma al libro…", "주소나 명소를 검색하면 바로 북에 담겨요…", "Tìm bất kỳ địa chỉ hay điểm tham quan nào, nó sẽ tự vào sổ…"],
    "Who should the guide ask for?": ["到时候导游找谁呢？", "¿Por quién debe preguntar el guía?", "가이드가 누구를 찾으면 될까요?", "Hướng dẫn viên sẽ hỏi tìm ai đây?"],
    "Guided Trips, in-depth walks from local guides": ["导览行程，跟着当地导游深度走一趟", "Viajes guiados, paseos a fondo con guías locales", "가이드 투어, 현지 가이드와 함께하는 깊이 있는 도보 여행", "Chuyến có hướng dẫn, những buổi dạo bộ chuyên sâu cùng hướng dẫn viên bản địa"],
    "Not sightseeing loops, these are written by the guides who run them, stop by stop, with how long you actually stand at each one. A student's hour in Harvard Yard is a different thing from a bus past the gate.": ["这可不是走马观花的观光环线，每条行程都是带团的导游一站一站亲手写下来的，连在每处站多久都写得清清楚楚。哈佛学生带您在校园里走上一小时，和坐大巴从校门口开过去，完全是两回事。", "No son circuitos turísticos: los escriben los propios guías que los hacen, parada por parada, incluyendo cuánto tiempo te quedas de verdad en cada una. La hora de un estudiante en Harvard Yard no tiene nada que ver con un autobús pasando por la verja.", "관광버스 코스가 아니에요. 직접 진행하는 가이드가 한 곳 한 곳, 각 지점에 실제로 얼마나 머무는지까지 적어 만든 일정이에요. 하버드 야드를 학생과 함께 한 시간 걷는 건, 정문을 스쳐 지나가는 버스와는 완전히 다른 이야기죠.", "Không phải mấy vòng tham quan chớp nhoáng đâu, mỗi hành trình do chính hướng dẫn viên dẫn tour tự viết, từng điểm một, kèm cả thời gian bạn thực sự dừng lại ở mỗi nơi. Một giờ dạo khuôn viên Harvard cùng một sinh viên khác hẳn với chuyến xe buýt chạy vụt qua cổng."],
    "The trip planner draws a sightseeing loop. This is for the other kind, the walk you know by heart, where the point is what you say at each stop. Write it out yourself: your stops, your timings, your price. Travellers browse it on the": ["行程规划工具画出来的是一条观光环线。这里要说的是另一种，您烂熟于心的那条路，重点在于您在每一站会讲些什么。自己动手把它写出来吧：您的站点、您的时间、您定的价格。旅客可以在", "El planificador dibuja un circuito turístico. Esto es para el otro tipo: ese paseo que te sabes de memoria, donde lo que importa es lo que cuentas en cada parada. Escríbelo tú mismo: tus paradas, tus tiempos, tu precio. Los viajeros lo verán en la", "여행 플래너는 관광 코스를 그려 줘요. 여기는 그와는 다른, 훤히 아는 그 길을 위한 곳이에요. 각 지점에서 무슨 이야기를 들려주느냐가 핵심이죠. 직접 써 보세요, 직접 고른 지점, 직접 정한 시간, 직접 매긴 가격으로요. 여행자는", "Công cụ lập kế hoạch vẽ ra một vòng tham quan. Chỗ này dành cho kiểu khác, con đường bạn thuộc nằm lòng, nơi điều quan trọng là những gì bạn kể ở mỗi điểm dừng. Bạn hãy tự viết ra: điểm dừng của bạn, thời gian của bạn, giá của bạn. Du khách sẽ xem nó trên"],
    ". Guiding is part of the": ["查看。带团导览属于", ". Guiar es parte del", "에서 볼 수 있어요. 가이드 활동은", ". Việc hướng dẫn nằm trong"],
    ", one code refers rides and sells trips.": ["，一个编号，既能帮您推荐用车，也能卖出行程。", ", con un mismo código refieres viajes y vendes itinerarios.", ", 코드 하나로 차량도 추천하고 여행도 팔 수 있어요.", ", một mã vừa giúp bạn giới thiệu chuyến xe vừa bán hành trình."],
    "You need a code to list a trip, it is how we know a real guide wrote it. It is the same code the": ["发布行程需要一个编号，我们靠它确认这条行程确实出自真正的导游。这和", "Necesitas un código para publicar un viaje, así sabemos que lo escribió un guía de verdad. Es el mismo código que emite el", "여행을 등록하려면 코드가 필요해요, 실제 가이드가 직접 쓴 글인지 저희가 이 코드로 확인하거든요. 이 코드는", "Bạn cần một mã để đăng hành trình, đó là cách chúng mình biết đúng là một hướng dẫn viên thật đã viết. Đây chính là mã do"],
    "issues, so if you already refer rides you have one. If not, registering there takes a minute.": ["发放的编号是同一个，所以只要您已经在推荐用车，就已经有一个了。要是还没有，去那儿注册也就一分钟的事。", "así que si ya refieres viajes, ya tienes uno. Y si no, registrarte allí es cosa de un minuto.", "에서 발급하는 코드와 같아서, 이미 차량을 추천하고 계시다면 벌써 갖고 계신 거예요. 아직 없으시면 거기서 등록하는 데 1분이면 돼요.", "cấp, nên nếu bạn đã giới thiệu chuyến xe thì bạn có sẵn rồi. Còn chưa có thì đăng ký ở đó chỉ mất một phút thôi nhé."],
    "Your code identifies you. Travellers see your name, never your contact details, interest comes to you through us, so your listing cannot be harvested for emails.": ["编号用来确认您的身份。旅客只会看到您的名字，绝不会看到联系方式，有人感兴趣时由我们替您转达，所以您的行程页不会被拿去抓邮箱。", "Tu código te identifica. Los viajeros ven tu nombre, nunca tus datos de contacto, y quien se interesa te llega a través de nosotros, así que nadie puede usar tu anuncio para recopilar correos.", "코드가 본인임을 확인해 줘요. 여행자에게는 이름만 보이고 연락처는 절대 보이지 않아요, 관심 있는 분은 저희를 통해 연결되니까 등록 정보가 이메일 수집에 쓰일 일이 없어요.", "Mã giúp nhận diện bạn. Du khách chỉ thấy tên bạn, không bao giờ thấy thông tin liên hệ, ai quan tâm cũng đến với bạn qua chúng mình, nên chẳng ai lấy được email từ tin đăng của bạn."],
    "Be specific. \"Harvard Yard in depth, a student's walk\" sells; \"Boston tour\" does not.": ["写得具体一点。“哈佛校园深度游，学生带路”这样才卖得动；“波士顿一日游”就不行。", "Sé concreto. \"Harvard Yard a fondo, el paseo de un estudiante\" sí vende; \"Tour de Boston\" no.", "구체적으로 써 보세요. \"하버드 야드 심층, 학생과 함께 걷기\"는 잘 팔리지만 \"보스턴 투어\"는 안 팔려요.", "Hãy thật cụ thể nhé. \"Khuôn viên Harvard chuyên sâu, buổi đi bộ cùng sinh viên\" thì bán được; còn \"Tour Boston\" thì không."],
    "This is what makes it an in-depth trip rather than a drive-past: name each stop and say how long you actually stand there. The note is for you to say why it matters.": ["深度游和走马观花的区别就在这里：写下每一站的名字，以及您实际会在那里停多久。备注留给您来讲清楚这一站为什么值得。", "Esto es lo que hace que sea un viaje a fondo y no un simple paseo en coche: nombra cada parada y di cuánto tiempo te quedas de verdad allí. La nota es tu espacio para contar por qué vale la pena.", "스쳐 지나가는 투어와 진짜 심층 투어의 차이가 바로 여기예요: 방문지마다 이름을 적고, 실제로 얼마나 머무는지 써 보세요. 메모에는 이곳이 왜 특별한지 편하게 담으시면 돼요.", "Chính điều này biến chuyến đi thành hành trình chuyên sâu thay vì chỉ chạy ngang qua: đặt tên từng điểm dừng và ghi rõ bạn thực sự dừng lại đó bao lâu. Phần ghi chú là chỗ để bạn kể vì sao nơi đó đáng giá."],
    "The questions every traveller asks before they book.": ["旅客下单前最常问的那些问题。", "Las preguntas que todo viajero se hace antes de reservar.", "여행자라면 예약 전에 꼭 물어보는 것들이에요.", "Những câu mà du khách nào cũng hỏi trước khi đặt."],
    "Listing is free. When a traveller asks for your trip we introduce you directly. You can list as many trips as you like, most guides run several versions of the same walk at different lengths.": ["发布是免费的。有旅客想订您的行程时，我们会直接帮双方牵线。您想发布多少条都行，很多导游都会把同一条路线做成长短不同的几个版本。", "Publicar es gratis. Cuando un viajero pide tu viaje, os ponemos en contacto directamente. Puedes publicar todos los que quieras, la mayoría de los guías ofrecen varias versiones del mismo paseo con distintas duraciones.", "등록은 무료예요. 여행자가 문의하면 저희가 바로 연결해 드려요. 원하는 만큼 얼마든지 등록하셔도 되고, 대부분의 가이드는 같은 코스를 길이만 달리해 여러 버전으로 운영하고 있어요.", "Đăng tin hoàn toàn miễn phí. Khi có du khách hỏi, chúng mình kết nối trực tiếp hai bên. Bạn muốn đăng bao nhiêu cũng được, phần lớn hướng dẫn viên đều có vài phiên bản dài ngắn khác nhau cho cùng một lộ trình."],
    "Live on the trips page right now.": ["现在就在行程页面上展示着。", "En vivo en la página de viajes ahora mismo.", "지금 여행 페이지에 올라와 있어요.", "Đang hiển thị ngay trên trang các chuyến lúc này."],
    "Destination Book, Plateau Strategy Solution Lab": ["目的地手册, Plateau Strategy Solution Lab", "Libro de destinos, Plateau Strategy Solution Lab", "여행지 북, Plateau Strategy Solution Lab", "Sổ điểm đến, Plateau Strategy Solution Lab"],
    "A curated guidebook of attractions and restaurants, every type of destination, organized by category, with descriptions and local tips from a professionally licensed tour guide. One tap sends any place into the": ["一本精心挑选的景点与餐厅指南，各类目的地都按类别整理好了，还配上了持证导游写的介绍和本地小贴士。一键就能把任何地点加进", "Una guía cuidada de atracciones y restaurantes, con todo tipo de destinos ordenados por categoría y con descripciones y consejos locales de un guía con licencia. Con un solo toque envías cualquier lugar al", "명소와 식당을 엄선해 담은 안내서예요, 온갖 유형의 여행지를 분류별로 정리하고, 자격 있는 가이드의 설명과 현지 팁까지 곁들였어요. 한 번만 누르면 어떤 장소든", "Một cuốn cẩm nang được tuyển chọn kỹ các điểm tham quan và nhà hàng, đủ mọi loại điểm đến, sắp gọn theo danh mục, kèm mô tả và mẹo bản địa từ hướng dẫn viên có giấy phép. Chỉ một chạm là đưa được bất kỳ nơi nào vào"],
    ". Hours shown are typical, check before you go.": ["。列出的营业时间只是大致情况，出发前记得再确认一下。", ". Los horarios que ves son los habituales, confírmalos antes de ir.", ". 표시된 시간은 보통 기준이라, 가시기 전에 한 번 확인해 보세요.", ". Giờ hiển thị chỉ là giờ thường lệ thôi, bạn nhớ kiểm tra trước khi đi nhé."],
    "🌟 What do you wish was in this book?": ["🌟 您最希望这本手册里有点什么呢？", "🌟 ¿Qué te encantaría encontrar en este libro?", "🌟 이 북에 뭐가 있으면 좋으시겠어요?", "🌟 Bạn ước có gì trong cuốn sổ này nhỉ?"],
    "Tell us the place you want to see, or the kind of thing you're looking for. Every wish tells us what to add next, and where travelers want a guide. No account, no email needed.": ["告诉我们您想去的地方，或者您在找哪一类体验。每一条心愿都会帮我们知道下一步该补上什么，以及旅客在哪些地方需要导游。不用注册，也不用留邮箱。", "Cuéntanos el lugar que te apetece ver, o el tipo de cosa que buscas. Cada deseo nos dice qué añadir después y dónde los viajeros quieren un guía. Sin cuenta ni correo.", "가고 싶은 장소나 찾고 계신 종류를 알려주세요. 하나하나의 바람이 다음에 무엇을 더할지, 여행자가 어디서 가이드를 찾는지 저희에게 알려줘요. 계정도 이메일도 필요 없어요.", "Hãy cho chúng mình biết nơi bạn muốn đến, hoặc kiểu trải nghiệm bạn đang tìm. Mỗi mong muốn giúp chúng mình biết nên thêm gì tiếp theo và du khách cần hướng dẫn viên ở đâu. Không cần tài khoản, cũng không cần email."],
    "Nothing matches these filters, loosen one and the book fills back up.": ["没有符合这些筛选条件的结果，放宽其中一项，内容就又会满起来。", "Nada coincide con estos filtros, afloja uno y el libro se vuelve a llenar.", "이 조건에 맞는 게 없어요, 하나만 살짝 풀면 북이 다시 채워져요.", "Chưa có kết quả nào khớp bộ lọc, nới một điều kiện là cuốn sổ lại đầy ngay."],
    "A free tool by Plateau Strategy Solution Lab · descriptions curated with a professionally licensed tour guide": ["Plateau Strategy Solution Lab 打造的免费工具 · 描述内容由持证导游一起编写", "Una herramienta gratuita de Plateau Strategy Solution Lab · descripciones escritas junto a un guía con licencia", "Plateau Strategy Solution Lab이 만든 무료 도구 · 설명은 자격 있는 가이드와 함께 작성했어요", "Công cụ miễn phí của Plateau Strategy Solution Lab · phần mô tả được viết cùng hướng dẫn viên có giấy phép"],
    "Search the book, or type a new place to suggest & add…": ["在手册里搜索，或者输入一个新地点来推荐并添加…", "Busca en el libro o escribe un lugar nuevo para sugerirlo y sumarlo…", "북에서 검색하거나, 새 장소를 입력해 제안하고 추가해 보세요…", "Tìm trong sổ, hoặc gõ một nơi mới để đề xuất và thêm vào…"],
    "Road Trip Planner, Plateau Strategy Solution Lab": ["长途自驾规划, Plateau Strategy Solution Lab", "Planificador de viajes por carretera, Plateau Strategy Solution Lab", "로드트립 플래너, Plateau Strategy Solution Lab", "Lập kế hoạch chuyến đường dài, Plateau Strategy Solution Lab"],
    "For the long hauls. Give it two points and it finds the fuel, food, rest areas and viewpoints near your actual road, grouped by how many hours in you'll be, so you can plan real breaks instead of scrolling a map.": ["专为长途路程准备的。给它两个地点，它就会沿着您真正要走的那条路，帮您找出加油站、吃饭的地方、休息区和观景点，还按您开到第几个小时分好组，让您能好好安排休息，而不用一直划地图。", "Para los trayectos largos. Dale dos puntos y te encuentra gasolineras, sitios para comer, áreas de descanso y miradores junto a la carretera que vas a tomar de verdad, agrupados por las horas que llevarás al volante, para que planifiques descansos de verdad en vez de arrastrar el mapa.", "장거리 운전을 위한 기능이에요. 두 지점만 넣으면 실제로 달릴 경로 근처의 주유소·식당·휴게소·전망대를 찾아서, 몇 시간째 되는 지점인지에 따라 묶어 보여줘요. 지도를 계속 넘기지 않고도 진짜 쉬어 갈 곳을 계획할 수 있어요.", "Dành cho những chặng đường dài. Cho hai điểm là công cụ tìm ngay trạm xăng, chỗ ăn, trạm dừng nghỉ và điểm ngắm cảnh gần đúng tuyến đường bạn sẽ đi, nhóm sẵn theo số giờ đã lái, để bạn nghỉ ngơi cho đàng hoàng thay vì cứ kéo bản đồ."],
    "Enter two places and press “Plan the drive”.": ["输入两个地点，然后点一下“规划这段路”。", "Escribe dos lugares y pulsa «Planear el trayecto».", "두 장소를 넣고 “주행 계획 세우기”를 눌러 보세요.", "Nhập hai địa điểm rồi bấm “Lên kế hoạch lái xe” nhé."],
    "Favorite Places, Plateau Strategy Solution Lab": ["最爱的地方, Plateau Strategy Solution Lab", "Lugares favoritos, Plateau Strategy Solution Lab", "즐겨찾는 장소, Plateau Strategy Solution Lab", "Địa điểm yêu thích, Plateau Strategy Solution Lab"],
    "Search anywhere and tell us your favorite place, it joins the free Destination Book for the next traveler. The more you share, the smarter our map gets.": ["搜索世界任何角落，把您最喜欢的地方告诉我们，它就会被收进免费的目的地手册，留给下一位旅客。您分享得越多，我们的地图就越聪明。", "Busca donde quieras y cuéntanos tu lugar favorito, se suma al Libro de destinos gratuito para el próximo viajero. Cuanto más compartes, más inteligente se vuelve nuestro mapa.", "어디든 검색해서 가장 좋아하는 장소를 알려주세요, 다음 여행자를 위해 무료 여행지 북에 담겨요. 많이 나눠주실수록 지도가 점점 똑똑해져요.", "Tìm bất cứ đâu và cho chúng mình biết nơi bạn thích nhất, chỗ đó sẽ vào Sổ điểm đến miễn phí cho du khách tiếp theo. Bạn chia sẻ càng nhiều, bản đồ của chúng mình càng thông minh."],
    "If you've been there, how long did you stay?": ["如果您去过那里，待了多久呢？", "Si ya has estado, ¿cuánto tiempo te quedaste?", "가보신 적 있다면 얼마나 머무셨어요?", "Nếu bạn từng đến đó, bạn ở lại bao lâu nhỉ?"],
    "Every place you share is checked against the map for a real location, then written into the Destination Book. No account needed, this takes about 15 seconds.": ["您分享的每个地点，我们都会先在地图上确认是真实位置，再写进目的地手册。不用注册，大约 15 秒就好。", "Cada lugar que compartes lo comprobamos en el mapa para confirmar que existe y luego lo escribimos en el Libro de destinos. Sin cuenta, y te lleva unos 15 segundos.", "공유해 주신 장소는 모두 지도에서 실제 위치인지 확인한 뒤 여행지 북에 기록돼요. 계정은 필요 없고, 15초쯤이면 끝나요.", "Mỗi nơi bạn chia sẻ đều được đối chiếu trên bản đồ để chắc là có thật, rồi ghi vào Sổ điểm đến. Không cần tài khoản, chỉ mất khoảng 15 giây thôi."],
    "Board of Directors, Plateau Strategy Solution Lab": ["董事会, Plateau Strategy Solution Lab", "Junta directiva, Plateau Strategy Solution Lab", "이사회, Plateau Strategy Solution Lab", "Hội đồng quản trị, Plateau Strategy Solution Lab"],
    "Private governance vault, for the managing members only. The company's corporate documents and ownership record, kept in one secure place.": ["私密的治理文件库，仅限管理成员查阅。公司的法人文件和股权记录，统一放在一个安全的地方。", "Una bóveda de gobernanza privada, solo para los socios gestores. Los documentos corporativos y el registro de propiedad de la empresa, todo guardado en un único lugar seguro.", "비공개 거버넌스 금고예요, 운영 구성원만 볼 수 있어요. 회사의 법인 문서와 지분 기록을 한곳에 안전하게 보관해요.", "Kho quản trị riêng tư, chỉ dành cho các thành viên điều hành. Toàn bộ tài liệu pháp nhân và hồ sơ sở hữu của công ty được giữ ở một nơi an toàn duy nhất."],
    "Everything here is private corporate governance material, bylaws, agreements, resolutions and contracts. Uploads are archived permanently and never overwritten.": ["这里的所有内容都是私密的公司治理材料，章程、协议、决议和合同。上传的文件会被永久归档，绝不会被覆盖。", "Todo lo que hay aquí es material privado de gobierno corporativo, estatutos, acuerdos, resoluciones y contratos. Lo que subes se archiva de forma permanente y nunca se sobrescribe.", "이곳의 자료는 모두 비공개 기업 거버넌스 문서예요, 정관, 협약, 결의서, 계약서까지요. 업로드된 파일은 영구 보관되고 절대 덮어쓰지 않아요.", "Mọi thứ ở đây đều là tài liệu quản trị doanh nghiệp riêng tư, điều lệ, thỏa thuận, nghị quyết và hợp đồng. Tệp tải lên được lưu vĩnh viễn và không bao giờ bị ghi đè lên."],
    "Bylaws · operating & shareholder agreements · articles of formation · board resolutions · contracts · cap table · tax/EIN. Append-only, every version is kept.": ["章程 · 经营与股东协议 · 设立文件 · 董事会决议 · 合同 · 股权结构表 · 税务/EIN。只增不改，每个版本都会保留下来。", "Estatutos · acuerdos operativos y de accionistas · actas de constitución · resoluciones del consejo · contratos · tabla de capitalización · impuestos/EIN. Solo se añade, se conservan todas las versiones.", "정관 · 운영 및 주주 계약 · 설립 서류 · 이사회 결의 · 계약서 · 지분표 · 세무/EIN. 추가만 되고, 모든 버전이 그대로 남아요.", "Điều lệ · thỏa thuận vận hành và cổ đông · giấy tờ thành lập · nghị quyết hội đồng · hợp đồng · bảng vốn · thuế/EIN. Chỉ thêm mới, mọi phiên bản đều được giữ lại đầy đủ."],
    "No documents yet, upload your first governance record above.": ["还没有文件，在上方上传第一份治理记录吧。", "Aún no hay documentos, sube arriba tu primer registro de gobernanza.", "아직 문서가 없어요, 위에서 첫 거버넌스 기록을 올려 보세요.", "Chưa có tài liệu nào, hãy tải hồ sơ quản trị đầu tiên lên ở phía trên nhé."],
    "Document title, e.g. Operating Agreement v2": ["文件标题，比如：经营协议 v2", "Título del documento, por ejemplo Acuerdo operativo v2", "문서 제목, 예를 들어 운영 계약 v2", "Tên tài liệu, ví dụ Thỏa thuận vận hành v2"],
    "One place that keeps every paper trail the site produces, bookings, your customer contact list, signed agreements, uploaded paperwork, leads, partners and more. Private, owner only.": ["一个地方，帮您保存网站产生的所有纸面记录，订单、客户联系名单、已签协议、上传的文件、潜在客户、合作方等等。私密，只有所有者能看。", "Un solo lugar que guarda todo el rastro documental del sitio, reservas, tu lista de contactos de clientes, acuerdos firmados, documentación subida, prospectos, socios y más. Privado, solo para el propietario.", "사이트에서 생기는 모든 서류 기록을 한곳에 모아 둬요, 예약, 고객 연락처 목록, 서명된 계약, 업로드한 문서, 잠재 고객, 파트너까지요. 비공개라서 소유자만 볼 수 있어요.", "Một nơi lưu lại mọi dấu vết giấy tờ mà trang tạo ra, từ đặt chỗ, danh sách liên hệ khách hàng, thỏa thuận đã ký, hồ sơ tải lên, khách tiềm năng, đến đối tác và hơn thế nữa. Riêng tư, chỉ mình chủ sở hữu xem được."],
    "This is your advertising list.": ["这就是您的广告投放名单。", "Esta es tu lista para publicidad.", "이게 바로 광고용 명단이에요.", "Đây chính là danh sách quảng cáo của bạn."],
    "Every email and phone your site has ever captured, booking customers, account holders, finance leads, waitlists and partner contacts, de-duplicated. Export it to CSV and load it straight into your ad platform (Google/Meta customer match, Mailchimp, etc.). Only market to people per your privacy policy & applicable law.": ["网站收集到的所有邮箱和电话，下单客户、账户持有人、金融意向客户、候补名单和合作方联系人，都已经去重。可以导出成 CSV，直接导入您的广告平台（Google/Meta 客户匹配、Mailchimp 等）。请一定在隐私政策和适用法律允许的范围内做营销。", "Todos los correos y teléfonos que tu sitio ha reunido, clientes con reserva, titulares de cuenta, prospectos de finanzas, listas de espera y contactos de socios, ya sin duplicados. Expórtalo a CSV y súbelo directamente a tu plataforma de anuncios (customer match de Google/Meta, Mailchimp, etc.). Haz marketing solo conforme a tu política de privacidad y a la ley aplicable.", "사이트가 모아 온 모든 이메일과 전화번호, 예약 고객, 계정 보유자, 금융 잠재 고객, 대기자 명단, 파트너 연락처를 중복 없이 정리했어요. CSV로 내보내 광고 플랫폼(Google/Meta 고객 매칭, Mailchimp 등)에 바로 올리실 수 있어요. 마케팅은 꼭 개인정보 처리방침과 관련 법률이 허용하는 범위 안에서만 해 주세요.", "Mọi email và số điện thoại mà trang đã thu thập, khách đặt chỗ, chủ tài khoản, khách tiềm năng tài chính, danh sách chờ và liên hệ đối tác, đều đã loại trùng. Xuất ra CSV rồi nạp thẳng vào nền tảng quảng cáo của bạn (customer match của Google/Meta, Mailchimp, v.v.). Nhớ chỉ tiếp thị theo đúng chính sách bảo mật và luật hiện hành nhé."],
    "Nothing here yet, records appear automatically as they happen.": ["这里还没有内容，一有记录产生就会自动出现。", "Aún no hay nada aquí, los registros van apareciendo solos a medida que ocurren.", "아직 아무것도 없어요, 기록이 생기면 자동으로 나타나요.", "Chưa có gì ở đây cả, cứ có phát sinh là bản ghi tự hiện ra."],
    "Affordable Tesla rentals turn everyday drivers into earners and riders into owners, the first loop in a closed system where revenue compounds instead of leaking away.": ["平价的特斯拉租赁让普通司机也能开始赚钱，让乘客变成车主，这是整个闭环系统的第一环，收入在里面不断累积，而不是白白流走。", "El alquiler asequible de Teslas convierte a conductores de a pie en personas que ganan dinero y a los pasajeros en propietarios, es el primer bucle de un sistema cerrado donde los ingresos se acumulan en lugar de escaparse.", "부담 없는 가격의 테슬라 렌털은 평범한 운전자를 돈 버는 사람으로, 승객을 차주로 만들어 줘요, 수익이 밖으로 새지 않고 차곡차곡 쌓이는 닫힌 시스템의 첫 번째 고리예요.", "Cho thuê Tesla với giá phải chăng giúp tài xế bình thường kiếm được tiền và hành khách trở thành chủ xe, đó là vòng đầu tiên trong một hệ thống khép kín nơi doanh thu tích lũy dần thay vì rò rỉ ra ngoài."],
    "One ecosystem. Every part funds the next.": ["一个生态。每一环都在为下一环提供资金。", "Un solo ecosistema. Cada parte financia a la siguiente.", "하나로 이어진 생태계예요. 각 부분이 다음 부분을 뒷받침해요.", "Một hệ sinh thái duy nhất. Mỗi phần tiếp sức cho phần kế tiếp."],
    "We control the full value chain and share the upside with drivers and partners, so revenue compounds across transportation, real estate, and finance instead of leaking away.": ["我们掌控完整的价值链，也把收益和司机、合作方一起分享，所以收入会在交通、房地产和金融之间不断累积，而不是白白流走。", "Controlamos toda la cadena de valor y compartimos las ganancias con conductores y socios, así los ingresos se acumulan entre transporte, inmobiliaria y finanzas en lugar de escaparse.", "저희는 가치사슬 전체를 직접 운영하고 그 이익을 기사님, 파트너와 함께 나눠요, 그래서 수익이 교통·부동산·금융을 오가며 밖으로 새지 않고 차곡차곡 쌓여요.", "Chúng mình kiểm soát trọn chuỗi giá trị và chia lợi ích cùng tài xế và đối tác, nhờ vậy doanh thu cứ tích lũy dần qua vận tải, bất động sản và tài chính thay vì rò rỉ ra ngoài."],
    "Each part funds the next through shared cash flow and operational leverage, capital works harder across the whole system.": ["每个环节都通过共享现金流和运营杠杆为下一环提供资金，资本在整个系统里被用得更加充分。", "Cada parte financia a la siguiente con un flujo de caja compartido y apalancamiento operativo, así el capital rinde más en todo el sistema.", "각 부분이 공유 현금흐름과 운영 레버리지로 다음 부분을 받쳐줘요, 덕분에 자본이 시스템 전체에서 더 알차게 일해요.", "Mỗi phần tiếp sức cho phần kế tiếp nhờ dòng tiền chung và đòn bẩy vận hành, để đồng vốn làm việc hiệu quả hơn trên toàn hệ thống."],
    "Full control over the supply chain, client experience, and margin capture, end to end, no middlemen skimming value.": ["从头到尾完全掌控供应链、客户体验和利润留存，中间没有人从中抽成。", "Control total de la cadena de suministro, la experiencia del cliente y el margen, de principio a fin, sin intermediarios que se lleven valor.", "공급망, 고객 경험, 마진까지 처음부터 끝까지 저희가 직접 챙겨요, 중간에서 가치를 떼어가는 사람이 없어요.", "Kiểm soát trọn vẹn chuỗi cung ứng, trải nghiệm khách hàng và biên lợi nhuận, từ đầu đến cuối, không có trung gian nào ăn bớt giá trị."],
    "Revenue synergies accelerate expansion across every business line, so growth continuously reinvests into more growth.": ["各业务线之间的收入协同会加速扩张，让每一轮增长不断再投入到下一轮增长里。", "Las sinergias de ingresos aceleran la expansión en todas las líneas de negocio, así el crecimiento se reinvierte una y otra vez en más crecimiento.", "매출 시너지가 모든 사업 부문의 확장에 속도를 붙여서, 성장이 계속 다음 성장으로 다시 투자돼요.", "Cộng hưởng doanh thu thúc đẩy việc mở rộng ở mọi mảng, để tăng trưởng cứ liên tục tái đầu tư cho đợt tăng trưởng tiếp theo."],
    "We're validating the market and preparing to launch. Early partners, investors, and team members are critical to our success.": ["我们正在验证市场，也在为启动做准备。早期的合作方、投资人和团队成员，对我们能不能成功都很关键。", "Estamos validando el mercado y preparando el lanzamiento. Los primeros socios, inversores y compañeros de equipo son clave para que esto salga bien.", "저희는 시장을 검증하면서 출시를 준비하고 있어요. 초기 파트너, 투자자, 팀원 한 분 한 분이 저희 성공의 열쇠예요.", "Chúng mình đang kiểm chứng thị trường và chuẩn bị ra mắt. Những đối tác, nhà đầu tư và thành viên đầu tiên chính là yếu tố quyết định thành công."],
    "For travelers & tour guides, free map planning": ["为旅客和导游打造的免费地图规划", "Para viajeros y guías, planificación gratis sobre el mapa", "여행자와 가이드 모두를 위한 무료 지도 플래닝", "Dành cho du khách & hướng dẫn viên, lên kế hoạch trên bản đồ hoàn toàn miễn phí"],
    "Plan a real day on the map: every stop lights up or dims by drive time, traffic and closing hours. Guides build and name their own routes here, no website needed, and travelers who'd rather not drive it themselves can hand the route to a guide.": ["在地图上规划出真实可行的一天：每一站都会根据车程、路况和关门时间自动变亮或变暗。导游可以在这里搭好自己的路线并起名，不用自己建网站，不想亲自开车的旅客，也可以把路线直接交给导游。", "Planifica un día de verdad sobre el mapa: cada parada se ilumina o se apaga según el tiempo de viaje, el tráfico y la hora de cierre. Aquí los guías crean sus propias rutas y les ponen nombre, sin necesidad de una web, y los viajeros que prefieren no conducir pueden dejar la ruta en manos de un guía.", "지도 위에서 진짜 하루를 짜 보세요: 각 방문지가 이동 시간·교통·마감 시간에 따라 밝아지거나 흐려져요. 가이드는 따로 웹사이트를 만들 필요 없이 여기서 자신만의 코스를 만들고 이름도 붙일 수 있고, 직접 운전하기 부담스러운 여행자는 그 코스를 가이드에게 맡기면 돼요.", "Lên kế hoạch cho một ngày thật trên bản đồ: mỗi điểm dừng sáng lên hay mờ đi tùy theo thời gian lái, giao thông và giờ đóng cửa. Hướng dẫn viên tạo và đặt tên lộ trình riêng ngay tại đây, chẳng cần website nào cả, còn du khách ngại tự lái thì có thể giao lộ trình cho hướng dẫn viên."],
    "Every attraction and restaurant we know, city by city, with local tips from a licensed guide. It grows on its own: search a place in the planner and it's written into the book for the next traveler. One tap sends anything straight into your trip.": ["我们知道的每一处景点和餐厅，都按城市整理好，还配上了持证导游的本地贴士。它会自己成长：在规划工具里搜一个地点，它就会被写进手册，留给下一位旅客。一键就能把任何地点加进您的行程。", "Cada atracción y restaurante que conocemos, ciudad por ciudad, con consejos locales de un guía con licencia. Crece solo: busca un lugar en el planificador y queda escrito en el libro para el próximo viajero. Con un toque lo mandas directo a tu viaje.", "저희가 아는 모든 명소와 식당을 도시별로, 자격 있는 가이드의 현지 팁과 함께 정리했어요. 이 북은 스스로 자라요: 플래너에서 장소를 검색하면 다음 여행자를 위해 북에 기록되거든요. 한 번만 누르면 바로 일정에 들어가요.", "Mọi điểm tham quan và nhà hàng chúng mình biết, xếp theo từng thành phố, kèm mẹo bản địa từ hướng dẫn viên có giấy phép. Cuốn sổ tự mở rộng: bạn tìm một địa điểm trong công cụ lập kế hoạch là nó được ghi vào sổ cho du khách kế tiếp. Chỉ một chạm là đưa thẳng vào chuyến đi của bạn."],
    "When you make it, give a little back.": ["等您成功了，别忘了回馈一点点。", "Cuando te vaya bien, devuelve un poquito.", "잘되셨을 때, 조금만 돌려주시면 돼요.", "Khi bạn thành công, hãy cho lại một chút nhé."],
    "give something to your country.": ["为您的国家出一份力。", "dale algo a tu país.", "여러분의 나라에도 무언가를 나눠 보세요.", "hãy cho đất nước của bạn một điều gì đó nhé."],
    "You give directly to the U.S. Treasury.": ["您的这笔钱会直接交到美国财政部手里。", "Tu donación va directa al Tesoro de EE. UU.", "미국 재무부에 바로 기부하시는 거예요.", "Bạn tặng thẳng cho Bộ Tài chính Hoa Kỳ."],
    "The federal government runs a real program for this,": ["联邦政府专门为此设了一个正式项目，", "El gobierno federal tiene de verdad un programa para esto:", "연방 정부가 이걸 위해 실제로 공식 프로그램을 운영하고 있어요, ", "Chính phủ liên bang thật sự có một chương trình chính thức cho việc này, "],
    ", at the Bureau of the Fiscal Service. Card, bank, or PayPal on Pay.gov.": ["，由财政服务局来负责。在 Pay.gov 上用银行卡、银行账户或 PayPal 都可以。", ", a cargo del Bureau of the Fiscal Service. Con tarjeta, banco o PayPal en Pay.gov.", ", 재무서비스국이 맡아서 운영해요. Pay.gov에서 카드·계좌·PayPal로 하시면 돼요.", ", do Bureau of the Fiscal Service phụ trách. Bạn có thể dùng thẻ, ngân hàng hoặc PayPal trên Pay.gov."],
    "We never touch the money.": ["这笔钱，我们从头到尾都不会经手。", "Nosotros no tocamos el dinero en ningún momento.", "저희는 그 돈에 손도 대지 않아요.", "Chúng mình không hề đụng vào khoản tiền đó."],
    "No account of ours is involved, no cut, no processing, nothing held. The button below leaves this site and lands on the government's own payment page.": ["全程不经过我们的任何账户，不抽成、不代收、也不留存。点下面的按钮就会离开本站，直接进入政府自己的支付页面。", "No interviene ninguna cuenta nuestra, sin comisión, sin procesamiento y sin retener nada. El botón de abajo te saca de este sitio y te lleva a la página de pago del propio gobierno.", "저희 계좌는 전혀 관여하지 않고, 수수료도 처리도 보관도 없어요. 아래 버튼을 누르면 이 사이트를 벗어나 정부의 결제 페이지로 바로 이동해요.", "Không một tài khoản nào của chúng mình dính vào, không hoa hồng, không xử lý, không giữ lại gì cả. Nút bên dưới sẽ đưa bạn rời trang này và tới thẳng trang thanh toán của chính phủ."],
    "Then come back and tell us.": ["之后记得回来告诉我们一声。", "Luego vuelve y cuéntanoslo, ¿vale?", "그런 다음 다시 들러서 알려주세요.", "Rồi ghé lại cho chúng mình biết với nhé."],
    "That's what moves the green zero at the top of this page, the number that counts what this community has given back.": ["这样，页面顶部那个绿色的零才会动起来，它记录着这个社区一共回馈了多少。", "Eso es lo que hace mover el cero verde de la parte de arriba de esta página, el número que cuenta todo lo que esta comunidad ha devuelto.", "그래야 이 페이지 맨 위의 초록색 0이 움직여요, 이 커뮤니티가 지금까지 돌려준 총액을 세는 숫자거든요.", "Chính điều đó làm con số 0 màu xanh ở đầu trang nhích lên, con số đếm tất cả những gì cộng đồng này đã cho lại."],
    "Prefer a check? Make it payable to the": ["更想寄支票？把收款人写成", "¿Prefieres un cheque? Ponlo a nombre de", "수표가 더 편하세요? 수취인은", "Bạn thích gửi séc hơn? Ghi người nhận là"],
    "Self-reported, on your honor. We can't verify a payment we deliberately never see, and we'd rather be honest about that than fake a number.": ["全靠自觉申报，我们说到做到。我们特意不去看这笔付款，所以真的无法核实，与其编个数字给您，不如老实跟您说清楚。", "Es autodeclarado, confiamos en tu palabra. No podemos verificar un pago que a propósito nunca vemos, así que preferimos decírtelo con franqueza en lugar de inventarnos una cifra.", "본인 신고 방식이에요. 저희가 일부러 결제 내용을 보지 않다 보니 확인할 방법이 없어요. 그래서 숫자를 지어내기보다는 솔직하게 말씀드리려고 해요.", "Bạn tự khai báo, chúng mình tin vào sự trung thực của bạn. Chúng mình cố ý không nhìn khoản thanh toán nên không thể kiểm chứng, thà nói thật với bạn còn hơn bịa ra một con số."],
    "No ideas posted yet, be the first to pitch one.": ["还没有人提出点子，来当第一个吧。", "Todavía no hay ideas, anímate a ser el primero en proponer una.", "아직 올라온 아이디어가 없어요, 첫 번째로 제안해 보세요.", "Chưa có ý tưởng nào cả, bạn hãy là người đầu tiên nhé."],
    "Anyone can pitch a business idea here, free, no account needed. Readers back an idea one of two ways: register to": ["任何人都能在这里分享商业点子，免费，也不用注册。读者可以用两种方式支持一个点子：登记", "Cualquiera puede proponer aquí una idea de negocio, gratis y sin cuenta. Los lectores la apoyan de dos maneras: registrarse para", "누구나 여기에서 사업 아이디어를 제안할 수 있어요, 무료이고 계정도 필요 없어요. 읽는 분이 아이디어를 응원하는 방법은 두 가지예요:", "Ai cũng có thể chia sẻ ý tưởng kinh doanh ở đây, miễn phí, không cần tài khoản. Người đọc ủng hộ một ý tưởng theo hai cách: đăng ký để"],
    ". This is a connections board, not a transaction, no money or equity changes hands on this page; Plateau Strategy follows up directly with anyone who registers interest.": ["。这里是一个牵线搭桥的板块，不是交易平台，本页面不涉及任何资金或股权转手；Plateau Strategy 会直接联系每一位登记意向的人。", ". Esto es un tablón para conectar personas, no una transacción, en esta página no cambia de manos ni dinero ni participación; Plateau Strategy se pone en contacto directamente con quien registre su interés.", ". 이곳은 사람과 사람을 잇는 게시판이지 거래하는 곳이 아니에요, 이 페이지에서는 돈이나 지분이 오가지 않고, 관심을 남겨 주신 분께는 Plateau Strategy가 직접 연락드려요.", ". Đây là bảng để kết nối mọi người, không phải nơi giao dịch, không có tiền hay cổ phần đổi chủ trên trang này; Plateau Strategy sẽ liên hệ trực tiếp với ai đăng ký quan tâm."],
    "Practical tools for everyday life, built by our lab, free for everyone. No account, no cost.": ["为日常生活打造的实用工具，都出自我们实验室，人人免费使用。不用注册，也不花钱。", "Herramientas prácticas para el día a día, hechas por nuestro laboratorio y gratis para todos. Sin cuenta y sin coste.", "일상에서 바로 쓰는 실용 도구예요. 저희 랩이 직접 만들었고 누구나 무료로 쓸 수 있어요. 계정도 비용도 필요 없어요.", "Những công cụ thiết thực cho cuộc sống hằng ngày, do lab của chúng mình làm ra, miễn phí cho tất cả mọi người. Không cần tài khoản, không mất phí."],
    "Search any place, if the map does not know it yet, you discover it →": ["搜索任何地点，如果地图还不认识它，那这个新发现就归您了 →", "Busca cualquier lugar, y si el mapa aún no lo conoce, lo descubres tú →", "어떤 장소든 검색해 보세요, 지도가 아직 모르는 곳이라면 회원님이 처음 발견한 거예요 →", "Tìm bất kỳ nơi nào bạn muốn, nếu bản đồ chưa biết chỗ đó, thì chính bạn là người khám phá ra nó →"],
    "In-depth trips written by the guides themselves, a student's hour in Harvard Yard, a food route through one neighborhood, with every stop and how long you stand there, before you book. Guides list their own for free.": ["深度行程都由导游亲手写下，比如哈佛校园里跟学生走的一小时、一个街区里的美食路线，每一站、每站停留多久，下单前都看得清清楚楚。导游可以免费发布自己的行程。", "Viajes a fondo escritos por los propios guías, una hora con un estudiante en Harvard Yard, una ruta gastronómica por un barrio, con cada parada y cuánto tiempo estarás allí, todo antes de reservar. Los guías publican los suyos gratis.", "가이드가 직접 쓴 심층 일정이에요. 하버드 야드에서 학생과 보내는 한 시간, 한 동네를 훑는 맛집 코스처럼요. 예약 전에 방문지 하나하나와 머무는 시간까지 다 볼 수 있어요. 가이드는 자기 일정을 무료로 올릴 수 있어요.", "Những hành trình chuyên sâu do chính hướng dẫn viên viết ra, một giờ cùng sinh viên trong khuôn viên Harvard, một tuyến ẩm thực qua một khu phố, kèm từng điểm dừng và thời gian ở lại mỗi nơi, bạn thấy hết trước khi đặt. Hướng dẫn viên đăng hành trình của mình miễn phí."],
    "Pick your attractions and see which ones you can still reach in time, drive time, traffic and closing hours all checked. Every tap builds your day-one, day-two plan. Designed with a professionally licensed tour guide.": ["挑好想去的景点，立刻就能看出哪些还赶得及，车程、路况和关门时间我们都替您算进去了。您每点一下，第一天、第二天的计划就更清晰一分。这套工具是我们和持证导游一起设计的。", "Elige tus lugares y ve cuáles te da tiempo a alcanzar, comprobamos el tiempo de viaje, el tráfico y los horarios de cierre. Cada toque va armando tu plan del primer y del segundo día. Lo diseñamos junto a un guía con licencia profesional.", "가고 싶은 곳을 고르면 아직 시간 안에 갈 수 있는 곳이 바로 보여요. 이동 시간, 교통, 마감 시간까지 저희가 다 확인해 드려요. 한 번 누를 때마다 첫날, 둘째 날 일정이 차곡차곡 만들어져요. 전문 자격을 가진 가이드와 함께 만들었어요.", "Chọn những điểm bạn thích, bạn thấy ngay nơi nào còn kịp đến, chúng mình kiểm tra hết thời gian lái, giao thông và giờ đóng cửa. Mỗi lần chạm là kế hoạch ngày một, ngày hai lại rõ thêm. Được thiết kế cùng một hướng dẫn viên có giấy phép hành nghề."],
    "Staten Island to Niagara Falls, or any long drive. Give it two points and it finds the fuel, food, rest areas and viewpoints near your actual road, grouped by how many hours in you'll be, so you can plan real breaks instead of scrolling a map.": ["从斯塔滕岛到尼亚加拉大瀑布，或者任何一段长途都行。给它一个起点、一个终点，它就会沿着您真正要走的那条路，帮您找出加油站、餐饮、休息区和观景点，还按开到第几小时分好组，让您能踏踏实实地安排休息，而不是一路划着地图找。", "De Staten Island a las cataratas del Niágara, o cualquier viaje largo. Dale un punto de salida y otro de llegada y te encuentra gasolineras, comida, áreas de descanso y miradores junto a tu carretera de verdad, agrupados por las horas que llevarás al volante, para que planees descansos reales en vez de andar arrastrando un mapa.", "스태튼아일랜드에서 나이아가라 폭포까지, 아니면 어떤 장거리 운전이든 좋아요. 출발지와 도착지만 알려 주면 실제로 지나갈 길 근처의 주유소, 식당, 휴게소, 전망대를 찾아서 몇 시간째인지에 따라 묶어 드려요. 지도를 넘겨 가며 찾는 대신 진짜 쉼표를 계획해 보세요.", "Từ Staten Island tới thác Niagara, hay bất kỳ chặng đường dài nào. Cho một điểm đi và một điểm đến, nó sẽ tìm trạm xăng, đồ ăn, trạm nghỉ và điểm ngắm cảnh gần ngay tuyến đường thật của bạn, nhóm lại theo số giờ đã lái, để bạn sắp xếp những lần nghỉ đúng nghĩa thay vì cứ kéo bản đồ đi tìm."],
    "A curated guidebook of attractions and restaurants, every type of destination, organized by category, with descriptions and local tips. One tap sends any place into the Trip Planner.": ["一本精选的景点与餐厅指南，各类目的地都按类别整理好，还附上介绍和本地人的小贴士。轻轻一点，就能把任意地点送进行程规划。", "Una guía muy cuidada de lugares y restaurantes, con todo tipo de destinos ordenados por categoría, descripciones y consejos de gente local. Con un solo toque envías cualquier lugar al planificador.", "정성껏 고른 명소·맛집 안내서예요. 온갖 여행지를 종류별로 정리하고 설명과 현지 팁까지 담았어요. 한 번만 누르면 어디든 여행 플래너로 쏙 들어가요.", "Cẩm nang tuyển chọn kỹ các điểm tham quan và nhà hàng, đủ mọi kiểu điểm đến, sắp gọn theo danh mục, kèm mô tả và mẹo của người bản địa. Chỉ một chạm là đưa được bất kỳ nơi nào vào công cụ lập kế hoạch."],
    "A prediction clock that never lies to you, weather, markets, your own patterns, every forecast scored against what actually happened. It tells you when it doesn't know. Free while it earns its record ($10/year value).": ["一个从不骗您的预测时钟，天气、市场、还有您自己的生活规律，每一次预测都拿真实结果来打分。碰上没把握的时候，它会老实告诉您。在它一点点积累战绩的这段时间，完全免费（价值每年 10 美元）。", "Un reloj de predicción que nunca te miente, el clima, los mercados, tus propios patrones, y cada pronóstico se puntúa contra lo que de verdad pasó. Y cuando no lo sabe, te lo dice. Gratis mientras se gana su historial (valor de 10 $/año).", "절대 거짓말하지 않는 예측 시계예요. 날씨, 시장, 생활 속 패턴까지, 모든 예측을 실제로 일어난 일과 맞춰 점수를 매겨요. 모를 때는 솔직히 모른다고 말해요. 실적을 쌓아 가는 동안은 무료예요(연 10달러 상당).", "Một chiếc đồng hồ dự báo không bao giờ nói dối bạn, thời tiết, thị trường, cả những thói quen của chính bạn, mọi dự báo đều được chấm điểm theo điều đã thực sự xảy ra. Khi không biết, nó nói thẳng luôn. Miễn phí trong lúc nó gây dựng thành tích (trị giá 10 $/năm)."],
    "We're adding more free daily-life tools here. Have an idea for a tool you'd use every day? Pitch it on the Business Ideas board.": ["我们会在这里持续添加更多免费的生活工具。您有什么每天都想用的工具点子吗？欢迎到商业点子板块说给我们听。", "Seguimos sumando aquí más herramientas gratis para el día a día. ¿Se te ocurre una que usarías a diario? Cuéntanosla en el tablón de Ideas de negocio.", "여기에 일상에서 쓰는 무료 도구를 계속 늘려 가고 있어요. 매일 쓰고 싶은 도구 아이디어가 있으신가요? 사업 아이디어 게시판에 편하게 제안해 주세요.", "Chúng mình vẫn đang thêm dần các công cụ miễn phí cho đời sống hằng ngày ở đây. Bạn có ý tưởng về một công cụ mà mình dùng mỗi ngày không? Cứ đề xuất trên bảng Ý tưởng kinh doanh nhé."],
    "The rules that protect you when you use this site, your data, your money, and your bookings. These are the safeguards that are already in place, in plain language.": ["您在使用本站时受到保护的各项规则，包括您的数据、款项和订单。以下都是已经落实到位的保障措施，我们用平实的话逐条讲清楚。", "Las reglas que te protegen cuando usas este sitio, tus datos, tu dinero y tus reservas. Estas son las salvaguardas que ya están funcionando, contadas en palabras sencillas.", "이 사이트를 쓰실 때 회원님을 지켜 드리는 규칙이에요. 데이터, 돈, 예약에 관한 것들이죠. 이미 시행하고 있는 보호 장치를 쉬운 말로 하나하나 정리했어요.", "Những quy tắc bảo vệ bạn khi dùng trang này, gồm dữ liệu, tiền và các đơn đặt của bạn. Dưới đây là các biện pháp đã đang áp dụng, chúng mình trình bày bằng lời lẽ giản dị."],
    "Financials · customer records · board documents": ["财务 · 客户记录 · 董事会文件", "Finanzas · registros de clientes · documentos del consejo", "재무 · 고객 기록 · 이사회 문서", "Tài chính · hồ sơ khách hàng · tài liệu hội đồng"],
    "The money records, customer information and governance documents are locked behind a private owner login. No one reaches them without those credentials.": ["资金记录、客户信息和治理文件，都锁在所有者的私人登录后面。没有这套凭证，任何人都进不去。", "Los registros de dinero, la información de clientes y los documentos de gobierno interno están guardados tras un acceso privado del propietario. Sin esas credenciales, nadie llega a ellos.", "자금 기록, 고객 정보, 운영 문서는 소유자 전용 로그인 뒤에 잠겨 있어요. 그 로그인 정보가 없으면 누구도 열어 볼 수 없어요.", "Hồ sơ tiền bạc, thông tin khách hàng và tài liệu quản trị đều nằm sau phần đăng nhập riêng của chủ sở hữu. Không có thông tin đăng nhập đó thì không ai chạm tới được."],
    "API keys, tokens and passwords live in encrypted server configuration, never in your browser, never shown on a page, never committed to our code.": ["API 密钥、令牌和密码都存放在加密的服务器配置里，绝不会进入您的浏览器，绝不会显示在页面上，也绝不会写进我们的代码。", "Las claves de API, los tokens y las contraseñas viven en la configuración cifrada del servidor, nunca en tu navegador, nunca a la vista en una página, y nunca en nuestro código.", "API 키, 토큰, 비밀번호는 암호화된 서버 설정 안에 있어요. 브라우저에 들어가는 일도, 페이지에 보이는 일도, 코드에 올라가는 일도 절대 없어요.", "Khóa API, token và mật khẩu nằm trong phần cấu hình máy chủ đã được mã hóa, không bao giờ vào trình duyệt của bạn, không hiện lên trang, và cũng không được đưa vào mã nguồn."],
    "Payments run through Square's PCI-compliant system. We never see or store your full card number, the sensitive part never touches our servers.": ["支付都通过 Square 符合 PCI 标准的系统完成。我们从不查看、也不保存您的完整卡号，最敏感的那部分根本不会经过我们的服务器。", "Los pagos pasan por el sistema de Square, que cumple con PCI. Nunca vemos ni guardamos el número completo de tu tarjeta, y la parte sensible jamás toca nuestros servidores.", "결제는 Square의 PCI 준수 시스템을 거쳐 처리돼요. 저희는 전체 카드번호를 보지도, 저장하지도 않아요. 가장 민감한 부분은 저희 서버에 아예 닿지 않고요.", "Thanh toán chạy qua hệ thống đạt chuẩn PCI của Square. Chúng mình không bao giờ thấy hay lưu số thẻ đầy đủ của bạn, phần nhạy cảm nhất cũng chẳng chạm tới máy chủ của chúng mình."],
    "We invoice for our own service and never hold a customer's funds in escrow. Every payout to a driver or guide takes an explicit owner approval, money never moves on its own.": ["我们只为自己的服务开账单，绝不代管客户的资金。每一笔付给司机或导游的钱，都要经过所有者明确批准，钱绝不会自己动。", "Facturamos por nuestro propio servicio y nunca retenemos en depósito el dinero del cliente. Cada pago a un conductor o a un guía necesita la aprobación explícita del propietario, el dinero nunca se mueve solo.", "저희는 저희 서비스에 대해서만 청구하고, 고객님의 돈을 예치해 두지 않아요. 기사나 가이드에게 나가는 정산은 하나하나 소유자의 명확한 승인을 거쳐요. 돈이 저절로 움직이는 일은 없어요.", "Chúng mình chỉ xuất hóa đơn cho dịch vụ của mình và không bao giờ giữ tiền của khách trong ký quỹ. Mỗi khoản chi cho tài xế hay hướng dẫn viên đều cần chủ sở hữu duyệt rõ ràng, tiền không tự chuyển đi đâu cả."],
    "The Trip Planner and Destination Book store only place names and typical visit times, no personal tracking. Your planned trip stays on your own device until you choose to book.": ["行程规划和目的地手册只保存地点名称和常见停留时间，不会追踪个人信息。在您决定下单之前，您排好的行程只留在自己的设备上。", "El planificador y el Libro de destinos solo guardan nombres de lugares y tiempos habituales de visita, sin seguimiento personal. Tu viaje planificado se queda en tu propio dispositivo hasta que decidas reservar.", "여행 플래너와 여행지 북은 장소 이름과 보통 머무는 시간만 저장해요. 개인을 추적하는 일은 없어요. 예약을 선택하기 전까지, 짜 두신 일정은 본인 기기에만 남아 있어요.", "Công cụ lập kế hoạch và Sổ điểm đến chỉ lưu tên địa điểm và thời gian ghé thăm thường thấy, không theo dõi cá nhân đâu. Hành trình bạn lên vẫn nằm trên thiết bị của bạn cho đến khi bạn quyết định đặt."],
    "Any gift to reduce the national debt goes directly to the U.S. Treasury's own program. We never touch a cent, the button leaves our site for the government's payment page.": ["任何用于减少国债的捐赠，都会直接进入美国财政部自己的项目。这笔钱我们一分也碰不到，点下按钮就会离开本站，前往政府的支付页面。", "Cualquier donativo para reducir la deuda nacional va directo al programa del propio Tesoro de EE. UU. No tocamos ni un centavo, el botón te saca de nuestro sitio hacia la página de pago del gobierno.", "국가 부채를 줄이기 위한 기부는 미국 재무부의 자체 프로그램으로 곧바로 가요. 저희는 단 한 푼도 만지지 않고, 버튼을 누르면 저희 사이트를 떠나 정부 결제 페이지로 넘어가요.", "Mọi khoản tặng để giảm nợ công đều đi thẳng tới chương trình của chính Bộ Tài chính Hoa Kỳ. Chúng mình không chạm tới một xu nào, bấm nút là bạn rời trang của chúng mình để sang trang thanh toán của chính phủ."],
    "This list grows as the site adds features. If a new part of the site handles your data or your money, its safeguard is added here.": ["网站每添一项新功能，这份清单也会跟着变长。只要有新的部分会经手您的数据或您的钱，它的保障措施就会写到这里来。", "Esta lista va creciendo a medida que el sitio suma funciones. Si una parte nueva maneja tus datos o tu dinero, su salvaguarda se añade aquí.", "사이트에 기능이 늘어나면 이 목록도 같이 길어져요. 새로 생긴 부분이 고객님의 데이터나 돈을 다루게 되면, 그에 맞는 안전장치를 여기에 더해 둬요.", "Danh sách này dài thêm mỗi khi trang có tính năng mới. Nếu một phần mới có xử lý dữ liệu hay tiền của bạn, chúng mình sẽ thêm biện pháp bảo vệ của nó vào đây."],
    "An integrated business ecosystem, transportation, real estate and finance in one closed loop, built so revenue compounds instead of leaking away.": ["一个一体化的商业生态，交通、房地产和金融连成一个闭环，让收入不断累积增值，而不是白白流走。", "Un ecosistema de negocios integrado, transporte, inmobiliaria y finanzas en un mismo circuito cerrado, pensado para que los ingresos se multipliquen en lugar de irse escapando.", "하나로 이어진 비즈니스 생태계예요. 교통, 부동산, 금융이 하나의 순환 고리를 이뤄서, 수익이 새어 나가지 않고 복리로 쌓이도록 설계했어요.", "Một hệ sinh thái kinh doanh gắn kết, vận tải, bất động sản và tài chính cùng nằm trong một vòng khép kín, được dựng lên để doanh thu dồn lại và lớn dần thay vì rò rỉ mất."],
    "Building integrated wealth through connected ecosystems.": ["用彼此相连的生态，一起构筑一体化的财富。", "Construimos riqueza integrada a través de ecosistemas conectados entre sí.", "서로 이어진 생태계로 하나로 통합된 부를 만들어 가요.", "Cùng nhau xây dựng của cải gắn kết qua các hệ sinh thái kết nối với nhau."],
    "Business idea, e.g. Mobile EV-detailing fleet for gig drivers": ["你的商业点子，例如：面向零工司机的上门电动车美容车队", "Tu idea de negocio, p. ej. flota móvil de detallado de coches eléctricos para conductores gig", "사업 아이디어, 예: 긱 기사님을 위한 출장 전기차 디테일링 서비스", "Ý tưởng kinh doanh của bạn, ví dụ: đội xe chăm sóc xe điện lưu động cho tài xế tự do"],
    "One code, two ways to earn.": ["一个编号，就有两种赚钱方式。", "Un solo código y dos formas de ganar.", "코드 하나로 두 가지 방법으로 벌 수 있어요.", "Một mã thôi mà có tới hai cách kiếm tiền."],
    "customers and take a commission on every completed ride, or": ["客户，每完成一趟就能拿一次佣金，或者", "clientes y llévate una comisión por cada viaje que se complete, o", "고객을 소개하고 운행이 완료될 때마다 수수료를 받으세요, 또는", "khách hàng và nhận hoa hồng cho mỗi chuyến đi hoàn thành, hoặc"],
    ": write your own in-depth trip and sell it on our": ["：把自己的深度行程写出来，放到我们的", ": crea tu propio viaje a fondo y véndelo en nuestra", ": 나만의 깊이 있는 여행을 직접 써서 저희", ": tự viết hành trình chuyên sâu của riêng bạn và bán trên"],
    ". The same agent code does both. Anyone can join, as an individual or an organization.": ["上出售。同一个代理编号，两件事都能做。无论个人还是机构，都欢迎加入。", ". El mismo código de agente vale para las dos cosas. Puede unirse cualquiera, ya sea como particular o como organización.", ". 같은 에이전트 코드 하나로 두 가지 다 할 수 있어요. 개인이든 단체든 누구나 참여할 수 있어요.", ". Cùng một mã đại lý là làm được cả hai. Dù là cá nhân hay tổ chức, ai cũng tham gia được."],
    "Guides register here too, a student running a campus walk, a driver who knows one neighborhood properly. Your code is what proves the trip was written by a real guide.": ["导游也在这里注册，无论是带校园徒步的学生，还是熟悉某个街区的司机，都可以。您的编号，就是这条行程出自真正导游之手的凭证。", "Los guías también se registran aquí, un estudiante que hace un paseo por el campus, un conductor que conoce un barrio a fondo. Tu código es lo que demuestra que el itinerario lo escribió un guía de verdad.", "가이드도 여기에서 등록해요. 캠퍼스 투어를 이끄는 학생이든, 특정 동네를 훤히 아는 기사님이든 다 좋아요. 회원님의 코드가 바로 그 일정을 진짜 가이드가 썼다는 증거가 돼요.", "Hướng dẫn viên cũng đăng ký ở đây, có thể là một sinh viên dẫn tour quanh khuôn viên, hay một tài xế thuộc lòng một khu phố. Mã của bạn chính là bằng chứng rằng hành trình do một hướng dẫn viên thật soạn ra."],
    "Book any trip for your client, airport, cruise, tour, or a custom day out. It comes straight to our dispatch and your commission is tracked automatically.": ["为您的客户预订任何行程，无论是接送机、邮轮、观光，还是量身定制的一日游。订单会直接进入我们的调度中心，您的佣金也会自动记账。", "Reserva cualquier viaje para tu cliente, aeropuerto, crucero, tour o un día a medida. Llega directo a nuestra central de despacho y tu comisión se registra sola.", "고객을 위해 어떤 일정이든 예약해 보세요, 공항, 크루즈, 투어, 맞춤 하루 코스까지요. 저희 배차로 바로 들어오고 수수료는 자동으로 집계돼요.", "Đặt bất kỳ chuyến nào cho khách của bạn, đón sân bay, du thuyền, tour hay một ngày theo yêu cầu. Đơn tới thẳng bộ phận điều phối của chúng mình và hoa hồng của bạn được ghi nhận tự động."],
    "What does the client want?": ["客户想要什么呢？", "¿Qué es lo que quiere el cliente?", "고객이 원하는 건 무엇인가요?", "Khách hàng của bạn muốn gì nhỉ?"],
    "Request a quote instead, we'll price it and confirm back": ["也可以先索取报价，我们会定好价格再回复确认给您", "Mejor pide un presupuesto, le ponemos precio y te confirmamos", "대신 견적을 요청해 보세요, 가격을 매겨서 다시 알려드릴게요", "Hoặc bạn cứ yêu cầu báo giá, chúng mình sẽ tính giá rồi xác nhận lại cho bạn"],
    "You earn a flat commission on every trip you book that's completed.": ["您预订的每一趟行程，只要顺利完成，就能拿到一笔固定佣金。", "Ganas una comisión fija por cada viaje que reserves y que se complete.", "예약하신 여행이 완료될 때마다 정해진 수수료를 받으세요.", "Cứ mỗi chuyến bạn đặt mà hoàn thành, bạn nhận một khoản hoa hồng cố định."],
    "Other way to be paid? (optional)": ["还有别的收款方式吗？（选填）", "¿Prefieres otra forma de cobro? (opcional)", "다른 수령 방법이 있나요? (선택)", "Bạn có cách nhận tiền nào khác không? (tùy chọn)"],
    "No payout requests yet, when rides complete, your money shows as available here.": ["还没有提现申请。等行程完成后，您的钱就会在这里显示为可提现。", "Aún no hay solicitudes de cobro. Cuando los viajes se completen, tu dinero aparecerá aquí como disponible.", "아직 정산 신청이 없어요. 운행이 완료되면 여기에 출금할 수 있는 금액이 표시돼요.", "Chưa có yêu cầu chi trả nào đâu. Khi các chuyến hoàn tất, tiền của bạn sẽ hiện ở đây để rút."],
    "Referring rides earns a commission. Guiding earns the whole fare, you set it. Write the trip you already know by heart: your stops, how long you actually stand at each one, what you say there, and what it costs. It goes on the public": ["推荐用车，赚的是佣金；亲自带团导览，赚的是整笔团费，价格由您来定。把您早已烂熟于心的那条行程写下来：都有哪些站点、每一站实际会停多久、您在那里会讲些什么、以及收费多少。它会出现在公开的", "Referir viajes te da comisión. Guiar tú mismo te da la tarifa entera, y la fijas tú. Escribe el viaje que ya te sabes de memoria: tus paradas, cuánto tiempo estás de verdad en cada una, qué cuentas allí y cuánto cuesta. Aparecerá en la", "차량을 추천하면 수수료를 받고, 직접 가이드를 하면 요금 전액을 받아요, 가격도 직접 정하시고요. 이미 훤히 꿰고 계신 그 코스를 적어 보세요. 어디를 들르는지, 각 지점에서 실제로 얼마나 머무는지, 거기서 어떤 이야기를 들려주는지, 그리고 비용까지요. 이 내용은 공개된", "Giới thiệu chuyến xe thì bạn nhận hoa hồng. Tự dẫn tour thì bạn nhận trọn tiền tour, và bạn tự định giá. Hãy viết ra hành trình bạn đã thuộc nằm lòng: các điểm dừng, thời gian bạn thực sự ở lại mỗi nơi, điều bạn kể ở đó, và chi phí. Nó sẽ lên"],
    "the moment you list it, and travellers reach you through us, your contact details are never published.": ["上，发布那一刻就能看到；旅客都通过我们来联系您，您的联系方式绝不会被公开。", "en cuanto lo publiques, y los viajeros te contactarán a través de nosotros, tus datos de contacto nunca se hacen públicos.", "여행 페이지에 올리는 순간 바로 뜨고, 여행자는 저희를 통해 회원님께 연락해요, 회원님의 연락처는 절대 공개되지 않아요.", "ngay khi bạn đăng lên, và du khách liên hệ với bạn thông qua chúng mình, thông tin liên hệ của bạn không bao giờ bị công khai."],
    "Your code doubles as your guide credential": ["您的编号，同时也是您的导游身份凭证", "Tu código también te sirve como credencial de guía", "회원님의 코드는 가이드 자격 증명도 겸해요", "Mã của bạn cũng chính là chứng nhận hướng dẫn viên luôn"],
    "This is what proves a real guide wrote the trip.": ["有了它，就能证明这条行程真的出自导游之手。", "Esto es lo que demuestra que quien escribió el viaje fue un guía de verdad.", "이게 바로 그 일정을 진짜 가이드가 썼다는 증거예요.", "Đây chính là bằng chứng cho thấy hành trình được viết bởi một hướng dẫn viên thật."],
    "Every paper trail, bookings, contacts, agreements & paperwork": ["所有的书面记录，订单、联系人、协议和各类文件", "Todo el rastro documental, reservas, contactos, acuerdos y papeleo", "모든 서류 기록, 예약, 연락처, 계약, 그리고 각종 문서", "Mọi giấy tờ để lại, đặt chỗ, liên hệ, thỏa thuận & hồ sơ"],
    "Agents & driver-agents request their earned money here. Send it your way (Zelle / cash / check), then mark it paid, the ledger stays honest. Balances show what each agent can still request.": ["代理人和司机代理都在这里申请自己赚到的钱。您用自己习惯的方式付款（Zelle / 现金 / 支票），付完标记为已支付，账目就一直清清楚楚。余额会显示每位代理还能申请多少。", "Los agentes y los conductores-agentes piden aquí el dinero que han ganado. Págalo a tu manera (Zelle / efectivo / cheque) y márcalo como pagado, así el libro se mantiene fiel. Los saldos te muestran cuánto puede pedir todavía cada agente.", "에이전트와 기사 겸 에이전트가 여기에서 번 돈을 신청해요. 원하는 방식(Zelle / 현금 / 수표)으로 보내 주신 뒤 지급 완료로 표시하면 장부가 늘 정확하게 유지돼요. 잔액은 각 에이전트가 아직 신청할 수 있는 금액을 보여 줘요.", "Đại lý và tài xế kiêm đại lý yêu cầu khoản mình đã kiếm được ngay tại đây. Bạn chi trả theo cách của mình (Zelle / tiền mặt / séc) rồi đánh dấu đã trả, thế là sổ sách luôn khớp. Số dư cho biết mỗi đại lý còn có thể yêu cầu bao nhiêu."],
    "No reservations yet. New bookings from the": ["还没有任何预订。来自", "Aún no hay reservas. Las reservas nuevas de la", "아직 예약이 없어요. ", "Chưa có đặt chỗ nào đâu. Đơn mới từ"],
    "Everything on this site is here to get people out of a hole and into a fortune, the free tools, the work, the trading research. If it works for you, we ask one thing, and only if you want to:": ["这个网站上的一切，免费工具、我们所做的事、交易研究，都是为了帮人从困境里走出来，走向富足。如果它对您有帮助，我们只有一个小小的请求，而且完全出于自愿：", "Todo lo que hay en este sitio existe para sacar a la gente de un mal momento y llevarla a la prosperidad, las herramientas gratuitas, el trabajo, la investigación de trading. Si te funciona, te pedimos una sola cosa, y solo si te apetece:", "이 사이트의 모든 것, 무료 도구, 저희가 하는 일, 트레이딩 연구까지, 모두 사람들을 어려움에서 꺼내 풍요로 이끌기 위해 있어요. 도움이 되셨다면 딱 한 가지만 부탁드릴게요. 물론 원하실 때만요:", "Mọi thứ trên trang này đều nhằm đưa mọi người ra khỏi lúc khó khăn và tới chỗ khá giả, từ các công cụ miễn phí, công việc, đến nghiên cứu giao dịch. Nếu nó có ích cho bạn, chúng mình chỉ xin một điều thôi, và cũng chỉ khi bạn muốn:"],
    "The national debt is measured in trillions; no single gift changes that arithmetic. That isn't the point, the point is the act, and that it's real, voluntary, and goes where we say it goes. Gifts to the United States for exclusively public purposes are generally tax-deductible, but we're not tax advisors, ask yours. Plateau Strategy Solution Lab is not affiliated with, and does not represent, the U.S. Treasury or any government agency.": ["国债是以万亿计的，任何一笔捐赠都改变不了这个数字。但这本来就不是重点，重点在于这个举动本身，在于它真实、自愿，而且确实流向我们所说的地方。为纯公共用途向美国政府所作的捐赠通常可以抵税，不过我们不是税务顾问，具体还请咨询您自己的顾问。Plateau Strategy Solution Lab 与美国财政部或任何政府机构都没有隶属关系，也不代表它们。", "La deuda nacional se mide en billones, y ningún donativo cambia esa cuenta. Pero no va de eso, va del gesto en sí, y de que sea real, voluntario y vaya a donde decimos que va. Los donativos a Estados Unidos con fines exclusivamente públicos suelen desgravar, pero no somos asesores fiscales, así que pregúntale al tuyo. Plateau Strategy Solution Lab no está afiliado al Tesoro de EE. UU. ni a ninguna agencia del gobierno, ni los representa.", "국가 부채는 조 단위예요. 기부 한 번으로 그 숫자가 달라지지는 않죠. 하지만 중요한 건 그게 아니라 행동 그 자체예요. 그것이 실제이고, 자발적이며, 저희가 말씀드린 곳으로 정확히 간다는 사실이요. 오로지 공공 목적으로 미국에 하는 기부는 보통 세금 공제를 받을 수 있지만, 저희는 세무 전문가가 아니니 담당 전문가에게 확인해 보세요. Plateau Strategy Solution Lab은 미국 재무부나 어떤 정부 기관과도 제휴 관계가 없고, 이들을 대표하지도 않아요.", "Nợ công được tính bằng hàng nghìn tỷ, không một khoản tặng lẻ nào thay đổi được phép tính đó. Nhưng vấn đề không nằm ở đó, mà ở chính hành động, và ở chỗ nó có thật, tự nguyện, và đi đúng nơi chúng mình nói. Các khoản tặng cho Hoa Kỳ vì mục đích thuần túy công cộng thường được khấu trừ thuế, nhưng chúng mình không phải cố vấn thuế, nên bạn hãy hỏi cố vấn của mình nhé. Plateau Strategy Solution Lab không liên kết và cũng không đại diện cho Bộ Tài chính Hoa Kỳ hay bất kỳ cơ quan chính phủ nào."],
    "The problem, the business model, how it makes money, and what it needs to launch…": ["要解决什么问题、商业模式是什么、靠什么赚钱，以及启动需要哪些东西…", "El problema, el modelo de negocio, cómo gana dinero y qué hace falta para arrancar…", "어떤 문제를 푸는지, 사업 모델, 어떻게 돈을 버는지, 그리고 시작하는 데 필요한 것…", "Vấn đề cần giải, mô hình kinh doanh, cách kiếm tiền, và cần những gì để khởi động…"],
    "The blueprint (optional): the working detail you do not want public. It stays sealed; a reader must sign in to open it, and every reader is recorded by name.": ["蓝图（可选）：那些你不想公开的具体方案细节。它会被封存起来；读者必须登录才能打开，而且每一位读者都会留下姓名记录。", "El plano (opcional): esos detalles de trabajo que no quieres hacer públicos. Queda sellado, el lector tiene que iniciar sesión para abrirlo, y cada lector queda registrado con su nombre.", "블루프린트(선택): 공개하고 싶지 않은 실무 세부 내용이에요. 봉인된 채로 유지되고, 독자는 로그인해야 열 수 있으며, 열어 본 사람의 이름이 기록돼요.", "Bản thiết kế (tùy chọn): những chi tiết bạn không muốn công khai. Nó được niêm phong lại, người đọc phải đăng nhập mới mở được, và mỗi người đọc đều được ghi lại kèm tên."],
    "Every map on this site, drawn on foot, in one index: measured corridors, honest estimates, and the walks you save under your own sign-in.": ["本站的每一张地图，都是一步步走出来的，全都汇总在这一页索引里：实地测量的通道、老老实实的估算，还有你在自己账号下保存的那些路线。", "Todos los mapas de este sitio, dibujados caminando, reunidos en un solo índice, pasillos medidos, estimaciones honestas y los recorridos que guardas con tu propio inicio de sesión.", "이 사이트의 모든 지도는 직접 걸어 다니며 그린 거예요. 그걸 한 곳의 색인에 모았어요. 실제로 잰 통로, 정직한 추정치, 그리고 본인 계정으로 저장해 둔 산책 경로까지요.", "Mọi bản đồ trên trang này đều được vẽ bằng chính đôi chân, gom lại trong một mục lục, các hành lang đã đo tận nơi, ước tính thành thật, và những chuyến đi bạn lưu bằng tài khoản của mình."],
    "Attach your drawing (optional). A photo of a sketch counts. It stays sealed with the blueprint.": ["可以附上你的图纸（可选）。手绘草图拍张照也行。它会和蓝图一起封存起来。", "Adjunta tu dibujo (opcional). Vale una foto de un boceto. Queda sellado junto con el plano.", "도면을 첨부해 보세요(선택). 스케치를 찍은 사진도 괜찮아요. 블루프린트와 함께 봉인돼요.", "Đính kèm bản vẽ của bạn nhé (tùy chọn). Chụp bản phác thảo gửi lên cũng được. Nó sẽ được niêm phong cùng bản thiết kế."],
    "What you publish here is a public disclosure. In the US that starts a twelve-month clock to file for a patent; in most other countries there is no grace period at all. If your idea is genuinely patentable, see a patent attorney before posting, not after. The sealed blueprint keeps detail off the public page and names everyone who reads it; it is not a patent filing.": ["在这里发布，就等于做了一次公开披露。在美国，公开之后你有十二个月的时间去申请专利；而在其他大多数国家，根本没有任何宽限期。如果你的点子确实有专利价值，请在发布之前就找专利律师聊聊，而不是发完之后才想起。封存的蓝图能让这些细节不出现在公开页面上，还会记录每一位读者的真实姓名；不过它本身并不是专利申请。", "Lo que publicas aquí cuenta como una divulgación pública. En EE. UU. eso arranca un plazo de doce meses para pedir una patente, y en la mayoría de los demás países no hay ningún período de gracia. Si tu idea de verdad se puede patentar, habla con un abogado de patentes antes de publicar, no después. El plano sellado mantiene los detalles fuera de la página pública y registra el nombre de cada lector, pero no es una solicitud de patente.", "여기에 올리는 것은 공개 공표에 해당해요. 미국에서는 공개한 순간부터 특허 출원까지 12개월이 카운트되기 시작하고, 다른 나라 대부분은 유예 기간이 아예 없어요. 아이디어에 정말 특허 가능성이 있다면 게시하고 나서가 아니라 게시하기 전에 특허 변호사와 먼저 상담해 보세요. 봉인된 블루프린트는 세부 내용을 공개 페이지에 노출하지 않고 열람한 분들의 이름을 남기지만, 특허 출원을 대신해 주지는 않아요.", "Những gì bạn đăng ở đây được xem là một công bố công khai. Tại Mỹ, điều đó bắt đầu tính thời hạn mười hai tháng để nộp đơn xin cấp bằng sáng chế, còn ở hầu hết các nước khác thì chẳng có thời gian ân hạn nào cả. Nếu ý tưởng của bạn thật sự có thể được cấp bằng, hãy gặp luật sư sáng chế trước khi đăng, chứ đừng để sau. Bản thiết kế niêm phong giữ các chi tiết nằm ngoài trang công khai và ghi lại tên mọi người đọc, nhưng nó không phải là đơn xin cấp bằng sáng chế."],
    "A sealed blueprint travels with this idea. Open it from the idea page; sign-in required, every reader recorded by name.": ["这个点子随附一份封存的蓝图。想看的话请到点子页面打开；需要登录，而且每位读者都会记录姓名。", "Esta idea viene con un plano sellado. Ábrelo desde la página de la idea, hace falta iniciar sesión, y cada lector queda registrado con su nombre.", "이 아이디어에는 봉인된 블루프린트가 딸려 있어요. 아이디어 페이지에서 열어 보세요. 로그인이 필요하고, 열어 본 분의 이름이 기록돼요.", "Ý tưởng này đi kèm một bản thiết kế niêm phong. Bạn mở nó từ trang ý tưởng nhé, cần đăng nhập, và mỗi người đọc đều được ghi lại kèm tên."],
    "Car seat, extra luggage, meet & greet, accessibility…": ["儿童座椅、多带行李、接机举牌、无障碍需求…", "Silla para niños, equipaje de más, recibimiento con cartel, accesibilidad…", "카시트, 짐 추가, 마중 서비스, 이동 편의…", "Ghế trẻ em, thêm hành lý, đón có bảng tên, hỗ trợ đi lại…"],
    "Trip Planner, Plateau Strategy Solution Lab": ["行程规划, Plateau Strategy Solution Lab", "Planificador de viaje, Plateau Strategy Solution Lab", "여행 플래너, Plateau Strategy Solution Lab", "Lập kế hoạch chuyến đi, Plateau Strategy Solution Lab"],
    "Two hours inside the Yard with someone who studies here, the statue that lies three times, why the gates are numbered, what the freshman dorms are actually like, and the reading room most tours never enter.": ["跟一位真正在这里念书的人，在哈佛园里待上两个小时，看看那尊“说了三个谎”的雕像、听听校门为什么要编号、新生宿舍到底什么样，还有大多数旅行团从没进过的那间阅览室。", "Dos horas dentro del Yard con alguien que estudia aquí, la estatua que miente tres veces, por qué las verjas llevan número, cómo son de verdad las residencias de primer año y la sala de lectura en la que casi ningún tour llega a entrar.", "이곳에서 실제로 공부하는 사람과 함께 하버드 야드에서 보내는 두 시간이에요. 세 번 거짓말하는 동상, 문에 번호가 붙은 이유, 신입생 기숙사의 진짜 모습, 그리고 웬만한 투어는 들어가지 않는 열람실까지 함께 둘러봐요.", "Hai giờ trong khuôn viên Harvard cùng một người đang thực sự học ở đây, bức tượng nói dối ba lần, vì sao các cổng lại được đánh số, ký túc xá năm nhất thật ra thế nào, và cả phòng đọc mà hầu hết các tour chẳng bao giờ bước vào."],
    "Plateau Strategy Deflator, Automated Trading Research": ["Plateau Strategy Deflator，自动化交易研究", "Plateau Strategy Deflator, Investigación de trading automatizado", "Plateau Strategy Deflator, 자동 매매 연구", "Plateau Strategy Deflator, Nghiên cứu giao dịch tự động"],
    ", fighting inflation with disciplined, self-learning automation.": ["，用有纪律、会自我学习的自动化来对抗通胀。", ", plantando cara a la inflación con automatización disciplinada que aprende sola.", ", 원칙을 지키며 스스로 배우는 자동화로 인플레이션에 맞서요.", ", chống lạm phát bằng tự động hóa có kỷ luật, biết tự học."],
    "The system is currently trading only its founder's own capital while it builds an audited, honest track record.": ["现在这套系统只用创始人自己的资金来交易，一边慢慢积累一份可审计、真实透明的业绩记录。", "Por ahora el sistema opera solo con el capital del propio fundador, mientras va construyendo un historial auditado y sincero.", "지금 이 시스템은 감사 가능한 정직한 실적을 쌓아가는 동안 창업자 본인의 자금만으로 매매해요.", "Hiện tại hệ thống chỉ giao dịch bằng chính vốn của người sáng lập, trong khi dần dần xây dựng một hồ sơ thành tích trung thực và có thể kiểm toán."],
    ", realized plus unrealized, fees included. No vanity win-rates. When results are published, they will be the real number.": ["衡量，已实现的加上未实现的，手续费也算进去。我们不做那种好看的胜率。等到公布结果的那天，给出的就是真实的数字。", ", lo realizado más lo no realizado, con las comisiones incluidas. Nada de tasas de acierto para presumir. Cuando publiquemos los resultados, será la cifra de verdad.", "로 측정해요, 실현 손익에 미실현 손익까지 더하고 수수료도 다 포함해요. 보기 좋으라고 만든 승률 같은 건 없어요. 결과를 공개하는 날, 그게 바로 진짜 숫자예요.", ", cả phần đã hiện thực hóa lẫn chưa hiện thực hóa, đã tính cả phí. Không có tỷ lệ thắng làm màu đâu. Khi công bố, đó sẽ là con số thật."],
    "Nothing published yet. This moves only when verified results go public.": ["还没有公开任何内容。只有当经过验证的结果公布出来时，这里才会更新。", "Todavía no hemos publicado nada. Esto solo cambia cuando se hacen públicos resultados verificados.", "아직 공개된 게 없어요. 검증된 결과가 공개될 때에만 여기가 바뀌어요.", "Vẫn chưa công bố gì cả. Mục này chỉ thay đổi khi có kết quả đã kiểm chứng được công khai."],
    "Leave your email and you'll be notified when the verified track record is published. No spam, no sales pitch, one update when the numbers are real.": ["留个邮箱，等经过验证的业绩记录发布时，我们会第一时间通知你。不发垃圾邮件，也不推销，等数字是真的了，就发这一封更新。", "Déjanos tu correo y te avisaremos en cuanto publiquemos el historial verificado. Sin spam ni discursos de venta, una sola actualización cuando las cifras sean de verdad.", "이메일만 남겨 주시면 검증된 실적이 공개될 때 바로 알려드려요. 스팸도 영업도 없어요, 숫자가 진짜가 되는 날 딱 한 번만 소식 전해드려요.", "Bạn để lại email, khi hồ sơ thành tích đã kiểm chứng được công bố là chúng mình báo ngay. Không spam, không chào mời, chỉ một thông báo duy nhất khi các con số là thật."],
    "This page describes an internal research project of Plateau Strategy Solution Lab. It is": ["这个页面讲的是 Plateau Strategy Solution Lab 的一个内部研究项目。它", "Esta página habla de un proyecto de investigación interno de Plateau Strategy Solution Lab. No es", "이 페이지는 Plateau Strategy Solution Lab의 내부 연구 프로젝트를 소개해요. 이건", "Trang này nói về một dự án nghiên cứu nội bộ của Plateau Strategy Solution Lab. Đây"],
    "not an offer to sell, or a solicitation to buy, any security, investment product, or advisory service": ["并不是要向你出售任何证券、投资产品或顾问服务，也不是在邀请你购买", "una oferta de venta, ni una invitación a comprar, ningún valor, producto de inversión o servicio de asesoría", "어떤 증권이나 투자상품, 자문 서비스를 팔려는 제안도, 사라고 권하는 것도 아니에요", "không phải lời chào bán, cũng không phải lời mời mua bất kỳ chứng khoán, sản phẩm đầu tư hay dịch vụ tư vấn nào"],
    ", this page exists so you can follow the research.": ["，这个页面存在的意义，只是让你能一路跟进这项研究。", ", esta página está aquí simplemente para que puedas seguir la investigación.", ", 이 페이지는 그저 연구를 곁에서 지켜보실 수 있도록 마련한 거예요.", ", trang này có mặt ở đây chỉ để bạn tiện theo dõi nghiên cứu."],
    "🕐 The Factor Clock · for anyone who wants an honest forecast": ["🕐 因子时钟 · 送给每一个想要诚实预测的人", "🕐 El Reloj de Factores · para cualquiera que quiera un pronóstico honesto", "🕐 팩터 클록 · 정직한 예측을 바라는 모든 분께", "🕐 Đồng hồ Nhân tố · dành cho bất kỳ ai muốn một dự báo trung thực"],
    "A prediction clock that never lies to you.": ["一个从不对你说谎的预测时钟。", "Un reloj de predicciones que nunca te miente.", "절대 거짓말하지 않는 예측 시계예요.", "Một chiếc đồng hồ dự báo không bao giờ nói dối bạn."],
    "Weather, markets, your own patterns, every forecast scored against what actually happened. It tells you when it": ["天气、市场、你自己的生活规律，每一次预测都会拿真实发生的结果来打分。当它", "Clima, mercados, tus propios patrones: cada pronóstico se puntúa contra lo que de verdad pasó. Te dice cuándo", "날씨, 시장, 생활 속 패턴까지, 모든 예측을 실제 결과와 대조해서 채점해요. 잘 모를 때는", "Thời tiết, thị trường, thói quen của chính bạn, mọi dự báo đều được chấm điểm dựa trên điều đã thực sự xảy ra. Nó nói cho bạn biết khi nào nó"],
    "know, and it's evolving with everyone who uses it.": ["，它就会如实告诉你；而且它会随着每一位使用它的人一起成长。", "lo sabe, y va evolucionando con todos los que lo usan.", " 솔직히 말해 줘요. 그리고 쓰는 분들과 함께 점점 발전해 가요.", "biết, và nó ngày càng hoàn thiện cùng tất cả những người dùng nó."],
    "Every morning, one plain-language read of your day, and it clearly labels a guess a guess, and an earned answer earned.": ["每天早上，用平实的语言帮你把这一天读一遍；是猜的就老老实实说是猜的，是靠验证得来的答案，也会照实标明。", "Cada mañana, una lectura de tu día en lenguaje sencillo, que deja claro qué es una suposición y qué es una respuesta que se ha ganado.", "매일 아침, 하루를 쉬운 말로 정리해 드려요. 추측은 추측이라고, 검증을 거친 답은 그렇다고 분명하게 표시해요.", "Mỗi sáng, một bản đọc ngắn gọn về ngày của bạn bằng lời lẽ giản dị, chỗ nào là phỏng đoán thì nói thẳng là phỏng đoán, chỗ nào đã được kiểm chứng thì cũng ghi rõ đúng như vậy."],
    "Log your own life, a shift, a drive, a habit, and it finds your patterns. Your data stays on your device. It gets sharper the longer you own it.": ["记录下你自己的生活，一个班次、一趟车、一个小习惯，它就能帮你找出其中的规律。你的数据只留在你自己的设备上。你用得越久，它就越懂你。", "Registra tu día a día, un turno, un trayecto, un hábito, y encuentra tus patrones. Tus datos se quedan en tu dispositivo. Cuanto más tiempo lo uses, más afinado se vuelve.", "일상을 기록해 보세요, 근무든 운전이든 사소한 습관이든요. 그러면 패턴을 찾아내 드려요. 데이터는 본인 기기에만 남아요. 오래 쓸수록 점점 더 정확해져요.", "Cứ ghi lại cuộc sống của bạn, một ca làm, một chuyến lái, một thói quen, rồi nó tìm ra quy luật của bạn. Dữ liệu luôn nằm lại trên thiết bị của bạn. Càng dùng lâu, nó càng nhạy bén hơn."],
    "The one thing nobody else ships: honest uncertainty": ["别家都不愿意给的那一样东西：诚实的不确定性", "Lo único que nadie más te da: incertidumbre honesta", "다른 곳은 절대 내놓지 않는 단 하나, 정직한 불확실성", "Điều duy nhất mà không nơi nào khác chịu đưa ra: sự bất định trung thực"],
    "Straight talk, because that's the whole point.": ["有话直说，因为这本来就是最要紧的地方。", "Hablar claro, porque de eso se trata.", "솔직하게 말해요. 그게 핵심이니까요.", "Nói thẳng, vì đó chính là điểm mấu chốt."],
    "The Factor Clock is early. Its world library is real and proven; its power to read": ["因子时钟还处在很早的阶段。它的世界资料库是真实、经过验证的；而它读懂", "El Reloj de Factores está dando sus primeros pasos. Su biblioteca del mundo es real y está probada; su capacidad de leer", "팩터 클록은 아직 초기 단계예요. 세계 라이브러리는 실재하고 검증도 됐지만,", "Đồng hồ Nhân tố vẫn còn ở giai đoạn đầu. Thư viện thế giới của nó là thật và đã được kiểm chứng; còn khả năng đọc"],
    "life grows as you use it. That's exactly why it's": ["的生活的能力，要靠你使用才会慢慢成长。这也正是它现在", "vida crece a medida que lo usas. Justo por eso ahora es", "삶을 읽는 능력은 쓰실수록 자라나요. 그래서 지금은", "cuộc sống của bạn lớn dần lên khi bạn dùng. Chính vì thế mà hiện giờ nó"],
    "The daily brief + the growing library of proven sources": ["每天的简报 + 不断扩充的可信来源库", "El resumen diario + la biblioteca, cada vez mayor, de fuentes probadas", "매일 오는 브리핑 + 점점 커지는 검증된 출처 라이브러리", "Bản tóm tắt mỗi ngày + thư viện nguồn đã kiểm chứng ngày một lớn thêm"],
    "Your own private life-tracking & personal predictions": ["只属于你的私密生活记录和个人预测", "Tu registro de vida privado y tus predicciones personales", "나만의 비공개 생활 기록과 개인 예측", "Việc theo dõi đời sống riêng tư & những dự báo cá nhân của riêng bạn"],
    "Full access as each piece ships, no card required": ["每上线一项功能，你都能完整使用，不用绑卡", "Acceso completo a cada parte que lanzamos, sin tarjeta", "새 기능이 나올 때마다 전부 이용하실 수 있어요, 카드도 필요 없어요", "Dùng trọn mỗi phần ngay khi ra mắt, không cần thẻ"],
    "Founding members lock in, you'll never pay more than $10": ["创始会员锁定价格，你永远都不会付超过 10 美元", "Los miembros fundadores fijan el precio: nunca pagarás más de 10 $", "파운딩 멤버는 가격이 고정돼요, 10달러보다 더 내실 일은 절대 없어요", "Thành viên sáng lập được khóa giá, bạn sẽ không bao giờ trả quá 10 $"],
    ", $10/year value, founding members lock it in free.": ["，价值每年 10 美元，创始会员可以免费锁定。", ", valor de 10 $/año, los miembros fundadores lo fijan gratis.", ", 연 10달러 상당인데, 파운딩 멤버는 무료로 고정해 드려요.", ", trị giá 10 $/năm, còn thành viên sáng lập thì khóa lại miễn phí."],
    "No payment now · we'll email you when it's ready": ["现在不用付费 · 准备好了我们会发邮件告诉你", "Sin pago ahora · te escribiremos cuando esté listo", "지금은 결제 없어요 · 준비되면 이메일로 알려드릴게요", "Chưa phải trả gì · khi sẵn sàng chúng mình sẽ gửi email cho bạn"],
    "The Factor Clock provides probabilistic forecasts and personal decision-support for informational purposes only. It is": ["因子时钟提供的是概率性的预测和个人决策辅助，仅供参考。它", "El Reloj de Factores ofrece pronósticos probabilísticos y apoyo a decisiones personales solo con fines informativos. No constituye", "팩터 클록은 확률적 예측과 개인 의사결정 도움을 오직 정보 제공 목적으로만 드려요. 이건", "Đồng hồ Nhân tố cung cấp dự báo xác suất và hỗ trợ quyết định cá nhân chỉ nhằm mục đích thông tin. Đây"],
    "not financial, investment, medical, legal, or professional advice": ["并不构成金融、投资、医疗、法律或任何专业建议", "asesoramiento financiero, de inversión, médico, legal ni profesional", "재무·투자·의료·법률, 그 어떤 전문 자문도 아니에요", "không phải lời khuyên tài chính, đầu tư, y tế, pháp lý hay chuyên môn"],
    "Conviction is how strongly the founder believes in this system, not a return, a win rate, or a projection. The record beneath it is the honest counterweight: until results are published and measured as True Net, it stays at zero.": ["信念，指的是创始人有多相信这套系统，它不是收益率，不是胜率，也不是预测。下面那份记录就是诚实的对照：在结果公开、并用“真实净值”衡量之前，它会一直停在零。", "La convicción es lo mucho que el fundador cree en este sistema, no una rentabilidad, ni una tasa de acierto, ni una proyección. El registro que aparece debajo es el contrapeso honesto: hasta que se publiquen los resultados y se midan como Neto Real, se queda en cero.", "확신이란 창업자가 이 시스템을 얼마나 믿는지를 뜻해요, 수익률도 승률도 전망도 아니에요. 그 아래 기록이 바로 정직한 균형추예요. 결과가 공개되고 실질 순손익으로 측정되기 전까지는 계속 0으로 남아 있어요.", "Niềm tin là mức độ người sáng lập tin vào hệ thống này, chứ không phải lợi nhuận, tỷ lệ thắng hay dự phóng. Hồ sơ bên dưới chính là đối trọng trung thực: cho tới khi kết quả được công bố và đo bằng Lãi ròng thật, nó vẫn nằm ở mức không."],
    "Buys Chainlink dips only inside a data-defined value zone (90-day market structure), with hard rules a human can't hold at 2am: depth gates, cooldowns, position caps.": ["只在数据划定的价值区间内（90 天市场结构）买入 Chainlink 的回调，并严格执行那些人在凌晨两点很难守住的硬规则：深度闸门、冷却期、仓位上限。", "Compra las caídas de Chainlink solo dentro de una zona de valor definida por datos (estructura de mercado de 90 días), con reglas estrictas que una persona no logra mantener a las 2 de la mañana: filtros de profundidad, tiempos de espera y topes de posición.", "데이터로 정한 가치 구간(90일 시장 구조) 안에서만 체인링크의 하락을 매수하고, 새벽 2시에 사람이라면 지키기 힘든 엄격한 규칙을 그대로 따라요: 깊이 게이트, 쿨다운, 포지션 상한이에요.", "Chỉ mua các nhịp giảm của Chainlink trong vùng giá trị do dữ liệu xác định (cấu trúc thị trường 90 ngày), theo những quy tắc cứng mà con người khó lòng giữ nổi lúc 2 giờ sáng: ngưỡng độ sâu, thời gian chờ và giới hạn vị thế."],
    "The order engine calibrates itself from every single trade outcome, tightening or deepening its bids automatically, and every layer of the system is audited against real exchange fees.": ["下单引擎会从每一笔交易的结果里自我校准，自动收紧或压低报价，而系统的每一层，都要按交易所真实的手续费来接受核查。", "El motor de órdenes se calibra a partir del resultado de cada operación, ajustando o profundizando sus pujas de forma automática, y cada capa del sistema se audita frente a las comisiones reales del exchange.", "주문 엔진은 거래 하나하나의 결과로 스스로를 보정해서 호가를 자동으로 좁히거나 낮추고, 시스템의 모든 층은 거래소의 실제 수수료를 기준으로 감사를 받아요.", "Bộ máy đặt lệnh tự hiệu chỉnh từ kết quả của từng giao dịch một, tự động thắt chặt hoặc hạ sâu giá đặt, và mọi lớp của hệ thống đều được kiểm toán dựa trên phí sàn thực tế."],
    ". No customer funds are accepted or managed. Cryptocurrency is highly volatile and you can lose the entire amount you put at risk. Past performance, once published, will not guarantee future results.": ["。我们不接受、也不管理任何客户资金。加密货币波动极大，你投入的钱有可能全部亏光。过往业绩即便日后公开，也不能保证未来的结果。", ". No aceptamos ni gestionamos fondos de clientes. Las criptomonedas son muy volátiles y puedes perder todo el importe que pongas en riesgo. El rendimiento pasado, una vez publicado, no garantizará resultados futuros.", ". 고객 자금은 받지도, 운용하지도 않아요. 암호화폐는 변동성이 아주 크고, 투입한 금액을 전부 잃을 수도 있어요. 과거 성과는 나중에 공개되더라도 미래 결과를 보장하지 않아요.", ". Chúng mình không nhận cũng không quản lý tiền của khách. Tiền mã hóa biến động rất mạnh và bạn có thể mất toàn bộ số tiền đã bỏ ra. Hiệu suất trong quá khứ, dù có được công bố, cũng không bảo đảm kết quả tương lai."],
    "Proven forecasters, two independent weather oracles, a real-money crowd, and more, each trusted only after it beats chance on thousands of real outcomes.": ["经过检验的预测源、两个各自独立的天气预言机、一群押上真金白银的人，还有更多，每一个都得在成千上万条真实结果上跑赢随机，我们才会采信。", "Pronosticadores probados, dos oráculos meteorológicos independientes, una multitud que apuesta dinero real y más, cada uno aceptado solo después de superar al azar en miles de resultados reales.", "검증된 예측원, 서로 독립된 두 개의 날씨 오라클, 진짜 돈이 걸린 군중, 그리고 그 밖에도 여럿이에요. 하나하나가 수천 건의 실제 결과에서 우연을 이겨낸 뒤에야 신뢰해요.", "Những nguồn dự báo đã được kiểm chứng, hai oracle thời tiết độc lập, một đám đông đặt tiền thật, và còn nữa, mỗi nguồn chỉ được tin sau khi vượt qua ngẫu nhiên trên hàng nghìn kết quả thực."],
    "Every prediction app fakes confidence. This one refuses to. It says “87%, and here's my track record”, or “I don't know, and here's the proof nobody does.” It even keeps a quantum random number generator on the bench under identical rules: if pure randomness ever scores as skilled, it flags itself as broken. That's a tool you can actually trust.": ["每一款预测应用都在假装自己很有把握。这一款偏不。它会说“87%，这是我的历史战绩”，或者“我不知道，而且这是没有人能确定的证据”。它甚至让一台量子随机数发生器在完全相同的规则下一起上场：要是纯粹的随机居然被评成“有本事”，它就会把自己标记为出了故障。这才是一个你真正信得过的工具。", "Todas las apps de predicción fingen seguridad. Esta se niega a hacerlo. Dice «87 %, y aquí está mi historial», o «no lo sé, y aquí está la prueba de que nadie lo sabe». Incluso mantiene en el banquillo un generador cuántico de números aleatorios con las mismas reglas: si el puro azar llegara a puntuar como habilidad, se marca a sí misma como averiada. Esa sí es una herramienta en la que puedes confiar de verdad.", "예측 앱은 하나같이 자신감을 꾸며내요. 그런데 이 앱은 그러길 거부해요. “87%, 그리고 이게 제 실적이에요”라고 하거나, “저도 몰라요, 그리고 아무도 모른다는 증거가 여기 있어요”라고 말해요. 심지어 똑같은 규칙으로 양자 난수 생성기를 벤치에 같이 올려둬요. 만약 순수한 무작위가 실력 있는 것처럼 채점된다면, 스스로 고장 났다고 표시해요. 그래야 정말로 믿을 수 있는 도구니까요.", "Ứng dụng dự báo nào cũng giả vờ tự tin. Riêng ứng dụng này thì không chịu làm vậy. Nó nói “87%, và đây là thành tích của mình”, hoặc “mình không biết, và đây là bằng chứng chẳng ai biết cả”. Nó thậm chí còn để một bộ sinh số ngẫu nhiên lượng tử ngồi dự bị với đúng luật chơi đó: nếu sự ngẫu nhiên thuần túy mà lại được chấm là có kỹ năng, nó tự đánh dấu mình bị hỏng. Đó mới là công cụ bạn thật sự tin được."],
    ", we'd rather you use it, feed it your own patterns, and watch it earn your trust than pay for a promise. When it's proven it'll be $10 a year; get in now and you lock that in.": ["，比起让你为一个承诺先掏钱，我们更希望你先用起来，把自己的规律喂给它，看着它一点一点赢得你的信任。等它证明了自己，价格是每年 10 美元；现在加入，就能锁定这个价。", ", preferimos que lo uses, le des tus propios patrones y veas cómo se gana tu confianza, antes que pagar por una promesa. Cuando esté probado costará 10 $ al año; entra ahora y lo dejas fijado.", ", 약속에 미리 돈을 내기보다, 직접 써 보고 생활 속 패턴을 알려주면서 신뢰를 얻어가는 모습을 지켜봐 주시면 좋겠어요. 검증되면 연 10달러가 되는데, 지금 합류하시면 그 가격이 그대로 고정돼요.", ", thay vì trả tiền cho một lời hứa, chúng mình mong bạn cứ dùng thử, cho nó biết thói quen của bạn và xem nó dần chiếm được lòng tin. Khi đã chứng minh được, giá sẽ là 10 $/năm; tham gia ngay bây giờ là bạn khóa được mức đó."],
    ", and no outcome is guaranteed, predictions can be wrong. You are responsible for your own decisions. Your personal data stays on your own device. © Plateau Strategy Solution Lab.": ["，我们也不保证任何结果，预测有可能出错。你自己的决定由你自己负责。你的个人数据只留在你自己的设备上。© Plateau Strategy Solution Lab。", ", y no se garantiza ningún resultado: las predicciones pueden equivocarse. Tú eres responsable de tus propias decisiones. Tus datos personales se quedan en tu propio dispositivo. © Plateau Strategy Solution Lab.", ", 어떤 결과도 보장하지 않아요, 예측은 틀릴 수도 있어요. 결정에 대한 책임은 본인에게 있어요. 개인 데이터는 본인 기기에만 남아요. © Plateau Strategy Solution Lab.", ", và không kết quả nào được bảo đảm, dự báo có thể sai. Bạn tự chịu trách nhiệm cho quyết định của mình. Dữ liệu cá nhân của bạn ở lại trên chính thiết bị của bạn. © Plateau Strategy Solution Lab."],
    "Address lookup unavailable right now, drag the black pin instead.": ["地址查询暂时用不了，你可以直接拖动那个黑色的标记。", "Ahora mismo no funciona la búsqueda de direcciones, arrastra el marcador negro.", "지금은 주소 검색이 안 돼요, 대신 검은색 핀을 끌어서 옮겨 보세요.", "Hiện chưa tra cứu được địa chỉ, bạn hãy kéo ghim đen thay cho nó nhé."],
    "Build a route first, then offer it for sale.": ["先把一条路线排好，再挂出来出售吧。", "Crea primero una ruta y luego ponla a la venta.", "먼저 경로를 하나 만든 다음에 판매로 올려 보세요.", "Bạn tạo lộ trình trước đã, rồi hãy rao bán nhé."],
    "Could not record that just now, please try again in a moment.": ["刚才没能记录下来，麻烦你过一会儿再试一次。", "No pudimos registrarlo ahora mismo, inténtalo de nuevo en un momento.", "방금은 기록이 안 됐어요, 잠시 뒤에 다시 시도해 주세요.", "Lúc này chưa ghi lại được, bạn thử lại sau một chút nhé."],
    "Enter a location first, type where you want to go, then choose.": ["先输入一个地点，把你想去的地方打上去，再来选择。", "Primero escribe un lugar, teclea adónde quieres ir y luego elige.", "먼저 장소를 입력해 주세요, 가고 싶은 곳을 적은 다음에 골라 보세요.", "Bạn nhập địa điểm trước nhé, gõ nơi mình muốn đến rồi hãy chọn."],
    "Enter a location first, then choose.": ["先输入一个地点，再来选择。", "Escribe primero un lugar y luego elige.", "먼저 장소를 입력한 다음에 골라 보세요.", "Bạn nhập địa điểm trước rồi hãy chọn nhé."],
    "Itinerary copied, paste it anywhere.": ["行程已经复制好了，随便粘到哪里都行。", "Itinerario copiado, pégalo donde quieras.", "일정을 복사했어요, 어디든 붙여넣으면 돼요.", "Đã sao chép lịch trình rồi, bạn dán vào đâu cũng được."],
    "Nothing to copy yet, add a stop first.": ["现在还没有可以复制的内容，先加上一站吧。", "Todavía no hay nada que copiar, añade primero una parada.", "아직 복사할 내용이 없어요, 먼저 방문지를 하나 추가해 보세요.", "Chưa có gì để sao chép đâu, bạn thêm một điểm dừng trước đã nhé."],
    "Nothing to print yet, add a stop first.": ["现在还没有可以打印的内容，先加上一站吧。", "Todavía no hay nada que imprimir, añade primero una parada.", "아직 인쇄할 내용이 없어요, 먼저 방문지를 하나 추가해 보세요.", "Chưa có gì để in đâu, bạn thêm một điểm dừng trước đã nhé."],
    "Nothing to share yet, add a stop first.": ["现在还没有可以分享的内容，先加上一站吧。", "Todavía no hay nada que compartir, añade primero una parada.", "아직 공유할 내용이 없어요, 먼저 방문지를 하나 추가해 보세요.", "Chưa có gì để chia sẻ đâu, bạn thêm một điểm dừng trước đã nhé."],
    "Remove it from the trip first (Undo).": ["先把它从行程里移除吧（撤销）。", "Quítalo primero del viaje (Deshacer).", "먼저 일정에서 빼 주세요 (되돌리기).", "Bạn xóa khỏi chuyến đi trước đã nhé (Hoàn tác)."],
    "Search unavailable right now, try again.": ["搜索暂时用不了，请再试一次。", "Ahora mismo la búsqueda no funciona, inténtalo de nuevo.", "지금은 검색이 안 돼요, 다시 한번 시도해 주세요.", "Hiện chưa tìm kiếm được, bạn thử lại nhé."],
    "Start moved to where you are, the far-distance options are below the map.": ["起点已经挪到你现在的位置了，远距离的选项就在地图下面。", "Movimos el punto de partida a donde estás, las opciones de larga distancia están debajo del mapa.", "출발지를 지금 계신 위치로 옮겼어요, 장거리 옵션은 지도 아래쪽에 있어요.", "Điểm xuất phát đã chuyển tới chỗ bạn đang đứng, các lựa chọn đường dài nằm ngay dưới bản đồ."],
    "This browser can’t share location, drag the black pin or type your pickup on the booking form.": ["这个浏览器没法共享位置，你可以拖动黑色标记，或者在预订表单里填上上车地点。", "Este navegador no puede compartir tu ubicación, arrastra el marcador negro o escribe tu punto de recogida en el formulario de reserva.", "이 브라우저는 위치 공유가 안 돼요, 검은색 핀을 끌거나 예약 양식에 픽업 위치를 적어 주세요.", "Trình duyệt này không chia sẻ được vị trí, bạn hãy kéo ghim đen hoặc gõ điểm đón vào biểu mẫu đặt chỗ nhé."],
    "could not reach the attraction lists just now": ["暂时连不上景点清单", "ahora mismo no pudimos acceder a las listas de atracciones", "지금은 명소 목록에 연결이 안 돼요", "hiện chưa kết nối được tới danh sách điểm tham quan"],
    "finding the places people travel here to see…": ["正在帮你找那些大家专程赶来看的地方…", "buscando los lugares por los que la gente viaja hasta aquí…", "사람들이 일부러 여기까지 찾아와 보는 곳을 찾는 중…", "đang tìm những nơi người ta lặn lội tới đây để xem…"],
    "Serving Seattle & Seattle, Tacoma International (SEA)": ["服务西雅图，以及西雅图-塔科马国际机场（SEA）", "Damos servicio a Seattle y al aeropuerto Seattle, Tacoma (SEA)", "시애틀과 시애틀, 타코마 국제공항(SEA)까지 운행해요", "Phục vụ Seattle & sân bay quốc tế Seattle, Tacoma (SEA)"],
    "Service-area business, we come to you, there's no counter to visit.": ["我们是上门服务的，会直接到你那儿去，没有实体柜台需要你跑一趟。", "Somos un negocio a domicilio, vamos hasta donde estés, no hay ningún mostrador que visitar.", "저희는 찾아가는 서비스예요, 저희가 직접 가니까 따로 들르실 카운터는 없어요.", "Chúng mình phục vụ tận nơi, sẽ tới chỗ bạn, không có quầy nào để bạn phải ghé đâu."],
    "Transportation is the one that runs today: flat-rate Tesla rides across Seattle, cars rented to drivers who earn with them, and trip-planning tools anyone can use free. It pays for what comes next. Every other arm is listed below with the stage it is honestly at, including the ones not finished.": ["出行是目前真正在运转的业务：覆盖西雅图全城的特斯拉固定价格接送、租给司机供他们经营的车辆，还有任何人都能免费使用的行程规划工具。是它为接下来的一切提供资金。其余每一块业务都列在下面，实事求是地标明各自所处的阶段，也包括还没完成的那些。", "El transporte es lo que ya funciona hoy: viajes en Tesla con tarifa fija por todo Seattle, coches que alquilamos a conductores que se ganan la vida con ellos, y herramientas de planificación de viajes que cualquiera puede usar gratis. Es lo que paga lo que viene después. Cada una de las demás ramas aparece más abajo con la etapa en la que está de verdad, incluidas las que aún no están terminadas.", "지금 실제로 돌아가는 사업은 교통이에요: 시애틀 전역을 오가는 테슬라 정액 운송, 그 차로 수입을 올리는 기사님들께 빌려드리는 차량, 그리고 누구나 무료로 쓸 수 있는 여행 플래너예요. 이 사업이 앞으로 이어질 것들의 비용을 대요. 나머지 사업은 아직 완성되지 않은 것까지 포함해서, 지금 솔직하게 어느 단계에 있는지와 함께 아래에 정리해 뒀어요.", "Vận tải là mảng đang thực sự chạy hôm nay: những chuyến Tesla giá cố định khắp Seattle, xe cho tài xế thuê để họ kiếm sống, và các công cụ lập kế hoạch chuyến đi ai cũng dùng miễn phí. Chính nó nuôi những gì đến sau. Mọi mảng còn lại đều được liệt kê bên dưới kèm giai đoạn thật sự của nó, kể cả những mảng chưa hoàn thiện."],
    "Flat-rate Tesla service across Seattle, a vehicle rental programme for drivers, and trip-planning tools that are free to anyone, with no account and nothing to install.": ["覆盖西雅图全城的特斯拉固定价格接送服务、面向司机的车辆租赁计划，还有任何人都能免费使用的行程规划工具，不用注册账号，也不用装任何软件。", "Servicio Tesla con tarifa fija por todo Seattle, un programa de alquiler de vehículos para conductores y herramientas de planificación de viajes gratis para cualquiera, sin cuenta y sin nada que instalar.", "시애틀 전역을 아우르는 테슬라 정액 운송 서비스, 기사님을 위한 차량 렌탈 프로그램, 그리고 누구나 무료로 쓸 수 있는 여행 플래너예요. 계정도 필요 없고 설치할 것도 없어요.", "Dịch vụ Tesla giá cố định khắp Seattle, chương trình cho tài xế thuê xe, và các công cụ lập kế hoạch chuyến đi miễn phí cho tất cả mọi người, không cần tài khoản và chẳng phải cài đặt gì cả."],
    "One business pays for the next. That only means something if we say plainly which ones are earning today and which are still being built, so we do.": ["一项业务，撑起下一项。可这句话只有在我们把话说明白，哪些业务今天已经在盈利、哪些还在搭建之中，才真的算数，所以我们就照实说清楚。", "Un negocio paga el siguiente. Y eso solo significa algo si decimos con claridad cuáles ganan dinero hoy y cuáles aún se están construyendo, así que lo decimos.", "한 사업이 다음 사업을 먹여 살려요. 그런데 그 말이 의미가 있으려면, 오늘 어느 사업이 돈을 벌고 어느 사업이 아직 만들어지는 중인지 솔직하게 말해야 하죠. 그래서 그렇게 해요.", "Mảng này nuôi mảng kế tiếp. Nhưng câu đó chỉ có ý nghĩa nếu chúng mình nói thẳng mảng nào đang kiếm ra tiền hôm nay và mảng nào vẫn đang xây, nên chúng mình nói thẳng."],
    "Flat-rate Tesla rides in Seattle at $75 to Sea, Tac, cars rented to drivers who keep the fare, and a commission programme for hotels and agents. This is the business that earns.": ["西雅图的特斯拉固定价格接送，到机场统一 75 美元；把车租给司机、车费全归他们；还有面向酒店和代理机构的佣金计划。这就是那块真正产生收入的业务。", "Viajes en Tesla con tarifa fija en Seattle, 75 $ al aeropuerto; coches que alquilamos a conductores que se quedan con toda la tarifa; y un programa de comisiones para hoteles y agencias. Este es el negocio que genera ingresos.", "시애틀에서 공항까지 75달러 정액인 테슬라 운송, 운임을 고스란히 가져가는 기사님께 빌려드리는 차량, 그리고 호텔과 여행사를 위한 수수료 프로그램이에요. 실제로 수익을 내는 사업이 바로 이거예요.", "Những chuyến Tesla giá cố định tại Seattle, 75 USD tới sân bay; xe cho tài xế thuê và họ giữ trọn tiền cước; cùng chương trình hoa hồng cho khách sạn và đại lý. Đây chính là mảng đang tạo ra doanh thu."],
    "Dispatch, invoicing, driver paperwork and the trip-planning tools, built in-house rather than rented, so the customer relationship and the data stay with us.": ["调度、开票、司机资料，还有行程规划工具，都是我们自己做的，不是外面租来的，这样客户关系和数据就都留在我们自己手里。", "Despacho, facturación, papeleo de los conductores y las herramientas de planificación, todo hecho en casa en vez de alquilado, así la relación con el cliente y los datos se quedan con nosotros.", "배차, 청구, 기사님 서류, 그리고 여행 플래너까지 외부에서 빌리지 않고 저희가 직접 만들었어요. 그래야 고객과의 관계도, 데이터도 저희 손에 남거든요.", "Điều phối, xuất hóa đơn, giấy tờ tài xế và cả công cụ lập kế hoạch hành trình đều do chúng mình tự làm chứ không đi thuê, nhờ vậy quan hệ với khách và dữ liệu đều nằm lại với chúng mình."],
    "Mixed-use development, at drawing stage. Nothing built, nothing leased, nothing offered, the plans are published as they stand.": ["这是一个综合体开发项目，目前还在画图纸的阶段。还没动工，没有招租，也没有对外发售，我们把图纸原原本本地公开出来。", "Un proyecto de uso mixto que todavía está en fase de planos. Aún no hemos construido nada, ni alquilado, ni puesto nada a la venta; publicamos los planos tal como están.", "복합 용도 개발 프로젝트인데, 아직 설계 단계예요. 착공도, 임대도, 분양도 아직 하지 않았고, 도면은 지금 있는 그대로 공개하고 있어요.", "Một dự án phát triển đa chức năng, hiện vẫn đang ở giai đoạn vẽ thiết kế. Chưa khởi công, chưa cho thuê, cũng chưa chào bán gì cả; chúng mình công bố bản vẽ đúng như hiện tại."],
    "An automated trading research project in private verification, building an audited record. Nothing is for sale and no money is accepted, you can follow the results.": ["这是一个自动化交易研究项目，目前还在内部验证阶段，我们正在一点点建立可审计的业绩记录。我们不对外销售任何产品，也不接受任何资金，你可以随时关注结果。", "Un proyecto de investigación de trading automatizado que estamos verificando en privado, creando un historial auditable. No vendemos nada ni aceptamos dinero; puedes seguir los resultados.", "비공개로 검증하고 있는 자동화 거래 연구 프로젝트예요. 감사받을 수 있는 기록을 차곡차곡 쌓고 있고요. 판매하는 상품도 없고 자금도 받지 않으니, 결과만 편하게 지켜봐 주세요.", "Một dự án nghiên cứu giao dịch tự động, tụi mình đang kiểm chứng nội bộ và dần dựng nên một hồ sơ có thể kiểm toán. Không bán sản phẩm nào, cũng không nhận tiền; bạn cứ theo dõi kết quả nhé."],
    "More financial products coming soon.": ["更多金融产品，马上就来。", "Pronto llegan más productos financieros.", "더 많은 금융 상품도 곧 선보일게요.", "Sắp có thêm sản phẩm tài chính nữa nhé."],
    "A Seattle car service: flat-rate Tesla rides to Sea, Tac and around the city, plus trip-planning tools that are free to use.": ["我们是西雅图的用车服务：特斯拉固定价格接送，往返机场，也跑市区，还有可以免费使用的行程规划工具。", "Un servicio de coches en Seattle: viajes en Tesla con tarifa fija al aeropuerto y por toda la ciudad, y además herramientas para planear tu viaje que puedes usar gratis.", "시애틀에서 운영하는 차량 서비스예요. 공항과 시내를 오가는 테슬라 정액 요금 이동에, 무료로 쓰실 수 있는 여행 플래너까지 함께 드려요.", "Dịch vụ xe ở Seattle: đưa đón bằng Tesla giá cố định ra sân bay và quanh thành phố, kèm công cụ lên kế hoạch chuyến đi dùng miễn phí."],
    "Flat-rate Tesla rides, Seattle and Sea, Tac.": ["特斯拉固定价格接送，西雅图市区和机场都能到。", "Viajes en Tesla con tarifa fija, por Seattle y el aeropuerto.", "테슬라 정액 요금 이동, 시애틀 시내와 공항까지요.", "Đi Tesla giá cố định, quanh Seattle và ra sân bay."],
    "Optional, fills your name and email. You can just type them instead.": ["可选功能，会帮你自动填好姓名和邮箱。你也可以自己手动输入。", "Opcional: te rellena el nombre y el correo. Si prefieres, los escribes tú mismo.", "선택 사항이에요. 이름과 이메일을 자동으로 채워 드려요. 직접 입력하셔도 좋아요.", "Tùy chọn thôi, nó tự điền tên và email cho bạn. Bạn cũng có thể tự gõ vào cũng được."],
    "Seattle, Tacoma International Airport (SEA)": ["西雅图-塔科马国际机场（SEA）", "Aeropuerto Internacional Seattle, Tacoma (SEA)", "시애틀, 타코마 국제공항(SEA)", "Sân bay quốc tế Seattle, Tacoma (SEA)"],
    "⏱ Been here? Tell us how long you stayed →": ["⏱ 来过这里吗？告诉我们你待了多久 →", "⏱ ¿Ya estuviste aquí? Cuéntanos cuánto te quedaste →", "⏱ 가보셨어요? 얼마나 머무셨는지 살짝 알려주세요 →", "⏱ Bạn từng ghé đây chưa? Cho tụi mình biết bạn ở lại bao lâu nhé →"],
    "Nobody has reported a gift yet, the zero is honest.": ["目前还没有人报告过捐赠，这个零是真实的。", "Todavía nadie nos ha avisado de una donación; ese cero es de verdad.", "아직 기부를 알려주신 분이 없어요, 그래서 이 0은 솔직한 숫자예요.", "Chưa có ai báo về khoản đóng góp nào cả, nên số 0 này là thật đấy."],
    "No charge until the ride is confirmed.": ["行程确认之前，不会向你收费。", "No te cobramos nada hasta que el viaje esté confirmado.", "예약이 확정되기 전까지는 요금이 청구되지 않아요.", "Khi nào chuyến đi được xác nhận thì mới tính tiền nhé."],
    "The neon crossroads of the world, massive digital billboards, Broadway marquees and street performers at all hours.": ["号称世界的霓虹十字路口，巨大的电子广告牌、百老汇剧院招牌，还有不分昼夜的街头艺人。", "El cruce de neón del mundo: pantallas enormes, marquesinas de Broadway y artistas callejeros a cualquier hora del día o de la noche.", "세계의 네온 교차로라 불리는 곳이에요. 거대한 전광판에 브로드웨이 극장 간판, 그리고 밤낮없이 이어지는 거리 공연까지요.", "Ngã tư neon của cả thế giới, với màn hình quảng cáo khổng lồ, bảng hiệu Broadway và nghệ sĩ đường phố suốt ngày đêm."],
    "Best after dark, when the lights do the work. Keep your wallet in a front pocket.": ["入夜后最好看，灯光会替这里说话。钱包记得放在前面的口袋里。", "Mejor de noche, cuando las luces se lucen. Lleva la cartera en el bolsillo de delante.", "해가 진 뒤가 제일 예뻐요, 불빛이 알아서 다 해 주거든요. 지갑은 앞주머니에 넣어 두세요.", "Đẹp nhất là sau khi trời tối, lúc đèn tự lên tiếng. Nhớ để ví ở túi trước nhé."],
    "843 acres of lakes, lawns and woodland in the middle of Manhattan. Bethesda Terrace, Bow Bridge and the Mall make the classic loop.": ["在曼哈顿正中央，843 英亩的湖泊、草坪和林地。贝塞斯达平台、弓桥和林荫大道串起最经典的一圈。", "343 hectáreas de lagos, praderas y bosque justo en medio de Manhattan. Bethesda Terrace, Bow Bridge y el Mall forman el recorrido clásico.", "맨해튼 한복판에 펼쳐진 843에이커의 호수와 잔디, 숲이에요. 베데스다 테라스, 보 브리지, 더 몰을 따라 걸으면 그게 바로 클래식 코스예요.", "343 ha hồ nước, thảm cỏ và rừng cây ngay giữa lòng Manhattan. Bethesda Terrace, Bow Bridge và The Mall làm nên vòng dạo kinh điển."],
    "Rent a rowboat at the Loeb Boathouse in warm months.": ["天气暖和的时候，可以在 Loeb 船屋租一条划艇。", "En los meses cálidos, alquila una barca de remos en el Loeb Boathouse.", "날이 따뜻할 땐 로브 보트하우스에서 노 젓는 배를 빌려 보세요.", "Vào mùa ấm, bạn có thể thuê một chiếc thuyền chèo ở Loeb Boathouse."],
    "One of the world's great museums, 5,000 years of art, including a complete Egyptian temple in a glass hall.": ["世界顶级博物馆之一，收藏跨越五千年的艺术，连一整座埃及神庙都完整搬进了玻璃大厅。", "Uno de los grandes museos del mundo: 5.000 años de arte, con hasta un templo egipcio entero bajo un techo de cristal.", "세계 최고의 미술관 중 하나예요. 5,000년에 걸친 예술이 있고, 유리 홀에는 이집트 신전이 통째로 옮겨져 있어요.", "Một trong những bảo tàng lớn nhất thế giới, với 5.000 năm nghệ thuật, có cả một ngôi đền Ai Cập nguyên vẹn đặt trong sảnh kính."],
    "Friday and Saturday it stays open late; the rooftop has a skyline view in season.": ["周五和周六会开到很晚，赶上季节还能上屋顶眺望天际线。", "Viernes y sábado abre hasta tarde, y en temporada la azotea tiene unas vistas del skyline preciosas.", "금요일과 토요일은 늦게까지 열어요. 시즌에는 옥상에서 스카이라인도 보이고요.", "Thứ Sáu và thứ Bảy mở muộn; đúng mùa thì từ sân thượng nhìn ra được cả đường chân trời thành phố."],
    "The art-deco icon of the skyline. The open-air 86th-floor deck is the classic New York view.": ["天际线上的装饰艺术地标。站在 86 层的露天观景台，你看到的就是最经典的那个纽约。", "El icono art déco del skyline. Desde la terraza al aire libre del piso 86 tienes la vista más clásica de Nueva York.", "스카이라인의 아르데코 상징이에요. 86층 야외 전망대에서 보는 풍경이 딱 뉴욕다운 뉴욕이고요.", "Biểu tượng art-deco của đường chân trời. Từ đài quan sát lộ thiên tầng 86, bạn có được tầm nhìn New York kinh điển nhất."],
    "Go at sunset and watch the city switch its lights on.": ["挑黄昏时候上去，正好看着全城的灯一盏盏亮起来。", "Sube al atardecer y mira cómo la ciudad va encendiendo sus luces.", "해 질 무렵에 올라가서 도시가 하나둘 불을 켜는 모습을 지켜보세요.", "Lên vào lúc hoàng hôn để ngắm thành phố lần lượt bật đèn nhé."],
    "Walk the wooden promenade of the 1883 bridge, the best free view of the Manhattan skyline.": ["走上这座 1883 年落成的桥的木栈道，这里是看曼哈顿天际线最好的免费位置。", "Recorre el paseo de madera del puente de 1883: es la mejor vista gratis del skyline de Manhattan.", "1883년에 놓인 이 다리의 나무 보행로를 걸어 보세요. 맨해튼 스카이라인을 공짜로 보기에 여기만 한 자리가 없어요.", "Đi bộ trên lối gỗ của cây cầu năm 1883, đây là chỗ ngắm đường chân trời Manhattan đẹp nhất mà lại không tốn đồng nào."],
    "Start on the Brooklyn side and walk toward the skyline.": ["从布鲁克林那头出发，朝着天际线的方向慢慢走。", "Arranca por el lado de Brooklyn y camina hacia el skyline.", "브루클린 쪽에서 출발해서 스카이라인을 향해 걸어 보세요.", "Bắt đầu từ phía Brooklyn rồi đi về hướng đường chân trời nhé."],
    "Twin reflecting pools in the footprints of the towers; the museum below tells the story with artifacts and voices.": ["两座反射池就落在原双塔的地基上；地下的博物馆用一件件遗物和亲历者的声音，讲述那一天。", "Dos estanques reflectantes sobre las huellas de las torres; el museo de abajo cuenta aquel día con objetos y con las voces de quienes lo vivieron.", "쌍둥이 빌딩이 서 있던 자리에 두 개의 반사 연못이 놓여 있어요. 지하 박물관은 유품과 사람들의 목소리로 그날을 들려줘요.", "Hai hồ nước phản chiếu nằm ngay trên nền hai tòa tháp; bảo tàng bên dưới kể lại ngày hôm ấy qua từng hiện vật và tiếng nói của người trong cuộc."],
    "The outdoor memorial is free and open late; the museum needs a timed ticket.": ["室外纪念区免费，而且开到很晚；博物馆则需要预约分时段的门票。", "El memorial de fuera es gratis y abre hasta tarde; para el museo necesitas entrada con hora.", "야외 추모 공간은 무료이고 늦게까지 열어요. 박물관은 시간대를 지정한 티켓이 있어야 하고요.", "Khu tưởng niệm ngoài trời thì miễn phí và mở tới khuya; còn bảo tàng thì cần vé theo khung giờ."],
    "A freight rail line reborn as an elevated garden walk from Gansevoort Street to 34th, with Hudson views and public art.": ["一条废弃的货运铁路，如今变成了空中花园步道，从 Gansevoort 街一路走到 34 街，沿途都是哈德逊河景和公共艺术。", "Una antigua vía de tren de carga convertida en un paseo-jardín elevado, desde Gansevoort hasta la calle 34, con vistas al Hudson y arte público por todo el camino.", "옛 화물 철로가 고가 정원 산책로로 되살아난 곳이에요. 갠스부트가에서 34번가까지 걷는 내내 허드슨강 풍경과 공공미술이 함께해요.", "Một tuyến đường sắt chở hàng cũ hồi sinh thành lối dạo vườn trên cao, đi từ phố Gansevoort tới phố 34, dọc đường là cảnh sông Hudson và nghệ thuật công cộng."],
    "Enter at the south end and exit straight into Chelsea Market for lunch.": ["从南端进去，出口正好接到 Chelsea Market，可以顺便在这儿吃午饭。", "Entra por el extremo sur y sal directo al Chelsea Market para almorzar.", "남쪽 끝으로 들어가서 첼시 마켓 쪽으로 나오면 바로 점심 먹기 딱 좋아요.", "Vào từ đầu phía nam rồi ra thẳng Chelsea Market ăn trưa là hợp lý nhất."],
    "A beaux-arts cathedral of transit, the turquoise celestial ceiling and the four-faced opal clock above the information booth.": ["一座学院派风格的交通殿堂，头顶是青绿色的星空穹顶，问询处上方还挂着那只四面蛋白石钟。", "Una catedral beaux-arts del transporte: el techo celeste turquesa y ese reloj de ópalo de cuatro caras sobre el mostrador de información.", "보자르 양식의 교통 대성당이에요. 청록빛 천장에는 별자리가 그려져 있고, 안내소 위에는 네 면짜리 오팔 시계가 걸려 있어요.", "Một thánh đường giao thông kiểu beaux-arts, với trần sao màu xanh ngọc và chiếc đồng hồ opal bốn mặt ngay trên quầy thông tin."],
    "Try the whispering gallery on the ramp outside the Oyster Bar.": ["别错过 Oyster Bar 门外坡道那处「回声长廊」，很值得一试。", "Prueba la galería de los susurros en la rampa que hay junto al Oyster Bar.", "오이스터 바 앞 경사로에 있는 '속삭이는 회랑'을 꼭 한번 해 보세요.", "Thử ngay 'hành lang thì thầm' ở đoạn dốc bên ngoài Oyster Bar nhé."],
    "Ferries from Battery Park to Liberty and Ellis Islands, the statue up close and the immigration museum.": ["从炮台公园坐渡轮去自由岛和埃利斯岛，凑近看看自由女神像，再逛一逛移民博物馆。", "Ferris desde Battery Park a las islas Liberty y Ellis: para ver la estatua de cerca y pasar por el museo de la inmigración.", "배터리 파크에서 리버티섬과 엘리스섬으로 페리를 타고 가서 자유의 여신상을 가까이서 보고, 이민 박물관까지 둘러보세요.", "Đi phà từ Battery Park ra đảo Liberty và Ellis, ngắm bức tượng thật gần rồi ghé luôn bảo tàng nhập cư."],
    "Book the first boat of the day; crown access sells out weeks ahead, and last boarding is mid-afternoon.": ["建议订当天第一班船；登王冠的名额往往提前好几周就没了，最后一班登船在下午。", "Reserva el primer barco del día; el acceso a la corona se agota con semanas de antelación y el último embarque es a media tarde.", "그날 첫 배로 예약해 두세요. 왕관 입장은 몇 주 전에 매진되고, 마지막 승선은 오후 중반이에요.", "Đặt chuyến phà đầu tiên trong ngày nhé; vé lên vương miện hết trước cả tuần, còn chuyến cuối lên tàu là vào giữa chiều."],
    "A block-long food hall in the old Nabisco factory, tacos, lobster rolls, doughnuts and thirty-five vendors.": ["在老纳贝斯克饼干厂里，有一座占了一整个街区的美食大厅，塔可、龙虾卷、甜甜圈，加起来三十五家摊位。", "Un mercado de comida que ocupa una manzana entera en la antigua fábrica Nabisco: tacos, rolls de langosta, donuts y treinta y cinco puestos.", "옛 나비스코 공장을 통째로 쓰는 한 블록짜리 푸드홀이에요. 타코, 랍스터롤, 도넛까지 가게만 서른다섯 곳이고요.", "Khu ẩm thực dài cả một dãy phố nằm trong nhà máy Nabisco cũ, có taco, bánh mì tôm hùm, bánh donut và tận ba mươi lăm quầy."],
    "Weekday mornings are calm; weekend afternoons are a crush.": ["工作日的上午比较清静，周末午后就人挤人了。", "Entre semana las mañanas están tranquilas; las tardes de fin de semana son un agobio.", "평일 오전은 한산하고, 주말 오후엔 발 디딜 틈이 없어요.", "Sáng ngày thường thì vắng vẻ; còn chiều cuối tuần thì chen chân không lọt."],
    "The 1888 delicatessen that defines pastrami on rye, sliced by hand at the counter.": ["从 1888 年一直开到今天的熟食店，黑麦面包夹手切熏牛肉这道，标准就是从这里定下来的。", "La charcutería de 1888 que marcó lo que es un pastrami en pan de centeno, cortado a mano en el mostrador.", "1888년부터 이어온 델리예요. 호밀빵 파스트라미의 기준을 세운 집이고, 카운터에서 직접 손으로 썰어 줘요.", "Tiệm deli mở từ năm 1888, chính là nơi đặt ra chuẩn mực cho món pastrami kẹp bánh mì lúa mạch, thái tay ngay tại quầy."],
    "Take the ticket at the door and don't lose it, you pay on the way out.": ["进门时会拿到一张单子，记得别弄丢，离店的时候就凭它结账。", "Coge el tique en la puerta y no lo pierdas, que pagas al salir.", "문에서 받은 표는 잃어버리지 마세요, 나갈 때 그걸로 계산하거든요.", "Nhớ cầm phiếu ở cửa và đừng làm mất nhé, lúc ra về mới thanh toán."],
    "The benchmark New York slice since 1975, thin, hot, and eaten folded, standing up.": ["从 1975 年到现在，这就是纽约切片披萨的标准，又薄又烫，站着对折起来吃。", "La porción neoyorquina de referencia desde 1975: fina, caliente y comida doblada, de pie.", "1975년부터 뉴욕 조각 피자의 기준이 된 집이에요. 얇고 뜨겁고, 반으로 접어서 서서 먹는 맛이죠.", "Chuẩn mực của miếng pizza New York từ năm 1975, mỏng, nóng, cứ gập đôi lại và đứng ăn."],
    "Oysters under vaulted Guastavino tile since 1913, in the belly of Grand Central Terminal.": ["1913 年就开门了，藏在中央车站的肚子里，在瓜斯塔维诺拱砖顶下吃生蚝。", "Ostras bajo las bóvedas de azulejo Guastavino desde 1913, en las entrañas de Grand Central.", "1913년부터 그랜드센트럴 지하, 과스타비노 타일 아치 아래에서 굴을 내주는 곳이에요.", "Thưởng thức hàu dưới mái vòm gạch Guastavino từ năm 1913, ngay trong lòng ga Grand Central."],
    "Sit at the counter for the classic experience.": ["想体验最地道的吃法，就坐到吧台前。", "Siéntate en la barra, que es la experiencia de siempre.", "카운터에 앉아서 먹는 게 제대로예요.", "Ngồi ở quầy mới đúng kiểu nhé."],
    "Home of the six-ounce chocolate-chip walnut cookie, warm, half-molten in the middle, worth the line.": ["那块六盎司重的核桃巧克力曲奇就是这里的招牌，温热的，中间还半流心，排队也值。", "La cuna de la galleta de 170 g con nueces y chocolate: caliente, medio fundida por dentro, y vale cada minuto de cola.", "170그램짜리 초콜릿 호두 쿠키의 원조 집이에요. 따뜻하고 가운데가 반쯤 녹아 있어서 줄 설 만해요.", "Nơi khai sinh chiếc bánh quy sô-cô-la óc chó 170 g, nóng hổi, phần giữa còn chảy, xếp hàng một chút là đáng."],
    "A cobblestone lane of pubs and outdoor tables in the financial district, one of Manhattan's oldest streets.": ["金融区里一条铺着鹅卵石的小街，两边是酒馆和露天座位，也是曼哈顿最老的街道之一。", "Una callejuela adoquinada llena de pubs y mesas al aire libre en el distrito financiero, una de las calles más antiguas de Manhattan.", "금융가 한복판의 자갈길이에요. 펍과 야외 테이블이 쭉 늘어서 있고, 맨해튼에서 가장 오래된 거리 중 하나예요.", "Một con phố lát đá cuội đầy quán bia và bàn ngoài trời trong khu tài chính, cũng là một trong những con phố cổ nhất Manhattan."],
    "On summer evenings the whole street becomes one open-air dining room.": ["夏天的傍晚，整条街就变成了一间露天餐厅。", "En las tardes de verano, toda la calle se convierte en un comedor al aire libre.", "여름 저녁이면 거리 전체가 하나의 야외 식당으로 변해요.", "Chiều hè, cả con phố biến thành một phòng ăn ngoài trời."],
    "The seated Lincoln above the Reflecting Pool, read the Second Inaugural carved on the north wall.": ["倒影池尽头端坐着的林肯像，北墙上刻着他的第二次就职演说，值得一读。", "El Lincoln sentado al fondo del Reflecting Pool; lee el Segundo Discurso Inaugural tallado en el muro norte.", "리플렉팅 풀 너머에 앉아 있는 링컨상이에요. 북쪽 벽에 새겨진 두 번째 취임 연설도 꼭 읽어 보세요.", "Tượng Lincoln ngồi ở cuối hồ Reflecting Pool; bạn nhớ đọc bài diễn văn nhậm chức thứ hai khắc trên bức tường phía bắc nhé."],
    "Open 24 hours; sunrise and after dark are the quiet, beautiful times.": ["全天开放；清晨和入夜后最安静，也最好看。", "Abierto las 24 horas; al amanecer y de noche es cuando está tranquilo y más bonito.", "24시간 열려 있어요. 해 뜰 무렵과 밤이 가장 조용하고 예뻐요.", "Mở cửa 24 giờ; lúc bình minh và sau khi trời tối là yên tĩnh và đẹp nhất."],
    "The 555-foot obelisk at the center of the Mall; the elevator to the top gives the only 360-degree view of the city.": ["国家广场正中央那座 555 英尺高的方尖碑；坐电梯上到顶，能看到全城唯一的 360 度视野。", "El obelisco de 169 metros en pleno centro del Mall; el ascensor hasta la cima da la única vista de 360° de la ciudad.", "내셔널 몰 한가운데 서 있는 169미터 오벨리스크예요. 꼭대기까지 엘리베이터로 올라가야만 도시를 360도로 볼 수 있어요.", "Đài tháp cao 169 m ngay giữa National Mall; đi thang máy lên đỉnh là có tầm nhìn 360° duy nhất của cả thành phố."],
    "Same-day tickets go early, reserve online a month out if you can.": ["当天的门票很快就抢光了，能的话最好提前一个月在网上订。", "Las entradas del día vuelan, así que reserva online con un mes de antelación si puedes.", "당일권은 일찍 동나요, 가능하면 한 달 전에 온라인으로 예약해 두세요.", "Vé trong ngày hết rất sớm, nếu được thì bạn đặt online trước cả tháng nhé."],
    "The Wright Flyer, Apollo 11's command module and a moon rock you can touch, the Smithsonian's biggest crowd-pleaser.": ["莱特飞行者号、阿波罗 11 号指令舱，还有一块能伸手摸到的月岩，是史密森学会里人气最高的一馆。", "El Wright Flyer, el módulo de mando del Apolo 11 y una roca lunar que sí puedes tocar: el museo más popular del Smithsonian.", "라이트 플라이어, 아폴로 11호 사령선, 그리고 직접 손으로 만질 수 있는 월석까지, 스미스소니언에서 가장 인기 있는 곳이에요.", "Máy bay Wright Flyer, khoang chỉ huy Apollo 11 và một mẩu đá mặt trăng bạn được chạm tay vào, đây là bảo tàng đông khách nhất của Smithsonian."],
    "Free, but timed-entry passes are required, book before your trip.": ["参观免费，不过需要分时段的入场券，出发前先预约好。", "Es gratis, pero necesitas un pase con hora, así que resérvalo antes del viaje.", "무료지만 시간 지정 입장권이 있어야 해요, 여행 전에 미리 예약해 두세요.", "Vào cửa miễn phí, nhưng cần vé theo khung giờ, nhớ đặt trước khi đi nhé."],
    "The Star-Spangled Banner itself, Lincoln's top hat and the First Ladies' gowns, America's attic, free to enter.": ["那面《星条旗》原件、林肯的高礼帽、历任第一夫人的礼服，这里就像美国的阁楼，还免费入场。", "La bandera del Star-Spangled Banner, el sombrero de copa de Lincoln y los vestidos de las primeras damas: es como el desván de América, y encima entras gratis.", "성조기 원본, 링컨의 실크햇, 역대 영부인들의 드레스까지, 말하자면 미국의 다락방 같은 곳이고 입장도 무료예요.", "Lá cờ Star-Spangled Banner nguyên bản, chiếc mũ chóp cao của Lincoln và váy của các đệ nhất phu nhân, cứ như gác xép của nước Mỹ vậy, mà vào cửa lại miễn phí."],
    "The only Leonardo da Vinci painting in the Americas, plus Vermeer, Monet and a sculpture garden.": ["美洲唯一一幅达·芬奇真迹就在这里，还有维米尔、莫奈，以及一座雕塑花园。", "El único cuadro de Leonardo da Vinci en toda América, y además Vermeer, Monet y un jardín de esculturas.", "아메리카 대륙에 딱 하나 있는 다빈치 회화예요. 페르메이르와 모네 작품에 조각 정원까지 있고요.", "Bức tranh Leonardo da Vinci duy nhất ở cả châu Mỹ, cùng với Vermeer, Monet và một vườn điêu khắc."],
    "The lit walkway between the two wings is a work of art itself.": ["连接两馆的那条灯光通道，本身就是一件作品。", "El pasillo iluminado entre las dos alas ya es una obra de arte en sí mismo.", "두 관을 잇는 조명 통로 자체가 하나의 작품이에요.", "Hành lang ánh sáng nối hai cánh bảo tàng, tự nó đã là một tác phẩm rồi."],
    "Tours run from the underground visitor center through the Crypt, the Rotunda and Statuary Hall.": ["导览从地下的游客中心出发，一路穿过地下室、圆形大厅和雕像厅。", "Las visitas salen del centro de visitantes subterráneo y van recorriendo la Cripta, la Rotonda y el Salón de las Estatuas.", "지하 방문자 센터에서 출발해 크립트, 로툰다, 조각상 홀을 차례로 도는 투어예요.", "Tour xuất phát từ trung tâm khách tham quan dưới lòng đất, đi qua Hầm mộ, Sảnh tròn và Sảnh Tượng."],
    "Book the free tour through your senator's office for a smaller group.": ["通过你所在州参议员的办公室预约免费导览，团队人数会更少一些。", "Reserva la visita gratuita a través de la oficina de tu senador, así los grupos son más pequeños.", "지역 상원의원 사무실을 통해 무료 투어를 예약하면 더 적은 인원으로 돌 수 있어요.", "Đặt tour miễn phí qua văn phòng thượng nghị sĩ khu bạn ở để được đi theo nhóm nhỏ hơn."],
    "The classic north-face view from Lafayette Square. Public tours exist but need a request through Congress weeks ahead.": ["从拉法叶广场望过去，就是那面经典的北立面。公众参观也是有的，只是得提前好几周通过国会议员申请。", "La vista clásica de la fachada norte desde Lafayette Square. Hay visitas para el público, pero se piden a través del Congreso con semanas de antelación.", "라파예트 광장에서 보는 북쪽 정면이 가장 정석이에요. 일반 견학도 있긴 하지만, 몇 주 전에 의회를 통해 신청해야 해요.", "Góc nhìn mặt bắc kinh điển từ Quảng trường Lafayette. Vẫn có tour cho công chúng, nhưng bạn phải xin qua Quốc hội trước cả mấy tuần."],
    "The domed rotunda on the Tidal Basin, ringed by cherry trees that explode into bloom around late March.": ["潮汐湖畔的圆顶纪念堂，四周的樱花大约在三月底一起爆开。", "La rotonda con cúpula junto al Tidal Basin, rodeada de cerezos que estallan en flor hacia finales de marzo.", "타이들 베이슨 가에 있는 돔 기념관이에요. 3월 말쯤이면 둘러싼 벚나무가 한꺼번에 활짝 피어나요.", "Nhà tưởng niệm mái vòm bên hồ Tidal Basin, xung quanh là hàng anh đào bung nở rợp trời vào cuối tháng Ba."],
    "Walk the Tidal Basin loop to catch the MLK and FDR memorials while you're there.": ["沿着潮汐湖走一圈，顺路就能把马丁·路德·金和罗斯福纪念碑一起看了。", "Da la vuelta al Tidal Basin y aprovecha para ver de paso los memoriales de MLK y FDR.", "타이들 베이슨을 한 바퀴 돌면 가는 김에 MLK와 FDR 기념관까지 같이 볼 수 있어요.", "Đi hết một vòng hồ Tidal Basin để tiện ghé luôn đài tưởng niệm MLK và FDR."],
    "Harbor-front dining and river views, with M Street's shops and Federal row houses up the hill.": ["在河岸边吃饭，看着河景，坡上就是 M 街的店铺和一排排联邦式老屋。", "Restaurantes junto al puerto y vistas al río, y cuesta arriba las tiendas de M Street y las casas de estilo Federal.", "강가 식당과 강 풍경이 펼쳐지고, 언덕 위로는 M 스트리트의 상점과 연방 양식 연립주택이 이어져요.", "Nhà hàng ven bến và cảnh sông, lên trên dốc là các cửa hiệu phố M và dãy nhà kiểu Federal."],
    "America's most hallowed ground, the Kennedy gravesite and the Tomb of the Unknown Soldier.": ["全美最令人肃然起敬的一片土地，肯尼迪墓和无名战士墓都安放在这里。", "La tierra más sagrada de Estados Unidos: aquí están la tumba de Kennedy y la del Soldado Desconocido.", "미국에서 가장 엄숙한 땅이에요. 케네디 묘와 무명용사의 묘가 바로 여기 있어요.", "Mảnh đất trang nghiêm nhất nước Mỹ, nơi yên nghỉ của Kennedy và của Chiến sĩ Vô danh."],
    "Time your visit to the Changing of the Guard, every hour on the hour, every half hour in summer.": ["去的话记得掐着换岗仪式的时间，每到整点举行，夏天则是每半小时一次。", "Calcula tu visita para el Cambio de Guardia: cada hora en punto, y en verano cada media hora.", "위병 교대식 시간에 맞춰 가 보세요. 매시 정각에 열리고, 여름에는 30분마다 있어요.", "Canh giờ đổi gác nhé, mỗi giờ đúng một lần, còn mùa hè thì nửa tiếng một lần."],
    "The U Street half-smoke, unchanged since 1958, a civil-rights landmark as much as a diner.": ["U 街上的半烟肠，从 1958 年到现在一直没变，它既是家小馆子，也是民权运动的地标。", "El half-smoke de U Street, igual desde 1958: es tanto un hito de los derechos civiles como una casa de comidas.", "U 스트리트의 하프스모크예요. 1958년 그대로이고, 그냥 식당이 아니라 민권운동의 상징이기도 해요.", "Món half-smoke ở phố U, không đổi từ năm 1958, vừa là quán ăn vừa là một di tích của phong trào dân quyền."],
    "Order it 'all the way', mustard, onions, chili.": ["点的时候说一句「all the way」，就会给你配上芥末、洋葱和辣肉酱。", "Pídelo 'all the way': mostaza, cebolla y chili.", "주문할 때 'all the way'라고 해 보세요. 머스터드, 양파, 칠리까지 다 들어가요.", "Gọi 'all the way' nhé, là có đủ mù tạt, hành và sốt chili."],
    "Washington's oldest saloon (1856), two blocks from the White House, oysters, burgers and power lunches.": ["华盛顿最老的酒馆（1856 年），离白宫只有两个街区，生蚝、汉堡，还有饭桌上谈成的政治。", "El salón más antiguo de Washington (1856), a dos manzanas de la Casa Blanca: ostras, hamburguesas y comidas de negocios.", "워싱턴에서 가장 오래된 술집이에요(1856년). 백악관에서 두 블록 거리이고, 굴과 버거, 그리고 권력자들의 점심이 오가는 곳이죠.", "Quán rượu lâu đời nhất Washington (1856), cách Nhà Trắng hai dãy phố, có hàu, burger và những bữa trưa toàn người quyền lực."],
    "The raw bar goes half-price late in the evening.": ["夜里稍晚一些，生蚝吧就半价了。", "Ya de noche, la barra de ostras se pone a mitad de precio.", "밤이 좀 늦어지면 로바가 반값이 돼요.", "Về khuya thì quầy hàu chỉ còn nửa giá thôi."],
    "Farm-owned American cooking, fried chicken and waffles, beignets, serious breakfasts.": ["由农场主自己开的美式餐厅，炸鸡配华夫、贝奈特饼，早餐做得非常用心。", "Cocina americana con granjas propias: pollo frito con gofres, beignets y desayunos que se toman en serio.", "농장주들이 직접 하는 미국 가정식이에요. 프라이드치킨과 와플, 베녜, 그리고 제대로 차린 아침 식사까지.", "Bếp Mỹ do chính các nông trại làm chủ, có gà rán ăn với bánh waffle, bánh beignet và bữa sáng làm rất tử tế."],
    "It books out, reserve ahead, or come at off-hours.": ["位子很抢手，建议提前订，或者错开饭点来。", "Se llena rápido: reserva con antelación o ven a horas tranquilas.", "자리가 금방 차요. 미리 예약하거나, 붐비는 시간을 피해서 오세요.", "Chỗ nhanh kín lắm, đặt trước hoặc đến vào giờ vắng nhé."],
    "A mile of waterfront restaurants and music halls beside the Municipal Fish Market, the oldest continuously operating fish market in the country.": ["市政鱼市旁边，一英里长的滨水餐厅和演出场地一路排开，那座鱼市是全美连续经营时间最长的。", "Un kilómetro y medio de restaurantes y salas de música junto al Municipal Fish Market, el mercado de pescado en funcionamiento continuo más antiguo del país.", "시립 수산시장을 끼고 1.6킬로미터에 걸쳐 물가 식당과 공연장이 이어져요. 그 시장은 미국에서 가장 오래 이어져 온 수산시장이고요.", "Gần 1,6 km nhà hàng và phòng nhạc ven nước nằm cạnh Chợ Cá Thành phố, khu chợ cá hoạt động liên tục lâu đời nhất nước Mỹ."],
    "Forty-plus vendors in a bright Northeast market hall, dumplings, Korean tacos, local oysters.": ["东北区一座亮堂堂的市场大厅，四十多家摊位，饺子、韩式塔可、本地生蚝都有。", "Más de cuarenta puestos en un luminoso mercado del noreste: dumplings, tacos coreanos y ostras de la zona.", "환한 북동부 마켓홀에 마흔 곳이 넘는 가게가 있어요. 만두, 코리안 타코, 동네 굴까지.", "Hơn bốn mươi quầy trong một khu chợ sáng sủa ở phía đông bắc, có sủi cảo, taco kiểu Hàn và hàu địa phương."],
    "Seattle's beating heart since 1907, fish throwers, flower stalls, craft stands and the original Starbucks, stacked on a hillside over Elliott Bay.": ["从 1907 年起，这里就是西雅图跳动的心脏，抛鱼的鱼贩、花摊、手作摊位，还有第一家星巴克，层层叠叠挂在艾略特湾上方的坡上。", "El corazón de Seattle desde 1907: pescaderos lanzando salmones, puestos de flores, artesanía y el Starbucks original, apilados en la ladera sobre Elliott Bay.", "1907년부터 뛰어 온 시애틀의 심장이에요. 생선을 던지는 상인, 꽃가게, 수공예 좌판, 그리고 최초의 스타벅스가 엘리엇 만 위 언덕에 층층이 얹혀 있어요.", "Trái tim đập của Seattle từ năm 1907, người bán cá tung cá, quầy hoa, hàng thủ công và cửa hàng Starbucks đầu tiên, xếp tầng trên sườn dốc nhìn ra vịnh Elliott."],
    "Go before 10am to watch the fishmongers set up, and don't miss the lower levels, most visitors never find them.": ["十点前到，能看到鱼贩摆摊；也别错过下面几层，大多数人根本没发现那里。", "Ve antes de las 10 para ver a los pescaderos montar el puesto, y no te pierdas los niveles de abajo: casi nadie los encuentra.", "오전 10시 전에 가면 상인들이 좌판 차리는 모습을 볼 수 있어요. 아래층들도 꼭 둘러보세요, 대부분은 거기 있는 줄도 몰라요.", "Đến trước 10 giờ để xem người bán cá dọn hàng, và đừng bỏ qua mấy tầng dưới nhé, phần lớn khách chẳng tìm ra."],
    "The 1962 World's Fair icon, 520 feet up with a rotating glass floor and a 360° sweep of the city, the Sound, and on a clear day Mount Rainier.": ["1962 年世博会留下的地标，520 英尺高，玻璃地板会旋转，360 度饱览城市和普吉特海湾，天气好还能望到雷尼尔山。", "El icono de la Expo de 1962: 158 metros de altura, suelo giratorio de cristal y una vista de 360° de la ciudad, el Sound y, si el día acompaña, el monte Rainier.", "1962년 만국박람회가 남긴 상징이에요. 158미터 높이에 바닥이 회전하는 유리라, 도시와 퓨젓 사운드가 360도로 펼쳐지고 맑은 날엔 레이니어산까지 보여요.", "Biểu tượng còn lại từ Hội chợ Thế giới 1962, cao 158 m, sàn kính xoay tròn, nhìn 360° ra thành phố, vịnh Puget và ngày trời trong thì thấy cả núi Rainier."],
    "Sunset slots sell out, book the golden hour online a few days ahead.": ["日落时段特别抢手，建议提前几天在网上订好黄金时刻的票。", "Las franjas de atardecer se agotan: reserva la hora dorada online con unos días de antelación.", "일몰 시간대는 금방 매진돼요. 골든아워는 며칠 전에 온라인으로 예약해 두세요.", "Khung giờ hoàng hôn hết vé rất nhanh, đặt giờ vàng online trước vài ngày nhé."],
    "Dale Chihuly's molten-glass dreamscapes, eight galleries and a garden where the sculptures grow among real plants, right under the Space Needle.": ["奇胡利用熔融玻璃造出的梦境，八个展厅加一座花园，雕塑就长在真的花草之间，位置就在太空针塔脚下。", "Los paisajes de ensueño en vidrio fundido de Dale Chihuly: ocho galerías y un jardín donde las esculturas crecen entre plantas de verdad, justo bajo la Space Needle.", "데일 치훌리가 녹인 유리로 빚은 꿈 같은 풍경이에요. 여덟 개 갤러리와, 조각이 진짜 식물 사이에서 자라는 정원까지 있고, 스페이스 니들 바로 아래에 있어요.", "Những khung cảnh mộng mơ bằng thủy tinh nung chảy của Dale Chihuly, tám phòng trưng bày và một khu vườn nơi tác phẩm mọc lên giữa cây thật, ngay dưới chân Space Needle."],
    "Pair it with the Needle on a combo ticket; the Glasshouse glows best in late-afternoon light.": ["可以和太空针塔买联票；午后偏晚的光线里，玻璃屋最好看。", "Combínalo con la Needle en una entrada conjunta; el Glasshouse brilla más bonito a última hora de la tarde.", "스페이스 니들과 묶음권으로 사면 좋아요. 글라스하우스는 늦은 오후 빛에서 가장 예쁘게 빛나요.", "Mua vé combo với Space Needle luôn nhé; nhà kính đẹp nhất dưới nắng cuối chiều."],
    "Frank Gehry's shimmering blob of a building, stuffed with Nirvana and Hendrix relics, sci-fi props, horror history and a guitar tornado.": ["盖里设计的那栋闪闪发亮的怪建筑，里面塞满了涅槃和亨德里克斯的旧物、科幻道具、恐怖片历史，还有一座用吉他堆成的龙卷风。", "El edificio ondulante y brillante de Frank Gehry, repleto de reliquias de Nirvana y Hendrix, atrezo de ciencia ficción, historia del terror y un tornado de guitarras.", "프랭크 게리가 지은, 반짝이는 덩어리 같은 건물이에요. 너바나와 헨드릭스의 유물, SF 소품, 호러 영화 역사, 그리고 기타로 만든 토네이도까지 가득 들어 있어요.", "Tòa nhà lấp lánh trông như một khối mềm của Frank Gehry, nhồi đầy kỷ vật Nirvana và Hendrix, đạo cụ phim viễn tưởng, lịch sử phim kinh dị và một cơn lốc làm bằng đàn ghi-ta."],
    "The Sound Lab lets you play real instruments, worth the last 30 minutes of your visit.": ["在 Sound Lab 可以亲手弹奏真乐器，值得把最后半小时留给它。", "El Sound Lab te deja tocar instrumentos de verdad: vale la pena guardarle los últimos 30 minutos.", "사운드랩에서는 진짜 악기를 직접 연주해 볼 수 있어요. 마지막 30분은 여기에 남겨 두세요.", "Sound Lab cho bạn chơi nhạc cụ thật đấy, để dành 30 phút cuối cho nó nhé."],
    "Sea otters, giant Pacific octopus and a diver-fed underwater dome, right on the working waterfront piers.": ["海獭、太平洋巨型章鱼，还有一座由潜水员喂食的水下穹顶，就在还在作业的码头上。", "Nutrias marinas, pulpo gigante del Pacífico y una cúpula submarina donde los buzos les dan de comer, justo sobre los muelles en activo.", "해달, 자이언트 퍼시픽 문어, 그리고 잠수부가 먹이를 주는 수중 돔이 있어요. 지금도 일하는 부두 바로 위에 자리해 있고요.", "Rái cá biển, bạch tuộc khổng lồ Thái Bình Dương và một mái vòm dưới nước nơi thợ lặn cho ăn, ngay trên những bến tàu vẫn đang hoạt động."],
    "Otter feedings are the show, check the day's schedule at the door and plan around one.": ["海獭喂食才是重头戏，进门先看看当天的时刻表，围着一场来安排行程。", "La hora de comer de las nutrias es el espectáculo: mira el horario del día en la entrada y organiza tu visita en torno a una.", "해달 먹이 주는 시간이 하이라이트예요. 입구에서 그날 시간표를 확인하고 한 타임에 맞춰 동선을 짜 보세요.", "Giờ cho rái cá ăn mới là màn đáng xem nhất, xem lịch trong ngày ngay ở cửa rồi sắp xếp quanh một suất nhé."],
    "The postcard shot: the whole skyline with the Space Needle front and center and Rainier floating behind it, a tiny park on Queen Anne hill.": ["明信片上的那一幕：整条天际线，太空针塔立在正中间，雷尼尔山浮在它身后，就在皇后安山上一座小小的公园里。", "La foto de postal: todo el skyline con la Space Needle en el centro y el Rainier flotando detrás, desde un parquecito en la colina de Queen Anne.", "엽서에 나오는 바로 그 장면이에요. 스카이라인 한가운데 스페이스 니들, 그 뒤로 떠 있는 레이니어산. 퀸앤 언덕의 아주 작은 공원에서 볼 수 있어요.", "Đúng kiểu tấm bưu thiếp: cả đường chân trời với Space Needle ở chính giữa và núi Rainier lơ lửng phía sau, chụp từ một công viên tí hon trên đồi Queen Anne."],
    "Come 30 minutes after sunset for the blue-hour photo every Seattle poster is made from.": ["日落后三十分钟来，正好赶上蓝调时刻，西雅图的海报几乎都是那会儿拍的。", "Ven 30 minutos después del atardecer, en la hora azul: de ahí sale cada póster de Seattle.", "일몰 30분 뒤 블루아워에 와 보세요. 시애틀 포스터는 다 그때 찍은 사진이에요.", "Đến sau hoàng hôn 30 phút, vào giờ xanh, mọi tấm poster về Seattle đều ra đời từ khoảnh khắc đó."],
    "A rusted 1900s gasification plant turned lakefront park, industrial ruins, kite hill, and seaplanes landing on Lake Union in front of the skyline.": ["一座 1900 年代的煤气厂锈在原地，如今成了湖畔公园，工业遗迹、放风筝的小山，还有水上飞机贴着天际线降落在联合湖上。", "Una planta de gasificación de principios del siglo XX, oxidada y convertida en parque junto al lago: ruinas industriales, la colina de las cometas e hidroaviones amerizando en el lago Union frente al skyline.", "1900년대 가스 공장이 녹슨 그대로 호숫가 공원이 됐어요. 산업 유적과 연 날리는 언덕, 그리고 스카이라인 앞 유니언 호수에 사뿐히 내려앉는 수상비행기까지 볼 수 있어요.", "Nhà máy khí hóa đầu thế kỷ 20 hoen gỉ nay thành công viên ven hồ, có phế tích công nghiệp, đồi thả diều và thủy phi cơ đáp xuống hồ Union ngay trước đường chân trời."],
    "Bring takeout and claim the hill, it's Seattle's favorite picnic view.": ["带点外卖上草坡占个位子吧，这里是西雅图人最爱的野餐视野。", "Llévate algo para comer y adueñate de la colina: es la vista de picnic favorita de Seattle.", "먹을 걸 포장해 와서 언덕에 자리를 잡아 보세요. 시애틀 사람들이 제일 좋아하는 소풍 명당이에요.", "Mua đồ ăn mang theo rồi chọn một chỗ trên đồi nhé, đây là view picnic mà dân Seattle mê nhất."],
    "The mothership on Capitol Hill, a working roastery where beans ride copper pipes overhead and the menu goes far beyond any normal Starbucks.": ["国会山上的母舰，一座真在运转的烘焙工坊，咖啡豆顺着头顶的铜管流动，菜单远远超出任何一家普通星巴克。", "La nave nodriza en Capitol Hill: un tostadero en pleno funcionamiento donde el grano viaja por tuberías de cobre sobre tu cabeza y la carta va mucho más allá de un Starbucks normal.", "캐피톨 힐의 모선이에요. 실제로 돌아가는 로스터리라, 원두가 머리 위 구리관을 타고 흐르고 메뉴도 보통 스타벅스와는 비교가 안 돼요.", "Con tàu mẹ ở Capitol Hill, một xưởng rang đang chạy thật, hạt cà phê chạy trong ống đồng trên đầu và thực đơn vượt xa bất kỳ Starbucks thường nào."],
    "Order a flight from the experience bar and watch the roaster run, skip the regular latte you can get anywhere.": ["在体验吧点一组对比品鉴，看着烘焙机运转，普通拿铁哪儿都有，就别点了。", "Pide una cata en la barra de experiencia y mira el tostador en marcha: el latte de siempre lo tienes en cualquier parte.", "익스피리언스 바에서 플라이트를 시켜 놓고 로스터가 돌아가는 걸 구경해 보세요. 흔한 라떼는 어디서나 마실 수 있으니 건너뛰고요.", "Gọi một set nếm thử ở quầy trải nghiệm rồi ngắm máy rang chạy, còn ly latte thường thì đâu cũng có nên bỏ qua nhé."],
    "A 2.5-mile red brick line through sixteen Revolutionary sites, from Boston Common to the Bunker Hill Monument, the whole founding story laid out as a walk.": ["一条 2.5 英里的红砖路线，串起十六处独立战争遗址，从波士顿公园一直走到邦克山纪念碑，整段建国故事就这样铺成了一条步道。", "Una línea de ladrillo rojo de 4 km que enlaza dieciséis lugares de la Revolución, desde Boston Common hasta el monumento de Bunker Hill: toda la historia fundacional convertida en un paseo.", "4킬로미터짜리 붉은 벽돌 길이 독립전쟁 유적 열여섯 곳을 이어 줘요. 보스턴 코먼에서 벙커힐 기념비까지, 건국의 이야기 전체가 한 편의 산책 코스로 펼쳐져요.", "Một vạch gạch đỏ dài 4 km xâu chuỗi mười sáu di tích Cách mạng, từ Boston Common đến đài Bunker Hill, cả câu chuyện lập quốc trải ra thành một lối đi bộ."],
    "Walk it north-to-south in the afternoon so the sun is behind you, and treat the posted 90 minutes as walking time only, stopping inside sites doubles it.": ["下午由北往南走，太阳就在你背后；牌子上写的九十分钟只是纯步行时间，进去参观的话会翻一倍。", "Recórrelo de norte a sur por la tarde para llevar el sol detrás, y toma los 90 minutos indicados solo como tiempo de caminata: entrar en los sitios lo duplica.", "오후에 북쪽에서 남쪽으로 걸으면 해를 등지게 돼요. 안내판의 90분은 순수하게 걷는 시간이라, 안에 들어가 보기 시작하면 두 배로 늘어나요.", "Đi hướng bắc xuống nam vào buổi chiều để nắng ở sau lưng, và cứ xem 90 phút ghi trên bảng chỉ là thời gian đi bộ thôi, ghé vào bên trong là gấp đôi ngay."],
    "Three granite halls of food stalls and street performers beside the 1742 meeting house where colonists argued their way toward revolution.": ["三座花岗岩厅堂里满是食摊和街头艺人，紧挨着 1742 年那座会议厅，当年殖民地居民就是在那里一路争论走向了革命。", "Tres naves de granito llenas de puestos de comida y artistas callejeros, junto a la casa de reuniones de 1742 donde los colonos discutieron hasta llegar a la revolución.", "화강암 홀 세 채에 먹거리 노점과 거리 공연이 가득해요. 바로 옆은 1742년 집회장인데, 식민지 주민들이 여기서 논쟁을 거듭하다 혁명으로 나아갔어요.", "Ba dãy nhà đá granit đầy quầy ăn và nghệ sĩ đường phố, ngay bên hội trường năm 1742 nơi người dân thuộc địa tranh luận mãi rồi đi tới cách mạng."],
    "Quincy Market's food hall is packed at noon; eat at 11 or after 2 and take it out to the benches by the hall's east door.": ["Quincy Market 的美食大厅一到中午就挤爆，不如十一点或两点后再吃，然后端到东门旁的长椅上去。", "El mercado de Quincy se llena a mediodía; come a las 11 o después de las 2 y llévatelo a los bancos junto a la puerta este.", "퀸시 마켓 푸드홀은 정오엔 발 디딜 틈이 없어요. 11시나 2시 이후에 먹고, 동쪽 문 옆 벤치로 들고 나가 보세요.", "Khu ẩm thực Quincy Market chật kín lúc trưa; ăn lúc 11 giờ hoặc sau 2 giờ rồi mang ra mấy chiếc ghế cạnh cửa đông nhé."],
    "The oldest ballpark in the majors, opened 1912, with the 37-foot Green Monster still standing in left field.": ["大联盟里最老的球场，1912 年开门迎客，左外野那面 37 英尺高的「绿色怪物」至今还立在那儿。", "El estadio más antiguo de las Grandes Ligas, abierto en 1912, con el Monstruo Verde de 11 metros aún en pie en el jardín izquierdo.", "메이저리그에서 가장 오래된 구장이에요. 1912년에 문을 열었고, 좌익에 서 있는 11미터 '그린 몬스터'가 지금도 그대로예요.", "Sân bóng lâu đời nhất giải nhà nghề, mở cửa năm 1912, với 'Quái vật Xanh' cao 11 m vẫn sừng sững ở cánh trái."],
    "On non-game days the hour-long tour walks you onto the Monster seats, book it, they sell out, and it's the only way in without a ticket.": ["没有比赛的日子，有一小时的球场导览带你走上「绿色怪物」看台；名额有限会订满，记得提前订，这也是没有球票时进场的唯一办法。", "Los días sin partido, la visita de una hora te sube a las gradas del Monstruo; resérvala porque se agota, y es la única manera de entrar sin entrada de partido.", "경기가 없는 날에는 한 시간짜리 투어가 몬스터 좌석까지 데려가 줘요. 금방 매진되니 예약해 두세요, 티켓 없이 안에 들어가 볼 수 있는 유일한 방법이에요.", "Vào ngày không có trận, tour một tiếng đưa bạn lên tận khán đài Green Monster; đặt sớm vì hết chỗ nhanh, và đây là cách duy nhất để vào sân khi không có vé xem trận."],
    "Half a million works across an encyclopedic collection, strongest in Impressionists, Egyptian art and American painting.": ["五十万件藏品，堪称一部百科全书，其中印象派、埃及艺术和美国绘画尤其出彩。", "Medio millón de obras en una colección enciclopédica, especialmente fuerte en impresionistas, arte egipcio y pintura estadounidense.", "50만 점에 이르는, 백과사전 같은 컬렉션이에요. 그중에서도 인상주의, 이집트 미술, 미국 회화가 특히 뛰어나요.", "Nửa triệu tác phẩm trong một bộ sưu tập như cuốn bách khoa, mạnh nhất là tranh Ấn tượng, nghệ thuật Ai Cập và hội họa Mỹ."],
    "Wednesday through Friday evenings are the quietest hours, and the Art of the Americas wing alone is worth the full two hours.": ["周三到周五的傍晚人最少，光是「美洲艺术」那一翼，就够你逛上整整两小时。", "Las tardes de miércoles a viernes son las horas más tranquilas, y solo el ala de Arte de las Américas ya vale dos horas enteras.", "수요일부터 금요일 저녁이 제일 한산해요. '아메리카 미술' 관 하나만 봐도 두 시간이 훌쩍 가요.", "Chiều tối thứ Tư đến thứ Sáu là lúc vắng nhất, và riêng cánh Nghệ thuật châu Mỹ thôi đã đủ cho bạn cả hai tiếng."],
    "A four-story Giant Ocean Tank spirals through a Caribbean reef with sea turtles, sharks and rays, right on the harbor.": ["四层楼高的巨型海洋缸，一圈圈盘旋穿过加勒比珊瑚礁，海龟、鲨鱼和鳐鱼就在身旁游动，位置就在港口边上。", "Un tanque oceánico gigante de cuatro pisos sube en espiral por un arrecife caribeño con tortugas, tiburones y rayas, justo en el puerto.", "4층 높이의 자이언트 오션 탱크가 카리브 산호초를 나선으로 감아 올라가요. 바다거북과 상어, 가오리가 함께 헤엄치고, 위치는 항구 바로 앞이에요.", "Bể đại dương khổng lồ cao bốn tầng xoắn ốc quanh một rạn san hô Caribbean với rùa biển, cá mập và cá đuối, ngay bên cảng."],
    "Go at opening or in the last 90 minutes, the ramp around the tank is a single-file crush midday.": ["开馆时或闭馆前九十分钟去比较好，中午环缸的坡道挤得只能一个一个往前挪。", "Ve al abrir o en los últimos 90 minutos: a mediodía la rampa alrededor del tanque es una fila apretada que no avanza.", "개장하자마자 가거나 마지막 90분에 가 보세요. 한낮엔 탱크를 도는 경사로가 한 줄로 꽉 막혀 옴짝달싹 못 해요.", "Đi lúc mở cửa hoặc trong 90 phút cuối, vì giữa trưa lối dốc quanh bể chen chúc, chỉ nhích được từng người một."],
    "'Old Ironsides', launched 1797 and still a commissioned Navy ship, the oldest warship afloat anywhere in the world.": ["「老铁甲」，1797 年下水，如今仍是一艘在役的海军军舰，也是全世界还浮在水上的最古老战舰。", "'Old Ironsides', botado en 1797 y todavía un buque en activo de la Armada: el barco de guerra a flote más antiguo del mundo.", "'올드 아이언사이즈'예요. 1797년에 진수했고 지금도 현역 해군 함정이며, 세계에서 물에 떠 있는 가장 오래된 군함이에요.", "'Old Ironsides', hạ thủy năm 1797 và đến nay vẫn là tàu hải quân đang biên chế, chiến hạm cổ nhất còn nổi trên mặt nước ở khắp thế giới."],
    "Free, but adults need photo ID to board. The museum next door is separate and worth the extra half hour.": ["登舰免费，不过成人需要出示带照片的证件。旁边的博物馆是单独收费的，值得再多留半小时。", "Es gratis, pero los adultos necesitan documento con foto para subir a bordo. El museo de al lado va aparte y merece esa media hora extra.", "승선은 무료지만, 성인은 사진이 있는 신분증이 있어야 올라갈 수 있어요. 바로 옆 박물관은 별도이고, 30분 더 들일 만한 값을 해요.", "Lên tàu miễn phí, nhưng người lớn cần giấy tờ có ảnh. Bảo tàng ngay bên cạnh tính vé riêng và đáng để bạn dành thêm nửa tiếng."],
    "America's oldest public park, 1634, running into the Public Garden with its swan boats and weeping willows.": ["美国最老的公共公园，1634 年就有了，一路连到公共花园，那边有天鹅船和垂柳。", "El parque público más antiguo de Estados Unidos, de 1634, que se une con el Public Garden y sus barcas-cisne y sauces llorones.", "1634년에 생긴, 미국에서 가장 오래된 공원이에요. 백조 보트와 수양버들이 있는 퍼블릭 가든까지 그대로 이어져요.", "Công viên công cộng lâu đời nhất nước Mỹ, có từ năm 1634, nối liền sang Public Garden với những chiếc thuyền thiên nga và hàng liễu rủ."],
    "Swan boats run mid-April to Labor Day only. The Common is the natural place to start any Boston day, three subway lines meet underneath it.": ["天鹅船只在四月中旬到劳动节之间开。这座公园是波士顿一日游最顺理成章的起点，脚下就有三条地铁线交汇。", "Las barcas-cisne solo funcionan de mediados de abril al Día del Trabajo. El Common es el punto natural para empezar cualquier día en Boston: tres líneas de metro se cruzan justo debajo.", "백조 보트는 4월 중순부터 노동절까지만 다녀요. 보스턴에서의 하루는 여기서 시작하는 게 자연스러운데, 바로 아래에서 지하철 세 노선이 만나거든요.", "Thuyền thiên nga chỉ chạy từ giữa tháng Tư đến Ngày Lao động. Bắt đầu một ngày ở Boston từ đây là hợp lý nhất, ngay bên dưới có ba tuyến tàu điện ngầm giao nhau."],
    "The 1636 college green across the river, ringed by red brick halls, with Harvard Square's bookshops and cafes at the gate.": ["河对岸那片 1636 年的校园草坪，四周环绕着红砖楼，走到门口就是哈佛广场的书店和咖啡馆。", "El césped universitario de 1636 al otro lado del río, rodeado de edificios de ladrillo rojo, con las librerías y cafés de Harvard Square a la puerta.", "강 건너에 있는 1636년의 캠퍼스 잔디밭이에요. 붉은 벽돌 건물이 빙 둘러싸고 있고, 정문 앞이 바로 하버드 스퀘어의 서점과 카페예요.", "Bãi cỏ khuôn viên năm 1636 bên kia sông, được bao quanh bởi các tòa nhà gạch đỏ, ngay cổng là hiệu sách và quán cà phê của Harvard Square."],
    "Take the Red Line to Harvard rather than driving, Cambridge parking is genuinely difficult. Student-led tours leave from the visitor center and are free.": ["别开车，坐红线到 Harvard 站就好，剑桥停车是真的难。游客中心有学生带队的导览，而且免费。", "Ve en la línea roja hasta Harvard en lugar de conducir: aparcar en Cambridge es de verdad complicado. Las visitas guiadas por estudiantes salen del centro de visitantes y son gratis.", "차를 몰기보다 레드라인을 타고 하버드역으로 가세요, 케임브리지 주차는 정말 만만치 않거든요. 학생들이 안내하는 투어가 방문자 센터에서 출발하고, 무료예요.", "Đi tàu Red Line tới ga Harvard thay vì lái xe nhé, đỗ xe ở Cambridge khó thật sự. Tour do sinh viên dẫn khởi hành từ trung tâm khách tham quan và hoàn toàn miễn phí."],
    "Transportation operates today and funds what follows: flat-rate Tesla service across Seattle, a vehicle rental programme for drivers, and trip-planning tools available free to anyone. The property development is at drawing stage and the trading research is in private verification. Each business is set out below with the stage it has actually reached.": ["出行业务现在已经在运营，也为后面的业务提供着资金：覆盖西雅图全城的特斯拉固定价格接送、面向司机的车辆租赁计划，还有任何人都能免费使用的行程规划工具。地产开发目前还在图纸阶段，交易研究则还在内部验证当中。下面我们把每一项业务实际走到的阶段都一一列出来。", "El transporte ya está en marcha y financia lo que viene después: servicio Tesla con tarifa fija por todo Seattle, un programa de alquiler de coches para conductores y herramientas de planificación de viajes gratis para cualquiera. El desarrollo inmobiliario está en fase de planos y la investigación de trading, en verificación privada. Abajo te contamos cada negocio con la etapa a la que ha llegado de verdad.", "교통 사업은 지금 운영되고 있고, 이어지는 다른 사업들의 자금을 대 주고 있어요. 시애틀 전역을 도는 정액 테슬라 서비스, 운전자를 위한 차량 대여 프로그램, 그리고 누구나 무료로 쓸 수 있는 여행 플래너가 여기에 해당해요. 부동산 개발은 아직 설계 단계이고, 거래 연구는 비공개 검증 단계에 있어요. 아래에서 각 사업이 실제로 어디까지 왔는지 하나씩 정리해 드릴게요.", "Mảng vận tải giờ đã chạy thật và đang nuôi vốn cho những mảng tiếp theo: dịch vụ Tesla giá cố định khắp Seattle, chương trình cho tài xế thuê xe, và các công cụ lập kế hoạch hành trình miễn phí cho tất cả mọi người. Mảng bất động sản còn đang ở giai đoạn bản vẽ, còn nghiên cứu giao dịch thì đang được kiểm chứng nội bộ. Bên dưới, chúng mình trình bày từng mảng kèm đúng giai đoạn mà nó đã thật sự đạt tới."],
    "This browser cannot share location.": ["这个浏览器没办法共享位置。", "Este navegador no puede compartir tu ubicación.", "이 브라우저에서는 위치를 공유할 수 없어요.", "Trình duyệt này không chia sẻ được vị trí rồi."],
    "Following your position. Drive times update from where you are.": ["正在跟随你的位置，车程会根据你所在的地方实时更新。", "Siguiendo tu posición. Los tiempos de trayecto se calculan desde donde estás.", "위치를 따라가고 있어요. 이동 시간은 지금 계신 곳을 기준으로 새로 계산돼요.", "Đang bám theo vị trí của bạn. Thời gian di chuyển được cập nhật từ chỗ bạn đang ở."],
    "Click the lock or ⓘ icon beside the address bar → Location → Allow.": ["点一下地址栏旁边的锁形或 ⓘ 图标 → 位置 → 允许。", "Haz clic en el candado o el icono ⓘ junto a la barra de direcciones → Ubicación → Permitir.", "주소창 옆의 자물쇠나 ⓘ 아이콘을 누르고 → 위치 → 허용을 골라 주세요.", "Bấm vào biểu tượng ổ khóa hoặc ⓘ cạnh thanh địa chỉ → Vị trí → Cho phép."],
    "Settings → Safari → Location, or the ⓘ in the address bar.": ["设置 → Safari → 位置，或者点地址栏里的 ⓘ。", "Ajustes → Safari → Ubicación, o el ⓘ de la barra de direcciones.", "설정 → Safari → 위치로 가거나, 주소창의 ⓘ를 눌러 주세요.", "Cài đặt → Safari → Vị trí, hoặc bấm ⓘ trên thanh địa chỉ."],
    "Tap the lock icon beside the address bar → Permissions → Location.": ["点一下地址栏旁边的锁形图标 → 权限 → 位置。", "Toca el candado junto a la barra de direcciones → Permisos → Ubicación.", "주소창 옆 자물쇠 아이콘을 누르고 → 권한 → 위치로 가 주세요.", "Chạm vào biểu tượng ổ khóa cạnh thanh địa chỉ → Quyền → Vị trí."],
})

# ---- The Met guide, translated in full (2026-08-19) ----
# /met was showing entirely in English. Every visible string on the
# page, room names, one-line summaries, artwork highlights, the map
# labels and the frame, translated naturally. Order is [zh, es, ko, vi].
EXTRA.update({
    "The Great Hall": ["大厅", "El Gran Vestíbulo", "대회랑(그레이트 홀)", "Đại Sảnh"],
    "Every visit starts here, so take a minute under the domes to get your bearings before the crowds pull you along.": ["每次参观都从这里开始。趁人流还没把你裹挟着往前带，先在穹顶下站上一会儿，认认方向。", "Toda visita empieza aquí, así que tómate un minuto bajo las cúpulas para ubicarte antes de que la multitud te lleve consigo.", "모든 관람은 여기서 시작해요. 사람들 물결에 휩쓸려 가기 전에, 돔 아래에서 잠깐 여유를 갖고 방향을 잡아 보세요.", "Chuyến thăm nào cũng bắt đầu từ đây, nên bạn hãy dành một phút đứng dưới những mái vòm để định hướng trước khi đám đông cuốn bạn đi nhé."],
    "The three saucer domes": ["三座碟形穹顶", "Las tres cúpulas planas", "세 개의 얕은 접시형 돔", "Ba mái vòm hình đĩa"],
    "Architect Richard Morris Hunt modeled this entrance on the great Roman baths, and it opened in 1902.": ["建筑师理查德·莫里斯·亨特以古罗马大浴场为蓝本设计了这处入口，1902 年正式对外开放。", "El arquitecto Richard Morris Hunt se inspiró en las grandes termas romanas para esta entrada, que abrió en 1902.", "건축가 리처드 모리스 헌트가 로마의 대목욕장을 본떠 이 입구를 설계했고, 1902년에 문을 열었어요.", "Kiến trúc sư Richard Morris Hunt lấy cảm hứng cho lối vào này từ những nhà tắm La Mã đồ sộ, và nó mở cửa vào năm 1902."],
    "The fresh flower arrangements": ["那些新鲜的插花", "Los arreglos de flores frescas", "싱싱한 꽃 장식", "Những bình hoa tươi"],
    "The huge bouquets in the niches are changed every week, paid for by a gift from Lila Acheson Wallace that has kept flowers here since 1969.": ["壁龛里那几束巨大的鲜花每周更换一次，费用来自莱拉·艾奇逊·华莱士的一笔捐赠。从 1969 年起，这里就一直有花相伴。", "Los enormes ramos de los nichos se cambian cada semana, gracias a una donación de Lila Acheson Wallace que ha mantenido flores aquí desde 1969.", "벽감을 채운 커다란 꽃다발은 매주 새로 바뀌는데, 라일라 애치슨 월리스가 남긴 기부금 덕분에 1969년부터 이곳엔 꽃이 끊이지 않고 있어요.", "Những bó hoa lớn đặt trong các hốc tường được thay mỗi tuần, nhờ khoản tặng của Lila Acheson Wallace vốn đã giữ cho nơi đây luôn có hoa từ năm 1969."],
    "Egyptian Art": ["埃及艺术馆", "Arte egipcio", "이집트 미술", "Nghệ thuật Ai Cập"],
    "You walk straight from the Great Hall into 4,000 years of Egypt, laid out in one long chronological sweep.": ["从大厅一路直走进去，就是四千年的古埃及，按时间顺序一气铺陈开来。", "Desde el Gran Vestíbulo entras directo a 4.000 años de Egipto, dispuestos en un largo recorrido cronológico.", "대회랑에서 곧장 걸어 들어가면 4,000년에 걸친 이집트가 긴 시간 순서대로 쭉 펼쳐져요.", "Bạn bước thẳng từ Đại Sảnh vào 4.000 năm lịch sử Ai Cập, được bày ra thành một dòng thời gian dài liền mạch."],
    "The Tomb of Perneb": ["佩尔涅布墓", "La Tumba de Perneb", "페르네브의 무덤", "Lăng mộ Perneb"],
    "This is a real Old Kingdom tomb chapel from Saqqara, about 4,300 years old, and you can walk right into it.": ["这是一座来自萨卡拉的古王国时期真实墓室祭堂，距今约四千三百年，你可以直接走进去看。", "Es una auténtica capilla funeraria del Imperio Antiguo procedente de Saqqara, de unos 4.300 años, y puedes entrar a ella caminando.", "사카라에서 온 진짜 고왕국 시대 무덤 예배당이에요. 약 4,300년이나 됐는데, 안으로 직접 걸어 들어가 볼 수 있어요.", "Đây là một nhà nguyện lăng mộ thật thời Cổ Vương quốc từ Saqqara, khoảng 4.300 năm tuổi, và bạn có thể bước thẳng vào bên trong."],
    "William the hippopotamus": ["河马威廉", "William, el hipopótamo", "하마 윌리엄", "Chú hà mã William"],
    "This little blue faience hippo is the museum's unofficial mascot and was made nearly 4,000 years ago.": ["这只蓝色费昂斯陶小河马是博物馆非官方的吉祥物，距今已有将近四千年。", "Este hipopótamo azul de fayenza es la mascota no oficial del museo y se hizo hace casi 4.000 años.", "이 작고 파란 파이앙스 하마는 미술관의 비공식 마스코트로, 거의 4,000년 전에 만들어졌어요.", "Chú hà mã men xanh nhỏ nhắn này là linh vật không chính thức của bảo tàng, và được làm ra gần 4.000 năm trước."],
    "The statues of Hatshepsut": ["哈特谢普苏特雕像", "Las estatuas de Hatshepsut", "하트셉수트 조각상", "Những bức tượng Hatshepsut"],
    "These portray the woman who ruled Egypt as pharaoh, and they were smashed after her death and patiently pieced back together.": ["这些雕像刻画的是那位以法老身份统治埃及的女性。她去世后雕像被砸毁，后来又被人一点一点耐心地拼了回来。", "Representan a la mujer que gobernó Egipto como faraón. Fueron destrozadas tras su muerte y luego recompuestas con paciencia, pieza por pieza.", "파라오로서 이집트를 다스린 여인의 모습을 담은 조각상이에요. 그녀가 세상을 떠난 뒤 산산조각 났다가, 하나하나 정성껏 다시 맞춘 것들이랍니다.", "Chúng khắc họa người phụ nữ từng trị vì Ai Cập với ngôi vị pharaoh, và đã bị đập vỡ sau khi bà qua đời rồi được kiên nhẫn ghép lại từng mảnh."],
    "The Temple of Dendur": ["丹铎神庙", "El Templo de Dendur", "덴두르 신전", "Đền Dendur"],
    "This is the room everyone remembers, a real Egyptian temple standing in a hall of glass and light.": ["这是每个人都会记住的一个厅，一座真正的埃及神庙静静矗立在满是玻璃与光线的大厅里。", "Esta es la sala que todos recuerdan, un templo egipcio de verdad que se alza en un salón de vidrio y luz.", "누구나 기억에 남는 공간이에요. 유리와 빛으로 가득한 홀 안에 진짜 이집트 신전이 서 있어요.", "Đây là căn phòng ai cũng nhớ, một ngôi đền Ai Cập thật đứng giữa một gian phòng đầy kính và ánh sáng."],
    "The temple itself": ["神庙本身", "El templo en sí", "신전 그 자체", "Bản thân ngôi đền"],
    "Egypt gave this Roman-era temple to the United States in 1965 as thanks for helping rescue monuments from the Aswan dam flooding.": ["1965 年，埃及把这座罗马时期的神庙赠予美国，感谢美国帮忙抢救那些险些被阿斯旺大坝淹没的古迹。", "Egipto regaló este templo de época romana a Estados Unidos en 1965 en agradecimiento por ayudar a salvar monumentos de la inundación de la presa de Asuán.", "이집트는 아스완 댐 수몰에서 유적을 구해 준 고마움의 뜻으로, 1965년에 이 로마 시대 신전을 미국에 선물했어요.", "Ai Cập đã tặng ngôi đền thời La Mã này cho Hoa Kỳ vào năm 1965 để cảm ơn vì đã giúp cứu các công trình khỏi cảnh ngập lụt do đập Aswan gây ra."],
    "The reflecting pool and glass wall": ["倒影池与玻璃幕墙", "El estanque reflectante y el muro de vidrio", "반영 연못과 유리 벽", "Hồ nước phản chiếu và bức tường kính"],
    "The pool stands in for the Nile, and the slanted window fills the room with Central Park light.": ["水池象征着尼罗河，倾斜的玻璃窗把中央公园的天光洒满整个大厅。", "El estanque hace las veces del Nilo, y el ventanal inclinado llena la sala con la luz de Central Park.", "연못은 나일강을 대신하고, 비스듬히 기운 창은 센트럴 파크의 빛으로 방을 가득 채워요.", "Hồ nước tượng trưng cho sông Nile, còn ô cửa kính nghiêng đón ánh sáng từ Công viên Trung tâm tràn vào phòng."],
    "The old graffiti": ["古老的刻字", "Los antiguos grafitis", "옛 낙서", "Những nét khắc cổ trên đá"],
    "Look closely for names carved into the stone by European travelers in the 1820s.": ["凑近细看，能找到十九世纪二十年代欧洲旅人刻在石头上的名字。", "Fíjate bien y encontrarás nombres tallados en la piedra por viajeros europeos en la década de 1820.", "1820년대 유럽 여행자들이 돌에 새겨 놓은 이름들을 가까이서 한번 찾아보세요.", "Bạn hãy nhìn thật kỹ để thấy những cái tên do các lữ khách châu Âu khắc lên đá vào thập niên 1820."],
    "Greek and Roman Art": ["希腊罗马艺术馆", "Arte griego y romano", "그리스 로마 미술", "Nghệ thuật Hy Lạp và La Mã"],
    "The marble courts feel like ancient Rome at street level, and the sculptures reward slow walking.": ["大理石庭院让人仿佛置身古罗马街头，这里的雕塑值得你放慢脚步细细品。", "Los patios de mármol se sienten como la antigua Roma a pie de calle, y las esculturas recompensan a quien camina sin prisa.", "대리석 안뜰은 고대 로마의 거리를 걷는 듯한 기분을 주고, 조각들은 천천히 걸을수록 더 눈에 들어와요.", "Những gian sân bằng đá cẩm thạch cho cảm giác như đang đi giữa đường phố La Mã cổ đại, và các bức tượng rất đáng để bạn thong thả ngắm."],
    "The New York Kouros": ["纽约青年立像（库罗斯）", "El Kurós de Nueva York", "뉴욕 쿠로스", "Tượng Kouros New York"],
    "This marble youth from around 590 BC is one of the earliest complete Greek statues of its kind.": ["这尊约公元前 590 年的大理石青年立像，是同类希腊雕像中最早的完整作品之一。", "Este joven de mármol, de alrededor del 590 a. C., es una de las primeras estatuas griegas completas de su tipo.", "기원전 590년 무렵의 이 대리석 청년상은 같은 종류로는 가장 이른 시기의, 온전한 그리스 조각 가운데 하나예요.", "Bức tượng chàng trai bằng đá cẩm thạch này có từ khoảng năm 590 trước Công nguyên, là một trong những pho tượng Hy Lạp hoàn chỉnh sớm nhất thuộc loại này."],
    "The Leon Levy and Shelby White Court": ["利昂·利维与谢尔比·怀特庭院", "El Patio Leon Levy y Shelby White", "리언 레비와 셸비 화이트 안뜰", "Sân Leon Levy và Shelby White"],
    "Roman marbles stand under a soaring skylight in a court designed to feel like a villa garden.": ["罗马大理石雕像立在高高的天窗之下，整座庭院的设计让人像是走进了一座别墅花园。", "Los mármoles romanos se alzan bajo un altísimo tragaluz, en un patio pensado para sentirse como el jardín de una villa.", "빌라 정원 같은 분위기로 꾸민 안뜰에서, 로마 대리석상들이 높이 트인 천창 아래 서 있어요.", "Những bức tượng đá cẩm thạch La Mã đứng dưới giếng trời cao vút, trong một gian sân được thiết kế để gợi cảm giác như khu vườn của một biệt thự."],
    "The column from the Temple of Artemis at Sardis": ["萨迪斯阿尔忒弥斯神庙的立柱", "La columna del Templo de Artemisa en Sardes", "사르디스 아르테미스 신전에서 온 기둥", "Cây cột từ Đền Artemis ở Sardis"],
    "This giant capital came from one of the largest temples of the ancient world, in what is now Turkey.": ["这枚巨大的柱头来自古代世界最大的神庙之一，遗址就在今天的土耳其。", "Este gigantesco capitel proviene de uno de los templos más grandes del mundo antiguo, en lo que hoy es Turquía.", "이 거대한 기둥머리는 지금의 튀르키예에 있던, 고대 세계에서 가장 큰 신전 가운데 하나에서 온 거예요.", "Đầu cột khổng lồ này đến từ một trong những ngôi đền lớn nhất của thế giới cổ đại, nằm ở nơi ngày nay là Thổ Nhĩ Kỳ."],
    "Arms and Armor": ["盔甲与武器馆", "Armas y armaduras", "무기와 갑옷 전시실", "Phòng vũ khí và giáp trụ"],
    "Kids and adults both light up in here, because knights on horseback are simply hard to beat.": ["大人小孩到了这里眼睛都会发亮，毕竟骑在马背上的骑士实在太让人着迷了。", "Aquí se les iluminan los ojos tanto a niños como a adultos, porque a los caballeros a caballo es difícil ganarles.", "아이도 어른도 여기선 눈이 반짝반짝해요. 말을 탄 기사만큼 멋진 볼거리도 드물거든요.", "Cả trẻ con lẫn người lớn đều thích mê chỗ này, bởi hình ảnh những hiệp sĩ cưỡi ngựa thì quả là khó mà cưỡng lại."],
    "The Equestrian Court": ["骑士庭院", "El Patio Ecuestre", "기마 전시실", "Sân kỵ sĩ"],
    "Armored knights on armored horses parade down the center of the hall under hanging banners.": ["身披铠甲的骑士骑着同样披甲的战马，在垂挂的旗帜下列队走过大厅中央。", "Caballeros con armadura sobre caballos también acorazados desfilan por el centro de la sala bajo estandartes colgantes.", "갑옷을 두른 기사들이 갑옷 입은 말을 타고, 걸린 깃발 아래 홀 한가운데를 행진하듯 줄지어 서 있어요.", "Những hiệp sĩ mặc giáp cưỡi trên lưng ngựa cũng khoác giáp diễu hành giữa gian phòng, bên dưới những lá cờ treo rủ."],
    "The armor of Henry VIII": ["亨利八世的盔甲", "La armadura de Enrique VIII", "헨리 8세의 갑옷", "Bộ giáp của Henry VIII"],
    "This suit was made for the king in 1544 near the end of his life, and it is sized to match him.": ["这套盔甲是 1544 年、也就是国王晚年时为他量身打造的，尺寸完全贴合他本人。", "Esta armadura se hizo para el rey en 1544, hacia el final de su vida, y está hecha a su medida.", "이 갑옷은 헨리 8세의 말년인 1544년에 왕을 위해 만들어졌고, 그의 몸에 꼭 맞게 제작됐어요.", "Bộ giáp này được làm riêng cho nhà vua vào năm 1544, những năm cuối đời ông, và được đo vừa vặn với vóc dáng của ông."],
    "The Japanese armor galleries": ["日本盔甲展厅", "Las salas de armaduras japonesas", "일본 갑옷 전시실", "Các gian giáp trụ Nhật Bản"],
    "The side rooms hold samurai armor and swords by some of Japan's most celebrated makers.": ["两侧的展厅陈列着武士铠甲，还有出自日本几位最负盛名的工匠之手的刀剑。", "Las salas laterales guardan armaduras samurái y espadas de algunos de los maestros más célebres de Japón.", "곁방에는 일본에서 손꼽히는 장인들이 만든 사무라이 갑옷과 검이 전시돼 있어요.", "Những căn phòng bên cạnh trưng bày giáp và kiếm samurai do một số nghệ nhân lừng danh nhất Nhật Bản làm ra."],
    "Medieval Art": ["中世纪艺术馆", "Arte medieval", "중세 미술", "Nghệ thuật Trung Cổ"],
    "This dim, church-like hall is the quietest big space in the museum and a good place to slow down.": ["这座光线幽暗、像教堂一般的大厅，是博物馆里最安静的大空间，很适合放慢脚步歇一歇。", "Esta sala en penumbra, con aire de iglesia, es el gran espacio más tranquilo del museo y un buen lugar para bajar el ritmo.", "교회처럼 은은하게 어두운 이 홀은 미술관에서 가장 조용한 큰 공간이라, 잠시 걸음을 늦추기 좋아요.", "Gian phòng mờ tối, tựa như nhà thờ này là không gian lớn yên tĩnh nhất trong bảo tàng, một nơi tuyệt vời để bạn chậm lại."],
    "The choir screen from Valladolid Cathedral": ["巴利亚多利德大教堂的唱诗席屏风", "La reja del coro de la Catedral de Valladolid", "Valladolid 대성당 성가대 칸막이", "Bức bình phong ca đoàn từ Nhà thờ chính tòa Valladolid"],
    "This towering Spanish ironwork screen fills the end of the hall from floor to ceiling.": ["这座高耸的西班牙铁艺屏风从地面一直延伸到天花板，占满了大厅的尽头。", "Esta imponente reja española de hierro forjado cubre el fondo de la sala del suelo al techo.", "우뚝 솟은 이 스페인 철제 칸막이는 홀 끝을 바닥부터 천장까지 가득 채워요.", "Bức bình phong sắt uốn cao vút của Tây Ban Nha này lấp kín cả đầu gian phòng, từ sàn lên đến tận trần."],
    "The Byzantine galleries": ["拜占庭展厅", "Las salas bizantinas", "비잔틴 전시실", "Các gian Byzantine"],
    "The passages flanking the main staircase hold Byzantine gold, silver, and icons.": ["主楼梯两侧的通道里，陈列着拜占庭的金器、银器和圣像。", "Los pasillos a ambos lados de la escalera principal guardan oro, plata e íconos bizantinos.", "중앙 계단 양옆 통로에는 비잔틴의 금, 은, 그리고 성상들이 전시돼 있어요.", "Những lối đi hai bên cầu thang chính trưng bày vàng, bạc và các bức thánh tượng Byzantine."],
    "The medieval stained glass": ["中世纪彩绘玻璃", "Los vitrales medievales", "중세 스테인드글라스", "Kính màu thời Trung Cổ"],
    "Panels of centuries-old glass glow along the walls, made for churches across Europe.": ["一块块历经数百年的玻璃沿墙散发着光彩，它们当年都是为欧洲各地的教堂而制作的。", "Paneles de vidrio de siglos de antigüedad brillan a lo largo de los muros, hechos para iglesias de toda Europa.", "유럽 곳곳의 교회를 위해 만들어진, 수백 년 된 유리판들이 벽을 따라 은은하게 빛나요.", "Những tấm kính hàng trăm năm tuổi tỏa sáng dọc theo các bức tường, vốn được làm cho các nhà thờ khắp châu Âu."],
    "The Robert Lehman Collection": ["罗伯特·雷曼收藏馆", "La Colección Robert Lehman", "로버트 레먼 컬렉션", "Bộ sưu tập Robert Lehman"],
    "One family's private collection fills a skylit wing at the back, and the quality per square foot is as high as anywhere in the building.": ["一个家族的私人收藏填满了后方一处有天窗的展馆，论每平方米的精彩程度，这里在整座博物馆里也数一数二。", "La colección privada de una sola familia llena un ala con tragaluces al fondo, y la calidad por metro cuadrado es tan alta como en cualquier otra parte del edificio.", "한 가문의 개인 소장품이 뒤편의 천창 있는 별관을 가득 채우는데, 면적당 작품의 밀도와 수준은 미술관 어디에도 뒤지지 않아요.", "Bộ sưu tập riêng của một gia đình lấp đầy cả một cánh nhà có giếng trời ở phía sau, và chất lượng trên mỗi mét vuông thì cao ngang bất kỳ nơi nào khác trong tòa nhà."],
    "Ingres, Portrait of the Princesse de Broglie": ["安格尔《布罗意王妃像》", "Ingres, Retrato de la princesa de Broglie", "앵그르, 브로이 공작부인의 초상", "Ingres, Chân dung Công nương de Broglie"],
    "Ingres painted every fold of her blue satin dress, and it reads like a photograph from across the room.": ["安格尔把她那身蓝色缎裙的每一道褶皱都画了出来，隔着半个房间望过去，简直像一张照片。", "Ingres pintó cada pliegue de su vestido de raso azul, y desde el otro lado de la sala parece una fotografía.", "앵그르는 그녀의 파란 새틴 드레스 주름 하나하나까지 그려 냈고, 방 건너편에서 보면 마치 사진처럼 느껴져요.", "Ingres vẽ tỉ mỉ từng nếp gấp trên chiếc váy sa tanh xanh của bà, và nhìn từ bên kia phòng thì cứ như một tấm ảnh chụp."],
    "Botticelli, The Annunciation": ["波提切利《天使报喜》", "Botticelli, La Anunciación", "보티첼리, 수태고지", "Botticelli, Lễ Truyền tin"],
    "This small panel shows the angel arriving at Mary's door, painted in Florence around 1485.": ["这幅小尺寸的木板画描绘了天使降临到玛利亚门前的一刻，约 1485 年绘于佛罗伦萨。", "Esta pequeña tabla muestra al ángel llegando a la puerta de María, pintada en Florencia hacia 1485.", "이 작은 패널화는 천사가 마리아의 문 앞에 다다르는 장면을 담고 있고, 1485년 무렵 피렌체에서 그려졌어요.", "Bức tranh nhỏ này vẽ cảnh thiên thần đến bên cửa nhà Đức Mẹ Maria, được vẽ ở Florence vào khoảng năm 1485."],
    "The recreated townhouse rooms": ["复原的宅邸房间", "Las salas recreadas de la casa señorial", "재현한 저택의 방들", "Những căn phòng dinh thự được tái dựng"],
    "Several galleries reproduce rooms from Robert Lehman's own home, so it feels like visiting a private collector.": ["好几间展厅复原了罗伯特·雷曼自家的房间，走进去就像去拜访一位私人收藏家。", "Varias salas reproducen habitaciones de la propia casa de Robert Lehman, así que se siente como visitar a un coleccionista privado.", "여러 전시실이 로버트 레먼의 집에 있던 방들을 그대로 재현해서, 마치 개인 수집가의 집에 초대받은 듯한 기분이 들어요.", "Một vài gian trưng bày tái hiện lại các căn phòng trong chính ngôi nhà của Robert Lehman, nên bạn sẽ có cảm giác như đang ghé thăm nhà một nhà sưu tầm."],
    "The American Wing": ["美国馆", "El Ala Americana", "미국관", "Cánh Mỹ"],
    "The sunny garden court makes a natural rest stop, with the most famous American painting a short stair climb away.": ["阳光明媚的花园庭院是天然的歇脚处，而那幅最著名的美国画作，就在上几级台阶的地方。", "El soleado patio ajardinado es una parada de descanso natural, con la pintura estadounidense más famosa a solo unos escalones de distancia.", "햇살 드는 정원 안뜰은 잠시 쉬어 가기 딱 좋은 곳이고, 가장 유명한 미국 회화도 계단만 조금 오르면 만날 수 있어요.", "Gian sân vườn ngập nắng là một chỗ nghỉ chân lý tưởng, còn bức tranh Mỹ nổi tiếng nhất thì chỉ cách đó vài bậc thang."],
    "Washington Crossing the Delaware": ["《华盛顿横渡特拉华河》", "Washington cruzando el Delaware", "델라웨어강을 건너는 워싱턴", "Washington vượt sông Delaware"],
    "Leutze's canvas is over twelve feet tall and twenty one feet wide, and it hangs upstairs in this wing.": ["洛伊茨的这幅画高逾十二英尺、宽约二十一英尺，就挂在本馆的楼上。", "El lienzo de Leutze mide más de tres metros y medio de alto y unos seis y medio de ancho, y cuelga en el piso de arriba de esta ala.", "로이체의 이 그림은 높이 12피트, 폭 21피트가 넘고, 이 별관 위층에 걸려 있어요.", "Bức tranh của Leutze cao hơn ba mét rưỡi và rộng hơn sáu mét, được treo ở tầng trên trong cánh nhà này."],
    "The Tiffany loggia": ["蒂芙尼敞廊", "La logia de Tiffany", "티파니 로지아", "Hành lang Tiffany"],
    "Louis Comfort Tiffany built this flower-columned loggia for his own Long Island estate, Laurelton Hall.": ["路易斯·康福特·蒂芙尼当年为自己在长岛的宅邸劳雷尔顿庄园建造了这座饰有花柱的敞廊。", "Louis Comfort Tiffany construyó esta logia de columnas floridas para su propia finca en Long Island, Laurelton Hall.", "루이스 컴포트 티파니가 롱아일랜드에 있던 자신의 저택 로렐턴 홀을 위해 꽃 모양 기둥의 이 로지아를 지었어요.", "Louis Comfort Tiffany đã dựng hành lang với những cây cột hình hoa này cho chính khu điền trang Laurelton Hall của ông ở Long Island."],
    "Saint-Gaudens, Diana": ["圣高登斯《狩猎女神狄安娜》", "Saint-Gaudens, «Diana»", "생 고당, 디아나", "Saint-Gaudens, Nữ thần Diana"],
    "This gilded Diana is a smaller cast of the figure that once spun as a weathervane over the old Madison Square Garden; the original is in Philadelphia.": ["这尊镀金的狄安娜是一件较小的翻铸版本，原作曾作为风向标在老麦迪逊广场花园顶上随风转动，如今收藏在费城。", "Esta Diana dorada es una versión más pequeña de la figura que en su día giraba como veleta sobre el antiguo Madison Square Garden; la original está en Filadelfia.", "금빛으로 도금한 이 디아나는 옛 매디슨 스퀘어 가든 위에서 풍향계로 돌던 조각상을 작게 뜬 것이고, 원본은 필라델피아에 있어요.", "Bức tượng Diana mạ vàng này là bản đúc nhỏ hơn của pho tượng từng quay như chong chóng gió trên nóc Madison Square Garden cũ; bản gốc hiện đặt tại Philadelphia."],
    "Modern and Contemporary Art": ["现当代艺术馆", "Arte moderno y contemporáneo", "근현대 미술", "Nghệ thuật hiện đại và đương đại"],
    "The modern wing gives you the American modernists downstairs and Pollock one level up, without the crowds you would face at MoMA.": ["现代馆楼下是美国现代主义画家的作品，波洛克则在上一层，而且不用像在 MoMA 那样人挤人。", "El ala moderna te ofrece a los modernistas estadounidenses en la planta baja y a Pollock un nivel más arriba, sin la multitud que encontrarías en el MoMA.", "현대 미술 별관에서는 아래층에서 미국 모더니스트 작가들을, 한 층 위에서 폴록을 만날 수 있는데, MoMA에서처럼 붐비지 않아요.", "Cánh nhà hiện đại đưa bạn đến với các họa sĩ hiện đại Mỹ ở tầng dưới và Pollock ở tầng trên, mà không phải chen chúc như khi bạn đến MoMA."],
    "Jackson Pollock, Autumn Rhythm (Number 30)": ["杰克逊·波洛克《秋韵（第 30 号）》", "Jackson Pollock, Ritmo de otoño (Número 30)", "잭슨 폴록, 가을의 리듬(넘버 30)", "Jackson Pollock, Nhịp điệu mùa thu (Số 30)"],
    "Pollock made this drip painting on the floor of his Long Island barn in 1950. It hangs upstairs in this wing, one level up.": ["1950 年，波洛克在长岛谷仓的地板上完成了这幅滴画。它就挂在本馆的楼上，再上一层。", "Pollock hizo esta pintura por goteo en el suelo de su granero de Long Island en 1950. Cuelga en el piso de arriba de esta ala, un nivel más arriba.", "폴록은 1950년 롱아일랜드 헛간 바닥에서 이 드리핑 회화를 그렸어요. 이 별관의 한 층 위층에 걸려 있어요.", "Pollock đã tạo nên bức tranh nhỏ giọt này ngay trên sàn nhà kho của ông ở Long Island vào năm 1950. Tranh được treo ở tầng trên trong cánh nhà này, cao hơn một tầng."],
    "Thomas Hart Benton, America Today": ["托马斯·哈特·本顿《今日美国》", "Thomas Hart Benton, América hoy", "토머스 하트 벤턴, 오늘의 아메리카", "Thomas Hart Benton, Nước Mỹ hôm nay"],
    "This ten-panel mural wraps around the room the way it did in its original 1930s boardroom.": ["这组由十块画板组成的壁画环绕着整个房间，就像它当年在二十世纪三十年代那间董事会会议室里一样。", "Este mural de diez paneles envuelve la sala igual que lo hacía en la sala de juntas original de los años treinta.", "열 폭으로 된 이 벽화는 1930년대 원래의 회의실에서 그랬던 것처럼 방을 빙 둘러 감싸고 있어요.", "Bức bích họa gồm mười tấm này bao quanh cả căn phòng, đúng như cách nó từng bao quanh phòng họp gốc hồi thập niên 1930."],
    "Charles Demuth, I Saw the Figure 5 in Gold": ["查尔斯·德穆斯《我看见金色的数字 5》", "Charles Demuth, Vi el número 5 en oro", "찰스 데무스, 나는 금빛 숫자 5를 보았다", "Charles Demuth, Tôi thấy con số 5 màu vàng kim"],
    "Demuth painted it as a portrait of his friend the poet William Carlos Williams, built from his poem about a fire engine.": ["德穆斯把这幅画当作好友、诗人威廉·卡洛斯·威廉斯的肖像来创作，灵感来自他一首写消防车的诗。", "Demuth lo pintó como retrato de su amigo, el poeta William Carlos Williams, a partir de su poema sobre un camión de bomberos.", "데무스는 친구인 시인 윌리엄 칼로스 윌리엄스의 초상으로 이 그림을 그렸는데, 소방차를 노래한 그의 시에서 영감을 얻었어요.", "Demuth vẽ bức này như một bức chân dung của người bạn ông, nhà thơ William Carlos Williams, lấy ý từ bài thơ của ông về một chiếc xe cứu hỏa."],
    "The Grand Staircase": ["大楼梯", "La Gran Escalera", "대계단", "Cầu thang lớn"],
    "The grand staircase is the classic route up to the paintings, and worth the climb for its own sake.": ["这座大楼梯是通往楼上画作的经典路线，单是拾级而上本身就值得一走。", "La gran escalera es la ruta clásica para subir a las pinturas, y merece la pena subirla por sí sola.", "대계단은 회화 전시실로 올라가는 대표적인 길이고, 그 자체만으로도 올라가 볼 가치가 있어요.", "Cầu thang lớn là lối đi kinh điển để lên khu tranh, và bản thân việc leo lên đó cũng đã đáng công rồi."],
    "The staircase itself": ["楼梯本身", "La escalera en sí", "계단 그 자체", "Bản thân cầu thang"],
    "It lines you up straight from the front doors to the Old Master paintings above.": ["它把你从正门一路笔直地引向楼上的古典大师画作。", "Te alinea en línea recta desde la puerta principal hasta las pinturas de los grandes maestros de arriba.", "정문에서 위층 옛 거장들의 회화까지 곧장 이어져요.", "Nó dẫn bạn đi thẳng một mạch từ cửa chính lên đến khu tranh của các bậc thầy cổ điển ở phía trên."],
    "Tiepolo, The Triumph of Marius": ["提埃波罗《马略的凯旋》", "Tiépolo, El triunfo de Mario", "티에폴로, 마리우스의 개선", "Tiepolo, Khải hoàn của Marius"],
    "Tiepolo's enormous canvas greets you at the top of the stairs.": ["走到楼梯顶端，迎面就是提埃波罗那幅巨大的画作。", "El enorme lienzo de Tiépolo te recibe en lo alto de la escalera.", "계단 꼭대기에 오르면 티에폴로의 거대한 그림이 반겨 줘요.", "Bức tranh khổng lồ của Tiepolo chào đón bạn ngay trên đầu cầu thang."],
    "European Paintings 1300 to 1800": ["欧洲绘画（1300 至 1800 年）", "Pintura europea de 1300 a 1800", "유럽 회화 1300년에서 1800년", "Hội họa châu Âu từ 1300 đến 1800"],
    "The skylit galleries up here hold the Old Masters, and this is where most visitors should plan their longest stretch.": ["楼上这些带天窗的展厅陈列着古典大师的作品，大多数人都该把最长的一段参观时间留给这里。", "Las salas con tragaluces de aquí arriba albergan a los grandes maestros, y es donde la mayoría de los visitantes deberían dedicar su rato más largo.", "위층 천창 전시실에는 옛 거장들의 작품이 있는데, 대부분의 관람객은 이곳을 가장 오래 머물 곳으로 잡으면 좋아요.", "Những gian trưng bày có giếng trời ở trên này lưu giữ tranh của các bậc thầy cổ điển, và đây là nơi hầu hết du khách nên dành nhiều thời gian nhất."],
    "Rembrandt, Aristotle with a Bust of Homer": ["伦勃朗《亚里士多德与荷马半身像》", "Rembrandt, Aristóteles con un busto de Homero", "렘브란트, 호메로스 흉상을 바라보는 아리스토텔레스", "Rembrandt, Aristotle bên tượng bán thân Homer"],
    "The museum bought this Rembrandt in 1961 for a record price, and crowds lined up around the block to see it.": ["1961 年，博物馆以创纪录的价格买下这幅伦勃朗，当时人们排起的长队绕了整整一个街区。", "El museo compró este Rembrandt en 1961 por un precio récord, y la gente hacía fila dando la vuelta a la manzana para verlo.", "미술관은 1961년 사상 최고가로 이 렘브란트 작품을 사들였고, 이 그림을 보려고 사람들이 건물을 빙 둘러 줄을 섰어요.", "Bảo tàng đã mua bức Rembrandt này vào năm 1961 với mức giá kỷ lục, và người ta xếp hàng vòng quanh cả khu phố chỉ để được ngắm nó."],
    "Bruegel, The Harvesters": ["勃鲁盖尔《收割者》", "Brueghel, Los segadores", "브뤼헐, 추수하는 사람들", "Bruegel, Những người thợ gặt"],
    "Bruegel painted this wheat harvest in 1565, and it is one of the first great paintings of everyday labor.": ["勃鲁盖尔在 1565 年画下了这片麦收景象，它是最早以日常劳作为题的伟大画作之一。", "Brueghel pintó esta cosecha de trigo en 1565, y es una de las primeras grandes pinturas del trabajo cotidiano.", "브뤼헐은 1565년에 이 밀 수확 장면을 그렸는데, 평범한 사람들의 노동을 담은 첫 걸작 가운데 하나예요.", "Bruegel vẽ cảnh mùa gặt lúa mì này vào năm 1565, và đây là một trong những bức tranh lớn đầu tiên khắc họa lao động thường ngày."],
    "David, The Death of Socrates": ["大卫《苏格拉底之死》", "David, La muerte de Sócrates", "다비드, 소크라테스의 죽음", "David, Cái chết của Socrates"],
    "David shows Socrates reaching for the cup of hemlock while still teaching his students.": ["大卫画的是苏格拉底一边伸手去接那杯毒芹汁，一边仍在向学生们讲授的一刻。", "David muestra a Sócrates tomando la copa de cicuta mientras aún enseña a sus discípulos.", "다비드는 소크라테스가 제자들을 가르치면서도 독배를 향해 손을 뻗는 순간을 그렸어요.", "David khắc họa Socrates đưa tay lấy chén thuốc độc trong khi vẫn đang giảng dạy các học trò của mình."],
    "Nineteenth-Century European Paintings and Sculpture": ["十九世纪欧洲绘画与雕塑", "Pintura y escultura europea del siglo XIX", "19세기 유럽 회화와 조각", "Hội họa và điêu khắc châu Âu thế kỷ 19"],
    "If you only have energy for one painting section, most visitors choose this one for Van Gogh, Monet, and Degas.": ["如果你只有精力看一个绘画展区，多数人都会为了梵高、莫奈和德加而选这里。", "Si solo te quedan energías para una sección de pintura, la mayoría elige esta por Van Gogh, Monet y Degas.", "회화 구역을 딱 하나만 볼 여력이 있다면, 대부분의 관람객은 반 고흐, 모네, 드가가 있는 이곳을 골라요.", "Nếu bạn chỉ còn sức cho một khu tranh thôi, thì hầu hết du khách chọn khu này để ngắm Van Gogh, Monet và Degas."],
    "Van Gogh, Wheat Field with Cypresses": ["梵高《麦田与柏树》", "Van Gogh, Trigal con cipreses", "반 고흐, 사이프러스가 있는 밀밭", "Van Gogh, Cánh đồng lúa mì với cây bách"],
    "Van Gogh painted this near the asylum at Saint-Remy in the summer of 1889.": ["1889 年夏天，梵高在圣雷米疗养院附近画下了这幅画。", "Van Gogh lo pintó cerca del sanatorio de Saint-Rémy en el verano de 1889.", "반 고흐는 1889년 여름 생레미의 요양원 근처에서 이 그림을 그렸어요.", "Van Gogh đã vẽ bức này gần trại điều dưỡng ở Saint-Remy vào mùa hè năm 1889."],
    "Degas, The Little Fourteen-Year-Old Dancer": ["德加《十四岁的小舞者》", "Degas, La pequeña bailarina de catorce años", "드가, 열네 살의 어린 무용수", "Degas, Cô vũ công nhỏ mười bốn tuổi"],
    "The wax original scandalized Paris, and this bronze still wears a real fabric skirt and hair ribbon.": ["那件蜡制原作曾在巴黎引起轩然大波，而这件青铜像至今仍穿着真正的布裙、系着真的发带。", "El original en cera escandalizó a París, y este bronce todavía lleva una falda de tela real y un lazo en el pelo.", "밀랍으로 만든 원작은 파리를 발칵 뒤집어 놓았고, 이 청동상은 지금도 진짜 천으로 된 치마와 머리 리본을 두르고 있어요.", "Bản gốc bằng sáp từng gây xôn xao khắp Paris, còn bản đúc đồng này đến nay vẫn mặc một chiếc váy vải thật và thắt nơ tóc thật."],
    "Monet, Bridge over a Pond of Water Lilies": ["莫奈《睡莲池上的桥》", "Monet, El puente sobre un estanque de nenúfares", "모네, 수련 연못 위의 다리", "Monet, Cây cầu bắc qua ao hoa súng"],
    "Monet painted the footbridge in his own garden at Giverny in 1899.": ["1899 年，莫奈画下了自家吉维尼花园里的那座小木桥。", "Monet pintó este puente peatonal en su propio jardín de Giverny en 1899.", "모네는 1899년 지베르니에 있는 자신의 정원에서 이 다리를 그렸어요.", "Monet đã vẽ chiếc cầu nhỏ trong chính khu vườn của ông ở Giverny vào năm 1899."],
    "Asian Art and the Astor Court": ["亚洲艺术馆与阿斯特庭院", "Arte asiático y el Patio Astor", "아시아 미술과 애스터 안뜰", "Nghệ thuật châu Á và Sân Astor"],
    "The Chinese garden court is a pocket of calm, and the galleries around it hold some of the museum's biggest surprises.": ["这处中式园林庭院是一方难得的宁静角落，环绕四周的展厅里藏着博物馆里最让人惊喜的一些珍藏。", "El patio ajardinado chino es un rincón de calma, y las salas que lo rodean guardan algunas de las mayores sorpresas del museo.", "중국식 정원 안뜰은 고요함이 감도는 쉼터이고, 그 주변 전시실에는 미술관에서 가장 놀라운 작품들이 숨어 있어요.", "Gian sân vườn kiểu Trung Hoa là một góc bình yên, và các gian trưng bày xung quanh cất giữ vài điều bất ngờ thú vị nhất của bảo tàng."],
    "The Astor Chinese Garden Court": ["阿斯特中式园林庭院", "El Patio Ajardinado Chino Astor", "애스터 중국 정원 안뜰", "Sân vườn Trung Hoa Astor"],
    "Craftsmen from Suzhou built this Ming-style courtyard by hand inside the museum in 1980.": ["1980 年，来自苏州的工匠在博物馆内部亲手建起了这座明代风格的庭院。", "Artesanos de Suzhou construyeron a mano este patio de estilo Ming dentro del museo en 1980.", "쑤저우에서 온 장인들이 1980년에 미술관 안에서 이 명나라 양식의 안뜰을 손수 지었어요.", "Những người thợ đến từ Tô Châu đã dựng nên gian sân kiểu nhà Minh này bằng tay ngay trong bảo tàng vào năm 1980."],
    "The Buddha of Medicine wall mural": ["药师佛壁画", "El mural del Buda de la Medicina", "약사불 벽화", "Bức bích họa Phật Dược Sư"],
    "This huge 14th-century mural came from a temple in Shanxi province and covers an entire wall.": ["这幅十四世纪的巨幅壁画来自山西省的一座寺庙，覆盖了整整一面墙。", "Este enorme mural del siglo XIV proviene de un templo de la provincia de Shanxi y cubre un muro entero.", "14세기에 그려진 이 거대한 벽화는 산시성의 한 사찰에서 온 것으로, 벽 하나를 통째로 덮고 있어요.", "Bức bích họa khổng lồ từ thế kỷ 14 này đến từ một ngôi chùa ở tỉnh Sơn Tây và phủ kín cả một bức tường."],
    "The Ming scholar's room": ["明代书房", "El estudio del erudito Ming", "명나라 서재", "Thư phòng của nho sĩ thời Minh"],
    "A quiet study furnished with Ming dynasty hardwood furniture sits right beside the garden court.": ["一间陈设着明代硬木家具的静谧书房，就在园林庭院旁边。", "Un tranquilo estudio amueblado con muebles de madera noble de la dinastía Ming se encuentra justo al lado del patio ajardinado.", "명나라 시대 원목 가구로 꾸민 고요한 서재가 정원 안뜰 바로 옆에 자리하고 있어요.", "Một thư phòng tĩnh lặng bày biện đồ gỗ quý thời nhà Minh nằm ngay cạnh gian sân vườn."],
    "Islamic Art": ["伊斯兰艺术馆", "Arte islámico", "이슬람 미술", "Nghệ thuật Hồi giáo"],
    "These galleries are quieter than the paintings floors and hold some of the most detailed craftsmanship in the building.": ["这些展厅比绘画楼层要安静得多，收藏着整座博物馆里最精细的一些工艺。", "Estas salas son más tranquilas que las plantas de pintura y guardan algunas de las obras de artesanía más detalladas del edificio.", "이 전시실들은 회화 층보다 한결 조용하고, 미술관에서 가장 정교한 세공품들을 품고 있어요.", "Những gian trưng bày này yên tĩnh hơn các tầng tranh, và lưu giữ vài tác phẩm thủ công tinh xảo bậc nhất trong tòa nhà."],
    "The Damascus Room": ["大马士革厅", "La Sala de Damasco", "다마스쿠스 방", "Phòng Damascus"],
    "This winter reception room from a home in Damascus dates to 1707, with its painted poetry panels intact.": ["这间冬季会客室来自大马士革的一户人家，建于 1707 年，绘有诗句的墙板至今完好。", "Esta sala de recepción de invierno, procedente de una casa de Damasco, data de 1707 y conserva intactos sus paneles con poesía pintada.", "다마스쿠스의 한 저택에서 온 이 겨울 응접실은 1707년에 지어졌고, 시가 적힌 채색 판들이 그대로 남아 있어요.", "Căn phòng tiếp khách mùa đông này từ một ngôi nhà ở Damascus có từ năm 1707, với những tấm ván khắc thơ vẽ tay vẫn còn nguyên vẹn."],
    "The mihrab from Isfahan": ["伊斯法罕的米哈拉布（礼拜壁龛）", "El mihrab de Isfahán", "이스파한에서 온 미흐라브", "Hốc cầu nguyện mihrab từ Isfahan"],
    "This prayer niche is covered in deep blue mosaic tilework and was made in Iran in the 1350s.": ["这处礼拜壁龛通体覆盖着深蓝色的马赛克瓷砖，十四世纪五十年代制作于伊朗。", "Este nicho de oración está cubierto de azulejos de mosaico de un azul profundo y se hizo en Irán en la década de 1350.", "이 기도용 벽감은 짙푸른 모자이크 타일로 뒤덮여 있고, 1350년대 이란에서 만들어졌어요.", "Hốc cầu nguyện này được phủ kín bằng những viên gạch khảm màu xanh thẫm và được làm ra ở Iran vào thập niên 1350."],
    "The Moroccan Court": ["摩洛哥庭院", "El Patio Marroquí", "모로코 안뜰", "Sân Ma Rốc"],
    "Craftsmen from Fez carved and tiled this courtyard on site in 2011 using traditional methods.": ["2011 年，来自非斯的工匠用传统工艺，在现场雕琢、铺贴出了这座庭院。", "Artesanos de Fez tallaron y revistieron de azulejos este patio in situ en 2011 con métodos tradicionales.", "페스에서 온 장인들이 2011년에 전통 방식으로 이 안뜰을 현장에서 직접 조각하고 타일을 붙였어요.", "Những người thợ đến từ Fez đã chạm khắc và lát gạch cho gian sân này ngay tại chỗ vào năm 2011 bằng các phương pháp truyền thống."],
    "ENTER HERE": ["从这里进入", "ENTRA AQUÍ", "여기로 들어가세요", "VÀO ĐÂY"],
    "TO FLOOR 2": ["前往二层", "A LA PLANTA 2", "2층으로", "LÊN TẦNG 2"],
    "TO FLOOR 1": ["前往一层", "A LA PLANTA 1", "1층으로", "XUỐNG TẦNG 1"],
    "MET-3D · Both floors": ["MET-3D · 两层楼", "MET-3D · Ambas plantas", "MET-3D · 두 층 모두", "MET-3D · Cả hai tầng"],
    "Drag to turn the building. Floor 2 floats above Floor 1.": ["拖动可以转动整座建筑。二层悬浮在一层之上。", "Arrastra para girar el edificio. La planta 2 flota sobre la planta 1.", "끌어서 건물을 돌려 보세요. 2층이 1층 위에 떠 있어요.", "Kéo để xoay tòa nhà. Tầng 2 nổi lơ lửng phía trên Tầng 1."],
    "A walk inside the Met": ["大都会博物馆里的一段漫步", "Un paseo dentro del Met", "메트 미술관 안 산책", "Một chuyến dạo bên trong bảo tàng Met"],
    "Already in your walks": ["已经在你的路线里了", "Ya está en tus paseos", "이미 저장한 산책에 들어 있어요", "Đã có trong các chuyến dạo của bạn"],
    "Copy this link:": ["复制这个链接：", "Copia este enlace:", "이 링크를 복사하세요:", "Sao chép liên kết này:"],
    "Could not save": ["保存失败", "No se pudo guardar", "저장하지 못했어요", "Không lưu được"],
    "Link copied": ["链接已复制", "Enlace copiado", "링크를 복사했어요", "Đã sao chép liên kết"],
    "Pick rooms first": ["请先选几个展厅", "Primero elige salas", "먼저 방을 골라 주세요", "Hãy chọn phòng trước đã"],
    "Saved, see The Walks": ["已保存，去“我的路线”看看", "Guardado, mira Los Paseos", "저장했어요, 산책 목록을 확인해 보세요", "Đã lưu, xem mục Các chuyến dạo"],
    "Sign in at the top first": ["请先在顶部登录", "Primero inicia sesión arriba", "먼저 위쪽에서 로그인해 주세요", "Hãy đăng nhập ở phía trên trước đã"],
    "CENTRAL PARK": ["中央公园", "CENTRAL PARK", "센트럴 파크", "CÔNG VIÊN TRUNG TÂM"],
    "FIFTH AVENUE": ["第五大道", "QUINTA AVENIDA", "5번가", "ĐẠI LỘ SỐ NĂM"],
    "Where travellers came from →": ["旅行者从哪里来 →", "De dónde vinieron los viajeros →", "여행자들은 어디서 왔을까요 →", "Du khách đến từ đâu →"],
    "The map of visitor cities, countries, and how they found you": ["一张地图，展示访客来自哪些城市、哪些国家，以及他们是怎么找到你的", "El mapa de las ciudades y países de los visitantes, y de cómo te encontraron", "방문객의 도시와 나라, 그리고 저희를 어떻게 찾아왔는지 보여 주는 지도예요", "Bản đồ các thành phố, quốc gia của khách ghé thăm, và cách họ tìm ra bạn"],
    "No visitor cities have been located yet since the last deploy. As people visit, their cities appear on the map here.": ["自上次部署以来，还没有定位到任何访客城市。随着人们陆续来访，他们所在的城市就会显示在这张地图上。", "Todavía no se ha ubicado ninguna ciudad de visitantes desde el último despliegue. A medida que la gente visite, sus ciudades irán apareciendo en el mapa aquí.", "마지막 배포 이후 아직 방문객 도시가 잡히지 않았어요. 사람들이 방문하면 그 도시들이 여기 지도에 나타나요.", "Chưa xác định được thành phố nào của khách kể từ lần triển khai gần nhất. Khi có người ghé thăm, thành phố của họ sẽ hiện lên trên bản đồ ở đây."],
    "Inside the Met, a footprint map · Plateau Strategy": ["走进大都会博物馆，一张足迹地图 · Plateau Strategy", "Dentro del Met, un mapa de pisadas · Plateau Strategy", "메트 미술관 속, 발자국 지도 · Plateau Strategy", "Bên trong bảo tàng Met, một bản đồ dấu chân · Plateau Strategy"],
    "Trip planner": ["行程规划", "Planificador de viajes", "여행 계획 도우미", "Công cụ lên kế hoạch chuyến đi"],
    "Inside the Met, on footprints": ["循着足迹，走进大都会博物馆", "Dentro del Met, siguiendo las pisadas", "발자국 따라 메트 미술관 속으로", "Bên trong bảo tàng Met, theo từng dấu chân"],
    "The map on your phone goes grey the moment you step inside. This is a schematic of the Metropolitan Museum of Art, drawn by us, not to scale, with the rooms where they really sit. Tap the rooms you want in the order you want them, and footprints walk the route with honest times.": ["你一踏进馆内，手机上的地图就变成一片灰。这是我们自己绘制的大都会艺术博物馆示意图，并非按比例，但每个展厅都画在它真实所在的位置。按你想去的顺序点选各个展厅，一串足迹就会带着实打实的时间，替你把这条路线走一遍。", "El mapa de tu teléfono se vuelve gris en cuanto entras. Este es un esquema del Museo Metropolitano de Arte, dibujado por nosotros, sin escala, con las salas donde de verdad están. Toca las salas que quieras en el orden que quieras, y unas pisadas recorren la ruta con tiempos honestos.", "휴대폰 지도는 안으로 들어서는 순간 잿빛으로 변해 버려요. 이건 저희가 직접 그린 메트로폴리탄 미술관 도면이에요. 실제 축척은 아니지만, 방들은 정말 있는 자리에 그대로 표시해 뒀어요. 원하는 방을 원하는 순서대로 눌러 보세요. 그러면 발자국이 솔직한 소요 시간과 함께 그 길을 따라 걸어 줘요.", "Tấm bản đồ trên điện thoại của bạn sẽ chuyển sang màu xám ngay khoảnh khắc bạn bước vào trong. Đây là sơ đồ của Bảo tàng Nghệ thuật Metropolitan, do chúng mình tự vẽ, không theo tỷ lệ, với các phòng đặt đúng vị trí thật của chúng. Bạn hãy chạm vào những phòng mình muốn theo thứ tự bạn muốn, và các dấu chân sẽ đi hết lộ trình với thời gian trung thực."],
    "Times marked with a tilde are estimates until one of our surveyors walks that corridor with the recorder. A walked corridor shows its measured minutes. That is the footprint rule: a person who knows the way walks it once, and the walk becomes the map.": ["带波浪号的时间都还是估算，要等我们的测绘员带着计时器亲自走过那条走廊才算数。走过的走廊，显示的就是实测的分钟数。这就是足迹的规矩：一个认路的人把它走一遍，这一走，就成了地图。", "Los tiempos marcados con una tilde son estimaciones hasta que uno de nuestros topógrafos recorre ese pasillo con el registrador. Un pasillo ya recorrido muestra sus minutos medidos. Esa es la regla de las pisadas: una persona que conoce el camino lo recorre una vez, y ese recorrido se convierte en el mapa.", "물결표(~)가 붙은 시간은 저희 조사원이 기록계를 들고 그 복도를 직접 걷기 전까지는 어림값이에요. 한 번 걸어 본 복도에는 실제로 잰 시간이 표시돼요. 그게 바로 발자국 원칙이랍니다. 길을 아는 사람이 한 번 걸으면, 그 걸음이 곧 지도가 되는 거예요.", "Những mốc thời gian có dấu ngã ở phía trước là con số ước lượng, cho đến khi một người khảo sát của chúng mình đích thân đi qua hành lang đó cùng thiết bị ghi. Một hành lang đã được đi qua sẽ hiển thị số phút đo được thật sự. Đó chính là quy tắc dấu chân: một người thạo đường đi qua nó một lần, và chuyến đi ấy trở thành tấm bản đồ."],
    "Project ·": ["项目 ·", "Proyecto ·", "프로젝트 ·", "Dự án ·"],
    "Footprints": ["足迹", "Pisadas", "발자국", "Dấu chân"],
    "Sheet ·": ["图纸 ·", "Hoja ·", "도면 ·", "Bản vẽ ·"],
    "MET-01 · Floor 1": ["MET-01 · 一层", "MET-01 · Planta 1", "MET-01 · 1층", "MET-01 · Tầng 1"],
    "Scale ·": ["比例 ·", "Escala ·", "축척 ·", "Tỷ lệ ·"],
    "not to scale": ["非按比例", "sin escala", "실제 축척 아님", "không theo tỷ lệ"],
    "Drawn ·": ["绘制 ·", "Dibujado ·", "작도 ·", "Vẽ bởi ·"],
    "our own schematic": ["我们自己画的示意图", "nuestro propio esquema", "저희가 직접 그린 도면", "sơ đồ do chúng mình tự vẽ"],
    "Floor 1": ["一层", "Planta 1", "1층", "Tầng 1"],
    "Floor 2": ["二层", "Planta 2", "2층", "Tầng 2"],
    "3D": ["立体", "3D", "3D 보기", "Chế độ 3D"],
    "▢ a named room. Tap to add it to your walk.": ["▢ 一间标了名字的展厅。点一下就能把它加进你的路线。", "▢ una sala con nombre. Tócala para añadirla a tu paseo.", "▢ 이름이 붙은 방이에요. 눌러서 산책 경로에 넣어 보세요.", "▢ một phòng có tên. Chạm để thêm phòng đó vào chuyến dạo của bạn."],
    "· · · a corridor we have opened": ["· · · 一条我们已经走通的走廊", "· · · un pasillo que hemos abierto", "· · · 저희가 열어 둔 복도예요", "· · · một hành lang mà chúng mình đã mở"],
    "👣 your route": ["👣 你的路线", "👣 tu ruta", "👣 나의 경로", "👣 lộ trình của bạn"],
    "Fifth Avenue is to the right; Central Park to the left.": ["第五大道在右边，中央公园在左边。", "La Quinta Avenida queda a la derecha; Central Park, a la izquierda.", "5번가는 오른쪽, 센트럴 파크는 왼쪽에 있어요.", "Đại lộ số Năm nằm bên phải; Công viên Trung tâm nằm bên trái."],
    "Your walk": ["你的路线", "Tu paseo", "나의 산책 경로", "Chuyến dạo của bạn"],
    "Nothing picked yet": ["还没有选任何展厅", "Todavía no has elegido nada", "아직 고른 게 없어요", "Chưa chọn gì cả"],
    "Tap rooms on the sheet, in the order you want to see them. The Grand Staircase is added by itself when your route changes floors.": ["按你想参观的顺序，在图纸上依次点选各个展厅。当路线需要换楼层时，大楼梯会自动加进来。", "Toca las salas en la hoja, en el orden en que quieras verlas. La Gran Escalera se añade sola cuando tu ruta cambia de planta.", "보고 싶은 순서대로 도면에서 방을 눌러 보세요. 경로가 층을 오갈 때는 대계단이 저절로 더해져요.", "Bạn hãy chạm vào các phòng trên bản vẽ, theo thứ tự bạn muốn ghé thăm. Cầu thang lớn sẽ tự động được thêm vào khi lộ trình của bạn chuyển tầng."],
    "Share this walk": ["分享这条路线", "Comparte este paseo", "이 산책 경로 공유하기", "Chia sẻ chuyến dạo này"],
    "Save this walk": ["保存这条路线", "Guarda este paseo", "이 산책 경로 저장하기", "Lưu chuyến dạo này"],
    "Start over": ["重新开始", "Empezar de nuevo", "다시 시작하기", "Bắt đầu lại"],
    "This page is a drawing and a plan, not the museum. Hours, tickets and closures live at metmuseum.org. Our schematic simplifies; the building will always be bigger than the sheet. Gallery contents shift over years, so we name wings and anchors, never gallery numbers. Every city's corridors live in": ["这个页面是一张图、一份方案，而不是博物馆本身。开放时间、门票和闭馆信息都在 metmuseum.org 上。我们的示意图做了简化，真实的建筑永远比图纸更大。展厅里的展品会随着岁月而更替，所以我们只标注各个展馆和标志性地点，从不写具体的展厅编号。每座城市的走廊都记录在", "Esta página es un dibujo y un plan, no el museo. Los horarios, las entradas y los cierres están en metmuseum.org. Nuestro esquema simplifica; el edificio siempre será más grande que la hoja. El contenido de las salas cambia con los años, así que nombramos alas y puntos de referencia, nunca números de sala. Los pasillos de cada ciudad viven en", "이 페이지는 그림이자 계획일 뿐, 미술관 그 자체는 아니에요. 운영 시간, 입장권, 휴관 정보는 metmuseum.org에서 확인하세요. 저희 도면은 단순하게 그린 거라, 실제 건물은 언제나 이 도면보다 크답니다. 전시실 구성은 해가 지나며 바뀌기 때문에, 저희는 갤러리 번호 대신 별관과 대표 작품으로 안내해 드려요. 각 도시의 복도는", "Trang này là một bản vẽ và một kế hoạch, không phải bản thân bảo tàng. Giờ mở cửa, vé và lịch đóng cửa đều có tại metmuseum.org. Sơ đồ của chúng mình được giản lược đi; tòa nhà thật lúc nào cũng lớn hơn bản vẽ. Nội dung các gian trưng bày thay đổi qua nhiều năm, nên chúng mình gọi tên theo các cánh nhà và điểm mốc, chứ không bao giờ theo số phòng. Hành lang của mỗi thành phố đều nằm trong"],
    "; a saved walk follows your sign-in to any device.": ["；只要登录，你保存的路线就会跟着账号出现在任何设备上。", "; un paseo guardado sigue tu sesión a cualquier dispositivo.", "에 담겨 있어요. 저장한 산책 경로는 로그인만 하면 어떤 기기에서든 따라와요.", "; một chuyến dạo đã lưu sẽ đi theo tài khoản đăng nhập của bạn tới bất kỳ thiết bị nào."],
    "~2 MIN INSIDE": ["馆内约 2 分钟", "~2 MIN DENTRO", "관람 약 2분", "~2 phút bên trong"],
    "~5 MIN INSIDE": ["馆内约 5 分钟", "~5 MIN DENTRO", "관람 약 5분", "~5 phút bên trong"],
    "~15 MIN INSIDE": ["馆内约 15 分钟", "~15 MIN DENTRO", "관람 약 15분", "~15 phút bên trong"],
    "~20 MIN INSIDE": ["馆内约 20 分钟", "~20 MIN DENTRO", "관람 약 20분", "~20 phút bên trong"],
    "~25 MIN INSIDE": ["馆内约 25 分钟", "~25 MIN DENTRO", "관람 약 25분", "~25 phút bên trong"],
    "~30 MIN INSIDE": ["馆内约 30 分钟", "~30 MIN DENTRO", "관람 약 30분", "~30 phút bên trong"],
    "~35 MIN INSIDE": ["馆内约 35 分钟", "~35 MIN DENTRO", "관람 약 35분", "~35 phút bên trong"],
    "~40 MIN INSIDE": ["馆内约 40 分钟", "~40 MIN DENTRO", "관람 약 40분", "~40 phút bên trong"],
    "~45 MIN INSIDE": ["馆内约 45 分钟", "~45 MIN DENTRO", "관람 약 45분", "~45 phút bên trong"],
})

# ---- The Met narrated-guide note (2026-08-19) ----
EXTRA.update({
    "Recorded voice where we have one, your phone's voice otherwise. Inside the Met the map goes grey, so this is the guide at the table; the one that knows where you are standing lives on": ["有录音的时候就用录音，没有就用你手机自带的语音。在大都会馆内地图会变灰，所以这是坐在桌前的讲解；真正知道你此刻站在哪里的那位，就在", "Voz grabada cuando la tenemos, y la de tu teléfono cuando no. Dentro del Met el mapa se pone gris, así que esta es la guía en la mesa; la que sabe dónde estás parado vive en", "녹음된 목소리가 있으면 그 목소리로, 없으면 휴대폰 목소리로 들려드려요. 메트 안에서는 지도가 회색으로 바뀌어서, 이건 책상 앞에서 듣는 안내예요. 지금 어디에 서 있는지 아는 안내는 바로", "Có bản thu âm thì chúng mình dùng bản thu, không thì dùng giọng đọc của điện thoại bạn nhé. Bên trong Met bản đồ chuyển sang xám, nên đây là người hướng dẫn ngồi ở bàn; còn người biết bạn đang đứng ở đâu thì nằm ở"],
})

# ---- AutoCorrect review pass: fixed mistranslations / nonsense / stiff wording (2026-08-19) ----
EXTRA.update({
    "Driver arrives 15 min early": ["司机提前 15 分钟到", "El conductor llega 15 min antes", "기사가 15분 일찍 도착해요", "Tài xế đến sớm 15 phút"],
    "Keep the team out of the visitor numbers. Signing in here already stops this browser being counted, the rest is for your other devices, and for anyone on the team without a dispatch login.": ["把团队成员从访客数字里排除掉。您在这里登录后，这个浏览器就不会再被计入了；其余选项是留给您的其他设备，以及团队里没有调度登录账号的人用的。", "Deja a tu equipo fuera de las cifras de visitantes. Con solo iniciar sesión aquí, este navegador ya deja de contarse; el resto es para tus otros dispositivos y para quien en el equipo no tenga acceso al panel.", "팀원은 방문자 수에서 빼 두세요. 여기서 로그인만 하셔도 이 브라우저는 더 이상 집계되지 않아요. 나머지는 다른 기기용, 그리고 배차 로그인이 없는 팀원을 위한 거예요.", "Giữ cả đội ra ngoài số liệu khách truy cập nhé. Chỉ cần đăng nhập ở đây là trình duyệt này đã không bị đếm nữa; phần còn lại dành cho các thiết bị khác của bạn và những ai trong đội chưa có tài khoản điều phối."],
    "Kids and adults both light up in here, because knights on horseback are simply hard to beat.": ["大人小孩到了这里眼睛都会发亮，毕竟骑在马背上的骑士实在太让人着迷了。", "Aquí se les iluminan los ojos tanto a niños como a adultos, porque los caballeros a caballo son sencillamente difíciles de superar.", "아이도 어른도 여기선 눈이 반짝반짝해요. 말을 탄 기사만큼 멋진 볼거리도 드물거든요.", "Cả trẻ con lẫn người lớn đều thích mê chỗ này, bởi hình ảnh những hiệp sĩ cưỡi ngựa thì quả là khó mà cưỡng lại."],
    "Not in the book yet — creating it for you…": ["书里还没有它 — 正在为你创建…", "Aún no está en el libro, lo estamos creando para ti…", "아직 책에 없어요. 지금 만들어 드릴게요…", "Chưa có trong sách — đang tạo cho bạn…"],
    "Nothing is offered or sold today": ["今天不提供也不出售任何东西", "Hoy no se ofrece ni se vende nada", "오늘은 어떤 것도 제공되거나 판매되지 않아요", "Hôm nay không có gì được chào bán"],
    "Register as a guide, takes a minute": ["注册成为导游，约需一分钟", "Regístrate como guía, te llevará un minuto", "가이드로 등록하기, 1분이면 됩니다", "Đăng ký làm hướng dẫn viên, chỉ mất một phút"],
    "Take the ticket at the door and don't lose it, you pay on the way out.": ["进门时会拿到一张单子，记得别弄丢，离店的时候就凭它结账。", "Toma el tique en la puerta y no lo pierdas, que pagas al salir.", "문에서 받은 표는 잃어버리지 마세요, 나갈 때 그걸로 계산하거든요.", "Nhớ cầm phiếu ở cửa và đừng làm mất nhé, lúc ra về mới thanh toán."],
    "The rules that protect you when you use this site, your data, your money, and your bookings. These are the safeguards that are already in place, in plain language.": ["您在使用本站时受到保护的各项规则，包括您的数据、款项和订单。以下都是已经落实到位的保障措施，我们用平实的话逐条讲清楚。", "Las reglas que te protegen cuando usas este sitio, tus datos, tu dinero y tus reservas. Estas son las salvaguardas que ya están funcionando, contadas en palabras sencillas.", "이 사이트를 쓰실 때 회원님을 지켜 드리는 규칙이에요. 데이터, 돈, 예약에 관한 것들이죠. 이미 시행하고 있는 보호 장치를 쉬운 말로 하나하나 정리했어요.", "Những quy tắc bảo vệ bạn khi dùng trang này, gồm dữ liệu, tiền và các đơn đặt của bạn. Dưới đây là các biện pháp đã có sẵn, chúng mình trình bày bằng lời lẽ giản dị."],
    "This giant capital came from one of the largest temples of the ancient world, in what is now Turkey.": ["这件巨大的柱头来自古代世界最大的神庙之一，遗址就在今天的土耳其。", "Este gigantesco capitel proviene de uno de los templos más grandes del mundo antiguo, en lo que hoy es Turquía.", "이 거대한 기둥머리는 지금의 튀르키예에 있던, 고대 세계에서 가장 큰 신전 가운데 하나에서 온 거예요.", "Đầu cột khổng lồ này đến từ một trong những ngôi đền lớn nhất của thế giới cổ đại, nằm ở nơi ngày nay là Thổ Nhĩ Kỳ."],
    "Type a destination and press Add, or tap a pin on the map": ["输入一个目的地，然后点“添加”，或者直接点地图上的标记", "Escribe un destino y pulsa Añadir, o toca un marcador en el mapa", "목적지를 입력하고 추가를 누르거나, 지도에서 핀을 톡 눌러 보세요", "Nhập một điểm đến rồi nhấn Thêm, hoặc chạm vào một ghim trên bản đồ"],
    "Washington's oldest saloon (1856), two blocks from the White House, oysters, burgers and power lunches.": ["华盛顿最老的酒馆（1856 年），离白宫只有两个街区，生蚝、汉堡，还有饭桌上谈成的政治。", "La taberna más antigua de Washington (1856), a dos manzanas de la Casa Blanca: ostras, hamburguesas y comidas de negocios.", "워싱턴에서 가장 오래된 술집이에요(1856년). 백악관에서 두 블록 거리이고, 굴과 버거, 그리고 권력자들의 점심이 오가는 곳이죠.", "Quán rượu lâu đời nhất Washington (1856), cách Nhà Trắng hai dãy phố, có hàu, burger và những bữa trưa toàn người quyền lực."],
    "We build one business at a time": ["一次只做好一项业务", "Un negocio a la vez, hecho bien", "저희는 한 번에 하나씩 사업을 키워요", "Chúng tôi phát triển từng mảng kinh doanh một"],
    "We started with transportation: affordable Tesla rentals that turn everyday drivers into earners and everyday riders into loyal clients. From there, each part of our business funds and strengthens the next, operations, real estate, finance, and reinvestment, a closed loop where revenue compounds instead of leaking away.": ["我们从出行业务起步：用价格实惠的特斯拉租赁，让普通司机也能有收入，让乘客愿意一次次回来。在这个基础上，每一项业务都为下一项提供资金，出行、房地产、金融、再投资，环环相扣，收入在其中不断累积，而不是慢慢流走。", "Empezamos por el transporte: alquileres de Tesla asequibles que ayudan a los conductores de todos los días a ganar dinero y convierten a cada pasajero en un cliente que vuelve. A partir de ahí, cada negocio financia y refuerza al siguiente, operaciones, inmobiliario, finanzas y reinversión, un circuito cerrado donde los ingresos se acumulan en vez de escaparse.", "저희는 교통에서 시작했어요. 합리적인 가격의 테슬라 대여로 평범한 기사님도 수입을 얻고, 승객은 다시 찾게 돼요. 그 위에서 사업 하나하나가 다음 사업의 자금이 되어 줘요. 교통, 부동산, 금융, 재투자로 이어지면서 수익이 빠져나가지 않고 차곡차곡 쌓이는 순환을 만들어요.", "Chúng mình khởi đầu từ vận tải: cho thuê Tesla với giá hợp lý để tài xế bình thường cũng có thu nhập, còn hành khách thì quay lại đều đặn. Từ đó, mỗi mảng vừa cấp vốn vừa tiếp sức cho mảng kế tiếp, vận hành, bất động sản, tài chính rồi tái đầu tư, tạo thành một vòng khép kín nơi doanh thu tích lũy dần thay vì thất thoát."],
    "You post what you want to build": ["您发布想做的项目", "Publicas lo que quieres construir", "만들고 싶은 것을 올립니다", "Bạn đăng điều mình muốn xây dựng"],
    "Your route builds here: D1 → D2 → D3 …": ["您的行程将显示在这里：D1 → D2 → D3 …", "Tu ruta se construye aquí: D1 → D2 → D3 …", "여기에 경로가 만들어집니다: D1 → D2 → D3 …", "Lộ trình của bạn sẽ hiện ở đây: D1 → D2 → D3 …"],
    "appear here automatically.": ["的新订单会自动出现在这里。", "aparecen aquí automáticamente.", "에서 들어온 새 예약이 여기에 자동으로 표시돼요.", "sẽ tự động hiện ở đây."],
    "🤵 Jarvis, your trip organizer": ["🤵 Jarvis，您的行程管家", "🤵 Jarvis, tu organizador de viaje", "🤵 Jarvis, 여행 도우미", "🤵 Jarvis, người sắp xếp chuyến đi của bạn"],
})

# ---- Strip the last em dash from a stale entry (2026-08-19) ----
EXTRA.update({
    "Not in the book yet — creating it for you…": ["书里还没有它，正在为你创建…", "Aún no está en el libro, lo estamos creando para ti…", "아직 책에 없어요. 지금 만들어 드릴게요…", "Chưa có trong sách, đang tạo cho bạn…"],
})

# ---- Trip planner: remove-a-stop control on the route strip (2026-08-22) ----
EXTRA.update({
    "Remove this stop": ["移除这一站", "Quitar esta parada", "이 방문지 빼기", "Bỏ điểm dừng này"],
    "Tap the ✕ on a stop to remove it. Add another by typing above or tapping a pin.": [
        "点击某一站上的 ✕ 即可移除。在上方输入或点按地图上的图钉可添加新的一站。",
        "Toca la ✕ de una parada para quitarla. Añade otra escribiendo arriba o tocando un pin en el mapa.",
        "방문지의 ✕ 를 누르면 삭제됩니다. 위에 입력하거나 지도의 핀을 눌러 다른 곳을 추가하세요.",
        "Chạm vào dấu ✕ trên một điểm dừng để xoá. Thêm điểm khác bằng cách gõ ở trên hoặc chạm vào ghim trên bản đồ."],
})

# ---- The read count on ideas and destinations. Rendered as "42 viewed", the
# number in bold and this word beside it, so a plain audience reads a fact
# rather than an icon. One word, its own text node, so the engine translates
# it in place and it survives a language switch (2026-08-22). ----
EXTRA.update({
    "viewed": ["次浏览", "vistas", "조회", "lượt xem"],
})

# ---- The confirm shown when someone taps the brand logo, which resets the
# page. Native confirm() text, translated through psxT (2026-08-22). ----
EXTRA.update({
    "Reset the page? Anything you have not saved will be lost.": [
        "重置页面？尚未保存的内容将会丢失。",
        "¿Restablecer la página? Se perderá todo lo que no hayas guardado.",
        "페이지를 초기화할까요? 저장하지 않은 내용은 사라집니다.",
        "Đặt lại trang? Mọi thứ bạn chưa lưu sẽ mất."],
})

# ---------------------------------------------------------------------------
# 2026-08-30. The pages the generator could not see.
#
# These lines were never untranslatable; they were never COLLECTED. build_i18n
# read a stale copy of the site, so the Freedom Trail, MoMA, the Universal
# Gallery, the walks index and the landmarks were invisible to it and stayed
# in English while the globe turned. The generator now reads its own repo, and
# these are the words it found waiting.
EXTRA.update({
 # ---- landmarks.html, the two New York models ----
 "New York, standing up": [
     "纽约，立起来看",
     "Nueva York, en pie",
     "뉴욕, 세워서 보기",
     "New York, dựng đứng"],
 "New York, standing up · Brooklyn Bridge and the Empire State Building": [
     "纽约，立起来看 · 布鲁克林大桥与帝国大厦",
     "Nueva York en pie · El puente de Brooklyn y el Empire State",
     "뉴욕, 세워서 보기 · 브루클린 브리지와 엠파이어 스테이트 빌딩",
     "New York dựng đứng · Cầu Brooklyn và tòa Empire State"],
 "Two landmarks drawn as models you can take hold of and turn, with the questions a visitor actually has answered underneath. Every dimension here is the real one, in feet.": [
     "两座地标做成可以用手转动的模型，下面回答游客真正会问的问题。这里的每一个尺寸都是真实数据，单位为英尺。",
     "Dos monumentos dibujados como maquetas que puedes agarrar y girar, con las preguntas que un visitante se hace de verdad respondidas debajo. Cada medida es la real, en pies.",
     "직접 잡고 돌릴 수 있는 모형으로 그린 두 랜드마크. 그 아래에는 방문객이 실제로 묻는 질문에 대한 답이 있습니다. 여기 모든 치수는 실제 수치이며 피트 단위입니다.",
     "Hai công trình được dựng thành mô hình bạn có thể cầm và xoay, bên dưới là lời giải đáp cho những câu hỏi mà khách tham quan thực sự quan tâm. Mọi kích thước ở đây đều là số liệu thật, tính bằng foot."],
 "The Brooklyn Bridge": ["布鲁克林大桥", "El puente de Brooklyn", "브루클린 브리지", "Cầu Brooklyn"],
 "Opened 1883, and for a while the longest suspension bridge in the world.": [
     "1883年通车，曾有一段时间是世界上最长的悬索桥。",
     "Inaugurado en 1883, y durante un tiempo el puente colgante más largo del mundo.",
     "1883년 개통했고, 한동안 세계에서 가장 긴 현수교였습니다.",
     "Khánh thành năm 1883, và trong một thời gian là cầu treo dài nhất thế giới."],
 "Drag it to turn. It turns by itself until you take hold.": [
     "拖动可以旋转。你不碰它的时候，它会自己慢慢转。",
     "Arrástralo para girarlo. Gira solo hasta que lo agarras.",
     "끌어서 돌려 보세요. 손을 대기 전까지는 스스로 천천히 회전합니다.",
     "Kéo để xoay. Nó tự xoay cho đến khi bạn chạm vào."],
 "1,595.5 ft": ["1,595.5 英尺", "1.595,5 pies", "1,595.5 피트", "1.595,5 foot"],
 "the main span, tower to tower": [
     "主跨，从一座桥塔到另一座", "el vano principal, de torre a torre",
     "주경간, 탑에서 탑까지", "nhịp chính, từ tháp này sang tháp kia"],
 "278 ft": ["278 英尺", "278 pies", "278 피트", "278 foot"],
 "tower height above the water": [
     "桥塔高出水面的高度", "altura de la torre sobre el agua",
     "수면 위 탑 높이", "chiều cao tháp tính từ mặt nước"],
 "1.1 miles": ["1.1 英里", "1,1 millas", "1.1 마일", "1,1 dặm"],
 "the whole walk, end to end": [
     "整段步行，从头走到尾", "el paseo entero, de punta a punta",
     "처음부터 끝까지 걷는 전체 거리", "toàn bộ quãng đi bộ, từ đầu đến cuối"],
 "30 to 40 min": ["30 到 40 分钟", "de 30 a 40 min", "30~40분", "30 đến 40 phút"],
 "what it really takes, with stops": [
     "算上停下来的时间，实际需要多久", "lo que cuesta de verdad, con paradas",
     "멈춰 서는 시간까지 넣은 실제 소요 시간", "thời gian thực tế, kể cả lúc dừng lại"],
 "Walk it from Brooklyn toward Manhattan.": [
     "从布鲁克林往曼哈顿方向走。",
     "Recórrelo desde Brooklyn hacia Manhattan.",
     "브루클린에서 맨해튼 쪽으로 걸으세요.",
     "Hãy đi từ phía Brooklyn về phía Manhattan."],
 "Same bridge either way, but going west the Manhattan skyline stands in front of you the whole crossing instead of behind your shoulder.": [
     "两个方向走的是同一座桥，但往西走，曼哈顿的天际线会一路正对着你，而不是留在你身后。",
     "Es el mismo puente en cualquier sentido, pero hacia el oeste el perfil de Manhattan queda delante de ti durante todo el cruce, y no a tu espalda.",
     "어느 방향이든 같은 다리지만, 서쪽으로 걸으면 맨해튼 스카이라인이 등 뒤가 아니라 건너는 내내 눈앞에 펼쳐집니다.",
     "Vẫn là cây cầu đó dù đi hướng nào, nhưng đi về phía tây thì đường chân trời Manhattan nằm ngay trước mặt bạn suốt chặng, thay vì ở sau lưng."],
 "The promenade is yours now.": [
     "步行道现在是行人的了。", "El paseo ahora es tuyo.",
     "이제 산책로는 보행자의 것입니다.", "Lối đi bộ bây giờ là của người đi bộ."],
 "It runs between the two roadways and eighteen feet above them, and since September 2021 it is pedestrians only: the bikes moved down to a protected lane on the Manhattan-bound roadway. The old shouting match on the boards is over.": [
     "它夹在两条车道中间，高出车道十八英尺。2021年9月起只允许行人通行，自行车被移到了通往曼哈顿那侧车道上的专用道。木板路上那种互相喊话的日子结束了。",
     "Va entre las dos calzadas y a dieciocho pies por encima de ellas, y desde septiembre de 2021 es solo para peatones: las bicicletas bajaron a un carril protegido en la calzada hacia Manhattan. Se acabaron los gritos sobre los tablones.",
     "두 차로 사이, 그 위 18피트 높이로 나 있습니다. 2021년 9월부터는 보행자 전용이 되었고, 자전거는 맨해튼 방향 차로의 보호 차선으로 내려갔습니다. 널빤지 위에서 서로 소리치던 시절은 끝났습니다.",
     "Nó nằm giữa hai làn xe và cao hơn chúng mười tám foot, và từ tháng 9 năm 2021 chỉ dành cho người đi bộ: xe đạp đã chuyển xuống làn riêng có rào chắn trên phần đường hướng về Manhattan. Cảnh cãi vã trên mặt ván gỗ đã chấm dứt."],
 "The web of diagonals is the point.": [
     "那张斜拉索织成的网才是看点。", "La red de tirantes diagonales es lo que hay que mirar.",
     "사선으로 뻗은 케이블의 그물이 이 다리의 핵심입니다.", "Mạng lưới dây văng chéo mới là điều đáng xem."],
 "Roughly four hundred stays run from the towers down to the deck, and they are what makes the deck stiff. Stand under a tower and look up through them.": [
     "大约四百根拉索从桥塔一直拉到桥面，正是它们让桥面不晃。站到桥塔下面，抬头透过它们往上看。",
     "Unos cuatrocientos tirantes bajan de las torres al tablero, y son los que le dan rigidez. Ponte bajo una torre y mira hacia arriba a través de ellos.",
     "약 사백 개의 케이블이 탑에서 상판까지 내려오며, 상판을 단단하게 잡아 주는 것이 바로 이것들입니다. 탑 아래 서서 그 사이로 올려다보세요.",
     "Khoảng bốn trăm dây văng chạy từ tháp xuống mặt cầu, và chính chúng giữ cho mặt cầu vững. Hãy đứng dưới chân tháp và ngước nhìn xuyên qua chúng."],
 "The Empire State Building": ["帝国大厦", "El Empire State Building", "엠파이어 스테이트 빌딩", "Tòa nhà Empire State"],
 "1931, and still the shape everyone draws when they draw a skyscraper.": [
     "1931年落成，至今人们画摩天大楼时，画的还是它的轮廓。",
     "De 1931, y sigue siendo la silueta que todo el mundo dibuja cuando dibuja un rascacielos.",
     "1931년에 지어졌고, 지금도 사람들이 마천루를 그릴 때 떠올리는 바로 그 형태입니다.",
     "Xây năm 1931, và đến nay vẫn là hình dáng mà ai cũng vẽ khi vẽ một tòa chọc trời."],
 "Drag it to turn.": ["拖动可以旋转。", "Arrástralo para girarlo.", "끌어서 돌려 보세요.", "Kéo để xoay."],
 "1,250 ft": ["1,250 英尺", "1.250 pies", "1,250 피트", "1.250 foot"],
 "to the roof": ["到屋顶", "hasta el tejado", "옥상까지", "tính đến mái"],
 "1,454 ft": ["1,454 英尺", "1.454 pies", "1,454 피트", "1.454 foot"],
 "to the tip of the antenna": ["到天线尖顶", "hasta la punta de la antena", "안테나 끝까지", "tính đến đỉnh ăng-ten"],
 "floors": ["层", "plantas", "층", "tầng"],
 "finished in one year and 45 days": [
     "一年零45天建成", "terminado en un año y 45 días",
     "1년 45일 만에 완공", "hoàn thành trong một năm 45 ngày"],
 "The 86th floor is the one people mean.": [
     "人们说的观景台，指的是86层。", "El piso 86 es el que la gente quiere decir.",
     "사람들이 말하는 전망대는 86층입니다.", "Tầng 86 mới là nơi mọi người muốn nói đến."],
 "Open air, wind, the parapet you have seen in every film, at about 1,050 feet. Most visitors go up, stand there, and come down happy.": [
     "露天，有风，还有你在每部电影里都见过的那圈护墙，高约1,050英尺。大多数人上去站一会儿，就心满意足地下来了。",
     "Al aire libre, con viento, y el pretil que has visto en todas las películas, a unos 1.050 pies. La mayoría sube, se queda un rato y baja contenta.",
     "탁 트인 야외, 바람, 그리고 영화마다 나오는 그 난간이 약 1,050피트 높이에 있습니다. 대부분은 올라가 잠시 서 있다가 만족스럽게 내려옵니다.",
     "Ngoài trời, có gió, và lan can bạn đã thấy trong mọi bộ phim, ở độ cao khoảng 1.050 foot. Phần lớn khách lên đó, đứng một lúc, rồi xuống trong sự hài lòng."],
 "The 102nd is higher, smaller and enclosed.": [
     "102层更高、更小，而且是封闭的。", "El 102 está más alto, es más pequeño y está cerrado.",
     "102층은 더 높고, 더 좁고, 실내입니다.", "Tầng 102 cao hơn, nhỏ hơn và kín."],
 "About 1,224 feet, behind glass, and it costs more. Worth it if you want the altitude and quiet; skip it if you want the wind in your face.": [
     "约1,224英尺，隔着玻璃，票价更贵。想要那个高度和安静，值得上去；想要风吹在脸上，就不必了。",
     "Unos 1.224 pies, tras un cristal, y cuesta más. Merece la pena si buscas altura y calma; sáltatelo si quieres el viento en la cara.",
     "약 1,224피트 높이이고 유리 안쪽이며 요금이 더 비쌉니다. 높이와 고요함을 원하면 올라갈 만하고, 얼굴에 바람을 맞고 싶다면 건너뛰세요.",
     "Khoảng 1.224 foot, sau lớp kính, và vé đắt hơn. Đáng lên nếu bạn muốn độ cao và sự yên tĩnh; bỏ qua nếu bạn muốn gió táp vào mặt."],
 "The steps in the silhouette are law, not taste.": [
     "轮廓上那些退台是法规，不是审美。", "Los escalones de la silueta son ley, no estética.",
     "실루엣의 계단 모양은 취향이 아니라 법입니다.", "Những bậc giật cấp trên hình dáng tòa nhà là luật, không phải thẩm mỹ."],
 "New York's 1916 zoning made towers step back as they rose so light could reach the street. The setbacks at the 21st, 25th and 30th floors, and again at the 72nd, 81st and 85th, are that rule made of limestone.": [
     "纽约1916年的区划法规定高楼越往上越要后退，好让阳光照到街上。21层、25层、30层，以及72层、81层、85层的那几处退台，就是这条法规用石灰岩砌出来的样子。",
     "La normativa urbanística de Nueva York de 1916 obligó a las torres a retranquearse a medida que subían para que la luz llegara a la calle. Los retranqueos de los pisos 21, 25 y 30, y de nuevo en el 72, el 81 y el 85, son esa norma hecha de piedra caliza.",
     "1916년 뉴욕의 조닝 법은 빛이 거리까지 닿도록 건물이 올라갈수록 뒤로 물러서게 했습니다. 21층, 25층, 30층에서, 그리고 다시 72층, 81층, 85층에서 들어간 부분은 그 법이 석회암으로 구현된 모습입니다.",
     "Qua quy định phân vùng năm 1916 của New York, các tòa tháp phải lùi vào khi lên cao để ánh sáng còn xuống được mặt đường. Những chỗ giật cấp ở tầng 21, 25, 30, rồi lại ở tầng 72, 81 và 85, chính là quy định ấy được dựng bằng đá vôi."],
 "Honest about the drawing: the heights, the spans, the setback floors and the arch dimensions are the real published ones, so the proportions on your screen are the proportions in the air. The window bands and the stone colour are indicative, not a survey. Nothing here is traced from a copyrighted plan.": [
     "关于这幅图，说实话：高度、跨度、退台所在楼层和拱券尺寸都取自公开的真实数据，所以屏幕上的比例就是空中的比例。窗带和石材颜色只是示意，不是测绘。这里没有任何内容是照着受版权保护的图纸描下来的。",
     "Con franqueza sobre el dibujo: las alturas, los vanos, los pisos de retranqueo y las dimensiones de los arcos son los datos reales publicados, así que las proporciones de tu pantalla son las del aire. Las franjas de ventanas y el color de la piedra son indicativos, no un levantamiento. Nada de esto está calcado de un plano con derechos de autor.",
     "그림에 대해 솔직히 말하면: 높이, 경간, 물러선 층수, 아치 치수는 모두 공개된 실제 수치라서 화면 속 비례가 곧 실제 공중의 비례입니다. 창 띠와 석재 색은 참고용이지 실측이 아닙니다. 저작권이 있는 도면을 베낀 부분은 전혀 없습니다.",
     "Nói thật về bản vẽ: chiều cao, nhịp, các tầng giật cấp và kích thước vòm đều là số liệu thật đã công bố, nên tỷ lệ trên màn hình chính là tỷ lệ ngoài đời. Các dải cửa sổ và màu đá chỉ mang tính minh họa, không phải khảo sát. Không có chi tiết nào ở đây được can lại từ bản vẽ có bản quyền."],
 "More travel tips": ["更多旅行提示", "Más consejos de viaje", "여행 팁 더 보기", "Thêm mẹo du lịch"],
 "New York in the Destination Book": [
     "《目的地手册》里的纽约", "Nueva York en el Libro de Destinos",
     "목적지 책 속의 뉴욕", "New York trong Sổ tay Điểm đến"],
 "Plan the day": ["规划这一天", "Planifica el día", "하루 일정 짜기", "Lên kế hoạch cho ngày"],
})

EXTRA.update({
 # ---- universal-gallery.html ----
 "Universal Gallery, Plateau Strategy Solution Lab": [
     "环球展厅 · Plateau Strategy Solution Lab",
     "Galería Universal, Plateau Strategy Solution Lab",
     "유니버설 갤러리, Plateau Strategy Solution Lab",
     "Phòng trưng bày Toàn cầu, Plateau Strategy Solution Lab"],
 "Every exhibition, one artwork at a time. What it is, where it hangs, and what to notice while you are standing there.": [
     "每一场展览，一次讲一件作品：它是什么，挂在哪里，以及你站在它面前时该看什么。",
     "Cada exposición, una obra cada vez. Qué es, dónde cuelga y en qué fijarte mientras estás delante.",
     "모든 전시를, 한 번에 한 작품씩. 무엇인지, 어디에 걸려 있는지, 그 앞에 섰을 때 무엇을 볼지 알려 드립니다.",
     "Mỗi cuộc triển lãm, mỗi lần một tác phẩm. Nó là gì, treo ở đâu, và nên để ý điều gì khi bạn đứng trước nó."],
 "A name, or the number on the label…": [
     "作品名，或者标签上的编号…", "Un nombre, o el número de la cartela…",
     "작품 이름, 또는 라벨의 번호…", "Một cái tên, hoặc con số trên nhãn…"],
 "You do not have to spell it. Every museum prints an item number on the label, and that number is enough. Try": [
     "不必拼对名字。每家博物馆都会在标签上印一个编号，有那个编号就够了。试试",
     "No hace falta que lo escribas bien. Cada museo imprime un número en la cartela, y ese número basta. Prueba con",
     "철자를 몰라도 됩니다. 모든 미술관은 라벨에 작품 번호를 인쇄하고, 그 번호면 충분합니다. 예를 들어",
     "Bạn không cần viết đúng tên. Mọi bảo tàng đều in một mã số trên nhãn, và con số đó là đủ. Hãy thử"],
 "or": ["或", "o", "또는", "hoặc"],
 "▶ Watch how it works, 1 minute": [
     "▶ 看它怎么用，1分钟", "▶ Mira cómo funciona, 1 minuto",
     "▶ 사용법 보기, 1분", "▶ Xem cách hoạt động, 1 phút"],
 "Browse the works travellers look up most →": [
     "看看旅行者查得最多的作品 →", "Mira las obras que más buscan los viajeros →",
     "여행자들이 가장 많이 찾는 작품 보기 →", "Xem những tác phẩm khách du lịch tra cứu nhiều nhất →"],

 # ---- walks.html ----
 "The Walks · Plateau Strategy": [
     "步行地图 · Plateau Strategy", "Los Paseos · Plateau Strategy",
     "워크 · Plateau Strategy", "Các Lối Đi Bộ · Plateau Strategy"],
 "The Met": ["大都会博物馆", "El Met", "메트로폴리탄 미술관", "Bảo tàng Met"],
 "Every map on this site is drawn the same way: a person who knows the way walks it once, and the walk becomes the map. This page is all of them, city by city.": [
     "本站每一张地图都是同一种画法：一个认路的人先走一遍，这一趟就成了地图。这个页面按城市把它们都收在一起。",
     "Todos los mapas de este sitio se dibujan igual: alguien que conoce el camino lo recorre una vez, y ese recorrido se convierte en el mapa. Esta página los reúne todos, ciudad por ciudad.",
     "이 사이트의 모든 지도는 같은 방식으로 만들어집니다. 길을 아는 사람이 한 번 걷고, 그 걸음이 지도가 됩니다. 이 페이지는 그 지도들을 도시별로 모은 것입니다.",
     "Mọi bản đồ trên trang này đều được vẽ theo cùng một cách: một người thuộc đường đi bộ qua một lần, và chuyến đi ấy trở thành bản đồ. Trang này gom tất cả lại, theo từng thành phố."],
 "A corridor with minutes in navy has been walked with the recorder; that number is measured. A corridor with a tilde is an estimate, waiting for its walk. Nothing here pretends to be measured when it is not.": [
     "用深蓝色标出分钟数的通道，是有人带着记录器实地走过的，那个数字是量出来的。带波浪号的是估算，还等着人去走一趟。这里不会把没量过的说成量过的。",
     "Un pasillo con los minutos en azul marino ya se ha recorrido con el registrador; ese número está medido. Un pasillo con una tilde es una estimación que aún espera su recorrido. Aquí nada finge estar medido cuando no lo está.",
     "분이 감청색으로 표시된 통로는 기록 장치를 들고 실제로 걸어 본 곳이며, 그 숫자는 측정값입니다. 물결표가 붙은 통로는 아직 걸어 보지 않은 추정값입니다. 이 페이지는 측정하지 않은 것을 측정한 척하지 않습니다.",
     "Hành lang có số phút màu xanh đậm là đã có người đi bộ qua cùng thiết bị ghi; con số đó là số đo thật. Hành lang có dấu ngã là ước lượng, còn chờ được đi qua. Ở đây không có gì giả vờ là đã đo khi chưa đo."],
 "Loading the corridors…": ["正在载入通道…", "Cargando los pasillos…", "통로를 불러오는 중…", "Đang tải các hành lang…"],
 "Your walks": ["你保存的路线", "Tus paseos", "내가 저장한 경로", "Các lối đi của bạn"],
 "Sign in at the top of the page, and the walks you save on the Met sheet appear here, under your name, on any device you sign in from.": [
     "在页面顶部登录，你在大都会图纸上保存的路线就会出现在这里，挂在你的名字下，任何设备登录都能看到。",
     "Inicia sesión arriba y los paseos que guardes en la hoja del Met aparecerán aquí, a tu nombre, en cualquier dispositivo desde el que entres.",
     "페이지 상단에서 로그인하면, 메트 도면에서 저장한 경로가 여기에 내 이름으로 표시되고, 로그인하는 어떤 기기에서든 볼 수 있습니다.",
     "Đăng nhập ở đầu trang, và những lối đi bạn lưu trên bản vẽ Met sẽ hiện ở đây, dưới tên bạn, trên bất kỳ thiết bị nào bạn đăng nhập."],
 "The walking times marked with a tilde are estimates until a surveyor walks that corridor with the recorder. Estimates are drawn from the sheets; measured minutes replace them automatically. New cities join this page the day their first corridor is opened.": [
     "带波浪号的步行时间都是估算，直到有测量员带着记录器走过那条通道为止。估算值取自图纸；一旦量出真实分钟数，就会自动替换。新城市在第一条通道开通的当天就会出现在这个页面上。",
     "Los tiempos marcados con una tilde son estimaciones hasta que un topógrafo recorra ese pasillo con el registrador. Las estimaciones salen de los planos; los minutos medidos las sustituyen automáticamente. Las ciudades nuevas aparecen en esta página el mismo día en que se abre su primer pasillo.",
     "물결표가 붙은 도보 시간은 측량자가 기록 장치를 들고 그 통로를 걸을 때까지는 추정값입니다. 추정값은 도면에서 뽑아내며, 실제 측정된 시간이 나오면 자동으로 대체됩니다. 새로운 도시는 첫 통로가 열리는 날 이 페이지에 추가됩니다.",
     "Thời gian đi bộ có dấu ngã là ước lượng, cho đến khi một người khảo sát đi qua hành lang đó cùng thiết bị ghi. Ước lượng được lấy từ bản vẽ; số phút đo được sẽ tự động thay thế chúng. Thành phố mới xuất hiện trên trang này ngay ngày hành lang đầu tiên của nó được mở."],

 # ---- moma.html ----
 "Inside MoMA, a footprint map · Plateau Strategy": [
     "MoMA内部，足迹地图 · Plateau Strategy",
     "Dentro del MoMA, un mapa de huellas · Plateau Strategy",
     "MoMA 내부, 발자국 지도 · Plateau Strategy",
     "Bên trong MoMA, bản đồ dấu chân · Plateau Strategy"],
 "Inside MoMA, on footprints": [
     "循着足迹走进MoMA", "Dentro del MoMA, sobre huellas",
     "발자국을 따라 MoMA 안으로", "Bên trong MoMA, theo dấu chân"],
 "The map on your phone goes grey the moment you step inside. This is a schematic of the Museum of Modern Art, drawn by us, not to scale, with the rooms where they really sit. Floors 5, 4 and 2 are the collection's one long story, 1880 to today, and the chronology starts at the Sculpture Garden end of Floor 5. Tap the rooms you want in the order you want them, and footprints walk the route with honest times.": [
     "你一走进大门，手机上的地图就变成一片灰。这是我们自己画的现代艺术博物馆示意图，不按比例，但每个展厅都在它真正的位置上。五层、四层和二层连起来就是这批藏品的一条长长的故事线，从1880年讲到今天，而这条时间线从五层雕塑花园那一端开始。按你想去的顺序点选展厅，足迹会带你走完这条路线，并给出诚实的时间。",
     "El mapa del móvil se vuelve gris en cuanto entras. Este es un esquema del Museo de Arte Moderno, dibujado por nosotros, sin escala, con las salas donde de verdad están. Las plantas 5, 4 y 2 son una sola historia larga de la colección, de 1880 a hoy, y la cronología empieza en el extremo del Jardín de Esculturas de la planta 5. Toca las salas que quieras en el orden que quieras, y las huellas recorren la ruta con tiempos honestos.",
     "안으로 들어서는 순간 휴대폰 지도는 회색이 됩니다. 이것은 우리가 직접 그린 현대미술관 도면으로, 축척은 맞지 않지만 각 전시실은 실제 위치에 있습니다. 5층, 4층, 2층은 1880년부터 오늘까지 이어지는 소장품의 긴 이야기 하나이고, 그 연대기는 5층 조각 정원 쪽 끝에서 시작합니다. 원하는 순서대로 전시실을 누르면 발자국이 그 경로를 걸으며 정직한 소요 시간을 보여 줍니다.",
     "Bản đồ trên điện thoại của bạn xám đi ngay khi bạn bước vào. Đây là sơ đồ Bảo tàng Nghệ thuật Hiện đại do chúng tôi vẽ, không theo tỷ lệ, nhưng các phòng nằm đúng vị trí thật. Tầng 5, 4 và 2 là một câu chuyện dài liền mạch của bộ sưu tập, từ năm 1880 đến hôm nay, và dòng thời gian bắt đầu ở phía Vườn Điêu khắc của tầng 5. Chạm vào các phòng bạn muốn theo thứ tự bạn muốn, và những dấu chân sẽ đi hết lộ trình với thời gian trung thực."],
 "The facts, checked on the museum's own pages: 11 West 53rd Street, between Fifth and Sixth. Open daily 10:30 to 5:30, Fridays to 8:30. Adults $30, seniors $22, students $17, sixteen and under free. Friday evenings 5:30 to 8:30 are free for New York State residents only, reserved ahead with proof of residency; everyone else pays. Tickets are timed; the Sculpture Garden is included. The E or M train to 5 Av/53 St stops at the door.": [
     "以下信息核对自博物馆官网：西53街11号，位于第五大道与第六大道之间。每天10:30至17:30开放，周五延长至20:30。成人30美元，长者22美元，学生17美元，16岁及以下免费。周五傍晚17:30至20:30仅对纽约州居民免费，需提前预约并出示居住证明，其他人照常付费。门票为分时段入场，含雕塑花园。地铁E线或M线到5 Av/53 St站，出站即到。",
     "Los datos, verificados en las páginas del propio museo: 11 West 53rd Street, entre la Quinta y la Sexta. Abierto todos los días de 10:30 a 17:30, los viernes hasta las 20:30. Adultos 30 $, mayores 22 $, estudiantes 17 $, gratis hasta los dieciséis. Los viernes de 17:30 a 20:30 la entrada es gratuita solo para residentes del estado de Nueva York, con reserva previa y prueba de residencia; los demás pagan. Las entradas son por franja horaria e incluyen el Jardín de Esculturas. El metro E o M hasta 5 Av/53 St para en la puerta.",
     "미술관 공식 페이지에서 확인한 정보입니다. 주소는 West 53rd Street 11번지, 5번가와 6번가 사이. 매일 10:30~17:30 개관, 금요일은 20:30까지. 성인 30달러, 경로 22달러, 학생 17달러, 16세 이하 무료. 금요일 저녁 17:30~20:30은 뉴욕주 거주자에 한해 무료이며 거주 증명과 사전 예약이 필요하고, 그 외에는 요금을 냅니다. 티켓은 시간 지정제이며 조각 정원이 포함됩니다. 지하철 E 또는 M선 5 Av/53 St역이 바로 앞입니다.",
     "Thông tin đã đối chiếu trên chính trang của bảo tàng: số 11 West 53rd Street, giữa Đại lộ 5 và Đại lộ 6. Mở cửa hằng ngày 10:30 đến 17:30, thứ Sáu đến 20:30. Người lớn 30 đô, người cao tuổi 22 đô, sinh viên 17 đô, từ mười sáu tuổi trở xuống miễn phí. Tối thứ Sáu từ 17:30 đến 20:30 miễn phí nhưng chỉ dành cho cư dân bang New York, phải đặt trước và có giấy tờ chứng minh cư trú; những người khác vẫn trả tiền. Vé theo khung giờ và đã bao gồm Vườn Điêu khắc. Tàu điện ngầm tuyến E hoặc M đến ga 5 Av/53 St dừng ngay trước cửa."],
 "MOMA-05 · Floor 5": ["MOMA-05 · 五层", "MOMA-05 · Planta 5", "MOMA-05 · 5층", "MOMA-05 · Tầng 5"],
 "Floor 5": ["五层", "Planta 5", "5층", "Tầng 5"],
 "Floor 4": ["四层", "Planta 4", "4층", "Tầng 4"],
 "The Sculpture Garden is along the top; 53rd Street along the bottom.": [
     "雕塑花园在上方，53街在下方。",
     "El Jardín de Esculturas queda arriba; la calle 53 abajo.",
     "위쪽이 조각 정원, 아래쪽이 53번가입니다.",
     "Vườn Điêu khắc nằm ở phía trên; phố 53 ở phía dưới."],
})

EXTRA.update({
 # ---- freedom-trail.html: the medallion, the headphones, the numbers past 16 ----
 "This bronze marker is set into the sidewalk along the red brick line. When you see it underfoot, you are on the trail.": [
     "这块铜牌嵌在红砖线沿途的人行道上。看到脚下有它，就说明你走在这条步道上。",
     "Esta placa de bronce está incrustada en la acera junto a la línea de ladrillo rojo. Cuando la veas bajo tus pies, estás en el sendero.",
     "이 청동 표식은 붉은 벽돌 선을 따라 보도에 박혀 있습니다. 발밑에 이것이 보이면 트레일 위에 있는 것입니다.",
     "Tấm bảng đồng này được gắn vào vỉa hè dọc theo vạch gạch đỏ. Khi thấy nó dưới chân, nghĩa là bạn đang đi đúng tuyến."],
 "Headphones, please, for the people around you.": [
     "请戴耳机，照顾一下周围的人。",
     "Auriculares, por favor, por consideración a quienes te rodean.",
     "주변 사람들을 위해 이어폰을 사용해 주세요.",
     "Vui lòng dùng tai nghe, vì những người xung quanh bạn."],
 "Lock the map": ["锁定地图", "Fijar el mapa", "지도 고정", "Khóa bản đồ"],
 "THE TOUR KEEPS GOING": ["这趟行程还没走完", "EL RECORRIDO SIGUE", "여정은 계속됩니다", "HÀNH TRÌNH VẪN TIẾP TỤC"],
 "Boston does not end at Bunker Hill. We keep numbering past sixteen, and every one of these lives as a full card in the": [
     "波士顿不是走到邦克山就结束了。我们把编号一直往十六号之后排，下面每一个都在这里有完整的一页：",
     "Boston no termina en Bunker Hill. Seguimos numerando más allá del dieciséis, y cada uno de estos tiene su ficha completa en el",
     "보스턴은 벙커힐에서 끝나지 않습니다. 우리는 16번 이후로도 번호를 이어 가며, 아래 각각은 다음 책에 온전한 카드로 실려 있습니다:",
     "Boston không kết thúc ở Bunker Hill. Chúng tôi tiếp tục đánh số sau số mười sáu, và mỗi mục dưới đây đều có một thẻ đầy đủ trong"],
 "Beacon Hill & Acorn Street": ["灯塔山与橡子街", "Beacon Hill y Acorn Street", "비컨힐과 에이콘 스트리트", "Beacon Hill và phố Acorn"],
 "Gas-lit brick lanes under the gold State House dome, and Acorn Street's 1820s cobblestones. Steps from stops 2 and 3, best in early morning light.": [
     "金色州议会大厦穹顶下的煤气灯砖巷，还有橡子街1820年代的鹅卵石路面。距第2、第3站只有几步路，清晨的光线下最好看。",
     "Callejones de ladrillo con farolas de gas bajo la cúpula dorada del State House, y los adoquines de la década de 1820 de Acorn Street. A un paso de las paradas 2 y 3, mejor con la luz de primera hora.",
     "황금빛 주 의사당 돔 아래 가스등이 켜진 벽돌 골목, 그리고 1820년대에 깔린 에이콘 스트리트의 자갈길. 2번과 3번 정류지에서 몇 걸음 거리이며, 이른 아침 빛에 가장 아름답습니다.",
     "Những con hẻm gạch thắp đèn khí dưới mái vòm vàng của tòa State House, và mặt đường đá cuội thập niên 1820 của phố Acorn. Chỉ cách điểm dừng 2 và 3 vài bước, đẹp nhất dưới ánh sáng sớm."],
 "The North End, eating this time": ["北角，这次是来吃的", "El North End, esta vez a comer", "노스엔드, 이번엔 먹으러", "North End, lần này để ăn"],
 "The trail already walks these streets at stops 12 and 13; come back hungry. Modern Pastry since 1930, Mike's since 1946, one block apart on Hanover Street, and Mike's takes only cash.": [
     "步道在第12、13站已经走过这几条街，这次饿着肚子再来一趟。Modern Pastry开于1930年，Mike's开于1946年，在汉诺威街上只隔一个街区，而且Mike's只收现金。",
     "El sendero ya recorre estas calles en las paradas 12 y 13; vuelve con hambre. Modern Pastry desde 1930, Mike's desde 1946, a una manzana de distancia en Hanover Street, y Mike's solo acepta efectivo.",
     "트레일은 12번과 13번 정류지에서 이미 이 거리를 지나갑니다. 이번엔 배고픈 채로 다시 오세요. 1930년 문을 연 Modern Pastry와 1946년 문을 연 Mike's가 하노버 스트리트에서 한 블록 거리에 있고, Mike's는 현금만 받습니다.",
     "Tuyến đường đã đi qua những con phố này ở điểm 12 và 13; hãy quay lại khi bụng đói. Modern Pastry từ năm 1930, Mike's từ năm 1946, cách nhau một dãy nhà trên phố Hanover, và Mike's chỉ nhận tiền mặt."],
 "Boston Tea Party Ships & Museum": ["波士顿倾茶事件船只与博物馆", "Barcos y Museo del Motín del Té de Boston", "보스턴 차 사건 선박 박물관", "Tàu và Bảo tàng Tiệc trà Boston"],
 "The night the whole trail leads up to: replica ships floating at Griffin's Wharf, the only surviving original tea chest, and you throw a chest overboard yourself.": [
     "整条步道所指向的就是那一夜：格里芬码头停着复原的船只，馆里有唯一幸存的原件茶箱，而你可以亲手把一只茶箱扔进水里。",
     "La noche a la que apunta todo el sendero: barcos réplica a flote en Griffin's Wharf, el único cofre de té original que se conserva, y tú mismo lanzas un cofre por la borda.",
     "이 트레일 전체가 향하는 그날 밤: 그리핀 부두에 떠 있는 복원 선박, 유일하게 남아 있는 원본 차 상자, 그리고 당신이 직접 상자를 배 밖으로 던져 봅니다.",
     "Cái đêm mà cả tuyến đường dẫn tới: những con tàu phục dựng neo ở bến Griffin, chiếc hòm trà nguyên bản duy nhất còn sót lại, và chính bạn ném một hòm xuống nước."],
 "View Boston": ["View Boston 观景台", "View Boston", "뷰 보스턴 전망대", "Đài quan sát View Boston"],
 "The walk you just did, seen from the top of the Prudential: an open-air deck wrapping the whole 51st floor, open late.": [
     "站在保诚大厦顶上，回头看你刚走过的那条路：51层整整一圈的露天平台，开放到很晚。",
     "El paseo que acabas de hacer, visto desde lo alto del Prudential: una terraza al aire libre que rodea toda la planta 51, abierta hasta tarde.",
     "방금 걸어온 그 길을 프루덴셜 타워 꼭대기에서 내려다보세요. 51층 전체를 두르는 야외 전망대이고, 늦게까지 엽니다.",
     "Chặng đường bạn vừa đi, nhìn từ đỉnh tòa Prudential: một sàn ngoài trời bao quanh trọn tầng 51, mở đến khuya."],
 "A Day in Cambridge": ["剑桥一日", "Un día en Cambridge", "케임브리지에서의 하루", "Một ngày ở Cambridge"],
 "A second day across the river: Harvard Yard, the free Harvard Art Museums, the Glass Flowers, Mount Auburn's garden cemetery, then MIT's Great Dome and the Kendall Square museum.": [
     "过河再走一天：哈佛园、免费的哈佛艺术博物馆、玻璃花标本、奥本山园林墓园，然后是麻省理工的大穹顶和肯德尔广场的博物馆。",
     "Un segundo día al otro lado del río: Harvard Yard, los gratuitos Harvard Art Museums, las Flores de Cristal, el cementerio ajardinado de Mount Auburn, y luego la Gran Cúpula del MIT y el museo de Kendall Square.",
     "강 건너에서 보내는 둘째 날: 하버드 야드, 무료인 하버드 미술관, 유리 꽃 표본, 마운트오번 정원 묘지, 그리고 MIT의 그레이트 돔과 켄들 스퀘어 박물관.",
     "Ngày thứ hai bên kia sông: Harvard Yard, các bảo tàng nghệ thuật Harvard miễn phí, bộ sưu tập Hoa Thủy tinh, nghĩa trang vườn Mount Auburn, rồi Mái vòm Lớn của MIT và bảo tàng ở Kendall Square."],

 # ---- landing-page.html: the MoMA and landmarks cards ----
 "The Destination Book, but for exhibitions. Search any artwork by name, or by the number on its label when you cannot read the language. It tells you where the piece hangs and what to notice.": [
     "《目的地手册》的展览版。按名字搜任何一件作品，看不懂当地文字时，直接输标签上的编号也行。它会告诉你这件作品挂在哪里，以及该看什么。",
     "El Libro de Destinos, pero para exposiciones. Busca cualquier obra por su nombre, o por el número de su cartela cuando no puedas leer el idioma. Te dice dónde cuelga la pieza y en qué fijarte.",
     "목적지 책의 전시 버전입니다. 작품을 이름으로 찾거나, 언어를 읽을 수 없을 때는 라벨의 번호로 찾으세요. 그 작품이 어디에 걸려 있고 무엇을 볼지 알려 줍니다.",
     "Sổ tay Điểm đến, nhưng dành cho triển lãm. Tìm bất kỳ tác phẩm nào theo tên, hoặc theo con số trên nhãn khi bạn không đọc được ngôn ngữ đó. Nó cho bạn biết tác phẩm treo ở đâu và nên để ý điều gì."],
 "UNDER RECONSTRUCTION": ["改建中", "EN REFORMA", "재정비 중", "ĐANG XÂY DỰNG LẠI"],
 "NEW · THE MODERN MUSEUM": ["新品 · 现代艺术馆", "NUEVO · EL MUSEO MODERNO", "신규 · 현대미술관", "MỚI · BẢO TÀNG HIỆN ĐẠI"],
 "Inside MoMA, floor by floor": ["走进MoMA，一层一层看", "Dentro del MoMA, planta por planta", "MoMA 내부, 층층이", "Bên trong MoMA, từng tầng một"],
 "The Museum of Modern Art with the same footprint map: The Starry Night, the Demoiselles and Monet's Water Lilies room on Floor 5, Pollock and Warhol on Floor 4. Pick your galleries and the route walks itself, and the search bar answers any label number in the building, checked weekly against the museum's own collection data.": [
     "现代艺术博物馆，用的是同一套足迹地图：《星夜》、《亚维农的少女》和莫奈《睡莲》展厅都在五层，波洛克和沃霍尔在四层。选好展厅，路线自己走出来；搜索栏能查馆内任何一个标签编号，每周与博物馆自己的藏品数据核对一次。",
     "El Museo de Arte Moderno con el mismo mapa de huellas: La noche estrellada, Las señoritas de Avignon y la sala de los Nenúfares de Monet en la planta 5, Pollock y Warhol en la 4. Elige tus salas y la ruta se recorre sola, y el buscador responde a cualquier número de cartela del edificio, contrastado cada semana con los propios datos del museo.",
     "같은 발자국 지도로 보는 현대미술관: 5층에 별이 빛나는 밤, 아비뇽의 처녀들, 모네의 수련 방이 있고, 4층에 폴록과 워홀이 있습니다. 전시실을 고르면 경로가 알아서 그려지고, 검색창은 건물 안 어떤 라벨 번호든 답해 줍니다. 매주 미술관 자체 소장품 데이터와 대조합니다.",
     "Bảo tàng Nghệ thuật Hiện đại với cùng bản đồ dấu chân: Đêm đầy sao, Những cô nàng Avignon và phòng Hoa súng của Monet ở tầng 5, Pollock và Warhol ở tầng 4. Chọn các phòng bạn muốn và lộ trình tự hình thành, còn ô tìm kiếm trả lời bất kỳ mã nhãn nào trong tòa nhà, được đối chiếu hằng tuần với dữ liệu sưu tập của chính bảo tàng."],
 "Open MoMA →": ["打开MoMA →", "Abrir el MoMA →", "MoMA 열기 →", "Mở MoMA →"],
 "The Brooklyn Bridge and the Empire State Building as models you can turn in your hand, drawn at their real dimensions, with the questions answered underneath: which way to walk the bridge, and which observatory is the one people mean.": [
     "布鲁克林大桥和帝国大厦做成可以在手里转动的模型，按真实尺寸绘制，下面还回答了那些问题：桥该往哪个方向走，以及人们说的观景台到底是哪一个。",
     "El puente de Brooklyn y el Empire State como maquetas que puedes girar en la mano, dibujadas a sus medidas reales, con las preguntas respondidas debajo: en qué sentido cruzar el puente y cuál es el mirador del que habla la gente.",
     "브루클린 브리지와 엠파이어 스테이트 빌딩을 손안에서 돌려 볼 수 있는 모형으로, 실제 치수대로 그렸습니다. 그 아래에는 다리를 어느 방향으로 걸을지, 사람들이 말하는 전망대가 어느 쪽인지에 대한 답이 있습니다.",
     "Cầu Brooklyn và tòa Empire State thành những mô hình bạn có thể xoay trong tay, vẽ đúng kích thước thật, bên dưới là lời giải đáp: nên đi bộ qua cầu theo hướng nào, và đài quan sát mà mọi người nhắc đến là cái nào."],
 "Turn the landmarks →": ["转动这些地标 →", "Gira los monumentos →", "랜드마크 돌려 보기 →", "Xoay các công trình →"],
 "Inside MoMA": ["走进MoMA", "Dentro del MoMA", "MoMA 내부", "Bên trong MoMA"],
 "For modern art days in New York": [
     "适合在纽约看现代艺术的日子", "Para días de arte moderno en Nueva York",
     "뉴욕에서 현대미술을 보는 날에", "Cho những ngày xem nghệ thuật hiện đại ở New York"],
 "The Museum of Modern Art, floor by floor: The Starry Night, the Demoiselles, Monet's Water Lilies room. Tap the galleries you want, and footprints walk the route, checked weekly against the museum's own collection data.": [
     "现代艺术博物馆，一层一层看：《星夜》、《亚维农的少女》、莫奈《睡莲》展厅。点选你想去的展厅，足迹会带你走完路线，每周与博物馆自己的藏品数据核对。",
     "El Museo de Arte Moderno, planta por planta: La noche estrellada, Las señoritas de Avignon, la sala de los Nenúfares de Monet. Toca las salas que quieras y las huellas recorren la ruta, contrastada cada semana con los datos del propio museo.",
     "현대미술관을 층층이: 별이 빛나는 밤, 아비뇽의 처녀들, 모네의 수련 방. 원하는 전시실을 누르면 발자국이 경로를 걸으며, 매주 미술관 자체 소장품 데이터와 대조합니다.",
     "Bảo tàng Nghệ thuật Hiện đại, từng tầng một: Đêm đầy sao, Những cô nàng Avignon, phòng Hoa súng của Monet. Chạm vào các phòng bạn muốn, và những dấu chân sẽ đi hết lộ trình, được đối chiếu hằng tuần với dữ liệu sưu tập của chính bảo tàng."],
 "Walk MoMA →": ["走一遍MoMA →", "Recorre el MoMA →", "MoMA 걸어 보기 →", "Đi bộ trong MoMA →"],
})

EXTRA.update({
 # ---- tours.html. The money page, and it was 4% translated: a Chinese or
 # Korean visitor off an Alaska cruise met an English wall on the one page
 # that asks for their business.
 "Seattle Walking Tours with a Licensed Guide · Cruise Terminal & Downtown | Plateau Strategy": [
     "西雅图持照导游徒步游 · 邮轮码头与市中心 | Plateau Strategy",
     "Tours a pie por Seattle con guía licenciado · Terminal de cruceros y centro | Plateau Strategy",
     "면허 가이드와 함께하는 시애틀 도보 투어 · 크루즈 터미널과 다운타운 | Plateau Strategy",
     "Tour đi bộ Seattle cùng hướng dẫn viên có giấy phép · Bến tàu và trung tâm | Plateau Strategy"],
 "Seattle · Licensed guide · Walking tours": [
     "西雅图 · 持照导游 · 徒步游", "Seattle · Guía licenciado · Tours a pie",
     "시애틀 · 면허 가이드 · 도보 투어", "Seattle · Hướng dẫn viên có giấy phép · Tour đi bộ"],
 "See Seattle on foot, with a guide who is licensed to show it to you": [
     "用双脚认识西雅图，带路的是一位持照导游",
     "Descubre Seattle a pie, con un guía licenciado para enseñártela",
     "면허를 갖춘 가이드와 함께 두 발로 시애틀을 둘러보세요",
     "Khám phá Seattle bằng đôi chân, cùng một hướng dẫn viên có giấy phép"],
 "Small-group and private walking tours of Seattle. If you are off a cruise ship, the whole tour is built around one promise:": [
     "西雅图的小团和私人徒步游。如果你是从邮轮上下来的，整趟行程都围绕一个承诺来安排：",
     "Tours a pie por Seattle, en grupo reducido o privados. Si vienes de un crucero, todo el recorrido se construye sobre una promesa:",
     "소규모 및 프라이빗 시애틀 도보 투어. 크루즈에서 내리셨다면, 투어 전체가 단 하나의 약속을 중심으로 짜입니다:",
     "Tour đi bộ Seattle theo nhóm nhỏ hoặc riêng tư. Nếu bạn vừa xuống từ tàu du lịch, toàn bộ hành trình được xây quanh một lời hứa:"],
 "you get back to your ship with time to spare.": [
     "让你留有余裕地回到船上。", "vuelves a tu barco con tiempo de sobra.",
     "여유 있게 배로 돌아가실 수 있습니다.", "bạn quay lại tàu với thời gian dư dả."],
 "Departures from": ["出发地点", "Salidas desde", "출발 장소", "Khởi hành từ"],
 "Pier 66": ["66号码头", "Muelle 66", "66번 부두", "Bến 66"],
 "Pier 91": ["91号码头", "Muelle 91", "91번 부두", "Bến 91"],
 "Washington-licensed tour guide": [
     "华盛顿州持照导游", "Guía turístico licenciado en Washington",
     "워싱턴주 면허 관광 가이드", "Hướng dẫn viên có giấy phép bang Washington"],
 "Registered Seattle LLC": [
     "在西雅图注册的有限责任公司", "Sociedad registrada en Seattle",
     "시애틀에 등록된 법인", "Công ty đã đăng ký tại Seattle"],
 "Small groups, never a crowd of forty": [
     "小团出行，绝不是四十人的大队伍", "Grupos pequeños, nunca una multitud de cuarenta",
     "소규모 그룹, 마흔 명씩 몰려다니는 일은 없습니다", "Nhóm nhỏ, không bao giờ là đoàn bốn mươi người"],
 "The tours": ["行程", "Los tours", "투어 종류", "Các tour"],
 "Cruise Terminal Walking Tour": [
     "邮轮码头徒步游", "Tour a pie desde la terminal de cruceros",
     "크루즈 터미널 도보 투어", "Tour đi bộ từ bến tàu du lịch"],
 "$75 / person": ["每人 75 美元", "75 $ por persona", "1인당 75달러", "75 đô/người"],
 "2.5 hours · starts at Pier 66 or Pier 91 · 2 people minimum": [
     "2.5小时 · 从66号或91号码头出发 · 最少2人",
     "2,5 horas · sale del Muelle 66 o del 91 · mínimo 2 personas",
     "2.5시간 · 66번 또는 91번 부두 출발 · 최소 2인",
     "2,5 giờ · khởi hành từ Bến 66 hoặc Bến 91 · tối thiểu 2 người"],
 "You have one afternoon in Seattle and a hard deadline. We start at your terminal, walk the waterfront and the parts of downtown worth your only afternoon, and I have you back at the gangway": [
     "你在西雅图只有一个下午，而且时间卡得很死。我们从你的码头出发，走海滨，再走市中心里值得你把这唯一一个下午花在上面的那几段，然后我把你送回舷梯口，",
     "Tienes una tarde en Seattle y una hora límite estricta. Empezamos en tu terminal, recorremos el paseo marítimo y las partes del centro que merecen tu única tarde, y te devuelvo a la pasarela",
     "시애틀에서 보낼 시간은 오후 한나절뿐이고, 마감 시간은 절대적입니다. 당신의 터미널에서 출발해 해안가와 그 한나절을 쓸 가치가 있는 다운타운 구간을 걷고, 승선 통로까지 다시 모셔다드립니다,",
     "Bạn chỉ có một buổi chiều ở Seattle và một hạn chót không thể trễ. Chúng ta bắt đầu từ bến của bạn, đi dọc bờ nước và những phần trung tâm xứng đáng với buổi chiều duy nhất ấy, rồi tôi đưa bạn về tận cầu tàu"],
 "at least an hour before all-aboard": [
     "至少在开船集合时间前一小时", "al menos una hora antes del embarque final",
     "최종 승선 시각보다 최소 한 시간 앞서", "ít nhất một giờ trước giờ lên tàu cuối"],
 ". I plan the route backwards from your ship's time, not forwards from the start.": [
     "。我是从你船的时间往回倒着排路线的，而不是从出发时间往前排。",
     ". Planifico la ruta hacia atrás desde la hora de tu barco, no hacia adelante desde el inicio.",
     ". 저는 출발 시각부터 앞으로 짜는 대신, 배의 시각에서 거꾸로 되짚어 경로를 만듭니다.",
     ". Tôi lên lộ trình bằng cách tính ngược từ giờ tàu của bạn, chứ không tính xuôi từ lúc bắt đầu."],
 "Downtown Seattle & Pike Place Half-Day": [
     "西雅图市中心与派克市场 半日游", "Medio día por el centro de Seattle y Pike Place",
     "시애틀 다운타운과 파이크 플레이스 반일 투어", "Nửa ngày ở trung tâm Seattle và Pike Place"],
 "$89 / person": ["每人 89 美元", "89 $ por persona", "1인당 89달러", "89 đô/người"],
 "3 hours · starts at Pike Place Market · 2 people minimum": [
     "3小时 · 从派克市场出发 · 最少2人",
     "3 horas · sale del Mercado de Pike Place · mínimo 2 personas",
     "3시간 · 파이크 플레이스 마켓 출발 · 최소 2인",
     "3 giờ · khởi hành từ Chợ Pike Place · tối thiểu 2 người"],
 "Pike Place beyond the fish throwers, the waterfront, and Pioneer Square, the original city, and why it sits one storey below the current one. For visitors with a full day and locals who never did the tour.": [
     "派克市场里不只有扔鱼那一幕，还有海滨，以及先锋广场：最早的那座城，以及它为什么比今天的城低一层。适合有一整天的游客，也适合从没走过这一趟的本地人。",
     "Pike Place más allá de los lanzadores de pescado, el paseo marítimo y Pioneer Square, la ciudad original, y por qué queda una planta por debajo de la actual. Para visitantes con un día entero y para locales que nunca hicieron el tour.",
     "생선 던지기 너머의 파이크 플레이스, 해안가, 그리고 파이어니어 스퀘어. 원래의 도시가 왜 지금 도시보다 한 층 아래에 있는지까지. 하루를 온전히 쓸 수 있는 방문객과, 한 번도 이 투어를 해 보지 않은 현지인을 위한 코스입니다.",
     "Pike Place ngoài màn ném cá, khu bờ nước, và Pioneer Square, thành phố nguyên bản, cùng lý do nó nằm thấp hơn thành phố hiện tại một tầng. Dành cho khách có trọn một ngày và cả người bản địa chưa từng đi tour này."],
 "Private Group Walking Tour": [
     "私人团徒步游", "Tour a pie para grupo privado",
     "프라이빗 그룹 도보 투어", "Tour đi bộ nhóm riêng"],
 "$395 flat": ["一口价 395 美元", "395 $ fijos", "정액 395달러", "trọn gói 395 đô"],
 "3 hours · up to 6 people · route built with you": [
     "3小时 · 最多6人 · 路线和你一起定",
     "3 horas · hasta 6 personas · ruta diseñada contigo",
     "3시간 · 최대 6인 · 경로는 함께 짭니다",
     "3 giờ · tối đa 6 người · lộ trình lên cùng bạn"],
 "One group, one guide, no strangers. Tell me what the group actually cares about: history, food stops, photographs, or getting the kids through it without a mutiny. and the route gets built around that.": [
     "一个团，一位导游，没有陌生人。告诉我你们这一行人真正在意什么：历史、吃的、拍照，还是让孩子们一路不闹翻，路线就照着这个来定。",
     "Un grupo, un guía, ningún desconocido. Dime qué le importa de verdad a tu grupo: historia, paradas para comer, fotografías, o llevar a los niños hasta el final sin un motín. Y la ruta se construye alrededor de eso.",
     "한 팀, 한 명의 가이드, 낯선 사람은 없습니다. 일행이 정말 원하는 것을 말씀해 주세요. 역사인지, 먹거리인지, 사진인지, 아니면 아이들이 폭발하지 않게 무사히 마치는 것인지. 경로는 그것을 중심으로 짭니다.",
     "Một nhóm, một hướng dẫn viên, không có người lạ. Hãy cho tôi biết nhóm bạn thực sự quan tâm điều gì: lịch sử, các điểm ăn uống, chụp ảnh, hay đưa lũ trẻ đi hết chặng mà không nổi loạn. Lộ trình sẽ được dựng quanh điều đó."],
 "Every tour on this page is": ["本页所有行程都是", "Todos los tours de esta página son", "이 페이지의 모든 투어는", "Mọi tour trên trang này đều là"],
 "on foot": ["徒步", "a pie", "도보로 진행됩니다", "đi bộ"],
 ". Comfortable shoes, Seattle hills, and rain that locals ignore. Transport between points is not included and is not part of the tour.": [
     "。请穿舒服的鞋，西雅图有坡，还有本地人根本不当回事的雨。各点之间的交通不包含在内，也不属于行程的一部分。",
     ". Calzado cómodo, las cuestas de Seattle y una lluvia que los locales ignoran. El transporte entre puntos no está incluido ni forma parte del tour.",
     ". 편한 신발, 시애틀의 언덕, 그리고 현지인들은 신경도 쓰지 않는 비. 지점 간 이동 수단은 포함되지 않으며 투어의 일부가 아닙니다.",
     ". Giày thoải mái, những con dốc Seattle, và cơn mưa mà dân địa phương chẳng bận tâm. Việc di chuyển giữa các điểm không bao gồm và không thuộc tour."],
 "Booking, plainly": ["预订流程，说清楚", "Reservar, en pocas palabras", "예약 절차, 간단히", "Đặt chỗ, nói thẳng"],
 "Send the form below or email": ["填下面的表格，或者发邮件到", "Envía el formulario de abajo o escribe a", "아래 양식을 보내시거나 이메일 주세요:", "Gửi mẫu bên dưới hoặc email tới"],
 "hello@plateaustrategy.io": ["hello@plateaustrategy.io", "hello@plateaustrategy.io", "hello@plateaustrategy.io", "hello@plateaustrategy.io"],
 ". Tell me your date and, if you are sailing, your ship and its all-aboard time.": [
     "。告诉我你的日期；如果你是坐船来的，再告诉我船名和最晚登船时间。",
     ". Dime tu fecha y, si vienes en crucero, el barco y su hora de embarque final.",
     ". 날짜를 알려 주시고, 배로 오신다면 선박명과 최종 승선 시각도 함께 알려 주세요.",
     ". Cho tôi biết ngày của bạn và, nếu bạn đi tàu, tên tàu cùng giờ lên tàu cuối."],
 "I confirm the time and the meeting point in writing.": [
     "我会用书面方式确认时间和集合地点。",
     "Confirmo por escrito la hora y el punto de encuentro.",
     "시간과 만나는 장소는 서면으로 확인해 드립니다.",
     "Tôi xác nhận giờ và điểm hẹn bằng văn bản."],
 "You get an invoice from": ["你会收到一张账单，开票方是", "Recibes una factura de", "다음 명의로 청구서를 보내 드립니다:", "Bạn sẽ nhận hóa đơn từ"],
 "Plateau Strategy LLC": ["Plateau Strategy LLC", "Plateau Strategy LLC", "Plateau Strategy LLC", "Plateau Strategy LLC"],
 "and pay by card. No deposit is taken before the date is confirmed.": [
     "，用信用卡付款。日期确认之前不收任何定金。",
     "y pagas con tarjeta. No se cobra ningún depósito antes de confirmar la fecha.",
     "결제는 카드로 하시면 됩니다. 날짜가 확정되기 전에는 보증금을 받지 않습니다.",
     "và thanh toán bằng thẻ. Không thu bất kỳ khoản đặt cọc nào trước khi ngày được xác nhận."],
 "Cruise dates in August and September fill first. That is peak season on the Alaska run. If your date is tight, say so in the message and I will tell you straight away whether it works.": [
     "八月和九月的邮轮档期最先排满，那是阿拉斯加航线的旺季。如果你的日期很紧，在留言里说一声，我会马上告诉你行不行。",
     "Las fechas de crucero de agosto y septiembre se llenan primero: es temporada alta en la ruta de Alaska. Si tu fecha va justa, dilo en el mensaje y te digo enseguida si es posible.",
     "8월과 9월 크루즈 날짜가 가장 먼저 찹니다. 알래스카 노선의 성수기이기 때문입니다. 일정이 빠듯하시면 메시지에 적어 주세요. 가능한지 바로 알려 드리겠습니다.",
     "Các ngày tàu du lịch trong tháng Tám và tháng Chín kín trước tiên, vì đó là cao điểm của tuyến Alaska. Nếu ngày của bạn eo hẹp, hãy nói trong tin nhắn và tôi sẽ trả lời ngay là có được hay không."],
 "Ask about a date": ["咨询某个日期", "Consulta una fecha", "날짜 문의하기", "Hỏi về một ngày cụ thể"],
 "Which tour": ["选择行程", "Qué tour", "어떤 투어", "Tour nào"],
 "Cruise Terminal Walking Tour: $75/person": [
     "邮轮码头徒步游：每人75美元", "Tour desde la terminal de cruceros: 75 $/persona",
     "크루즈 터미널 도보 투어: 1인당 75달러", "Tour đi bộ từ bến tàu: 75 đô/người"],
 "Downtown & Pike Place Half-Day: $89/person": [
     "市中心与派克市场半日游：每人89美元", "Medio día centro y Pike Place: 89 $/persona",
     "다운타운과 파이크 플레이스 반일: 1인당 89달러", "Nửa ngày trung tâm và Pike Place: 89 đô/người"],
 "Private Group Walking Tour: $395 flat": [
     "私人团徒步游：一口价395美元", "Tour privado a pie: 395 $ fijos",
     "프라이빗 그룹 도보 투어: 정액 395달러", "Tour đi bộ nhóm riêng: trọn gói 395 đô"],
 "Not sure yet, tell me what fits": [
     "还没想好，帮我看看哪个合适", "Aún no lo sé, dime qué encaja",
     "아직 정하지 못했어요, 맞는 걸 추천해 주세요", "Chưa chắc, hãy tư vấn giúp tôi"],
 "Date in Seattle": ["在西雅图的日期", "Fecha en Seattle", "시애틀 방문 날짜", "Ngày ở Seattle"],
 "How many people": ["几位", "Cuántas personas", "인원 수", "Bao nhiêu người"],
 "Ship name and all-aboard time, or anything else": [
     "船名和最晚登船时间，或其他任何情况",
     "Nombre del barco y hora de embarque, o cualquier otra cosa",
     "선박명과 최종 승선 시각, 그 밖에 알려 주실 내용",
     "Tên tàu và giờ lên tàu cuối, hoặc bất cứ điều gì khác"],
 "Send the question →": ["发送咨询 →", "Enviar la consulta →", "문의 보내기 →", "Gửi câu hỏi →"],
 "This sends a question, not a booking. Nothing is charged and no date is held until I write back and confirm it with you.": [
     "这只是发送一条咨询，不是下单。在我回信并与你确认之前，不会收费，也不会占用日期。",
     "Esto envía una consulta, no una reserva. No se cobra nada ni se bloquea ninguna fecha hasta que te responda y lo confirme contigo.",
     "이것은 문의를 보내는 것이지 예약이 아닙니다. 제가 답장을 드리고 함께 확정하기 전까지는 요금이 청구되지 않고 날짜도 잡히지 않습니다.",
     "Đây là gửi một câu hỏi, không phải đặt chỗ. Không có khoản nào bị tính và không ngày nào được giữ cho đến khi tôi hồi âm và xác nhận cùng bạn."],
 "Plateau Strategy LLC · Seattle, WA": [
     "Plateau Strategy LLC · 华盛顿州西雅图", "Plateau Strategy LLC · Seattle, WA",
     "Plateau Strategy LLC · 워싱턴주 시애틀", "Plateau Strategy LLC · Seattle, WA"],
 "Licensed guided walking tours ·": [
     "持照导游带队的徒步游 ·", "Tours a pie con guía licenciado ·",
     "면허 가이드 동행 도보 투어 ·", "Tour đi bộ có hướng dẫn viên được cấp phép ·"],
})
