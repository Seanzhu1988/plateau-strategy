# -*- coding: utf-8 -*-
import json, os, sys, re
from html.parser import HTMLParser

SCRATCH = os.path.dirname(os.path.abspath(__file__))
# The project this reads pages from and writes i18n.js back into.
# Was hardcoded to one laptop, so the generator could not be run anywhere
# else — including from the repo itself. Falls back to the directory this
# file sits in, which is the repo in every case that matters.
_MAC = "/Users/xiaojunzhu/Claude/Projects/Plateau Strategy"
PROJ = os.environ.get("PROJ_DIR") or (_MAC if os.path.isdir(_MAC) else SCRATCH)

# ---- pages whose visible text we translate (add more here to extend coverage) ----
COVERED = ["landing-page.html", "booking.html", "renter.html", "agent.html",
           "dispatch.html", "partners.html", "books.html", "articles.html",
           # second pass: the free tools and everything else a visitor can open
           "trip-planner.html", "trips.html", "guide-studio.html",
           "destination-book.html", "road-trip.html", "favorite-place.html",
           "board.html", "archive.html", "driver.html",
           "deflator.html", "factor-clock.html"]

class _Extract(HTMLParser):
    def __init__(s):
        super().__init__(); s.skip = 0; s.out = []
    def handle_starttag(s, t, attrs):
        if t in ("script", "style", "noscript"): s.skip += 1
        d = dict(attrs)
        for a in ("placeholder", "title"):
            if d.get(a): s.out.append(d[a].strip())
    def handle_endtag(s, t):
        if t in ("script", "style", "noscript") and s.skip > 0: s.skip -= 1
    def handle_data(s, data):
        if s.skip: return
        v = re.sub(r"\s+", " ", data).strip()
        if v: s.out.append(v)

strings = []
for page in COVERED:
    p = _Extract(); p.feed(open(os.path.join(PROJ, page), encoding="utf-8").read())
    for v in p.out:
        if not re.search("[A-Za-z]", v): continue
        if v not in strings: strings.append(v)

# ---- strings intentionally left in English (brand / example values) ----
SKIP = {
    "Plateau Strategy Solution Lab - Integrated Business Ecosystem",
    "Plateau Strategy Solution Lab",
    "Plateau Deflator",
    "your@email.com", "you@email.com", "(415) 555-0100",
    "••••••••",
    "5YJ3E1EA7PF000000", "Diaz", "Lopez Travel Agency", "Lopez", "AGT-7K2M",
    # booking page
    "Book a Reservation Ride — Plateau Strategy Solution Lab",
    "Jane Smith", "jane@email.com", "123 Market St, San Francisco",
    "SFO International Airport", "e.g. UA 1234 (optional)",
    "Two suitcases, call on arrival…", "RES_20260701_001",
    # page <title>s (in <head>, never rendered in body — not translated at runtime)
    "Driver Portal — Plateau Strategy Solution Lab",
    "Agent Portal — Plateau Strategy Solution Lab",
    "Dispatch — Plateau Strategy Solution Lab",
    "Atlas — Partner Pipeline · Plateau Strategy Solution Lab",
    "Books & Taxes — Plateau Strategy Solution Lab",
    "Articles & Proposals — Plateau Strategy Solution Lab",
    # example / placeholder values shown in inputs
    "Carlos Diaz", "carlos@email.com", "Tesla", "Model 3", "White", "8ABC123",
    "Xiaojun Zhu", "Maria Lopez", "maria@email.com", "Daniel Park", "daniel@email.com",
    "500 Howard St, Seattle", "SeaTac Airport", "AGT-••••", "Cruise Port Transfer",
    "sales@...", "example.com",
    "Airport customer", "customer@email.com", "Hotel lobby",
    "e.g. GEICO, State Farm", "Policy #", "e.g. front of license, 2026 renewal",
    # proper nouns kept as-is
    "Atlas", "Atlas →", '"Connect to Square"',
    # partner outreach template — sent to businesses in English, kept verbatim
    "Hi [Name], I run Plateau Strategy Solution Lab, a licensed Seattle-area car service — flat-rate $75 airport pickups to and from SeaTac. Your [guests / clients] often need reliable airport transportation, and I'd like to make that easy for you and profitable. Through our Agent program, every time you refer a customer to us, you earn a flat $15 commission on their completed ride. No cost and no obligation — you share our booking link or give guests your agent code, and you get paid per ride. It takes about two minutes to sign up and get your code. Could we set up a quick call, or would you like me to send the sign-up link? Thank you, Sean (Xiaojun) Zhu Plateau Strategy Solution Lab (917) 588-6013 · seanzhu1988115@gmail.com",
}

# ---- translations: english -> [zh, es, ko, vi] ----
TR = {
"← Back": ["← 返回","← Atrás","← 뒤로","← Quay lại"],
"☰ Sections": ["☰ 版块","☰ Secciones","☰ 섹션","☰ Mục"],
"Articles": ["文章","Artículos","아티클","Bài viết"],
"Dispatch": ["调度中心","Central","배차","Điều phối"],
"Book a Ride": ["预约用车","Reservar un viaje","차량 예약","Đặt xe"],
"Overview": ["概览","Resumen","개요","Tổng quan"],
"Transportation": ["交通出行","Transporte","교통","Vận tải"],
"Operations": ["运营","Operaciones","운영","Vận hành"],
"Real Estate": ["房地产","Bienes raíces","부동산","Bất động sản"],
"Finance": ["金融","Finanzas","금융","Tài chính"],
"Reinvestment": ["再投资","Reinversión","재투자","Tái đầu tư"],
"Welcome to Plateau Strategy Solution Lab": ["欢迎来到 Plateau Strategy Solution Lab","Bienvenido a Plateau Strategy Solution Lab","Plateau Strategy Solution Lab에 오신 것을 환영합니다","Chào mừng đến với Plateau Strategy Solution Lab"],
"An integrated business ecosystem creating opportunity for the people who ride, drive, and grow with us.": ["一个环环相扣的商业生态，为搭我们车、替我们开车、和我们一起成长的每个人创造机会。","Un ecosistema de negocio integrado que abre oportunidades para quienes viajan, conducen y crecen con nosotros.","저희 차를 타는 분, 저희 차를 모는 분, 저희와 함께 성장하는 모든 분께 기회를 여는 하나로 연결된 비즈니스 생태계입니다.","Một hệ sinh thái kinh doanh gắn kết, mở ra cơ hội cho những ai đi xe, cầm lái và cùng lớn mạnh với chúng tôi."],
"About Plateau Strategy Solution Lab": ["关于 Plateau Strategy Solution Lab","Acerca de Plateau Strategy Solution Lab","Plateau Strategy Solution Lab 소개","Về Plateau Strategy Solution Lab"],
"Plateau Strategy Solution Lab is an integrated business ecosystem built to create opportunity at every level — for the people who": ["Plateau Strategy Solution Lab 是一个环环相扣的商业生态，在每一个环节都为人们创造机会 —— 为那些与我们一起","Plateau Strategy Solution Lab es un ecosistema de negocio integrado, creado para abrir oportunidades en cada nivel — para quienes","Plateau Strategy Solution Lab는 모든 단계에서 기회를 만들기 위해 하나로 연결된 비즈니스 생태계입니다 — 저희와 함께","Plateau Strategy Solution Lab là một hệ sinh thái kinh doanh gắn kết, tạo cơ hội ở mọi cấp độ — cho những người"],
"ride": ["搭车","viajan","타고","đi xe"],
"with us,": ["、","con nosotros,",",","cùng chúng tôi,"],
"drive": ["驾驶","conducen","운전하고","lái xe"],
"with us, and": ["、以及","con nosotros, y",",","cùng chúng tôi, và"],
"grow": ["成长","crecen","성장하는","cùng phát triển"],
"with us.": ["的人。","con nosotros.","분들을 위해.","cùng chúng tôi."],
"We started with transportation: affordable Tesla rentals that turn everyday drivers into earners and everyday riders into loyal clients. From there, each part of our business funds and strengthens the next — operations, real estate, finance, and reinvestment — a closed loop where revenue compounds instead of leaking away.": ["我们从交通出行做起：用实惠的 Tesla 租赁，让普通司机赚到钱，也让每一位乘客成为回头客。在这个基础上，我们的每一块业务都为下一块输血、加力 —— 运营、房地产、金融、再投资 —— 环环相扣，让收入不断滚雪球，而不是白白流走。","Empezamos con el transporte: alquileres de Tesla asequibles que convierten a conductores comunes en personas que ganan dinero y a cada pasajero en cliente fiel. A partir de ahí, cada parte del negocio financia y refuerza a la siguiente —operaciones, bienes raíces, finanzas y reinversión— un círculo donde los ingresos crecen en lugar de fugarse.","저희는 교통에서 시작했습니다. 합리적인 Tesla 렌탈로 평범한 운전자는 수입을 얻고, 승객은 단골이 됩니다. 여기서부터 운영, 부동산, 금융, 재투자까지 각 사업이 다음 사업에 힘을 실어 줍니다 — 수익이 새어 나가지 않고 눈덩이처럼 불어나는 구조입니다.","Chúng tôi bắt đầu từ vận tải: cho thuê Tesla với giá phải chăng, giúp tài xế bình thường kiếm được tiền và biến mỗi hành khách thành khách quen. Từ đó, mỗi mảng kinh doanh tiếp sức cho mảng kế tiếp — vận hành, bất động sản, tài chính và tái đầu tư — một vòng khép kín để doanh thu lớn dần thay vì thất thoát."],
"Our model is simple: control the full value chain, share the upside with our drivers and partners, and reinvest profits back into the community. Whether you need a ride, want to earn behind the wheel, or want to refer clients and earn commission — there's a place for you here.": ["我们的思路很简单：把整条价值链握在自己手里，把收益分给司机和伙伴，再把利润投回社区。无论您是想用车、想开车挣钱，还是想推荐客户赚佣金 —— 这里都有您的一席之地。","Nuestra idea es simple: controlar toda la cadena de valor, compartir las ganancias con nuestros conductores y socios, y reinvertir en la comunidad. Ya quieras un viaje, ganar al volante o recomendar clientes y cobrar comisión — aquí tienes un lugar.","저희 방식은 간단합니다. 가치 사슬 전체를 직접 운영하고, 이익은 운전자·파트너와 나누며, 수익은 지역사회에 다시 투자합니다. 차가 필요하든, 운전으로 벌고 싶든, 고객을 소개하고 커미션을 받고 싶든 — 이곳에 당신의 자리가 있습니다.","Cách làm của chúng tôi rất đơn giản: tự nắm trọn chuỗi giá trị, chia lợi ích cho tài xế và đối tác, rồi tái đầu tư vào cộng đồng. Dù bạn cần đi xe, muốn cầm lái kiếm tiền hay giới thiệu khách để nhận hoa hồng — ở đây đều có chỗ cho bạn."],
"💰 Capital Efficient": ["💰 资本高效","💰 Eficiencia de capital","💰 자본 효율성","💰 Hiệu quả vốn"],
"Each part funds the next through shared cash flow and operational leverage.": ["各环节通过共享现金流和运营杠杆为下一环节提供资金。","Cada parte financia a la siguiente mediante flujo de caja compartido y apalancamiento operativo.","각 부분이 공유 현금 흐름과 운영 레버리지를 통해 다음 부분에 자금을 지원합니다.","Mỗi phần tài trợ cho phần tiếp theo thông qua dòng tiền chung và đòn bẩy vận hành."],
"🔄 Vertically Integrated": ["🔄 垂直整合","🔄 Integración vertical","🔄 수직 통합","🔄 Tích hợp dọc"],
"Full control over supply chain, client experience, and margin capture.": ["全面掌控供应链、客户体验和利润获取。","Control total sobre la cadena de suministro, la experiencia del cliente y la captura de margen.","공급망, 고객 경험, 마진 확보에 대한 완전한 통제.","Kiểm soát toàn diện chuỗi cung ứng, trải nghiệm khách hàng và biên lợi nhuận."],
"📈 Compounding Growth": ["📈 复利增长","📈 Crecimiento compuesto","📈 복리 성장","📈 Tăng trưởng kép"],
"Revenue synergies accelerate expansion across all business lines.": ["收入协同效应加速所有业务线的扩张。","Las sinergias de ingresos aceleran la expansión en todas las líneas de negocio.","수익 시너지가 모든 사업 부문의 확장을 가속화합니다.","Cộng hưởng doanh thu thúc đẩy mở rộng trên mọi lĩnh vực kinh doanh."],
"How It Connects": ["各环节如何连接","Cómo se conecta","어떻게 연결되는가","Cách kết nối"],
"Generates revenue & data": ["产生收入与数据","Genera ingresos y datos","수익과 데이터 창출","Tạo doanh thu & dữ liệu"],
"Provides infrastructure": ["提供基础设施","Proporciona infraestructura","인프라 제공","Cung cấp hạ tầng"],
"Optimizes capital": ["优化资本","Optimiza el capital","자본 최적화","Tối ưu hóa vốn"],
"Each part creates value that feeds the next — a self-reinforcing cycle that compounds growth and margin as it scales.": ["每一环节都创造价值并反哺下一环节 —— 一个随规模扩大而复利增长和提升利润的自我强化循环。","Cada parte crea valor que alimenta a la siguiente — un ciclo que se refuerza a sí mismo y multiplica el crecimiento y el margen a medida que escala.","각 부분이 다음 부분을 이끌어 가는 가치를 창출합니다 — 규모가 커질수록 성장과 마진을 복리로 늘리는 자기 강화 순환입니다.","Mỗi phần tạo ra giá trị nuôi dưỡng phần tiếp theo — một vòng lặp tự củng cố, nhân lên tăng trưởng và lợi nhuận khi mở rộng quy mô."],
"Join Us in Building the Future": ["与我们一起构建未来","Únete a nosotros para construir el futuro","미래를 함께 만들어 갑시다","Cùng chúng tôi kiến tạo tương lai"],
"We're currently validating the market and preparing to launch. Early partners, investors, and team members are critical to our success.": ["我们目前正在验证市场并准备启动。早期合作伙伴、投资者和团队成员对我们的成功至关重要。","Actualmente estamos validando el mercado y preparándonos para el lanzamiento. Los socios, inversionistas y miembros del equipo iniciales son fundamentales para nuestro éxito.","현재 시장을 검증하고 출시를 준비하고 있습니다. 초기 파트너, 투자자, 팀원이 저희의 성공에 매우 중요합니다.","Chúng tôi đang xác thực thị trường và chuẩn bị ra mắt. Các đối tác, nhà đầu tư và thành viên nhóm ban đầu có vai trò then chốt với thành công của chúng tôi."],
"Get Early Access": ["获取抢先体验","Obtén acceso anticipado","얼리 액세스 받기","Nhận quyền truy cập sớm"],
"We're building something ambitious. Join our community of early believers.": ["我们正在打造一项雄心勃勃的事业。加入我们早期信仰者的社区。","Estamos construyendo algo ambicioso. Únete a nuestra comunidad de creyentes tempranos.","저희는 야심 찬 사업을 만들고 있습니다. 초기 지지자 커뮤니티에 함께하세요.","Chúng tôi đang xây dựng điều gì đó đầy tham vọng. Hãy tham gia cộng đồng những người tin tưởng từ sớm."],
"Our flagship business — affordable Tesla rentals powering rides, drivers, and referral partners. Here's what we do, and where you fit in.": ["我们的招牌业务 —— 实惠的 Tesla 租赁，撑起用车、司机和推荐伙伴三方。看看我们做什么，以及您能站在哪一环。","Nuestro negocio estrella: alquileres de Tesla asequibles que impulsan los viajes, los conductores y los socios de referidos. Esto hacemos, y aquí encajas tú.","저희의 대표 사업 — 합리적인 Tesla 렌탈이 승차·운전자·추천 파트너를 하나로 이어 줍니다. 저희가 하는 일과, 여러분이 설 자리를 소개합니다.","Hoạt động chủ lực của chúng tôi — cho thuê Tesla giá tốt, tiếp sức cho chuyến đi, tài xế và đối tác giới thiệu. Đây là việc chúng tôi làm, và chỗ đứng của bạn."],
"Ride & Services": ["用车与服务","Viajes y servicios","차량 서비스","Đưa đón & Dịch vụ"],
"For riders & clients": ["为乘客和客户","Para pasajeros y clientes","승객과 고객을 위해","Dành cho hành khách & khách hàng"],
"Affordable, reliable Tesla rides — booked online in seconds, with your invoice sent automatically. No app to download, no surge-pricing games.": ["实惠又靠谱的 Tesla 专车 —— 在线几秒就能约，账单自动开好。不用下载 App，也没有高峰期乱加价。","Viajes en Tesla cómodos y de confianza: se reservan en línea en segundos y la factura se envía sola. Sin apps que descargar y sin subidas de tarifa en hora punta.","합리적이고 믿을 수 있는 Tesla 차량 — 온라인에서 몇 초면 예약되고 영수증도 자동으로 옵니다. 앱 설치도, 피크타임 요금 폭탄도 없습니다.","Xe Tesla giá tốt, đáng tin cậy — đặt online trong vài giây, hóa đơn tự gửi. Không cần tải app, không tăng giá giờ cao điểm."],
"Book a Ride →": ["预约用车 →","Reservar un viaje →","차량 예약 →","Đặt xe →"],
"Car Rentals": ["汽车租赁","Alquiler de autos","차량 렌탈","Cho thuê xe"],
"For drivers": ["面向司机","Para conductores","운전자용","Dành cho tài xế"],
"Rent a Tesla from us and earn from a shared pool of client rides. Low-cost entry, steady income, and a path to owning the car you drive.": ["从我们这里租一辆 Tesla，靠平台派给你的客户订单赚钱。入门成本低、收入稳定，还能一步步把车开成自己的。","Alquila un Tesla con nosotros y gana con los viajes de clientes que compartimos. Entrada económica, ingresos estables y un camino para llegar a ser dueño del auto que conduces.","저희에게서 Tesla를 빌리고, 함께 배정되는 손님 운행으로 수입을 올리세요. 부담 없는 초기 비용, 꾸준한 수입, 그리고 직접 모는 차를 내 것으로 만드는 길까지.","Thuê một chiếc Tesla từ chúng tôi và kiếm tiền từ những chuyến khách được chia sẻ. Chi phí ban đầu thấp, thu nhập ổn định và lộ trình để sở hữu chính chiếc xe bạn lái."],
"Driver Portal →": ["司机门户 →","Portal del conductor →","운전자 포털 →","Cổng tài xế →"],
"Agent Program": ["代理计划","Programa de agentes","에이전트 프로그램","Chương trình đại lý"],
"For partners — organizations or individuals": ["为合作伙伴 —— 机构或个人皆可","Para socios — empresas o particulares","파트너를 위해 — 기관이든 개인이든","Dành cho đối tác — tổ chức hoặc cá nhân"],
"Refer clients and earn commission on every ride they take. Ideal for hotels, travel agencies, or any individual with a network to tap.": ["把客户推荐给我们，他们每完成一次用车，您就有佣金。特别适合酒店、旅行社，或任何有人脉的人。","Recomienda clientes y cobra comisión por cada viaje que hagan. Ideal para hoteles, agencias de viajes o cualquiera con buenos contactos.","고객을 소개하고, 그분들이 이용하는 운행마다 커미션을 받으세요. 호텔, 여행사, 또는 인맥이 있는 누구에게나 딱 좋습니다.","Giới thiệu khách cho chúng tôi và nhận hoa hồng cho mỗi chuyến họ đi. Rất hợp với khách sạn, đại lý du lịch hay bất kỳ ai có sẵn mối quan hệ."],
"Agent Portal →": ["代理门户 →","Portal del agente →","에이전트 포털 →","Cổng đại lý →"],
"Digital Operations Platform": ["数字化运营平台","Plataforma de operaciones digitales","디지털 운영 플랫폼","Nền tảng vận hành số"],
"Unified software infrastructure powering fleet management, client interactions, and data analytics across all business lines. AI-driven optimization and decision support.": ["统一的软件基础设施，为所有业务线的车队管理、客户互动和数据分析提供支持。AI 驱动的优化与决策支持。","Infraestructura de software unificada que impulsa la gestión de flotas, las interacciones con clientes y el análisis de datos en todas las líneas de negocio. Optimización y apoyo a decisiones impulsados por IA.","모든 사업 부문에 걸쳐 차량 관리, 고객 상호작용, 데이터 분석을 지원하는 통합 소프트웨어 인프라. AI 기반 최적화 및 의사결정 지원.","Hạ tầng phần mềm hợp nhất hỗ trợ quản lý đội xe, tương tác khách hàng và phân tích dữ liệu trên mọi lĩnh vực kinh doanh. Tối ưu hóa và hỗ trợ ra quyết định bằng AI."],
"Fleet and asset tracking": ["车队与资产追踪","Seguimiento de flota y activos","차량 및 자산 추적","Theo dõi đội xe và tài sản"],
"Client relationship management": ["客户关系管理","Gestión de relaciones con clientes","고객 관계 관리","Quản lý quan hệ khách hàng"],
"Financial transaction processing": ["金融交易处理","Procesamiento de transacciones financieras","금융 거래 처리","Xử lý giao dịch tài chính"],
"Business intelligence & analytics": ["商业智能与分析","Inteligencia de negocios y analítica","비즈니스 인텔리전스 및 분석","Trí tuệ doanh nghiệp & phân tích"],
"Real Estate Development": ["房地产开发","Desarrollo inmobiliario","부동산 개발","Phát triển bất động sản"],
"Acquire and develop properties supporting our transportation operations plus generate rental income. Transform land into mixed-use hubs with residential, commercial, and operational space.": ["收购并开发支持我们交通运营的物业，同时产生租金收入。将土地转变为集住宅、商业和运营空间于一体的综合用途枢纽。","Adquirir y desarrollar propiedades que apoyen nuestras operaciones de transporte y además generen ingresos por alquiler. Transformar terrenos en centros de uso mixto con espacio residencial, comercial y operativo.","교통 운영을 지원하는 부동산을 취득·개발하고 임대 수익도 창출합니다. 토지를 주거·상업·운영 공간을 갖춘 복합 용도 허브로 탈바꿈시킵니다.","Mua lại và phát triển bất động sản hỗ trợ hoạt động vận tải, đồng thời tạo thu nhập cho thuê. Biến đất đai thành các trung tâm đa chức năng với không gian ở, thương mại và vận hành."],
"Strategic property acquisition": ["战略性物业收购","Adquisición estratégica de propiedades","전략적 부동산 취득","Thu mua bất động sản chiến lược"],
"Mixed-use development (MU zoning)": ["综合用途开发（MU 分区）","Desarrollo de uso mixto (zonificación MU)","복합 용도 개발 (MU 조닝)","Phát triển đa chức năng (phân vùng MU)"],
"Rent-to-own property programs": ["以租代购物业计划","Programas de propiedad en alquiler con opción a compra","임대 후 소유 부동산 프로그램","Chương trình thuê-mua bất động sản"],
"Airbnb & tenant revenue streams": ["Airbnb 与租户收入来源","Ingresos por Airbnb e inquilinos","Airbnb 및 세입자 수익원","Nguồn doanh thu Airbnb & người thuê"],
"Our financial products — choose one to explore.": ["我们的金融产品 —— 选择一个进行探索。","Nuestros productos financieros — elige uno para explorar.","저희 금융 상품 — 하나를 선택해 살펴보세요.","Các sản phẩm tài chính của chúng tôi — chọn một để khám phá."],
"AI Debt Eliminator": ["AI 债务消除器","Eliminador de deudas con IA","AI 부채 소멸기","Trình xóa nợ AI"],
"Your paycheck's profits automatically pay down your debt — principal never at risk. From $14.17/mo.": ["您薪水产生的利润自动偿还您的债务 —— 本金永不承担风险。低至 $14.17/月。","Las ganancias de tu sueldo pagan tu deuda automáticamente — el capital nunca está en riesgo. Desde $14.17/mes.","회원님의 급여에서 나온 수익이 자동으로 부채를 갚습니다 — 원금은 절대 위험에 노출되지 않습니다. 월 $14.17부터.","Lợi nhuận từ tiền lương của bạn tự động trả bớt nợ — tiền gốc không bao giờ gặp rủi ro. Từ $14.17/tháng."],
"Open →": ["打开 →","Abrir →","열기 →","Mở →"],
"RESEARCH": ["研究","INVESTIGACIÓN","리서치","NGHIÊN CỨU"],
"Our automated crypto-trading research project — in private verification, building an audited track record. Nothing for sale yet; follow the results.": ["我们的自动化加密交易研究项目 —— 正处于私密验证阶段，正在建立经审计的业绩记录。目前尚无任何出售；请关注结果。","Nuestro proyecto de investigación de trading automatizado de criptomonedas — en verificación privada, construyendo un historial auditado. Nada a la venta todavía; sigue los resultados.","저희의 자동화 암호화폐 트레이딩 연구 프로젝트 — 비공개 검증 단계로, 감사된 실적을 쌓고 있습니다. 아직 판매 상품은 없습니다; 결과를 지켜봐 주세요.","Dự án nghiên cứu giao dịch tiền mã hóa tự động của chúng tôi — đang trong giai đoạn xác minh riêng tư, xây dựng hồ sơ thành tích được kiểm toán. Chưa có gì để bán; hãy theo dõi kết quả."],
"Follow the research →": ["关注研究进展 →","Seguir la investigación →","연구 팔로우하기 →","Theo dõi nghiên cứu →"],
"← All Finance products": ["← 所有金融产品","← Todos los productos financieros","← 모든 금융 상품","← Tất cả sản phẩm tài chính"],
"Your paycheck works while you sleep — profits go straight to your debt, and your principal is never at risk.": ["您的薪水在您睡觉时也在工作 —— 利润直接用于偿还债务，而您的本金永不承担风险。","Tu sueldo trabaja mientras duermes — las ganancias van directo a tu deuda y tu capital nunca está en riesgo.","잠든 사이에도 급여가 일합니다 — 수익은 곧바로 부채로 가고, 원금은 절대 위험에 노출되지 않습니다.","Tiền lương của bạn làm việc khi bạn ngủ — lợi nhuận đi thẳng vào khoản nợ, và tiền gốc không bao giờ gặp rủi ro."],
"Your paycheck arrives as normal": ["您的薪水照常到账","Tu sueldo llega como siempre","급여는 평소처럼 입금됩니다","Tiền lương của bạn về như bình thường"],
"Our AI trades the balance during a 1–2 week window": ["我们的 AI 在 1–2 周的窗口期内交易该余额","Nuestra IA opera con el saldo durante una ventana de 1–2 semanas","저희 AI가 1–2주 동안 잔액을 거래합니다","AI của chúng tôi giao dịch số dư trong khoảng 1–2 tuần"],
"Profits lock in a protected vault (5–15%/mo target)": ["利润锁定在受保护的金库中（目标 5–15%/月）","Las ganancias se aseguran en una bóveda protegida (objetivo 5–15%/mes)","수익은 보호된 보관함에 잠깑니다 (목표 월 5–15%)","Lợi nhuận được khóa trong két bảo vệ (mục tiêu 5–15%/tháng)"],
"100% of profit auto-pays your debt": ["100% 的利润自动偿还您的债务","El 100% de las ganancias paga tu deuda automáticamente","수익의 100%가 자동으로 부채를 갚습니다","100% lợi nhuận tự động trả nợ cho bạn"],
"Your principal returns intact — no risk": ["您的本金完好无损地返还 —— 无风险","Tu capital regresa intacto — sin riesgo","원금은 그대로 돌아옵니다 — 위험 없음","Tiền gốc của bạn quay về nguyên vẹn — không rủi ro"],
"Simple pricing · 30-day free trial": ["简单定价 · 30 天免费试用","Precios simples · prueba gratis de 30 días","간단한 요금 · 30일 무료 체험","Giá đơn giản · dùng thử miễn phí 30 ngày"],
"Best value": ["最超值","Mejor valor","최고의 가치","Giá trị tốt nhất"],
"Annual": ["年付","Anual","연간","Hằng năm"],
"/year": ["/年","/año","/년","/năm"],
"Just $14.17/mo — billed once a year": ["仅 $14.17/月 —— 每年结算一次","Solo $14.17/mes — facturado una vez al año","월 $14.17 — 연 1회 청구","Chỉ $14.17/tháng — thanh toán một lần mỗi năm"],
"✓ Automated trading engine": ["✓ 自动交易引擎","✓ Motor de trading automatizado","✓ 자동 트레이딩 엔진","✓ Công cụ giao dịch tự động"],
"✓ Principal always protected": ["✓ 本金始终受保护","✓ Capital siempre protegido","✓ 원금 항상 보호","✓ Tiền gốc luôn được bảo vệ"],
"✓ Auto debt payoff": ["✓ 自动偿还债务","✓ Pago automático de deuda","✓ 자동 부채 상환","✓ Tự động trả nợ"],
"✓ Real-time dashboard": ["✓ 实时仪表盘","✓ Panel en tiempo real","✓ 실시간 대시보드","✓ Bảng điều khiển thời gian thực"],
"Start free trial →": ["开始免费试用 →","Iniciar prueba gratis →","무료 체험 시작 →","Bắt đầu dùng thử miễn phí →"],
"Monthly": ["月付","Mensual","월간","Hằng tháng"],
"/month": ["/月","/mes","/월","/tháng"],
"Billed monthly · cancel anytime": ["按月结算 · 可随时取消","Facturado mensualmente · cancela cuando quieras","월 청구 · 언제든지 취소","Thanh toán hằng tháng · hủy bất kỳ lúc nào"],
"Less than one month's minimum credit-card payment. Only profits go toward debt — your principal is never spent. Trading involves risk; results are not guaranteed.": ["低于一个月的信用卡最低还款额。只有利润用于偿还债务 —— 您的本金永不动用。交易存在风险；结果无法保证。","Menos que el pago mínimo mensual de una tarjeta de crédito. Solo las ganancias van a la deuda — tu capital nunca se gasta. Operar implica riesgo; los resultados no están garantizados.","신용카드 한 달 최소 결제액보다 적습니다. 수익만 부채 상환에 쓰이며 — 원금은 절대 사용되지 않습니다. 트레이딩에는 위험이 따르며 결과는 보장되지 않습니다.","Ít hơn khoản thanh toán tối thiểu một tháng của thẻ tín dụng. Chỉ lợi nhuận dùng để trả nợ — tiền gốc của bạn không bao giờ bị tiêu. Giao dịch có rủi ro; kết quả không được đảm bảo."],
"Not ready to enroll, but want this to exist?": ["还没准备好注册，但希望它存在？","¿No estás listo para inscribirte, pero quieres que esto exista?","아직 가입할 준비는 안 됐지만, 이런 게 있으면 좋겠나요?","Chưa sẵn sàng đăng ký, nhưng muốn điều này tồn tại?"],
"💜 I wish that to be happening": ["💜 我希望这能实现","💜 Deseo que esto suceda","💜 이것이 실현되길 바랍니다","💜 Tôi mong điều này thành hiện thực"],
"Save my email": ["保存我的邮箱","Guardar mi correo","이메일 저장","Lưu email của tôi"],
"Reinvestment USA": ["再投资美国","Reinversión EE. UU.","미국 재투자","Tái đầu tư Hoa Kỳ"],
"Deploy accumulated capital back into American infrastructure, communities, and businesses. Create a virtuous cycle of economic value creation and reinvestment.": ["将积累的资本重新投入美国的基础设施、社区和企业。创造一个经济价值创造与再投资的良性循环。","Desplegar el capital acumulado en la infraestructura, las comunidades y las empresas estadounidenses. Crear un ciclo virtuoso de creación de valor económico y reinversión.","축적된 자본을 미국의 인프라, 지역사회, 기업에 다시 투입합니다. 경제적 가치 창출과 재투자의 선순환을 만듭니다.","Triển khai nguồn vốn tích lũy trở lại hạ tầng, cộng đồng và doanh nghiệp Hoa Kỳ. Tạo ra một vòng tuần hoàn tích cực của việc tạo giá trị kinh tế và tái đầu tư."],
"Community development": ["社区发展","Desarrollo comunitario","지역사회 개발","Phát triển cộng đồng"],
"Strategic reinvestment": ["战略性再投资","Reinversión estratégica","전략적 재투자","Tái đầu tư chiến lược"],
"Economic impact scaling": ["扩大经济影响力","Escalado de impacto económico","경제적 영향 확대","Mở rộng tác động kinh tế"],
"Long-term wealth creation": ["长期财富创造","Creación de riqueza a largo plazo","장기적 부의 창출","Tạo dựng của cải dài hạn"],
"© 2026 Plateau Strategy Solution Lab. Building integrated wealth through connected ecosystems.": ["© 2026 Plateau Strategy Solution Lab。通过互联的生态系统构建综合财富。","© 2026 Plateau Strategy Solution Lab. Construyendo riqueza integrada a través de ecosistemas conectados.","© 2026 Plateau Strategy Solution Lab. 연결된 생태계를 통해 통합된 부를 구축합니다.","© 2026 Plateau Strategy Solution Lab. Xây dựng của cải tích hợp thông qua các hệ sinh thái kết nối."],
"🚗 Customer": ["🚗 客户","🚗 Cliente","🚗 고객","🚗 Khách hàng"],
"Enter your details and a password, then book your ride.": ["填写您的信息并设置密码，就能开始预约用车。","Introduce tus datos y una contraseña, y reserva tu viaje.","정보와 비밀번호를 입력하시면 바로 차량을 예약할 수 있습니다.","Nhập thông tin và mật khẩu của bạn, rồi đặt xe."],
"Full name": ["全名","Nombre completo","성명","Họ và tên"],
"Email": ["电子邮箱","Correo electrónico","이메일","Email"],
"Phone": ["电话","Teléfono","전화번호","Điện thoại"],
"Password": ["密码","Contraseña","비밀번호","Mật khẩu"],
"Continue to booking →": ["继续预约 →","Continuar con la reserva →","예약 계속하기 →","Tiếp tục đặt xe →"],
"New here? Just fill this in — we'll create your account.": ["第一次来？填好这些，我们就帮您建好账户。","¿Primera vez? Rellena esto y te creamos la cuenta.","처음이신가요? 여기만 채우시면 계정을 만들어 드립니다.","Lần đầu? Chỉ cần điền vào đây — chúng tôi sẽ tạo tài khoản cho bạn."],
"👤 Driver": ["👤 司机","👤 Conductor","👤 운전자","👤 Tài xế"],
"Log in with your renting VIN and birthday.": ["使用您的租车 VIN 和生日登录。","Inicia sesión con el VIN de tu alquiler y tu fecha de nacimiento.","렌트 차량 VIN과 생일로 로그인하세요.","Đăng nhập bằng số VIN xe thuê và ngày sinh của bạn."],
"Birthday (DDMMYYYY)": ["生日（DDMMYYYY）","Fecha de nacimiento (DDMMAAAA)","생일 (DDMMYYYY)","Ngày sinh (DDMMYYYY)"],
"Birthday": ["生日","Fecha de nacimiento","생일","Ngày sinh"],
"DDMMYYYY — your login pass": ["DDMMYYYY —— 您的登录密码","DDMMAAAA — tu clave de acceso","DDMMYYYY — 로그인 비밀번호","DDMMYYYY — mật khẩu đăng nhập của bạn"],
"DDMMYYYY — this becomes your login pass": ["DDMMYYYY —— 这将成为您的登录密码","DDMMAAAA — será tu clave de acceso","DDMMYYYY — 로그인 비밀번호가 됩니다","DDMMYYYY — sẽ là mật khẩu đăng nhập của bạn"],
"Renting VIN": ["租车 VIN","VIN del alquiler","렌트 VIN","VIN xe thuê"],
"Last name": ["姓氏","Apellido","성","Họ"],
"Log in →": ["登录 →","Iniciar sesión →","로그인 →","Đăng nhập →"],
"New driver?": ["新司机？","¿Conductor nuevo?","새 운전자이신가요?","Tài xế mới?"],
"Register your car →": ["注册您的车辆 →","Registra tu auto →","차량 등록하기 →","Đăng ký xe của bạn →"],
"🤝 Agent": ["🤝 代理","🤝 Agente","🤝 에이전트","🤝 Đại lý"],
"Log in with your last name and agent code.": ["使用您的姓氏和代理代码登录。","Inicia sesión con tu apellido y código de agente.","성과 에이전트 코드로 로그인하세요.","Đăng nhập bằng họ và mã đại lý của bạn."],
"Organization (if any)": ["组织（如有）","Organización (si aplica)","조직 (있는 경우)","Tổ chức (nếu có)"],
"Agent code": ["代理代码","Código de agente","에이전트 코드","Mã đại lý"],
"New agent?": ["新代理？","¿Agente nuevo?","새 에이전트이신가요?","Đại lý mới?"],
"Become an agent →": ["成为代理 →","Conviértete en agente →","에이전트 되기 →","Trở thành đại lý →"],
"Start your free trial": ["开始您的免费试用","Inicia tu prueba gratis","무료 체험 시작하기","Bắt đầu dùng thử miễn phí"],
"30-day free trial, then": ["30 天免费试用，之后","Prueba gratis de 30 días, luego","30일 무료 체험, 이후","Dùng thử miễn phí 30 ngày, sau đó"],
"$170/year": ["$170/年","$170/año","$170/년","$170/năm"],
". Cancel anytime.": ["。可随时取消。",". Cancela cuando quieras.",". 언제든지 취소할 수 있습니다.",". Hủy bất kỳ lúc nào."],
"Start free trial & enroll →": ["开始免费试用并注册 →","Iniciar prueba gratis e inscribirse →","무료 체험 시작 및 가입 →","Dùng thử miễn phí & đăng ký →"],
"Your name": ["您的姓名","Tu nombre","이름","Tên của bạn"],
# ---- booking page ----
"Home": ["首页","Inicio","홈","Trang chủ"],
"← Home": ["← 首页","← Inicio","← 홈","← Trang chủ"],
"Book a Reservation Ride": ["预约用车","Reservar un viaje","차량 예약","Đặt xe"],
"Tell us where you're going — we'll take care of the rest.": ["告诉我们您要去哪儿，剩下的交给我们。","Dinos a dónde vas y del resto nos encargamos nosotros.","어디로 가시는지만 알려 주세요 — 나머지는 저희가 챙기겠습니다.","Cho chúng tôi biết bạn muốn đi đâu — phần còn lại cứ để chúng tôi lo."],
"Pickup location": ["上车地点","Lugar de recogida","탑승 위치","Điểm đón"],
"Drop-off location": ["下车地点","Lugar de destino","하차 위치","Điểm trả"],
"Service": ["服务","Servicio","서비스","Dịch vụ"],
"Date": ["日期","Fecha","날짜","Ngày"],
"Time": ["时间","Hora","시간","Giờ"],
"Your driver will arrive": ["您的司机会在您出发时间","Tu conductor llegará","기사님은 출발 시간","Tài xế sẽ đến"],
"15 minutes before": ["前 15 分钟","15 minutos antes","15분 전에","15 phút trước"],
"your departure time.": ["到达。","de tu salida.","도착합니다.","giờ bạn khởi hành."],
"Passengers": ["乘客人数","Pasajeros","탑승 인원","Số hành khách"],
"If this is a trip to the airport, what is the flight number?": ["如果是去机场，请填写航班号。","Si vas al aeropuerto, ¿cuál es el número de vuelo?","공항에 가시는 경우 항공편 번호를 알려 주세요.","Nếu bạn ra sân bay, cho biết số hiệu chuyến bay nhé."],
"Notes for the driver": ["给司机的留言","Notas para el conductor","기사님께 남길 말","Lời nhắn cho tài xế"],
"Request a ride and Pay": ["预约并支付","Reservar y pagar","예약하고 결제하기","Đặt xe và thanh toán"],
"Need to cancel a reservation?": ["需要取消预约？","¿Necesitas cancelar una reserva?","예약을 취소하시겠어요?","Cần hủy một chuyến đã đặt?"],
"Confirmation number": ["确认号","Número de confirmación","확인 번호","Số xác nhận"],
"Email used for the booking": ["预订时使用的邮箱","Correo usado para la reserva","예약에 사용한 이메일","Email đã dùng để đặt chỗ"],
"Cancel my reservation": ["取消我的预约","Cancelar mi reserva","예약 취소","Hủy chuyến của tôi"],
# ---- driver portal (renter.html) ----
"Switch driver": ["切换司机","Cambiar de conductor","운전자 전환","Đổi tài xế"],
"Driver Portal": ["司机门户","Portal del conductor","운전자 포털","Cổng tài xế"],
"For drivers operating vehicles with Plateau Strategy Solution Lab. Register your vehicle to view and claim client reservations.": ["为在 Plateau Strategy Solution Lab 跑车的司机准备。登记您的车辆，就能查看并接下客户订单。","Para conductores que trabajan con Plateau Strategy Solution Lab. Registra tu vehículo para ver y aceptar las reservas de clientes.","Plateau Strategy Solution Lab에서 운행하는 기사님을 위한 공간입니다. 차량을 등록하면 손님 예약을 확인하고 잡을 수 있습니다.","Dành cho tài xế chạy xe cùng Plateau Strategy Solution Lab. Đăng ký xe để xem và nhận các chuyến của khách."],
"or register a new vehicle":["或注册新车辆","o registra un vehículo nuevo","또는 새 차량 등록","hoặc đăng ký xe mới"],
"Vehicle make": ["车辆品牌","Marca del vehículo","차량 제조사","Hãng xe"],
"Model": ["型号","Modelo","모델","Mẫu xe"],
"Year": ["年份","Año","연식","Năm"],
"Color": ["颜色","Color","색상","Màu sắc"],
"Plate": ["车牌","Placa","번호판","Biển số"],
"Vehicle VIN": ["车辆 VIN","VIN del vehículo","차량 VIN","VIN xe"],
"(used to sign in)": ["（用于登录）","(se usa para iniciar sesión)","(로그인에 사용)","(dùng để đăng nhập)"],
"Register & Enter Portal": ["注册并进入门户","Registrarse y entrar al portal","등록 후 포털 입장","Đăng ký & vào cổng"],
"Driver Menu": ["司机菜单","Menú del conductor","운전자 메뉴","Menu tài xế"],
"Open Reservations": ["开放的预订","Reservas disponibles","오픈 예약","Đặt chỗ đang mở"],
"My Rides": ["我的行程","Mis viajes","내 운행","Chuyến của tôi"],
"Payments": ["付款","Pagos","결제","Thanh toán"],
"Driver Agreement": ["司机协议","Acuerdo del conductor","운전자 계약서","Thỏa thuận tài xế"],
"Your Vehicle": ["您的车辆","Tu vehículo","내 차량","Xe của bạn"],
"Action Required — Sign Your Driver Agreement": ["需要操作 —— 签署您的司机协议","Acción requerida — Firma tu acuerdo del conductor","조치 필요 — 운전자 계약서에 서명하세요","Cần thao tác — Ký thỏa thuận tài xế của bạn"],
"You must sign your agreement before you can accept any rides.": ["接单前，请先签署您的协议。","Antes de aceptar viajes, firma tu acuerdo.","운행을 잡으시려면 먼저 계약서에 서명해 주세요.","Trước khi nhận chuyến, hãy ký thỏa thuận của bạn."],
"Review & Sign": ["查看并签署","Revisar y firmar","검토 후 서명","Xem lại & ký"],
"Visible to all drivers. The first to claim secures the ride.": ["所有司机都能看到，谁先抢到就是谁的。","Visible para todos los conductores. El primero en aceptarlo se queda el viaje.","모든 기사님께 보입니다. 먼저 잡는 분이 운행을 가져갑니다.","Mọi tài xế đều thấy. Ai nhận trước thì được chuyến."],
"No open reservations at this time. New client bookings appear here automatically.": ["目前没有可接的订单。有新客户预约时会自动出现在这里。","Ahora mismo no hay viajes disponibles. Las nuevas reservas de clientes aparecerán aquí solas.","지금은 잡을 수 있는 예약이 없습니다. 새 손님 예약이 들어오면 여기에 자동으로 표시됩니다.","Hiện chưa có chuyến nào để nhận. Khi có khách đặt mới, chuyến sẽ tự hiện ở đây."],
"You have not claimed any rides yet.": ["您还没有接过订单。","Todavía no has aceptado ningún viaje.","아직 잡은 운행이 없습니다.","Bạn chưa nhận chuyến nào."],
"Rent-to-Own Payments": ["以租代购付款","Pagos de alquiler con opción a compra","임대 후 소유 결제","Thanh toán thuê-mua"],
"Type your full legal name": ["输入您的法定全名","Escribe tu nombre legal completo","법적 성명을 입력하세요","Nhập họ tên hợp pháp đầy đủ"],
"Draw your signature": ["绘制您的签名","Dibuja tu firma","서명을 그리세요","Vẽ chữ ký của bạn"],
"Sign here with your mouse or finger": ["用鼠标或手指在此签名","Firma aquí con el ratón o el dedo","마우스나 손가락으로 여기에 서명하세요","Ký vào đây bằng chuột hoặc ngón tay"],
"Draw above": ["在上方绘制","Dibuja arriba","위에 그리세요","Vẽ ở trên"],
"Clear": ["清除","Borrar","지우기","Xóa"],
"I have read and agree to the terms of this Driver Agreement, and this is my legal electronic signature.": ["我已阅读并同意本司机协议的条款，这是我的合法电子签名。","He leído y acepto los términos de este Acuerdo del conductor, y esta es mi firma electrónica legal.","본 운전자 계약서의 조건을 읽고 동의하며, 이것은 저의 법적 전자 서명입니다.","Tôi đã đọc và đồng ý với các điều khoản của Thỏa thuận tài xế này, và đây là chữ ký điện tử hợp pháp của tôi."],
"Cancel": ["取消","Cancelar","취소","Hủy"],
"Sign & Agree": ["签署并同意","Firmar y aceptar","서명 및 동의","Ký & Đồng ý"],
"Reservation Already Taken": ["预订已被接单","Reserva ya tomada","이미 수락된 예약","Đặt chỗ đã có người nhận"],
"Another driver claimed this ride first. It has been removed from your list.": ["这单已被别的司机先接走了，已从您的列表中移除。","Otro conductor lo aceptó primero. Ya no está en tu lista.","다른 기사님이 먼저 잡았습니다. 목록에서 사라졌어요.","Một tài xế khác đã nhận trước. Chuyến này đã được gỡ khỏi danh sách của bạn."],
"Close": ["关闭","Cerrar","닫기","Đóng"],
# ---- agent portal (agent.html) ----
"Switch agent": ["切换代理","Cambiar de agente","에이전트 전환","Đổi đại lý"],
"Agent Portal": ["代理门户","Portal del agente","에이전트 포털","Cổng đại lý"],
"Refer customers and earn a commission on every completed ride. Anyone can be an agent — as an individual or an organization.": ["把客户推荐给我们，每完成一单您都有佣金。任何人都能当代理 —— 个人或机构皆可。","Recomienda clientes y cobra comisión por cada viaje completado. Cualquiera puede ser agente — como particular o como empresa.","고객을 소개하고, 운행이 완료될 때마다 커미션을 받으세요. 개인이든 기관이든 누구나 에이전트가 될 수 있습니다.","Giới thiệu khách và nhận hoa hồng cho mỗi chuyến hoàn thành. Ai cũng có thể làm đại lý — cá nhân hay tổ chức đều được."],
"I am registering as": ["我注册为","Me registro como","등록 유형","Tôi đăng ký với tư cách"],
"Individual": ["个人","Individual","개인","Cá nhân"],
"Organization": ["组织","Organización","조직","Tổ chức"],
"Organization name": ["组织名称","Nombre de la organización","조직 이름","Tên tổ chức"],
"Register & Get My Agent Code": ["注册并获取我的代理代码","Registrarse y obtener mi código de agente","등록하고 에이전트 코드 받기","Đăng ký & nhận mã đại lý"],
"— already an agent? sign in —": ["—— 已是代理？登录 ——","— ¿ya eres agente? inicia sesión —","— 이미 에이전트인가요? 로그인 —","— đã là đại lý? đăng nhập —"],
"Sign In": ["登录","Iniciar sesión","로그인","Đăng nhập"],
"Agent Menu": ["代理菜单","Menú del agente","에이전트 메뉴","Menu đại lý"],
"Refer a Client": ["推荐客户","Referir un cliente","고객 추천","Giới thiệu khách"],
"My Referrals": ["我的推荐","Mis referidos","내 추천","Giới thiệu của tôi"],
"Services & Rates": ["服务与费率","Servicios y tarifas","서비스 및 요금","Dịch vụ & Biểu phí"],
"Earnings & Code": ["收益与代码","Ganancias y código","수익 및 코드","Thu nhập & Mã"],
"You earn a flat commission on every customer you refer whose ride is completed.": ["您推荐的每位客户只要完成用车，您就能拿到一笔固定佣金。","Ganas una comisión fija por cada cliente que recomiendes y complete su viaje.","소개하신 고객의 운행이 완료될 때마다 고정 커미션을 받습니다.","Bạn nhận một khoản hoa hồng cố định cho mỗi khách bạn giới thiệu hoàn thành chuyến đi."],
"Client name": ["客户姓名","Nombre del cliente","고객 이름","Tên khách hàng"],
"Client email": ["客户邮箱","Correo del cliente","고객 이메일","Email khách hàng"],
"Client phone": ["客户电话","Teléfono del cliente","고객 전화번호","Điện thoại khách hàng"],
"Pickup": ["上车地点","Recogida","탑승","Điểm đón"],
"Drop-off": ["下车地点","Destino","하차","Điểm trả"],
"Fare (USD)": ["车费（美元）","Tarifa (USD)","요금 (USD)","Giá cước (USD)"],
"Submit Referral & Create Reservation": ["提交推荐并创建预订","Enviar referido y crear reserva","추천 제출 및 예약 생성","Gửi giới thiệu & tạo đặt chỗ"],
"Client": ["客户","Cliente","고객","Khách hàng"],
"Route": ["路线","Ruta","경로","Lộ trình"],
"Fare": ["车费","Tarifa","요금","Giá cước"],
"Commission": ["佣金","Comisión","커미션","Hoa hồng"],
"Status": ["状态","Estado","상태","Trạng thái"],
"No referrals yet. Submit your first one under “Refer a Client.”": ["还没有推荐。在“推荐客户”下提交您的第一个推荐。","Aún no hay referidos. Envía el primero en “Referir un cliente”.","아직 추천이 없습니다. “고객 추천”에서 첫 추천을 제출하세요.","Chưa có giới thiệu nào. Gửi giới thiệu đầu tiên ở mục “Giới thiệu khách”."],
"Here's what you earn for referring each service. Your commission depends on the service — pick it on the “Refer a Client” tab and the price fills in automatically.": ["这是您推荐每项服务可获得的收益。您的佣金取决于所选服务 —— 在“推荐客户”标签中选择，价格将自动填入。","Esto es lo que ganas por referir cada servicio. Tu comisión depende del servicio — selecciónalo en la pestaña “Referir un cliente” y el precio se completa automáticamente.","각 서비스를 추천할 때 받는 금액입니다. 커미션은 서비스에 따라 다릅니다 — “고객 추천” 탭에서 선택하면 가격이 자동으로 입력됩니다.","Đây là số tiền bạn nhận khi giới thiệu mỗi dịch vụ. Hoa hồng tùy theo dịch vụ — chọn ở tab “Giới thiệu khách” và giá sẽ tự điền."],
"Price": ["价格","Precio","가격","Giá"],
"You earn": ["您的收益","Tú ganas","내 수익","Bạn nhận"],
"Referrals submitted": ["已提交的推荐","Referidos enviados","제출된 추천","Giới thiệu đã gửi"],
"Commission earned (completed)": ["已赚佣金（已完成）","Comisión ganada (completada)","획득 커미션 (완료)","Hoa hồng đã kiếm (hoàn thành)"],
"Pending (in progress)": ["待处理（进行中）","Pendiente (en curso)","대기 중 (진행 중)","Đang chờ (đang tiến hành)"],
"Your Agent Code — this is your sign-in": ["您的代理代码 —— 这是您的登录凭证","Tu código de agente — es tu acceso","에이전트 코드 — 로그인 정보입니다","Mã đại lý của bạn — đây là thông tin đăng nhập"],
"Keep this safe. You'll use your organization, last name, and this code to sign in.": ["请妥善保管。您将使用您的组织、姓氏和此代码登录。","Guárdalo bien. Usarás tu organización, tu apellido y este código para iniciar sesión.","안전하게 보관하세요. 조직, 성, 이 코드로 로그인합니다.","Hãy giữ an toàn. Bạn sẽ dùng tổ chức, họ và mã này để đăng nhập."],
"You're registered as an agent": ["您已注册为代理","Estás registrado como agente","에이전트로 등록되었습니다","Bạn đã đăng ký làm đại lý"],
"This is your unique agent code —": ["这是您专属的代理代码 ——","Este es tu código de agente único —","이것은 회원님의 고유 에이전트 코드입니다 —","Đây là mã đại lý riêng của bạn —"],
"save it now": ["立即保存","guárdalo ahora","지금 저장하세요","hãy lưu lại ngay"],
". You'll use it, with your last name, to sign in.": ["。您将用它和您的姓氏一起登录。",". Lo usarás, junto con tu apellido, para iniciar sesión.",". 성과 함께 이 코드로 로그인합니다.",". Bạn sẽ dùng nó cùng với họ của mình để đăng nhập."],
"Copy code": ["复制代码","Copiar código","코드 복사","Sao chép mã"],
"Continue to portal": ["进入门户","Continuar al portal","포털로 계속","Tiếp tục vào cổng"],
# ---- dispatch (dispatch.html) ----
"● live": ["● 实时","● en vivo","● 실시간","● trực tiếp"],
"Log out": ["退出登录","Cerrar sesión","로그아웃","Đăng xuất"],
"Exit to homepage": ["退出到主页","Salir a la página principal","홈페이지로 나가기","Thoát về trang chủ"],
"Dispatch Login": ["调度登录","Acceso a Central","배차 로그인","Đăng nhập Điều phối"],
"Sign in to your control center.": ["登录您的控制中心。","Inicia sesión en tu centro de control.","관제 센터에 로그인하세요.","Đăng nhập vào trung tâm điều khiển của bạn."],
"Username": ["用户名","Usuario","사용자 이름","Tên đăng nhập"],
"Sign in": ["登录","Iniciar sesión","로그인","Đăng nhập"],
"← Exit to homepage": ["← 退出到主页","← Salir a la página principal","← 홈페이지로 나가기","← Thoát về trang chủ"],
"Your control center — every reservation, from every source, in one place. Assign drivers, complete rides, and keep the whole operation organized.": ["您的控制中心 —— 将来自各个来源的每一笔预订集中于一处。分配司机、完成行程，让整个运营井然有序。","Tu centro de control — cada reserva, de cada fuente, en un solo lugar. Asigna conductores, completa viajes y mantén toda la operación organizada.","관제 센터 — 모든 출처의 모든 예약을 한곳에서. 운전자를 배정하고, 운행을 완료하고, 전체 운영을 체계적으로 관리하세요.","Trung tâm điều khiển của bạn — mọi đặt chỗ, từ mọi nguồn, ở một nơi. Phân công tài xế, hoàn tất chuyến đi và giữ toàn bộ hoạt động ngăn nắp."],
"Partner pipeline · organizations to recruit as agents": ["合作伙伴渠道 · 待招募为代理的组织","Canal de socios · organizaciones para reclutar como agentes","파트너 파이프라인 · 에이전트로 모집할 조직","Kênh đối tác · các tổ chức để tuyển làm đại lý"],
"Agents →": ["代理 →","Agentes →","에이전트 →","Đại lý →"],
"Referral partners & commissions": ["推荐合作伙伴与佣金","Socios de referidos y comisiones","추천 파트너 및 커미션","Đối tác giới thiệu & hoa hồng"],
"Drivers →": ["司机 →","Conductores →","운전자 →","Tài xế →"],
"Rides, contracts & rent-to-own": ["行程、合同与以租代购","Viajes, contratos y alquiler con opción a compra","운행, 계약 및 임대 후 소유","Chuyến đi, hợp đồng & thuê-mua"],
"Books & Taxes →": ["账簿与税务 →","Libros e impuestos →","장부 및 세금 →","Sổ sách & Thuế →"],
"Live Square revenue": ["Square 实时收入","Ingresos de Square en vivo","Square 실시간 매출","Doanh thu Square trực tiếp"],
"Reservations": ["预订","Reservas","예약","Đặt chỗ"],
"Reservation": ["预订","Reserva","예약","Đặt chỗ"],
"Agent": ["代理","Agente","에이전트","Đại lý"],
"Driver & Controls": ["司机与操作","Conductor y controles","운전자 및 제어","Tài xế & Điều khiển"],
"No reservations yet. Bookings from customers and agents appear here automatically.": ["暂无预订。来自客户和代理的预订将自动显示在此处。","Aún no hay reservas. Las reservas de clientes y agentes aparecen aquí automáticamente.","아직 예약이 없습니다. 고객과 에이전트의 예약이 여기에 자동으로 표시됩니다.","Chưa có đặt chỗ. Đặt chỗ từ khách hàng và đại lý sẽ tự động xuất hiện ở đây."],
"Service Tickets & Pricing": ["服务项目与定价","Servicios y precios","서비스 항목 및 가격","Dịch vụ & Bảng giá"],
"Price presets — fill the price on the booking & agent forms (still editable per ride).": ["价格预设 —— 自动填入预订和代理表单中的价格（每次行程仍可编辑）。","Precios predefinidos — completan el precio en los formularios de reserva y de agente (aún editable por viaje).","가격 프리셋 — 예약 및 에이전트 양식에 가격을 채웁니다 (운행별로 수정 가능).","Giá định sẵn — tự điền giá vào biểu mẫu đặt chỗ và đại lý (vẫn chỉnh được theo từng chuyến)."],
"Service name": ["服务名称","Nombre del servicio","서비스 이름","Tên dịch vụ"],
"Price $": ["价格 $","Precio $","가격 $","Giá $"],
"Agent earns $": ["代理赚取 $","El agente gana $","에이전트 수익 $","Đại lý nhận $"],
"+ Add": ["+ 添加","+ Añadir","+ 추가","+ Thêm"],
"Per-agent rates — an agent's referrals pre-fill to their negotiated rate (blank = your default).": ["按代理设定费率 —— 代理的推荐将自动填入其协商费率（留空 = 您的默认值）。","Tarifas por agente — los referidos de un agente se completan con su tarifa negociada (en blanco = tu valor predeterminado).","에이전트별 요금 — 에이전트의 추천은 협의된 요금으로 미리 채워집니다 (비워두면 기본값).","Biểu phí theo đại lý — giới thiệu của đại lý sẽ tự điền theo mức đã thỏa thuận (để trống = mặc định của bạn)."],
"No agents yet.": ["暂无代理。","Aún no hay agentes.","아직 에이전트가 없습니다.","Chưa có đại lý."],
# ---- Atlas / partners (partners.html) ----
"Partner pipeline · Greater Seattle.": ["合作伙伴渠道 · 大西雅图地区。","Canal de socios · Gran Seattle.","파트너 파이프라인 · 그레이터 시애틀.","Kênh đối tác · Khu vực Seattle."],
"Organizations to recruit as referral agents — hotels, travel agencies, and offices whose people need airport rides. Reach out personally (they earn $15 per completed referral), track each one here, and when they say yes, sign them up in the Agent portal.": ["待招募为推荐代理的组织 —— 酒店、旅行社以及员工需要机场接送的办公场所。亲自联系（每完成一次推荐可赚 $15），在此追踪每一家，当他们同意后，在代理门户为其注册。","Organizaciones para reclutar como agentes de referidos — hoteles, agencias de viajes y oficinas cuya gente necesita viajes al aeropuerto. Contáctalos personalmente (ganan $15 por cada referido completado), haz seguimiento de cada uno aquí y, cuando acepten, regístralos en el portal de agentes.","추천 에이전트로 모집할 조직 — 공항 이동이 필요한 사람들이 있는 호텔, 여행사, 사무실. 직접 연락하고(완료된 추천당 $15 획득), 여기서 각 대상을 관리하며, 수락하면 에이전트 포털에서 등록하세요.","Các tổ chức để tuyển làm đại lý giới thiệu — khách sạn, đại lý du lịch và văn phòng có người cần đi sân bay. Hãy liên hệ trực tiếp (họ nhận $15 cho mỗi giới thiệu hoàn thành), theo dõi từng đơn vị tại đây, và khi họ đồng ý, đăng ký cho họ trong cổng đại lý."],
"Copy pitch": ["复制推介文案","Copiar propuesta","제안 문구 복사","Sao chép lời chào"],
"Partnership pitch (personalize the [brackets])": ["合作推介（请自定义[方括号]内容）","Propuesta de colaboración (personaliza los [corchetes])","파트너십 제안 ([대괄호] 부분을 맞춤 수정)","Lời chào hợp tác (tùy chỉnh phần trong [ngoặc])"],
"Prospects": ["潜在客户","Prospectos","잠재 대상","Khách tiềm năng"],
"Hotel or agency name": ["酒店或旅行社名称","Nombre del hotel o agencia","호텔 또는 여행사 이름","Tên khách sạn hoặc đại lý"],
"Type": ["类型","Tipo","유형","Loại"],
"Hotel": ["酒店","Hotel","호텔","Khách sạn"],
"Travel agency": ["旅行社","Agencia de viajes","여행사","Đại lý du lịch"],
"Office": ["办公场所","Oficina","사무실","Văn phòng"],
"Senior living": ["养老社区","Residencia para mayores","시니어 주거시설","Nhà dưỡng lão"],
"Other": ["其他","Otro","기타","Khác"],
"Website": ["网站","Sitio web","웹사이트","Trang web"],
"+ Add prospect": ["+ 添加潜在客户","+ Añadir prospecto","+ 잠재 대상 추가","+ Thêm khách tiềm năng"],
"General contact": ["常规联系方式","Contacto general","일반 연락처","Liên hệ chung"],
"Sales team (direct)": ["销售团队（直接联系）","Equipo de ventas (directo)","영업팀 (직접)","Đội ngũ bán hàng (trực tiếp)"],
"Notes": ["备注","Notas","메모","Ghi chú"],
"No prospects yet. Add one above.": ["暂无潜在客户。请在上方添加。","Aún no hay prospectos. Añade uno arriba.","아직 잠재 대상이 없습니다. 위에서 추가하세요.","Chưa có khách tiềm năng. Hãy thêm ở trên."],
# ---- books & taxes (books.html) ----
"Books & Taxes": ["账簿与税务","Libros e impuestos","장부 및 세금","Sổ sách & Thuế"],
"Live revenue from your Square account — the numbers your taxes are built on.": ["来自您 Square 账户的实时收入 —— 您报税所依据的数字。","Ingresos en vivo de tu cuenta de Square — las cifras sobre las que se basan tus impuestos.","Square 계정의 실시간 매출 — 세금 계산의 기준이 되는 숫자입니다.","Doanh thu trực tiếp từ tài khoản Square của bạn — những con số làm cơ sở tính thuế."],
"Collected revenue (PAID) ·": ["已收款收入（已付）·","Ingresos cobrados (PAGADO) ·","수금된 매출 (결제됨) ·","Doanh thu đã thu (ĐÃ TRẢ) ·"],
"payments": ["笔付款","pagos","건 결제","khoản thanh toán"],
"Outstanding (invoiced, unpaid) ·": ["未结（已开票、未付）·","Pendiente (facturado, sin pagar) ·","미수금 (청구됨, 미결제) ·","Chưa thanh toán (đã xuất hóa đơn) ·"],
"Paid revenue by month": ["按月已付收入","Ingresos pagados por mes","월별 결제 매출","Doanh thu đã trả theo tháng"],
"Month": ["月份","Mes","월","Tháng"],
"Collected": ["已收款","Cobrado","수금액","Đã thu"],
"No paid invoices yet.": ["暂无已付账单。","Aún no hay facturas pagadas.","결제된 청구서가 아직 없습니다.","Chưa có hóa đơn nào được thanh toán."],
"By business line": ["按业务线","Por línea de negocio","사업 부문별","Theo lĩnh vực kinh doanh"],
"Stream": ["业务","Línea","부문","Lĩnh vực"],
"All transactions": ["所有交易","Todas las transacciones","전체 거래","Tất cả giao dịch"],
"Number": ["编号","Número","번호","Số"],
"Customer": ["客户","Cliente","고객","Khách hàng"],
"Description": ["描述","Descripción","설명","Mô tả"],
"Amount": ["金额","Importe","금액","Số tiền"],
"No transactions yet — they appear here as bookings come in.": ["暂无交易 —— 随着预订到来，交易将显示在此处。","Aún no hay transacciones — aparecerán aquí a medida que lleguen reservas.","아직 거래가 없습니다 — 예약이 들어오면 여기에 표시됩니다.","Chưa có giao dịch — chúng sẽ xuất hiện ở đây khi có đặt chỗ."],
"⬇️ Export CSV (for QuickBooks / accountant)": ["⬇️ 导出 CSV（用于 QuickBooks / 会计）","⬇️ Exportar CSV (para QuickBooks / contador)","⬇️ CSV 내보내기 (QuickBooks / 회계사용)","⬇️ Xuất CSV (cho QuickBooks / kế toán)"],
"↻ Refresh from Square": ["↻ 从 Square 刷新","↻ Actualizar desde Square","↻ Square에서 새로고침","↻ Làm mới từ Square"],
"QuickBooks — automatic sync (recommended):": ["QuickBooks —— 自动同步（推荐）：","QuickBooks — sincronización automática (recomendado):","QuickBooks — 자동 동기화 (권장):","QuickBooks — đồng bộ tự động (khuyến nghị):"],
"since every payment runs through Square, connect Square inside QuickBooks once and all revenue flows into your books automatically: QuickBooks →": ["由于每一笔付款都通过 Square 处理，只需在 QuickBooks 中连接一次 Square，所有收入便会自动进入您的账簿：QuickBooks →","como cada pago pasa por Square, conecta Square dentro de QuickBooks una vez y todos los ingresos entran en tus libros automáticamente: QuickBooks →","모든 결제가 Square를 통해 이루어지므로, QuickBooks에서 Square를 한 번 연결하면 모든 매출이 자동으로 장부에 반영됩니다: QuickBooks →","vì mọi khoản thanh toán đều qua Square, chỉ cần kết nối Square trong QuickBooks một lần và toàn bộ doanh thu sẽ tự động vào sổ sách: QuickBooks →"],
"Apps": ["应用","Aplicaciones","앱","Ứng dụng"],
"→ search": ["→ 搜索","→ buscar","→ 검색","→ tìm"],
"(by Intuit) →": ["（由 Intuit 提供）→","(de Intuit) →","(Intuit 제공) →","(bởi Intuit) →"],
"Get app now": ["立即获取应用","Obtener la app ahora","지금 앱 받기","Nhận ứng dụng ngay"],
"→ sign in to Square → done. After that, this page is your quick view and the CSV is your backup/manual import.": ["→ 登录 Square → 完成。之后，此页面是您的快速查看，CSV 则是您的备份/手动导入。","→ inicia sesión en Square → listo. Después, esta página es tu vista rápida y el CSV es tu respaldo/importación manual.","→ Square에 로그인 → 완료. 이후 이 페이지는 빠른 조회용이고 CSV는 백업/수동 가져오기용입니다.","→ đăng nhập Square → xong. Sau đó, trang này là chế độ xem nhanh và CSV là bản sao lưu/nhập thủ công của bạn."],
"Statuses come live from your Square account (refreshed every minute). \"Collected revenue\" counts only invoices Square marks PAID — the number that matters for taxes.": ["状态实时来自您的 Square 账户（每分钟刷新）。“已收款收入”仅统计 Square 标记为已付的账单 —— 这是报税所关注的数字。","Los estados llegan en vivo desde tu cuenta de Square (se actualizan cada minuto). «Ingresos cobrados» cuenta solo las facturas que Square marca como PAGADAS — la cifra que importa para los impuestos.","상태는 Square 계정에서 실시간으로 표시됩니다 (매분 갱신). ‘수금된 매출’은 Square가 결제됨으로 표시한 청구서만 계산합니다 — 세금에 중요한 숫자입니다.","Trạng thái được cập nhật trực tiếp từ tài khoản Square của bạn (làm mới mỗi phút). “Doanh thu đã thu” chỉ tính các hóa đơn được Square đánh dấu ĐÃ TRẢ — con số quan trọng cho thuế."],
# ---- articles (articles.html) ----
"📝 Articles & Proposals": ["📝 文章与提案","📝 Artículos y propuestas","📝 아티클 및 제안","📝 Bài viết & Đề xuất"],
"Ideas and proposals from Plateau Strategy Solution Lab. Like what resonates, and leave your email to follow a proposal you want to see happen.": ["来自 Plateau Strategy Solution Lab 的想法与提案。为您认同的内容点赞，并留下您的邮箱以关注您希望实现的提案。","Ideas y propuestas de Plateau Strategy Solution Lab. Dale me gusta a lo que te inspire y deja tu correo para seguir una propuesta que quieras ver realizada.","Plateau Strategy Solution Lab의 아이디어와 제안입니다. 공감되는 것에 좋아요를 누르고, 실현되길 바라는 제안을 팔로우하려면 이메일을 남기세요.","Các ý tưởng và đề xuất từ Plateau Strategy Solution Lab. Thích những gì bạn tâm đắc và để lại email để theo dõi đề xuất bạn muốn thấy thành hiện thực."],
"✍️ Write a new article / proposal": ["✍️ 撰写新文章 / 提案","✍️ Escribe un nuevo artículo / propuesta","✍️ 새 아티클 / 제안 작성","✍️ Viết bài / đề xuất mới"],
"Your name (author)": ["您的姓名（作者）","Tu nombre (autor)","이름 (작성자)","Tên của bạn (tác giả)"],
"Title — e.g. Proposal: Rent-to-own Tesla program": ["标题 —— 例如：提案：以租代购 Tesla 计划","Título — p. ej. Propuesta: Programa Tesla en alquiler con opción a compra","제목 — 예: 제안: 임대 후 소유 Tesla 프로그램","Tiêu đề — ví dụ: Đề xuất: Chương trình Tesla thuê-mua"],
"Write your article or proposal here…": ["在此撰写您的文章或提案……","Escribe tu artículo o propuesta aquí…","여기에 아티클이나 제안을 작성하세요…","Viết bài hoặc đề xuất của bạn ở đây…"],
"Publish": ["发布","Publicar","게시","Đăng"],
"No articles yet. Write your first proposal above.": ["暂无文章。在上方撰写您的第一个提案。","Aún no hay artículos. Escribe tu primera propuesta arriba.","아직 아티클이 없습니다. 위에서 첫 제안을 작성하세요.","Chưa có bài viết. Hãy viết đề xuất đầu tiên ở trên."],
# ---- driver-agent: refer & drive (self-referral, keep full fare) ----
"Refer & Drive": ["推荐并接送","Recomendar y conducir","소개하고 직접 운행","Giới thiệu & Tự lái"],
"Met a customer who needs a ride? Refer them here and drive them yourself — you keep the full fare.": ["碰到需要用车的客户？在这里推荐并亲自接送，整笔车费都归您。","¿Te encontraste con un cliente que necesita un viaje? Recomiéndalo aquí y llévalo tú mismo — te quedas con la tarifa completa.","차가 필요한 손님을 만나셨나요? 여기서 소개하고 직접 운행하시면 요금 전액을 가져가십니다.","Gặp khách cần đi xe? Giới thiệu tại đây và tự chở họ — bạn giữ trọn tiền cước."],
"You're both the agent and the driver on this trip.": ["这趟行程里，您既是推荐人，也是司机。","En este viaje eres a la vez el agente y el conductor.","이 운행에서는 소개자이자 기사님이 바로 회원님입니다.","Trong chuyến này, bạn vừa là người giới thiệu vừa là tài xế."],
"Normally about $15 of a $75 fare goes to a separate referring agent — but since you referred and drove it, that stays with you. You keep the full fare.": ["通常 $75 车费里约有 $15 是付给另一位推荐人的佣金 —— 但这单是您推荐、也是您开的，这笔钱就留给您。整笔车费都是您的。","Normalmente unos $15 de una tarifa de $75 van a otro agente que recomendó — pero como tú lo recomendaste y lo condujiste, ese dinero es tuyo. Te quedas con la tarifa completa.","보통 $75 요금 중 약 $15는 소개해 준 다른 에이전트에게 갑니다 — 하지만 이번에는 회원님이 소개하고 직접 운행했으니 그 금액도 회원님 몫입니다. 요금 전액을 가져가십니다.","Thông thường khoảng $15 trong cước $75 sẽ trả cho một đại lý giới thiệu khác — nhưng vì chính bạn giới thiệu và cầm lái, khoản đó là của bạn. Bạn giữ trọn tiền cước."],
"Tax note: the full fare is your income (referral + trip) and is reportable on your 1099. The customer is charged once.": ["税务提示：整笔车费都算您的收入（推荐费 + 车程），需计入您的 1099 报税。客户只付一次款。","Nota fiscal: la tarifa completa es tu ingreso (comisión + viaje) y se declara en tu 1099. Al cliente se le cobra una sola vez.","세금 안내: 요금 전액이 회원님의 소득(소개비 + 운행)이며 1099에 신고해야 합니다. 손님에게는 한 번만 청구됩니다.","Lưu ý thuế: toàn bộ cước là thu nhập của bạn (hoa hồng + chuyến đi) và phải khai trên mẫu 1099. Khách chỉ bị tính tiền một lần."],
"Customer name": ["客户姓名","Nombre del cliente","고객 이름","Tên khách hàng"],
"Customer email": ["客户邮箱","Correo del cliente","고객 이메일","Email khách hàng"],
"Customer phone": ["客户电话","Teléfono del cliente","고객 전화번호","Điện thoại khách hàng"],
"Refer & Assign to Me": ["推荐并指派给我","Recomendar y asignármelo","소개하고 나에게 배정","Giới thiệu & giao cho tôi"],
# ---- driver insurance ----
"Insurance": ["保险","Seguro","보험","Bảo hiểm"],
"Action Required — Proof of Insurance": ["需要处理 —— 保险证明","Acción requerida — Comprobante de seguro","조치 필요 — 보험 증명","Cần thực hiện — Bằng chứng bảo hiểm"],
"Upload valid proof of insurance before you can accept rides.": ["接单前，请先上传有效的保险证明。","Sube un comprobante de seguro válido antes de poder aceptar viajes.","운행을 수락하려면 먼저 유효한 보험 증명을 올려 주세요.","Hãy tải lên bằng chứng bảo hiểm còn hiệu lực trước khi nhận chuyến."],
"Upload Insurance": ["上传保险","Subir seguro","보험 올리기","Tải bảo hiểm lên"],
"Valid proof of insurance is required to accept rides. We track your expiry date so your coverage never lapses.": ["接单需要提供有效的保险证明。我们会记录到期日，确保您的保障不会中断。","Para aceptar viajes necesitas un comprobante de seguro válido. Registramos la fecha de vencimiento para que tu cobertura nunca caduque.","운행을 수락하려면 유효한 보험 증명이 필요합니다. 만료일을 관리해 보장이 끊기지 않도록 합니다.","Cần bằng chứng bảo hiểm còn hiệu lực để nhận chuyến. Chúng tôi theo dõi ngày hết hạn để bảo hiểm của bạn không bị gián đoạn."],
"Insurance provider": ["保险公司","Compañía de seguros","보험사","Công ty bảo hiểm"],
"Policy number": ["保单号","Número de póliza","증권 번호","Số hợp đồng"],
"Expiry date": ["到期日","Fecha de vencimiento","만료일","Ngày hết hạn"],
"Proof of insurance": ["保险证明","Comprobante de seguro","보험 증명","Bằng chứng bảo hiểm"],
"— photo or PDF": ["—— 照片或 PDF","— foto o PDF","— 사진 또는 PDF","— ảnh hoặc PDF"],
"Upload & Save": ["上传并保存","Subir y guardar","업로드 및 저장","Tải lên & Lưu"],
# ---- driver compliance / violations ----
"Compliance": ["合规","Cumplimiento","규정 준수","Tuân thủ"],
"Paperwork": ["文件资料","Documentación","서류","Giấy tờ"],
"Upload your documents — each one is archived and kept on file permanently (nothing is ever overwritten). This is your paper trail.": ["上传您的文件 —— 每一份都会归档并永久保存（绝不覆盖）。这就是您的文件记录。","Sube tus documentos: cada uno se archiva y se conserva de forma permanente (nada se sobrescribe). Este es tu historial documental.","서류를 올려 주세요 — 각 파일은 보관되어 영구히 유지됩니다(덮어쓰지 않음). 이것이 회원님의 서류 기록입니다.","Tải lên giấy tờ của bạn — mỗi tệp đều được lưu trữ và giữ vĩnh viễn (không bao giờ ghi đè). Đây là hồ sơ giấy tờ của bạn."],
"Document type": ["文件类型","Tipo de documento","서류 종류","Loại giấy tờ"],
"File": ["文件","Archivo","파일","Tệp"],
"Note": ["备注","Nota","메모","Ghi chú"],
"(optional)": ["（可选）","(opcional)","(선택)","(tùy chọn)"],
"Upload & Archive": ["上传并归档","Subir y archivar","업로드 및 보관","Tải lên & Lưu trữ"],
"Driver Paperwork & Compliance": ["司机文件与合规","Documentación y cumplimiento del conductor","운전자 서류 및 규정 준수","Giấy tờ & Tuân thủ của tài xế"],
"Every driver's archived documents and compliance standing. Click a driver to open their paper trail, then open any document to review it.": ["每位司机的归档文件与合规状况。点击某位司机可查看其文件记录，再打开任意文件进行查看。","Los documentos archivados y el estado de cumplimiento de cada conductor. Haz clic en un conductor para abrir su historial y luego abre cualquier documento para revisarlo.","각 운전자의 보관 서류와 규정 준수 상태입니다. 운전자를 클릭해 서류 기록을 열고, 문서를 눌러 확인하세요.","Tài liệu lưu trữ và tình trạng tuân thủ của từng tài xế. Nhấp vào một tài xế để mở hồ sơ, rồi mở bất kỳ tài liệu nào để xem."],
"Loading…": ["加载中……","Cargando…","불러오는 중…","Đang tải…"],
"⬇ Download the official copy (Word)": ["⬇ 下载正式文本（Word）","⬇ Descargar la copia oficial (Word)","⬇ 공식 사본 다운로드 (Word)","⬇ Tải bản chính thức (Word)"],
"Your standing against the Driver Agreement. The system flags issues automatically, and anything logged by dispatch appears here too. Clear all issues to keep accepting rides.": ["您在《司机协议》下的合规状况。系统会自动标记问题，调度中心记录的任何情况也会显示在此。请解决所有问题，以便继续接单。","Tu situación respecto al Acuerdo del conductor. El sistema detecta los problemas automáticamente, y todo lo que registre la central también aparece aquí. Resuelve todos los problemas para seguir aceptando viajes.","운전자 계약서에 대한 준수 상태입니다. 시스템이 문제를 자동으로 표시하며, 배차에서 기록한 사항도 여기에 표시됩니다. 계속 운행을 수락하려면 모든 문제를 해결하세요.","Tình trạng tuân thủ Thỏa thuận tài xế của bạn. Hệ thống tự động gắn cờ các vấn đề, và mọi ghi nhận từ điều phối cũng hiện ở đây. Hãy xử lý hết các vấn đề để tiếp tục nhận chuyến."],
}

# Second-pass translations live in their own file so this one stays readable.
try:
    from i18n_extra import EXTRA, EXTRA_SKIP
except ImportError:
    EXTRA, EXTRA_SKIP = {}, set()
TR.update(EXTRA)
SKIP |= EXTRA_SKIP

# ---- coverage report ----
missing = [s for s in strings if s not in TR and s not in SKIP]
unknown = [k for k in TR if k not in strings]
print("strings on page:", len(strings))
print("translated     :", len([s for s in strings if s in TR]))
print("skipped        :", len([s for s in strings if s in SKIP]))
if missing:
    print("\n!! MISSING (%d):" % len(missing))
    for s in missing: print("   ", repr(s))
# A MISSING key is a defect: a reader sees English where a translation should
# be. An UNKNOWN key is only an unused entry left behind when page copy changed
# — harmless, and worth keeping in case the wording comes back. So the build
# stops for missing and merely mentions unknown.
if unknown:
    print("\n(%d dictionary entries no longer appear on any page — kept, harmless)" % len(unknown))
if missing:
    print("\nNOT writing i18n.js until every visible line has a translation.")
    sys.exit(1)

# ---- build DICT + engine ----
LANGS_ORDER = ["zh","es","ko","vi"]
DICT = {}
for k, vals in TR.items():
    DICT[k] = {LANGS_ORDER[i]: vals[i] for i in range(4)}

ENGINE = r'''/* Plateau Strategy Solution Lab -- site-wide line-by-line translation.
   Zero markup changes: walks text nodes + placeholders/titles keyed by English.
   Persists the reader's choice and re-translates dynamically-injected content. */
(function () {
  var DICT = __DICT__;
  var LANGS = [["en", "English"], ["zh", "中文"], ["es", "Español"], ["ko", "한국어"], ["vi", "Tiếng Việt"]];
  var KEY = "ps_lang";
  // ?lang=zh wins over the stored choice, and is then stored, so a
  // language-targeted ad lands on the page already in that language instead of
  // in English with a switcher the visitor has to find. Only a language we
  // actually ship is accepted — anything else falls through to the stored
  // preference, so a stray query string cannot blank the page.
  var cur = (function () {
    var m = /[?&]lang=([a-zA-Z-]{2,5})/.exec(location.search);
    var want = m ? m[1].toLowerCase() : null;
    if (want && LANGS.some(function (l) { return l[0] === want; })) {
      try { localStorage.setItem(KEY, want); } catch (e) {}
      return want;
    }
    return localStorage.getItem(KEY) || "en";
  })();
  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  function tr(k) { var e = DICT[k]; return (e && e[cur]) ? e[cur] : null; }

  // Strings a page builds itself — "Open till 17:00 · ~60 min visit" — can never
  // be looked up whole: the dictionary would need an entry for every possible
  // time and duration. So the PATTERN is what gets translated, and the values
  // are dropped in afterwards. Word order differs between languages, which is
  // exactly why the placeholders are named rather than positional.
  //
  //   psxFmt("Open till {time} · ~{mins} min visit", {time: "17:00", mins: 60})
  //
  // Falls back to the English pattern when there is no translation, so a
  // missing entry shows English rather than "{time}".
  function fmt(pattern, vals) {
    var s = tr(pattern) || pattern;
    return s.replace(/\{(\w+)\}/g, function (m, k) {
      return (vals && vals[k] !== undefined) ? vals[k] : m;
    });
  }
  window.psxT = tr;
  window.psxFmt = fmt;
  window.psxLang = function () { return cur; };
  function doText(node) {
    var raw = node.nodeValue; if (!norm(raw)) return;
    if (node.__en === undefined) node.__en = raw;
    var en = node.__en;                 // always translate FROM the stored English source
    if (cur === "en") { node.nodeValue = en; return; }
    var t = tr(norm(en));
    if (t != null) {
      var lead = (en.match(/^\s*/) || [""])[0], tail = (en.match(/\s*$/) || [""])[0];
      node.nodeValue = lead + t + tail;
    } else { node.nodeValue = en; }
  }
  function skipEl(el) { return el && el.closest && el.closest(".i18n-skip"); }
  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 || skipEl(root)) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode; if (!p) return NodeFilter.FILTER_REJECT;
        var t = p.nodeName;
        if (t === "SCRIPT" || t === "STYLE" || t === "NOSCRIPT" || t === "TEXTAREA") return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest(".i18n-skip")) return NodeFilter.FILTER_REJECT;
        if (!norm(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var arr = [], n; while (n = w.nextNode()) arr.push(n); arr.forEach(doText);
  }
  function doAttrs(root) {
    if (!root.querySelectorAll) return;
    root.querySelectorAll("[placeholder],[title]").forEach(function (el) {
      ["placeholder", "title"].forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        var raw = el.getAttribute(a), store = "__en_" + a;
        if (el[store] === undefined) el[store] = raw;
        if (cur === "en") { el.setAttribute(a, el[store]); return; }
        var t = tr(norm(el[store])); el.setAttribute(a, t != null ? t : el[store]);
      });
    });
  }
  var applying = false;
  function apply() {
    applying = true;
    document.documentElement.setAttribute("lang", cur === "zh" ? "zh-CN" : cur);
    walk(document.body); doAttrs(document.body);
    var lbl = document.getElementById("i18nCur");
    if (lbl) LANGS.forEach(function (l) { if (l[0] === cur) lbl.textContent = l[1]; });
    var opts = document.querySelectorAll("#i18nMenu .i18n-opt");
    for (var i = 0; i < opts.length; i++) opts[i].setAttribute("aria-current", opts[i].getAttribute("data-l") === cur ? "true" : "false");
    applying = false;
  }
  function setLang(l) {
    cur = l; localStorage.setItem(KEY, l); apply();
    var m = document.getElementById("i18nMenu"); if (m) m.style.display = "none";
    // Text nodes are re-walked by apply(). Anything a page ASSEMBLED with
    // psxFmt is already baked into the DOM as one string and cannot be
    // re-walked, so the page has to rebuild it — this is how it finds out.
    try { document.dispatchEvent(new CustomEvent("psx:lang", { detail: l })); }
    catch (e) {}
  }
  function buildSwitcher() {
    var css = document.createElement("style");
    css.textContent =
      "#i18nSwitch{position:fixed;bottom:18px;right:18px;z-index:600;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}" +
      "#i18nBtn{display:flex;align-items:center;gap:.4rem;background:#0f172a;color:#fff;border:1px solid rgba(255,255,255,.18);" +
      "border-radius:999px;padding:.5rem .9rem;font-size:.86rem;font-weight:600;cursor:pointer;box-shadow:0 10px 28px rgba(0,0,0,.35);}" +
      "#i18nBtn:hover{background:#1e293b;}" +
      "#i18nMenu{display:none;position:absolute;bottom:52px;right:0;min-width:160px;background:#0f172a;border:1px solid rgba(255,255,255,.14);" +
      "border-radius:12px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,0,.45);}" +
      "#i18nMenu .i18n-opt{display:block;width:100%;text-align:left;background:none;border:none;color:#e2e8f0;padding:.62rem .95rem;" +
      "font-size:.9rem;cursor:pointer;}" +
      "#i18nMenu .i18n-opt:hover{background:#1e293b;}" +
      "#i18nMenu .i18n-opt[aria-current='true']{background:#2563eb;color:#fff;}" +
      // On a phone the switcher sits exactly where the next form field and the
      // submit button are. Shrink it to the globe alone — a round 44px target,
      // which is bigger to hit than the old pill and covers a third as much.
      "@media (max-width:640px){" +
        "#i18nSwitch{bottom:calc(12px + env(safe-area-inset-bottom,0px));right:12px;}" +
        "#i18nBtn{width:44px;height:44px;padding:0;gap:0;border-radius:50%;justify-content:center;font-size:1.05rem;}" +
        "#i18nBtn>span:not(:first-child){display:none;}" +
        "#i18nMenu{bottom:54px;}" +
      "}" +
      // And while someone is actually typing, get out of the way entirely.
      "#i18nSwitch{transition:opacity .2s ease,transform .2s ease;}" +
      "#i18nSwitch.i18n-away{opacity:0;transform:translateY(10px) scale(.92);pointer-events:none;}";
    document.head.appendChild(css);
    var wrap = document.createElement("div");
    wrap.id = "i18nSwitch"; wrap.className = "i18n-skip";
    var opts = LANGS.map(function (l) {
      return '<button class="i18n-opt" data-l="' + l[0] + '">' + l[1] + '</button>';
    }).join("");
    wrap.innerHTML =
      '<button id="i18nBtn" aria-label="Language"><span>🌐</span><span id="i18nCur">English</span><span style="opacity:.7">▾</span></button>' +
      '<div id="i18nMenu">' + opts + '</div>';
    document.body.appendChild(wrap);
    document.getElementById("i18nBtn").addEventListener("click", function (e) {
      e.stopPropagation();
      var m = document.getElementById("i18nMenu");
      m.style.display = m.style.display === "block" ? "none" : "block";
    });
    wrap.querySelectorAll(".i18n-opt").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-l")); });
    });
    document.addEventListener("click", function () {
      var m = document.getElementById("i18nMenu"); if (m) m.style.display = "none";
    });
    // Typing wins. On a phone the on-screen keyboard shoves the page up and the
    // switcher lands on top of whatever field comes next, so it steps aside
    // while any field has focus and comes back when the form is done with.
    function typing(el) {
      return !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) &&
             !/^(submit|button|hidden)$/.test(el.type || "");
    }
    document.addEventListener("focusin", function (e) {
      if (typing(e.target)) wrap.classList.add("i18n-away");
    });
    document.addEventListener("focusout", function () {
      // A tick, so moving between two fields does not flicker it in and out.
      setTimeout(function () {
        if (!typing(document.activeElement)) wrap.classList.remove("i18n-away");
      }, 80);
    });
  }
  function boot() {
    buildSwitcher(); apply();
    var obs = new MutationObserver(function (muts) {
      if (applying || cur === "en") return;   // English is the source — no re-walk needed on DOM churn
      applying = true;
      muts.forEach(function (m) {
        for (var i = 0; i < m.addedNodes.length; i++) {
          var n = m.addedNodes[i];
          if (n.nodeType === 1) { if (!skipEl(n)) { walk(n); doAttrs(n); } }
          else if (n.nodeType === 3) doText(n);
        }
      });
      applying = false;
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
'''

out = ENGINE.replace("__DICT__", json.dumps(DICT, ensure_ascii=False))
open(os.path.join(PROJ, "i18n.js"), "w", encoding="utf-8").write(out)
print("\nwrote i18n.js  (%d dict entries, %d bytes)" % (len(DICT), len(out)))
