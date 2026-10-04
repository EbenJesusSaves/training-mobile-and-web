import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { classLabel, formatDuration, formatLongDate, formatMoney, formatTime } from '@/libs/format';

import { barcodeSvg } from './barcode';

import { borderWidths } from '@/constants/borders';
import { ticketColors } from '@/constants/colors';
import { pdfTicketGeometry } from '@/constants/drawing';
import { systemFontStack } from '@/constants/fonts';
import { radii } from '@/constants/radii';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';
import { fontSizes, fontWeights, letterSpacings } from '@/constants/typography';

import type { Booking } from '@/api/types';

const px = (value: number) => `${value}px`;
const escape = (value: string) => value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const css = `
  @page { margin: ${px(spacing.xxl)}; }
  body { font-family: ${systemFontStack}; color: ${ticketColors.ink}; margin: 0; }
  .ticket { border: ${px(borderWidths.thin)} solid ${ticketColors.perforation}; border-radius: ${px(radii.xxl)}; padding: ${px(spacing.xxxl)} ${px(spacing.huge)}; margin: 0 auto ${px(spacing.xxl)}; max-width: ${px(pdfTicketGeometry.maxWidth)}; page-break-after: always; }
  .brand { font-size: ${px(fontSizes.xs)}; letter-spacing: ${px(letterSpacings.wider)}; text-transform: uppercase; color: ${ticketColors.brand}; font-weight: ${fontWeights.bold}; margin-bottom: ${px(spacing.md)}; }
  .void { background: ${ticketColors.voidSoft}; color: ${ticketColors.void}; font-weight: ${fontWeights.bold}; padding: ${px(spacing.sm)} ${px(spacing.md)}; border-radius: ${px(radii.md)}; margin-bottom: ${px(spacing.md)}; font-size: ${px(fontSizes.xs)}; }
  .label { color: ${ticketColors.muted}; font-size: ${px(fontSizes.xs)}; margin-top: ${px(spacing.xxxs)}; }
  .gap { margin-top: ${px(spacing.lg)}; }
  .big { font-size: ${px(fontSizes.xxl)}; font-weight: ${fontWeights.semibold}; margin: ${px(spacing.xxxs)} 0 ${px(spacing.xs)}; }
  .row { display: flex; justify-content: space-between; align-items: flex-start; }
  .right { text-align: right; }
  .times { color: ${ticketColors.muted}; font-size: ${px(fontSizes.xs)}; margin-top: ${px(spacing.md)}; }
  .times b { color: ${ticketColors.ink}; }
  .line { display: flex; align-items: center; margin: ${px(spacing.xs)} 0 ${px(spacing.md)}; }
  .dot { width: ${px(spacing.sm)}; height: ${px(spacing.sm)}; border-radius: ${px(radii.pill)}; background: ${ticketColors.ink}; }
  .solid { flex: 1; height: ${px(borderWidths.thick)}; background: ${ticketColors.ink}; }
  .dash { flex: 1; border-top: ${px(borderWidths.thick)} dashed ${ticketColors.dash}; }
  .ring { width: ${px(spacing.xs)}; height: ${px(spacing.xs)}; border-radius: ${px(radii.pill)}; border: ${px(borderWidths.thick)} solid ${ticketColors.dash}; }
  .details { margin-top: ${px(spacing.md)}; text-align: center; }
  .perforation { border-top: ${px(borderWidths.thick)} dashed ${ticketColors.perforation}; margin: ${px(spacing.lg)} -${px(spacing.huge)}; }
  .barcode { text-align: center; }
  .code { text-align: center; color: ${ticketColors.muted}; letter-spacing: ${px(letterSpacings.wide)}; font-size: ${px(fontSizes.xs)}; margin-top: ${px(spacing.xs)}; }
  .foot { color: ${ticketColors.muted}; font-size: ${px(fontSizes.xs)}; margin-top: ${px(spacing.lg)}; text-align: center; max-width: ${px(sizes.readableTextWidth)}; margin-left: auto; margin-right: auto; }
`;

/** One page per passenger per journey, mirroring the in-app ticket. */
export function ticketHtml(booking: Booking): string {
  const pages = booking.segments.flatMap((segment) =>
    segment.tickets.map((ticket) => {
      const { journey } = segment;
      const status = booking.status === 'CANCELLED' || !ticket.isActive ? '<div class="void">CANCELLED — NOT VALID FOR TRAVEL</div>' : '';
      return `
      <section class="ticket">
        <div class="brand">RailPass · ${segment.direction === 'RETURN' ? 'Return' : 'Outbound'} ticket</div>
        ${status}
        <div class="label">Passenger</div>
        <div class="big">${escape(ticket.passengerName)}</div>
        <div class="row times"><span>${formatTime(journey.departureAt)}</span><b>${formatDuration(journey.durationMinutes)}</b><span>${formatTime(journey.arrivalAt)}</span></div>
        <div class="line"><i class="dot"></i><i class="solid"></i><i class="dash"></i><i class="ring"></i></div>
        <div class="row"><div><div class="big">${escape(journey.origin.city)}</div><div class="label">${escape(journey.origin.name)}</div></div>
          <div class="right"><div class="big">${escape(journey.destination.city)}</div><div class="label">${escape(journey.destination.name)}</div></div></div>
        <div class="label">${formatLongDate(journey.departureAt)} · ${escape(journey.trainNumber)} ${escape(journey.trainName)} · ${classLabel(segment.travelClass)}</div>
        <div class="label gap">Booking Reference</div>
        <div class="big">${escape(booking.reference)}</div>
        <div class="row details"><div><div class="label">Train Car</div><div class="big">${ticket.carNumber}</div></div>
          <div><div class="label">Train</div><div class="big">${escape(journey.trainNumber.replace(' ', ''))}</div></div>
          <div><div class="label">Seat</div><div class="big">${ticket.seatNumber}</div></div></div>
        <div class="perforation"></div>
        <div class="barcode">${ticket.barcode ? barcodeSvg(ticket.barcode, pdfTicketGeometry.barcodeWidth, pdfTicketGeometry.barcodeHeight) : ''}</div>
        <div class="code">${escape(ticket.ticketCode)}</div>
        <div class="foot">Total ${formatMoney(booking.totalCents)}. Times are GMT.</div>
      </section>`;
    }),
  );
  return `<!doctype html><html><head><meta charset="utf-8"/><style>${css}</style></head><body>${pages.join('')}</body></html>`;
}

/** Renders the PDF on the device and opens the share sheet (Save to Files, email, print…). */
export async function shareTicketPdf(booking: Booking) {
  const { uri } = await Print.printToFileAsync({ html: ticketHtml(booking) });
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device.');
  }
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: `RailPass ticket ${booking.reference}` });
  return uri;
}
