import { Container } from "@/components/ui/container";
import { SelectedTaskProvider } from "@/context/use-selected-task-context";

const BacklogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="h-full">
      <main className="w-full">
        <SelectedTaskProvider>{children}</SelectedTaskProvider>
      </main>
    </Container>
  );
};

export default BacklogLayout;
