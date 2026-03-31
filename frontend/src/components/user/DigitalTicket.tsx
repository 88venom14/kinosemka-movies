import React from 'react';
import { Booking } from '../../types';
import { Modal } from '../common/Modal';
import { QRCodeSVG } from 'qrcode.react';

interface DigitalTicketProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalTicket: React.FC<DigitalTicketProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  if (!booking) return null;

  // Генерируем уникальные данные для QR-кода
  const qrData = JSON.stringify({
    bookingId: booking._id,
    showtimeId: booking.showtimeId,
    seats: booking.seatNumbers,
    totalPrice: booking.totalPrice,
    timestamp: booking.bookingDate,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ваш билет" size="md">
      <div className="text-center">
        {/* QR Code */}
        <div className="w-52 h-52 mx-auto mb-8 bg-white p-1 flex items-center justify-center">
          <QRCodeSVG
            value={qrData}
            size={200}
            level="L"
            includeMargin={false}
          />
        </div>

        {/* Ticket Info */}
        <div className="border-t border-b border-cs-border py-6 mb-6">
          <p className="text-sm text-cs-text-secondary mb-2">Номер заказа</p>
          <p className="text-xl text-white font-mono mb-4">
            {booking._id.slice(-12).toUpperCase()}
          </p>

          {booking.showtime && (
            <>
              <div className="grid grid-cols-[auto_1fr] gap-4 text-left mb-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-cs-text-secondary">Дата и время</p>
                    <p className="text-white">
                      {new Date(booking.showtime.dateTime).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                      })}{' '}
                      {new Date(booking.showtime.dateTime).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-cs-text-secondary">Места</p>
                    <p className="text-white">{booking.seatNumbers.join(', ')}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center px-2">
                  <p className="text-lg text-cs-text-secondary font-medium">Зал</p>
                  <p className="text-3xl text-white font-bold">{booking.showtime.screenNumber}</p>
                </div>
              </div>
            </>
          )}

          <div className="mt-4 pt-4 border-t border-cs-border">
            <p className="text-xs text-cs-text-secondary">Оплачено</p>
            <p className="text-2xl text-white">{booking.totalPrice} ₽</p>
          </div>
        </div>

        <p className="text-xs text-cs-text-secondary">
          Покажите этот билет на входе в кинотеатр
        </p>
      </div>
    </Modal>
  );
};
