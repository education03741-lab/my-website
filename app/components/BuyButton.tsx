"use client";

import { useState } from "react";

interface BuyButtonProps {
  buyLink: string;
  productTitle: string;
}

export default function BuyButton({ buyLink, productTitle }: BuyButtonProps) {
  const [showMessage, setShowMessage] = useState(false);

  const isAvailable = buyLink && buyLink !== "#";

  if (isAvailable) {
    return (
      <a href={buyLink} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block rounded-full bg-pink-600 px-8 py-4 font-semibold text-white transition hover:bg-pink-700">
        Buy Now
      </a>
    );
  }

  return (
    <div className="mt-8">
      <button onClick={() => setShowMessage(true)} className="inline-block rounded-full bg-pink-600 px-8 py-4 font-semibold text-white transition hover:bg-pink-700">
        Buy Now
      </button>

      {showMessage && (
        <p className="mt-3 text-sm text-gray-500">
          {productTitle} is not available for purchase just yet, check back soon.
        </p>
      )}
    </div>
  );
}