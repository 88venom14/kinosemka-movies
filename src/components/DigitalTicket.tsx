'use client';
import React from 'react';
import { Booking } from '@/types';
import Modal from './Modal';

interface DigitalTicketProps {
    booking: Booking | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function DigitalTicket({ booking, isOpen, onClose }: DigitalTicketProps) {
    if (!booking) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Ваш билет" size="md">
            <div className="ticket">
                <div className="ticket__qr-wrapper">
                    <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🎬</div>
                </div>
                <div className="ticket__info">
                    <p className="ticket__order-label">Номер заказа</p>
                    <p className="ticket__order-id">{booking._id.slice(-12).toUpperCase()}</p>
                    {booking.showtime && (
                        <>
                            <div className="ticket__details-grid">
                                <div className="ticket__details-left">
                                    <div>
                                        <p className="ticket__details-label">Дата и время</p>
                                        <p className="ticket__details-value">
                                            {new Date(booking.showtime.dateTime).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}{' '}
                                            {new Date(booking.showtime.dateTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="ticket__details-label">Места</p>
                                        <p className="ticket__details-value">{booking.seatNumbers.join(', ')}</p>
                                    </div>
                                </div>
                                <div className="ticket__details-hall">
                                    <p className="ticket__details-hall-label">Зал</p>
                                    <p className="ticket__details-hall-number">{booking.showtime.screenNumber}</p>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="ticket__payment">
                        <p className="ticket__payment-label">Оплачено</p>
                        <p className="ticket__payment-amount">{booking.totalPrice} ₽</p>
                    </div>
                </div>
                <p className="ticket__footer-text">Покажите этот билет на входе в кинотеатр</p>
            </div>
        </Modal>
    );
}
