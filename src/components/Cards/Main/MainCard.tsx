import { Card, CardFooter } from "@/components/ui/card";

interface Props {
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode | JSX.Element | string;
}
export default function MainCard({ onClick, Icon, children }: Props) {
  return (
    <Card
      onClick={onClick}
      className="w-full lg:w-4/12 h-3/6 flex flex-col items-center justify-center hover:bg-slate-100"
    >
      <Icon className="size-4 md:size-10 w-4/6 md:w-full h-1/6 md:h-3/6  p-2 md:p-30" />
      <CardFooter className="w-full text-center">
        <h3 className="text-md sm:text-xl md:text-2xl w-full font-bold select-none">
          {children}
        </h3>
      </CardFooter>
    </Card>
  );
}
