import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectScrollable() {
  return (
    <Select name="cityDrop" id="cityDrop" onValueChange={(e) => setCity(e)}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select the city" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>City</SelectLabel>
          <SelectItem value="amstelveen">Amstelveen</SelectItem>
          <SelectItem value="amsterdam">Amsterdam</SelectItem>
          <SelectItem value="arnhem">Arnhem</SelectItem>
          <SelectItem value="breda">Breda</SelectItem>
          <SelectItem value="delft">Delft</SelectItem>
          <SelectItem value="den-haag">The Hague (Den Haag)</SelectItem>
          <SelectItem value="diemen">Diemen</SelectItem>
          <SelectItem value="eindhoven">Eindhoven</SelectItem>
          <SelectItem value="groningen">Groningen</SelectItem>
          <SelectItem value="haarlem">Haarlem</SelectItem>
          <SelectItem value="leiden">Leiden</SelectItem>
          <SelectItem value="maastricht">Maastricht</SelectItem>
          <SelectItem value="rotterdam">Rotterdam</SelectItem>
          <SelectItem value="tilburg">Tilburg</SelectItem>
          <SelectItem value="utrecht">Utrecht</SelectItem>        
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
