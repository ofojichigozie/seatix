import { formatDateTime } from './formatDate';
import { formatCurrency } from './formatCurrency';
import { SEAT_TYPE_COLORS, SEAT_TYPE_LABELS } from '../types/seat.types';
import type { Booking } from '../types/booking.types';
import type { Seat } from '../types/seat.types';

/** Opens a print window for a single seat ticket. */
export function printTicket(seat: Seat, booking: Booking): void {
  const win = window.open('', '_blank', 'width=480,height=520');
  if (!win) return;
  const typeColor = SEAT_TYPE_COLORS[seat.seatType];

  win.document.write(
    `<!DOCTYPE html>
    <html><head><title>Ticket — ${seat.row}${seat.seatNumber}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:system-ui,sans-serif;background:#F9FAFB;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}
      .ticket{background:#fff;border-radius:12px;overflow:hidden;width:100%;max-width:400px;box-shadow:0 4px 24px rgba(0,0,0,.10)}
      .ticket-top{background:#1E3A8A;padding:20px 24px 18px;color:#fff}
      .brand{font-size:13px;opacity:.7;letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px}
      .event{font-size:18px;font-weight:700;line-height:1.3;margin-bottom:10px}
      .meta{font-size:12px;opacity:.8;line-height:1.8}
      .tear{height:0;border-top:2px dashed rgba(0,0,0,.12);margin:0 16px;position:relative}
      .tear::before,.tear::after{content:'';position:absolute;top:-10px;width:20px;height:20px;background:#F9FAFB;border-radius:50%}
      .tear::before{left:-26px} .tear::after{right:-26px}
      .ticket-body{padding:20px 24px}
      .seat-label{font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
      .seat-num{font-size:48px;font-weight:800;color:#111;letter-spacing:-1px;line-height:1}
      .type-pill{display:inline-flex;align-items:center;gap:6px;background:#F3F4F6;border-radius:20px;padding:4px 12px;font-size:13px;font-weight:600;margin-top:10px}
      .type-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
      .price-row{margin-top:18px;padding-top:16px;border-top:1px solid #E5E7EB}
      .price-label{font-size:12px;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px}
      .price{font-size:20px;font-weight:700;color:#111}
      .ref{font-family:monospace;font-size:11px;color:#9CA3AF;margin-top:14px;text-align:center}
      @media print{body{background:#fff} .ticket{box-shadow:none}}
    </style></head>
    <body>
      <div class="ticket">
        <div class="ticket-top">
          <div class="brand">🎫 Seatix</div>
          <div class="event">${booking.event?.title ?? 'Event'}</div>
          <div class="meta">
            📍 ${booking.event?.venue ?? '—'}<br/>
            📅 ${booking.event ? formatDateTime(booking.event.eventDate) : '—'}
          </div>
        </div>
        <div class="tear"></div>
        <div class="ticket-body">
          <div class="seat-label">Your Seat</div>
          <div class="seat-num">${seat.row}${seat.seatNumber}</div>
          <div class="type-pill">
            <span class="type-dot" style="background:${typeColor}"></span>
            ${SEAT_TYPE_LABELS[seat.seatType]}
          </div>
          <div class="price-row">
            <div class="price-label">Ticket Price</div>
            <div class="price">${formatCurrency(Number(seat.price))}</div>
          </div>
          <div class="ref">Booking ref: #${booking.reference}</div>
        </div>
      </div>
    </body></html>`,
  );
  win.document.close();
  win.focus();
  win.print();
}
