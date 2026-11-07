import ualaLogo from "../../assets/providers/uala-logo-provider.webp";
import mercadoPagoLogo from "../../assets/providers/mercadopago-logo-provider.webp";
import spotifyLogo from "../../assets/providers/spotifyLogo.webp";
import mercadoLibreLogo from "../../assets/providers/mercadoLibreLogo.png";

const logos: Record<string, string> = {
  Uala: ualaLogo,
  "Mercado Pago": mercadoPagoLogo,
  Spotify: spotifyLogo,
  "Mercado Libre": mercadoLibreLogo,
};

type Props = { provider?: string | null };

const ProviderImg = ({ provider }: Props) => {
  const name = provider?.trim() || "?";
  const logo = provider ? logos[provider] : undefined;

  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className="h-6 w-6 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4D869C] text-xs font-semibold text-white"
      title={name}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
};

export default ProviderImg;
