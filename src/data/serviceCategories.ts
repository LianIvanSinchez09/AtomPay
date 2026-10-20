import {
  ArrowLeftRight,
  CircleDollarSign,
  Droplets,
  Flame,
  ShoppingBag,
  Tv,
  Wifi,
  Zap,
} from "lucide-react";

import type { ServiceCategory } from "../types/types";

/**
 * Categorías base del producto. Son globales: no se crean ni se borran
 * desde la app, y el escaneo también las crea si faltan en la base.
 */
export const serviceCategories: ServiceCategory[] = [
  {
    name: "Luz",
    description: "Facturas de electricidad y consumo energético",
    icon: Zap,
  },
  {
    name: "Gas",
    description: "Facturas de gas y consumo",
    icon: Flame,
  },
  {
    name: "Agua",
    description: "Facturas y consumo de agua",
    icon: Droplets,
  },
  {
    name: "Internet",
    description: "Internet, telefonía y conectividad",
    icon: Wifi,
  },
  {
    name: "Multimedia",
    description: "Streaming, plataformas y suscripciones",
    icon: Tv,
  },
  {
    name: "Compras",
    description: "Compras y pedidos online",
    icon: ShoppingBag,
  },
  {
    name: "Pagos",
    description: "Transferencias, débitos y pagos con cualquier medio",
    icon: ArrowLeftRight,
  },
  {
    name: "Otros",
    description: "Otros servicios y facturas detectados",
    icon: CircleDollarSign,
  },
];
