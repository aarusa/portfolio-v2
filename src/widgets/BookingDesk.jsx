import { useMemo, useState } from "react";
import { DAY_MINUTES, fit } from "../lib/dayload";

const services = [
  { id: "bath", name: "Bath and tidy", minutes: 45 },
  { id: "full", name: "Full groom", minutes: 90 },
  { id: "nails", name: "Nails and ears", minutes: 20 },
];

const clients = [
  { id: "nora", name: "Nora", dogs: ["Maple", "Otis", "Juniper"] },
  { id: "amira", name: "Amira", dogs: ["Nori", "Fig"] },
  { id: "jonah", name: "Jonah", dogs: ["Bean", "Piper"] },
  { id: "leo", name: "Leo", dogs: ["Dust"] },
];

export function BookingDesk() {
  const [clientId, setClientId] = useState("nora");
  const [dog, setDog] = useState("Maple");
  const [serviceId, setServiceId] = useState("bath");
  const [bookings, setBookings] = useState([{ id: "seed", client: "Nora", dog: "Maple", service: services[0] }]);
  const [note, setNote] = useState("Nora’s dog Maple already has a bath. Book Otis or Juniper next.");

  const client = clients.find((item) => item.id === clientId) || clients[0];
  const service = services.find((item) => item.id === serviceId) || services[0];
  const used = useMemo(() => bookings.reduce((sum, booking) => sum + booking.service.minutes, 0), [bookings]);
  const left = Math.max(DAY_MINUTES - used, 0);
  const filled = Math.min((used / DAY_MINUTES) * 100, 100);

  function selectClient(id) {
    const next = clients.find((item) => item.id === id);
    setClientId(id);
    setDog(next?.dogs[0] || "");
  }

  function book(event) {
    event.preventDefault();
    const result = fit(used, service.minutes);
    if (!result.ok) {
      setNote(`${service.name} needs ${service.minutes} minutes. ${result.left} are left today.`);
      return;
    }
    setBookings((current) => [
      ...current,
      { id: `${client.name}-${dog}-${current.length}`, client: client.name, dog, service },
    ]);
    setNote(`${client.name} · ${dog} · ${service.name}. ${DAY_MINUTES - used - service.minutes} minutes remain.`);
  }

  return (
    <div className="widget widget--booking">
      <div className="widget__panel booking__day">
        <div className="booking__meter" aria-hidden="true">
          <div className="booking__meter-fill" style={{ width: `${filled}%` }} />
        </div>
        <div className="daybar" aria-hidden="true">
          {bookings.map((booking) => (
            <span key={booking.id} style={{ flexGrow: booking.service.minutes }}>
              {booking.dog}
            </span>
          ))}
          <span className="daybar__free" style={{ flexGrow: left }} />
        </div>
        <p className="widget__stat">
          <span>
            {used} / {DAY_MINUTES} min
          </span>
          <span>{left} left</span>
          <span>{bookings.length} booked</span>
        </p>
      </div>

      <form className="widget__panel booking__form" onSubmit={book}>
        <div className="booking__fields">
          <label>
            Client
            <select value={client?.id} onChange={(event) => selectClient(event.target.value)}>
              {clients.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Dog
            <select value={dog} onChange={(event) => setDog(event.target.value)}>
              {client?.dogs.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Service
            <select value={service?.id} onChange={(event) => setServiceId(event.target.value)}>
              {services.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.minutes} min
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="btn" type="submit">
          Book appointment
        </button>
      </form>

      <p className="widget__status" role="status">
        {note}
      </p>
    </div>
  );
}
