"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const cities = [
  { value: "amstelveen", label: "Amstelveen" },
  { value: "amsterdam", label: "Amsterdam" },
  { value: "arnhem", label: "Arnhem" },
  { value: "breda", label: "Breda" },
  { value: "delft", label: "Delft" },
  { value: "den-haag", label: "The Hague" },
  { value: "diemen", label: "Diemen" },
  { value: "eindhoven", label: "Eindhoven" },
  { value: "groningen", label: "Groningen" },
  { value: "haarlem", label: "Haarlem" },
  { value: "leiden", label: "Leiden" },
  { value: "maastricht", label: "Maastricht" },
  { value: "rotterdam", label: "Rotterdam" },
  { value: "tilburg", label: "Tilburg" },
  { value: "utrecht", label: "Utrecht" },
];

export function ComboboxCity({ selectedCity, onCityChange }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-40 px-3 max-w-44 text-md font-normal justify-between hover:bg-inherit focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {selectedCity
            ? cities.find((city) => city.value === selectedCity)?.label
            : "City"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.value}
                  value={city.value}
                  onSelect={(currentValue) => {
                    onCityChange(currentValue); // Update city via prop callback
                    setOpen(false); // Close the dropdown
                  }}
                >
                  {city.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedCity === city.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
