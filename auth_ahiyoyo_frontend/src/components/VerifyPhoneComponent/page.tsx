'use client';

import { useState } from "react";
import Image from 'next/image';
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { verifyPhone } from './actions';

export interface Country {
  name: string;
  code: string;
  dial: string;
  flagUrl: string;
}

export const countries: Country[] = [
  {
    name: 'Benin',
    code: 'BJ',
    dial: '+229',
    flagUrl: 'https://flagcdn.com/w40/bj.png',
  },
  {
    name: "Côte d'Ivoire",
    code: 'CI',
    dial: '+225',
    flagUrl: 'https://flagcdn.com/w40/ci.png',
  },
  {
    name: 'Togo',
    code: 'TG',
    dial: '+228',
    flagUrl: 'https://flagcdn.com/w40/tg.png',
  },
  {
    name: 'Senegal',
    code: 'SN',
    dial: '+221',
    flagUrl: 'https://flagcdn.com/w40/sn.png',
  },
];

interface VerifyPhoneComponentProps {
  email: string;
  onSuccess: (data: { phone: string }) => void;
  initialPhone?: string;
}

export default function VerifyPhoneComponent({ 
  email, 
  onSuccess, 
  initialPhone = "" 
}: VerifyPhoneComponentProps) {
  const [phone, setPhone] = useState(initialPhone.replace(/^\+\d{3}/, '') || "");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccessMessage(false);
    setLoading(true);

    if (!phone || !selectedCountry) {
      setMessage("Tous les champs sont requis.");
      setLoading(false);
      return;
    }

    if (!/^[0-9]{6,15}$/.test(phone)) {
      setMessage("Numéro de téléphone invalide.");
      setLoading(false);
      return;
    }

    const fullPhone = selectedCountry.dial + phone;

    const res = await verifyPhone({
      phone: fullPhone,
      country: selectedCountry.name,
      email
    });

    setMessage(res.message);
    setIsSuccessMessage(res.success);
    setLoading(false);

    if (res.success) {
      onSuccess({ phone: fullPhone });
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Vérification de numéro de téléphone
        </h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
          Entrez votre numéro de téléphone pour recevoir un code de vérification.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden dark:border-neutral-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <Select.Root
            value={selectedCountry.code}
            onValueChange={(value) => {
              const country = countries.find((c) => c.code === value);
              if (country) setSelectedCountry(country);
            }}
          >
            <Select.Trigger
              className="flex items-center h-full px-3 py-4 focus:outline-none bg-gray-50 dark:bg-neutral-800 border-r border-gray-300 dark:border-neutral-700"
              aria-label="Sélectionner un pays"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={selectedCountry.flagUrl}
                  alt={selectedCountry.code}
                  width={20}
                  height={16}
                  className="w-5 h-4 object-cover rounded-sm"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedCountry.dial}
                </span>
              </div>
              <Select.Icon className="ml-2">
                <ChevronDownIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content
                position="popper"
                className="overflow-hidden bg-white rounded-md shadow-lg z-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"
                sideOffset={5}
              >
                <Select.Viewport className="p-1">
                  {countries.map((country) => (
                    <Select.Item
                      key={country.code}
                      value={country.code}
                      className="flex items-center gap-2 p-2 text-sm rounded outline-none cursor-default select-none hover:bg-gray-100 dark:hover:bg-neutral-700 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-neutral-700"
                    >
                      <Image
                        src={country.flagUrl}
                        alt={country.code}
                        width={20}
                        height={16}
                        className="w-5 h-4 object-cover rounded-sm"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {country.name}{' '}
                        <span className="text-gray-500 dark:text-gray-400">
                          {country.dial}
                        </span>
                      </span>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <input
            type="tel"
            id="phone-input"
            className="flex-1 p-4 text-sm outline-none bg-transparent border-0 focus:ring-0 focus:border-0 dark:text-white"
            placeholder="Entrez votre numéro"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {message && (
          <p
            className={`text-sm text-center ${
              isSuccessMessage 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className={`w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Envoi...' : 'Envoyer le code'}
        </button>
      </form>
    </div>
  );
}