import { Badge } from "@/components/ui/badge";

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <Badge className="w-48 h-16 text-2xl font-bold px-4 py-2 ">{title}</Badge>
  );
};

export default PageTitle;
