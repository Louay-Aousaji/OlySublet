import { useMemo, useState } from 'react';

function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-slate-100 text-slate-700',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-rose-50 text-rose-700',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Card({ children, className = '' }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
      {text && <p className="mt-4 leading-7 text-slate-600">{text}</p>}
    </div>
  );
}

const sampleListings = [
  {
    id: 'OLY-201',
    title: 'Bright Einzelapartement in Bungalow',
    section: 'Bungalow',
    roomType: 'Einzelapartement',
    pricingType: 'Per month',
    price: '€520 / month',
    dates: 'Apr 1 – Jul 15',
    size: '17 m²',
    verified: true,
    contractStatus: 'Contract verified',
    landlord: 'Sara M.',
    photoLabel: 'Bungalow room photo',
    furnished: 'Furnished',
    description:
      'Bright student apartment with desk, bed, wardrobe, and a quiet atmosphere. Suitable for a short semester stay in Olympiadorf.',
    included: ['Desk', 'Bed', 'Wardrobe', 'Wi-Fi', 'Kitchenette'],
  },
  {
    id: 'OLY-114',
    title: 'Short stay apartment in Hochhaus A',
    section: 'Hochhaus A',
    roomType: 'Einzelapartement',
    pricingType: 'Per night',
    price: '€24 / night',
    dates: 'May 10 – Jun 8',
    size: '15 m²',
    verified: true,
    contractStatus: 'Contract verified',
    landlord: 'Jonas K.',
    photoLabel: 'Hochhaus A room photo',
    furnished: 'Furnished',
    description:
      'A practical short-stay apartment for students who need a clean and simple place near the U-Bahn and university connections.',
    included: ['Bed', 'Wardrobe', 'Wi-Fi', 'Shelf'],
  },
  {
    id: 'OLY-332',
    title: 'Calm Einzelapartement in Hochhaus B',
    section: 'Hochhaus B',
    roomType: 'Einzelapartement',
    pricingType: 'Per month',
    price: '€540 / month',
    dates: 'Jun 1 – Sep 1',
    size: '18 m²',
    verified: true,
    contractStatus: 'Contract verified',
    landlord: 'Lea T.',
    photoLabel: 'Hochhaus B room photo',
    furnished: 'Furnished',
    description:
      'Quiet apartment with good daylight and enough space for a focused semester period in Olydorf.',
    included: ['Desk', 'Bed', 'Wardrobe', 'Wi-Fi', 'Lamp'],
  },
  {
    id: 'OLY-021',
    title: 'WG room close to U-Bahn',
    section: 'WG',
    roomType: 'WG room',
    pricingType: 'Per night',
    price: '€19 / night',
    dates: 'Jul 1 – Aug 15',
    size: '13 m²',
    verified: false,
    contractStatus: 'Pending review',
    landlord: 'Adam R.',
    photoLabel: 'WG room photo',
    furnished: 'Partly furnished',
    description:
      'Compact WG room for a shorter stay with fast access to Olympiazentrum and shared flat living.',
    included: ['Bed', 'Wi-Fi', 'Shared kitchen'],
  },
];

function BrowseListingsPage({ listings, onOpenDetails }) {
  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Browse listings"
        title="Find student rooms by section, dates, and price model"
        text="Students can browse verified listings across Bungalow, Hochhaus A, Hochhaus B, and WGs, with filters that match how Olydorf housing really works."
      />

      <Card className="p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500 outline-none focus:border-blue-500">
            <option>Section</option>
            <option>Bungalow</option>
            <option>Hochhaus A</option>
            <option>Hochhaus B</option>
            <option>WG</option>
          </select>
          <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500 outline-none focus:border-blue-500">
            <option>Pricing type</option>
            <option>Per month</option>
            <option>Per night</option>
          </select>
          <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Move-in date" />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Move-out date" />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Max budget" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Search listings</button>
          <button className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600">Show verified only</button>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <div className="grid gap-0 md:grid-cols-[220px_1fr]">
              <div className="relative flex min-h-[190px] items-center justify-center bg-slate-200 text-sm text-slate-500">
                {listing.photoLabel}
                <div className="absolute left-3 top-3">
                  <Badge tone={listing.verified ? 'green' : 'amber'}>{listing.contractStatus}</Badge>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{listing.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{listing.dates}</p>
                  </div>
                  <Badge tone="blue">{listing.pricingType}</Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{listing.section}</Badge>
                  <Badge>{listing.roomType}</Badge>
                  <Badge>{listing.size}</Badge>
                  <Badge>{listing.price}</Badge>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">Listing ID: {listing.id}</p>
                    <p className="text-sm text-slate-500">Landlord: {listing.landlord}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600">Save</button>
                    <button
                      onClick={() => onOpenDetails(listing)}
                      className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      View details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PostRoomPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Post a room"
        title="Create a verified student listing"
        text="The posting flow is designed to reduce scams by combining university account verification with StuWerk contract review before a room goes live."
      />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-800">Listing title</label>
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Example: Bright Einzelapartement in Bungalow" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Olydorf section</label>
              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500 outline-none focus:border-blue-500">
                <option>Select section</option>
                <option>Bungalow</option>
                <option>Hochhaus A</option>
                <option>Hochhaus B</option>
                <option>WG</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Room type</label>
              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500 outline-none focus:border-blue-500">
                <option>Select type</option>
                <option>Einzelapartement</option>
                <option>WG room</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Pricing model</label>
              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500 outline-none focus:border-blue-500">
                <option>Select pricing</option>
                <option>Per month</option>
                <option>Per night</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Price</label>
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="€520" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Available from</label>
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Apr 1, 2026" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Available until</label>
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Jul 15, 2026" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Room size</label>
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="17 m²" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-800">Room description</label>
              <textarea className="min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Write a clear description for other students..." />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-800">Upload room photos</label>
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                Drop room photos here or click to upload
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-800">Upload StuWerk rent contract</label>
              <div className="rounded-3xl border border-dashed border-blue-300 bg-blue-50 px-5 py-8 text-center text-sm text-blue-700">
                Upload the current Studentenwerk rent contract for verification before publishing
              </div>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Submit for verification</button>
              <button className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600">Save draft</button>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="text-lg font-semibold text-slate-900">Before publishing</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <p>1. The student must verify their university email.</p>
              <p>2. The StuWerk rent contract must be uploaded and reviewed.</p>
              <p>3. The room should include real photos, dates, and a clear pricing model.</p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-lg font-semibold text-slate-900">Privacy reminder</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Sensitive contract data should stay private in the admin review area and should never appear publicly on the listing page.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ListingDetailsPage({ listing, onBackToBrowse, onOpenChat }) {
  const currentListing = listing || sampleListings[0];

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Listing details"
        title="A clear room page that feels safe and student-friendly"
        text="The details page helps students decide quickly with visible trust signals, exact availability, and a direct path to the built-in chat."
      />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="flex min-h-64 items-center justify-center bg-slate-200 text-sm text-slate-500">{currentListing.photoLabel}</div>
              <div className="grid grid-cols-2 gap-px bg-slate-300">
                <div className="flex min-h-32 items-center justify-center bg-slate-100 text-sm text-slate-500">Photo 2</div>
                <div className="flex min-h-32 items-center justify-center bg-slate-100 text-sm text-slate-500">Photo 3</div>
                <div className="flex min-h-32 items-center justify-center bg-slate-100 text-sm text-slate-500">Photo 4</div>
                <div className="flex min-h-32 items-center justify-center bg-slate-100 text-sm text-slate-500">Photo 5</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{currentListing.title}</h3>
                <p className="mt-2 text-slate-600">Olympiadorf • {currentListing.section} • {currentListing.size}</p>
              </div>
              <Badge tone={currentListing.verified ? 'green' : 'amber'}>{currentListing.contractStatus}</Badge>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="blue">{currentListing.pricingType}</Badge>
              <Badge>{currentListing.price}</Badge>
              <Badge>{currentListing.dates}</Badge>
              <Badge>{currentListing.furnished}</Badge>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">About this room</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">{currentListing.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Included</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentListing.included.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900">Student landlord</h3>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{currentListing.landlord}</p>
              <p className="mt-1">Verified student account</p>
              <p className="mt-1">Listing ID: {currentListing.id}</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The potential tenant can contact the landlord through the built-in chat without leaving OlySublet.
            </p>
            <div className="mt-5 space-y-3">
              <button
                onClick={() => onOpenChat(currentListing)}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Open built-in chat
              </button>
              <button
                onClick={onBackToBrowse}
                className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600"
              >
                Back to listings
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900">Trust signals</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <p>• University email verified</p>
              <p>• StuWerk contract checked by admin</p>
              <p>• Section and pricing model clearly shown</p>
              <p>• Exact availability dates visible before starting the chat</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ChatPage({ listing, onBackToDetails }) {
  const currentListing = listing || sampleListings[0];

  const messages = [
    {
      sender: currentListing.landlord,
      time: '10:12',
      text: 'Hi, yes, the room is still available for the listed dates.',
      fromLandlord: true,
    },
    {
      sender: 'You',
      time: '10:15',
      text: 'Great, I am interested in renting it for the full period. Is the move-in date flexible?',
      fromLandlord: false,
    },
    {
      sender: currentListing.landlord,
      time: '10:17',
      text: 'A little bit, yes. We can discuss the exact day here in the chat.',
      fromLandlord: true,
    },
  ];

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Built-in chat"
        title="Student-to-student contact inside OlySublet"
        text="Potential tenants can contact the landlord directly from the listing page instead of switching to WhatsApp or Facebook groups."
      />

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900">Conversation details</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Listing</p>
              <p className="mt-1">{currentListing.title}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Landlord</p>
              <p className="mt-1">{currentListing.landlord}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Section and price</p>
              <p className="mt-1">{currentListing.section} • {currentListing.price}</p>
            </div>
            <button
              onClick={onBackToDetails}
              className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600"
            >
              Back to details
            </button>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Chat with {currentListing.landlord}</h3>
          </div>
          <div className="space-y-4 bg-slate-50 px-6 py-6">
            {messages.map((message, index) => (
              <div key={`${message.time}-${index}`} className={`flex ${message.fromLandlord ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-md rounded-3xl px-4 py-3 text-sm shadow-sm ${message.fromLandlord ? 'bg-white text-slate-700' : 'bg-blue-600 text-white'}`}>
                  <p className="font-semibold">{message.sender}</p>
                  <p className="mt-1 leading-6">{message.text}</p>
                  <p className={`mt-2 text-xs ${message.fromLandlord ? 'text-slate-400' : 'text-blue-100'}`}>{message.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 bg-white px-6 py-4">
            <div className="flex gap-3">
              <input className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Write your message to the landlord..." />
              <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Send</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdminVerificationDashboard() {
  const reviews = [
    {
      student: 'Amira K.',
      section: 'Hochhaus A',
      roomType: 'Einzelapartement',
      price: '€24 / night',
      status: 'Pending review',
    },
    {
      student: 'Jonas M.',
      section: 'Bungalow',
      roomType: 'Einzelapartement',
      price: '€510 / month',
      status: 'Approved',
    },
    {
      student: 'Lea R.',
      section: 'WG',
      roomType: 'WG room',
      price: '€18 / night',
      status: 'Needs follow-up',
    },
  ];

  const statusTone = (status) => {
    if (status === 'Approved') return 'green';
    if (status === 'Needs follow-up') return 'red';
    return 'amber';
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Admin dashboard"
        title="Review contracts before listings go live"
        text="This dashboard helps the platform team verify whether the uploader appears to be the real StuWerk tenant and whether the listing can receive a contract-verified badge."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Pending reviews</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">12</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Approved today</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">8</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Need follow-up</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">3</p>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Contract review queue</h3>
          </div>
          <div className="divide-y divide-slate-200">
            {reviews.map((review) => (
              <div key={`${review.student}-${review.section}`} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{review.student}</p>
                  <p className="mt-1 text-sm text-slate-600">{review.section} • {review.roomType} • {review.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={statusTone(review.status)}>{review.status}</Badge>
                  <button className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600">Open review</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900">Review panel</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Uploaded contract preview</p>
              <div className="mt-3 flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                Private contract document preview
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Checks</p>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p>• Name matches account</p>
                  <p>• Section appears correct</p>
                  <p>• Contract looks current</p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Decision notes</p>
                <textarea className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500" placeholder="Add internal admin notes..." />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Approve listing</button>
              <button className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700">Request more info</button>
              <button className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600">Reject</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function OlyStudentSubletFrontend() {
  const pages = useMemo(
    () => [
      { id: 'browse', label: 'Browse Listings' },
      { id: 'post', label: 'Post a Room' },
      { id: 'details', label: 'Listing Details' },
      { id: 'chat', label: 'Built-in Chat' },
      { id: 'admin', label: 'Admin Dashboard' },
    ],
    []
  );

  const [activePage, setActivePage] = useState('browse');
  const [selectedListing, setSelectedListing] = useState(sampleListings[0]);

  const openDetails = (listing) => {
    setSelectedListing(listing);
    setActivePage('details');
  };

  const openChat = (listing) => {
    setSelectedListing(listing);
    setActivePage('chat');
  };

  const renderPage = () => {
    if (activePage === 'post') return <PostRoomPage />;
    if (activePage === 'details') {
      return <ListingDetailsPage listing={selectedListing} onBackToBrowse={() => setActivePage('browse')} onOpenChat={openChat} />;
    }
    if (activePage === 'chat') {
      return <ChatPage listing={selectedListing} onBackToDetails={() => setActivePage('details')} />;
    }
    if (activePage === 'admin') return <AdminVerificationDashboard />;
    return <BrowseListingsPage listings={sampleListings} onOpenDetails={openDetails} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 text-white shadow-lg shadow-blue-200">
              <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 30C14 21.1634 21.1634 14 30 14H34C42.8366 14 50 21.1634 50 30V34C50 42.8366 42.8366 50 34 50H30C21.1634 50 14 42.8366 14 34V30Z" fill="white" fillOpacity="0.18" />
                <path d="M22 32C22 26.4772 26.4772 22 32 22C37.5228 22 42 26.4772 42 32C42 37.5228 37.5228 42 32 42C26.4772 42 22 37.5228 22 32Z" stroke="white" strokeWidth="4" />
                <path d="M46 46L54 54" stroke="white" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold">OlySublet</p>
              <p className="text-sm text-slate-500">Verified student sublets in Olympiadorf</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {pages.map((page) => {
              const active = activePage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => setActivePage(page.id)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-slate-300 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  {page.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">{renderPage()}</main>
    </div>
  );
}
