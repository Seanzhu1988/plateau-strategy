# -*- coding: utf-8 -*-
"""Check ad assets against Google's real limits before they are written down.

Google Ads counts a double-width character as two, so a Chinese or Korean
headline gets 15 characters, not 30. Copy that fits in English and is then
translated will be rejected at upload, which is the ordinary way a
multilingual campaign fails.
"""
import unicodedata

HEAD, DESC = 30, 90


def width(s):
    """Google's count: full-width and wide characters cost two."""
    return sum(2 if unicodedata.east_asian_width(c) in ("W", "F") else 1 for c in s)


ASSETS = {
"en": {
 "headlines": [
  "Flat $75 to Sea-Tac",
  "Seattle Airport Car Service",
  "Tesla Airport Transfer",
  "The Quote Is the Fare",
  "No Surge, No Meter",
  "Reserve Any Hour, 24/7",
  "Driver Arrives 15 Min Early",
  "Fixed-Price Airport Rides",
  "Seattle to Sea-Tac, $75",
  "Price Agreed Before Booking",
  "Book Your Sea-Tac Ride",
  "Service in Five Languages",
  "Ride to Sea-Tac in a Tesla",
  "Airport Transfer, Flat Rate",
  "Quoted Once. That's the Fare.",
 ],
 "descriptions": [
  "Flat $75 to Sea-Tac. The fare you are quoted is the fare you pay. No surge, no meter.",
  "Reserve any hour of the day. Your driver arrives fifteen minutes early, in a Tesla.",
  "Seattle airport transfers at a price agreed before you book. Pay exactly what was quoted.",
  "Book in English, Chinese, Korean, Vietnamese or Spanish. A Seattle service, not an app.",
 ]},

"zh": {
 "headlines": [
  "西雅图机场接送",
  "固定价 75 美元",
  "特斯拉机场专车",
  "报价即车费",
  "不加价 不计表",
  "全天候可预约",
  "司机提前 15 分钟",
  "中文预约用车",
  "西雅图至机场",
  "价格预先确定",
  "机场接送 固定价",
  "专车 非打车软件",
  "预订前明确报价",
  "西雅图专车服务",
  "机场用车 中文服务",
 ],
 "descriptions": [
  "西雅图至机场固定价 75 美元。报价即为车费，不加价、不计表。",
  "全天候可预约。司机提前十五分钟到达，车辆为特斯拉。",
  "预订前即确定价格，付款金额与报价完全一致。",
  "可用中文预约。西雅图本地专车服务，并非打车软件。",
 ]},

"es": {
 "headlines": [
  "Tarifa Fija $75 al Sea-Tac",
  "Traslado Aeropuerto Seattle",
  "Servicio Tesla al Aeropuerto",
  "El Precio Es la Tarifa",
  "Sin Recargos ni Taxímetro",
  "Reserve a Cualquier Hora",
  "El Conductor Llega Antes",
  "Precio Cerrado, Sin Sorpresas",
  "Seattle al Sea-Tac por $75",
  "Reserve en Español",
  "Traslado a Precio Fijo",
  "Coche al Aeropuerto 24/7",
  "Tarifa Acordada Antes",
  "Servicio de Coche Seattle",
  "Al Aeropuerto en Tesla",
 ],
 "descriptions": [
  "Tarifa fija de $75 al Sea-Tac. El precio que le damos es el que paga. Sin recargos.",
  "Reserve a cualquier hora. Su conductor llega quince minutos antes, en un Tesla.",
  "Traslados al aeropuerto de Seattle con precio acordado antes de reservar.",
  "Reserve en español. Un servicio de coche de Seattle, no una aplicación.",
 ]},

"ko": {
 "headlines": [
  "시애틀 공항 픽업",
  "정액 75달러",
  "테슬라 공항 이동",
  "견적이 곧 요금",
  "할증 없음",
  "24시간 예약 가능",
  "기사 15분 전 도착",
  "한국어 예약 가능",
  "시애틀발 공항행",
  "예약 전 요금 확정",
  "공항 이동 정액제",
  "앱이 아닌 차량서비스",
  "요금 사전 확정",
  "시애틀 차량 서비스",
  "공항까지 테슬라로",
 ],
 "descriptions": [
  "시애틀에서 공항까지 정액 75달러. 안내한 요금이 그대로 청구됩니다. 할증 없음.",
  "언제든 예약 가능합니다. 기사가 15분 일찍 도착하며, 차량은 테슬라입니다.",
  "예약 전에 요금이 확정되며, 안내받은 금액만 결제하십니다.",
  "한국어로 예약하실 수 있습니다. 앱이 아닌 시애틀 현지 차량 서비스입니다.",
 ]},

"vi": {
 "headlines": [
  "Đón Sân Bay Sea-Tac",
  "Giá Cố Định 75 USD",
  "Xe Tesla Ra Sân Bay",
  "Báo Giá Là Giá Đi",
  "Không Phụ Thu",
  "Đặt Xe Mọi Giờ",
  "Tài Xế Đến Sớm 15 Phút",
  "Đặt Xe Bằng Tiếng Việt",
  "Seattle Đi Sân Bay",
  "Giá Chốt Trước Khi Đặt",
  "Đưa Đón Giá Cố Định",
  "Dịch Vụ Xe Seattle",
  "Không Phải Ứng Dụng",
  "Ra Sân Bay Bằng Tesla",
  "Giá Rõ Ràng Từ Đầu",
 ],
 "descriptions": [
  "Giá cố định 75 USD tới sân bay Sea-Tac. Báo giá thế nào thì trả đúng thế ấy.",
  "Đặt xe bất kỳ giờ nào. Tài xế đến sớm mười lăm phút, xe Tesla.",
  "Đưa đón sân bay Seattle với giá chốt trước khi đặt. Trả đúng số đã báo.",
  "Có thể đặt bằng tiếng Việt. Dịch vụ xe tại Seattle, không phải ứng dụng.",
 ]},
}

fails = 0
for lang, a in ASSETS.items():
    print(f"\n{lang.upper()} , headlines ≤{HEAD}, descriptions ≤{DESC} (double-width counts 2)")
    for h in a["headlines"]:
        w = width(h)
        flag = "  OVER" if w > HEAD else ""
        if w > HEAD:
            fails += 1
        print(f"   {w:>3}  {h}{flag}")
    for d in a["descriptions"]:
        w = width(d)
        flag = "  OVER" if w > DESC else ""
        if w > DESC:
            fails += 1
        print(f"   {w:>3}  {d}{flag}")
    print(f"   {len(a['headlines'])} headlines, {len(a['descriptions'])} descriptions")

print("\n" + "=" * 64)
print("all assets fit" if not fails else f"{fails} asset(s) OVER the limit, fix before upload")
raise SystemExit(1 if fails else 0)
