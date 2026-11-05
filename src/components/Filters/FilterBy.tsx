import React from 'react'
import { motion } from "motion/react";

const FilterBy = ({ text }) => {
  return (
    <motion.button>
      {text}
    </motion.button>
  )
}

export default FilterBy
