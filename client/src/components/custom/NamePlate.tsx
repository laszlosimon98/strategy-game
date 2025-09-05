import { Badge } from "@/components/ui/badge";

interface NamePlateProps {
  name: string;
}

const NamePlate = ({ name }: NamePlateProps) => {
  return (
    <Badge className="w-40 h-12 text-xl font-bold px-4 py-2 ">{name}</Badge>
  );
};

export default NamePlate;
