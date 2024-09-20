import { Container } from "@/components/ui/container";
import { SelectedTaskProvider } from "@/context/use-selected-task-context";

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="h-full">
      <main className="w-full">
        <SelectedTaskProvider>{children}</SelectedTaskProvider>
      </main>
    </Container>
  );
};

export default BoardLayout;
