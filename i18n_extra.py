# -*- coding: utf-8 -*-
"""Translations for the pages the first pass never reached.

Order is always [zh, es, ko, vi]. Keys must match the page text exactly as a
reader sees it, whitespace collapsed — i18n.js looks the line up by its English.

Kept in its own file so build_i18n.py stays readable; it merges this on top.
"""

# Brand names, example values and codes a reader should still see in English.
EXTRA_SKIP = {
    "Plateau Strategy Solution Lab", "Plateau Strategy", "Plateau Deflator",
    "OpenStreetMap", "Nominatim", "OSRM", "Overpass", "Atlas",
    "Ana Silva", "Harvard Yard in depth — a student's walk", "Boston",
    "English, Mandarin", "Johnston Gate, Massachusetts Ave side",
    "AS 1234", "Pier 91 Cruise Terminal, Seattle", "Princess",
    "Discovery Princess", "Woodinville wine tour", "Back to the hotel",
    "e.g. AGT-XXXX", "AGT-XXXX — proves you're a listed guide",
    "ana@email.com", "you@paypal-email.com", "example.com",
    "Bureau of the Fiscal Service",
    "Attn Dept G · Bureau of the Fiscal Service · P.O. Box 2188 · Parkersburg, WV 26106-2188",
    "Gifts to Reduce the Public Debt",
    "🇺🇸 Give at the U.S. Treasury (Pay.gov) →",
    "FIG 1 — MIXED-USE HUB · FRONT ELEVATION (NTS)",
    "PROJECT · PLATEAU STRATEGY", "SHEET · RE-01", "SCALE · NTS", "REV · A",
    "Mixed-use development · Sheet RE-01",
    "© 2026 Plateau Strategy Solution Lab",
    '"Connect to Square"',
}

EXTRA = {
    # ---------------- Trip Planner ----------------
    "🗺️ Trip Planner": ["🗺️ 行程规划", "🗺️ Planificador de viaje", "🗺️ 여행 플래너", "🗺️ Lập kế hoạch chuyến đi"],
    "Free for everyone — drivers, tour guides, tourists. Tap where you are, and every attraction lights up or dims based on drive time, traffic and closing hours. Your taps build the plan, day by day.": [
        "对所有人免费——司机、导游、游客都能用。点一下您的位置，每个景点会根据车程、路况和关门时间自动变亮或变暗。您点到哪里，行程就排到哪里，一天一天成形。",
        "Gratis para todos: conductores, guías y turistas. Toca dónde estás y cada atracción se ilumina o se atenúa según el tiempo de viaje, el tráfico y la hora de cierre. Tus toques arman el plan, día a día.",
        "누구나 무료입니다 — 기사, 가이드, 여행자 모두. 현재 위치를 누르면 이동 시간·교통·마감 시간에 따라 각 명소가 밝아지거나 흐려집니다. 누르는 대로 하루하루 일정이 만들어집니다.",
        "Miễn phí cho tất cả — tài xế, hướng dẫn viên, khách du lịch. Chạm vào nơi bạn đang ở, mỗi điểm tham quan sẽ sáng lên hoặc mờ đi theo thời gian lái xe, giao thông và giờ đóng cửa. Bạn chạm tới đâu, lịch trình thành hình tới đó."],
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
    "🤵 Jarvis — your trip organizer": ["🤵 Jarvis——您的行程管家", "🤵 Jarvis — tu organizador de viaje", "🤵 자비스 — 당신의 여행 도우미", "🤵 Jarvis — người sắp xếp chuyến đi của bạn"],
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
    "▴ Smaller — just keep me posted": ["▴ 收起——有事再告诉我", "▴ Más pequeño — solo mantenme al tanto", "▴ 작게 — 소식만 알려주세요", "▴ Thu nhỏ — chỉ cần báo tôi biết"],
    "Enough time": ["时间充足", "Tiempo de sobra", "시간 여유 있음", "Đủ thời gian"],
    "Tight": ["时间紧", "Justo", "빠듯함", "Sát giờ"],
    "Can't make it": ["赶不上", "No llegas", "도착 불가", "Không kịp"],
    "In your trip": ["已加入行程", "En tu viaje", "일정에 포함됨", "Đã trong chuyến đi"],
    "Start point (drag it)": ["起点（可拖动）", "Punto de partida (arrástralo)", "출발 지점 (끌어 옮기기)", "Điểm xuất phát (kéo được)"],
    "Loading drive times…": ["正在计算车程…", "Calculando tiempos de viaje…", "이동 시간 불러오는 중…", "Đang tải thời gian lái xe…"],
    "Destination Book —": ["目的地手册 —", "Libro de destinos —", "여행지 북 —", "Sổ điểm đến —"],
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
    "should start from wherever you sleep — otherwise it plans your morning from your original start point. Have you already got somewhere?": [
        "天应该从您过夜的地方出发——否则系统会按最初的起点安排早上的行程。您订好住处了吗？",
        "debería empezar donde duermas — si no, planificará tu mañana desde el punto de partida original. ¿Ya tienes dónde quedarte?",
        "은 잠자는 곳에서 시작해야 합니다 — 그렇지 않으면 아침 일정이 원래 출발지 기준으로 짜입니다. 숙소를 정하셨나요?",
        "nên bắt đầu từ nơi bạn ngủ — nếu không, buổi sáng sẽ được xếp từ điểm xuất phát ban đầu. Bạn đã có chỗ nghỉ chưa?"],
    "Yes — I've booked somewhere": ["订好了", "Sí — ya reservé", "네 — 예약했습니다", "Rồi — tôi đã đặt chỗ"],
    "Use this": ["就用这个", "Usar esto", "이걸로 설정", "Dùng chỗ này"],
    "Not yet — near where Day": ["还没订——就在第", "Todavía no — cerca de donde el día", "아직요 — ", "Chưa — gần nơi ngày"],
    "ends": ["天结束的地方附近", "termina", "일차가 끝나는 곳 근처", "kết thúc"],
    "🏨 Find places to stay near": ["🏨 在附近找住宿", "🏨 Buscar alojamiento cerca de", "🏨 근처 숙소 찾기", "🏨 Tìm chỗ nghỉ gần"],
    "my last stop": ["我的最后一站", "mi última parada", "마지막 방문지", "điểm dừng cuối của tôi"],
    "I'm heading back to my start point →": ["我要回到起点 →", "Vuelvo a mi punto de partida →", "출발 지점으로 돌아갑니다 →", "Tôi quay lại điểm xuất phát →"],
    "Hand your trip to a guide": ["把行程交给导游", "Entrega tu viaje a un guía", "여행을 가이드에게 맡기기", "Giao chuyến đi cho hướng dẫn viên"],
    "Email or phone": ["邮箱或电话", "Correo o teléfono", "이메일 또는 전화", "Email hoặc điện thoại"],
    "Email or phone (optional)": ["邮箱或电话（选填）", "Correo o teléfono (opcional)", "이메일 또는 전화 (선택)", "Email hoặc điện thoại (tùy chọn)"],
    "Your guide code": ["您的导游编号", "Tu código de guía", "가이드 코드", "Mã hướng dẫn viên của bạn"],
    "No code yet?": ["还没有编号？", "¿Aún no tienes código?", "아직 코드가 없나요?", "Chưa có mã?"],
    "Register as a guide — takes a minute": ["注册成为导游——一分钟搞定", "Regístrate como guía — toma un minuto", "가이드로 등록 — 1분이면 됩니다", "Đăng ký làm hướng dẫn viên — chỉ một phút"],
    "Organization (optional)": ["机构名称（选填）", "Organización (opcional)", "소속 (선택)", "Tổ chức (tùy chọn)"],
    "Get my guide code": ["获取我的导游编号", "Obtener mi código de guía", "가이드 코드 받기", "Nhận mã hướng dẫn viên"],
    "Price for this guided trip (USD)": ["这条导览行程的价格（美元）", "Precio de este viaje guiado (USD)", "이 가이드 투어 가격 (USD)", "Giá cho chuyến có hướng dẫn (USD)"],
    "Anything to tell the guide? (optional)": ["有什么要告诉导游的吗？（选填）", "¿Algo que decirle al guía? (opcional)", "가이드에게 전할 말이 있나요? (선택)", "Có điều gì muốn nhắn hướng dẫn viên? (tùy chọn)"],
    "Send": ["发送", "Enviar", "보내기", "Gửi"],
    "🤖 Robotaxi ride": ["🤖 无人驾驶接送", "🤖 Viaje en robotaxi", "🤖 로보택시 이용", "🤖 Chuyến xe tự lái"],
    "UNDER RESEARCH": ["研究中", "EN INVESTIGACIÓN", "연구 중", "ĐANG NGHIÊN CỨU"],
    "Self-driving pickups are under research — we're studying how to hail an autonomous car straight from your planned route, safely and privately. It isn't bookable today, and no ride is being requested.": [
        "无人驾驶接送仍在研究中——我们正在研究如何安全、私密地从您已排好的行程直接叫一辆自动驾驶车。目前还不能预约，也不会发出任何叫车请求。",
        "Los viajes autónomos están en investigación: estudiamos cómo llamar un coche autónomo directamente desde tu ruta, de forma segura y privada. Hoy no se puede reservar y no se está solicitando ningún viaje.",
        "자율주행 픽업은 아직 연구 단계입니다 — 계획한 경로에서 바로, 안전하고 사적으로 자율주행차를 부르는 방법을 연구 중입니다. 현재는 예약할 수 없으며 어떤 호출도 이루어지지 않습니다.",
        "Đón khách bằng xe tự lái vẫn đang nghiên cứu — chúng tôi đang tìm cách gọi xe tự hành ngay từ lộ trình bạn đã lên, an toàn và riêng tư. Hiện chưa thể đặt và không có chuyến nào được yêu cầu."],
    "Want us to tell you when it's ready?": ["想在开放时收到通知吗？", "¿Quieres que te avisemos cuando esté listo?", "준비되면 알려드릴까요?", "Bạn muốn được báo khi sẵn sàng chứ?"],
    "🔔 Notify me when robotaxi launches": ["🔔 上线时通知我", "🔔 Avísame cuando lance el robotaxi", "🔔 로보택시 출시되면 알려주세요", "🔔 Báo tôi khi xe tự lái ra mắt"],
    "In the meantime, tap": ["在此期间，点击", "Mientras tanto, toca", "그동안에는", "Trong lúc chờ, hãy chạm"],
    "to book a real driver to the same stop.": ["即可预约真人司机送您到同一地点。", "para reservar un conductor real al mismo destino.", "를 눌러 같은 장소로 실제 기사를 예약하세요.", "để đặt tài xế thật đến cùng điểm đó."],
    "Type a destination and press Add — or tap a pin on the map": [
        "输入目的地并点“添加”——或直接点地图上的标记",
        "Escribe un destino y pulsa Añadir — o toca un marcador en el mapa",
        "목적지를 입력하고 추가를 누르세요 — 또는 지도의 핀을 누르세요",
        "Nhập điểm đến rồi nhấn Thêm — hoặc chạm một ghim trên bản đồ"],
    "Type your starting address, hotel or airport…": ["输入出发地址、酒店或机场…", "Escribe tu dirección de partida, hotel o aeropuerto…", "출발 주소, 호텔 또는 공항을 입력하세요…", "Nhập địa chỉ xuất phát, khách sạn hoặc sân bay…"],
    "Book a ride to your stop": ["预约用车前往您的目的地", "Reserva un viaje a tu parada", "목적지까지 차량 예약", "Đặt xe đến điểm dừng của bạn"],
    "Self-driving pickup — under research": ["无人驾驶接送——研究中", "Recogida autónoma — en investigación", "자율주행 픽업 — 연구 중", "Đón bằng xe tự lái — đang nghiên cứu"],
    "Hand it off — a local guide reaches out": ["交给当地导游——他们会联系您", "Pásalo — un guía local te contactará", "넘기기 — 현지 가이드가 연락드립니다", "Chuyển đi — hướng dẫn viên bản địa sẽ liên hệ"],
    "One person drives and guides you": ["一个人既开车又讲解", "Una persona conduce y te guía", "한 사람이 운전과 안내를 함께", "Một người vừa lái xe vừa hướng dẫn"],
    "Copy the itinerary as text — send it to anyone": ["复制文字版行程——发给任何人", "Copia el itinerario como texto — envíaselo a quien quieras", "일정을 텍스트로 복사 — 누구에게나 전송", "Sao chép lịch trình dạng văn bản — gửi cho bất kỳ ai"],
    "Share the itinerary": ["分享行程", "Compartir el itinerario", "일정 공유", "Chia sẻ lịch trình"],
    "Print the day sheet (or save as PDF)": ["打印行程单（或存为 PDF）", "Imprime la hoja del día (o guárdala en PDF)", "일정표 인쇄 (또는 PDF로 저장)", "In bảng lịch trong ngày (hoặc lưu PDF)"],
    "Remove the last stop": ["删除最后一站", "Quitar la última parada", "마지막 방문지 삭제", "Xóa điểm dừng cuối"],
    "Open the Destination Book": ["打开目的地手册", "Abrir el Libro de destinos", "여행지 북 열기", "Mở Sổ điểm đến"],
    "Search any address or attraction — it joins the book…": [
        "搜索任意地址或景点——它会自动收录进手册…",
        "Busca cualquier dirección o atracción — se añade al libro…",
        "주소나 명소를 검색하세요 — 자동으로 북에 등록됩니다…",
        "Tìm bất kỳ địa chỉ hay điểm tham quan nào — nó sẽ được thêm vào sổ…"],
    "Hotel name or address…": ["酒店名称或地址…", "Nombre del hotel o dirección…", "호텔 이름 또는 주소…", "Tên khách sạn hoặc địa chỉ…"],
    "Who should the guide ask for?": ["导游到时找谁？", "¿Por quién debe preguntar el guía?", "가이드가 누구를 찾으면 될까요?", "Hướng dẫn viên nên hỏi tìm ai?"],
    "How the guide reaches you": ["导游如何联系您", "Cómo te contactará el guía", "가이드가 연락할 방법", "Cách hướng dẫn viên liên hệ bạn"],
    "Leave blank if it's just you": ["个人报名请留空", "Déjalo en blanco si eres solo tú", "혼자라면 비워 두세요", "Để trống nếu chỉ có bạn"],
}

EXTRA.update({
    # ---------------- Guided Trips / Guide Studio ----------------
    "Guided Trips — in-depth walks from local guides": ["导览行程——当地导游的深度徒步", "Viajes guiados — paseos a fondo con guías locales", "가이드 투어 — 현지 가이드의 심층 도보", "Chuyến có hướng dẫn — những buổi đi bộ chuyên sâu cùng hướng dẫn viên bản địa"],
    "Trip Planner": ["行程规划", "Planificador de viaje", "여행 플래너", "Lập kế hoạch chuyến đi"],
    "Guides: list a trip": ["导游：发布行程", "Guías: publica un viaje", "가이드: 여행 등록", "Hướng dẫn viên: đăng một chuyến"],
    "🎫 Guided Trips": ["🎫 导览行程", "🎫 Viajes guiados", "🎫 가이드 투어", "🎫 Chuyến có hướng dẫn"],
    "Not sightseeing loops — these are written by the guides who run them, stop by stop, with how long you actually stand at each one. A student's hour in Harvard Yard is a different thing from a bus past the gate.": [
        "这不是走马观花的观光环线——每条行程都由带团的导游亲手写下，一站一站，连在每处站多久都写清楚。哈佛学生带您在校园里走一小时，和坐大巴从校门口开过去，完全是两回事。",
        "No son circuitos turísticos: los escriben los propios guías que los realizan, parada por parada, con cuánto tiempo se está en cada una. La hora de un estudiante en Harvard Yard no es lo mismo que un autobús pasando por la verja.",
        "관광버스 코스가 아닙니다 — 직접 진행하는 가이드가 한 곳씩, 각 지점에 실제로 얼마나 머무는지까지 적어 만든 일정입니다. 하버드 야드에서 학생과 보내는 한 시간은 정문을 지나치는 버스와 전혀 다릅니다.",
        "Không phải vòng tham quan chớp nhoáng — mỗi hành trình do chính hướng dẫn viên dẫn tour viết ra, từng điểm một, kèm thời gian thực sự dừng lại ở mỗi nơi. Một giờ trong khuôn viên Harvard cùng sinh viên khác hẳn chuyến xe buýt chạy ngang cổng trường."],
    "Guides can list their own →": ["导游可发布自己的行程 →", "Los guías pueden publicar los suyos →", "가이드는 직접 등록할 수 있습니다 →", "Hướng dẫn viên có thể tự đăng →"],
    "Part of the": ["隶属于", "Parte del", "다음의 일부입니다:", "Thuộc"],
    "agent programme": ["代理人计划", "programa de agentes", "에이전트 프로그램", "chương trình đại lý"],
    "Guide Studio — build a trip to sell": ["导游工作室——打造一条可出售的行程", "Estudio de guías — crea un viaje para vender", "가이드 스튜디오 — 판매할 여행 만들기", "Xưởng hướng dẫn viên — tạo một chuyến để bán"],
    "Browse trips": ["浏览行程", "Ver viajes", "여행 둘러보기", "Xem các chuyến"],
    "🎫 Guide Studio": ["🎫 导游工作室", "🎫 Estudio de guías", "🎫 가이드 스튜디오", "🎫 Xưởng hướng dẫn viên"],
    "The trip planner draws a sightseeing loop. This is for the other kind — the walk you know by heart, where the point is what you say at each stop. Write it out yourself: your stops, your timings, your price. Travellers browse it on the": [
        "行程规划工具画的是一条观光环线。这里是另一种——您烂熟于心的那条路，重点在于您在每一站讲些什么。自己把它写出来：您的站点、您的时间、您的价格。旅客可在",
        "El planificador dibuja un circuito turístico. Esto es para el otro tipo: el paseo que te sabes de memoria, donde lo importante es lo que cuentas en cada parada. Escríbelo tú: tus paradas, tus tiempos, tu precio. Los viajeros lo verán en la",
        "여행 플래너는 관광 코스를 그립니다. 이곳은 다른 종류를 위한 곳입니다 — 훤히 아는 그 길, 각 지점에서 무엇을 이야기하느냐가 핵심인 코스. 직접 써 보세요: 당신의 지점, 당신의 시간, 당신의 가격. 여행자는",
        "Công cụ lập kế hoạch vẽ ra một vòng tham quan. Đây dành cho loại khác — con đường bạn thuộc nằm lòng, nơi điều quan trọng là những gì bạn kể ở mỗi điểm dừng. Hãy tự viết ra: điểm dừng của bạn, thời gian của bạn, giá của bạn. Du khách xem nó tại"],
    "trips page": ["行程页面", "página de viajes", "여행 페이지", "trang các chuyến"],
    ". Guiding is part of the": ["查看。带团导览隶属于", ". Guiar forma parte del", "에서 봅니다. 가이드 활동은", ". Việc hướng dẫn thuộc"],
    "— one code refers rides and sells trips.": ["——同一个编号既能推荐用车，也能出售行程。", "— un mismo código refiere viajes y vende itinerarios.", "— 하나의 코드로 차량을 추천하고 여행도 판매합니다.", "— một mã vừa giới thiệu chuyến xe vừa bán hành trình."],
    "You need a code to list a trip — it is how we know a real guide wrote it. It is the same code the": [
        "发布行程需要一个编号——我们凭它确认行程出自真正的导游之手。它和",
        "Necesitas un código para publicar un viaje: así sabemos que lo escribió un guía real. Es el mismo código que emite el",
        "여행을 등록하려면 코드가 필요합니다 — 실제 가이드가 작성했음을 확인하는 방법입니다. 이는",
        "Bạn cần một mã để đăng hành trình — đó là cách chúng tôi biết một hướng dẫn viên thật đã viết nó. Đây chính là mã do"],
    "Agent & Guide Portal": ["代理人与导游平台", "Portal de agentes y guías", "에이전트 · 가이드 포털", "Cổng Đại lý & Hướng dẫn viên"],
    "issues, so if you already refer rides you have one. If not, registering there takes a minute.": [
        "发放的编号是同一个，所以如果您已经在推荐用车，就已经有了。若还没有，去那里注册只要一分钟。",
        "así que si ya refieres viajes, ya lo tienes. Si no, registrarte allí toma un minuto.",
        "에서 발급하는 코드와 같으므로, 이미 차량을 추천하고 계신다면 이미 갖고 계십니다. 없다면 등록에 1분이면 됩니다.",
        "cấp, nên nếu bạn đã giới thiệu chuyến xe thì bạn đã có. Nếu chưa, đăng ký ở đó chỉ mất một phút."],
    "Who is running it": ["由谁带团", "Quién lo dirige", "누가 진행하나요", "Ai là người dẫn"],
    "Your code identifies you. Travellers see your name, never your contact details — interest comes to you through us, so your listing cannot be harvested for emails.": [
        "编号用于识别您的身份。旅客只看到您的名字，绝不会看到您的联系方式——有人感兴趣时由我们转达，所以您的行程页不会被用来抓取邮箱。",
        "Tu código te identifica. Los viajeros ven tu nombre, nunca tus datos de contacto: el interés te llega a través de nosotros, así que tu anuncio no puede usarse para recolectar correos.",
        "코드가 당신을 식별합니다. 여행자에게는 이름만 보이고 연락처는 절대 보이지 않습니다 — 문의는 저희를 통해 전달되므로, 등록 정보가 이메일 수집에 쓰일 수 없습니다.",
        "Mã nhận diện bạn. Du khách thấy tên bạn, không bao giờ thấy thông tin liên hệ — mọi quan tâm đến với bạn qua chúng tôi, nên tin đăng của bạn không thể bị thu thập email."],
    "Where we reach you": ["我们如何联系您", "Cómo te contactamos", "연락받을 곳", "Nơi chúng tôi liên hệ bạn"],
    "What the trip is": ["这是什么样的行程", "En qué consiste el viaje", "어떤 여행인가요", "Chuyến đi là gì"],
    'Be specific. "Harvard Yard in depth — a student\'s walk" sells; "Boston tour" does not.': [
        "写具体一点。“哈佛校园深度游——学生带路”卖得动；“波士顿一日游”卖不动。",
        'Sé concreto. "Harvard Yard a fondo — el paseo de un estudiante" vende; "Tour de Boston" no.',
        '구체적으로 쓰세요. "하버드 야드 심층 — 학생과 걷기"는 팔리지만 "보스턴 투어"는 팔리지 않습니다.',
        'Hãy cụ thể. "Khuôn viên Harvard chuyên sâu — buổi đi bộ cùng sinh viên" thì bán được; "Tour Boston" thì không.'],
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
    "Listing is free. When a traveller asks for your trip we introduce you directly. You can list as many trips as you like — most guides run several versions of the same walk at different lengths.": [
        "发布免费。有旅客想订您的行程时，我们会直接为双方牵线。您想发布多少条都可以——多数导游会把同一条路线做成长短不同的几个版本。",
        "Publicar es gratis. Cuando un viajero pide tu viaje, os presentamos directamente. Puedes publicar tantos como quieras: la mayoría de los guías ofrecen varias versiones del mismo paseo con distintas duraciones.",
        "등록은 무료입니다. 여행자가 문의하면 저희가 직접 연결해 드립니다. 원하는 만큼 등록할 수 있습니다 — 대부분의 가이드는 같은 코스를 길이만 달리해 여러 버전으로 운영합니다.",
        "Đăng tin miễn phí. Khi có du khách hỏi, chúng tôi kết nối trực tiếp hai bên. Bạn có thể đăng bao nhiêu tùy thích — phần lớn hướng dẫn viên có vài phiên bản dài ngắn khác nhau của cùng một lộ trình."],
    "Your listings": ["您已发布的行程", "Tus publicaciones", "내 등록 목록", "Tin đăng của bạn"],
    "Live on the trips page right now.": ["此刻已在行程页面展示。", "Ahora mismo en la página de viajes.", "지금 여행 페이지에 게시 중입니다.", "Đang hiển thị trên trang các chuyến ngay lúc này."],
    "email or phone": ["邮箱或电话", "correo o teléfono", "이메일 또는 전화", "email hoặc điện thoại"],
    "Guiding only — museum entry not included": ["仅含导览——不含博物馆门票", "Solo guía — no incluye entrada al museo", "안내만 포함 — 박물관 입장료 불포함", "Chỉ hướng dẫn — không gồm vé vào bảo tàng"],
})

EXTRA.update({
    # ---------------- Destination Book ----------------
    "Destination Book — Plateau Strategy Solution Lab": ["目的地手册 — Plateau Strategy Solution Lab", "Libro de destinos — Plateau Strategy Solution Lab", "여행지 북 — Plateau Strategy Solution Lab", "Sổ điểm đến — Plateau Strategy Solution Lab"],
    "📖 Destination Book": ["📖 目的地手册", "📖 Libro de destinos", "📖 여행지 북", "📖 Sổ điểm đến"],
    "Destination Book": ["目的地手册", "Libro de destinos", "여행지 북", "Sổ điểm đến"],
    "A curated guidebook of attractions and restaurants — every type of destination, organized by category, with descriptions and local tips from a professionally licensed tour guide. One tap sends any place into the": [
        "一本精选的景点与餐厅指南——各类目的地按类别整理，附有描述和持证导游的本地贴士。一键即可把任意地点加入",
        "Una guía curada de atracciones y restaurantes: todo tipo de destinos, organizados por categoría, con descripciones y consejos locales de un guía con licencia profesional. Con un toque envías cualquier lugar al",
        "엄선한 명소·식당 안내서 — 모든 유형의 여행지를 분류별로 정리하고, 전문 자격을 가진 가이드의 설명과 현지 팁을 담았습니다. 한 번만 누르면 어떤 장소든",
        "Cuốn cẩm nang tuyển chọn các điểm tham quan và nhà hàng — mọi loại điểm đến, sắp theo danh mục, kèm mô tả và mẹo bản địa từ hướng dẫn viên có giấy phép. Chỉ một chạm để đưa bất kỳ nơi nào vào"],
    ". Hours shown are typical — check before you go.": ["。所列营业时间为一般情况——出发前请再确认。", ". Los horarios son orientativos: confírmalos antes de ir.", ". 표시된 시간은 통상적인 값입니다 — 방문 전 확인하세요.", ". Giờ hiển thị chỉ là thông thường — hãy kiểm tra trước khi đi."],
    "Stars": ["评分", "Estrellas", "별점", "Sao"],
    "tap to cycle 5★ → 1★": ["点击在 5★ → 1★ 之间切换", "toca para cambiar de 5★ a 1★", "누를 때마다 5★ → 1★ 로 바뀝니다", "chạm để chuyển 5★ → 1★"],
    "🌟 What do you wish was in this book?": ["🌟 您希望这本手册里出现什么？", "🌟 ¿Qué te gustaría ver en este libro?", "🌟 이 북에 무엇이 있으면 좋겠나요?", "🌟 Bạn mong có gì trong cuốn sổ này?"],
    "Tell us the place you want to see — or the kind of thing you're looking for. Every wish tells us what to add next, and where travelers want a guide. No account, no email needed.": [
        "告诉我们您想去的地方——或您在找哪一类体验。每条心愿都会告诉我们下一步该补什么，以及旅客在哪里需要导游。无需注册，也不用留邮箱。",
        "Dinos el lugar que quieres ver — o el tipo de cosa que buscas. Cada deseo nos indica qué añadir y dónde los viajeros quieren un guía. Sin cuenta ni correo.",
        "가고 싶은 장소나 찾고 있는 유형을 알려주세요. 모든 요청이 다음에 무엇을 추가할지, 여행자가 어디서 가이드를 원하는지 알려줍니다. 계정도 이메일도 필요 없습니다.",
        "Hãy cho chúng tôi biết nơi bạn muốn đến — hoặc loại trải nghiệm bạn tìm. Mỗi mong muốn cho chúng tôi biết nên bổ sung gì tiếp theo và du khách cần hướng dẫn viên ở đâu. Không cần tài khoản hay email."],
    "A place": ["一个地方", "Un lugar", "장소", "Một địa điểm"],
    "Food": ["美食", "Comida", "음식", "Ẩm thực"],
    "An experience": ["一种体验", "Una experiencia", "체험", "Một trải nghiệm"],
    "Add my wish": ["提交我的心愿", "Añadir mi deseo", "내 요청 보내기", "Gửi mong muốn của tôi"],
    "Nothing matches these filters — loosen one and the book fills back up.": ["没有符合这些筛选条件的结果——放宽一项，内容就会重新出现。", "Nada coincide con estos filtros: relaja uno y el libro se llena de nuevo.", "이 조건에 맞는 항목이 없습니다 — 하나만 완화하면 다시 채워집니다.", "Không có kết quả khớp bộ lọc — nới một điều kiện là sổ đầy trở lại."],
    "A free tool by Plateau Strategy Solution Lab · descriptions curated with a professionally licensed tour guide": [
        "Plateau Strategy Solution Lab 出品的免费工具 · 描述内容由持证导游共同编写",
        "Una herramienta gratuita de Plateau Strategy Solution Lab · descripciones elaboradas con un guía con licencia profesional",
        "Plateau Strategy Solution Lab의 무료 도구 · 설명은 전문 자격 가이드와 함께 작성",
        "Công cụ miễn phí của Plateau Strategy Solution Lab · mô tả được biên soạn cùng hướng dẫn viên có giấy phép"],
    "Search the book — or type a new place to suggest & add…": ["搜索手册——或输入一个新地点来推荐并添加…", "Busca en el libro — o escribe un lugar nuevo para sugerirlo y añadirlo…", "북에서 검색 — 또는 새 장소를 입력해 제안·추가하세요…", "Tìm trong sổ — hoặc nhập một nơi mới để đề xuất và thêm…"],

    # ---------------- Road Trip ----------------
    "Road Trip Planner — Plateau Strategy Solution Lab": ["长途自驾规划 — Plateau Strategy Solution Lab", "Planificador de viajes por carretera — Plateau Strategy Solution Lab", "로드트립 플래너 — Plateau Strategy Solution Lab", "Lập kế hoạch đường dài — Plateau Strategy Solution Lab"],
    "Road Trip Planner": ["长途自驾规划", "Planificador de viajes por carretera", "로드트립 플래너", "Lập kế hoạch đường dài"],
    "City day planner": ["城市一日规划", "Planificador de día en la ciudad", "도시 하루 플래너", "Lập lịch một ngày trong thành phố"],
    "← Back to Lab": ["← 返回实验室", "← Volver al Lab", "← 랩으로 돌아가기", "← Về lại Lab"],
    "What's along the way?": ["路上有什么？", "¿Qué hay por el camino?", "가는 길에 무엇이 있나요?", "Trên đường có gì?"],
    "For the long hauls. Give it two points and it finds the fuel, food, rest areas and viewpoints near your actual road — grouped by how many hours in you'll be, so you can plan real breaks instead of scrolling a map.": [
        "专为长途设计。给它两个地点，它会沿着您实际要走的那条路，找出加油站、餐饮、休息区和观景点——并按您开到第几小时分组，让您能真正安排休息，而不是一直划地图。",
        "Para los trayectos largos. Dale dos puntos y encuentra gasolineras, comida, áreas de descanso y miradores junto a tu carretera real, agrupados por las horas que llevarás conduciendo, para que planifiques descansos de verdad en lugar de arrastrar un mapa.",
        "장거리 운전을 위한 기능입니다. 두 지점을 입력하면 실제 주행 경로 근처의 주유소·식당·휴게소·전망대를 찾아, 몇 시간째 지점인지에 따라 묶어 보여줍니다. 지도를 계속 넘기는 대신 진짜 휴식을 계획할 수 있습니다.",
        "Dành cho những chặng dài. Cho hai điểm, công cụ sẽ tìm trạm xăng, đồ ăn, trạm dừng nghỉ và điểm ngắm cảnh gần đúng tuyến đường bạn đi — nhóm theo số giờ đã lái, để bạn lên kế hoạch nghỉ thật sự thay vì kéo bản đồ."],
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
    "Favorite Places — Plateau Strategy Solution Lab": ["最爱的地方 — Plateau Strategy Solution Lab", "Lugares favoritos — Plateau Strategy Solution Lab", "즐겨찾는 장소 — Plateau Strategy Solution Lab", "Địa điểm yêu thích — Plateau Strategy Solution Lab"],
    "❤️ Favorite Places": ["❤️ 最爱的地方", "❤️ Lugares favoritos", "❤️ 즐겨찾는 장소", "❤️ Địa điểm yêu thích"],
    "Search anywhere and tell us your favorite place — it joins the free Destination Book for the next traveler. The more you share, the smarter our map gets.": [
        "搜索世界任何角落，告诉我们您最喜欢的地方——它会被收进免费的目的地手册，留给下一位旅客。您分享得越多，我们的地图就越聪明。",
        "Busca en cualquier parte y cuéntanos tu lugar favorito: se suma al Libro de destinos gratuito para el próximo viajero. Cuanto más compartes, más inteligente se vuelve nuestro mapa.",
        "어디든 검색해 가장 좋아하는 장소를 알려주세요 — 다음 여행자를 위해 무료 여행지 북에 등록됩니다. 많이 나눌수록 지도가 똑똑해집니다.",
        "Tìm bất cứ đâu và cho chúng tôi biết nơi bạn thích nhất — nó sẽ vào Sổ điểm đến miễn phí cho du khách tiếp theo. Bạn chia sẻ càng nhiều, bản đồ càng thông minh."],
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
    "Every place you share is checked against the map for a real location, then written into the Destination Book. No account needed — this takes about 15 seconds.": [
        "您分享的每个地点都会先在地图上核对真实位置，然后写入目的地手册。无需注册——大约 15 秒就好。",
        "Cada lugar que compartes se comprueba en el mapa para confirmar que existe y luego se escribe en el Libro de destinos. Sin cuenta — tarda unos 15 segundos.",
        "공유하신 모든 장소는 지도에서 실제 위치를 확인한 뒤 여행지 북에 기록됩니다. 계정은 필요 없고 약 15초면 됩니다.",
        "Mỗi địa điểm bạn chia sẻ đều được đối chiếu trên bản đồ để xác nhận có thật, rồi ghi vào Sổ điểm đến. Không cần tài khoản — chỉ mất khoảng 15 giây."],
    "Search a place — anywhere in the world…": ["搜索一个地点——世界任何角落…", "Busca un lugar — en cualquier parte del mundo…", "장소 검색 — 전 세계 어디든…", "Tìm một địa điểm — bất cứ đâu trên thế giới…"],
})

EXTRA.update({
    # ---------------- Board of Directors ----------------
    "Board of Directors — Plateau Strategy Solution Lab": ["董事会 — Plateau Strategy Solution Lab", "Junta directiva — Plateau Strategy Solution Lab", "이사회 — Plateau Strategy Solution Lab", "Hội đồng quản trị — Plateau Strategy Solution Lab"],
    "Board of Directors": ["董事会", "Junta directiva", "이사회", "Hội đồng quản trị"],
    "Archive": ["档案库", "Archivo", "아카이브", "Kho lưu trữ"],
    "Private governance vault — for the managing members only. The company's corporate documents and ownership record, kept in one secure place.": [
        "私密治理文件库——仅限管理成员查阅。公司的法人文件与股权记录，统一存放在一个安全之处。",
        "Bóveda de gobernanza privada, solo para los socios gestores. Los documentos corporativos y el registro de propiedad de la empresa, guardados en un único lugar seguro.",
        "비공개 거버넌스 금고 — 운영 구성원 전용. 회사의 법인 문서와 지분 기록을 한 곳에 안전하게 보관합니다.",
        "Kho quản trị riêng tư — chỉ dành cho các thành viên điều hành. Tài liệu pháp nhân và hồ sơ sở hữu của công ty, được giữ ở một nơi an toàn duy nhất."],
    "Managing members only.": ["仅限管理成员。", "Solo socios gestores.", "운영 구성원 전용입니다.", "Chỉ dành cho thành viên điều hành."],
    "Everything here is private corporate governance material — bylaws, agreements, resolutions and contracts. Uploads are archived permanently and never overwritten.": [
        "此处的一切都属于私密的公司治理材料——章程、协议、决议与合同。上传的文件会被永久归档，绝不覆盖。",
        "Todo lo que hay aquí es material privado de gobierno corporativo: estatutos, acuerdos, resoluciones y contratos. Lo que se sube se archiva de forma permanente y nunca se sobrescribe.",
        "이곳의 모든 자료는 비공개 기업 거버넌스 문서입니다 — 정관, 계약, 결의서, 계약서. 업로드된 파일은 영구 보관되며 덮어쓰지 않습니다.",
        "Mọi thứ ở đây là tài liệu quản trị doanh nghiệp riêng tư — điều lệ, thỏa thuận, nghị quyết và hợp đồng. Tệp tải lên được lưu vĩnh viễn và không bao giờ bị ghi đè."],
    "👔 Managing Members": ["👔 管理成员", "👔 Socios gestores", "👔 운영 구성원", "👔 Thành viên điều hành"],
    "Name": ["姓名", "Nombre", "이름", "Tên"],
    "Role": ["职务", "Cargo", "역할", "Vai trò"],
    "Ownership": ["持股", "Participación", "지분", "Sở hữu"],
    "Since": ["加入时间", "Desde", "시작일", "Từ"],
    "No members added yet.": ["尚未添加成员。", "Aún no se han añadido miembros.", "아직 등록된 구성원이 없습니다.", "Chưa thêm thành viên nào."],
    "+ Add member": ["+ 添加成员", "+ Añadir miembro", "+ 구성원 추가", "+ Thêm thành viên"],
    "📁 Governance Vault": ["📁 治理文件库", "📁 Bóveda de gobernanza", "📁 거버넌스 금고", "📁 Kho quản trị"],
    "Bylaws · operating & shareholder agreements · articles of formation · board resolutions · contracts · cap table · tax/EIN. Append-only — every version is kept.": [
        "章程 · 经营与股东协议 · 设立文件 · 董事会决议 · 合同 · 股权结构表 · 税务/EIN。只增不改——每个版本都会保留。",
        "Estatutos · acuerdos operativos y de accionistas · actas de constitución · resoluciones del consejo · contratos · tabla de capitalización · impuestos/EIN. Solo se añade: se conservan todas las versiones.",
        "정관 · 운영 및 주주 계약 · 설립 서류 · 이사회 결의 · 계약서 · 지분표 · 세무/EIN. 추가만 가능 — 모든 버전이 보존됩니다.",
        "Điều lệ · thỏa thuận vận hành và cổ đông · giấy tờ thành lập · nghị quyết hội đồng · hợp đồng · bảng vốn · thuế/EIN. Chỉ thêm mới — mọi phiên bản đều được giữ lại."],
    "⬆ Upload": ["⬆ 上传", "⬆ Subir", "⬆ 업로드", "⬆ Tải lên"],
    "No documents yet — upload your first governance record above.": ["还没有文件——请在上方上传第一份治理记录。", "Aún no hay documentos: sube arriba tu primer registro de gobernanza.", "아직 문서가 없습니다 — 위에서 첫 거버넌스 기록을 올리세요.", "Chưa có tài liệu — hãy tải hồ sơ quản trị đầu tiên ở trên."],
    "Role — e.g. Managing Member": ["职务——例如：管理成员", "Cargo — p. ej. Socio gestor", "역할 — 예: 운영 구성원", "Vai trò — ví dụ: Thành viên điều hành"],
    "Ownership % — e.g. 50": ["持股比例 %——例如：50", "Participación % — p. ej. 50", "지분 % — 예: 50", "Tỷ lệ sở hữu % — ví dụ: 50"],
    "Document title — e.g. Operating Agreement v2": ["文件标题——例如：经营协议 v2", "Título del documento — p. ej. Acuerdo operativo v2", "문서 제목 — 예: 운영 계약 v2", "Tên tài liệu — ví dụ: Thỏa thuận vận hành v2"],
    "Notes (optional)": ["备注（选填）", "Notas (opcional)", "메모 (선택)", "Ghi chú (tùy chọn)"],

    # ---------------- Archive ----------------
    "Archive — Plateau Strategy Solution Lab": ["档案库 — Plateau Strategy Solution Lab", "Archivo — Plateau Strategy Solution Lab", "아카이브 — Plateau Strategy Solution Lab", "Kho lưu trữ — Plateau Strategy Solution Lab"],
    "Books": ["账目", "Contabilidad", "장부", "Sổ sách"],
    "One place that keeps every paper trail the site produces — bookings, your customer contact list, signed agreements, uploaded paperwork, leads, partners and more. Private, owner only.": [
        "一个地方保存网站产生的全部纸面记录——订单、客户联系名单、已签协议、上传的文件、潜在客户、合作方等等。私密，仅限所有者查看。",
        "Un solo lugar que guarda todo el rastro documental del sitio: reservas, tu lista de contactos de clientes, acuerdos firmados, documentación subida, prospectos, socios y más. Privado, solo para el propietario.",
        "사이트가 만들어내는 모든 서류 기록을 한곳에 보관합니다 — 예약, 고객 연락처 목록, 서명된 계약, 업로드된 문서, 리드, 파트너 등. 비공개이며 소유자만 볼 수 있습니다.",
        "Một nơi lưu mọi dấu vết giấy tờ mà trang tạo ra — đặt chỗ, danh sách liên hệ khách hàng, thỏa thuận đã ký, hồ sơ tải lên, khách tiềm năng, đối tác và hơn thế. Riêng tư, chỉ chủ sở hữu."],
    "← All archives": ["← 全部档案", "← Todos los archivos", "← 전체 아카이브", "← Tất cả kho lưu trữ"],
    "This is your advertising list.": ["这是您的广告投放名单。", "Esta es tu lista de publicidad.", "이것이 광고용 명단입니다.", "Đây là danh sách quảng cáo của bạn."],
    "Every email and phone your site has ever captured — booking customers, account holders, finance leads, waitlists and partner contacts — de-duplicated. Export it to CSV and load it straight into your ad platform (Google/Meta customer match, Mailchimp, etc.). Only market to people per your privacy policy & applicable law.": [
        "网站收集过的所有邮箱和电话——下单客户、账户持有人、金融意向客户、候补名单和合作方联系人——已去重。可导出 CSV，直接导入广告平台（Google/Meta 客户匹配、Mailchimp 等）。请务必在隐私政策和适用法律允许的范围内进行营销。",
        "Todos los correos y teléfonos que tu sitio ha captado —clientes con reserva, titulares de cuenta, prospectos de finanzas, listas de espera y contactos de socios— sin duplicados. Expórtalo a CSV y cárgalo directamente en tu plataforma publicitaria (customer match de Google/Meta, Mailchimp, etc.). Haz marketing solo conforme a tu política de privacidad y la ley aplicable.",
        "사이트가 수집한 모든 이메일과 전화번호 — 예약 고객, 계정 보유자, 금융 리드, 대기자 명단, 파트너 연락처 — 를 중복 없이 모았습니다. CSV로 내보내 광고 플랫폼(Google/Meta 고객 매칭, Mailchimp 등)에 바로 올릴 수 있습니다. 개인정보 처리방침과 관련 법률이 허용하는 범위에서만 마케팅하세요.",
        "Mọi email và số điện thoại trang đã thu thập — khách đặt chỗ, chủ tài khoản, khách tiềm năng tài chính, danh sách chờ và liên hệ đối tác — đã loại trùng. Xuất ra CSV và nạp thẳng vào nền tảng quảng cáo (customer match của Google/Meta, Mailchimp, v.v.). Chỉ tiếp thị theo đúng chính sách bảo mật và luật hiện hành."],
    "⬇️ Export CSV": ["⬇️ 导出 CSV", "⬇️ Exportar CSV", "⬇️ CSV 내보내기", "⬇️ Xuất CSV"],
    "Nothing here yet — records appear automatically as they happen.": ["这里还没有内容——有记录产生时会自动出现。", "Aún no hay nada: los registros aparecen automáticamente a medida que ocurren.", "아직 아무것도 없습니다 — 기록이 발생하면 자동으로 표시됩니다.", "Chưa có gì ở đây — bản ghi sẽ tự xuất hiện khi phát sinh."],
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
    "Affordable Tesla rentals turn everyday drivers into earners and riders into owners — the first loop in a closed system where revenue compounds instead of leaking away.": [
        "平价特斯拉租赁让普通司机开始赚钱，也让乘客变成车主——这是闭环系统的第一环，收入在其中不断复利，而不是白白流走。",
        "El alquiler asequible de Teslas convierte a conductores corrientes en generadores de ingresos y a los pasajeros en propietarios: el primer bucle de un sistema cerrado donde los ingresos se componen en lugar de escaparse.",
        "합리적인 가격의 테슬라 렌털은 평범한 운전자를 수익자로, 승객을 소유자로 만듭니다 — 수익이 새어 나가지 않고 복리로 쌓이는 닫힌 시스템의 첫 번째 고리입니다.",
        "Cho thuê Tesla với giá phải chăng biến tài xế bình thường thành người kiếm tiền và hành khách thành chủ sở hữu — vòng đầu tiên trong một hệ thống khép kín nơi doanh thu tích lũy thay vì rò rỉ."],
    "Explore the model": ["了解这套模式", "Explora el modelo", "모델 살펴보기", "Khám phá mô hình"],
    "Business verticals": ["业务板块", "Verticales de negocio", "사업 부문", "Mảng kinh doanh"],
    "Value chain owned": ["自有价值链占比", "Cadena de valor propia", "자체 보유 가치사슬", "Chuỗi giá trị tự sở hữu"],
    "Ride availability": ["用车可用度", "Disponibilidad de viajes", "차량 이용 가능성", "Khả năng có xe"],
    "THE MODEL": ["这套模式", "EL MODELO", "모델", "MÔ HÌNH"],
    "One ecosystem. Every part funds the next.": ["一个生态。每一环都为下一环提供资金。", "Un ecosistema. Cada parte financia la siguiente.", "하나의 생태계. 각 부분이 다음을 뒷받침합니다.", "Một hệ sinh thái. Mỗi phần nuôi phần kế tiếp."],
    "We control the full value chain and share the upside with drivers and partners — so revenue compounds across transportation, real estate, and finance instead of leaking away.": [
        "我们掌握完整的价值链，并把收益与司机和合作方共享——因此收入在交通、房地产和金融之间不断复利，而不是白白流走。",
        "Controlamos toda la cadena de valor y compartimos las ganancias con conductores y socios, de modo que los ingresos se componen entre transporte, inmobiliaria y finanzas en lugar de escaparse.",
        "우리는 가치사슬 전체를 직접 운영하고 그 이익을 기사·파트너와 나눕니다 — 그래서 수익이 교통·부동산·금융을 오가며 새어 나가지 않고 복리로 쌓입니다.",
        "Chúng tôi kiểm soát trọn chuỗi giá trị và chia lợi ích với tài xế cùng đối tác — nhờ vậy doanh thu tích lũy qua vận tải, bất động sản và tài chính thay vì rò rỉ ra ngoài."],
    "Capital Efficient": ["资本高效", "Eficiente en capital", "자본 효율", "Hiệu quả vốn"],
    "Each part funds the next through shared cash flow and operational leverage — capital works harder across the whole system.": [
        "各环节通过共享现金流和运营杠杆为下一环提供资金——资本在整个系统里被用得更充分。",
        "Cada parte financia la siguiente mediante flujo de caja compartido y apalancamiento operativo: el capital rinde más en todo el sistema.",
        "각 부분이 공유 현금흐름과 운영 레버리지로 다음 부분을 뒷받침합니다 — 자본이 시스템 전체에서 더 열심히 일합니다.",
        "Mỗi phần nuôi phần kế tiếp nhờ dòng tiền chung và đòn bẩy vận hành — vốn làm việc hiệu quả hơn trên toàn hệ thống."],
    "Vertically Integrated": ["垂直整合", "Integración vertical", "수직 통합", "Tích hợp dọc"],
    "Full control over the supply chain, client experience, and margin capture, end to end — no middlemen skimming value.": [
        "从头到尾完全掌控供应链、客户体验和利润留存——没有中间商抽成。",
        "Control total de la cadena de suministro, la experiencia del cliente y el margen, de principio a fin: sin intermediarios que se lleven valor.",
        "공급망, 고객 경험, 마진 확보를 처음부터 끝까지 직접 관리합니다 — 중간에서 가치를 떼어가는 사람이 없습니다.",
        "Kiểm soát trọn vẹn chuỗi cung ứng, trải nghiệm khách hàng và biên lợi nhuận, từ đầu đến cuối — không có trung gian ăn bớt giá trị."],
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
        "우리는 시장을 검증하며 출시를 준비하고 있습니다. 초기 파트너, 투자자, 팀원이 성공의 핵심입니다.",
        "Chúng tôi đang kiểm chứng thị trường và chuẩn bị ra mắt. Các đối tác, nhà đầu tư và thành viên đầu tiên là yếu tố quyết định."],
    "For travelers & tour guides — free map planning": ["为旅客和导游打造——免费地图规划", "Para viajeros y guías — planificación gratuita en el mapa", "여행자와 가이드를 위한 무료 지도 플래닝", "Dành cho du khách & hướng dẫn viên — lập kế hoạch trên bản đồ miễn phí"],
    "Plan a real day on the map: every stop lights up or dims by drive time, traffic and closing hours. Guides build and name their own routes here — no website needed — and travelers who'd rather not drive it themselves can hand the route to a guide.": [
        "在地图上规划真实的一天：每一站都会依据车程、路况和关门时间自动变亮或变暗。导游可以在这里搭建并命名自己的路线——不需要自建网站——不想自己开车的旅客，也可以把路线直接交给导游。",
        "Planifica un día real sobre el mapa: cada parada se ilumina o se atenúa según el tiempo de viaje, el tráfico y la hora de cierre. Los guías crean y nombran aquí sus propias rutas —sin necesidad de web— y los viajeros que prefieren no conducir pueden entregar la ruta a un guía.",
        "지도 위에서 진짜 하루를 계획하세요: 각 방문지가 이동 시간·교통·마감 시간에 따라 밝아지거나 흐려집니다. 가이드는 별도 웹사이트 없이 이곳에서 자신의 코스를 만들고 이름 붙일 수 있고, 직접 운전하고 싶지 않은 여행자는 그 코스를 가이드에게 맡길 수 있습니다.",
        "Lên kế hoạch cho một ngày thật trên bản đồ: mỗi điểm dừng sáng lên hoặc mờ đi theo thời gian lái, giao thông và giờ đóng cửa. Hướng dẫn viên tạo và đặt tên lộ trình riêng ngay tại đây — không cần website — còn du khách không muốn tự lái có thể giao lộ trình cho hướng dẫn viên."],
    "Open Trip Planner →": ["打开行程规划 →", "Abrir el planificador →", "여행 플래너 열기 →", "Mở công cụ lập kế hoạch →"],
    "For everyone — free, and growing": ["人人可用——免费，且在不断丰富", "Para todos — gratis y en crecimiento", "누구나 — 무료이며 계속 늘어납니다", "Cho mọi người — miễn phí và ngày càng lớn"],
    "Every attraction and restaurant we know, city by city, with local tips from a licensed guide. It grows on its own: search a place in the planner and it's written into the book for the next traveler. One tap sends anything straight into your trip.": [
        "我们知道的每一处景点和餐厅，按城市整理，附持证导游的本地贴士。它会自己长大：在规划工具里搜索一个地点，它就会被写进手册，留给下一位旅客。一键即可把任何地点加进您的行程。",
        "Cada atracción y restaurante que conocemos, ciudad por ciudad, con consejos locales de un guía con licencia. Crece solo: busca un lugar en el planificador y queda escrito en el libro para el próximo viajero. Con un toque lo envías directo a tu viaje.",
        "우리가 아는 모든 명소와 식당을 도시별로, 자격을 갖춘 가이드의 현지 팁과 함께 정리했습니다. 스스로 자랍니다: 플래너에서 장소를 검색하면 다음 여행자를 위해 북에 기록됩니다. 한 번만 누르면 바로 일정에 들어갑니다.",
        "Mọi điểm tham quan và nhà hàng chúng tôi biết, theo từng thành phố, kèm mẹo bản địa từ hướng dẫn viên có giấy phép. Nó tự lớn lên: tìm một địa điểm trong công cụ lập kế hoạch là nó được ghi vào sổ cho du khách kế tiếp. Một chạm là đưa thẳng vào chuyến đi của bạn."],
    "Open the Book →": ["打开手册 →", "Abrir el libro →", "북 열기 →", "Mở sổ →"],
    "🚧 Under Development": ["🚧 开发中", "🚧 En desarrollo", "🚧 개발 중", "🚧 Đang phát triển"],
    "● WORK IN PROGRESS": ["● 建设中", "● TRABAJO EN CURSO", "● 진행 중", "● ĐANG THỰC HIỆN"],
    "★ ★ ★ DO YOUR PART ★ ★ ★": ["★ ★ ★ 尽一份力 ★ ★ ★", "★ ★ ★ PON DE TU PARTE ★ ★ ★", "★ ★ ★ 당신의 몫을 ★ ★ ★", "★ ★ ★ GÓP PHẦN CỦA BẠN ★ ★ ★"],
    "When you make it, give a little back.": ["等您做起来了，回馈一点点。", "Cuando te vaya bien, devuelve un poco.", "잘되셨을 때, 조금만 돌려주세요.", "Khi bạn thành công, hãy cho lại một chút."],
    "give something to your country.": ["为您的国家做点什么。", "da algo a tu país.", "당신의 나라에 무언가를 나누세요.", "hãy cho đất nước bạn một điều gì đó."],
    "You give directly to the U.S. Treasury.": ["您的钱直接交给美国财政部。", "Donas directamente al Tesoro de EE. UU.", "미국 재무부에 직접 기부하게 됩니다.", "Bạn tặng trực tiếp cho Bộ Tài chính Hoa Kỳ."],
    "The federal government runs a real program for this —": ["联邦政府为此设有一个正式项目——", "El gobierno federal tiene un programa real para esto:", "연방 정부가 이를 위한 공식 프로그램을 운영합니다 —", "Chính phủ liên bang có một chương trình chính thức cho việc này —"],
    ", at the Bureau of the Fiscal Service. Card, bank, or PayPal on Pay.gov.": ["，由财政服务局负责。可在 Pay.gov 使用银行卡、银行账户或 PayPal。", ", en el Bureau of the Fiscal Service. Tarjeta, banco o PayPal en Pay.gov.", " — 재무서비스국이 담당합니다. Pay.gov에서 카드·계좌·PayPal로 가능합니다.", ", tại Bureau of the Fiscal Service. Thẻ, ngân hàng hoặc PayPal trên Pay.gov."],
    "We never touch the money.": ["这笔钱我们碰都不碰。", "Nosotros nunca tocamos el dinero.", "저희는 그 돈에 손대지 않습니다.", "Chúng tôi không bao giờ chạm vào khoản tiền đó."],
    "No account of ours is involved, no cut, no processing, nothing held. The button below leaves this site and lands on the government's own payment page.": [
        "不经过我们的任何账户，不抽成，不代收，不留存。点下面的按钮会离开本站，直接进入政府自己的支付页面。",
        "No interviene ninguna cuenta nuestra, sin comisión, sin procesamiento, sin retener nada. El botón de abajo sale de este sitio y llega a la página de pago del propio gobierno.",
        "저희 계좌는 전혀 관여하지 않으며, 수수료도 처리도 보관도 없습니다. 아래 버튼을 누르면 이 사이트를 떠나 정부의 결제 페이지로 이동합니다.",
        "Không tài khoản nào của chúng tôi tham gia, không hoa hồng, không xử lý, không giữ lại gì. Nút bên dưới sẽ rời khỏi trang này và tới thẳng trang thanh toán của chính phủ."],
    "Then come back and tell us.": ["然后回来告诉我们一声。", "Luego vuelve y cuéntanoslo.", "그런 다음 돌아와 알려주세요.", "Rồi quay lại và cho chúng tôi biết."],
    "That's what moves the green zero at the top of this page — the number that counts what this community has given back.": [
        "这才会让页面顶部那个绿色的零动起来——它记录着这个社区一共回馈了多少。",
        "Eso es lo que mueve el cero verde en la parte superior de esta página: el número que cuenta lo que esta comunidad ha devuelto.",
        "그래야 이 페이지 맨 위의 초록색 0이 움직입니다 — 이 커뮤니티가 돌려준 총액을 세는 숫자입니다.",
        "Đó là điều làm con số 0 màu xanh ở đầu trang này nhúc nhích — con số đếm những gì cộng đồng này đã cho lại."],
    "Prefer a check? Make it payable to the": ["更想寄支票？收款人写", "¿Prefieres un cheque? Hazlo a nombre de", "수표를 원하시나요? 수취인은", "Thích gửi séc? Ghi người nhận là"],
    ", write": ["，在备注栏写上", ", escribe", ", 메모란에는", ", ghi"],
    "“gift to reduce the debt held by the public”": ["“gift to reduce the debt held by the public”", "«gift to reduce the debt held by the public»", "“gift to reduce the debt held by the public”", "“gift to reduce the debt held by the public”"],
    "in the memo, and mail to:": ["然后寄往：", "en el concepto, y envíalo a:", "라고 적어 아래 주소로 보내세요:", "vào phần ghi chú, và gửi tới:"],
    "I gave — count it": ["我捐了——请计入", "He donado — cuéntalo", "기부했어요 — 반영해 주세요", "Tôi đã tặng — hãy tính vào"],
    "Self-reported, on your honor. We can't verify a payment we deliberately never see — and we'd rather be honest about that than fake a number.": [
        "全凭自觉申报。我们刻意不去看这笔付款，因此无法核实——与其编一个数字，不如把话说清楚。",
        "Es autodeclarado, por tu palabra. No podemos verificar un pago que deliberadamente nunca vemos, y preferimos decirlo con franqueza antes que inventar una cifra.",
        "본인 신고 방식입니다. 저희는 의도적으로 결제를 보지 않으므로 확인할 수 없습니다 — 숫자를 꾸미기보다 솔직히 밝히는 편을 택했습니다.",
        "Tự khai báo, dựa trên sự trung thực của bạn. Chúng tôi cố ý không nhìn thấy khoản thanh toán nên không thể xác minh — và thà nói thẳng còn hơn bịa ra một con số."],
    "Move the zero →": ["让这个零动起来 →", "Mueve el cero →", "0을 움직이기 →", "Làm con số 0 nhúc nhích →"],
    "💡 Business Ideas": ["💡 商业点子", "💡 Ideas de negocio", "💡 사업 아이디어", "💡 Ý tưởng kinh doanh"],
    "✍️ Pitch a business idea": ["✍️ 提出一个商业点子", "✍️ Propón una idea de negocio", "✍️ 사업 아이디어 제안하기", "✍️ Đề xuất một ý tưởng kinh doanh"],
    "Publish idea": ["发布点子", "Publicar idea", "아이디어 게시", "Đăng ý tưởng"],
    "No ideas posted yet — be the first to pitch one.": ["还没有人提出点子——来当第一个。", "Aún no hay ideas: sé el primero en proponer una.", "아직 등록된 아이디어가 없습니다 — 첫 번째가 되어 보세요.", "Chưa có ý tưởng nào — hãy là người đầu tiên."],
    "invest": ["投资", "invertir", "투자", "đầu tư"],
    "launch and run it": ["启动并经营它", "lanzarla y dirigirla", "직접 시작해 운영", "khởi động và điều hành"],
    "Anyone can pitch a business idea here — free, no account needed. Readers back an idea one of two ways: register to": [
        "任何人都可以在这里提出商业点子——免费，无需注册。读者可以用两种方式支持一个点子：登记",
        "Cualquiera puede proponer aquí una idea de negocio: gratis y sin cuenta. Los lectores la respaldan de dos maneras: registrarse para",
        "누구나 여기에 사업 아이디어를 제안할 수 있습니다 — 무료이고 계정도 필요 없습니다. 독자는 두 가지 방법으로 아이디어를 지지합니다:",
        "Ai cũng có thể đề xuất ý tưởng kinh doanh tại đây — miễn phí, không cần tài khoản. Người đọc ủng hộ một ý tưởng theo hai cách: đăng ký để"],
    ", or register to": ["，或登记", ", o registrarse para", " 하거나", ", hoặc đăng ký để"],
    ". This is a connections board, not a transaction — no money or equity changes hands on this page; Plateau Strategy follows up directly with anyone who registers interest.": [
        "。这是一个牵线的板块，不是交易平台——本页面不涉及任何资金或股权转手；Plateau Strategy 会直接联系每一位登记意向的人。",
        ". Este es un tablón de conexiones, no una transacción: en esta página no cambia de manos dinero ni participación; Plateau Strategy contacta directamente con quien registre su interés.",
        ". 이곳은 연결을 위한 게시판이지 거래 장소가 아닙니다 — 이 페이지에서 돈이나 지분이 오가지 않으며, 관심을 등록한 분께는 Plateau Strategy가 직접 연락드립니다.",
        ". Đây là bảng kết nối, không phải giao dịch — không có tiền hay cổ phần đổi chủ trên trang này; Plateau Strategy sẽ liên hệ trực tiếp với người đăng ký quan tâm."],
    "Practical tools for everyday life — built by our lab, free for everyone. No account, no cost.": [
        "面向日常生活的实用工具——由我们实验室打造，对所有人免费。无需注册，也不收费。",
        "Herramientas prácticas para el día a día, creadas por nuestro laboratorio y gratuitas para todos. Sin cuenta y sin coste.",
        "일상에 쓰는 실용 도구 — 저희 랩이 만들었고 누구에게나 무료입니다. 계정도 비용도 필요 없습니다.",
        "Công cụ thiết thực cho cuộc sống hằng ngày — do lab của chúng tôi làm, miễn phí cho tất cả. Không tài khoản, không chi phí."],
    "● LIVE": ["● 实时", "● EN VIVO", "● 실시간", "● TRỰC TIẾP"],
    "Newest discoveries": ["最新发现", "Descubrimientos más recientes", "최신 발견", "Khám phá mới nhất"],
    "Search any place — if the map does not know it yet, you discover it →": [
        "搜索任何地点——如果地图还不认识它，那就是您发现的 →",
        "Busca cualquier lugar: si el mapa aún no lo conoce, lo descubres tú →",
        "어떤 장소든 검색해 보세요 — 지도가 아직 모른다면 당신이 발견한 것입니다 →",
        "Tìm bất kỳ nơi nào — nếu bản đồ chưa biết, chính bạn là người khám phá ra →"],
    "Guided Trips": ["导览行程", "Viajes guiados", "가이드 투어", "Chuyến có hướng dẫn"],
    "For travellers & the guides who run them": ["为旅客和带团导游打造", "Para viajeros y los guías que los realizan", "여행자와 이를 진행하는 가이드를 위해", "Dành cho du khách & những hướng dẫn viên dẫn tour"],
    "In-depth trips written by the guides themselves — a student's hour in Harvard Yard, a food route through one neighborhood — with every stop and how long you stand there, before you book. Guides list their own for free.": [
        "由导游亲手写下的深度行程——哈佛校园里的学生一小时，一个街区里的美食路线——每一站以及在那里停留多久，下单前都看得清清楚楚。导游可免费发布自己的行程。",
        "Viajes a fondo escritos por los propios guías: la hora de un estudiante en Harvard Yard, una ruta gastronómica por un barrio, con cada parada y cuánto tiempo estarás allí, antes de reservar. Los guías publican los suyos gratis.",
        "가이드가 직접 쓴 심층 일정 — 하버드 야드에서 학생과 보내는 한 시간, 한 동네를 훑는 음식 코스 — 예약 전에 모든 방문지와 머무는 시간을 볼 수 있습니다. 가이드는 무료로 등록합니다.",
        "Những hành trình chuyên sâu do chính hướng dẫn viên viết — một giờ cùng sinh viên trong khuôn viên Harvard, một tuyến ẩm thực qua một khu phố — với từng điểm dừng và thời gian ở đó, trước khi bạn đặt. Hướng dẫn viên đăng miễn phí."],
    "Browse Guided Trips →": ["浏览导览行程 →", "Ver viajes guiados →", "가이드 투어 둘러보기 →", "Xem các chuyến có hướng dẫn →"],
    "For drivers, tour guides & tourists": ["为司机、导游和游客打造", "Para conductores, guías y turistas", "기사·가이드·여행자를 위해", "Dành cho tài xế, hướng dẫn viên & du khách"],
    "Pick your attractions and see which ones you can still reach in time — drive time, traffic and closing hours all checked. Every tap builds your day-one, day-two plan. Designed with a professionally licensed tour guide.": [
        "挑好景点，立刻看出哪些还赶得及——车程、路况和关门时间全都算进去了。您每点一下，第一天、第二天的计划就成形一分。由持证导游共同设计。",
        "Elige tus atracciones y ve cuáles te da tiempo a alcanzar: se comprueban el tiempo de viaje, el tráfico y los horarios de cierre. Cada toque construye tu plan del primer y segundo día. Diseñado junto a un guía con licencia profesional.",
        "명소를 고르면 아직 시간 안에 갈 수 있는 곳이 바로 보입니다 — 이동 시간, 교통, 마감 시간까지 모두 확인합니다. 누를 때마다 첫날·둘째 날 일정이 만들어집니다. 전문 자격 가이드와 함께 설계했습니다.",
        "Chọn các điểm tham quan và thấy ngay nơi nào còn kịp đến — thời gian lái, giao thông và giờ đóng cửa đều được kiểm tra. Mỗi lần chạm là kế hoạch ngày một, ngày hai thành hình. Được thiết kế cùng hướng dẫn viên có giấy phép."],
    "For the long hauls — free": ["为长途而生——免费", "Para los trayectos largos — gratis", "장거리 운전을 위해 — 무료", "Dành cho chặng dài — miễn phí"],
    "Staten Island to Niagara Falls, or any long drive. Give it two points and it finds the fuel, food, rest areas and viewpoints near your actual road — grouped by how many hours in you'll be, so you can plan real breaks instead of scrolling a map.": [
        "从斯塔滕岛到尼亚加拉大瀑布，或任何一段长途。给它两个点，它就会沿着您真正要走的路找出加油站、餐饮、休息区和观景点——并按开到第几小时分组，让您能真正安排休息，而不是一直划地图。",
        "De Staten Island a las cataratas del Niágara, o cualquier trayecto largo. Dale dos puntos y encontrará gasolineras, comida, áreas de descanso y miradores junto a tu carretera real, agrupados por las horas que llevarás conduciendo, para planificar descansos de verdad en vez de arrastrar un mapa.",
        "스태튼아일랜드에서 나이아가라 폭포까지, 또는 어떤 장거리 주행이든. 두 지점을 주면 실제 경로 근처의 주유소·식당·휴게소·전망대를 찾아 몇 시간째인지에 따라 묶어 줍니다. 지도를 넘기는 대신 진짜 휴식을 계획하세요.",
        "Từ Staten Island tới thác Niagara, hay bất kỳ chặng dài nào. Cho hai điểm, nó sẽ tìm trạm xăng, đồ ăn, trạm nghỉ và điểm ngắm cảnh gần đúng tuyến đường bạn đi — nhóm theo số giờ đã lái, để bạn lên kế hoạch nghỉ thật sự thay vì kéo bản đồ."],
    "Plan a road trip →": ["规划一次长途自驾 →", "Planea un viaje por carretera →", "로드트립 계획하기 →", "Lên kế hoạch chuyến đường dài →"],
    "For tourists & trip planning": ["为游客和行程规划打造", "Para turistas y planificación de viajes", "여행자와 일정 계획을 위해", "Dành cho du khách & lập kế hoạch chuyến đi"],
    "A curated guidebook of attractions and restaurants — every type of destination, organized by category, with descriptions and local tips. One tap sends any place into the Trip Planner.": [
        "一本精选的景点与餐厅指南——各类目的地按类别整理，附描述与本地贴士。一键即可把任意地点送入行程规划。",
        "Una guía curada de atracciones y restaurantes: todo tipo de destinos, organizados por categoría, con descripciones y consejos locales. Con un toque envías cualquier lugar al planificador.",
        "엄선한 명소·식당 안내서 — 모든 유형의 여행지를 분류별로 정리하고 설명과 현지 팁을 담았습니다. 한 번만 누르면 여행 플래너로 들어갑니다.",
        "Cẩm nang tuyển chọn điểm tham quan và nhà hàng — mọi loại điểm đến, sắp theo danh mục, kèm mô tả và mẹo bản địa. Một chạm là đưa vào công cụ lập kế hoạch."],
    "The Factor Clock": ["因子时钟", "El Reloj de Factores", "팩터 클록", "Đồng hồ Nhân tố"],
    "For anyone who wants an honest forecast": ["献给想要一个诚实预测的人", "Para quien quiera un pronóstico honesto", "정직한 예측을 원하는 모든 이에게", "Dành cho ai muốn một dự báo trung thực"],
    "A prediction clock that never lies to you — weather, markets, your own patterns, every forecast scored against what actually happened. It tells you when it doesn't know. Free while it earns its record ($10/year value).": [
        "一个从不骗您的预测时钟——天气、市场、您自己的规律，每一次预测都拿真实结果来打分。不知道的时候，它会直说。在它积累战绩期间免费（价值每年 10 美元）。",
        "Un reloj de predicción que nunca te miente: clima, mercados, tus propios patrones, y cada pronóstico puntuado contra lo que realmente ocurrió. Te dice cuándo no lo sabe. Gratis mientras se gana su historial (valor de 10 $/año).",
        "결코 거짓말하지 않는 예측 시계 — 날씨, 시장, 당신의 패턴까지, 모든 예측을 실제 결과와 대조해 채점합니다. 모를 때는 모른다고 말합니다. 실적을 쌓는 동안 무료입니다(연 10달러 상당).",
        "Một chiếc đồng hồ dự báo không bao giờ nói dối bạn — thời tiết, thị trường, thói quen của chính bạn, mọi dự báo đều được chấm điểm dựa trên điều đã thực sự xảy ra. Nó nói thẳng khi không biết. Miễn phí trong lúc tạo dựng thành tích (trị giá 10 $/năm)."],
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
    "The rules that protect you when you use this site — your data, your money, and your bookings. These are the safeguards that are already in place, in plain language.": [
        "您使用本站时保护您的规则——您的数据、您的钱、您的订单。以下是已经就位的保障措施，用大白话写清楚。",
        "Las reglas que te protegen al usar este sitio: tus datos, tu dinero y tus reservas. Estas son las salvaguardas que ya están en marcha, en lenguaje claro.",
        "이 사이트를 이용할 때 당신을 보호하는 규칙 — 당신의 데이터, 돈, 예약. 이미 적용 중인 안전장치를 쉬운 말로 적었습니다.",
        "Những quy tắc bảo vệ bạn khi dùng trang này — dữ liệu, tiền và các đặt chỗ của bạn. Đây là những biện pháp đã có sẵn, viết bằng ngôn ngữ dễ hiểu."],
    "Owner-only vaults": ["仅所有者可进的保险库", "Bóvedas solo para el propietario", "소유자 전용 금고", "Kho chỉ chủ sở hữu vào được"],
    "Financials · customer records · board documents": ["财务 · 客户记录 · 董事会文件", "Finanzas · registros de clientes · documentos del consejo", "재무 · 고객 기록 · 이사회 문서", "Tài chính · hồ sơ khách hàng · tài liệu hội đồng"],
    "The money records, customer information and governance documents are locked behind a private owner login. No one reaches them without those credentials.": [
        "资金记录、客户信息和治理文件都锁在所有者的私人登录之后。没有这套凭证，谁也进不去。",
        "Los registros de dinero, la información de clientes y los documentos de gobernanza están tras un acceso privado del propietario. Nadie llega a ellos sin esas credenciales.",
        "자금 기록, 고객 정보, 거버넌스 문서는 소유자 전용 로그인 뒤에 잠겨 있습니다. 해당 자격 증명 없이는 누구도 접근할 수 없습니다.",
        "Hồ sơ tiền bạc, thông tin khách hàng và tài liệu quản trị đều nằm sau đăng nhập riêng của chủ sở hữu. Không ai chạm tới được nếu không có thông tin đăng nhập đó."],
    "Secrets stay secret": ["密钥始终保密", "Los secretos siguen siendo secretos", "비밀은 비밀로", "Bí mật vẫn là bí mật"],
    "Keys, tokens & passwords": ["密钥、令牌与密码", "Claves, tokens y contraseñas", "키, 토큰, 비밀번호", "Khóa, token & mật khẩu"],
    "API keys, tokens and passwords live in encrypted server configuration — never in your browser, never shown on a page, never committed to our code.": [
        "API 密钥、令牌和密码都存放在加密的服务器配置中——绝不进入您的浏览器，绝不显示在页面上，也绝不写进我们的代码。",
        "Las claves de API, los tokens y las contraseñas viven en la configuración cifrada del servidor: nunca en tu navegador, nunca visibles en una página, nunca en nuestro código.",
        "API 키, 토큰, 비밀번호는 암호화된 서버 설정에 저장됩니다 — 브라우저에 들어가지 않고, 페이지에 표시되지 않으며, 코드에 커밋되지도 않습니다.",
        "Khóa API, token và mật khẩu nằm trong cấu hình máy chủ được mã hóa — không bao giờ vào trình duyệt, không hiển thị trên trang, không được đưa vào mã nguồn."],
    "Payment safety": ["支付安全", "Seguridad en los pagos", "결제 안전", "An toàn thanh toán"],
    "Every checkout": ["每一次结账", "Cada pago", "모든 결제", "Mọi lần thanh toán"],
    "Payments run through Square's PCI-compliant system. We never see or store your full card number — the sensitive part never touches our servers.": [
        "支付通过 Square 符合 PCI 标准的系统完成。我们从不查看也不保存您的完整卡号——敏感部分从不经过我们的服务器。",
        "Los pagos se procesan mediante el sistema de Square, conforme a PCI. Nunca vemos ni guardamos tu número completo de tarjeta: la parte sensible jamás toca nuestros servidores.",
        "결제는 Square의 PCI 준수 시스템을 통해 처리됩니다. 저희는 전체 카드번호를 보거나 저장하지 않으며, 민감한 부분은 서버에 닿지 않습니다.",
        "Thanh toán chạy qua hệ thống đạt chuẩn PCI của Square. Chúng tôi không bao giờ thấy hay lưu số thẻ đầy đủ của bạn — phần nhạy cảm không chạm tới máy chủ của chúng tôi."],
    "We never hold your money": ["我们从不代管您的钱", "Nunca retenemos tu dinero", "저희는 당신의 돈을 보관하지 않습니다", "Chúng tôi không bao giờ giữ tiền của bạn"],
    "Bookings · guide & driver payouts": ["订单 · 导游与司机结算", "Reservas · pagos a guías y conductores", "예약 · 가이드 및 기사 정산", "Đặt chỗ · chi trả cho hướng dẫn viên & tài xế"],
    "We invoice for our own service and never hold a customer's funds in escrow. Every payout to a driver or guide takes an explicit owner approval — money never moves on its own.": [
        "我们只为自己的服务开具账单，绝不代管客户的资金。每一笔付给司机或导游的款项都需要所有者明确批准——钱不会自己动。",
        "Facturamos por nuestro propio servicio y nunca retenemos fondos del cliente en depósito. Cada pago a un conductor o guía requiere la aprobación explícita del propietario: el dinero nunca se mueve solo.",
        "저희는 자사 서비스에 대해서만 청구하며 고객 자금을 예치하지 않습니다. 기사나 가이드에게 나가는 모든 정산은 소유자의 명시적 승인이 필요합니다 — 돈이 저절로 움직이지 않습니다.",
        "Chúng tôi chỉ xuất hóa đơn cho dịch vụ của mình và không bao giờ giữ tiền khách trong ký quỹ. Mỗi khoản chi cho tài xế hay hướng dẫn viên đều cần chủ sở hữu phê duyệt rõ ràng — tiền không tự chuyển đi."],
    "Your data stays yours": ["您的数据仍属于您", "Tus datos siguen siendo tuyos", "당신의 데이터는 당신의 것", "Dữ liệu của bạn vẫn là của bạn"],
    "The free tools": ["这些免费工具", "Las herramientas gratuitas", "무료 도구", "Các công cụ miễn phí"],
    "The Trip Planner and Destination Book store only place names and typical visit times — no personal tracking. Your planned trip stays on your own device until you choose to book.": [
        "行程规划和目的地手册只保存地点名称和常见停留时间——不做个人追踪。在您决定下单之前，您排好的行程只留在自己的设备上。",
        "El planificador y el Libro de destinos solo guardan nombres de lugares y tiempos típicos de visita: sin seguimiento personal. Tu viaje planificado permanece en tu dispositivo hasta que decidas reservar.",
        "여행 플래너와 여행지 북은 장소 이름과 통상 관람 시간만 저장합니다 — 개인 추적은 없습니다. 예약을 선택하기 전까지 계획한 일정은 당신 기기에만 남습니다.",
        "Công cụ lập kế hoạch và Sổ điểm đến chỉ lưu tên địa điểm và thời gian ghé thăm thông thường — không theo dõi cá nhân. Hành trình bạn lên vẫn nằm trên thiết bị của bạn cho tới khi bạn quyết định đặt."],
    "Give-back goes straight to Treasury": ["回馈直接进入财政部", "La devolución va directa al Tesoro", "환원은 재무부로 바로", "Khoản cho lại đi thẳng tới Bộ Tài chính"],
    "The national-debt donation": ["国债捐赠", "La donación a la deuda nacional", "국가 부채 기부", "Khoản quyên góp giảm nợ công"],
    "Any gift to reduce the national debt goes directly to the U.S. Treasury's own program. We never touch a cent — the button leaves our site for the government's payment page.": [
        "任何用于减少国债的捐赠都直接进入美国财政部自己的项目。我们一分钱也碰不到——按钮会带您离开本站，前往政府的支付页面。",
        "Cualquier donación para reducir la deuda nacional va directamente al programa del propio Tesoro de EE. UU. No tocamos ni un centavo: el botón sale de nuestro sitio hacia la página de pago del gobierno.",
        "국가 부채를 줄이기 위한 기부는 미국 재무부의 자체 프로그램으로 곧바로 갑니다. 저희는 단 한 푼도 만지지 않으며, 버튼은 사이트를 떠나 정부 결제 페이지로 이동합니다.",
        "Mọi khoản tặng để giảm nợ công đều đi thẳng tới chương trình của chính Bộ Tài chính Hoa Kỳ. Chúng tôi không chạm một xu — nút bấm rời khỏi trang của chúng tôi tới trang thanh toán của chính phủ."],
    "This list grows as the site adds features. If a new part of the site handles your data or your money, its safeguard is added here.": [
        "网站每增加一项功能，这份清单就会随之增加。只要有新的部分会处理您的数据或您的钱，它的保障措施就会写进这里。",
        "Esta lista crece a medida que el sitio añade funciones. Si una parte nueva maneja tus datos o tu dinero, su salvaguarda se añade aquí.",
        "사이트에 기능이 늘어나면 이 목록도 함께 늘어납니다. 새로운 부분이 당신의 데이터나 돈을 다룬다면 그 안전장치가 여기에 추가됩니다.",
        "Danh sách này lớn lên khi trang bổ sung tính năng. Nếu một phần mới xử lý dữ liệu hay tiền của bạn, biện pháp bảo vệ của nó sẽ được thêm vào đây."],
    "An integrated business ecosystem — transportation, real estate and finance in one closed loop, built so revenue compounds instead of leaking away.": [
        "一个一体化的商业生态——交通、房地产与金融构成一个闭环，让收入不断复利，而不是白白流走。",
        "Un ecosistema empresarial integrado: transporte, inmobiliaria y finanzas en un circuito cerrado, construido para que los ingresos se compongan en lugar de escaparse.",
        "통합 비즈니스 생태계 — 교통·부동산·금융이 하나의 닫힌 순환을 이루어, 수익이 새지 않고 복리로 쌓이도록 설계했습니다.",
        "Một hệ sinh thái kinh doanh tích hợp — vận tải, bất động sản và tài chính trong một vòng khép kín, xây để doanh thu tích lũy thay vì rò rỉ."],
    "Ride & Drive": ["乘车与驾驶", "Viajar y conducir", "탑승 & 운행", "Đi xe & Lái xe"],
    "Partners": ["合作伙伴", "Socios", "파트너", "Đối tác"],
    "Company": ["公司", "Empresa", "회사", "Công ty"],
    "Security": ["安全", "Seguridad", "보안", "Bảo mật"],
    "Building integrated wealth through connected ecosystems.": ["以彼此相连的生态，构筑一体化的财富。", "Construyendo riqueza integrada a través de ecosistemas conectados.", "연결된 생태계를 통해 통합된 부를 만듭니다.", "Xây dựng của cải tích hợp qua các hệ sinh thái kết nối."],
    "Name or initials (optional)": ["姓名或缩写（选填）", "Nombre o iniciales (opcional)", "이름 또는 이니셜 (선택)", "Tên hoặc chữ viết tắt (tùy chọn)"],
    "Amount you gave ($)": ["您捐了多少（美元）", "Cantidad que donaste ($)", "기부하신 금액 ($)", "Số tiền bạn đã tặng ($)"],
    "Business idea — e.g. Mobile EV-detailing fleet for gig drivers": ["商业点子——例如：面向零工司机的移动电动车美容车队", "Idea de negocio — p. ej. flota móvil de detallado de coches eléctricos para conductores gig", "사업 아이디어 — 예: 긱 기사 대상 이동형 전기차 디테일링 서비스", "Ý tưởng kinh doanh — ví dụ: đội xe chăm sóc xe điện lưu động cho tài xế tự do"],

    # ---------------- Agent portal ----------------
    "One code, two ways to earn.": ["一个编号，两种赚钱方式。", "Un código, dos formas de ganar.", "코드 하나, 두 가지 수익 방법.", "Một mã, hai cách kiếm tiền."],
    "Refer": ["推荐", "Refiere", "추천", "Giới thiệu"],
    "customers and take a commission on every completed ride — or": ["客户，每完成一趟就拿一次佣金——或者", "clientes y llévate una comisión por cada viaje completado — o", "고객을 소개하고 완료된 모든 운행에 대해 수수료를 받으세요 — 또는", "khách hàng và nhận hoa hồng cho mỗi chuyến hoàn thành — hoặc"],
    "guide": ["当导游", "guía", "가이드로서", "hướng dẫn"],
    ": write your own in-depth trip and sell it on our": ["：写一条自己的深度行程，放到我们的", ": escribe tu propio viaje a fondo y véndelo en nuestra", ": 나만의 심층 여행을 써서 저희", ": viết hành trình chuyên sâu của riêng bạn và bán trên"],
    ". The same agent code does both. Anyone can join, as an individual or an organization.": [
        "上出售。同一个代理编号两件事都能办。任何人都可以加入，个人或机构均可。",
        ". El mismo código de agente sirve para ambas cosas. Cualquiera puede unirse, como particular o como organización.",
        "에서 판매하세요. 같은 에이전트 코드로 둘 다 가능합니다. 개인이든 단체든 누구나 참여할 수 있습니다.",
        ". Cùng một mã đại lý làm được cả hai. Ai cũng có thể tham gia, với tư cách cá nhân hoặc tổ chức."],
    "Guides register here too — a student running a campus walk, a driver who knows one neighborhood properly. Your code is what proves the trip was written by a real guide.": [
        "导游也在这里注册——带校园徒步的学生、把某个街区摸得门儿清的司机，都算。您的编号就是这条行程出自真正导游之手的凭证。",
        "Los guías también se registran aquí: un estudiante que hace un paseo por el campus, un conductor que conoce bien un barrio. Tu código es lo que demuestra que el viaje lo escribió un guía real.",
        "가이드도 여기서 등록합니다 — 캠퍼스 도보를 진행하는 학생, 한 동네를 제대로 아는 기사 모두요. 당신의 코드가 그 일정을 실제 가이드가 썼다는 증거입니다.",
        "Hướng dẫn viên cũng đăng ký tại đây — một sinh viên dẫn tour trong trường, một tài xế thuộc lòng một khu phố. Mã của bạn là bằng chứng hành trình do hướng dẫn viên thật viết ra."],
    "Register & Get My Code": ["注册并获取我的编号", "Registrarme y obtener mi código", "등록하고 코드 받기", "Đăng ký & nhận mã của tôi"],
    "Book a Trip": ["预订行程", "Reservar un viaje", "여행 예약", "Đặt một chuyến"],
    "Sell My Own Trips": ["出售我自己的行程", "Vender mis propios viajes", "내 여행 판매하기", "Bán hành trình của tôi"],
    "Book any trip for your client — airport, cruise, tour, or a custom day out. It comes straight to our dispatch and your commission is tracked automatically.": [
        "为您的客户预订任何行程——机场、邮轮、观光或定制一日游。订单会直接进入我们的调度中心，您的佣金自动记账。",
        "Reserva cualquier viaje para tu cliente: aeropuerto, crucero, tour o un día a medida. Llega directamente a nuestra central y tu comisión se registra automáticamente.",
        "고객을 위해 어떤 일정이든 예약하세요 — 공항, 크루즈, 투어, 맞춤 하루 코스. 저희 배차로 바로 접수되고 수수료는 자동으로 집계됩니다.",
        "Đặt bất kỳ chuyến nào cho khách của bạn — sân bay, du thuyền, tour hoặc một ngày theo yêu cầu. Nó tới thẳng bộ phận điều phối và hoa hồng của bạn được ghi nhận tự động."],
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
    "Request a quote instead — we'll price it and confirm back": ["改为索取报价——我们会定价并回复确认", "Pedir presupuesto en su lugar: lo valoramos y te confirmamos", "대신 견적 요청 — 가격을 산정해 다시 알려드립니다", "Yêu cầu báo giá thay thế — chúng tôi sẽ định giá và xác nhận lại"],
    "You earn a flat commission on every trip you book that's completed.": ["您预订的每一趟行程只要完成，就能拿到一笔固定佣金。", "Ganas una comisión fija por cada viaje que reserves y se complete.", "예약하신 여정이 완료될 때마다 정액 수수료를 받습니다.", "Bạn nhận hoa hồng cố định cho mỗi chuyến bạn đặt và hoàn thành."],
    "Send Booking": ["提交预订", "Enviar reserva", "예약 보내기", "Gửi đặt chỗ"],
    "💸 Get Paid": ["💸 领取收入", "💸 Cobrar", "💸 정산 받기", "💸 Nhận tiền"],
    "Available to pay out": ["可提现金额", "Disponible para cobrar", "출금 가능 금액", "Có thể chi trả"],
    "Requested (awaiting)": ["已申请（待处理）", "Solicitado (pendiente)", "신청됨 (대기 중)", "Đã yêu cầu (đang chờ)"],
    "Paid out so far": ["累计已支付", "Pagado hasta ahora", "지금까지 지급됨", "Đã chi trả đến nay"],
    "PayPal email — get paid directly": ["PayPal 邮箱——直接收款", "Correo de PayPal — cobra directamente", "PayPal 이메일 — 바로 입금받기", "Email PayPal — nhận tiền trực tiếp"],
    "Save": ["保存", "Guardar", "저장", "Lưu"],
    "Other way to be paid? (optional)": ["其他收款方式？（选填）", "¿Otra forma de cobro? (opcional)", "다른 수령 방법? (선택)", "Cách nhận tiền khác? (tùy chọn)"],
    "Request Payout": ["申请提现", "Solicitar pago", "정산 신청", "Yêu cầu chi trả"],
    "Request": ["申请单", "Solicitud", "신청", "Yêu cầu"],
    "Requested": ["申请时间", "Solicitado", "신청일", "Đã yêu cầu"],
    "Paid": ["支付时间", "Pagado", "지급일", "Đã trả"],
    "No payout requests yet — when rides complete, your money shows as available here.": ["还没有提现申请——行程完成后，您的钱会在这里显示为可提现。", "Aún no hay solicitudes de pago: cuando los viajes se completen, tu dinero aparecerá disponible aquí.", "아직 정산 신청이 없습니다 — 운행이 완료되면 이곳에 출금 가능 금액이 표시됩니다.", "Chưa có yêu cầu chi trả nào — khi các chuyến hoàn tất, tiền của bạn sẽ hiện ở đây."],
    "Referring rides earns a commission. Guiding earns the whole fare — you set it. Write the trip you already know by heart: your stops, how long you actually stand at each one, what you say there, and what it costs. It goes on the public": [
        "推荐用车赚的是佣金。带团导览赚的是整笔团费——价格由您定。把您早已烂熟于心的那条行程写下来：您的站点、每站实际停留多久、您在那里讲什么、以及收费多少。它会出现在公开的",
        "Referir viajes da comisión. Guiar da la tarifa entera, que tú fijas. Escribe el viaje que ya te sabes de memoria: tus paradas, cuánto tiempo estás realmente en cada una, qué cuentas allí y cuánto cuesta. Aparecerá en la",
        "차량을 추천하면 수수료를 받고, 가이드를 하면 요금 전액을 받습니다 — 가격은 당신이 정합니다. 이미 훤히 아는 그 일정을 적어 보세요: 방문지, 각 지점에서 실제로 머무는 시간, 그곳에서 하는 이야기, 그리고 비용. 공개된",
        "Giới thiệu chuyến xe thì nhận hoa hồng. Dẫn tour thì nhận trọn tiền tour — do bạn định giá. Hãy viết ra hành trình bạn đã thuộc nằm lòng: các điểm dừng, thời gian thực sự ở mỗi nơi, điều bạn kể ở đó, và chi phí. Nó sẽ lên"],
    "the moment you list it, and travellers reach you through us — your contact details are never published.": [
        "上，发布即刻可见；旅客通过我们联系您——您的联系方式绝不会被公开。",
        "en cuanto lo publiques, y los viajeros te contactarán a través de nosotros: tus datos de contacto nunca se publican.",
        "여행 페이지에 등록 즉시 올라가며, 여행자는 저희를 통해 연락합니다 — 당신의 연락처는 절대 공개되지 않습니다.",
        "ngay khi bạn đăng, và du khách liên hệ bạn qua chúng tôi — thông tin liên hệ của bạn không bao giờ được công khai."],
    "Your code doubles as your guide credential": ["您的编号同时也是导游身份凭证", "Tu código sirve además como credencial de guía", "당신의 코드는 가이드 자격 증명도 겸합니다", "Mã của bạn đồng thời là chứng nhận hướng dẫn viên"],
    "This is what proves a real guide wrote the trip.": ["这就是证明行程出自真正导游之手的凭证。", "Esto es lo que demuestra que un guía real escribió el viaje.", "이것이 실제 가이드가 일정을 작성했다는 증거입니다.", "Đây là bằng chứng một hướng dẫn viên thật đã viết hành trình."],
    "Open Guide Studio →": ["打开导游工作室 →", "Abrir el Estudio de guías →", "가이드 스튜디오 열기 →", "Mở Xưởng hướng dẫn viên →"],
    "Zelle / cash / check — and where": ["Zelle / 现金 / 支票——以及收款地点", "Zelle / efectivo / cheque — y dónde", "Zelle / 현금 / 수표 — 그리고 어디로", "Zelle / tiền mặt / séc — và ở đâu"],

    # ---------------- Dispatch + driver ----------------
    "Atlas →": ["Atlas →", "Atlas →", "Atlas →", "Atlas →"],
    "Archive →": ["档案库 →", "Archivo →", "아카이브 →", "Kho lưu trữ →"],
    "Every paper trail — bookings, contacts, agreements & paperwork": ["全部纸面记录——订单、联系人、协议与文件", "Todo el rastro documental: reservas, contactos, acuerdos y papeleo", "모든 서류 기록 — 예약, 연락처, 계약, 문서", "Mọi dấu vết giấy tờ — đặt chỗ, liên hệ, thỏa thuận & hồ sơ"],
    "💸 Payouts": ["💸 结算", "💸 Pagos", "💸 정산", "💸 Chi trả"],
    "Agents & driver-agents request their earned money here. Send it your way (Zelle / cash / check), then mark it paid — the ledger stays honest. Balances show what each agent can still request.": [
        "代理人和司机代理在这里申请自己赚到的钱。您用自己的方式付款（Zelle / 现金 / 支票），然后标记为已支付——账目就始终准确。余额显示每位代理还能申请多少。",
        "Los agentes y conductores-agentes solicitan aquí el dinero que han ganado. Págalo a tu manera (Zelle / efectivo / cheque) y márcalo como pagado: el libro se mantiene fiel. Los saldos muestran cuánto puede pedir todavía cada agente.",
        "에이전트와 기사 겸 에이전트가 이곳에서 번 돈을 신청합니다. 원하는 방식(Zelle / 현금 / 수표)으로 지급한 뒤 지급 완료로 표시하면 장부가 정확하게 유지됩니다. 잔액은 각 에이전트가 아직 신청할 수 있는 금액입니다.",
        "Đại lý và tài xế kiêm đại lý yêu cầu khoản đã kiếm được tại đây. Bạn chi trả theo cách của mình (Zelle / tiền mặt / séc) rồi đánh dấu đã trả — sổ sách luôn khớp. Số dư cho biết mỗi đại lý còn có thể yêu cầu bao nhiêu."],
    "Preferred method": ["首选方式", "Método preferido", "선호 방식", "Cách ưa dùng"],
    "No payout requests yet.": ["还没有提现申请。", "Aún no hay solicitudes de pago.", "아직 정산 신청이 없습니다.", "Chưa có yêu cầu chi trả nào."],
    "Driver Dashboard — Plateau Strategy": ["司机面板 — Plateau Strategy", "Panel del conductor — Plateau Strategy", "기사 대시보드 — Plateau Strategy", "Bảng điều khiển tài xế — Plateau Strategy"],
    "🚗 Driver Dashboard": ["🚗 司机面板", "🚗 Panel del conductor", "🚗 기사 대시보드", "🚗 Bảng điều khiển tài xế"],
    "live": ["实时", "en vivo", "실시간", "trực tiếp"],
    "Booking page": ["预订页面", "Página de reservas", "예약 페이지", "Trang đặt chỗ"],
    "booking page": ["预订页面", "página de reservas", "예약 페이지", "trang đặt chỗ"],
    "No reservations yet. New bookings from the": ["还没有预订。来自", "Aún no hay reservas. Las nuevas reservas de la", "아직 예약이 없습니다. ", "Chưa có đặt chỗ nào. Đơn mới từ"],
    "appear here automatically.": ["的新订单会自动出现在这里。", "aparecen aquí automáticamente.", "에서 들어온 새 예약이 여기에 자동으로 표시됩니다.", "sẽ tự động hiện ở đây."],
})

EXTRA.update({
    "Everything on this site is here to get people out of a hole and into a fortune — the free tools, the work, the trading research. If it works for you, we ask one thing, and only if you want to:": [
        "这个网站上的一切——免费工具、我们做的事、交易研究——都是为了帮人从坑里爬出来，走向富足。如果它对您管用，我们只有一个请求，而且完全自愿：",
        "Todo lo que hay en este sitio existe para sacar a la gente de un agujero y llevarla a la prosperidad: las herramientas gratuitas, el trabajo, la investigación de trading. Si te funciona, te pedimos una sola cosa, y solo si quieres:",
        "이 사이트의 모든 것 — 무료 도구, 우리가 하는 일, 트레이딩 연구 — 은 사람들을 구덩이에서 꺼내 풍요로 이끌기 위해 있습니다. 도움이 되셨다면 딱 한 가지만 부탁드립니다. 원하실 때만요:",
        "Mọi thứ trên trang này tồn tại để đưa người ta ra khỏi hố sâu và tới chỗ khá giả — các công cụ miễn phí, công việc, nghiên cứu giao dịch. Nếu nó có ích cho bạn, chúng tôi chỉ xin một điều, và chỉ khi bạn muốn:"],
    "The national debt is measured in trillions; no single gift changes that arithmetic. That isn't the point — the point is the act, and that it's real, voluntary, and goes where we say it goes. Gifts to the United States for exclusively public purposes are generally tax-deductible, but we're not tax advisors — ask yours. Plateau Strategy Solution Lab is not affiliated with, and does not represent, the U.S. Treasury or any government agency.": [
        "国债以万亿计；任何一笔捐赠都改变不了这个算术。但这不是重点——重点在于这个举动本身，在于它真实、自愿，并且确实流向我们所说的地方。为纯公共用途向美国政府所作的捐赠通常可以抵税，但我们不是税务顾问——请咨询您自己的顾问。Plateau Strategy Solution Lab 与美国财政部或任何政府机构均无隶属关系，也不代表它们。",
        "La deuda nacional se mide en billones; ninguna donación cambia esa aritmética. No se trata de eso: se trata del acto, y de que sea real, voluntario y vaya adonde decimos que va. Las donaciones a Estados Unidos con fines exclusivamente públicos suelen ser deducibles, pero no somos asesores fiscales: consulta al tuyo. Plateau Strategy Solution Lab no está afiliado al Tesoro de EE. UU. ni a ninguna agencia gubernamental, ni los representa.",
        "국가 부채는 조 단위입니다. 한 번의 기부가 그 산술을 바꾸지는 못합니다. 요점은 그것이 아니라 행위 자체이며, 그것이 실제이고 자발적이며 우리가 말한 곳으로 간다는 사실입니다. 오로지 공공 목적으로 미국에 하는 기부는 대체로 세금 공제 대상이지만, 저희는 세무 자문가가 아니니 담당자에게 문의하세요. Plateau Strategy Solution Lab은 미국 재무부나 어떤 정부 기관과도 제휴하지 않으며 이를 대표하지 않습니다.",
        "Nợ công được tính bằng nghìn tỷ; không khoản tặng đơn lẻ nào thay đổi phép tính đó. Đó không phải là điểm chính — điểm chính là hành động, và rằng nó có thật, tự nguyện, và đi đúng nơi chúng tôi nói. Các khoản tặng cho Hoa Kỳ vì mục đích thuần công cộng thường được khấu trừ thuế, nhưng chúng tôi không phải cố vấn thuế — hãy hỏi cố vấn của bạn. Plateau Strategy Solution Lab không liên kết với và không đại diện cho Bộ Tài chính Hoa Kỳ hay bất kỳ cơ quan chính phủ nào."],
    "The problem, the business model, how it makes money, and what it needs to launch…": [
        "要解决的问题、商业模式、怎么赚钱，以及启动需要什么…",
        "El problema, el modelo de negocio, cómo gana dinero y qué necesita para lanzarse…",
        "해결하려는 문제, 사업 모델, 수익 방식, 그리고 시작에 필요한 것…",
        "Vấn đề, mô hình kinh doanh, cách kiếm tiền, và cần gì để khởi động…"],
    "Car seat, extra luggage, meet & greet, accessibility…": ["儿童座椅、额外行李、接机举牌、无障碍需求…", "Silla infantil, equipaje extra, recepción con cartel, accesibilidad…", "카시트, 추가 수하물, 미팅 서비스, 이동 편의…", "Ghế trẻ em, hành lý thêm, đón có bảng tên, hỗ trợ tiếp cận…"],
    "Trip Planner — Plateau Strategy Solution Lab": ["行程规划 — Plateau Strategy Solution Lab", "Planificador de viaje — Plateau Strategy Solution Lab", "여행 플래너 — Plateau Strategy Solution Lab", "Lập kế hoạch chuyến đi — Plateau Strategy Solution Lab"],
    "Dates, group size, must-sees…": ["日期、人数、必去的地方…", "Fechas, tamaño del grupo, imprescindibles…", "날짜, 인원, 꼭 가고 싶은 곳…", "Ngày, số người, những nơi nhất định phải tới…"],
    "Two hours inside the Yard with someone who studies here — the statue that lies three times, why the gates are numbered, what the freshman dorms are actually like, and the reading room most tours never enter.": [
        "和在这里念书的人一起，在哈佛园里待上两小时——那尊“说了三个谎”的雕像、校门为什么要编号、新生宿舍到底什么样，还有多数旅行团从没进过的那间阅览室。",
        "Dos horas dentro del Yard con alguien que estudia aquí: la estatua que miente tres veces, por qué las verjas están numeradas, cómo son de verdad las residencias de primer año y la sala de lectura en la que casi ningún tour entra.",
        "이곳에서 공부하는 사람과 함께 하버드 야드에서 보내는 두 시간 — 세 번 거짓말하는 동상, 문에 번호가 붙은 이유, 신입생 기숙사의 실제 모습, 그리고 대부분의 투어가 들어가지 않는 열람실까지.",
        "Hai giờ trong khuôn viên Harvard cùng một người đang học ở đây — bức tượng nói dối ba lần, vì sao các cổng được đánh số, ký túc xá năm nhất thực sự ra sao, và phòng đọc mà hầu hết các tour không bao giờ bước vào."],
    "1½ h": ["1.5 小时", "1½ h", "1시간 30분", "1½ giờ"],
    "2 h": ["2 小时", "2 h", "2시간", "2 giờ"],
    "3 h": ["3 小时", "3 h", "3시간", "3 giờ"],
})

# Single letters, code-like placeholders and route labels a reader does not need
# translated — and the sample text inside example inputs, which stays in English
# so the format it demonstrates is still legible.
EXTRA_SKIP |= {
    "Plateau Strategy Solution Lab — Integrated Business Ecosystem",
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
    "Plateau Strategy Deflator — Automated Trading Research": ["Plateau Strategy Deflator——自动化交易研究", "Plateau Strategy Deflator — Investigación de trading automatizado", "Plateau Strategy Deflator — 자동 매매 연구", "Plateau Strategy Deflator — Nghiên cứu giao dịch tự động"],
    "An automated crypto-trading": ["一个自动化加密货币交易", "Un proyecto de investigación de trading", "자동 암호화폐 매매", "Một dự án nghiên cứu giao dịch"],
    "research project": ["研究项目", "de criptomonedas automatizado", "연구 프로젝트", "tiền mã hóa tự động"],
    "— fighting inflation with disciplined, self-learning automation.": ["——用有纪律、会自我学习的自动化对抗通胀。", "— luchando contra la inflación con automatización disciplinada que aprende sola.", "— 규율 있고 스스로 학습하는 자동화로 인플레이션에 맞섭니다.", "— chống lạm phát bằng tự động hóa kỷ luật, tự học."],
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
    "— realized plus unrealized, fees included. No vanity win-rates. When results are published, they will be the real number.": [
        "衡量——已实现加未实现，含手续费。不做好看的胜率。等到公布结果时，那就是真实的数字。",
        "— realizado más no realizado, con comisiones incluidas. Sin tasas de acierto de escaparate. Cuando se publiquen los resultados, será la cifra real.",
        "로 측정합니다 — 실현 손익에 미실현 손익을 더하고 수수료까지 포함합니다. 보기 좋은 승률은 없습니다. 결과를 공개할 때 그것이 진짜 숫자입니다.",
        "— đã hiện thực hóa cộng chưa hiện thực hóa, đã tính phí. Không có tỷ lệ thắng làm màu. Khi công bố, đó sẽ là con số thật."],
    "Founder's conviction": ["创始人的信念", "Convicción del fundador", "창업자의 확신", "Niềm tin của người sáng lập"],
        "Public data collection record": ["公开数据采集记录", "Registro público de recopilación de datos", "공개 데이터 수집 기록", "Hồ sơ thu thập dữ liệu công khai"],
    "Nothing published yet. This moves only when verified results go public.": ["尚未发布任何内容。只有当经过验证的结果公开时，这里才会变动。", "Aún no se ha publicado nada. Esto solo se mueve cuando se hacen públicos resultados verificados.", "아직 공개된 것이 없습니다. 검증된 결과가 공개될 때만 갱신됩니다.", "Chưa công bố gì. Mục này chỉ thay đổi khi có kết quả đã kiểm chứng được công khai."],
    "Follow the research": ["关注这项研究", "Sigue la investigación", "연구를 지켜보기", "Theo dõi nghiên cứu"],
    "Leave your email and you'll be notified when the verified track record is published. No spam, no sales pitch — one update when the numbers are real.": [
        "留下邮箱，等经过验证的业绩记录发布时我们会通知您。不发垃圾邮件，不做推销——数字为真时，只发一封更新。",
        "Deja tu correo y te avisaremos cuando se publique el historial verificado. Sin spam ni discurso de venta: una sola actualización cuando las cifras sean reales.",
        "이메일을 남겨 주시면 검증된 실적이 공개될 때 알려드립니다. 스팸도 영업도 없습니다 — 숫자가 진짜가 되었을 때 딱 한 번 안내드립니다.",
        "Để lại email và bạn sẽ được báo khi hồ sơ thành tích đã kiểm chứng được công bố. Không spam, không chào mời — chỉ một thông báo khi các con số là thật."],
    "Notify me": ["通知我", "Avísame", "알림 받기", "Báo cho tôi"],
    "Important:": ["重要提示：", "Importante:", "중요:", "Quan trọng:"],
    "This page describes an internal research project of Plateau Strategy Solution Lab. It is": [
        "本页介绍的是 Plateau Strategy Solution Lab 的一个内部研究项目。它",
        "Esta página describe un proyecto de investigación interno de Plateau Strategy Solution Lab. No es",
        "이 페이지는 Plateau Strategy Solution Lab의 내부 연구 프로젝트를 설명합니다. 이는",
        "Trang này mô tả một dự án nghiên cứu nội bộ của Plateau Strategy Solution Lab. Đây"],
    "not an offer to sell — or a solicitation to buy — any security, investment product, or advisory service": [
        "不是出售任何证券、投资产品或顾问服务的要约，也不是购买邀请",
        "una oferta de venta —ni una solicitud de compra— de ningún valor, producto de inversión o servicio de asesoría",
        "어떤 증권·투자상품·자문 서비스의 매도 제안이나 매수 권유가 아닙니다",
        "không phải lời chào bán — hay mời mua — bất kỳ chứng khoán, sản phẩm đầu tư hoặc dịch vụ tư vấn nào"],
    "Nothing is offered or sold today": ["今天不提供也不出售任何东西", "Hoy no se ofrece ni se vende nada", "오늘은 어떤 것도 제공되거나 판매되지 않습니다", "Hôm nay không có gì được chào bán"],
    "not investment advice": ["不构成投资建议", "no es asesoramiento de inversión", "투자 자문이 아닙니다", "không phải lời khuyên đầu tư"],
        "and": ["以及", "y", "그리고", "và"],
    "— this page exists so you can follow the research.": ["——这个页面的存在，只是为了让您能跟进这项研究。", "— esta página existe para que puedas seguir la investigación.", "— 이 페이지는 연구를 지켜보실 수 있도록 존재합니다.", "— trang này tồn tại để bạn có thể theo dõi nghiên cứu."],
})

EXTRA.update({
    # ---------------- Factor Clock ----------------
    "The Factor Clock — Plateau Strategy": ["因子时钟 — Plateau Strategy", "El Reloj de Factores — Plateau Strategy", "팩터 클록 — Plateau Strategy", "Đồng hồ Nhân tố — Plateau Strategy"],
    "← Plateau Strategy": ["← Plateau Strategy", "← Plateau Strategy", "← Plateau Strategy", "← Plateau Strategy"],
    "🕐 The Factor Clock · for anyone who wants an honest forecast": ["🕐 因子时钟 · 献给想要诚实预测的人", "🕐 El Reloj de Factores · para quien quiera un pronóstico honesto", "🕐 팩터 클록 · 정직한 예측을 원하는 모든 이에게", "🕐 Đồng hồ Nhân tố · dành cho ai muốn một dự báo trung thực"],
    "◆ founding beta · free access": ["◆ 创始内测 · 免费使用", "◆ beta fundacional · acceso gratuito", "◆ 파운딩 베타 · 무료 이용", "◆ beta sáng lập · truy cập miễn phí"],
    "A prediction clock that never lies to you.": ["一个从不骗您的预测时钟。", "Un reloj de predicción que nunca te miente.", "결코 거짓말하지 않는 예측 시계.", "Một chiếc đồng hồ dự báo không bao giờ nói dối bạn."],
    "Weather, markets, your own patterns — every forecast scored against what actually happened. It tells you when it": [
        "天气、市场、您自己的规律——每一次预测都拿真实结果打分。当它",
        "Clima, mercados, tus propios patrones: cada pronóstico puntuado contra lo que realmente pasó. Te dice cuándo",
        "날씨, 시장, 당신의 패턴 — 모든 예측을 실제 결과와 대조해 채점합니다. 모를 때는",
        "Thời tiết, thị trường, thói quen của bạn — mọi dự báo đều chấm điểm dựa trên điều đã thực sự xảy ra. Nó nói cho bạn biết khi nào nó"],
    "doesn't": ["不知道时", "no", "모른다고", "không"],
    "know, and it's evolving with everyone who uses it.": ["，它会直说；而且它会随着每一位使用者一起进化。", "lo sabe, y evoluciona con todos los que lo usan.", " 말해 주며, 사용하는 모든 사람과 함께 발전합니다.", "biết, và nó tiến hóa cùng mọi người dùng."],
    "Join free beta →": ["加入免费内测 →", "Únete a la beta gratuita →", "무료 베타 참여 →", "Tham gia beta miễn phí →"],
    "What it does": ["它能做什么", "Qué hace", "무엇을 하나요", "Nó làm gì"],
    "A brief that's honest": ["一份诚实的简报", "Un resumen honesto", "정직한 브리핑", "Bản tóm tắt trung thực"],
    "Every morning, one plain-language read of your day — and it clearly labels a guess a guess, and an earned answer earned.": [
        "每天早上，用大白话把您这一天读一遍——猜的就明说是猜的，站得住脚的答案也明说是挣来的。",
        "Cada mañana, una lectura de tu día en lenguaje llano, que marca con claridad lo que es una conjetura y lo que es una respuesta ganada.",
        "매일 아침, 당신의 하루를 쉬운 말로 한 번 읽어 줍니다 — 추측은 추측이라고, 근거 있는 답은 근거 있다고 분명히 밝힙니다.",
        "Mỗi sáng, một bản đọc hiểu về ngày của bạn bằng ngôn ngữ dễ hiểu — nói rõ đâu là phỏng đoán và đâu là câu trả lời đã được chứng minh."],
    "A library that's earned it": ["一座凭实绩说话的资料库", "Una biblioteca que se lo ha ganado", "실적으로 증명된 라이브러리", "Một thư viện đã tự chứng minh"],
        "Learns you, privately": ["私密地了解您", "Te aprende, en privado", "당신을 사적으로 학습합니다", "Học về bạn, một cách riêng tư"],
    "Log your own life — a shift, a drive, a habit — and it finds your patterns. Your data stays on your device. It gets sharper the longer you own it.": [
        "记录您自己的生活——一个班次、一趟车、一个习惯——它就能找出您的规律。数据留在您自己的设备上。您用得越久，它就越准。",
        "Registra tu propia vida —un turno, un trayecto, un hábito— y encuentra tus patrones. Tus datos se quedan en tu dispositivo. Cuanto más tiempo lo tengas, más afinado será.",
        "당신의 일상을 기록하세요 — 근무, 운전, 습관 — 그러면 패턴을 찾아냅니다. 데이터는 당신 기기에 남습니다. 오래 쓸수록 더 정확해집니다.",
        "Ghi lại đời sống của bạn — một ca làm, một chuyến lái, một thói quen — và nó tìm ra quy luật của bạn. Dữ liệu ở lại trên thiết bị của bạn. Càng dùng lâu càng sắc bén."],
    "The one thing nobody else ships: honest uncertainty": ["别人都不肯给的那样东西：诚实的不确定性", "Lo único que nadie más entrega: incertidumbre honesta", "다른 곳은 내놓지 않는 단 하나: 정직한 불확실성", "Điều duy nhất không ai khác cung cấp: sự bất định trung thực"],
        "Straight talk, because that's the whole point.": ["有话直说，因为这正是重点所在。", "Hablar claro, porque de eso se trata.", "솔직하게 말합니다. 그게 핵심이니까요.", "Nói thẳng, vì đó chính là điểm mấu chốt."],
    "The Factor Clock is early. Its world library is real and proven; its power to read": [
        "因子时钟还处在早期。它的世界资料库是真实且经过验证的；而它读懂",
        "El Reloj de Factores está en fase inicial. Su biblioteca del mundo es real y está probada; su capacidad de leer",
        "팩터 클록은 아직 초기 단계입니다. 세계 라이브러리는 실재하며 검증되었지만,",
        "Đồng hồ Nhân tố còn ở giai đoạn sớm. Thư viện thế giới của nó là thật và đã được kiểm chứng; khả năng đọc"],
    "your": ["您", "tu", "당신의", "của bạn"],
    "life grows as you use it. That's exactly why it's": ["的生活的能力，要靠您使用才会成长。这正是它现在", "vida crece a medida que lo usas. Precisamente por eso es", "삶을 읽는 능력은 쓰실수록 자랍니다. 그래서 지금은", "cuộc sống của bạn lớn lên khi bạn dùng. Chính vì thế nó"],
    "free right now": ["免费的原因", "gratis ahora mismo", "무료입니다", "miễn phí ngay lúc này"],
        "Free while it earns its record": ["在它积累战绩期间免费", "Gratis mientras se gana su historial", "실적을 쌓는 동안 무료", "Miễn phí trong lúc tạo dựng thành tích"],
    "FREE": ["免费", "GRATIS", "무료", "MIỄN PHÍ"],
    "$10 / year": ["10 美元 / 年", "10 $ / año", "연 10달러", "10 $ / năm"],
    "· free while it proves itself": ["· 在它自证期间免费", "· gratis mientras se demuestra", "· 스스로 증명하는 동안 무료", "· miễn phí trong lúc tự chứng minh"],
    "The daily brief + the growing library of proven sources": ["每日简报 + 不断增长的可信来源库", "El resumen diario + la biblioteca creciente de fuentes probadas", "일일 브리핑 + 검증된 출처의 확장되는 라이브러리", "Bản tóm tắt hằng ngày + thư viện nguồn đã kiểm chứng ngày một lớn"],
    "Your own private life-tracking & personal predictions": ["您自己的私密生活记录与个人预测", "Tu seguimiento de vida privado y predicciones personales", "나만의 비공개 생활 기록과 개인 예측", "Theo dõi đời sống riêng tư & dự báo cá nhân của bạn"],
    "Every new domain we prove, added free": ["我们每验证一个新领域，都免费加进来", "Cada nuevo dominio que probamos, añadido gratis", "새로 검증한 모든 영역을 무료로 추가", "Mỗi lĩnh vực mới được chứng minh đều thêm miễn phí"],
    "Full access as each piece ships — no card required": ["每上线一块功能即可全量使用——无需绑卡", "Acceso completo a cada pieza que lanzamos — sin tarjeta", "각 기능이 출시될 때마다 전체 이용 — 카드 불필요", "Toàn quyền truy cập mỗi phần khi ra mắt — không cần thẻ"],
    "Founding members lock in — you'll never pay more than $10": ["创始会员锁定价格——您永远不会付超过 10 美元", "Los miembros fundadores fijan el precio: nunca pagarás más de 10 $", "파운딩 멤버는 가격이 고정됩니다 — 10달러를 넘게 내는 일은 없습니다", "Thành viên sáng lập được khóa giá — bạn sẽ không bao giờ trả quá 10 $"],
    "— $10/year value, founding members lock it in free.": ["——价值每年 10 美元，创始会员免费锁定。", "— valor de 10 $/año, los miembros fundadores lo fijan gratis.", "— 연 10달러 상당, 파운딩 멤버는 무료로 고정합니다.", "— trị giá 10 $/năm, thành viên sáng lập khóa miễn phí."],
    "Get early access — free →": ["抢先体验——免费 →", "Consigue acceso anticipado — gratis →", "얼리 액세스 받기 — 무료 →", "Nhận quyền truy cập sớm — miễn phí →"],
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
    "Conviction is how strongly the founder believes in this system — not a return, a win rate, or a projection. The record beneath it is the honest counterweight: until results are published and measured as True Net, it stays at zero.": [
        "信念指的是创始人对这套系统有多信——它不是收益率、胜率或预测。下面那份记录是诚实的对照：在结果公开并以“真实净值”衡量之前，它一直是零。",
        "La convicción es cuánto cree el fundador en este sistema, no una rentabilidad, una tasa de acierto ni una proyección. El registro que aparece debajo es el contrapeso honesto: hasta que se publiquen resultados medidos como Neto Real, se queda en cero.",
        "확신이란 창업자가 이 시스템을 얼마나 믿는지를 뜻합니다 — 수익률도, 승률도, 전망도 아닙니다. 그 아래의 기록이 정직한 균형추입니다: 결과가 공개되고 실질 순손익으로 측정되기 전까지는 0으로 유지됩니다.",
        "Niềm tin là mức độ người sáng lập tin vào hệ thống này — không phải lợi nhuận, tỷ lệ thắng hay dự phóng. Hồ sơ bên dưới là đối trọng trung thực: cho tới khi kết quả được công bố và đo bằng Lãi ròng thật, nó vẫn ở mức không."],
    "Buys Chainlink dips only inside a data-defined value zone (90-day market structure), with hard rules a human can't hold at 2am: depth gates, cooldowns, position caps.": [
        "只在由数据划定的价值区间内（90 天市场结构）买入 Chainlink 的回调，并执行人在凌晨两点守不住的硬规则：深度闸门、冷却期、仓位上限。",
        "Compra caídas de Chainlink solo dentro de una zona de valor definida por datos (estructura de mercado de 90 días), con reglas duras que un humano no sostiene a las 2 de la mañana: filtros de profundidad, tiempos de espera y topes de posición.",
        "데이터로 정한 가치 구간(90일 시장 구조) 안에서만 체인링크 하락을 매수하며, 새벽 2시에 사람이 지키기 힘든 엄격한 규칙을 따릅니다: 깊이 게이트, 쿨다운, 포지션 상한.",
        "Chỉ mua các nhịp giảm của Chainlink trong vùng giá trị do dữ liệu xác định (cấu trúc thị trường 90 ngày), với các quy tắc cứng mà con người khó giữ lúc 2 giờ sáng: ngưỡng độ sâu, thời gian chờ, giới hạn vị thế."],
    "The order engine calibrates itself from every single trade outcome — tightening or deepening its bids automatically — and every layer of the system is audited against real exchange fees.": [
        "下单引擎会从每一笔交易的结果自我校准——自动收紧或压低报价——系统的每一层都要按交易所的真实手续费接受核查。",
        "El motor de órdenes se calibra con el resultado de cada operación —ajustando o profundizando sus pujas automáticamente— y cada capa del sistema se audita contra las comisiones reales del exchange.",
        "주문 엔진은 모든 거래 결과로부터 스스로 보정하여 호가를 자동으로 좁히거나 낮추며, 시스템의 모든 계층은 거래소의 실제 수수료 기준으로 감사됩니다.",
        "Bộ máy đặt lệnh tự hiệu chỉnh từ kết quả của từng giao dịch — tự động thắt chặt hoặc hạ sâu giá đặt — và mọi lớp của hệ thống đều được kiểm toán theo phí sàn thực tế."],
    ". No customer funds are accepted or managed. Cryptocurrency is highly volatile and you can lose the entire amount you put at risk. Past performance, once published, will not guarantee future results.": [
        "。我们不接受也不管理客户资金。加密货币波动极大，您投入的资金可能全部亏光。过往业绩即便日后公开，也不保证未来结果。",
        ". No se aceptan ni se gestionan fondos de clientes. Las criptomonedas son muy volátiles y puedes perder todo el importe que arriesgues. El rendimiento pasado, una vez publicado, no garantizará resultados futuros.",
        ". 고객 자금을 받거나 운용하지 않습니다. 암호화폐는 변동성이 매우 크며 투입한 금액 전부를 잃을 수 있습니다. 과거 성과는 공개되더라도 미래 결과를 보장하지 않습니다.",
        ". Không nhận hay quản lý tiền của khách hàng. Tiền mã hóa biến động rất mạnh và bạn có thể mất toàn bộ số tiền đã bỏ ra. Hiệu suất quá khứ, dù được công bố, cũng không bảo đảm kết quả tương lai."],
    "Proven forecasters — two independent weather oracles, a real-money crowd, and more — each trusted only after it beats chance on thousands of real outcomes.": [
        "经过检验的预测源——两个各自独立的天气预言机、一个真金白银的群体，还有更多——每一个都要在成千上万条真实结果上跑赢随机，才会被采信。",
        "Pronosticadores probados —dos oráculos meteorológicos independientes, una multitud con dinero real y más—, cada uno aceptado solo tras superar al azar en miles de resultados reales.",
        "검증된 예측원 — 서로 독립적인 두 개의 날씨 오라클, 실제 돈이 걸린 군중, 그리고 그 외 — 각각 수천 건의 실제 결과에서 우연을 이긴 뒤에야 신뢰합니다.",
        "Những nguồn dự báo đã được kiểm chứng — hai oracle thời tiết độc lập, một đám đông đặt tiền thật, và hơn nữa — mỗi nguồn chỉ được tin sau khi vượt qua ngẫu nhiên trên hàng nghìn kết quả thực."],
    "Every prediction app fakes confidence. This one refuses to. It says “87%, and here's my track record” — or “I don't know, and here's the proof nobody does.” It even keeps a quantum random number generator on the bench under identical rules: if pure randomness ever scores as skilled, it flags itself as broken. That's a tool you can actually trust.": [
        "每一款预测应用都在假装有把握。这一款不肯。它会说“87%，这是我的历史战绩”——或者“我不知道，而且这是没人能确定的证据”。它甚至让一个量子随机数发生器在同样的规则下一起上场：如果纯粹的随机居然被评为“有本事”，它就把自己标记为出了问题。这才是一个您真能信得过的工具。",
        "Todas las apps de predicción fingen seguridad. Esta se niega. Dice «87 %, y aquí está mi historial» — o «no lo sé, y aquí está la prueba de que nadie lo sabe». Incluso mantiene en el banquillo un generador cuántico de números aleatorios con las mismas reglas: si el puro azar llega a puntuar como habilidad, se marca a sí misma como defectuosa. Eso sí es una herramienta en la que puedes confiar.",
        "모든 예측 앱은 자신감을 꾸며냅니다. 이 앱은 그러지 않습니다. “87%, 그리고 이것이 제 실적입니다”라고 말하거나, “모릅니다, 그리고 아무도 모른다는 증거가 여기 있습니다”라고 말합니다. 심지어 동일한 규칙으로 양자 난수 생성기를 함께 돌립니다: 순수한 무작위가 실력 있는 것으로 채점된다면, 스스로 고장 났다고 표시합니다. 그래야 진짜로 믿을 수 있는 도구입니다.",
        "Mọi ứng dụng dự báo đều giả vờ tự tin. Cái này thì không. Nó nói “87%, và đây là thành tích của tôi” — hoặc “tôi không biết, và đây là bằng chứng không ai biết”. Nó thậm chí đặt một bộ sinh số ngẫu nhiên lượng tử lên băng ghế với cùng luật chơi: nếu sự ngẫu nhiên thuần túy lại được chấm là có kỹ năng, nó tự đánh dấu mình hỏng. Đó mới là công cụ bạn thực sự tin được."],
    "— we'd rather you use it, feed it your own patterns, and watch it earn your trust than pay for a promise. When it's proven it'll be $10 a year; get in now and you lock that in.": [
        "——比起让您为一个承诺付费，我们更希望您先用起来，把自己的规律喂给它，看着它一点点赢得您的信任。等它证明了自己，价格是每年 10 美元；现在加入就能锁定这个价。",
        "— preferimos que lo uses, le des tus propios patrones y veas cómo se gana tu confianza, en lugar de que pagues por una promesa. Cuando esté probado costará 10 $ al año; entra ahora y lo fijas.",
        "— 약속에 돈을 내기보다, 직접 써 보고 당신의 패턴을 알려주며 신뢰를 얻어가는 모습을 지켜보시길 바랍니다. 검증되면 연 10달러가 되며, 지금 합류하시면 그 가격이 고정됩니다.",
        "— chúng tôi muốn bạn dùng nó, cho nó biết thói quen của bạn, và xem nó dần chiếm được lòng tin, hơn là trả tiền cho một lời hứa. Khi đã chứng minh được, giá sẽ là 10 $/năm; tham gia bây giờ là bạn khóa được mức đó."],
    ", and no outcome is guaranteed — predictions can be wrong. You are responsible for your own decisions. Your personal data stays on your own device. © Plateau Strategy Solution Lab.": [
        "，也不保证任何结果——预测可能出错。您的决定由您自己负责。您的个人数据留在您自己的设备上。© Plateau Strategy Solution Lab。",
        ", y no se garantiza ningún resultado: las predicciones pueden fallar. Tú eres responsable de tus decisiones. Tus datos personales permanecen en tu dispositivo. © Plateau Strategy Solution Lab.",
        ", 어떤 결과도 보장하지 않습니다 — 예측은 틀릴 수 있습니다. 결정에 대한 책임은 본인에게 있습니다. 개인 데이터는 본인 기기에 남습니다. © Plateau Strategy Solution Lab.",
        ", và không kết quả nào được bảo đảm — dự báo có thể sai. Bạn tự chịu trách nhiệm cho quyết định của mình. Dữ liệu cá nhân của bạn ở lại trên thiết bị của bạn. © Plateau Strategy Solution Lab."],
})

# ---------------- text JavaScript writes at runtime ----------------
# A static reader of the HTML never sees these, so the coverage audit cannot
# catch them — but the translator's MutationObserver does translate them once
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
    "Address lookup unavailable right now — drag the black pin instead.": ["地址查询暂时不可用——请改为拖动黑色标记。", "La búsqueda de direcciones no está disponible ahora: arrastra el marcador negro.", "지금은 주소 검색을 할 수 없습니다 — 대신 검은 핀을 끌어 옮기세요.", "Hiện không tra cứu được địa chỉ — hãy kéo ghim đen thay thế."],
    "Build a route first, then offer it for sale.": ["请先排好一条路线，再挂出来出售。", "Crea primero una ruta y luego ponla a la venta.", "먼저 경로를 만든 다음 판매로 올리세요.", "Hãy tạo lộ trình trước, rồi mới rao bán."],
    "Could not record that just now — please try again in a moment.": ["刚才没能记录下来——请稍后再试。", "No se pudo registrar ahora mismo: inténtalo de nuevo en un momento.", "방금은 기록하지 못했습니다 — 잠시 후 다시 시도해 주세요.", "Chưa ghi nhận được lúc này — vui lòng thử lại sau giây lát."],
    "Enter a location first — type where you want to go, then choose.": ["请先输入地点——打上您想去的地方，再做选择。", "Primero introduce un lugar: escribe adónde quieres ir y luego elige.", "먼저 장소를 입력하세요 — 가고 싶은 곳을 입력한 뒤 선택하세요.", "Hãy nhập địa điểm trước — gõ nơi bạn muốn đến rồi chọn."],
    "Enter a location first, then choose.": ["请先输入地点，再做选择。", "Introduce primero un lugar y luego elige.", "먼저 장소를 입력한 뒤 선택하세요.", "Hãy nhập địa điểm trước, rồi chọn."],
    "Finding your current location…": ["正在获取您的当前位置…", "Buscando tu ubicación actual…", "현재 위치를 찾는 중…", "Đang tìm vị trí hiện tại của bạn…"],
    "Getting your exact location…": ["正在获取您的精确位置…", "Obteniendo tu ubicación exacta…", "정확한 위치를 가져오는 중…", "Đang lấy vị trí chính xác của bạn…"],
    "Getting your exact pickup location…": ["正在获取您的精确上车地点…", "Obteniendo tu punto exacto de recogida…", "정확한 픽업 위치를 가져오는 중…", "Đang lấy điểm đón chính xác của bạn…"],
    "Itinerary copied — paste it anywhere.": ["行程已复制——可以粘贴到任何地方。", "Itinerario copiado: pégalo donde quieras.", "일정을 복사했습니다 — 어디든 붙여넣으세요.", "Đã sao chép lịch trình — dán vào bất cứ đâu."],
    "Nothing to copy yet — add a stop first.": ["还没有可复制的内容——请先加一站。", "Aún no hay nada que copiar: añade primero una parada.", "복사할 내용이 없습니다 — 먼저 방문지를 추가하세요.", "Chưa có gì để sao chép — hãy thêm một điểm dừng trước."],
    "Nothing to print yet — add a stop first.": ["还没有可打印的内容——请先加一站。", "Aún no hay nada que imprimir: añade primero una parada.", "인쇄할 내용이 없습니다 — 먼저 방문지를 추가하세요.", "Chưa có gì để in — hãy thêm một điểm dừng trước."],
    "Nothing to share yet — add a stop first.": ["还没有可分享的内容——请先加一站。", "Aún no hay nada que compartir: añade primero una parada.", "공유할 내용이 없습니다 — 먼저 방문지를 추가하세요.", "Chưa có gì để chia sẻ — hãy thêm một điểm dừng trước."],
    "Nothing to undo.": ["没有可撤销的操作。", "No hay nada que deshacer.", "되돌릴 작업이 없습니다.", "Không có gì để hoàn tác."],
    "Preparing your ride…": ["正在为您准备用车…", "Preparando tu viaje…", "차량을 준비하는 중…", "Đang chuẩn bị chuyến xe của bạn…"],
    "Remove it from the trip first (Undo).": ["请先把它从行程中移除（撤销）。", "Quítalo primero del viaje (Deshacer).", "먼저 일정에서 제거하세요 (되돌리기).", "Hãy xóa khỏi chuyến đi trước (Hoàn tác)."],
    "Search unavailable right now — try again.": ["搜索暂时不可用——请重试。", "La búsqueda no está disponible ahora: inténtalo de nuevo.", "지금은 검색할 수 없습니다 — 다시 시도해 주세요.", "Hiện không tìm kiếm được — hãy thử lại."],
    "Start moved to where you are — the far-distance options are below the map.": ["起点已移到您所在的位置——远距离的选项在地图下方。", "El punto de partida se ha movido a donde estás; las opciones de larga distancia están debajo del mapa.", "출발 지점을 현재 위치로 옮겼습니다 — 장거리 옵션은 지도 아래에 있습니다.", "Điểm xuất phát đã chuyển tới nơi bạn đang ở — các lựa chọn đường dài nằm dưới bản đồ."],
    "This browser can’t share location — drag the black pin or type your pickup on the booking form.": [
        "此浏览器无法共享位置——请拖动黑色标记，或在预订表单里填写上车地点。",
        "Este navegador no puede compartir la ubicación: arrastra el marcador negro o escribe tu punto de recogida en el formulario de reserva.",
        "이 브라우저는 위치를 공유할 수 없습니다 — 검은 핀을 끌거나 예약 양식에 픽업 위치를 입력하세요.",
        "Trình duyệt này không chia sẻ được vị trí — hãy kéo ghim đen hoặc nhập điểm đón vào biểu mẫu đặt chỗ."],
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
    "Serving Seattle & Seattle–Tacoma International (SEA)": [
        "服务西雅图及西雅图-塔科马国际机场（SEA）",
        "Damos servicio a Seattle y al aeropuerto Seattle–Tacoma (SEA)",
        "시애틀 및 시애틀–타코마 국제공항(SEA) 운행",
        "Phục vụ Seattle & sân bay quốc tế Seattle–Tacoma (SEA)"],
    "Rides available 24/7, by reservation": ["全天 24 小时可预约用车", "Viajes disponibles 24/7, con reserva", "예약제로 24시간 이용 가능", "Có xe 24/7, theo đặt trước"],
    "Book a ride — $75 flat to SeaTac": ["预约用车——到西雅图机场统一 75 美元", "Reserva un viaje — 75 $ fijos a SeaTac", "차량 예약 — 시택 공항까지 정액 75달러", "Đặt xe — 75 $ trọn gói tới SeaTac"],
    "Service-area business — we come to you, there's no counter to visit.": [
        "我们是上门服务的商家——我们到您那里去，没有门店柜台可供到访。",
        "Negocio con zona de servicio: vamos a donde estés, no hay mostrador que visitar.",
        "출장 서비스 업체입니다 — 저희가 찾아가며, 방문할 카운터는 없습니다.",
        "Doanh nghiệp phục vụ tận nơi — chúng tôi đến chỗ bạn, không có quầy để ghé."],
})

# ---------------- the front page, rewritten as ink-on-paper ----------------
EXTRA.update({
    "Plateau Strategy Solution Lab · Seattle": ["Plateau Strategy Solution Lab · 西雅图", "Plateau Strategy Solution Lab · Seattle", "Plateau Strategy Solution Lab · 시애틀", "Plateau Strategy Solution Lab · Seattle"],
    "We build one business at a time": ["我们一次只做一门生意", "Construimos un negocio a la vez", "한 번에 하나의 사업을 세웁니다", "Chúng tôi xây từng doanh nghiệp một"],
    "Transportation is the one that runs today: flat-rate Tesla rides across Seattle, cars rented to drivers who earn with them, and trip-planning tools anyone can use free. It pays for what comes next. Every other arm is listed below with the stage it is honestly at — including the ones not finished.": [
        "今天真正在运转的是出行：西雅图全城的特斯拉一口价接送、租给司机让他们靠车挣钱，以及任何人都能免费使用的行程规划工具。它养着接下来要做的事。下面列出的每一块业务都如实标明所处阶段——包括那些还没做完的。",
        "El transporte es el que funciona hoy: viajes en Tesla a tarifa fija por Seattle, coches alquilados a conductores que ganan con ellos, y herramientas de planificación de viajes que cualquiera puede usar gratis. Paga lo que viene después. Cada una de las demás ramas aparece abajo con la etapa en la que honestamente está — incluidas las que no están terminadas.",
        "오늘 실제로 돌아가는 것은 교통입니다: 시애틀 전역의 정액 테슬라 운행, 그것으로 수입을 올리는 기사들에게 빌려주는 차량, 그리고 누구나 무료로 쓰는 여행 계획 도구. 이것이 다음에 올 것들을 먹여 살립니다. 나머지 각 부문은 아래에 지금 있는 단계 그대로 — 아직 끝나지 않은 것까지 포함해 — 적어 두었습니다.",
        "Vận tải là mảng đang thực sự chạy hôm nay: những chuyến Tesla giá trọn gói khắp Seattle, xe cho tài xế thuê để họ kiếm sống, và các công cụ lập kế hoạch chuyến đi ai cũng dùng miễn phí. Nó nuôi những gì đến sau. Mọi nhánh khác đều được liệt kê bên dưới kèm đúng giai đoạn thật của nó — kể cả những nhánh chưa xong."],
    "Book a ride": ["预约用车", "Reservar un viaje", "차량 예약", "Đặt xe"],
    "Partner with us": ["与我们合作", "Colabora con nosotros", "함께 협력하기", "Hợp tác với chúng tôi"],
    "Flat fare to Sea–Tac": ["到西雅图机场一口价", "Tarifa fija a Sea–Tac", "시택 공항까지 정액 요금", "Giá trọn gói tới Sea–Tac"],
    "Book any hour": ["任何时段都能预约", "Reserva a cualquier hora", "언제든 예약 가능", "Đặt bất kỳ giờ nào"],
    "Every vehicle": ["每一辆车", "Todos los vehículos", "모든 차량", "Mọi xe"],
    "THE COMPANY": ["公司", "LA EMPRESA", "회사", "CÔNG TY"],
    "Four arms, at four different stages": ["四块业务，四个不同阶段", "Cuatro ramas, en cuatro etapas distintas", "네 개의 부문, 네 개의 서로 다른 단계", "Bốn nhánh, ở bốn giai đoạn khác nhau"],
    "One business pays for the next. That only means something if we say plainly which ones are earning today and which are still being built — so we do.": [
        "一门生意养下一门。但这句话只有在我们如实说出哪些今天在赚钱、哪些还在搭建时才有意义——所以我们照实说。",
        "Un negocio paga el siguiente. Eso solo significa algo si decimos con claridad cuáles ganan hoy y cuáles se están construyendo todavía — así que lo decimos.",
        "하나의 사업이 다음 사업을 먹여 살립니다. 그 말은 어느 것이 오늘 벌고 있고 어느 것이 아직 만들어지는 중인지 분명히 말할 때에만 의미가 있습니다 — 그래서 그렇게 합니다.",
        "Doanh nghiệp này nuôi doanh nghiệp kia. Điều đó chỉ có ý nghĩa nếu chúng tôi nói rõ mảng nào đang kiếm được tiền hôm nay và mảng nào còn đang xây — nên chúng tôi nói thẳng."],
    "Operating": ["运营中", "En operación", "운영 중", "Đang vận hành"],
    "Flat-rate Tesla rides in Seattle at $75 to Sea–Tac, cars rented to drivers who keep the fare, and a commission programme for hotels and agents. This is the business that earns.": [
        "西雅图的特斯拉一口价接送，到机场 75 美元；把车租给司机，车费归他们；另有面向酒店和代理人的佣金计划。这是真正在赚钱的那门生意。",
        "Viajes en Tesla a tarifa fija en Seattle, 75 $ a Sea–Tac, coches alquilados a conductores que se quedan la tarifa, y un programa de comisiones para hoteles y agentes. Este es el negocio que gana dinero.",
        "시애틀에서 시택 공항까지 75달러 정액 테슬라 운행, 요금을 그대로 가져가는 기사에게 빌려주는 차량, 그리고 호텔·에이전트를 위한 수수료 프로그램. 실제로 돈을 버는 사업입니다.",
        "Những chuyến Tesla giá trọn gói ở Seattle, 75 $ tới Sea–Tac, xe cho tài xế thuê và họ giữ trọn tiền cước, cùng chương trình hoa hồng cho khách sạn và đại lý. Đây là mảng đang thực sự kiếm ra tiền."],
    "See how it works →": ["看它如何运作 →", "Ver cómo funciona →", "작동 방식 보기 →", "Xem cách hoạt động →"],
    "Running": ["已上线", "En marcha", "가동 중", "Đang chạy"],
    "Operations platform": ["运营平台", "Plataforma de operaciones", "운영 플랫폼", "Nền tảng vận hành"],
    "Dispatch, invoicing, driver paperwork and the trip-planning tools — built in-house rather than rented, so the customer relationship and the data stay with us.": [
        "调度、开票、司机文件和行程规划工具——都是自己做的，不是租来的，所以客户关系和数据都留在我们手里。",
        "Central, facturación, papeleo de conductores y las herramientas de planificación — construidos en casa en vez de alquilados, de modo que la relación con el cliente y los datos se quedan con nosotros.",
        "배차, 청구, 기사 서류, 여행 계획 도구 — 빌려 쓰지 않고 직접 만들었기에 고객 관계와 데이터가 우리에게 남습니다.",
        "Điều phối, xuất hóa đơn, giấy tờ tài xế và các công cụ lập kế hoạch — tự làm chứ không đi thuê, nên quan hệ khách hàng và dữ liệu ở lại với chúng tôi."],
    "See the platform →": ["查看平台 →", "Ver la plataforma →", "플랫폼 보기 →", "Xem nền tảng →"],
    "In development": ["开发中", "En desarrollo", "개발 중", "Đang phát triển"],
    "Real estate": ["房地产", "Bienes raíces", "부동산", "Bất động sản"],
    "Mixed-use development, at drawing stage. Nothing built, nothing leased, nothing offered — the plans are published as they stand.": [
        "综合开发项目，目前处于图纸阶段。没有建成，没有出租，也没有对外发售——图纸就按现状公开。",
        "Desarrollo de uso mixto, en fase de planos. Nada construido, nada arrendado, nada ofrecido: los planos se publican tal como están.",
        "복합 용도 개발, 아직 도면 단계입니다. 지은 것도, 임대한 것도, 내놓은 것도 없습니다 — 계획은 있는 그대로 공개합니다.",
        "Dự án phức hợp, đang ở giai đoạn bản vẽ. Chưa xây, chưa cho thuê, chưa chào bán — bản vẽ được công bố đúng như hiện trạng."],
    "See the drawings →": ["查看图纸 →", "Ver los planos →", "도면 보기 →", "Xem bản vẽ →"],
    "Research": ["研究", "Investigación", "연구", "Nghiên cứu"],
    "An automated trading research project in private verification, building an audited record. Nothing is for sale and no money is accepted — you can follow the results.": [
        "一个处于私下验证阶段的自动化交易研究项目，正在积累可审计的记录。不出售任何东西，也不接受任何资金——您可以关注结果。",
        "Un proyecto de investigación de trading automatizado en verificación privada, construyendo un historial auditado. No se vende nada y no se acepta dinero: puedes seguir los resultados.",
        "비공개 검증 단계에 있는 자동 매매 연구 프로젝트로, 감사 가능한 기록을 쌓고 있습니다. 판매하는 것도, 받는 돈도 없습니다 — 결과를 지켜보실 수 있습니다.",
        "Một dự án nghiên cứu giao dịch tự động đang trong giai đoạn xác minh riêng tư, xây dựng hồ sơ có thể kiểm toán. Không bán gì và không nhận tiền — bạn có thể theo dõi kết quả."],
    "More financial products coming soon.": ["更多金融产品即将推出。", "Próximamente más productos financieros.", "더 많은 금융 상품이 곧 나옵니다.", "Sắp có thêm các sản phẩm tài chính."],
    "A Seattle car service: flat-rate Tesla rides to Sea–Tac and around the city, plus trip-planning tools that are free to use.": [
        "西雅图的一家用车服务：到机场及市内各处的特斯拉一口价接送，外加可免费使用的行程规划工具。",
        "Un servicio de coches en Seattle: viajes en Tesla a tarifa fija a Sea–Tac y por la ciudad, más herramientas de planificación gratuitas.",
        "시애틀의 차량 서비스입니다: 시택 공항과 시내를 오가는 정액 테슬라 운행, 그리고 무료로 쓰는 여행 계획 도구.",
        "Một dịch vụ xe tại Seattle: những chuyến Tesla giá trọn gói tới Sea–Tac và quanh thành phố, cùng các công cụ lập kế hoạch miễn phí."],
    "Flat-rate Tesla rides, Seattle and Sea–Tac.": ["特斯拉一口价接送，西雅图市内及机场。", "Viajes en Tesla a tarifa fija, Seattle y Sea–Tac.", "정액 테슬라 운행, 시애틀과 시택 공항.", "Chuyến Tesla giá trọn gói, Seattle và Sea–Tac."],
    "Optional — fills your name and email. You can just type them instead.": [
        "可选——会自动填入您的姓名和邮箱。您也可以直接手动输入。",
        "Opcional: rellena tu nombre y correo. También puedes escribirlos tú.",
        "선택 사항 — 이름과 이메일이 자동으로 채워집니다. 직접 입력하셔도 됩니다.",
        "Tùy chọn — tự điền tên và email của bạn. Bạn cũng có thể tự gõ."],
    "or enter your details": ["或手动填写您的信息", "o introduce tus datos", "또는 직접 정보 입력", "hoặc tự nhập thông tin của bạn"],
    "Seattle–Tacoma International Airport (SEA)": ["西雅图-塔科马国际机场（SEA）", "Aeropuerto Internacional Seattle–Tacoma (SEA)", "시애틀–타코마 국제공항(SEA)", "Sân bay quốc tế Seattle–Tacoma (SEA)"],
})
EXTRA_SKIP |= {"1200 Pine St, Seattle", "e.g. AS 1234 (optional)"}


# ---------------------------------------------------------------------------
# Coverage pass: strings a visitor navigates by that were still English.
# Found by rendering every page, collecting visible text, and subtracting what
# the dictionary already held — 73% covered, so roughly one line in four came
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
    "Airport Pickup (flat) — $75": ["机场接送（一口价）— $75", "Recogida en aeropuerto (fija) — $75", "공항 픽업(정액) — $75", "Đón sân bay (giá cố định) — 75 $"],
    "Downtown Transfer — $45": ["市区接送 — $45", "Traslado al centro — $45", "다운타운 이동 — $45", "Đưa đón trung tâm — 45 $"],
    "Hourly (per hour) — $65": ["按小时计（每小时）— $65", "Por hora — $65", "시간제(시간당) — $65", "Theo giờ — 65 $"],

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
    "Nobody has reported a gift yet — the zero is honest.": [
        "目前还没有人报告捐赠——这个零是真实的。",
        "Nadie ha reportado una donación todavía; el cero es honesto.",
        "아직 기부를 알려온 분이 없습니다 — 이 0은 정직한 숫자입니다.",
        "Chưa có ai báo về khoản đóng góp nào — số 0 này là thật."],
    "🇺🇸 Give at the U.S. Treasury (Pay.gov) →": [
        "🇺🇸 通过美国财政部捐赠（Pay.gov）→",
        "🇺🇸 Donar en el Tesoro de EE. UU. (Pay.gov) →",
        "🇺🇸 미국 재무부에 기부하기 (Pay.gov) →",
        "🇺🇸 Đóng góp tại Kho bạc Hoa Kỳ (Pay.gov) →"],

    # --- real-estate blueprint sheet ---
    "PROJECT · PLATEAU STRATEGY": ["项目 · PLATEAU STRATEGY", "PROYECTO · PLATEAU STRATEGY", "프로젝트 · PLATEAU STRATEGY", "DỰ ÁN · PLATEAU STRATEGY"],
    "Mixed-use development · Sheet RE-01": ["综合开发项目 · 图纸 RE-01", "Desarrollo de uso mixto · Plano RE-01", "복합 개발 · 도면 RE-01", "Phát triển đa chức năng · Bản vẽ RE-01"],
    "FIG 1 — MIXED-USE HUB · FRONT ELEVATION (NTS)": [
        "图 1 — 综合体 · 正立面（无比例）",
        "FIG 1 — CENTRO DE USO MIXTO · ALZADO FRONTAL (SIN ESCALA)",
        "그림 1 — 복합 허브 · 정면도 (축척 없음)",
        "HÌNH 1 — TỔ HỢP ĐA CHỨC NĂNG · MẶT ĐỨNG (KHÔNG TỶ LỆ)"],
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
# REGISTER PASS — corrections, not new strings.
#
# The first translations were fluent but wrong in tone. The English here is
# deliberately plain, and plain English was rendered as colloquial Chinese —
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

    "Transportation is the one that runs today: flat-rate Tesla rides across Seattle, cars rented to drivers who earn with them, and trip-planning tools anyone can use free. It pays for what comes next. Every other arm is listed below with the stage it is honestly at — including the ones not finished.": [
        "目前真正在运营的是出行业务：覆盖西雅图全城的特斯拉固定价格接送、面向司机的车辆租赁，以及所有人都可免费使用的行程规划工具。它为后续业务提供资金。下方列出的每一项业务都如实标注了所处阶段——包括尚未完成的部分。",
        "El transporte es lo que está en marcha hoy: traslados en Tesla con tarifa fija por todo Seattle, vehículos alquilados a conductores que ganan con ellos y herramientas de planificación de viajes que cualquiera puede usar gratis. Financia lo que viene después. Cada una de las demás áreas aparece abajo con la etapa en la que realmente está, incluidas las que no están terminadas.",
        "지금 실제로 운영 중인 것은 교통 사업입니다. 시애틀 전역의 정액 요금 테슬라 이동, 기사에게 대여하는 차량, 그리고 누구나 무료로 쓸 수 있는 여행 계획 도구입니다. 이 사업이 다음 단계의 자금을 댑니다. 나머지 사업은 아래에 각자 실제로 놓인 단계와 함께 정리해 두었습니다 — 아직 끝나지 않은 것들까지 포함해서.",
        "Mảng thực sự đang vận hành hôm nay là vận tải: các chuyến Tesla giá cố định khắp Seattle, xe cho tài xế thuê để kiếm thu nhập, và công cụ lập kế hoạch chuyến đi ai cũng dùng được miễn phí. Nó cấp vốn cho những gì đến sau. Mỗi mảng còn lại được liệt kê bên dưới kèm giai đoạn thực tế của nó — kể cả những mảng chưa hoàn thành."],

    "Four arms, at four different stages": [
        "四项业务，四个不同阶段",
        "Cuatro áreas, en cuatro etapas distintas",
        "네 개의 사업, 각기 다른 네 단계",
        "Bốn mảng, ở bốn giai đoạn khác nhau"],

    "One business pays for the next. That only means something if we say plainly which ones are earning today and which are still being built — so we do.": [
        "一项业务为下一项提供资金。但这句话只有在我们如实说明哪些业务今天已在盈利、哪些仍在建设，才有意义——所以我们如实说明。",
        "Un negocio financia al siguiente. Eso solo significa algo si decimos con claridad cuáles generan ingresos hoy y cuáles siguen en construcción — así que lo decimos.",
        "하나의 사업이 다음 사업의 자금을 댑니다. 그 말은 오늘 수익을 내는 사업과 아직 만드는 중인 사업을 분명히 밝혀야만 의미가 있습니다 — 그래서 밝힙니다.",
        "Mảng này cấp vốn cho mảng kế tiếp. Điều đó chỉ có ý nghĩa nếu chúng tôi nói rõ mảng nào đang tạo doanh thu hôm nay và mảng nào vẫn đang xây dựng — nên chúng tôi nói rõ."],

    "Flat-rate Tesla rides in Seattle at $75 to Sea–Tac, cars rented to drivers who keep the fare, and a commission programme for hotels and agents. This is the business that earns.": [
        "西雅图的特斯拉固定价格接送，至机场 75 美元；车辆租赁给司机，车费归司机所有；并设有面向酒店与代理商的佣金计划。这是目前真正产生收入的业务。",
        "Traslados en Tesla con tarifa fija en Seattle, 75 $ al aeropuerto; vehículos alquilados a conductores que se quedan con la tarifa; y un programa de comisiones para hoteles y agentes. Este es el negocio que genera ingresos.",
        "시애틀에서 공항까지 75달러 정액 요금의 테슬라 이동, 요금을 기사가 갖는 차량 대여, 그리고 호텔·에이전트를 위한 수수료 프로그램. 실제로 수익을 내는 사업입니다.",
        "Các chuyến Tesla giá cố định tại Seattle, 75 $ tới sân bay; xe cho tài xế thuê và tài xế giữ toàn bộ cước; cùng chương trình hoa hồng cho khách sạn và đại lý. Đây là mảng thực sự tạo doanh thu."],

    # --- status labels: 已上线 was software-launch jargon and did not match
    #     the others; 研究 alone is a noun, not a stage.
    "Running":  ["运行中", "En marcha", "가동 중", "Đang chạy"],
    "Research": ["研究阶段", "En investigación", "연구 단계", "Giai đoạn nghiên cứu"],

    # --- 一口价 is what a market trader says. A car service quotes 固定价格.
    "Flat fare to Sea–Tac": ["至西雅图机场固定价格", "Tarifa fija al aeropuerto", "공항까지 정액 요금", "Giá cố định tới sân bay"],
    "Book any hour": ["全天候可预约", "Reserva a cualquier hora", "언제든 예약 가능", "Đặt xe bất kỳ giờ nào"],
    # --- sits under the word "Tesla"; 每一辆车 on its own says nothing.
    "Every vehicle": ["全部车辆", "Toda la flota", "전 차량", "Toàn bộ xe"],

    "Operations platform": ["运营平台", "Plataforma de operaciones", "운영 플랫폼", "Nền tảng vận hành"],
    "Dispatch, invoicing, driver paperwork and the trip-planning tools — built in-house rather than rented, so the customer relationship and the data stay with us.": [
        "调度、开票、司机资料与行程规划工具，均为自研而非外购，因此客户关系与数据都留在我们自己手中。",
        "Despacho, facturación, documentación de conductores y las herramientas de planificación — desarrollados en casa y no alquilados, así la relación con el cliente y los datos se quedan con nosotros.",
        "배차, 청구, 기사 서류, 여행 계획 도구까지 임대가 아니라 자체 개발했습니다. 그래서 고객 관계와 데이터가 우리에게 남습니다.",
        "Điều phối, xuất hóa đơn, hồ sơ tài xế và công cụ lập kế hoạch — tự xây dựng thay vì đi thuê, nên quan hệ khách hàng và dữ liệu vẫn thuộc về chúng tôi."],

    "Mixed-use development, at drawing stage. Nothing built, nothing leased, nothing offered — the plans are published as they stand.": [
        "综合开发项目，目前处于图纸阶段。尚未动工、尚未招租、尚未对外发售——图纸按现状公开。",
        "Desarrollo de uso mixto, en fase de planos. Nada construido, nada arrendado, nada ofrecido — los planos se publican tal como están.",
        "복합 개발 사업으로, 현재 도면 단계입니다. 지은 것도, 임대한 것도, 판매하는 것도 없습니다 — 도면은 있는 그대로 공개합니다.",
        "Dự án phát triển đa chức năng, đang ở giai đoạn bản vẽ. Chưa xây, chưa cho thuê, chưa chào bán — bản vẽ được công bố đúng hiện trạng."],

    "An automated trading research project in private verification, building an audited record. Nothing is for sale and no money is accepted — you can follow the results.": [
        "一个自动交易研究项目，目前处于内部验证阶段，正在积累可审计的记录。不对外销售，也不接受任何资金——您可以关注结果。",
        "Un proyecto de investigación de trading automatizado en verificación privada, construyendo un historial auditado. No hay nada a la venta ni se acepta dinero — puedes seguir los resultados.",
        "비공개 검증 단계의 자동 매매 연구 프로젝트로, 감사 가능한 기록을 쌓는 중입니다. 판매하는 것도 없고 자금도 받지 않습니다 — 결과만 지켜보실 수 있습니다.",
        "Một dự án nghiên cứu giao dịch tự động đang trong giai đoạn kiểm chứng nội bộ, tích lũy hồ sơ có thể kiểm toán. Không bán gì và không nhận tiền — bạn có thể theo dõi kết quả."],

    "A Seattle car service: flat-rate Tesla rides to Sea–Tac and around the city, plus trip-planning tools that are free to use.": [
        "西雅图的用车服务：特斯拉固定价格接送，往返机场及市区，另有免费使用的行程规划工具。",
        "Un servicio de coche en Seattle: traslados en Tesla con tarifa fija al aeropuerto y por la ciudad, más herramientas de planificación de viajes gratuitas.",
        "시애틀의 차량 서비스입니다. 공항과 시내를 오가는 정액 요금 테슬라 이동, 그리고 무료로 쓰는 여행 계획 도구.",
        "Dịch vụ xe tại Seattle: các chuyến Tesla giá cố định tới sân bay và quanh thành phố, cùng công cụ lập kế hoạch chuyến đi miễn phí."],

    "Flat-rate Tesla rides, Seattle and Sea–Tac.": [
        "特斯拉固定价格接送，覆盖西雅图与机场。",
        "Traslados en Tesla con tarifa fija, Seattle y el aeropuerto.",
        "정액 요금 테슬라 이동 — 시애틀과 공항.",
        "Chuyến Tesla giá cố định, Seattle và sân bay."],
})

# Two the register pass missed on the first sweep.
EXTRA.update({
    "Airport Pickup (flat) — $75": [
        "机场接送（固定价格）— $75", "Recogida en aeropuerto (tarifa fija) — $75",
        "공항 픽업(정액) — $75", "Đón sân bay (giá cố định) — 75 $"],

    # 输血/加力/滚雪球 is three metaphors in one sentence, and 每一块业务 again.
    # The English is a plain claim; the Chinese was written like ad copy.
    "We started with transportation: affordable Tesla rentals that turn everyday drivers into earners and everyday riders into loyal clients. From there, each part of our business funds and strengthens the next — operations, real estate, finance, and reinvestment — a closed loop where revenue compounds instead of leaking away.": [
        "我们从出行业务起步：以可负担的特斯拉租赁，让普通司机获得收入，也让乘客愿意再次乘坐。在此基础上，每一项业务为下一项提供资金——出行、房地产、金融、再投资——形成一个闭环，收入在其中不断累积，而不是外流。",
        "Empezamos por el transporte: alquileres de Tesla asequibles que convierten a conductores corrientes en personas que ganan y a cada pasajero en cliente recurrente. A partir de ahí, cada negocio financia al siguiente — transporte, inmobiliario, finanzas, reinversión — formando un circuito cerrado donde los ingresos se acumulan en lugar de escaparse.",
        "우리는 교통에서 시작했습니다. 합리적인 가격의 테슬라 대여로 평범한 기사가 수입을 얻고, 승객은 다시 찾게 됩니다. 그 위에서 각 사업이 다음 사업의 자금을 댑니다 — 교통, 부동산, 금융, 재투자 — 수익이 빠져나가지 않고 쌓이는 닫힌 순환을 이룹니다.",
        "Chúng tôi khởi đầu từ vận tải: cho thuê Tesla với giá hợp lý để tài xế bình thường có thu nhập và hành khách quay lại. Từ đó, mỗi mảng cấp vốn cho mảng kế tiếp — vận tải, bất động sản, tài chính, tái đầu tư — tạo thành vòng khép kín nơi doanh thu tích lũy thay vì thất thoát."],
})


# ---------------------------------------------------------------------------
# VOICE PASS.
#
# The register pass fixed the wrong words and left the wrong shape. Every
# sentence still had English bones — subject, verb, object, in English order,
# with Chinese vocabulary laid over the top. Accurate, professional, and with
# nothing alive in it. A reader can feel that even when nothing is wrong.
#
# Chinese carries voice in rhythm and balance rather than in word choice: short
# clauses that answer each other, a comma placed to make a beat, a sentence that
# lands on its weight instead of trailing off in qualifiers. The English here is
# calm, concrete and slightly dry — confident enough not to sell. That voice
# exists in Chinese; it just cannot be reached by translating in order.
#
# So these are rewritten from the meaning, not from the sentence.
#   一次只做好一项业务 — 好 is the whole point: not one at a time, one done properly
#   眼下真正在运转的     — 眼下 is how a person says "right now" with dignity
#   都是自己写的，不是租来的 — plain, proud, and unmistakably not a translation
#   图纸是什么样，就公开什么样 — the parallel is the promise
#   不收一分钱           — "a single cent", which 不接受任何资金 was too polite to say
#
# Spanish redone on the same principle. Korean and Vietnamese are improved but
# NOT verified — I can reason about their register, not hear their voice, and
# they need a reader who can.
# ---------------------------------------------------------------------------
EXTRA.update({
    "We build one business at a time": [
        "一次只做好一项业务",
        "Un negocio a la vez, hecho bien",
        "한 번에 하나의 사업을, 제대로",
        "Mỗi lần chỉ làm tốt một mảng"],

    "Transportation is the one that runs today: flat-rate Tesla rides across Seattle, cars rented to drivers who earn with them, and trip-planning tools anyone can use free. It pays for what comes next. Every other arm is listed below with the stage it is honestly at — including the ones not finished.": [
        "眼下真正在运转的只有出行一项：西雅图全城的特斯拉固定价格接送、租给司机的车，以及一套谁都能免费用的行程规划工具。它挣来的钱，投向后面几项。下面每一项业务都写明了所处的阶段——没做完的，也一并写明。",
        "Hoy solo hay una parte en marcha: el transporte. Traslados en Tesla con tarifa fija por todo Seattle, coches alquilados a conductores que viven de ellos, y herramientas de planificación que cualquiera usa gratis. Lo que gana paga lo que viene después. Cada una de las demás aparece abajo con la etapa en la que está de verdad — también las que no están terminadas.",
        "지금 실제로 돌아가는 건 교통 하나입니다. 시애틀 전역을 다니는 정액 요금 테슬라, 기사에게 빌려주는 차, 그리고 누구나 공짜로 쓰는 여행 계획 도구. 여기서 번 돈이 다음 사업으로 갑니다. 나머지는 아래에 지금 서 있는 자리를 그대로 적어 두었습니다 — 아직 끝나지 않은 것까지.",
        "Hiện chỉ có một mảng thực sự chạy: vận tải. Những chuyến Tesla giá cố định khắp Seattle, xe cho tài xế thuê để sống bằng nghề, và bộ công cụ lập kế hoạch ai cũng dùng miễn phí. Tiền nó kiếm được đổ vào những mảng sau. Mỗi mảng còn lại đều ghi rõ đang ở đâu — kể cả mảng chưa xong."],

    "Four arms, at four different stages": [
        "四项业务，四个阶段",
        "Cuatro áreas, cuatro etapas",
        "네 개의 사업, 네 개의 단계",
        "Bốn mảng, bốn giai đoạn"],

    "One business pays for the next. That only means something if we say plainly which ones are earning today and which are still being built — so we do.": [
        "一项撑起下一项。这话要站得住，就得说明白：哪几项今天在挣钱，哪几项还在建。所以我们说明白。",
        "Un negocio sostiene al siguiente. Para que eso signifique algo hay que decir cuál gana hoy y cuál sigue en obras. Así que lo decimos.",
        "하나가 다음 하나를 받칩니다. 그 말이 서려면 어느 것이 오늘 벌고 어느 것이 아직 짓는 중인지 밝혀야 합니다. 그래서 밝힙니다.",
        "Mảng này đỡ mảng kia. Muốn câu đó đứng vững thì phải nói rõ: mảng nào hôm nay kiếm ra tiền, mảng nào còn đang dựng. Nên chúng tôi nói rõ."],

    "Flat-rate Tesla rides in Seattle at $75 to Sea–Tac, cars rented to drivers who keep the fare, and a commission programme for hotels and agents. This is the business that earns.": [
        "西雅图的特斯拉接送，到机场固定 75 美元；车租给司机，车费全归他们；酒店和代理商荐客，按单拿佣金。这一项，是眼下真正在挣钱的。",
        "Traslados en Tesla en Seattle, 75 $ fijos al aeropuerto; coches alquilados a conductores que se quedan la tarifa; hoteles y agentes cobran comisión por cada cliente. Esta es la parte que gana dinero.",
        "시애틀의 테슬라 이동, 공항까지 75달러 정액. 차는 기사에게 빌려주고 요금은 기사가 다 가집니다. 호텔과 에이전트는 손님을 보내고 건당 수수료를 받습니다. 지금 돈을 버는 건 이 사업입니다.",
        "Chuyến Tesla ở Seattle, cố định 75 $ tới sân bay; xe cho tài xế thuê, cước tài xế giữ hết; khách sạn và đại lý giới thiệu khách, ăn hoa hồng theo chuyến. Đây là mảng đang thực sự kiếm ra tiền."],

    "Dispatch, invoicing, driver paperwork and the trip-planning tools — built in-house rather than rented, so the customer relationship and the data stay with us.": [
        "调度、开票、司机资料、行程规划工具，都是自己写的，不是租来的。所以客户和数据，都留在自己手里。",
        "Despacho, facturación, papeleo de conductores, herramientas de planificación: escritos por nosotros, no alquilados. Por eso el cliente y los datos se quedan aquí.",
        "배차, 청구, 기사 서류, 여행 계획 도구 — 빌린 게 아니라 직접 만들었습니다. 그래서 고객도 데이터도 우리에게 남습니다.",
        "Điều phối, hóa đơn, giấy tờ tài xế, công cụ lập kế hoạch — tự viết, không đi thuê. Nhờ vậy khách hàng và dữ liệu vẫn ở lại với chúng tôi."],

    "Mixed-use development, at drawing stage. Nothing built, nothing leased, nothing offered — the plans are published as they stand.": [
        "综合开发项目，还在图纸上。没有动工，没有招租，没有对外发售——图纸是什么样，就公开什么样。",
        "Desarrollo de uso mixto, todavía sobre el plano. Nada construido, nada arrendado, nada a la venta — los planos se publican tal cual están.",
        "복합 개발 사업, 아직 도면 위에 있습니다. 지은 것 없고, 임대한 것 없고, 파는 것 없습니다 — 도면은 있는 그대로 공개합니다.",
        "Dự án đa chức năng, còn nằm trên bản vẽ. Chưa xây, chưa cho thuê, chưa bán — bản vẽ thế nào thì công bố thế ấy."],

    "An automated trading research project in private verification, building an audited record. Nothing is for sale and no money is accepted — you can follow the results.": [
        "一个自动交易的研究项目，还在内部验证，正把成绩记成一本可审计的账。不卖任何东西，也不收一分钱——结果公开，您看着就是。",
        "Un proyecto de investigación en trading automatizado, aún en verificación privada, levantando un historial auditable. No se vende nada y no se acepta dinero — los resultados están a la vista.",
        "자동 매매 연구 프로젝트입니다. 아직 내부 검증 중이고, 감사받을 수 있는 기록을 쌓는 중입니다. 파는 것도 없고 돈도 받지 않습니다 — 결과만 공개합니다.",
        "Một dự án nghiên cứu giao dịch tự động, còn trong kiểm chứng nội bộ, đang ghi thành tích thành một sổ có thể kiểm toán. Không bán gì, không nhận một đồng nào — kết quả công khai, bạn cứ nhìn."],

    "A Seattle car service: flat-rate Tesla rides to Sea–Tac and around the city, plus trip-planning tools that are free to use.": [
        "西雅图的用车服务：特斯拉接送，往返机场与市区，价格固定；另有一套免费的行程规划工具。",
        "Un servicio de coche en Seattle: traslados en Tesla al aeropuerto y por la ciudad, con tarifa fija, más herramientas de planificación gratuitas.",
        "시애틀의 차량 서비스입니다. 공항과 시내를 오가는 정액 요금 테슬라, 그리고 무료로 쓰는 여행 계획 도구.",
        "Dịch vụ xe tại Seattle: chuyến Tesla giá cố định tới sân bay và quanh thành phố, kèm bộ công cụ lập kế hoạch miễn phí."],

    "The quote is the fare — no surge": [
        "报价就是车费，不加价",
        "El precio que ves es el que pagas — sin recargos",
        "견적이 곧 요금 — 할증 없음",
        "Báo giá là giá đi — không phụ thu"],
    "flat to Sea–Tac": ["到机场，固定价", "fijos al aeropuerto", "공항까지 정액", "cố định tới sân bay"],
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
