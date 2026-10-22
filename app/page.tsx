import { Hero } from "@/components/home/Hero";
import { Monde } from "@/components/home/Monde";
import { Creations } from "@/components/home/Creations";
import { Saisons } from "@/components/home/Saisons";
import { Histoire } from "@/components/home/Histoire";
import { Usages } from "@/components/home/Usages";
import { Selection } from "@/components/home/Selection";
import { Poudres } from "@/components/home/Poudres";
import { ProTeaser } from "@/components/home/ProTeaser";

export default function Accueil() {
  return (
    <>
      <Hero />
      {/* le reste de la page glisse par-dessus le hero */}
      <div className="relative z-10">
        <Monde />
        <Creations />
        <Saisons />
        <Histoire />
        <Usages />
        <Selection />
        <Poudres />
        <ProTeaser />
      </div>
    </>
  );
}
