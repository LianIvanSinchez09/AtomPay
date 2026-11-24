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
import { tr } from "../i18n/translate";

/**
 * Categorías base del producto. Son globales: no se crean ni se borran
 * desde la app, y el escaneo también las crea si faltan en la base.
 */
export const serviceCategories: ServiceCategory[] = [
  {
    name: "Luz",
    description: tr("Facturas de electricidad y consumo energético"),
    icon: Zap,
  },
  {
    name: "Gas",
    description: tr("Facturas de gas y consumo"),
    icon: Flame,
  },
  {
    name: "Agua",
    description: tr("Facturas y consumo de agua"),
    icon: Droplets,
  },
  {
    name: "Internet",
    description: tr("Internet, telefonía y conectividad"),
    icon: Wifi,
  },
  {
    name: "Multimedia",
    description: tr("Streaming, plataformas y suscripciones"),
    icon: Tv,
  },
  {
    name: "Compras",
    description: tr("Compras y pedidos online"),
    icon: ShoppingBag,
  },
  {
    name: "Pagos",
    description: tr("Transferencias, débitos y pagos con cualquier medio"),
    icon: ArrowLeftRight,
  },
  {
    name: "Otros",
    description: tr("Otros servicios y facturas detectados"),
    icon: CircleDollarSign,
  },
];
