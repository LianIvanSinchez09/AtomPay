import React from 'react'
import { motion } from "motion/react";
import NavDropdown from '../NavDropdown';
import { Settings2 } from 'lucide-react';


const SortBy = ({ items }) => {
  return (
    <>
      <NavDropdown
        label = {"Ordenar por"}
        icon = {Settings2}
        items = {[]}
        mode = {"SortBy"}
      >
        Filtrar
      </NavDropdown>
    </>
  )
}

export default FilterBy
