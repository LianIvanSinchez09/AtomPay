import React from 'react'
import { motion } from "motion/react";
import FilterDropdown from './FilterSortDropdown';
import { Settings2 } from 'lucide-react';


const FilterBy = ({ items }) => {
  return (
    <>
    <FilterDropdown
      label = {"Filtrar por"}
      icon = {Settings2}
      items = {[]}
      mode = {"Filter"}
    >
      Filtrar
    </FilterDropdown>
    </>
  )
}

export default FilterBy
