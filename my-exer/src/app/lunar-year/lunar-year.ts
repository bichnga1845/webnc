import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ================= CÁC HÀM XỬ LÝ LỊCH ================= */

function jdFromDate(dd: number, mm: number, yy: number): number {
  let a = Math.floor((14 - mm) / 12);
  let y = yy + 4800 - a;
  let m = mm + 12 * a - 3;

  let jd = dd
    + Math.floor((153 * m + 2) / 5)
    + 365 * y
    + Math.floor(y / 4)
    - Math.floor(y / 100)
    + Math.floor(y / 400)
    - 32045;

  // CHỐT HẠ
  if (jd < 2299161) {
    jd = dd
      + Math.floor((153 * m + 2) / 5)
      + 365 * y
      + Math.floor(y / 4)
      - 32083;
  }

  return jd;
}

function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;

  let Jd1 = 2415020.75933
    + 29.53058868 * k
    + 0.0001178 * T2
    - 0.000000155 * T3;

  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

  let C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr)
    + 0.0021 * Math.sin(2 * dr * M)
    - 0.4068 * Math.sin(Mpr * dr)
    + 0.0161 * Math.sin(2 * dr * Mpr)
    - 0.0004 * Math.sin(3 * dr * Mpr)
    + 0.0104 * Math.sin(2 * dr * F)
    - 0.0051 * Math.sin(dr * (M + Mpr))
    - 0.0074 * Math.sin(dr * (M - Mpr))
    + 0.0004 * Math.sin(dr * (2 * F + M))
    - 0.0004 * Math.sin(dr * (2 * F - M))
    - 0.0006 * Math.sin(dr * (2 * F + Mpr))
    + 0.0010 * Math.sin(dr * (2 * F - Mpr))
    + 0.0005 * Math.sin(dr * (2 * Mpr + M));

  const deltat =
    T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;

  const JdNew = Jd1 + C1 - deltat;
  return Math.floor(JdNew + 0.5 + timeZone / 24);
}
function getSunLongitude(jdn: number, timeZone: number): number {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;

  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;

  let DL =
    (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * dr * M)
    + 0.000290 * Math.sin(3 * dr * M);

  let L = (L0 + DL) * dr;
  L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));

  return Math.floor((L / (Math.PI * 2)) * 12);

}


function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  if (getSunLongitude(nm, timeZone) >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  let k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);

  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);

  return i - 1;
}


function convertSolar2Lunar(
  dd: number,
  mm: number,
  yy: number,
  timeZone: number
): number[] {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);

  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear: number;

  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  let diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = 1;
      }
    }
  }

  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }

  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  return [lunarDay, lunarMonth, lunarYear, lunarLeap];
}


/* ================= MODEL ================= */

export class LunarYear {
  constructor(
    public day: number,
    public month: number,
    public year: number
  ) {}

  findLunarYearDetail() {
    const d = this.day;
    const m = this.month;
    const y = this.year;
  
    const jdn = jdFromDate(d, m, y);
  
    const can = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
    const chi = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
    const thu = ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"];
  
    /* ===== THỨ ===== */
    const dayOfWeek = thu[jdn % 7];
  
    /* ===== ÂM LỊCH ===== */
    const lunar = convertSolar2Lunar(d, m, y, 7);
    const lunarD = lunar[0];
    const lunarM = lunar[1];
    const lunarY = lunar[2];
    const lunarLeap = lunar[3]; // 0 | 1
  
    /* ===== CAN CHI NGÀY ===== */
    const ngayCan = can[(jdn + 9) % 10];
    const ngayChi = chi[(jdn + 1) % 12];
  
    /* ===== CAN CHI NĂM (NĂM ÂM) ===== */
    const namCanIndex = (lunarY + 6) % 10;
    const namChiIndex = (lunarY + 8) % 12;
  
    /* ===== CAN CHI THÁNG ===== */
    // Can tháng Giêng = (Can năm % 5) * 2 + 2
    const startMonthCanIndex = ((namCanIndex % 5) * 2 + 2) % 10;
    const monthCanIndex = (startMonthCanIndex + lunarM - 1) % 10;
    const monthChiIndex = (lunarM + 1) % 12;
  
    return {
      thu: dayOfWeek,
      ngayAm: `${lunarD}/${lunarM}/${lunarY}${lunarLeap ? ' (Nhuận)' : ''}`,
      nam: `${can[namCanIndex]} ${chi[namChiIndex]}`,
      thang: `${can[monthCanIndex]} ${chi[monthChiIndex]}`,
      ngay: `${ngayCan} ${ngayChi}`
    };
  }
  

  
}

/* ================= COMPONENT ================= */

@Component({
  selector: 'app-lunar-year',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lunar-year.html',
  styleUrls: ['./lunar-year.css']
})
export class Ex10LunarYearComponent implements OnInit {

  days: number[] = [];
  months: number[] = [];
  years: number[] = [];

  selectedDay = 15;
  selectedMonth = 5;
  selectedYear = 1986;

  lunarResult: any = null;

  ngOnInit(): void {
    for (let i = 1; i <= 31; i++) this.days.push(i);
    for (let i = 1; i <= 12; i++) this.months.push(i);
    for (let i = 1900; i <= 2100; i++) this.years.push(i);
  }

  convert(): void {
    const lunar = new LunarYear(
      this.selectedDay,
      this.selectedMonth,
      this.selectedYear
    );
    this.lunarResult = lunar.findLunarYearDetail();
  }
}
