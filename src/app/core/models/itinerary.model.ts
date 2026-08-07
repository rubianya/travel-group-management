export interface Itinerary {
  id?: number;
  tripId: number;
  dayNo: number; // วันที่ (เช่น 1, 2, 3)
  time: string; // เวลา (เช่น "09:00")
  title: string; // ชื่อกิจกรรม
  location: string; // สถานที่
}