import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ================= CÁC HÀM XỬ LÝ LỊCH ================= */

function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  return dd
    + Math.floor((153 * m + 2) / 5)
    + 365 * y
    + Math.floor(y / 4)
    - Math.floor(y / 100)
    + Math.floor(y / 400)
    - 32045;
}

function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T) * dr);
  return Math.floor(Jd1 + 0.5 + timeZone / 24);
}

function getSunLongitude(jdn: number, timeZone: number): number {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  const dr = Math.PI / 180;
  let L = 280.46645 + 36000.76983 * T;
  L = (L * dr) % (Math.PI * 2);
  return Math.floor((L / Math.PI) * 6);
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
